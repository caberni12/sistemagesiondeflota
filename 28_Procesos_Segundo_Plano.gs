/**
 * COLA DE PROCESOS SECUNDARIOS
 * Libera la respuesta principal y ejecuta historial, auditoría, alertas y notificaciones mediante activador temporal.
 */
const COLA_SEGUNDO_PLANO_INDICE_ = 'FLOTAS_COLA_SEGUNDO_PLANO_INDICE_V1';
const COLA_SEGUNDO_PLANO_TRIGGER_ = 'FLOTAS_COLA_SEGUNDO_PLANO_TRIGGER_V1';
const COLA_SEGUNDO_PLANO_PREFIJO_ = 'FLOTAS_TRABAJO_SEGUNDO_PLANO_';

function resumenUsuarioSegundoPlano_(user) {
  return { ID:String(user && user.ID || ''), NOMBRE:String(user && user.NOMBRE || ''), CORREO:String(user && user.CORREO || ''), ROL_ID:String(user && user.ROL_ID || '') };
}

function encolarTrabajoSegundoPlano_(tipo, datos) {
  const properties = PropertiesService.getScriptProperties();
  const lock = LockService.getScriptLock();
  const jobId = Utilities.getUuid();
  const jobData = datos || {};
  const job = { id:jobId, tipo:String(tipo || ''), datos:jobData, intentos:Number(jobData.__intentos || 0), creadoEn:fechaIso_() };
  try {
    lock.waitLock(5000);
    let ids = [];
    try { ids = JSON.parse(properties.getProperty(COLA_SEGUNDO_PLANO_INDICE_) || '[]'); } catch (error) { ids = []; }
    properties.setProperty(COLA_SEGUNDO_PLANO_PREFIJO_ + jobId, JSON.stringify(job));
    ids.push(jobId);
    properties.setProperty(COLA_SEGUNDO_PLANO_INDICE_, JSON.stringify(ids.slice(-250)));
    if (properties.getProperty(COLA_SEGUNDO_PLANO_TRIGGER_) !== 'SI') {
      properties.setProperty(COLA_SEGUNDO_PLANO_TRIGGER_, 'SI');
      ScriptApp.newTrigger('procesarColaSegundoPlano_').timeBased().after(1000).create();
    }
    return jobId;
  } catch (error) {
    console.error('No se pudo encolar proceso secundario', error);
    try {
      properties.deleteProperty(COLA_SEGUNDO_PLANO_PREFIJO_ + jobId);
      let ids = JSON.parse(properties.getProperty(COLA_SEGUNDO_PLANO_INDICE_) || '[]');
      properties.setProperty(COLA_SEGUNDO_PLANO_INDICE_, JSON.stringify(ids.filter(function(id) { return id !== jobId; })));
      properties.deleteProperty(COLA_SEGUNDO_PLANO_TRIGGER_);
    } catch (_) {}
    try { procesarTrabajoSegundoPlano_(job); } catch (fallbackError) { console.error(fallbackError); }
    return '';
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function procesarColaSegundoPlano_() {
  const properties = PropertiesService.getScriptProperties();
  const lock = LockService.getScriptLock();
  let jobs = [];
  try {
    lock.waitLock(5000);
    let ids = [];
    try { ids = JSON.parse(properties.getProperty(COLA_SEGUNDO_PLANO_INDICE_) || '[]'); } catch (error) { ids = []; }
    const processing = ids.splice(0, 8);
    properties.setProperty(COLA_SEGUNDO_PLANO_INDICE_, JSON.stringify(ids));
    properties.deleteProperty(COLA_SEGUNDO_PLANO_TRIGGER_);
    jobs = processing.map(function(id) {
      const raw = properties.getProperty(COLA_SEGUNDO_PLANO_PREFIJO_ + id);
      properties.deleteProperty(COLA_SEGUNDO_PLANO_PREFIJO_ + id);
      try { return raw ? JSON.parse(raw) : null; } catch (error) { return null; }
    }).filter(Boolean);
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }

  jobs.forEach(function(job) {
    try { procesarTrabajoSegundoPlano_(job); }
    catch (error) {
      console.error('Error en proceso secundario ' + job.tipo, error);
      job.intentos = Number(job.intentos || 0) + 1;
      if (job.intentos < 3) { job.datos.__intentos = job.intentos; encolarTrabajoSegundoPlano_(job.tipo, job.datos); }
    }
  });

  let pending = [];
  try { pending = JSON.parse(properties.getProperty(COLA_SEGUNDO_PLANO_INDICE_) || '[]'); } catch (error) { pending = []; }
  if (pending.length && properties.getProperty(COLA_SEGUNDO_PLANO_TRIGGER_) !== 'SI') {
    properties.setProperty(COLA_SEGUNDO_PLANO_TRIGGER_, 'SI');
    ScriptApp.newTrigger('procesarColaSegundoPlano_').timeBased().after(1000).create();
  }
}

function procesarTrabajoSegundoPlano_(job) {
  if (!job || !job.tipo) return;
  const data = job.datos || {};
  if (job.tipo === 'MOTOR_ALERTAS') { ejecutarMotorAlertasAutomaticas_({ force:true }); return; }
  if (job.tipo === 'INICIO_OPERACION') {
    insertarRegistro_('HISTORIAL', { OPERACION_ID:data.operacionId, EVENTO:'INICIO', DETALLE:data.detalle, FECHA_HORA:new Date(), USUARIO_ID:data.usuario && data.usuario.ID || '', ELIMINADO:'NO' }, 'HIS');
    registrarBitacora_(data.usuario || {}, 'INICIAR', 'OPERACIONES', data.operacionId, (data.patente || '') + ' / ' + (data.conductor || '') + ' / ubicación validada', data.ip || '');
    return;
  }
  if (job.tipo === 'CIERRE_RUTA') {
    const senderRoute = data.usuario || {};
    const senderIdentityRoute = (senderRoute.NOMBRE || senderRoute.ID || 'Usuario') + ' (' + (senderRoute.CORREO || 'sin correo') + ') · usuario ' + (senderRoute.ID || 'sin ID');
    const routeMessage = [
      'Enviado por: ' + senderIdentityRoute + '.',
      'Conductor: ' + ((data.conductor && (data.conductor.nombre || data.conductor.id)) || 'Sin conductor') + '.',
      'Vehículo: ' + ((data.vehiculo && (data.vehiculo.patente || data.vehiculo.id)) || 'Sin vehículo') + '.',
      'Ruta: ' + (data.nombreRuta || data.rutaId || 'Sin nombre') + ' (' + (data.rutaId || 'sin ID') + ').',
      'Recorrido: ' + (data.origen || 'Sin origen') + ' → ' + (data.destino || 'Sin destino') + '.',
      'Fecha y hora: ' + (data.fechaHora || fechaIso_()) + '.',
      data.finalizadaPorConductor ? 'La finalización fue ejecutada por una cuenta de Conductor.' : 'La finalización fue ejecutada por una cuenta administrativa.'
    ].join(' ');
    registrarBitacora_(senderRoute, 'FINALIZAR', 'RUTAS', data.rutaId || '', routeMessage, data.ip || '');
    notificarRolesInterno_(['ROL-ADMIN'], { TITULO:'Ruta finalizada: ' + (data.nombreRuta || data.rutaId || ''), MENSAJE:routeMessage, TIPO:'Ruta finalizada', PRIORIDAD:'Alta', RUTA_ID:data.rutaId || '', OPERACION_ID:data.operacionId || '', CREADO_POR:senderRoute.ID || '' });
    return;
  }
  if (job.tipo !== 'CIERRE_OPERACION') return;

  insertarRegistro_('HISTORIAL', { OPERACION_ID:data.operacionId, EVENTO:data.evento || 'FIN', DETALLE:data.detalle || '', FECHA_HORA:new Date(data.fechaHora || Date.now()), USUARIO_ID:data.usuario && data.usuario.ID || '', ELIMINADO:'NO' }, 'HIS');
  registrarBitacora_(data.usuario || {}, data.accionAuditoria || 'FINALIZAR', 'OPERACIONES', data.operacionId, data.detalle || '', data.ip || '');

  if (data.excepcional) {
    insertarRegistro_('ALERTAS', { TIPO:'Cierre excepcional', NIVEL:'Advertencia', TITULO:'Operación finalizada fuera de la base', MENSAJE:data.operacionId + ' fue cerrada por ' + (data.usuario && data.usuario.NOMBRE || data.usuario && data.usuario.ID || 'usuario') + ' a ' + data.distanciaMetros + ' m de la base. Motivo: ' + (data.motivo || ''), MODULO:'OPERACIONES', REGISTRO_ID:data.operacionId, LEIDA:'NO', USUARIO_ID:'', FECHA_HORA:new Date(), ELIMINADO:'NO' }, 'ALT');
  } else if (data.precisionBaja) {
    insertarRegistro_('ALERTAS', { TIPO:'GPS impreciso', NIVEL:'Advertencia', TITULO:'Cierre aceptado con baja precisión GPS', MENSAJE:data.operacionId + ' finalizó con precisión ±' + data.precisionMetros + ' m y distancia calculada ' + data.distanciaMetros + ' m.', MODULO:'OPERACIONES', REGISTRO_ID:data.operacionId, LEIDA:'NO', USUARIO_ID:'', FECHA_HORA:new Date(), ELIMINADO:'NO' }, 'ALT');
  }

  const sender = data.usuario || {};
  const senderIdentity = (sender.NOMBRE || sender.ID || 'Usuario') + ' (' + (sender.CORREO || 'sin correo') + ') · usuario ' + (sender.ID || 'sin ID');
  const message = [
    'Enviado por: ' + senderIdentity + '.',
    'Conductor: ' + ((data.conductor && data.conductor.nombre) || (data.conductor && data.conductor.id) || 'Sin conductor') + '.',
    'Vehículo: ' + ((data.vehiculo && data.vehiculo.patente) || (data.vehiculo && data.vehiculo.id) || 'Sin vehículo') + '.',
    'Ruta: ' + ((data.ruta && (data.ruta.nombre || data.ruta.id)) || 'Sin ruta asignada') + '.',
    'Fecha y hora: ' + (data.fechaHora || fechaIso_()) + '.',
    'Cierre: ' + (data.cierreTipo || 'Finalizada') + '.',
    'Base: ' + ((data.base && data.base.nombre) || 'Base operacional') + ' · ' + ((data.base && data.base.direccion) || 'sin dirección') + '.',
    'Distancia: ' + Number(data.distanciaMetros || 0) + ' m.',
    'Validación: ' + (data.validacion || 'VALIDADA') + '.',
    'Observaciones: ' + (data.observaciones || 'Sin observaciones') + '.'
  ].join(' ');
  notificarRolesInterno_(['ROL-ADMIN'], { TITULO:'Ruta/operación finalizada: ' + data.operacionId, MENSAJE:message, TIPO:'Operación finalizada', PRIORIDAD:data.excepcional || data.precisionBaja ? 'Alta' : 'Normal', RUTA_ID:data.rutaId || '', OPERACION_ID:data.operacionId, CREADO_POR:sender.ID || '' });
}
