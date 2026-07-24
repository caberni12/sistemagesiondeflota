/** Inspección preoperacional (check-in) de vehículos. */
function catalogoCheckinVehicular_() {
  return [
    { id:'documentacion', categoria:'Documentación', item:'Documentos obligatorios vigentes y disponibles', critico:true },
    { id:'luces', categoria:'Exterior', item:'Luces, intermitentes y señalización', critico:true },
    { id:'frenos', categoria:'Seguridad', item:'Frenos de servicio y estacionamiento', critico:true },
    { id:'direccion', categoria:'Seguridad', item:'Dirección sin juego, trabas ni ruidos anormales', critico:true },
    { id:'neumaticos', categoria:'Exterior', item:'Neumáticos, presión, desgaste y rueda de repuesto', critico:true },
    { id:'espejos_vidrios', categoria:'Exterior', item:'Espejos, parabrisas y vidrios con visibilidad segura', critico:true },
    { id:'cinturones', categoria:'Cabina', item:'Cinturones de seguridad y asientos', critico:true },
    { id:'bocina', categoria:'Cabina', item:'Bocina operativa', critico:false },
    { id:'limpiaparabrisas', categoria:'Cabina', item:'Limpiaparabrisas y líquido lavador', critico:false },
    { id:'aceite', categoria:'Motor y fluidos', item:'Nivel de aceite de motor', critico:true },
    { id:'refrigerante', categoria:'Motor y fluidos', item:'Nivel de refrigerante y temperatura normal', critico:true },
    { id:'fugas', categoria:'Motor y fluidos', item:'Ausencia de fugas de combustible, aceite o refrigerante', critico:true },
    { id:'extintor', categoria:'Emergencia', item:'Extintor vigente y accesible', critico:true },
    { id:'botiquin', categoria:'Emergencia', item:'Botiquín disponible', critico:false },
    { id:'herramientas', categoria:'Emergencia', item:'Gata, triángulos y herramientas básicas', critico:false },
    { id:'combustible', categoria:'Operación', item:'Combustible o carga suficiente para la ruta', critico:false },
  ];
}

function normalizarListaCheckin_(valor) {
  let recibidos = valor;
  if (typeof recibidos === 'string') {
    try { recibidos = JSON.parse(recibidos); }
    catch (error) { throw new Error('CHECKIN_LISTA_INVALIDA'); }
  }
  if (!Array.isArray(recibidos)) throw new Error('CHECKIN_LISTA_INVALIDA');

  const porId = {};
  recibidos.forEach(function(item) {
    if (item && item.id) porId[String(item.id)] = item;
  });

  return catalogoCheckinVehicular_().map(function(definicion) {
    const recibido = porId[definicion.id] || {};
    const respuesta = String(recibido.respuesta || '').toUpperCase();
    if (['OK','FALLA','NA'].indexOf(respuesta) < 0) {
      throw new Error('CHECKIN_ITEM_INCOMPLETO_' + definicion.id.toUpperCase());
    }
    const respuestaAjustada = definicion.critico && respuesta === 'NA' ? 'FALLA' : respuesta;
    return {
      id: definicion.id,
      categoria: definicion.categoria,
      item: definicion.item,
      critico: definicion.critico,
      respuesta: respuestaAjustada,
      observacion: String(recibido.observacion || '').trim().slice(0, 500),
    };
  });
}

function asegurarPersistenciaCheckin_() {
  ['CHECKINS','ALERTAS','BITACORA'].forEach(function(sheetName) {
    asegurarHoja_(sheetName);
  });
}

function buscarCheckinPorSolicitud_(solicitudClienteId, usuarioId) {
  if (!solicitudClienteId) return null;
  return listarRegistros_('CHECKINS', {}).find(function(row) {
    return String(row.SOLICITUD_CLIENTE_ID || '') === String(solicitudClienteId) &&
      String(row.CREADO_POR || '') === String(usuarioId || '');
  }) || null;
}

function repararModuloCheckin() {
  reiniciarCachesEjecucion_();
  asegurarPersistenciaCheckin_();
  SpreadsheetApp.flush();
  const sheet = obtenerHoja_('CHECKINS');
  return {
    ok:true,
    version:VERSION_APLICACION,
    hoja:sheet.getName(),
    filas:Math.max(0, sheet.getLastRow() - 1),
    columnas:sheet.getLastColumn(),
    message:'Módulo de check-in verificado y preparado para guardar registros.',
  };
}

function crearCheckinVehicular_(request, session) {
  exigirPermiso_(session.user, 'CHECKIN', 'CREAR');
  asegurarPersistenciaCheckin_();

  const data = Object.assign({}, request.datos || request || {});
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const propio = obtenerConductorDeUsuario_(session.user.ID);
    if (!propio) throw new Error('CONDUCTOR_NO_ASOCIADO');
    data.CONDUCTOR_ID = propio.ID;
  }
  validarRequeridos_(data, ['VEHICULO_ID','CONDUCTOR_ID','KILOMETRAJE','LISTA_CODIFICADA']);
  if (String(data.CONFIRMACION_CONDUCTOR || '') !== 'SI') throw new Error('CHECKIN_CONFIRMACION_REQUERIDA');

  const solicitudClienteId = String(data.SOLICITUD_CLIENTE_ID || '').trim().slice(0, 120);
  const existente = buscarCheckinPorSolicitud_(solicitudClienteId, session.user.ID);
  if (existente) {
    return ok_({
      row:limpiarSalidaRecurso_('CHECKINS', existente),
      catalogo:catalogoCheckinVehicular_(),
      persistenciaConfirmada:true,
      persistencia:'CENTRAL_CONFIRMADA',
      duplicadoEvitado:true,
      advertencias:[],
    });
  }

  const vehiculo = obtenerRegistro_('VEHICULOS', data.VEHICULO_ID);
  const conductor = obtenerRegistro_('CONDUCTORES', data.CONDUCTOR_ID);
  if (!vehiculo) throw new Error('VEHICULO_NO_ENCONTRADO');
  if (!conductor) throw new Error('CONDUCTOR_NO_ENCONTRADO');
  if (vehiculo.ESTADO !== 'Disponible') throw new Error('VEHICULO_NO_DISPONIBLE');
  if (conductor.ESTADO !== 'Disponible') throw new Error('CONDUCTOR_NO_DISPONIBLE');

  const lista = normalizarListaCheckin_(data.LISTA_CODIFICADA);
  const fallasCriticas = lista.filter(function(item) { return item.respuesta === 'FALLA' && item.critico; }).length;
  const fallasLeves = lista.filter(function(item) { return item.respuesta === 'FALLA' && !item.critico; }).length;
  const itemsOk = lista.filter(function(item) { return item.respuesta === 'OK'; }).length;
  const ahora = new Date();
  const vigenteHasta = new Date(ahora.getTime() + 12 * 60 * 60 * 1000);
  const estadoRevision = fallasCriticas > 0 ? 'Bloqueado' : (fallasLeves > 0 ? 'Pendiente' : 'Aprobado');
  const resultado = fallasCriticas > 0 ? 'Falla crítica' : (fallasLeves > 0 ? 'Con observaciones' : 'Conforme');

  const row = insertarRegistro_('CHECKINS', {
    VEHICULO_ID: vehiculo.ID,
    CONDUCTOR_ID: conductor.ID,
    OPERACION_ID: '',
    FECHA_HORA: ahora,
    KILOMETRAJE: Number(data.KILOMETRAJE || vehiculo.KILOMETRAJE || 0),
    NIVEL_COMBUSTIBLE: String(data.NIVEL_COMBUSTIBLE || 'No informado').slice(0, 40),
    LISTA_CODIFICADA: JSON.stringify(lista),
    TOTAL_ITEMS: lista.length,
    ITEMS_OK: itemsOk,
    FALLAS_LEVES: fallasLeves,
    FALLAS_CRITICAS: fallasCriticas,
    RESULTADO: resultado,
    ESTADO_REVISION: estadoRevision,
    OBSERVACIONES: String(data.OBSERVACIONES || '').slice(0, 1500),
    FIRMA_CONDUCTOR: String(data.FIRMA_CONDUCTOR || session.user.NOMBRE || conductor.NOMBRE).slice(0, 180),
    REVISADO_POR: estadoRevision === 'Aprobado' ? session.user.ID : '',
    FECHA_REVISION: estadoRevision === 'Aprobado' ? ahora : '',
    COMENTARIO_REVISION: estadoRevision === 'Aprobado' ? 'Aprobación automática sin fallas detectadas.' : '',
    VIGENTE_HASTA: vigenteHasta,
    UTILIZADO: 'NO',
    CREADO_POR: session.user.ID,
    ELIMINADO: 'NO',
    SOLICITUD_CLIENTE_ID: solicitudClienteId,
  }, 'CHK');

  SpreadsheetApp.flush();
  invalidarCacheHoja_('CHECKINS');
  const confirmado = obtenerRegistro_('CHECKINS', row.ID);
  if (!confirmado) throw new Error('CHECKIN_NO_CONFIRMADO_EN_BASE_CENTRAL');

  const advertencias = [];
  if (fallasCriticas > 0 || fallasLeves > 0) {
    try {
      const critica = fallasCriticas > 0;
      insertarRegistro_('ALERTAS', {
        TIPO:'Check-in vehicular',
        NIVEL: critica ? 'Crítica' : 'Advertencia',
        TITULO: critica ? 'Vehículo bloqueado por inspección' : 'Check-in pendiente de revisión',
        MENSAJE: vehiculo.PATENTE + ': ' + fallasCriticas + ' falla(s) crítica(s) y ' + fallasLeves + ' observación(es) leve(s).',
        MODULO:'CHECKIN',
        REGISTRO_ID:confirmado.ID,
        LEIDA:'NO',
        USUARIO_ID:'',
        FECHA_HORA:ahora,
        ELIMINADO:'NO',
      }, 'ALT');
    } catch (errorAlerta) {
      advertencias.push('ALERTA_NO_GENERADA');
      console.error(errorAlerta && errorAlerta.stack ? errorAlerta.stack : errorAlerta);
    }
  }

  try {
    registrarBitacora_(session.user, 'CREAR', 'CHECKIN', confirmado.ID, vehiculo.PATENTE + ' · ' + resultado);
  } catch (errorBitacora) {
    advertencias.push('BITACORA_NO_GENERADA');
    console.error(errorBitacora && errorBitacora.stack ? errorBitacora.stack : errorBitacora);
  }

  return ok_({
    row:limpiarSalidaRecurso_('CHECKINS', confirmado),
    catalogo:catalogoCheckinVehicular_(),
    persistenciaConfirmada:true,
    persistencia:'CENTRAL_CONFIRMADA',
    duplicadoEvitado:false,
    advertencias:advertencias,
  });
}

function revisarCheckinVehicular_(request, session) {
  exigirPermiso_(session.user, 'CHECKIN_APROBACIONES', 'ACTUALIZAR');
  const id = request.identificador || request.CHECKIN_ID || (request.datos && request.datos.CHECKIN_ID);
  const data = request.datos || request || {};
  const decision = String(data.DECISION || '').toUpperCase();
  if (['APROBAR','RECHAZAR'].indexOf(decision) < 0) throw new Error('CHECKIN_DECISION_INVALIDA');
  const checkin = obtenerRegistro_('CHECKINS', id);
  if (!checkin) throw new Error('CHECKIN_NO_ENCONTRADO');
  if (checkin.UTILIZADO === 'SI') throw new Error('CHECKIN_YA_UTILIZADO');
  if (decision === 'APROBAR' && Number(checkin.FALLAS_CRITICAS || 0) > 0) throw new Error('CHECKIN_CRITICO_NO_APROBABLE');

  const ahora = new Date();
  const nuevoEstado = decision === 'APROBAR' ? 'Aprobado' : 'Rechazado';
  const actualizado = actualizarRegistro_('CHECKINS', checkin.ID, {
    ESTADO_REVISION: nuevoEstado,
    REVISADO_POR: session.user.ID,
    FECHA_REVISION: ahora,
    COMENTARIO_REVISION: String(data.COMENTARIO_REVISION || '').slice(0, 1000),
    VIGENTE_HASTA: decision === 'APROBAR' ? new Date(ahora.getTime() + 12 * 60 * 60 * 1000) : checkin.VIGENTE_HASTA,
  });

  const conductor = obtenerRegistro_('CONDUCTORES', checkin.CONDUCTOR_ID);
  if (conductor && conductor.USUARIO_ID) {
    insertarRegistro_('NOTIFICACIONES', {
      DESTINATARIO_USUARIO_ID:conductor.USUARIO_ID,
      DESTINATARIO_CONDUCTOR_ID:conductor.ID,
      TITULO:'Check-in ' + nuevoEstado.toLowerCase(),
      MENSAJE:'La inspección ' + checkin.ID + ' fue ' + nuevoEstado.toLowerCase() + '. ' + String(data.COMENTARIO_REVISION || ''),
      TIPO:'Seguridad',
      PRIORIDAD: decision === 'APROBAR' ? 'Normal' : 'Alta',
      LEIDA:'NO',
      FECHA_ENVIO:ahora,
      CREADO_POR:session.user.ID,
      ELIMINADO:'NO',
    }, 'NOT');
  }

  registrarBitacora_(session.user, decision, 'CHECKIN_APROBACIONES', checkin.ID, String(data.COMENTARIO_REVISION || nuevoEstado));
  return ok_({ row: limpiarSalidaRecurso_('CHECKINS', actualizado) });
}

function checkinsDisponibles_(request, session) {
  exigirPermiso_(session.user, 'OPERACIONES', 'CREAR');
  const data = request.datos || request || {};
  let conductorId = String(data.CONDUCTOR_ID || '');
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const propio = obtenerConductorDeUsuario_(session.user.ID);
    if (!propio) throw new Error('CONDUCTOR_NO_ASOCIADO');
    conductorId = propio.ID;
  }
  const vehiculoId = String(data.VEHICULO_ID || '');
  const ahora = Date.now();
  let rows = listarRegistros_('CHECKINS', {}).filter(function(row) {
    const vigente = new Date(row.VIGENTE_HASTA || 0).getTime();
    return row.ESTADO_REVISION === 'Aprobado' && row.UTILIZADO !== 'SI' && vigente > ahora &&
      (!vehiculoId || row.VEHICULO_ID === vehiculoId) && (!conductorId || row.CONDUCTOR_ID === conductorId);
  });
  rows = filtrarPorUsuario_('CHECKINS', rows, session.user);
  rows.sort(function(a,b) { return new Date(b.FECHA_HORA || 0) - new Date(a.FECHA_HORA || 0); });
  return ok_({ rows:rows.slice(0, 50), total:rows.length });
}

function validarCheckinParaOperacion_(checkinId, vehiculoId, conductorId) {
  if (!checkinId) throw new Error('CHECKIN_REQUERIDO');
  const checkin = obtenerRegistro_('CHECKINS', checkinId);
  if (!checkin) throw new Error('CHECKIN_NO_ENCONTRADO');
  if (checkin.VEHICULO_ID !== vehiculoId || checkin.CONDUCTOR_ID !== conductorId) throw new Error('CHECKIN_NO_COINCIDE');
  if (checkin.ESTADO_REVISION !== 'Aprobado') throw new Error('CHECKIN_NO_APROBADO');
  if (checkin.UTILIZADO === 'SI') throw new Error('CHECKIN_YA_UTILIZADO');
  if (new Date(checkin.VIGENTE_HASTA || 0).getTime() <= Date.now()) throw new Error('CHECKIN_EXPIRADO');
  return checkin;
}

function consumirCheckinOperacion_(checkinId, operacionId) {
  return actualizarRegistro_('CHECKINS', checkinId, { OPERACION_ID:operacionId, UTILIZADO:'SI' });
}
