(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const api = window.ConexionFlotas;
  const config = window.CONFIGURACION_FLOTAS;
  const moduleConfig = window.MODULO_FLOTAS || Object.freeze({});
  const embeddedMode = Boolean(moduleConfig.incrustado);
  const initialSection = moduleConfig.seccion || 'dashboard';
  const defaultLogo = 'logo.svg';

  let currentUser = null;
  let currentCompany = null;
  let reconocimientoVoz = null;
  let vozEscuchando = false;
  let currentSection = initialSection;
  let mapaFlota = null;
  let ultimaUbicacionEnviada = null;
  let gpsRefreshTimer = null;
  let gpsRefreshPending = null;
  let gpsRefreshQueued = false;
  let gpsRefreshFailures = 0;
  let ultimoResumenGps = { locations:[], devices:[], trackingVehicles:[], totals:{} };
  let gpsSendPending = false;
  let gpsPendingPosition = null;
  let gpsLocationsPaintKey = '';
  let gpsDevicesPaintKey = '';
  let gpsTotalsPaintKey = '';
  let realtimeTimer = null;
  let heartbeatTimer = null;
  let notificationTimer = null;
  let gpsWatchId = null;
  let mediaStream = null;
  let barcodeDetector = null;
  let scanFrameId = null;
  let facingMode = 'environment';
  let batteryLevel = '';
  let lastAddressLookup = { key:'', address:'', time:0 };
  let lastAddressSearchAt = 0;
  let addressSearchQueue = Promise.resolve();
  const addressSearchCache = new Map();
  const cacheVistasModulo = new Map();
  const cacheListasFormulario = new Map();
  const cacheRegistros = new Map();
  const listasFormularioPendientes = new Map();
  let secuenciaNavegacion = 0;
  let secuenciaModal = 0;
  let precargaIniciada = false;
  let sincronizacionPendiente = null;
  let geolocationPermissionState = 'desconocido';
  let geolocationPermissionHandle = null;
  let wakeLock = null;
  let lastGpsErrorAt = 0;
  const trackingPreferenceKey = 'flotas_ubicacion_continua_v1';
  const gpsTrackingModeKey = 'flotas_seguimiento_modo_v1';
  const gpsSelectedVehiclesKey = 'flotas_seguimiento_vehiculos_v1';
  const checkinReceiptKey = 'flotas_ultimo_checkin_confirmado_v1';
  let gpsTrackingMode = localStorage.getItem(gpsTrackingModeKey) === 'specific' ? 'specific' : 'all';
  let gpsSelectedVehicles = (() => {
    try { return new Set(JSON.parse(localStorage.getItem(gpsSelectedVehiclesKey) || '[]').map(String)); }
    catch (_) { return new Set(); }
  })();
  let gpsDraftTrackingMode = gpsTrackingMode;
  let gpsDraftSelectedVehicles = new Set(gpsSelectedVehicles);
  const deviceId = (() => {
    const key='flotas_dispositivo_id_v1';let value=localStorage.getItem(key);
    if(!value){value=`DISP-${crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)}`;localStorage.setItem(key,value);}
    return value;
  })();
  const clientSessionId = (() => {
    const key='flotas_sesion_cliente_v1';let value=sessionStorage.getItem(key);
    if(!value){value=`SES-CLI-${crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)}`;sessionStorage.setItem(key,value);}
    return value;
  })();

  const navGroups = [
    ['GENERAL', [
      ['dashboard','⌂','Panel principal'], ['routes','➜','Rutas asignadas'], ['checkin','✓','Check-in vehicular'], ['operations','⇄','Operaciones'], ['gps','⌖','GPS en tiempo real'],
      ['notifications','🔔','Notificaciones']
    ]],
    ['GESTIÓN', [
      ['vehicles','▣','Vehículos'], ['drivers','♙','Conductores'], ['checkinApprovals','☑','Aprobar check-ins'], ['checkinHistory','▤','Historial de check-in'], ['maintenance','⚙','Mantenciones'],
      ['documents','▤','Documentos'], ['history','↻','Historial'], ['alerts','!','Alertas']
    ]],
    ['ADMINISTRACIÓN', [
      ['users','♚','Usuarios'], ['company','🏢','Empresa'], ['reports','▥','Reportes'], ['audit','☷','Auditoría'], ['settings','⚒','Configuración']
    ]]
  ];

  const resourceFields = {
    vehicles: {
      title:'Vehículo', eyebrow:'FLOTA', fields:[
        ['PATENTE','Patente','text',true],['MARCA','Marca','text',true],['MODELO','Modelo','text',true],['ANIO','Año','number',false],
        ['COLOR','Color','text',false],['COMBUSTIBLE','Combustible','select',['Diésel','Gasolina','Eléctrico','Híbrido','Gas']],
        ['VIN','VIN / chasis','text',false],['KILOMETRAJE','Kilometraje','number',false],
        ['ESTADO','Estado','select',['Disponible','En ruta','Mantención','Inactivo']],['PROXIMA_MANTENCION','Próxima mantención','date',false]
      ]
    },
    drivers: {
      title:'Conductor', eyebrow:'PERSONAL', fields:[
        ['NOMBRE','Nombre completo','text',true],['RUT','RUT','text',true],['TELEFONO','Teléfono','text',false],['CORREO','Correo','email',false],
        ['LICENCIA_CLASE','Clase de licencia','select',['A1','A2','A3','A4','A5','B','C','D','E','F']],
        ['LICENCIA_VENCIMIENTO','Vencimiento licencia','date',false],['ESTADO','Estado','select',['Disponible','En viaje','Licencia vencida','Inactivo']],
        ['USUARIO_ID','Usuario asociado','userSelect',false]
      ]
    },
    maintenance: {
      title:'Mantención', eyebrow:'TALLER', fields:[
        ['VEHICULO_ID','Vehículo','vehicleSelect',true],['TIPO','Tipo','select',['Preventiva','Correctiva','Inspección']],['TITULO','Trabajo','text',true],
        ['DESCRIPCION','Descripción','textarea',false],['FECHA_PROGRAMADA','Fecha programada','date',true],['FECHA_REALIZADA','Fecha realizada','date',false],
        ['KILOMETRAJE','Kilometraje','number',false],['COSTO','Costo','number',false],['ESTADO','Estado','select',['Programada','En proceso','Completada','Atrasada','Cancelada']],
        ['TALLER','Taller','text',false],['OBSERVACIONES','Observaciones','textarea',false]
      ]
    },
    documents: {
      title:'Documento', eyebrow:'DOCUMENTACIÓN', fields:[
        ['TIPO','Tipo','select',['SOAP','Revisión técnica','Permiso de circulación','Licencia de conducir','Certificado de gases','Seguro','Otro']],
        ['ASOCIADO_TIPO','Asociado a','select',['Vehículo','Conductor','Empresa']],['ASOCIADO_ID','ID asociado','text',false],['IDENTIFICACION','Patente o RUT','text',true],
        ['FECHA_EMISION','Fecha emisión','date',false],['FECHA_VENCIMIENTO','Fecha vencimiento','date',true],['ESTADO','Estado','select',['Vigente','Por vencer','Vencido','Anulado']],
        ['DIRECCION_ARCHIVO','URL de archivo en Drive','url',false],['OBSERVACIONES','Observaciones','textarea',false]
      ]
    },
    users: {
      title:'Usuario', eyebrow:'SEGURIDAD', fields:[
        ['NOMBRE','Nombre completo','text',true],['CORREO','Correo','email',true],['CONTRASENA','Contraseña','password',true],
        ['ROL_ID','Rol','select',[['ROL-ADMIN','Administrador'],['ROL-SUPERVISOR','Supervisor'],['ROL-CONDUCTOR','Conductor']]],
        ['ESTADO','Estado','select',['Activo','Inactivo','Bloqueado']],['TELEFONO','Teléfono','text',false]
      ]
    },
    alerts: {
      title:'Alerta', eyebrow:'NOTIFICACIÓN', fields:[
        ['TIPO','Tipo','text',true],['NIVEL','Nivel','select',['Info','Advertencia','Crítica']],['TITULO','Título','text',true],
        ['MENSAJE','Mensaje','textarea',true],['MODULO','Módulo','text',false],['REGISTRO_ID','ID relacionado','text',false],['LEIDA','Leída','select',['NO','SI']]
      ]
    }
  };

  const labels = {
    dashboard:'Panel principal',routes:'Rutas asignadas',vehicles:'Vehículos',drivers:'Conductores',checkin:'Check-in vehicular',checkinApprovals:'Aprobación de check-ins',checkinHistory:'Historial de check-in',operations:'Operaciones',gps:'GPS en tiempo real',maintenance:'Mantenciones',
    notifications:'Notificaciones',documents:'Documentos',history:'Historial',alerts:'Alertas',users:'Usuarios',reports:'Reportes',audit:'Auditoría',company:'Empresa',settings:'Configuración'
  };

  const navPermission = {
    dashboard:'PANEL_PRINCIPAL',routes:'RUTAS',checkin:'CHECKIN',checkinApprovals:'CHECKIN_APROBACIONES',checkinHistory:'CHECKIN',operations:'OPERACIONES',gps:'GPS',notifications:'NOTIFICACIONES',
    vehicles:'VEHICULOS',drivers:'CONDUCTORES',maintenance:'MANTENCIONES',documents:'DOCUMENTOS',history:'HISTORIAL',
    alerts:'ALERTAS',users:'USUARIOS',company:'CONFIGURACION',reports:'REPORTES',audit:'BITACORA',settings:'CONFIGURACION'
  };
  const resourcePermission={vehicles:'VEHICULOS',drivers:'CONDUCTORES',maintenance:'MANTENCIONES',documents:'DOCUMENTOS',alerts:'ALERTAS',users:'USUARIOS'};
  const permissionCatalog = Object.freeze([
    ['PANEL_PRINCIPAL','Panel principal'],['USUARIOS','Usuarios'],['VEHICULOS','Vehículos'],['CONDUCTORES','Conductores'],
    ['OPERACIONES','Operaciones'],['CHECKIN','Check-in'],['CHECKIN_APROBACIONES','Aprobar check-ins'],['GPS','Ubicación en tiempo real'],
    ['HISTORIAL','Historial'],['MANTENCIONES','Mantenciones'],['DOCUMENTOS','Documentos'],['ALERTAS','Alertas'],
    ['REPORTES','Reportes'],['BITACORA','Auditoría'],['CONFIGURACION','Configuración'],['QR','QR'],['RUTAS','Rutas'],
    ['NOTIFICACIONES','Notificaciones'],['CONEXIONES','Conexiones']
  ]);
  const permissionActions = Object.freeze([['LEER','Ver'],['CREAR','Crear'],['ACTUALIZAR','Editar'],['ELIMINAR','Eliminar']]);

  const checkinCatalog = Object.freeze([
    {id:'documentacion',categoria:'Documentación',item:'Documentos obligatorios vigentes y disponibles',critico:true},
    {id:'luces',categoria:'Exterior',item:'Luces, intermitentes y señalización',critico:true},
    {id:'frenos',categoria:'Seguridad',item:'Frenos de servicio y estacionamiento',critico:true},
    {id:'direccion',categoria:'Seguridad',item:'Dirección sin juego, trabas ni ruidos anormales',critico:true},
    {id:'neumaticos',categoria:'Exterior',item:'Neumáticos, presión, desgaste y rueda de repuesto',critico:true},
    {id:'espejos_vidrios',categoria:'Exterior',item:'Espejos, parabrisas y vidrios con visibilidad segura',critico:true},
    {id:'cinturones',categoria:'Cabina',item:'Cinturones de seguridad y asientos',critico:true},
    {id:'bocina',categoria:'Cabina',item:'Bocina operativa',critico:false},
    {id:'limpiaparabrisas',categoria:'Cabina',item:'Limpiaparabrisas y líquido lavador',critico:false},
    {id:'aceite',categoria:'Motor y fluidos',item:'Nivel de aceite de motor',critico:true},
    {id:'refrigerante',categoria:'Motor y fluidos',item:'Nivel de refrigerante y temperatura normal',critico:true},
    {id:'fugas',categoria:'Motor y fluidos',item:'Ausencia de fugas de combustible, aceite o refrigerante',critico:true},
    {id:'extintor',categoria:'Emergencia',item:'Extintor vigente y accesible',critico:true},
    {id:'botiquin',categoria:'Emergencia',item:'Botiquín disponible',critico:false},
    {id:'herramientas',categoria:'Emergencia',item:'Gata, triángulos y herramientas básicas',critico:false},
    {id:'combustible',categoria:'Operación',item:'Combustible o carga suficiente para la ruta',critico:false},
  ]);
  function hasPermission(module,action='LEER'){
    const permissions=currentUser?.PERMISOS||[];
    return currentUser?.ROL_ID==='ROL-ADMIN'||permissions.includes('*:*')||permissions.includes(`${module}:${action}`);
  }
  function postParent(message){
    if(!embeddedMode||window.parent===window)return;
    try{window.parent.postMessage(message,'*');}catch(_){}
  }
  function navigateSection(section){
    if(embeddedMode&&window.parent!==window){postParent({tipo:'flotas:navegar',seccion:section});return Promise.resolve(true);}
    return go(section);
  }

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const fmtDate = (value, time = false) => {
    if (!value) return '—';
    const date = new Date(value); if (Number.isNaN(date.getTime())) return esc(value);
    return new Intl.DateTimeFormat('es-CL', time ? { dateStyle:'short', timeStyle:'short' } : { dateStyle:'medium' }).format(date);
  };
  const number = value => new Intl.NumberFormat('es-CL').format(Number(value || 0));
  const initials = name => String(name || 'U').split(/\s+/).slice(0,2).map(part => part[0]).join('').toUpperCase();
  const statusClass = value => {
    const text = String(value || '').toLowerCase();
    if (/\b(inactivo|inactiva|desconectado|desconectada|bloqueado|bloqueada)\b|sin gps/.test(text)) return 'bad';
    if (/\b(disponible|activo|activa|vigente|finalizada|completada|conduciendo|conectado|conectada|aprobado|aprobada|conforme|sí|si)\b|en línea/.test(text)) return 'ok';
    if (/ruta|viaje|info|sesión administrativa/.test(text)) return 'info';
    if (/programada|proceso|por vencer|advertencia|mantención|pendiente|observaciones/.test(text)) return 'warn';
    return 'bad';
  };
  const status = value => `<span class="status ${statusClass(value)}">${esc(value || 'Sin estado')}</span>`;
  const heading = (tag, title, description, actions = '') => `<div class="heading"><div><p class="tag">${tag}</p><h1>${title}</h1><p>${description}</p></div><div class="heading-actions">${actions}</div></div>`;
  const empty = (icon, title, text, action = '') => `<div class="empty-state"><div><i>${icon}</i><h3>${title}</h3><p>${text}</p>${action}</div></div>`;
  const tableCellLabels = (headers, rows) => {
    if (!rows) return rows;
    const labels = headers.map(label => String(label || '').replace(/<[^>]*>/g, '').trim());
    return String(rows).replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/gi, (row, rowAttributes, cells) => {
      let cellIndex = 0;
      const labelledCells = cells.replace(/<td([^>]*)>/gi, (cell, attributes) => {
        if (/\bcolspan\s*=/i.test(attributes) || /\bdata-label\s*=/i.test(attributes)) return `<td${attributes}>`;
        const label = labels[cellIndex++] || 'Información';
        return `<td${attributes} data-label="${esc(label)}">`;
      });
      return `<tr${rowAttributes}>${labelledCells}</tr>`;
    });
  };
  const table = (headers, rows, emptyText = 'Sin registros.') => {
    const body = rows ? tableCellLabels(headers, rows) : `<tr><td colspan="${headers.length}" class="muted">${emptyText}</td></tr>`;
    return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
  };

  function translateError(error) {
    const key = String(error?.message || error || 'ERROR');
    const messages = {
      CREDENCIALES_INVALIDAS:'Correo o contraseña incorrectos. El propietario puede ejecutar prepararAccesoAdministrador() en Apps Script.', CLAVE_INSTALACION_INVALIDA:'La clave de instalación no coincide con la generada por instalarSistema().',
      CLAVE_INSTALACION_REQUERIDA:'Ingrese una clave de instalación.', CONTRASENA_REQUERIDA:'Ingrese la contraseña elegida.',
      DATOS_DE_ADMINISTRADOR_INVALIDOS:'Complete los datos del administrador e ingrese una contraseña.',
      SISTEMA_YA_INICIALIZADO:'El sistema ya tiene usuarios registrados.', AUTENTICACION_REQUERIDA:'La sesión no está disponible.', SESION_INVALIDA:'La sesión dejó de ser válida.',
      SESION_EXPIRADA:'La sesión expiró.', PERMISO_DENEGADO:'Su rol no tiene permiso para realizar esta acción.', ULTIMO_ADMINISTRADOR_PROTEGIDO:'No se puede quitar o desactivar al último administrador activo.', CONTRASENAS_NO_COINCIDEN:'Las contraseñas no coinciden.', RECURSO_NO_ENCONTRADO:'El recurso solicitado no existe.',
      REGISTRO_NO_ENCONTRADO:'El registro no existe.', VEHICULO_NO_DISPONIBLE:'El vehículo no está disponible.', CONDUCTOR_NO_DISPONIBLE:'El conductor no está disponible.',
      OPERACION_NO_ACTIVA:'La operación ya no está activa.', CORREO_YA_EXISTE:'El correo ya está registrado.', DIRECCION_APLICACION_NO_CONFIGURADA:'Falta configurar la dirección de la aplicación en configuracion.js.',
      ID_HOJA_NO_CONFIGURADO:'La base de datos central no está configurada correctamente.', TIEMPO_DE_ESPERA_AGOTADO:'La base de datos tardó demasiado en responder.',
      CONTRASENA_ACTUAL_INVALIDA:'La contraseña actual no es correcta.', FORMATO_LOGOTIPO_INVALIDO:'El formato del logotipo no es válido.', LOGOTIPO_DEMASIADO_GRANDE:'El logotipo supera el tamaño máximo de 1,5 MB.',
      ID_HOJA_NO_CONFIGURADO:'La base de datos central no está configurada correctamente.', CONFIRMACION_REQUERIDA:'Debe escribir exactamente “LIMPIAR DATOS”.',
      CONDUCTOR_NO_ASOCIADO:'La cuenta no está asociada a un conductor.', CONDUCTOR_NO_ENCONTRADO:'El conductor seleccionado no existe.', VEHICULO_NO_ENCONTRADO:'El vehículo seleccionado no existe.',
      QR_NO_RECONOCIDO:'El código QR no corresponde a un vehículo registrado.', CODIGO_QR_REQUERIDO:'Ingrese o escanee un código QR.', RUTA_NO_ENCONTRADA:'La ruta no existe.',
      ESTADO_RUTA_INVALIDO:'El estado solicitado para la ruta no es válido.', DESTINATARIO_REQUERIDO:'Seleccione un conductor destinatario.', NOTIFICACION_NO_ENCONTRADA:'La notificación no existe.',
      COORDENADAS_INVALIDAS:'Las coordenadas recibidas no son válidas.', AUTORIZACION_QR_INVALIDA:'Valide nuevamente el QR del vehículo. La autorización dura cinco minutos.',
      ACCION_ESPECIAL_REQUERIDA:'Utilice el botón específico del módulo para realizar esta acción.',
      SINCRONIZACION_NO_COMPLETADA:'La base de datos no respondió correctamente durante la sincronización.',
      CHECKIN_REQUERIDO:'Debe seleccionar un check-in aprobado antes de iniciar la operación.', CHECKIN_NO_ENCONTRADO:'El check-in seleccionado no existe.',
      CHECKIN_NO_COINCIDE:'El check-in no corresponde al vehículo y conductor seleccionados.', CHECKIN_NO_APROBADO:'El check-in todavía no está aprobado.',
      CHECKIN_YA_UTILIZADO:'Este check-in ya fue utilizado en otra operación.', CHECKIN_EXPIRADO:'El check-in expiró. Realice una inspección nueva.',
      CHECKIN_CONFIRMACION_REQUERIDA:'Debe confirmar que realizó personalmente la inspección.', CHECKIN_LISTA_INVALIDA:'La lista de inspección no es válida.',
      CHECKIN_DATOS_REQUERIDOS:'Complete el vehículo, conductor, kilometraje y todos los puntos de inspección.', CHECKIN_DECISION_INVALIDA:'Seleccione aprobar o rechazar.',
      CHECKIN_CRITICO_NO_APROBABLE:'Un check-in con fallas críticas no puede aprobarse. Debe corregirse la falla y realizar una inspección nueva.',
      PUNTO_OPERACION_NO_CONFIGURADO:'El Administrador debe configurar el punto base de inicio y finalización en Configuración.', VALIDACION_UBICACION_DESACTIVADA:'La validación geográfica de operaciones está desactivada. Debe activarse en Configuración.',
      UBICACION_OPERACION_REQUERIDA:'Debe permitir el acceso al GPS y obtener la ubicación antes de continuar.', PRECISION_GPS_REQUERIDA:'El dispositivo no informó la precisión de la ubicación.',
      UBICACION_GPS_IMPRECISA:'La señal GPS es demasiado imprecisa. Salga a un lugar abierto y vuelva a intentarlo.', FUERA_DEL_PUNTO_DE_INICIO:'No puede iniciar la operación fuera del punto autorizado por el Administrador.',
      FUERA_DEL_PUNTO_DE_FINALIZACION:'No puede finalizar la operación hasta regresar al punto autorizado.', RADIO_OPERACION_INVALIDO:'Los radios y la precisión permitida deben estar entre 10 y 5.000 metros.',
      RUTA_NO_DISPONIBLE:'La ruta seleccionada ya no está disponible.', RUTA_NO_COINCIDE_CONDUCTOR:'La ruta no corresponde al conductor seleccionado.', RUTA_NO_COINCIDE_VEHICULO:'La ruta no corresponde al vehículo seleccionado.', RUTA_YA_VINCULADA:'La ruta ya está vinculada a otra operación activa.'
    };
    if (messages[key]) return messages[key];
    if (key.startsWith('CAMPO_REQUERIDO_')) return `El campo ${key.replace('CAMPO_REQUERIDO_','')} es obligatorio.`;
    return key.replaceAll('_',' ');
  }

  function toast(title, message = '', type = 'success') {
    const node = document.createElement('div'); node.className = `toast ${type === 'error' ? 'error' : ''}`;
    node.innerHTML = `<i>${type === 'error' ? '!' : '✓'}</i><div><b>${esc(title)}</b><small>${esc(message)}</small></div><button aria-label="Cerrar">×</button>`;
    $('#toastStack').append(node); $('button', node).addEventListener('click', () => node.remove()); setTimeout(() => node.remove(), 4200);
  }

  function activarCargaBoton(button, text = 'Procesando…') {
    if (!button || button.dataset.loading === '1') return null;
    const state = {
      html: button.innerHTML,
      disabled: button.disabled,
      minWidth: button.style.minWidth,
      ariaBusy: button.getAttribute('aria-busy'),
    };
    const width = button.getBoundingClientRect().width;
    button.dataset.loading = '1';
    button.disabled = true;
    button.classList.add('is-loading');
    button.setAttribute('aria-busy','true');
    if (width) button.style.minWidth = `${Math.ceil(width)}px`;
    const compact=button.matches('.row-actions button,.icon-button')||(button.classList.contains('topbar-sync')&&window.matchMedia?.('(max-width:760px)').matches);
    button.classList.toggle('is-loading-compact',compact);
    button.textContent = compact?'':text;
    return () => {
      button.innerHTML = state.html;
      button.disabled = state.disabled;
      button.style.minWidth = state.minWidth;
      button.classList.remove('is-loading');
      button.classList.remove('is-loading-compact');
      delete button.dataset.loading;
      if (state.ariaBusy === null) button.removeAttribute('aria-busy');
      else button.setAttribute('aria-busy', state.ariaBusy);
    };
  }

  async function conCargaBoton(button, text, action) {
    const finalizar = activarCargaBoton(button, text);
    if (!finalizar) return;
    try { return await action(); }
    finally { finalizar(); }
  }

  function guardarListaFormulario(resource, rows = []) {
    const list = Array.isArray(rows) ? rows : [];
    const prefix = `${resource}:`;
    [...cacheRegistros.keys()].forEach(key => { if (key.startsWith(prefix)) cacheRegistros.delete(key); });
    list.forEach(row => { if (row?.ID) cacheRegistros.set(`${resource}:${row.ID}`, row); });
    cacheListasFormulario.set(resource, list);
    return list;
  }

  function guardarRegistro(resource, row) {
    if (row?.ID) cacheRegistros.set(`${resource}:${row.ID}`, row);
    return row;
  }

  function listaFormulario(resource) {
    return cacheListasFormulario.get(resource) || [];
  }

  function registroFormulario(resource, id) {
    return cacheRegistros.get(`${resource}:${id}`) || null;
  }

  function invalidarListasFormulario(...resources) {
    if (!resources.length) {
      cacheListasFormulario.clear();
      cacheRegistros.clear();
      listasFormularioPendientes.clear();
      return;
    }
    resources.forEach(resource => {
      cacheListasFormulario.delete(resource);
      listasFormularioPendientes.delete(resource);
      const prefix = `${resource}:`;
      [...cacheRegistros.keys()].forEach(key => { if (key.startsWith(prefix)) cacheRegistros.delete(key); });
    });
  }

  function cargarListaFormulario(resource) {
    if (cacheListasFormulario.has(resource)) return Promise.resolve(listaFormulario(resource));
    if (listasFormularioPendientes.has(resource)) return listasFormularioPendientes.get(resource);
    const pending = api.request('list',{resource})
      .then(result => guardarListaFormulario(resource,result.rows||[]))
      .finally(() => {
        if (listasFormularioPendientes.get(resource) === pending) listasFormularioPendientes.delete(resource);
      });
    listasFormularioPendientes.set(resource,pending);
    return pending;
  }

  function setConnection(ok, text) {
    const box = $('#connectionStatus'); box.classList.toggle('error', !ok); $('span', box).textContent = text;
  }
  function setSave(text, mode = '') {
    const box = $('#saveStatus'); box.className = `save-status ${mode}`; $('span', box).textContent = text;
  }
  async function updateBattery(){
    try{const battery=await navigator.getBattery?.();if(battery){const assign=()=>{batteryLevel=Math.round(battery.level*100);};assign();battery.addEventListener('levelchange',assign);}}catch(_){}
  }
  function connectionType(){return navigator.connection?.effectiveType||navigator.connection?.type||'';}
  async function sendHeartbeat(state='En línea'){
    if(!currentUser)return;
    try{await api.request('heartbeat',{data:{DISPOSITIVO_ID:deviceId,SESION_CLIENTE_ID:clientSessionId,SECCION_ACTUAL:currentSection,GPS_ACTIVO:gpsWatchId===null?'NO':'SI',PAGINA_VISIBLE:document.hidden?'NO':'SI',ESTADO:state,PLATAFORMA:navigator.platform||'',NAVEGADOR:navigator.userAgent,TIPO_RED:connectionType(),BATERIA_PORCENTAJE:batteryLevel}});setConnection(navigator.onLine!==false,api.isRemote()?'Servicio conectado':'Modo local activo');}
    catch(error){setConnection(false,'Sin conexión con el servicio');}
  }
  async function refreshNotificationBadge(){
    if(!currentUser||!hasPermission('NOTIFICACIONES','LEER'))return;
    try{const result=await api.request('list',{resource:'notifications'}),count=(result.rows||[]).filter(row=>row.LEIDA!=='SI').length,badge=$('#notificationBadge');badge.textContent=count>99?'99+':String(count);badge.hidden=count===0;}catch(_){}
  }
  function stopRealtimeServices(){
    [heartbeatTimer,notificationTimer,realtimeTimer].forEach(timer=>{if(timer)clearInterval(timer);});
    heartbeatTimer=null;notificationTimer=null;realtimeTimer=null;
  }
  function startRealtimeServices(){
    stopRealtimeServices();updateBattery();sendHeartbeat();
    heartbeatTimer=setInterval(()=>sendHeartbeat(),config.INTERVALO_CONEXION_MILISEGUNDOS||20000);
    if(!embeddedMode||['dashboard','notifications'].includes(currentSection)){
      refreshNotificationBadge();
      notificationTimer=setInterval(refreshNotificationBadge,config.INTERVALO_NOTIFICACIONES_MILISEGUNDOS||30000);
    }
    resumeTrackingIfAllowed();
  }

  async function checkSystem() {
    const savedAuth = api.getAuth();
    hideAuthCards();

    // En modo iframe, main.html es el único validador de la sesión.
    // El módulo reutiliza el usuario guardado y comienza sin una segunda espera de red.
    if (embeddedMode) {
      if (!savedAuth.token || !savedAuth.user) {
        postParent({tipo:'flotas:autenticacion-requerida'});
        return;
      }
      currentUser = savedAuth.user;
      showApp();
      return;
    }

    if (!savedAuth.token) $('#loginForm').classList.remove('hidden');
    $('#authBackendLabel').textContent = `Conectando con ${api.backendLabel()}…`;
    try {
      const mePromise = savedAuth.token
        ? api.request('me',{cache:false}).then(value => ({ value })).catch(error => ({ error }))
        : Promise.resolve(null);
      const [statusData, meResult] = await Promise.all([api.request('status'), mePromise]);
      if (currentUser) return;
      applyBranding(statusData.company || null);
      $('#authBackendLabel').textContent = `${api.backendLabel()} · Conectado`;
      if (statusData.needsSetup) {
        hideAuthCards();
        $('#setupForm').classList.remove('hidden');
      } else if (savedAuth.token && meResult?.value?.user) {
        currentUser = meResult.value.user;
        api.setAuth({...savedAuth,user:currentUser});
        showApp();
      } else {
        if (savedAuth.token && meResult?.error && api.isAuthError?.(meResult.error)) api.setAuth({});
        hideAuthCards();
        $('#loginForm').classList.remove('hidden');
      }
    } catch (error) {
      if (currentUser) return;
      hideAuthCards();
      $('#connectionErrorText').textContent = translateError(error);
      $('#connectionError').classList.remove('hidden');
      $('#authBackendLabel').textContent = `${api.backendLabel()} · Error`;
    }
  }

  function hideAuthCards() { ['setupForm','loginForm','connectionError'].forEach(id => $('#' + id).classList.add('hidden')); }

  async function handleSetup(event) {
    event.preventDefault(); const formElement=event.currentTarget;const form = new FormData(formElement); const button = $('button[type="submit"]', formElement);
    await conCargaBoton(button,'Instalando…',async()=>{
      try {
        await api.request('bootstrap', Object.fromEntries(form.entries()));
        toast('Sistema instalado','El administrador inicial fue creado.'); formElement.reset(); await checkSystem();
      } catch (error) { toast('No fue posible instalar',translateError(error),'error'); }
    });
  }

  async function handleLogin(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const button = $('button[type="submit"]',event.currentTarget);
    await conCargaBoton(button,'Verificando…',async()=>{
      try {
        const result = await api.request('login', Object.fromEntries(form.entries())); api.setAuth({ token:result.token, sessionId:result.sessionId||'', user:result.user, expiresAt:result.expiresAt });
        currentUser = result.user; showApp(); toast('Bienvenido',`Sesión iniciada como ${currentUser.ROL_NOMBRE}.`);
      } catch (error) { toast('Acceso denegado',translateError(error),'error'); }
    });
  }

  function showApp() {
    $('#authScreen').classList.add('hidden'); $('#appShell').classList.remove('hidden');
    $('#userName').textContent=currentUser.NOMBRE; $('#userRole').textContent=currentUser.ROL_NOMBRE || currentUser.ROL_ID; $('#userAvatar').textContent=initials(currentUser.NOMBRE);
    $('#backendName').textContent=api.backendLabel(); $('#backendDetail').textContent=api.isRemote()?'Información sincronizada entre dispositivos':'Información guardada en este dispositivo';
    setConnection(true, api.isRemote()?'Base de datos conectada':'Base de datos local activa'); buildNav();
    go(initialSection).finally(() => {
      startRealtimeServices();
      if(!embeddedMode)precargarModulos();
      refreshCompanyBranding();
    });
  }

  function buildNav() {
    if(embeddedMode){$('#nav').innerHTML='';return;}
    let html='';
    navGroups.forEach(([group,items]) => {
      const visible = items.filter(([id]) => hasPermission(navPermission[id]||'PANEL_PRINCIPAL','LEER'));
      if (!visible.length) return;
      html += `<p class="nav-label">${group}</p>` + visible.map(([id,icon,label]) => `<button class="nav-button ${currentSection===id?'active':''}" data-nav="${id}"><i>${icon}</i>${label}</button>`).join('');
    });
    $('#nav').innerHTML=html;
  }

  function consultasPrecarga() {
    const resources = [
      ['routes','RUTAS'], ['operations','OPERACIONES'], ['notifications','NOTIFICACIONES'],
      ['vehicles','VEHICULOS'], ['drivers','CONDUCTORES'], ['maintenance','MANTENCIONES'],
      ['documents','DOCUMENTOS'], ['history','HISTORIAL'], ['alerts','ALERTAS'],
      ['users','USUARIOS'], ['audit','BITACORA'], ['companies','CONFIGURACION'],
    ];
    return resources
      .filter(([, module]) => hasPermission(module,'LEER'))
      .map(([resource]) => ({ key:`lista_${resource}`, action:'list', payload:{ resource } }));
  }

  function precargarModulos() {
    if (embeddedMode || precargaIniciada || !currentUser) return;
    precargaIniciada = true;
    const queries = consultasPrecarga();
    const ejecutar = () => api.prefetch(queries).then(result => {
      queries.forEach(query => {
        const rows = result?.[query.key]?.rows;
        if (Array.isArray(rows)) guardarListaFormulario(query.payload.resource,rows);
      });
      if (currentUser) setSave('Módulos preparados');
    });
    if ('requestIdleCallback' in window) window.requestIdleCallback(ejecutar, { timeout:1500 });
    else setTimeout(ejecutar, 350);
  }

  function esqueletoModulo() {
    return '<div class="module-skeleton" aria-label="Preparando módulo"><i></i><div><span></span><span></span><span></span></div><section><b></b><b></b><b></b><b></b></section></div>';
  }

  async function go(section, options = {}) {
    const sequence = ++secuenciaNavegacion;
    cleanupSection(); currentSection=section; buildNav();
    if (options.force) {
      api.invalidate();
      invalidarListasFormulario();
      cacheVistasModulo.delete(section);
      precargaIniciada = false;
    }
    if (heartbeatTimer) sendHeartbeat();
    $('#pageTitle').textContent=labels[section]; $('#breadcrumb').textContent=`Sistema / ${labels[section]}`;
    const cachedView = section === 'gps' ? null : cacheVistasModulo.get(section);
    if (cachedView) {
      $('#content').innerHTML=cachedView;
      bindSection();
    } else {
      $('#content').innerHTML=esqueletoModulo();
    }
    closeSidebar();
    try {
      const html = await renderers[section]();
      if (sequence !== secuenciaNavegacion || section !== currentSection) return;
      $('#content').innerHTML=html;
      cacheVistasModulo.set(section, html);
      if (cacheVistasModulo.size > 18) cacheVistasModulo.delete(cacheVistasModulo.keys().next().value);
      bindSection();
      if (section==='gps') setTimeout(initMap,80);
      if (options.force && !embeddedMode) precargarModulos();
      if(embeddedMode)postParent({tipo:'flotas:modulo-listo',usuario:currentUser,seccion:section});
    } catch (error) {
      if (sequence !== secuenciaNavegacion || section !== currentSection) return;
      if (['AUTENTICACION_REQUERIDA','SESION_INVALIDA','SESION_EXPIRADA'].includes(error.message)) {forceLogout();return false;}
      $('#content').innerHTML=`<div class="card">${empty('!','No se pudo cargar el módulo',translateError(error),'<button class="btn primary" data-retry>Reintentar</button>')}</div>`;
      bindSection(); setConnection(false,'Error del servicio de datos');postParent({tipo:'flotas:error-modulo',mensaje:translateError(error)});
      return false;
    }
    window.scrollTo({top:0,behavior:'auto'});
    return true;
  }

  function cleanupSection() {
    if (gpsRefreshTimer) clearTimeout(gpsRefreshTimer); gpsRefreshTimer=null;
    gpsRefreshQueued=false;gpsLocationsPaintKey='';gpsDevicesPaintKey='';gpsTotalsPaintKey='';
    if (mapaFlota) { mapaFlota.eliminar(); mapaFlota=null; }
  }

  const renderers = {
    async dashboard() {
      const batch=await api.requestBatch([
        { key:'dashboard', action:'dashboard' },
        { key:'realtime', action:'realtimeSummary' },
      ]);
      const data=batch.dashboard||{},realtime=batch.realtime||{},m=data.metrics || {};
      const operations=(data.recentOperations||[]).map(op=>`<tr><td><strong>${esc(op.ID)}</strong></td><td>${esc(op.VEHICULO_ID)}</td><td>${esc(op.CONDUCTOR_ID)}</td><td>${fmtDate(op.FECHA_INICIO,true)}</td><td>${status(op.ESTADO)}</td><td>${esc(op.ORIGEN||'')} → ${esc(op.DESTINO||'')}</td></tr>`).join('');
      const notifications=(data.notifications||[]).map(notificationCard).join('');
      const routes=(data.routes||[]).filter(r=>['Asignada','En curso'].includes(r.ESTADO));
      const headingActions=`<button class="btn soft" data-sync>↻ Sincronizar</button>${hasPermission('RUTAS','CREAR')?'<button class="btn primary" data-new-route>＋ Asignar ruta</button>':''}`;
      const driverHero=currentUser.ROL_ID==='ROL-CONDUCTOR'&&routes.length?`<div class="driver-home"><article class="card driver-route-hero"><div class="card-header"><div><h3>Próxima ruta asignada</h3><p>Lista para iniciar navegación</p></div>${status(routes[0].ESTADO)}</div>${routeCard(routes[0],true)}</article><article class="card"><div class="card-header"><div><h3>Mi conexión</h3><p>Estado del dispositivo</p></div></div><div class="tracking-notice ${gpsWatchId===null?'inactive':'active'}" data-tracking-notice><i data-tracking-icon>${gpsWatchId===null?'○':'●'}</i><div><b data-tracking-title>${gpsWatchId===null?'Ubicación continua detenida':'Ubicación continua activada'}</b><span data-tracking-detail>${trackingDetail()}</span></div></div><button class="btn ${gpsWatchId===null?'primary':'danger'} full" data-toggle-tracking>${gpsWatchId===null?'Activar ubicación continua':'Detener ubicación continua'}</button></article></div>`:'';
      return heading('RESUMEN OPERACIONAL',`Hola, ${esc(currentUser.NOMBRE.split(' ')[0])}`,'Información actualizada de flota, rutas, dispositivos y avisos según sus permisos.',headingActions)+
        driverHero+
        `<div class="kpi-grid">${metric('▣','Vehículos',m.vehicles||0,`${m.availableVehicles||0} disponibles`)}${metric('♙','Conductores',m.drivers||0,`${m.availableDrivers||0} disponibles`)}${metric('⇄','Operaciones activas',m.activeOperations||0,'Seguimiento en curso')}${metric('!','Alertas',m.unreadAlerts||0,`${m.expiredDocuments||0} documentos vencidos`)}</div>`+
        `<div class="live-strip">${liveStat('⌖','Sesiones abiertas',realtime.totals?.onlineDevices??m.onlineDevices??0,'online')}${liveStat('🚐','Conduciendo',realtime.totals?.drivingSessions||0,'online')}${liveStat('✓','Check-ins aprobados',m.approvedCheckins||0,'online')}${liveStat('!','Check-ins por atender',(m.pendingCheckins||0)+(m.blockedCheckins||0),((m.pendingCheckins||0)+(m.blockedCheckins||0))?'warning':'')}</div>`+
        `<div class="dashboard-insights"><article class="card"><div class="card-header"><div><h3>Operaciones de los últimos 7 días</h3><p>Actividad diaria visible para su rol</p></div></div>${weeklyBars(data.charts?.operationsByDay||[])}</article><article class="card"><div class="card-header"><div><h3>Estado de la flota</h3><p>Distribución actual de vehículos</p></div></div>${stateDonut(data.charts?.vehicleStates||[])}</article><article class="card"><div class="card-header"><div><h3>Acciones rápidas</h3><p>Accesos según sus permisos</p></div></div>${quickActions()}</article></div>`+
        `${hasPermission('CONEXIONES','LEER')?`<article class="card session-control-card"><div class="card-header"><div><h3>Control de sesiones abiertas</h3><p>Usuario, conductor, módulo abierto, vehículo, operación, ruta y GPS por cada sesión.</p></div><button class="link-button" data-nav="gps">Abrir monitoreo</button></div><div class="device-list dashboard-session-list">${(realtime.devices||[]).slice(0,12).map(deviceCard).join('')||empty('○','Sin sesiones registradas','Las sesiones aparecerán cuando los usuarios ingresen al sistema.')}</div></article>`:''}`+
        `<div class="dashboard-grid"><article class="card"><div class="card-header"><div><h3>Operaciones recientes</h3><p>Movimientos creados en el sistema</p></div></div>${operations?table(['Operación','Vehículo','Conductor','Inicio','Estado','Ruta'],operations):empty('⇄','Aún no hay operaciones','No existen recorridos visibles para esta cuenta.',hasPermission('OPERACIONES','CREAR')?'<button class="btn primary" data-nav="operations">Crear operación</button>':'')}</article>`+
        `<article class="card"><div class="card-header"><div><h3>Notificaciones pendientes</h3><p>Mensajes dirigidos al usuario</p></div><button class="link-button" data-nav="notifications">Ver todas</button></div><div class="notification-list">${notifications||empty('✓','Sin notificaciones','No existen mensajes pendientes.')}</div></article></div>`;
    },
    async vehicles(){return renderResourcePage('vehicles','FLOTA','Vehículos','Administre las unidades, patentes, kilometraje y códigos QR.',vehicleRows,['Vehículo','Patente','Año','Kilometraje','Estado','QR','']);},
    async drivers(){return renderResourcePage('drivers','PERSONAL','Conductores','Gestione licencias, disponibilidad y usuarios asociados.',driverRows,['Conductor','RUT','Licencia','Vencimiento','Estado','Usuario','']);},
    async maintenance(){return renderResourcePage('maintenance','PREVENCIÓN','Mantenciones','Programe trabajos preventivos y correctivos.',maintenanceRows,['Trabajo','Vehículo','Tipo','Fecha','Costo','Estado','']);},
    async documents(){return renderResourcePage('documents','VENCIMIENTOS','Documentos','Controle permisos, seguros, revisiones y licencias.',documentRows,['Documento','Asociado','Identificación','Vencimiento','Estado','Archivo','']);},
    async alerts(){return renderResourcePage('alerts','NOTIFICACIONES','Alertas','Registre y gestione eventos que requieren atención.',alertRows,['Nivel','Título','Módulo','Fecha','Leída','']);},
    async users(){return renderResourcePage('users','SEGURIDAD','Usuarios','Administre accesos, roles, permisos personalizados y estado de las cuentas sin cerrar sus sesiones.',userRows,['Usuario','Correo','Rol','Permisos','Último acceso','Estado','']);},
    async checkin(){return renderCheckin();},
    async checkinApprovals(){return renderCheckinApprovals();},
    async checkinHistory(){return renderCheckinHistory();},
    async operations(){return renderOperations();},
    async routes(){return renderRoutes();},
    async gps(){return renderGps();},
    async notifications(){return renderNotifications();},
    async history(){return renderHistory();},
    async reports(){return renderReports();},
    async audit(){return renderAudit();},
    async company(){return renderCompany();},
    async settings(){return renderSettings();}
  };

  function metric(icon,label,value,detail){return `<article class="metric-card"><i class="metric-icon">${icon}</i><div><span>${label}</span><b>${value}</b><small>${detail}</small></div></article>`;}
  function liveStat(icon,label,value,mode=''){return `<article class="live-stat ${mode}"><i>${icon}</i><div><span>${label}</span><b>${number(value)}</b></div></article>`;}
  function navigationUrl(route){
    const latitude=Number(route.DESTINO_LATITUD),longitude=Number(route.DESTINO_LONGITUD);
    const destination=Number.isFinite(latitude)&&Number.isFinite(longitude)&&route.DESTINO_LATITUD!==''?`${latitude},${longitude}`:route.DESTINO;
    if(route.PROVEEDOR_NAVEGACION==='Waze')return `https://www.waze.com/ul?q=${encodeURIComponent(destination||'')}&navigate=yes`;
    const params=new URLSearchParams({api:'1',destination:destination||'',travelmode:'driving'});
    if(route.ORIGEN&&route.ORIGEN!=='Ubicación actual')params.set('origin',route.ORIGEN);
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  }
  function routeCard(route,hero=false){
    const canUpdate=hasPermission('RUTAS','ACTUALIZAR'),driver=currentUser?.ROL_ID==='ROL-CONDUCTOR';
    const actions=[`<a class="btn primary small" href="${esc(navigationUrl(route))}" target="_blank" rel="noopener">Navegar con ${esc(route.PROVEEDOR_NAVEGACION||'Google Maps')}</a>`];
    if(canUpdate&&route.ESTADO==='Asignada')actions.push(`<button class="btn soft small" data-route-state="${route.ID}:En curso">Iniciar ruta</button>`);
    if(canUpdate&&route.ESTADO==='En curso')actions.push(`<button class="btn soft small" data-route-state="${route.ID}:Completada">Completar</button>`);
    if(canUpdate&&!driver&&!['Completada','Cancelada'].includes(route.ESTADO))actions.push(`<button class="btn danger small" data-route-state="${route.ID}:Cancelada">Cancelar</button>`);
    return `<div class="${hero?'':'route-card'}"><header><div><h4>${esc(route.NOMBRE||route.ID)}</h4><p>${esc(route.CONDUCTOR_NOMBRE||route.CONDUCTOR_ID||'Sin conductor')} · ${esc(route.VEHICULO_PATENTE||route.VEHICULO_ID||'Vehículo por definir')}</p></div>${status(route.ESTADO)}</header><div class="route-path"><i></i><span>${esc(route.ORIGEN||'Ubicación actual')}</span><i class="end"></i><span>${esc(route.DESTINO||'Sin destino')}</span></div>${route.INSTRUCCIONES?`<p>${esc(route.INSTRUCCIONES)}</p>`:''}<div class="route-actions">${actions.join('')}</div><div class="route-meta"><span>Asignada: ${fmtDate(route.FECHA_ASIGNACION,true)}</span><span>Proveedor: ${esc(route.PROVEEDOR_NAVEGACION||'Google Maps')}</span></div></div>`;
  }
  function notificationCard(item){
    const priority=String(item.PRIORIDAD||'Normal').toLowerCase();
    return `<article class="notification-card"><header><div><h4>${esc(item.TITULO)}</h4><p>${esc(item.MENSAJE)}</p></div><span class="priority ${esc(priority)}">${esc(item.PRIORIDAD||'Normal')}</span></header><div class="route-meta"><span>${fmtDate(item.FECHA_ENVIO||item.CREADO_EN,true)}</span><span>${esc(item.TIPO||'Información')}</span></div>${item.LEIDA!=='SI'?`<button class="link-button" data-read-notification="${item.ID}" type="button">Marcar como leída</button>`:''}</article>`;
  }
  function deviceCard(item){
    const activity=item.EN_LINEA?(item.ACTIVIDAD||'Conectado'):'Inactivo',sectionName=labels[item.SECCION_ACTUAL]||item.SECCION_ACTUAL||'Sin identificar';
    const sessionReference=String(item.SESION_CLIENTE_ID||item.SESION_ID||item.DISPOSITIVO_ID||'').slice(-10);
    return `<article class="device-card ${item.EN_LINEA?'online':'offline'} ${activity==='Conduciendo'?'driving':''}"><i class="device-dot"></i><div><div class="device-title"><b>${esc(item.USUARIO_NOMBRE||'Usuario')}</b>${status(activity)}</div><span><strong>Conductor:</strong> ${esc(item.CONDUCTOR_NOMBRE||'No asociado')}</span><div class="session-facts"><span><b>Sección</b>${esc(sectionName)}</span><span><b>Vehículo</b>${esc(item.VEHICULO_PATENTE||item.VEHICULO_ID||'Sin asignar')}</span><span><b>Operación</b>${esc(item.OPERACION_ID||'Sin operación')}</span><span><b>Ruta</b>${esc(item.RUTA_ID||'Sin ruta')}</span><span><b>GPS</b>${item.GPS_ACTIVO==='SI'?'Activo':'Inactivo'}</span><span><b>Visibilidad</b>${item.PAGINA_VISIBLE==='NO'?'Segundo plano':'Visible'}</span></div><small>Sesión ${esc(sessionReference||'sin referencia')} · ${esc(item.PLATAFORMA||'Dispositivo')} · Última señal: ${fmtDate(item.ULTIMA_CONEXION,true)}${item.BATERIA_PORCENTAJE!==''?` · Batería ${number(item.BATERIA_PORCENTAJE)}%`:''}</small></div></article>`;
  }
  function weeklyBars(series=[]){
    const max=Math.max(1,...series.map(item=>Number(item.TOTAL||0)));
    return `<div class="weekly-chart">${series.map(item=>`<div class="weekly-column"><b>${number(item.TOTAL)}</b><i style="height:${Math.max(8,Math.round(Number(item.TOTAL||0)/max*100))}%"></i><span>${esc(item.ETIQUETA||'')}</span></div>`).join('')}</div>`;
  }
  function stateDonut(states=[]){
    const colors=['#0e9f91','#2e6fe8','#e8a128','#d65454','#8b67cc','#718393'],total=states.reduce((sum,item)=>sum+Number(item.TOTAL||0),0);
    let current=0;const stops=states.map((item,index)=>{const start=current;current+=total?Number(item.TOTAL||0)/total*360:0;return `${colors[index%colors.length]} ${start.toFixed(1)}deg ${current.toFixed(1)}deg`;});
    const background=total?`conic-gradient(${stops.join(',')})`:'conic-gradient(#dfe8ec 0deg 360deg)';
    return `<div class="donut-layout"><div class="donut-chart" style="background:${background}"><span><b>${number(total)}</b><small>vehículos</small></span></div><div class="chart-legend">${states.map((item,index)=>`<div><i style="background:${colors[index%colors.length]}"></i><span>${esc(item.ESTADO)}</span><b>${number(item.TOTAL)}</b></div>`).join('')||'<p class="muted">Sin datos registrados.</p>'}</div></div>`;
  }
  function quickActions(){
    const actions=[];
    if(hasPermission('RUTAS','CREAR'))actions.push(['routes','➜','Asignar ruta']);
    if(hasPermission('CHECKIN','CREAR'))actions.push(['checkin','✓','Realizar check-in']);
    if(hasPermission('OPERACIONES','CREAR'))actions.push(['operations','⇄','Iniciar operación']);
    if(hasPermission('NOTIFICACIONES','CREAR'))actions.push(['notifications','🔔','Enviar aviso']);
    if(hasPermission('VEHICULOS','CREAR'))actions.push(['vehicles','▣','Registrar vehículo']);
    return `<div class="quick-actions">${actions.map(([section,icon,label])=>`<button data-nav="${section}"><i>${icon}</i><span>${label}</span></button>`).join('')||'<p class="muted">No hay acciones rápidas habilitadas para este rol.</p>'}</div>`;
  }
  function searchAddresses(query){
    const normalized=String(query||'').trim().toLowerCase(),cached=addressSearchCache.get(normalized);
    if(cached)return Promise.resolve(cached);
    const task=addressSearchQueue.catch(()=>{}).then(async()=>{
      const wait=Math.max(0,1000-(Date.now()-lastAddressSearchAt));if(wait)await new Promise(resolve=>setTimeout(resolve,wait));
      lastAddressSearchAt=Date.now();
      const url=new URL(config.DIRECCION_BUSQUEDA_DIRECCIONES);url.searchParams.set('format','jsonv2');url.searchParams.set('q',query);url.searchParams.set('limit','6');url.searchParams.set('addressdetails','1');url.searchParams.set('accept-language','es');
      if(config.PAIS_BUSQUEDA_DIRECCIONES)url.searchParams.set('countrycodes',config.PAIS_BUSQUEDA_DIRECCIONES);
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);
      try{const response=await fetch(url,{headers:{Accept:'application/json'},signal:controller.signal});if(!response.ok)throw new Error('BUSQUEDA_DIRECCION_NO_DISPONIBLE');const result=await response.json();addressSearchCache.set(normalized,result);if(addressSearchCache.size>80)addressSearchCache.delete(addressSearchCache.keys().next().value);return result;}
      finally{clearTimeout(timer);}
    });
    addressSearchQueue=task;return task;
  }
  function bindAddressAutocomplete(root=document){
    $$('[data-address-autocomplete]',root).forEach(input=>{
      if(input.dataset.addressBound==='1')return;input.dataset.addressBound='1';input.setAttribute('autocomplete','off');input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');
      const suggestions=document.createElement('div');suggestions.className='address-suggestions';suggestions.setAttribute('role','listbox');suggestions.hidden=true;input.insertAdjacentElement('afterend',suggestions);
      let timer=null,sequence=0,activeIndex=-1,items=[];
      const close=()=>{suggestions.hidden=true;suggestions.innerHTML='';items=[];activeIndex=-1;input.setAttribute('aria-expanded','false');};
      const select=item=>{input.value=item.display_name||'';const form=input.closest('form')||root;const latName=input.dataset.latTarget,lngName=input.dataset.lngTarget;if(latName&&form.querySelector(`[name="${latName}"]`))form.querySelector(`[name="${latName}"]`).value=item.lat||'';if(lngName&&form.querySelector(`[name="${lngName}"]`))form.querySelector(`[name="${lngName}"]`).value=item.lon||'';input.dispatchEvent(new Event('direccion:seleccionada',{bubbles:true}));close();};
      const render=result=>{items=result||[];if(!items.length){suggestions.innerHTML='<p>No se encontraron coincidencias. Puede conservar la dirección escrita.</p>';suggestions.hidden=false;return;}suggestions.innerHTML=items.map((item,index)=>`<button type="button" role="option" data-address-index="${index}"><i>⌖</i><span><b>${esc(item.display_name||'Dirección')}</b><small>${esc(item.type||item.category||'Lugar')}</small></span></button>`).join('');suggestions.hidden=false;input.setAttribute('aria-expanded','true');$$('[data-address-index]',suggestions).forEach(button=>button.addEventListener('mousedown',event=>{event.preventDefault();select(items[Number(button.dataset.addressIndex)]);}));};
      input.addEventListener('input',()=>{
        const form=input.closest('form')||root;[input.dataset.latTarget,input.dataset.lngTarget].filter(Boolean).forEach(name=>{const field=form.querySelector(`[name="${name}"]`);if(field)field.value='';});
        clearTimeout(timer);const query=input.value.trim();sequence+=1;const ownSequence=sequence;if(query.length<(config.MINIMO_CARACTERES_DIRECCION||3))return close();
        timer=setTimeout(async()=>{suggestions.innerHTML='<p>Buscando direcciones…</p>';suggestions.hidden=false;try{const result=await searchAddresses(query);if(ownSequence===sequence)render(result);}catch(_){if(ownSequence===sequence){suggestions.innerHTML='<p>No fue posible consultar direcciones. Puede continuar escribiéndola manualmente.</p>';suggestions.hidden=false;}}},config.ESPERA_BUSQUEDA_DIRECCION_MILISEGUNDOS||450);
      });
      input.addEventListener('keydown',event=>{const buttons=$$('button',suggestions);if(!buttons.length)return;if(event.key==='ArrowDown'){event.preventDefault();activeIndex=(activeIndex+1)%buttons.length;}else if(event.key==='ArrowUp'){event.preventDefault();activeIndex=(activeIndex-1+buttons.length)%buttons.length;}else if(event.key==='Enter'&&activeIndex>=0){event.preventDefault();select(items[activeIndex]);return;}else if(event.key==='Escape')return close();else return;buttons.forEach((button,index)=>button.classList.toggle('active',index===activeIndex));buttons[activeIndex]?.scrollIntoView({block:'nearest'});});
      input.addEventListener('blur',()=>setTimeout(close,180));
    });
  }

  async function renderResourcePage(resource,tag,title,description,rowRenderer,headers) {
    const result=await api.request('list',{resource}); const rows=result.rows||[];
    guardarListaFormulario(resource,rows);
    const createButton=hasPermission(resourcePermission[resource],'CREAR')?`<button class="btn primary" data-add="${resource}">＋ Nuevo registro</button>`:'';
    const rowHtml=rows.map(row=>rowRenderer(row)).join('');
    return heading(tag,title,description,`<button class="btn soft" data-sync>↻ Sincronizar</button>${createButton}`)+`<article class="card"><div class="toolbar"><label class="search-box"><span>⌕</span><input data-table-search placeholder="Buscar en ${title.toLowerCase()}"></label><button class="btn soft push" data-export="${resource}">Exportar CSV</button></div><div data-filter-table>${table(headers,rowHtml,`No hay ${title.toLowerCase()} registrados.`)}</div></article>`;
  }

  function vehicleRows(v){return `<tr data-search-row="${esc(`${v.PATENTE} ${v.MARCA} ${v.MODELO} ${v.ESTADO}`.toLowerCase())}"><td><div class="entity"><i class="entity-icon">🚐</i><div><strong>${esc(v.MARCA||'Sin marca')} ${esc(v.MODELO||'')}</strong><span class="muted">${esc(v.ID)}</span></div></div></td><td><strong>${esc(v.PATENTE)}</strong></td><td>${esc(v.ANIO||'—')}</td><td>${number(v.KILOMETRAJE)} km</td><td>${status(v.ESTADO)}</td><td>${esc(v.QR_CODIGO||'—')}</td><td>${actions('vehicles',v.ID)}</td></tr>`;}
  function driverRows(d){return `<tr data-search-row="${esc(`${d.NOMBRE} ${d.RUT} ${d.ESTADO}`.toLowerCase())}"><td><div class="entity"><span class="avatar">${initials(d.NOMBRE)}</span><div><strong>${esc(d.NOMBRE)}</strong><span class="muted">${esc(d.TELEFONO||'')}</span></div></div></td><td>${esc(d.RUT)}</td><td>${esc(d.LICENCIA_CLASE||'—')}</td><td>${fmtDate(d.LICENCIA_VENCIMIENTO)}</td><td>${status(d.ESTADO)}</td><td>${esc(d.USUARIO_ID||'Sin asociar')}</td><td>${actions('drivers',d.ID)}</td></tr>`;}
  function maintenanceRows(m){return `<tr data-search-row="${esc(`${m.TITULO} ${m.VEHICULO_ID} ${m.ESTADO}`.toLowerCase())}"><td><strong>${esc(m.TITULO)}</strong><span class="muted">${esc(m.DESCRIPCION||'')}</span></td><td>${esc(m.VEHICULO_ID)}</td><td>${esc(m.TIPO)}</td><td>${fmtDate(m.FECHA_PROGRAMADA)}</td><td>$${number(m.COSTO)}</td><td>${status(m.ESTADO)}</td><td>${actions('maintenance',m.ID)}</td></tr>`;}
  function documentRows(d){return `<tr data-search-row="${esc(`${d.TIPO} ${d.IDENTIFICACION} ${d.ESTADO}`.toLowerCase())}"><td><strong>${esc(d.TIPO)}</strong><span class="muted">${esc(d.ID)}</span></td><td>${esc(d.ASOCIADO_TIPO)}</td><td>${esc(d.IDENTIFICACION)}</td><td>${fmtDate(d.FECHA_VENCIMIENTO)}</td><td>${status(d.ESTADO)}</td><td>${d.DIRECCION_ARCHIVO?`<a class="link-button" href="${esc(d.DIRECCION_ARCHIVO)}" target="_blank" rel="noopener">Abrir</a>`:'—'}</td><td>${actions('documents',d.ID)}</td></tr>`;}
  function alertRows(a){return `<tr data-search-row="${esc(`${a.NIVEL} ${a.TITULO} ${a.MODULO}`.toLowerCase())}"><td>${status(a.NIVEL)}</td><td><strong>${esc(a.TITULO)}</strong><span class="muted">${esc(a.MENSAJE)}</span></td><td>${esc(a.MODULO||'—')}</td><td>${fmtDate(a.FECHA_HORA||a.CREADO_EN,true)}</td><td>${status(a.LEIDA||'NO')}</td><td>${actions('alerts',a.ID)}</td></tr>`;}
  function userRows(u){const mode=u.ROL_ID==='ROL-ADMIN'?'Completo':u.MODO_PERMISOS==='PERSONALIZADO'?'Personalizados':'Según rol';const permissionButton=hasPermission('USUARIOS','ACTUALIZAR')?`<button data-user-permissions="${esc(u.ID)}" title="Configurar permisos">⚿</button>`:'';const actionHtml=actions('users',u.ID),baseActions=actionHtml==='—'?(permissionButton?`<div class="row-actions">${permissionButton}</div>`:'—'):actionHtml.replace('</div>',permissionButton+'</div>');return `<tr data-search-row="${esc(`${u.NOMBRE} ${u.CORREO} ${u.ROL_ID} ${mode}`.toLowerCase())}"><td><div class="entity"><span class="avatar">${initials(u.NOMBRE)}</span><strong>${esc(u.NOMBRE)}</strong></div></td><td>${esc(u.CORREO)}</td><td>${esc(u.ROL_NOMBRE||u.ROL_ID)}</td><td>${status(mode)}</td><td>${fmtDate(u.ULTIMO_ACCESO,true)}</td><td>${status(u.ESTADO)}</td><td>${baseActions}</td></tr>`;}
  function actions(resource,id){const module=resourcePermission[resource];const buttons=[];if(hasPermission(module,'ACTUALIZAR'))buttons.push(`<button data-edit="${resource}:${id}" title="Editar">✎</button>`);if(hasPermission(module,'ELIMINAR'))buttons.push(`<button data-delete="${resource}:${id}" title="Eliminar">×</button>`);return buttons.length?`<div class="row-actions">${buttons.join('')}</div>`:'—';}

  function parseCheckinItems(row) {
    try {
      const items=typeof row?.LISTA_CODIFICADA==='string'?JSON.parse(row.LISTA_CODIFICADA):row?.LISTA_CODIFICADA;
      return Array.isArray(items)?items:[];
    } catch (_) { return []; }
  }
  function crearSolicitudClienteCheckin() {
    const value = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return `CHK-CLIENTE-${value}`.slice(0, 120);
  }
  function guardarReciboCheckin(row, persistencia) {
    if (!row?.ID) return;
    const receipt = { id:row.ID, estado:row.ESTADO_REVISION || row.RESULTADO || 'Registrado', fecha:new Date().toISOString(), persistencia:persistencia || (api.isRemote() ? 'CENTRAL_CONFIRMADA' : 'LOCAL') };
    sessionStorage.setItem(checkinReceiptKey, JSON.stringify(receipt));
  }
  function reciboCheckinMarkup() {
    let receipt=null;
    try { receipt=JSON.parse(sessionStorage.getItem(checkinReceiptKey) || 'null'); } catch (_) {}
    if (!receipt?.id) return '';
    const central=receipt.persistencia==='CENTRAL_CONFIRMADA';
    return `<div class="tracking-notice ${central?'active':'warning'} checkin-save-receipt"><i>${central?'✓':'!'}</i><div><b>${central?'Check-in guardado en la base central':'Check-in guardado solo en este dispositivo'}</b><span>Comprobante ${esc(receipt.id)} · ${esc(receipt.estado)} · ${fmtDate(receipt.fecha,true)}</span></div><button class="btn soft small" type="button" data-checkin-detail="${esc(receipt.id)}">Ver registro</button></div>`;
  }

  function checkinVisualState(row) {
    if(row.UTILIZADO==='SI')return 'Utilizado';
    if(row.ESTADO_REVISION==='Aprobado'&&new Date(row.VIGENTE_HASTA||0).getTime()<=Date.now())return 'Expirado';
    return row.ESTADO_REVISION||row.RESULTADO||'Sin estado';
  }
  function checkinDetailAction(row) {
    return `<button class="btn soft small" data-checkin-detail="${esc(row.ID)}">Ver inspección</button>`;
  }
  async function checkinContext() {
    const batch=await api.requestBatch([
      {key:'checkins',action:'list',payload:{resource:'checkins'}},
      {key:'vehicles',action:'list',payload:{resource:'vehicles'}},
      {key:'drivers',action:'list',payload:{resource:'drivers'}},
    ]),checkins=batch.checkins||{},vehicles=batch.vehicles||{},drivers=batch.drivers||{};
    guardarListaFormulario('checkins',checkins.rows||[]);guardarListaFormulario('vehicles',vehicles.rows||[]);guardarListaFormulario('drivers',drivers.rows||[]);
    return {rows:(checkins.rows||[]).sort((a,b)=>new Date(b.FECHA_HORA||0)-new Date(a.FECHA_HORA||0)),vehicles:vehicles.rows||[],drivers:drivers.rows||[]};
  }
  function checkinRow(row,vehicleMap,driverMap,withReview=false) {
    const vehicle=vehicleMap[row.VEHICULO_ID]?.PATENTE||row.VEHICULO_ID,driver=driverMap[row.CONDUCTOR_ID]?.NOMBRE||row.CONDUCTOR_ID,state=checkinVisualState(row);
    const review=withReview&&row.ESTADO_REVISION==='Pendiente'&&Number(row.FALLAS_CRITICAS||0)===0?`<button class="btn primary small" data-review-checkin="${esc(row.ID)}">Revisar</button>`:'';
    return `<tr data-search-row="${esc(`${row.ID} ${vehicle} ${driver} ${row.RESULTADO} ${state}`.toLowerCase())}"><td><strong>${esc(row.ID)}</strong><span class="muted">${fmtDate(row.FECHA_HORA,true)}</span></td><td><strong>${esc(vehicle)}</strong></td><td>${esc(driver)}</td><td>${status(row.RESULTADO)}</td><td>${status(state)}</td><td><span class="checkin-count critical">${number(row.FALLAS_CRITICAS||0)} críticas</span><span class="checkin-count">${number(row.FALLAS_LEVES||0)} leves</span></td><td>${fmtDate(row.VIGENTE_HASTA,true)}</td><td><div class="row-button-stack">${review}${checkinDetailAction(row)}</div></td></tr>`;
  }
  function checkinInlineItemsMarkup() {
    const groups={};
    checkinCatalog.forEach(item=>(groups[item.categoria]||(groups[item.categoria]=[])).push(item));
    let position=0;
    return Object.entries(groups).map(([category,items])=>`<fieldset class="checkin-group checkin-group-visible full"><legend>${esc(category)}</legend>${items.map(item=>{
      position+=1;
      return `<article class="checkin-control-card" data-checkin-control="${esc(item.id)}">
        <div class="checkin-control-head"><span class="checkin-control-number">${position}</span><div><b>${esc(item.item)}</b><small>${item.critico?'Control crítico: una falla bloquea la operación':'Control complementario'}</small></div><span class="checkin-control-state" data-checkin-state="${esc(item.id)}">Sin revisar</span></div>
        <div class="checkin-answer-options" role="radiogroup" aria-label="Resultado de ${esc(item.item)}">
          <label class="checkin-answer ok"><input type="radio" name="checkin_${esc(item.id)}" value="OK" required><span>✓ Conforme</span></label>
          <label class="checkin-answer fail"><input type="radio" name="checkin_${esc(item.id)}" value="FALLA" required><span>! Presenta falla</span></label>
          ${item.critico?'':`<label class="checkin-answer na"><input type="radio" name="checkin_${esc(item.id)}" value="NA" required><span>— No aplica</span></label>`}
        </div>
        <label class="field checkin-inline-note"><span>Observación ${item.critico?'del control':'opcional'}</span><input data-checkin-note="${esc(item.id)}" placeholder="Describa daños, ruidos o condiciones encontradas"></label>
      </article>`;
    }).join('')}</fieldset>`).join('');
  }

  function checkinInlineFormMarkup() {
    if(!hasPermission('CHECKIN','CREAR')){
      return `<article class="card checkin-visible-card"><div class="card-header"><div><h3>Lista de chequeo vehicular</h3><p>Los controles están disponibles, pero su usuario no tiene permiso para registrar inspecciones.</p></div>${status('Solo lectura')}</div><div class="tracking-notice warning full"><i>!</i><div><b>Permiso requerido: CHECKIN · CREAR</b><span>Solicite al administrador activar este permiso en Usuarios → Configurar permisos.</span></div></div><div class="checkin-readonly-list">${checkinCatalog.map((item,index)=>`<div><span>${index+1}</span><p><b>${esc(item.item)}</b><small>${esc(item.categoria)} · ${item.critico?'Crítico':'Complementario'}</small></p></div>`).join('')}</div></article>`;
    }
    return `<article class="card checkin-visible-card" id="checkinVisibleCard">
      <div class="card-header checkin-visible-header"><div><span class="eyebrow">CHEQUEO ANTES DE SALIR</span><h3>Lista de chequeo vehicular</h3><p>Marque los 16 controles. El formulario permanece visible dentro del módulo.</p></div><div class="checkin-progress-summary"><b data-checkin-progress-count>0 / ${checkinCatalog.length}</b><span>controles revisados</span></div></div>
      <div class="checkin-progress-track" aria-hidden="true"><i data-checkin-progress-bar></i></div>
      <form class="form-grid checkin-form checkin-inline-form" id="checkinInlineForm">
        <div class="checkin-basic-data full">
          <label class="field"><span>Vehículo</span>${selectorDinamico('vehicles','checkinVehicles','VEHICULO_ID','',true)}</label>
          <label class="field"><span>Conductor</span>${selectorDinamico('drivers','checkinDrivers','CONDUCTOR_ID',currentUser.CONDUCTOR_ID||'',true)}</label>
          <label class="field"><span>Kilometraje actual</span><input name="KILOMETRAJE" type="number" min="0" required inputmode="numeric" placeholder="Ej. 125600"></label>
          <label class="field"><span>Nivel de combustible/carga</span><select name="NIVEL_COMBUSTIBLE" required><option value="">Seleccione</option><option>Vacío / crítico</option><option>1/4</option><option>1/2</option><option>3/4</option><option>Lleno</option><option>No aplica</option></select></label>
        </div>
        <div class="checkin-bulk-actions full"><button class="btn soft" type="button" data-checkin-all-ok>✓ Marcar todos conforme</button><button class="btn soft" type="button" data-checkin-clear>Limpiar respuestas</button><span>Las fallas deben incluir una observación.</span></div>
        ${checkinInlineItemsMarkup()}
        <label class="field full"><span>Observaciones generales</span><textarea name="OBSERVACIONES" placeholder="Indique testigos del tablero, daños, ruidos o cualquier condición adicional"></textarea></label>
        <label class="field full"><span>Nombre o firma del conductor</span><input name="FIRMA_CONDUCTOR" value="${esc(currentUser.NOMBRE||'')}" required></label>
        <label class="checkin-confirm full"><input type="checkbox" name="CONFIRMACION_CONDUCTOR" value="SI" required><span>Confirmo que revisé personalmente cada punto y que la información registrada es correcta.</span></label>
        <div class="form-actions checkin-submit-actions"><button class="btn primary" type="submit">Guardar y evaluar check-in</button></div>
      </form>
    </article>`;
  }

  async function renderCheckin() {
    const data=await checkinContext(),vehicleMap=Object.fromEntries(data.vehicles.map(v=>[v.ID,v])),driverMap=Object.fromEntries(data.drivers.map(d=>[d.ID,d]));
    const approved=data.rows.filter(row=>checkinVisualState(row)==='Aprobado').length,pending=data.rows.filter(row=>row.ESTADO_REVISION==='Pendiente').length,blocked=data.rows.filter(row=>row.ESTADO_REVISION==='Bloqueado').length;
    const rows=data.rows.map(row=>checkinRow(row,vehicleMap,driverMap)).join('');
    const create=hasPermission('CHECKIN','CREAR')?'<button class="btn primary" data-focus-checkin>↓ Ir a la lista de chequeo</button>':'';
    return heading('INSPECCIÓN PREOPERACIONAL','Check-in vehicular','Revise el vehículo antes de iniciar cualquier operación. Los 16 controles aparecen directamente en esta pantalla.',`<button class="btn soft" data-sync>↻ Sincronizar</button>${create}`)+
      reciboCheckinMarkup()+
      `<div class="checkin-process"><article><i>1</i><div><b>Seleccionar vehículo</b><span>Confirme patente, conductor y kilometraje.</span></div></article><article><i>2</i><div><b>Completar 16 controles</b><span>Marque conforme, falla o no aplica cuando corresponda.</span></div></article><article><i>3</i><div><b>Guardar evaluación</b><span>La operación solo inicia con check-in aprobado y vigente.</span></div></article></div>`+
      checkinInlineFormMarkup()+
      `<div class="live-strip">${liveStat('✓','Aprobados vigentes',approved,'online')}${liveStat('⌛','Pendientes',pending,pending?'warning':'')}${liveStat('!','Bloqueados',blocked,blocked?'warning':'')}${liveStat('▤','Inspecciones',data.rows.length)}</div>`+
      `<article class="card"><div class="card-header"><div><h3>Inspecciones registradas</h3><p>Historial visible según el perfil del usuario</p></div></div><div class="toolbar"><label class="search-box"><span>⌕</span><input data-table-search placeholder="Buscar por patente, conductor o estado"></label><button class="btn soft push" data-nav="checkinHistory">Historial completo</button></div><div data-filter-table>${table(['Check-in','Vehículo','Conductor','Resultado','Estado','Fallas','Vigente hasta','Acciones'],rows,'No existen check-ins registrados.')}</div></article>`;
  }
  async function renderCheckinApprovals() {
    const data=await checkinContext(),vehicleMap=Object.fromEntries(data.vehicles.map(v=>[v.ID,v])),driverMap=Object.fromEntries(data.drivers.map(d=>[d.ID,d]));
    const pending=data.rows.filter(row=>['Pendiente','Bloqueado'].includes(row.ESTADO_REVISION)&&row.UTILIZADO!=='SI');
    const rows=pending.map(row=>checkinRow(row,vehicleMap,driverMap,true)).join('');
    return heading('CONTROL DE SEGURIDAD','Aprobación de check-ins','Revise observaciones leves. Las fallas críticas exigen corrección y una nueva inspección.',`<button class="btn soft" data-sync>↻ Sincronizar</button>`)+
      `<div class="operation-banner checkin-warning"><i>!</i><div><h3>Regla de bloqueo</h3><p>Un supervisor puede aprobar observaciones leves, pero nunca una inspección con fallas críticas.</p></div></div>`+
      `<div class="live-strip">${liveStat('⌛','Pendientes de revisión',pending.filter(r=>r.ESTADO_REVISION==='Pendiente').length,'warning')}${liveStat('!','Bloqueados críticos',pending.filter(r=>r.ESTADO_REVISION==='Bloqueado').length,'warning')}${liveStat('✓','Aprobados hoy',data.rows.filter(r=>r.ESTADO_REVISION==='Aprobado'&&String(r.FECHA_REVISION||r.FECHA_HORA).slice(0,10)===new Date().toISOString().slice(0,10)).length,'online')}</div>`+
      `<article class="card"><div class="toolbar"><label class="search-box"><span>⌕</span><input data-table-search placeholder="Buscar check-in pendiente"></label><button class="btn soft push" data-nav="checkinHistory">Abrir historial</button></div><div data-filter-table>${table(['Check-in','Vehículo','Conductor','Resultado','Estado','Fallas','Vigente hasta','Acciones'],rows,'No hay check-ins pendientes de revisión.')}</div></article>`;
  }
  async function renderCheckinHistory() {
    const data=await checkinContext(),vehicleMap=Object.fromEntries(data.vehicles.map(v=>[v.ID,v])),driverMap=Object.fromEntries(data.drivers.map(d=>[d.ID,d]));
    const rows=data.rows.map(row=>checkinRow(row,vehicleMap,driverMap)).join('');
    return heading('TRAZABILIDAD','Historial de check-in','Consulte inspecciones, resultados, aprobaciones, bloqueos y operaciones relacionadas.',`<button class="btn soft" data-sync>↻ Sincronizar</button><button class="btn soft" data-export="checkins">Exportar CSV</button>`)+
      `<article class="card"><div class="toolbar"><label class="search-box"><span>⌕</span><input data-table-search placeholder="Buscar en el historial"></label><button class="btn primary push" data-nav="checkin">Nuevo check-in</button></div><div data-filter-table>${table(['Check-in','Vehículo','Conductor','Resultado','Estado','Fallas','Vigente hasta','Acciones'],rows,'No existen inspecciones registradas.')}</div></article>`;
  }

  function configuracionPuntoOperacion(company=currentCompany||{}){
    const latitudeText=String(company.PUNTO_OPERACION_LATITUD??'').trim(),longitudeText=String(company.PUNTO_OPERACION_LONGITUD??'').trim(),latitude=Number(latitudeText),longitude=Number(longitudeText);
    return{configurada:Boolean(latitudeText&&longitudeText)&&Number.isFinite(latitude)&&Number.isFinite(longitude)&&String(company.VALIDAR_UBICACION_OPERACION||'SI')!=='NO',nombre:company.PUNTO_OPERACION_NOMBRE||'Base operacional',direccion:company.PUNTO_OPERACION_DIRECCION||company.DIRECCION||'Sin dirección',latitud:latitude,longitud:longitude,radioInicio:Math.max(10,Number(company.RADIO_INICIO_METROS||150)),radioFin:Math.max(10,Number(company.RADIO_FIN_METROS||150)),precisionMaxima:Math.max(10,Number(company.PRECISION_GPS_MAXIMA_METROS||120))};
  }
  function obtenerUbicacionNavegador({timeout=25000,maximumAge=0}={}){
    if(!navigator.geolocation)return Promise.reject(new Error('UBICACION_OPERACION_REQUERIDA'));
    return new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(position=>resolve({latitud:position.coords.latitude,longitud:position.coords.longitude,precision:position.coords.accuracy,fecha:position.timestamp}),error=>{if(error?.code===1)reject(new Error('UBICACION_OPERACION_REQUERIDA'));else if(error?.code===3)reject(new Error('TIEMPO_DE_ESPERA_AGOTADO'));else reject(new Error('UBICACION_GPS_IMPRECISA'));},{enableHighAccuracy:true,timeout,maximumAge}));
  }
  function resumenValidacionLocalUbicacion(location,base,phase='INICIO'){
    const distance=distanciaMetros(location.latitud,location.longitud,base.latitud,base.longitud),radius=phase==='FIN'?base.radioFin:base.radioInicio,accuracy=Number(location.precision||0),valid=accuracy>0&&accuracy<=base.precisionMaxima&&distance<=radius;
    return{...location,distancia:Math.round(distance),radio:radius,valida:valid,precisionValida:accuracy>0&&accuracy<=base.precisionMaxima};
  }
  function pintarEstadoUbicacionOperacion(container,result,phase='INICIO'){
    if(!container)return;const label=phase==='FIN'?'finalización':'inicio';container.className=`operation-location-status ${result.valida?'valid':'invalid'}`;container.innerHTML=`<i>${result.valida?'✓':'!'}</i><div><b>${result.valida?'Ubicación autorizada':result.precisionValida?'Fuera del perímetro':'Señal GPS imprecisa'}</b><span>${result.distancia} m de la base · radio permitido ${result.radio} m · precisión ±${Math.round(result.precision)} m</span>${result.valida?'':`<small>No se permitirá la ${label} hasta cumplir ambas condiciones.</small>`}</div>`;
  }
  async function capturarUbicacionFormularioOperacion(form,phase='INICIO'){
    const base=configuracionPuntoOperacion();if(!base.configurada)throw new Error('PUNTO_OPERACION_NO_CONFIGURADO');const statusNode=form.querySelector('[data-operation-location-status]');if(statusNode){statusNode.className='operation-location-status loading';statusNode.innerHTML='<i>⌖</i><div><b>Obteniendo ubicación precisa…</b><span>Mantenga el GPS activo y permanezca en el punto autorizado.</span></div>';}
    const location=await obtenerUbicacionNavegador(),result=resumenValidacionLocalUbicacion(location,base,phase),prefix=phase==='FIN'?'FIN_':'INICIO_';form.elements[prefix+'LATITUD'].value=location.latitud;form.elements[prefix+'LONGITUD'].value=location.longitud;form.elements[prefix+'PRECISION'].value=location.precision;pintarEstadoUbicacionOperacion(statusNode,result,phase);return result;
  }
  function rutasDisponiblesOperacion(form){const vehicle=form.elements.VEHICULO_ID?.value||'',driver=form.elements.CONDUCTOR_ID?.value||'',select=form.elements.RUTA_ID;if(!select)return;const routes=(listasFormulario.get('routes')||[]).filter(route=>['Asignada','En curso'].includes(route.ESTADO)&&(!driver||route.CONDUCTOR_ID===driver)&&(!route.VEHICULO_ID||!vehicle||route.VEHICULO_ID===vehicle)&&!route.OPERACION_ID);const selected=select.value;select.innerHTML=`<option value="">Sin ruta asignada · salida y regreso a base</option>${routes.map(route=>`<option value="${esc(route.ID)}" ${route.ID===selected?'selected':''}>${esc(route.NOMBRE||route.ID)} · ${esc(route.DESTINO||'')}</option>`).join('')}`;actualizarDestinoOperacion(form);}
  function actualizarDestinoOperacion(form){const routeId=form.elements.RUTA_ID?.value||'',route=(listasFormulario.get('routes')||[]).find(item=>item.ID===routeId),base=configuracionPuntoOperacion(),field=form.elements.DESTINO;if(field)field.value=route?.DESTINO||base.direccion;const type=form.querySelector('[data-operation-type]');if(type)type.textContent=route?'Ruta asignada con regreso obligatorio a la base':'Salida y regreso al mismo punto base';}
  async function renderOperations() {
    const batch=await api.requestBatch([
      {key:'ops',action:'list',payload:{resource:'operations'}},
      {key:'vehicles',action:'list',payload:{resource:'vehicles'}},
      {key:'drivers',action:'list',payload:{resource:'drivers'}},
      {key:'checkins',action:'list',payload:{resource:'checkins'}},
      {key:'routes',action:'list',payload:{resource:'routes'}},
    ]),ops=batch.ops||{},vehicles=batch.vehicles||{},drivers=batch.drivers||{},checkins=batch.checkins||{},routes=batch.routes||{};
    guardarListaFormulario('operations',ops.rows||[]);guardarListaFormulario('vehicles',vehicles.rows||[]);guardarListaFormulario('drivers',drivers.rows||[]);guardarListaFormulario('checkins',checkins.rows||[]);guardarListaFormulario('routes',routes.rows||[]);
    const base=configuracionPuntoOperacion();
    const active=(ops.rows||[]).filter(o=>o.ESTADO==='Activa'),vehicleMap=Object.fromEntries((vehicles.rows||[]).map(v=>[v.ID,v])),driverMap=Object.fromEntries((drivers.rows||[]).map(d=>[d.ID,d])),routeMap=Object.fromEntries((routes.rows||[]).map(r=>[r.ID,r]));
    const activeHtml=active.map(op=>`<article class="operation-card"><header><div><h4>${esc(op.ID)} · ${esc(vehicleMap[op.VEHICULO_ID]?.PATENTE||op.VEHICULO_ID)}</h4><small>${esc(driverMap[op.CONDUCTOR_ID]?.NOMBRE||op.CONDUCTOR_ID)}</small></div>${status(op.ESTADO)}</header><div class="operation-route">${esc(op.ORIGEN||op.BASE_DIRECCION||'Base')} → ${esc(op.DESTINO||op.PUNTO_RETORNO||'Base')}</div><div class="operation-meta"><div><span>INICIO</span><b>${fmtDate(op.FECHA_INICIO,true)}</b></div><div><span>TIPO</span><b>${esc(op.TIPO_OPERACION||'Regreso a base')}</b></div><div><span>RUTA</span><b>${esc(routeMap[op.RUTA_ID]?.NOMBRE||op.RUTA_ID||'Sin ruta')}</b></div><div><span>INICIO VALIDADO</span><b>${op.VALIDACION_INICIO==='VALIDADA'?`${number(op.DISTANCIA_INICIO_BASE_METROS)} m de base`:'Pendiente'}</b></div><div><span>CHECK-IN</span><b>${esc(op.CHECKIN_ID||'Sin registro')}</b></div><div><span>RETORNO</span><b>${esc(op.PUNTO_RETORNO||op.BASE_DIRECCION||'Base operacional')}</b></div></div>${hasPermission('OPERACIONES','ACTUALIZAR')?`<button class="btn danger small" data-finish-operation="${op.ID}" style="margin-top:12px">Finalizar en punto base</button>`:''}</article>`).join('');
    const opRows=(ops.rows||[]).map(op=>`<tr><td><strong>${esc(op.ID)}</strong></td><td>${esc(vehicleMap[op.VEHICULO_ID]?.PATENTE||op.VEHICULO_ID)}</td><td>${esc(driverMap[op.CONDUCTOR_ID]?.NOMBRE||op.CONDUCTOR_ID)}</td><td>${esc(op.TIPO_OPERACION||'—')}</td><td>${esc(routeMap[op.RUTA_ID]?.NOMBRE||op.RUTA_ID||'Sin ruta')}</td><td>${fmtDate(op.FECHA_INICIO,true)}</td><td>${op.VALIDACION_INICIO==='VALIDADA'?'✓ Inicio':''}${op.VALIDACION_FIN==='VALIDADA'?' · ✓ Fin':''}</td><td>${status(op.ESTADO)}</td></tr>`).join('');
    const enabled=base.configurada,createActions=`<button class="btn soft" data-sync>↻ Sincronizar</button>`+(hasPermission('OPERACIONES','CREAR')&&enabled?(currentUser.ROL_ID==='ROL-CONDUCTOR'?'<button class="btn primary" data-open-qr>▦ Validar QR e iniciar</button>':'<button class="btn soft" data-open-qr>▦ Escanear QR</button><button class="btn primary" data-new-operation>＋ Nueva operación</button>'):'');
    const baseBanner=enabled?`<div class="operation-geofence-banner"><i>⌖</i><div><h3>${esc(base.nombre)}</h3><p>${esc(base.direccion)} · Inicio dentro de ${number(base.radioInicio)} m · Finalización dentro de ${number(base.radioFin)} m · Precisión máxima ±${number(base.precisionMaxima)} m.</p></div>${hasPermission('CONFIGURACION','ACTUALIZAR')?'<button class="btn soft" data-nav="settings">Configurar punto</button>':''}</div>`:`<div class="operation-geofence-banner blocked"><i>!</i><div><h3>Punto operacional no configurado</h3><p>Nadie podrá iniciar o finalizar operaciones hasta que el Administrador defina la ubicación base en Configuración.</p></div>${hasPermission('CONFIGURACION','ACTUALIZAR')?'<button class="btn primary" data-nav="settings">Configurar ahora</button>':''}</div>`;
    return heading('CONTROL DE VIAJES','Operaciones','El inicio y la finalización se validan por GPS contra el punto parametrizado por el Administrador.',createActions)+baseBanner+
      `<div class="operation-banner"><i>✓</i><div><h3>Check-in, ruta y ubicación trabajan juntos</h3><p>Sin ruta asignada, la salida y el destino son la misma base. Con ruta asignada, el recorrido usa ese destino, pero la finalización exige regresar al punto base.</p></div>${hasPermission('OPERACIONES','CREAR')&&enabled?'<button class="btn soft" data-open-qr>Usar QR</button>':''}</div>`+
      `<div class="operation-layout"><article class="card"><div class="card-header"><div><h3>Operaciones activas</h3><p>${active.length} recorridos en curso</p></div></div>${activeHtml||empty('⇄','No hay operaciones activas',enabled?'Cree una operación desde el punto base autorizado.':'Configure primero el punto base operacional.')}</article><article class="card"><div class="card-header"><div><h3>Reglas obligatorias</h3><p>Aplicadas en el servidor</p></div></div><div class="requirement-list"><div><i>1</i><span><b>Check-in aprobado</b><small>Vigente, sin utilizar y correspondiente al vehículo y conductor.</small></span></div><div><i>2</i><span><b>Inicio dentro del perímetro</b><small>El GPS debe estar dentro de ${number(base.radioInicio)} m de la base.</small></span></div><div><i>3</i><span><b>Ruta opcional vinculada</b><small>La ruta define el destino, pero no elimina el regreso obligatorio.</small></span></div><div><i>4</i><span><b>Finalización en la base</b><small>El vehículo debe regresar dentro de ${number(base.radioFin)} m.</small></span></div></div></article></div>`+
      `<article class="card"><div class="card-header"><div><h3>Historial de operaciones</h3><p>Inicio, retorno y ubicación validada</p></div></div>${table(['Operación','Vehículo','Conductor','Tipo','Ruta','Inicio','Ubicación','Estado'],opRows,'No existen operaciones registradas.')}</article>`;
  }

  async function renderGps() {
    const realtime=await api.request('realtimeSummary',{...gpsFilterPayload(),force:true});
    ultimoResumenGps=realtime;
    const locations={rows:realtime.locations||[],total:realtime.totals?.locations||0};
    return heading('MONITOREO','GPS en tiempo real','Posición, dirección escrita, velocidad y conexión de los teléfonos autorizados.',`<button class="btn soft" data-refresh-locations>↻ Sincronizar</button><button class="btn soft" data-capture-gps>⌖ Enviar ahora</button><button class="btn ${gpsWatchId===null?'primary':'danger'}" data-toggle-tracking>${gpsWatchId===null?'Activar ubicación continua':'Detener ubicación continua'}</button>`)+
      gpsFilterControls(realtime)+
      `<div class="tracking-notice ${gpsWatchId===null?'inactive':'active'}" data-tracking-notice><i data-tracking-icon>${gpsWatchId===null?'○':'●'}</i><div><b data-tracking-title>${gpsWatchId===null?'Ubicación continua detenida':'Ubicación continua activada'}</b><span data-tracking-detail>${trackingDetail()}</span></div></div>`+
      `<div class="tracking-details"><div><span>Permiso del navegador</span><b data-tracking-permission>${permissionLabel()}</b></div><div><span>Reactivación automática</span><b data-tracking-preference>${trackingPreferenceEnabled()?'Activada':'Desactivada'}</b></div><div><span>Protección de pantalla activa</span><b data-wake-lock>${wakeLockLabel()}</b></div></div>`+
      `<div class="live-strip"><article class="live-stat"><i>⌖</i><div><span>Ubicaciones visibles</span><b id="gpsVisibleCount">${locations.total}</b></div></article><article class="live-stat online"><i>●</i><div><span>Sesiones abiertas</span><b id="gpsOnlineCount">${realtime.totals?.onlineDevices||0}</b></div></article><article class="live-stat online"><i>🚐</i><div><span>Conduciendo</span><b id="gpsDrivingCount">${realtime.totals?.drivingSessions||0}</b></div></article><article class="live-stat ${(realtime.totals?.sessionsWithoutGps||0)?'warning':''}"><i>!</i><div><span>Operación sin GPS</span><b id="gpsWithoutCount">${realtime.totals?.sessionsWithoutGps||0}</b></div></article></div>`+
      `<div class="gps-layout"><article class="card map-card"><div id="fleetMap" class="fleet-map"></div><div class="map-toolbar"><span class="gps-live"><i></i> Consulta rápida cada ${Math.round(config.INTERVALO_TIEMPO_REAL_MILISEGUNDOS/1000)} segundos</span><span class="map-status-legend"><b class="active"></b> Activo <b class="inactive"></b> Inactivo</span><span class="muted" id="gpsLastSync">Datos iniciales cargados</span><span class="muted push">Mapa © colaboradores de OpenStreetMap</span></div></article><article class="card"><div class="card-header"><div><h3>Últimas posiciones</h3><p id="locationCount">${locations.total} vehículos visibles</p></div></div><div class="driver-location-list" id="driverLocationList">${locationList(locations.rows)}</div><div class="card-header" style="margin-top:18px"><div><h3>Sesiones y conductores</h3><p>Usuario, actividad y sección abierta</p></div></div><div class="device-list" id="deviceList">${(realtime.devices||[]).map(deviceCard).join('')||empty('○','Sin sesiones','Esperando señales de los dispositivos.')}</div></article></div>`;
  }
  function locationList(rows){return rows.length?rows.map(row=>{const active=antiguedadUbicacion(row.FECHA_HORA)<=config.ANTIGUEDAD_UBICACION_ACTIVA_MILISEGUNDOS;return `<button class="driver-location ${active?'active':'inactive'}" data-focus-location="${row.LATITUD},${row.LONGITUD}"><i>●</i><div><b>${esc(row.CONDUCTOR_NOMBRE||row.CONDUCTOR_ID||'Sin conductor')}</b><span>${esc(row.VEHICULO_PATENTE||row.VEHICULO_ID||'Sin vehículo')} · ${Number(row.VELOCIDAD_KMH||0).toFixed(0)} km/h · ${active?'Activo':'Inactivo'}</span><span class="address-line">${esc(row.DIRECCION||`${Number(row.LATITUD).toFixed(5)}, ${Number(row.LONGITUD).toFixed(5)}`)}</span></div><time>${fmtDate(row.FECHA_HORA,true)}</time></button>`;}).join(''):empty('⌖','Sin ubicaciones','Cuando un conductor autorice y envíe su GPS, aparecerá aquí.');}

  async function renderHistory(){const history=await api.request('list',{resource:'history'});guardarListaFormulario('history',history.rows||[]);const rows=(history.rows||[]).map(h=>`<tr><td>${esc(h.OPERACION_ID)}</td><td>${esc(h.EVENTO)}</td><td>${esc(h.DETALLE)}</td><td>${fmtDate(h.FECHA_HORA,true)}</td><td>${esc(h.USUARIO_ID||'—')}</td></tr>`).join('');return heading('TRAZABILIDAD','Historial','Eventos de inicio, cierre y cambios de las operaciones.',`<button class="btn soft" data-sync>↻ Sincronizar</button><button class="btn soft" data-export="history">Exportar CSV</button>`)+`<article class="card">${table(['Operación','Evento','Detalle','Fecha','Usuario'],rows)}</article>`;}
  async function renderReports(){return heading('ANÁLISIS','Reportes','Exporte los registros de cada módulo en formato CSV.')+`<div class="kpi-grid">${['vehicles','drivers','operations','gps'].map(r=>`<button class="metric-card" data-export="${r}"><i class="metric-icon">⇩</i><div><span>Exportar</span><b style="font-size:17px">${labels[r]||r}</b><small>Archivo CSV</small></div></button>`).join('')}</div><article class="card">${empty('▥','Reportes listos para usar','Los archivos se generan con la información disponible en la base de datos.')}</article>`;}
  async function renderAudit(){const result=await api.request('list',{resource:'audit'});guardarListaFormulario('audit',result.rows||[]);const rows=(result.rows||[]).map(a=>`<tr><td>${fmtDate(a.FECHA_HORA||a.CREADO_EN,true)}</td><td>${esc(a.USUARIO_NOMBRE)}</td><td><strong>${esc(a.ACCION)}</strong></td><td>${esc(a.MODULO)}</td><td>${esc(a.DETALLE)}</td></tr>`).join('');return heading('BITÁCORA','Auditoría','Registro de las acciones realizadas en el sistema.',`<button class="btn soft" data-sync>↻ Sincronizar</button><button class="btn soft" data-export="audit">Exportar CSV</button>`)+`<article class="card">${table(['Fecha','Usuario','Acción','Módulo','Detalle'],rows)}</article>`;}
  async function refreshCompanyBranding(){
    try{const result=await api.request('list',{resource:'companies'});currentCompany=(result.rows||[])[0]||null;applyBranding(currentCompany);}catch(_){applyBranding(currentCompany);}
  }

  function applyBranding(company){
    if(company)currentCompany=company;
    const data=currentCompany||{};
    const name=data.NOMBRE_FANTASIA||data.RAZON_SOCIAL||'Sistema de Gestión de Flotas';
    const subtitle=data.GIRO||'Gestión integral';
    const logo=data.DIRECCION_LOGOTIPO||defaultLogo;
    ['authCompanyName','loginCompanyName','sidebarCompanyName'].forEach(id=>{const node=$('#'+id);if(node)node.textContent=name;});
    const sub=$('#sidebarCompanySubtitle');if(sub)sub.textContent=subtitle;
    ['authCompanyLogo','loginCompanyLogo','sidebarCompanyLogo'].forEach(id=>{const image=$('#'+id);if(image){image.src=logo;image.onerror=()=>{image.onerror=null;image.src=defaultLogo;};}});
    const tema=window.TemaFlotas?.aplicarEmpresa?.(data,{guardar:true})||null;
    postParent({tipo:'flotas:empresa',nombre:name,logo:logo,tema});
    document.title=`${name} | Sistema de Gestión de Flotas`;
  }

  function companyValue(company,key,fallback=''){return esc(company?.[key]??fallback);}

  async function renderCompany(){
    const result=await api.request('list',{resource:'companies'});const company=(result.rows||[])[0]||{};currentCompany=company;applyBranding(company);
    guardarListaFormulario('companies',result.rows||[]);
    const logo=company.DIRECCION_LOGOTIPO||defaultLogo;
    return heading('IDENTIDAD INSTITUCIONAL','Empresa','Administre el logotipo, los datos legales, la ubicación y las preferencias generales de la organización.',`<button class="btn soft" data-sync>↻ Sincronizar</button><span class="status ok">Configuración permanente</span>`)+
    `<form id="companyForm" class="company-layout">
      <article class="card company-logo-card">
        <div class="card-header"><div><h3>Logotipo de la empresa</h3><p>Se mostrará en el acceso y en el menú principal</p></div></div>
        <div class="company-logo-preview"><img id="companyLogoPreview" src="${esc(logo)}" alt="Vista previa del logotipo"></div>
        <label class="field"><span>Cargar logotipo</span><input id="companyLogo" type="file" accept="image/png,image/jpeg,image/webp"></label>
        <p class="helper">Formatos permitidos: PNG, JPG o WebP. Tamaño recomendado: hasta 1,5 MB.</p>
        <input id="removeLogoValue" type="hidden" value="NO">
        <button class="btn soft full" data-remove-company-logo type="button">Quitar logotipo actual</button>
        <div class="brand-colors">
          <label class="field"><span>Color principal</span><input name="COLOR_PRINCIPAL" type="color" value="${companyValue(company,'COLOR_PRINCIPAL','#0b5f59')}"></label>
          <label class="field"><span>Color secundario</span><input name="COLOR_SECUNDARIO" type="color" value="${companyValue(company,'COLOR_SECUNDARIO','#074640')}"></label>
        </div>
      </article>
      <div class="company-form-column">
        <article class="card">
          <div class="card-header"><div><h3>Identificación de la empresa</h3><p>Datos comerciales y legales</p></div></div>
          <div class="form-grid">
            <label class="field"><span>RUT</span><input name="RUT" value="${companyValue(company,'RUT')}" placeholder="76.123.456-7"></label>
            <label class="field"><span>Razón social</span><input name="RAZON_SOCIAL" value="${companyValue(company,'RAZON_SOCIAL')}" required></label>
            <label class="field"><span>Nombre de fantasía</span><input name="NOMBRE_FANTASIA" value="${companyValue(company,'NOMBRE_FANTASIA')}" required></label>
            <label class="field"><span>Giro o actividad</span><input name="GIRO" value="${companyValue(company,'GIRO')}"></label>
            <label class="field"><span>Representante legal</span><input name="REPRESENTANTE_LEGAL" value="${companyValue(company,'REPRESENTANTE_LEGAL')}"></label>
            <label class="field"><span>RUT del representante</span><input name="RUT_REPRESENTANTE" value="${companyValue(company,'RUT_REPRESENTANTE')}"></label>
          </div>
        </article>
        <article class="card">
          <div class="card-header"><div><h3>Contacto y ubicación</h3><p>Información para documentos y comunicaciones</p></div></div>
          <div class="form-grid">
            <label class="field full"><span>Dirección</span><input name="DIRECCION" value="${companyValue(company,'DIRECCION')}" data-address-autocomplete placeholder="Comience a escribir una dirección"></label>
            <label class="field"><span>Comuna</span><input name="COMUNA" value="${companyValue(company,'COMUNA')}"></label>
            <label class="field"><span>Ciudad</span><input name="CIUDAD" value="${companyValue(company,'CIUDAD')}"></label>
            <label class="field"><span>Región</span><input name="REGION" value="${companyValue(company,'REGION')}"></label>
            <label class="field"><span>País</span><input name="PAIS" value="${companyValue(company,'PAIS','Chile')}"></label>
            <label class="field"><span>Teléfono principal</span><input name="TELEFONO_PRINCIPAL" value="${companyValue(company,'TELEFONO_PRINCIPAL')}"></label>
            <label class="field"><span>Teléfono secundario</span><input name="TELEFONO_SECUNDARIO" value="${companyValue(company,'TELEFONO_SECUNDARIO')}"></label>
            <label class="field"><span>Correo institucional</span><input name="CORREO" type="email" value="${companyValue(company,'CORREO')}"></label>
            <label class="field"><span>Sitio web</span><input name="SITIO_WEB" type="url" value="${companyValue(company,'SITIO_WEB')}" placeholder="https://..."></label>
          </div>
        </article>
        <article class="card">
          <div class="card-header"><div><h3>Preferencias generales</h3><p>Formato utilizado por el sistema</p></div></div>
          <div class="form-grid">
            <label class="field"><span>Zona horaria</span><select name="ZONA_HORARIA"><option ${company.ZONA_HORARIA==='America/Santiago'?'selected':''}>America/Santiago</option><option ${company.ZONA_HORARIA==='America/Sao_Paulo'?'selected':''}>America/Sao_Paulo</option><option ${company.ZONA_HORARIA==='UTC'?'selected':''}>UTC</option></select></label>
            <label class="field"><span>Moneda</span><select name="MONEDA"><option value="CLP" ${company.MONEDA==='CLP'?'selected':''}>Peso chileno</option><option value="USD" ${company.MONEDA==='USD'?'selected':''}>Dólar estadounidense</option><option value="EUR" ${company.MONEDA==='EUR'?'selected':''}>Euro</option></select></label>
            <label class="field"><span>Unidad de distancia</span><select name="UNIDAD_DISTANCIA"><option value="km" ${company.UNIDAD_DISTANCIA!=='mi'?'selected':''}>Kilómetros</option><option value="mi" ${company.UNIDAD_DISTANCIA==='mi'?'selected':''}>Millas</option></select></label>
            <label class="field"><span>Formato de fecha</span><select name="FORMATO_FECHA"><option value="DD-MM-AAAA" ${company.FORMATO_FECHA!=='AAAA-MM-DD'?'selected':''}>Día-Mes-Año</option><option value="AAAA-MM-DD" ${company.FORMATO_FECHA==='AAAA-MM-DD'?'selected':''}>Año-Mes-Día</option></select></label>
            <label class="field full"><span>Texto de pie institucional</span><textarea name="TEXTO_PIE" placeholder="Texto para reportes y documentos">${companyValue(company,'TEXTO_PIE')}</textarea></label>
            <label class="field"><span>Estado</span><select name="ESTADO"><option ${company.ESTADO!=='Inactivo'?'selected':''}>Activo</option><option ${company.ESTADO==='Inactivo'?'selected':''}>Inactivo</option></select></label>
          </div>
          <div class="form-actions"><button class="btn primary" type="submit">Guardar configuración de empresa</button></div>
        </article>
      </div>
    </form>`;
  }

  function readImageFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=()=>reject(new Error('NO_SE_PUDO_LEER_LOGO'));reader.readAsDataURL(file);});}

  async function saveCompany(event){
    event.preventDefault();const form=event.currentTarget;const button=$('button[type="submit"]',form);
    await conCargaBoton(button,'Guardando…',async()=>{
      setSave('Guardando empresa…','saving');
      try{
        const formData=new FormData(form),data=Object.fromEntries(formData.entries());const file=$('#companyLogo')?.files?.[0];
        const payload={data,eliminarLogotipo:$('#removeLogoValue')?.value||'NO'};
        if(file){if(file.size>1572864)throw new Error('LOGOTIPO_DEMASIADO_GRANDE');payload.logotipoBase64=await readImageFile(file);payload.nombreLogotipo=file.name;payload.tipoLogotipo=file.type;}
        const result=await api.request('saveCompany',payload);currentCompany=result.row||data;invalidarListasFormulario('companies');cacheVistasModulo.delete('company');applyBranding(currentCompany);toast('Empresa guardada','La identidad y la información institucional fueron actualizadas.');setSave('Datos guardados');await go('company');
      }catch(error){setSave('Error al guardar','error');toast('No se pudo guardar la empresa',translateError(error),'error');}
    });
  }

  function campoColorTema(nombre,etiqueta,valor,detalle=''){
    return `<label class="theme-color-control"><input type="color" name="${nombre}" value="${esc(valor)}" data-theme-color><span><b>${esc(etiqueta)}</b><small data-theme-code="${nombre}">${esc(valor)}</small>${detalle?`<em class="helper">${esc(detalle)}</em>`:''}</span></label>`;
  }
  function preajustesTemaMarkup(){
    const presets=window.TemaFlotas?.PREAJUSTES||{};
    return Object.entries(presets).map(([id,preset])=>{const v=preset.valores;return `<button class="theme-preset" type="button" data-theme-preset="${esc(id)}"><span class="theme-preset-swatches"><i style="background:${esc(v.COLOR_PRINCIPAL)}"></i><i style="background:${esc(v.COLOR_ACENTO)}"></i><i style="background:${esc(v.COLOR_MENU)}"></i></span><b>${esc(preset.nombre)}</b><small>Aplicar vista previa</small></button>`;}).join('');
  }
  function contrasteTemaMarkup(tema){
    const checks=[['Texto sobre fondo',tema.COLOR_TEXTO,tema.COLOR_FONDO],['Texto sobre tarjetas',tema.COLOR_TEXTO,tema.COLOR_SUPERFICIE],['Blanco sobre principal','#FFFFFF',tema.COLOR_PRINCIPAL],['Blanco sobre menú','#FFFFFF',tema.COLOR_MENU]];
    return checks.map(([label,a,b])=>{const ratio=window.TemaFlotas?.contraste?.(a,b)||0,ok=ratio>=4.5;return `<div class="theme-contrast-row"><span>${esc(label)}</span><b class="${ok?'ok':'warning'}">${ratio.toFixed(1)}:1 · ${ok?'Correcto':'Revisar'}</b></div>`;}).join('');
  }
  function datosTemaFormulario(form){return window.TemaFlotas?.normalizar?.(Object.fromEntries(new FormData(form).entries()))||Object.fromEntries(new FormData(form).entries());}
  function actualizarVistaPreviaTema(form){
    const tema=datosTemaFormulario(form);window.TemaFlotas?.aplicar?.(tema,{guardar:false});
    $$('[data-theme-color]',form).forEach(input=>{const code=form.querySelector(`[data-theme-code="${input.name}"]`);if(code)code.textContent=input.value.toUpperCase();});
    const contrasts=$('#themeContrastList');if(contrasts)contrasts.innerHTML=contrasteTemaMarkup(tema);
    postParent({tipo:'flotas:tema-colores',tema});
  }
  function aplicarValoresTemaFormulario(form,valores){
    const tema=window.TemaFlotas?.normalizar?.(valores)||valores;
    Object.entries(tema).forEach(([key,value])=>{const field=form.elements[key];if(field)field.value=value;});
    actualizarVistaPreviaTema(form);
  }
  async function saveTheme(event){
    event.preventDefault();const form=event.currentTarget,button=$('button[type="submit"]',form),data=datosTemaFormulario(form);
    await conCargaBoton(button,'Guardando tema…',async()=>{
      setSave('Guardando apariencia…','saving');
      try{
        const result=await api.request('saveCompany',{data});currentCompany=result.row||{...(currentCompany||{}),...data};
        invalidarListasFormulario('companies');cacheVistasModulo.delete('settings');cacheVistasModulo.delete('company');
        applyBranding(currentCompany);window.TemaFlotas?.aplicarEmpresa?.(currentCompany,{guardar:true});
        toast('Colores guardados','La nueva identidad visual se aplicó al acceso, menú principal y todos los módulos.');setSave('Apariencia guardada');
      }catch(error){setSave('Error al guardar','error');toast('No se pudieron guardar los colores',translateError(error),'error');}
    });
  }
  async function renderSettings(){
    const remote=api.isRemote();let company=currentCompany||{};
    try{const result=await api.request('list',{resource:'companies'});company=(result.rows||[])[0]||company;currentCompany=company;applyBranding(company);}catch(_){ }
    const tema=window.TemaFlotas?.normalizar?.(company)||company;
    return heading('PARÁMETROS','Configuración','Defina la conexión, el modo de visualización y la identidad cromática de todo el sistema.')+
    `<div class="settings-grid"><article class="card"><div class="card-header"><div><h3>Base de datos</h3><p>Estado de la información del sistema</p></div>${status(remote?'Central conectada':'Local activa')}</div><div class="info-grid"><div class="info-item"><span>Tipo</span><b>${remote?'Base de datos central':'Base de datos local'}</b></div><div class="info-item"><span>Sincronización</span><b>${remote?'Activa entre dispositivos':'Solo en este dispositivo'}</b></div></div></article><article class="card"><div class="card-header"><div><h3>Modo de pantalla</h3><p>Preferencia individual de este dispositivo</p></div></div><div class="setting-row"><div><b>Modo oscuro</b><span>Puede cambiarlo sin modificar la paleta guardada</span></div><label class="switch"><input id="darkSwitch" type="checkbox" ${document.body.classList.contains('dark')?'checked':''}><i></i></label></div><button class="btn soft" data-nav="company">Abrir datos de empresa</button></article></div>`+
    `<section class="theme-settings-shell"><article class="card theme-editor-card"><div class="theme-intro"><div><span class="eyebrow">IDENTIDAD VISUAL GLOBAL</span><h3>Colores del sistema</h3><p>Los colores se guardan en la base central y se aplican automáticamente al inicio de sesión, al menú principal y a cada módulo independiente.</p></div>${status('Vista previa automática')}</div><div class="theme-presets">${preajustesTemaMarkup()}</div><form id="themeForm"><div class="theme-mode-row"><label class="field"><span>Tema predeterminado para nuevos dispositivos</span><select name="TEMA_PREDETERMINADO"><option ${tema.TEMA_PREDETERMINADO==='Sistema'?'selected':''}>Sistema</option><option ${tema.TEMA_PREDETERMINADO==='Claro'?'selected':''}>Claro</option><option ${tema.TEMA_PREDETERMINADO==='Oscuro'?'selected':''}>Oscuro</option></select></label><p class="helper">Cada usuario puede alternar temporalmente entre claro y oscuro desde el botón superior.</p></div><div class="theme-config-layout"><div class="theme-color-sections"><section class="theme-color-group"><h4>Marca y acciones</h4><p>Botones, enlaces, indicadores y estados del sistema.</p><div class="theme-color-grid">${campoColorTema('COLOR_PRINCIPAL','Color principal',tema.COLOR_PRINCIPAL)}${campoColorTema('COLOR_SECUNDARIO','Color principal intenso',tema.COLOR_SECUNDARIO)}${campoColorTema('COLOR_ACENTO','Color de acento',tema.COLOR_ACENTO)}${campoColorTema('COLOR_EXITO','Éxito y conectado',tema.COLOR_EXITO)}${campoColorTema('COLOR_ADVERTENCIA','Advertencias',tema.COLOR_ADVERTENCIA)}${campoColorTema('COLOR_PELIGRO','Errores y bloqueos',tema.COLOR_PELIGRO)}</div></section><section class="theme-color-group"><h4>Modo claro</h4><p>Fondos, tarjetas, textos y bordes de la interfaz clara.</p><div class="theme-color-grid">${campoColorTema('COLOR_FONDO','Fondo general',tema.COLOR_FONDO)}${campoColorTema('COLOR_SUPERFICIE','Tarjetas y paneles',tema.COLOR_SUPERFICIE)}${campoColorTema('COLOR_TEXTO','Texto principal',tema.COLOR_TEXTO)}${campoColorTema('COLOR_TEXTO_SECUNDARIO','Texto secundario',tema.COLOR_TEXTO_SECUNDARIO)}${campoColorTema('COLOR_BORDE','Bordes',tema.COLOR_BORDE)}${campoColorTema('COLOR_MENU','Menú lateral',tema.COLOR_MENU)}${campoColorTema('COLOR_MENU_SECUNDARIO','Degradado del menú',tema.COLOR_MENU_SECUNDARIO)}</div></section><section class="theme-color-group"><h4>Modo oscuro</h4><p>Colores usados cuando el usuario activa el modo oscuro.</p><div class="theme-color-grid">${campoColorTema('COLOR_FONDO_OSCURO','Fondo oscuro',tema.COLOR_FONDO_OSCURO)}${campoColorTema('COLOR_SUPERFICIE_OSCURO','Tarjetas oscuras',tema.COLOR_SUPERFICIE_OSCURO)}${campoColorTema('COLOR_TEXTO_OSCURO','Texto oscuro',tema.COLOR_TEXTO_OSCURO)}${campoColorTema('COLOR_TEXTO_SECUNDARIO_OSCURO','Texto secundario oscuro',tema.COLOR_TEXTO_SECUNDARIO_OSCURO)}${campoColorTema('COLOR_BORDE_OSCURO','Bordes oscuros',tema.COLOR_BORDE_OSCURO)}</div></section></div><aside class="theme-preview-panel"><div class="theme-preview-window"><div class="theme-preview-top"><i></i><b>Vista previa del sistema</b></div><div class="theme-preview-body"><div class="theme-preview-menu"><span class="active"></span><span></span><span></span><span></span></div><div class="theme-preview-content"><h4>Panel principal</h4><div class="theme-preview-kpis"><div><b>24</b><small>Vehículos</small></div><div><b>18</b><small>En operación</small></div><div><b>6</b><small>Disponibles</small></div><div><b>2</b><small>Alertas</small></div></div><button class="theme-preview-button" type="button">Acción principal</button></div></div></div><article class="card"><div class="card-header"><div><h3>Contraste</h3><p>Lectura recomendada: 4.5:1 o superior</p></div></div><div class="theme-contrast-list" id="themeContrastList">${contrasteTemaMarkup(tema)}</div></article></aside></div><div class="theme-form-actions"><button class="btn soft" type="button" data-theme-discard>Descartar vista previa</button><button class="btn soft" type="button" data-theme-defaults>Restaurar colores originales</button><button class="btn primary" type="submit">Guardar colores del sistema</button></div></form></article></section>`+
    `<section class="operation-location-settings"><article class="card"><div class="card-header"><div><span class="eyebrow">CONTROL GEOGRÁFICO</span><h3>Punto de inicio y finalización</h3><p>Esta ubicación bloquea el inicio y el cierre fuera del perímetro autorizado.</p></div>${configuracionPuntoOperacion(company).configurada?status('Configurado'):status('Pendiente')}</div><form id="operationLocationForm" class="form-grid"><input type="hidden" name="VALIDAR_UBICACION_OPERACION" value="SI"><div class="operation-policy-fixed full"><i>🔒</i><div><b>Validación GPS obligatoria</b><span>Este control no puede desactivarse: toda operación debe iniciar y finalizar en el punto autorizado.</span></div></div><label class="field"><span>Nombre del punto base</span><input name="PUNTO_OPERACION_NOMBRE" value="${companyValue(company,'PUNTO_OPERACION_NOMBRE','Base operacional')}" required></label><label class="field full"><span>Dirección del punto base</span><input name="PUNTO_OPERACION_DIRECCION" value="${companyValue(company,'PUNTO_OPERACION_DIRECCION',company.DIRECCION||'')}" data-address-autocomplete data-lat-target="PUNTO_OPERACION_LATITUD" data-lng-target="PUNTO_OPERACION_LONGITUD" required placeholder="Seleccione una dirección exacta"></label><label class="field"><span>Latitud</span><input name="PUNTO_OPERACION_LATITUD" type="number" step="any" value="${companyValue(company,'PUNTO_OPERACION_LATITUD')}" required></label><label class="field"><span>Longitud</span><input name="PUNTO_OPERACION_LONGITUD" type="number" step="any" value="${companyValue(company,'PUNTO_OPERACION_LONGITUD')}" required></label><label class="field"><span>Radio para iniciar</span><div class="input-suffix"><input name="RADIO_INICIO_METROS" type="number" min="10" max="5000" value="${companyValue(company,'RADIO_INICIO_METROS','150')}" required><span>metros</span></div></label><label class="field"><span>Radio para finalizar</span><div class="input-suffix"><input name="RADIO_FIN_METROS" type="number" min="10" max="5000" value="${companyValue(company,'RADIO_FIN_METROS','150')}" required><span>metros</span></div></label><label class="field"><span>Precisión GPS máxima</span><div class="input-suffix"><input name="PRECISION_GPS_MAXIMA_METROS" type="number" min="10" max="5000" value="${companyValue(company,'PRECISION_GPS_MAXIMA_METROS','120')}" required><span>metros</span></div></label><input type="hidden" name="RETORNO_BASE_OBLIGATORIO" value="SI"><div class="operation-location-status full" data-settings-location-status><i>⌖</i><div><b>${configuracionPuntoOperacion(company).configurada?'Punto guardado':'Ubicación pendiente'}</b><span>${configuracionPuntoOperacion(company).configurada?`${esc(configuracionPuntoOperacion(company).direccion)} · ${number(configuracionPuntoOperacion(company).radioInicio)} m al iniciar · ${number(configuracionPuntoOperacion(company).radioFin)} m al finalizar`:'Seleccione una dirección o capture la ubicación actual.'}</span></div></div><div class="form-actions"><button class="btn soft" type="button" data-capture-base-location>⌖ Usar mi ubicación actual</button><button class="btn primary" type="submit">Guardar punto operacional</button></div></form></article></section>`+
    `<div class="danger-zone" style="margin-top:18px"><h3>Limpiar datos operativos</h3><p>Elimina vehículos, conductores, operaciones, check-ins, GPS, rutas, conexiones, mantenciones, documentos, notificaciones, alertas, reportes y bitácora. Conserva usuarios, roles, empresa y colores.</p><button class="btn danger" data-clear-data>Limpiar datos operativos</button></div>`;
  }

  async function sincronizarSistema(button) {
    await conCargaBoton(button,'Sincronizando…',async()=>{
      if(sincronizacionPendiente)return sincronizacionPendiente;
      sincronizacionPendiente=(async()=>{
        setSave('Sincronizando…','saving');
        api.invalidate();
        invalidarListasFormulario();
        cacheVistasModulo.clear();
        precargaIniciada=false;
        try{
          const completed=await go(currentSection,{force:true});
          if(completed===false)throw new Error('SINCRONIZACION_NO_COMPLETADA');
          await refreshNotificationBadge();
          setSave('Sincronización completa');
          toast('Datos sincronizados','La información visible fue actualizada desde la base de datos.');
        }catch(error){
          setSave('Error al sincronizar','error');
          toast('No se pudo sincronizar',translateError(error),'error');
        }
      })();
      try{return await sincronizacionPendiente;}
      finally{sincronizacionPendiente=null;}
    });
  }

  function bindSection() {
    $$('[data-nav]').forEach(btn=>btn.addEventListener('click',()=>navigateSection(btn.dataset.nav)));
    $$('[data-add]').forEach(btn=>btn.addEventListener('click',()=>openResourceModal(btn.dataset.add)));
    $$('[data-edit]').forEach(btn=>btn.addEventListener('click',()=>{const [resource,id]=btn.dataset.edit.split(':');openResourceModal(resource,registroFormulario(resource,id),id);}));
    $$('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>deleteRecord(btn.dataset.delete,btn)));
    $$('[data-export]').forEach(btn=>btn.addEventListener('click',()=>conCargaBoton(btn,'Exportando…',()=>exportResource(btn.dataset.export))));
    $$('[data-table-search]').forEach(input=>input.addEventListener('input',()=>filterTable(input)));
    $$('[data-sync],[data-refresh],[data-retry]').forEach(btn=>btn.addEventListener('click',()=>sincronizarSistema(btn)));
    $$('[data-new-operation]').forEach(btn=>btn.addEventListener('click',()=>openOperationModal()));
    $$('[data-new-checkin]').forEach(btn=>btn.addEventListener('click',openCheckinModal));
    $('[data-focus-checkin]')?.addEventListener('click',()=>$('#checkinVisibleCard')?.scrollIntoView({behavior:'smooth',block:'start'}));
    const inlineCheckin=$('#checkinInlineForm');if(inlineCheckin)bindInlineCheckinForm(inlineCheckin);
    $$('[data-review-checkin]').forEach(btn=>btn.addEventListener('click',()=>openCheckinReviewModal(btn.dataset.reviewCheckin)));
    $$('[data-checkin-detail]').forEach(btn=>btn.addEventListener('click',()=>openCheckinDetailModal(btn.dataset.checkinDetail)));
    $$('[data-new-route]').forEach(btn=>btn.addEventListener('click',openRouteModal));
    $$('[data-route-state]').forEach(btn=>btn.addEventListener('click',()=>conCargaBoton(btn,'Actualizando…',()=>changeRouteState(btn.dataset.routeState))));
    $$('[data-new-notification]').forEach(btn=>btn.addEventListener('click',openNotificationModal));
    $$('[data-read-notification]').forEach(btn=>btn.addEventListener('click',()=>conCargaBoton(btn,'Actualizando…',()=>readNotification(btn.dataset.readNotification))));
    $$('[data-user-permissions]').forEach(btn=>btn.addEventListener('click',()=>openUserPermissionsModal(btn.dataset.userPermissions)));
    $$('[data-voice-command]').forEach(btn=>btn.addEventListener('click',iniciarComandoVoz));
    $$('[data-speak-notifications]').forEach(btn=>btn.addEventListener('click',()=>leerNotificacionesVoz()));
    $$('[data-stop-voice]').forEach(btn=>btn.addEventListener('click',detenerVoz));
    $$('[data-finish-operation]').forEach(btn=>btn.addEventListener('click',()=>finishOperation(btn.dataset.finishOperation,btn)));
    $$('[data-open-qr]').forEach(btn=>btn.addEventListener('click',openQr));
    $$('[data-refresh-locations]').forEach(btn=>btn.addEventListener('click',()=>conCargaBoton(btn,'Sincronizando…',()=>refreshLocations(true,false))));
    $$('[data-capture-gps]').forEach(btn=>btn.addEventListener('click',()=>conCargaBoton(btn,'Obteniendo GPS…',captureGps)));
    $$('[data-toggle-tracking]').forEach(btn=>btn.addEventListener('click',()=>conCargaBoton(btn,gpsWatchId===null?'Activando…':'Deteniendo…',toggleTracking).then(updateTrackingUi)));
    $$('[data-gps-scope]').forEach(btn=>btn.addEventListener('click',()=>changeGpsTrackingScope(btn.dataset.gpsScope)));
    $$('[data-gps-vehicle]').forEach(input=>input.addEventListener('change',()=>toggleGpsVehicle(input.dataset.gpsVehicle,input.checked)));
    $('[data-gps-select-all]')?.addEventListener('click',selectAllGpsVehicles);
    $('[data-gps-clear]')?.addEventListener('click',clearGpsVehicles);
    $('[data-gps-apply]')?.addEventListener('click',event=>conCargaBoton(event.currentTarget,'Aplicando…',applyGpsVehicleFilter));
    $('[data-gps-reset]')?.addEventListener('click',resetGpsVehicleFilterDraft);
    $('[data-gps-vehicle-search]')?.addEventListener('input',event=>filterGpsVehicleOptions(event.target.value));
    $$('[data-focus-location]').forEach(btn=>btn.addEventListener('click',()=>{const [lat,lng]=btn.dataset.focusLocation.split(',').map(Number);mapaFlota?.establecerVista(lat,lng,16);}));
    const operationLocationForm=$('#operationLocationForm');if(operationLocationForm){
      bindAddressAutocomplete(operationLocationForm);
      $('[data-capture-base-location]',operationLocationForm)?.addEventListener('click',event=>conCargaBoton(event.currentTarget,'Obteniendo GPS…',async()=>{try{const location=await obtenerUbicacionNavegador();operationLocationForm.elements.PUNTO_OPERACION_LATITUD.value=location.latitud;operationLocationForm.elements.PUNTO_OPERACION_LONGITUD.value=location.longitud;const node=$('[data-settings-location-status]',operationLocationForm);if(node){node.className='operation-location-status valid';node.innerHTML=`<i>✓</i><div><b>Coordenadas capturadas</b><span>${location.latitud.toFixed(6)}, ${location.longitud.toFixed(6)} · precisión ±${Math.round(location.precision)} m</span></div>`;}toast('Ubicación capturada','Revise la dirección y guarde la configuración.');}catch(error){toast('No se obtuvo la ubicación',translateError(error),'error');}}));
      operationLocationForm.addEventListener('submit',event=>{event.preventDefault();const button=$('button[type="submit"]',operationLocationForm);conCargaBoton(button,'Guardando punto…',async()=>{try{const data=Object.fromEntries(new FormData(operationLocationForm).entries());data.VALIDAR_UBICACION_OPERACION='SI';const result=await api.request('saveCompany',{data});currentCompany=result.row||{...(currentCompany||{}),...data};invalidarListasFormulario('companies');['settings','operations','routes'].forEach(section=>cacheVistasModulo.delete(section));toast('Punto operacional guardado','El inicio y la finalización quedan bloqueados fuera de esta ubicación.');await go('settings');}catch(error){toast('No se guardó el punto',translateError(error),'error');}});});
    }
    $('[data-clear-data]')?.addEventListener('click',event=>clearData(event.currentTarget));
    $('#darkSwitch')?.addEventListener('change',event=>setTheme(event.target.checked));
    const themeForm=$('#themeForm');if(themeForm){
      themeForm.addEventListener('submit',saveTheme);
      $$('[data-theme-color]',themeForm).forEach(input=>input.addEventListener('input',()=>actualizarVistaPreviaTema(themeForm)));
      themeForm.elements.TEMA_PREDETERMINADO?.addEventListener('change',()=>actualizarVistaPreviaTema(themeForm));
      $$('[data-theme-preset]').forEach(button=>button.addEventListener('click',()=>{const preset=window.TemaFlotas?.PREAJUSTES?.[button.dataset.themePreset];if(preset)aplicarValoresTemaFormulario(themeForm,preset.valores);}));
      $('[data-theme-defaults]')?.addEventListener('click',()=>aplicarValoresTemaFormulario(themeForm,window.TemaFlotas?.PREDETERMINADOS||{}));
      $('[data-theme-discard]')?.addEventListener('click',()=>aplicarValoresTemaFormulario(themeForm,currentCompany||window.TemaFlotas?.guardado?.()||{}));
    }
    $('#companyForm')?.addEventListener('submit',saveCompany);
    $('#companyLogo')?.addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;if(file.size>1572864){event.target.value='';return toast('Logotipo demasiado grande','El archivo debe pesar como máximo 1,5 MB.','error');}$('#companyLogoPreview').src=await readImageFile(file);$('#removeLogoValue').value='NO';});
    $('[data-remove-company-logo]')?.addEventListener('click',()=>{$('#companyLogoPreview').src=defaultLogo;$('#companyLogo').value='';$('#removeLogoValue').value='SI';});
    bindAddressAutocomplete($('#content'));
  }

  function opcionesListaDinamica(kind, rows, selected = '') {
    const selectedValue=String(selected||'');
    let values=[...(rows||[])],placeholder='Seleccione';
    if(kind==='users'){placeholder='Sin asociar';}
    if(kind==='routeDrivers'){values=values.filter(row=>row.ESTADO!=='Inactivo');}
    if(kind==='routeVehicles'){placeholder='Por definir';values=values.filter(row=>row.ESTADO!=='Inactivo');}
    if(kind==='notificationDrivers'){values=values.filter(row=>row.ESTADO!=='Inactivo');}
    if(['operationVehicles','checkinVehicles'].includes(kind)){
      values=values.filter(row=>row.ESTADO==='Disponible'||String(row.ID)===selectedValue);
      const selectedRecord=registroFormulario('vehicles',selectedValue);
      if(selectedRecord&&!values.some(row=>String(row.ID)===selectedValue))values.unshift(selectedRecord);
    }
    if(['operationDrivers','checkinDrivers'].includes(kind))values=values.filter(row=>row.ESTADO==='Disponible'||String(row.ID)===selectedValue);
    const label=row=>{
      if(kind==='users')return `${row.NOMBRE||'Usuario'} · ${row.CORREO||''}`;
      if(['drivers','routeDrivers','notificationDrivers','operationDrivers','checkinDrivers'].includes(kind))return `${row.NOMBRE||'Conductor'} · ${row.RUT||''}`;
      return `${row.PATENTE||'Vehículo'} · ${row.MARCA||''} ${row.MODELO||''}`;
    };
    const emptyLabel=kind.includes('Driver')||kind==='drivers'?'No hay conductores disponibles':kind==='users'?'No hay usuarios disponibles':'No hay vehículos disponibles';
    return `<option value="">${values.length?placeholder:emptyLabel}</option>${values.map(row=>`<option value="${esc(row.ID)}" ${String(row.ID)===selectedValue?'selected':''}>${esc(label(row).trim())}</option>`).join('')}`;
  }

  function selectorDinamico(resource,kind,name,selected='',required=false) {
    const loaded=cacheListasFormulario.has(resource);
    const options=loaded?opcionesListaDinamica(kind,listaFormulario(resource),selected):'<option value="">Cargando opciones…</option>';
    return `<select name="${name}" data-list-resource="${resource}" data-list-kind="${kind}" data-selected="${esc(selected)}" ${required?'required':''} ${loaded?'':'disabled'}>${options}</select>`;
  }

  function actualizarSelectoresModal(token) {
    if(token!==secuenciaModal||!$('#modalBackdrop').classList.contains('open'))return;
    $$('select[data-list-resource]',$('#modalBody')).forEach(select=>{
      const resource=select.dataset.listResource;
      if(!cacheListasFormulario.has(resource))return;
      const selected=select.dataset.selected||select.value||'';
      select.innerHTML=opcionesListaDinamica(select.dataset.listKind,listaFormulario(resource),selected);
      select.disabled=false;
      if(selected)select.value=selected;
    });
  }

  function prepararListasModal(token, resources=[]) {
    const pending=[...new Set(resources)].filter(resource=>!cacheListasFormulario.has(resource));
    actualizarSelectoresModal(token);
    if(!pending.length)return;
    const submit=$('button[type="submit"]',$('#modalBody'));
    const finalizar=activarCargaBoton(submit,'Preparando opciones…');
    let loadError=null;
    Promise.all(pending.map(cargarListaFormulario))
      .then(()=>actualizarSelectoresModal(token))
      .catch(error=>{
        loadError=error;
        if(token===secuenciaModal)toast('No se pudieron cargar las opciones',translateError(error),'error');
      })
      .finally(()=>{
        finalizar?.();
        if(loadError&&token===secuenciaModal&&submit){submit.disabled=true;submit.textContent='Opciones no disponibles';}
      });
  }

  function contenidoCargaModal(text='Preparando información…') {
    return `<div class="modal-loading" role="status"><i></i><div><b>${esc(text)}</b><span>El formulario ya está abierto y se completará en un momento.</span></div></div>`;
  }

  function pintarModalRecurso(resource,record,token) {
    if(token!==secuenciaModal)return;
    const definition=resourceFields[resource];if(!definition)return;
    $('#modalEyebrow').textContent=definition.eyebrow;$('#modalTitle').textContent=`${record?'Editar':'Nuevo'} ${definition.title.toLowerCase()}`;
    const controls=definition.fields.map(([name,label,type,option])=>{
      const required=option===true&&!(record&&name==='CONTRASENA');const current=record?.[name]??'';let control='';
      if(type==='select'){
        const options=Array.isArray(option)?option:[];control=`<select name="${name}" ${required?'required':''}><option value="">Seleccione</option>${options.map(item=>{const value=Array.isArray(item)?item[0]:item,text=Array.isArray(item)?item[1]:item;return `<option value="${esc(value)}" ${String(current)===String(value)?'selected':''}>${esc(text)}</option>`;}).join('')}</select>`;
      }else if(type==='userSelect')control=selectorDinamico('users','users',name,current,false);
      else if(type==='vehicleSelect')control=selectorDinamico('vehicles','vehicles',name,current,true);
      else if(type==='textarea')control=`<textarea name="${name}" ${required?'required':''}>${esc(current)}</textarea>`;
      else{const value=(type==='date'&&current)?String(current).slice(0,10):current;control=`<input name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''}>`;}
      const full=['DESCRIPCION','OBSERVACIONES','MENSAJE','DIRECCION_ARCHIVO'].includes(name)?'full':'';
      return `<label class="field ${full}"><span>${label}</span>${control}</label>`;
    }).join('');
    $('#modalBody').innerHTML=`<form class="form-grid" id="resourceForm">${controls}<div class="form-actions"><button class="btn soft" type="button" data-cancel-modal>Cancelar</button><button class="btn primary" type="submit">Guardar registro</button></div></form>`;
    $('[data-cancel-modal]',$('#modalBody')).addEventListener('click',closeModal);
    $('#resourceForm').addEventListener('submit',event=>saveResource(event,resource,record?.ID));
    const resources=[];
    if(definition.fields.some(field=>field[2]==='userSelect'))resources.push('users');
    if(definition.fields.some(field=>field[2]==='vehicleSelect'))resources.push('vehicles');
    prepararListasModal(token,resources);
  }

  function openResourceModal(resource,record=null,id='') {
    const definition=resourceFields[resource];if(!definition)return;
    $('#modalEyebrow').textContent=definition.eyebrow;
    $('#modalTitle').textContent=`${id||record?'Editar':'Nuevo'} ${definition.title.toLowerCase()}`;
    if(!record&&id)$('#modalBody').innerHTML=contenidoCargaModal('Cargando el registro…');
    const token=openModal();
    if(record||!id){pintarModalRecurso(resource,record,token);return;}
    api.request('get',{resource,id})
      .then(result=>{
        const row=guardarRegistro(resource,result.row);
        if(!row)throw new Error('REGISTRO_NO_ENCONTRADO');
        pintarModalRecurso(resource,row,token);
      })
      .catch(error=>{
        if(token!==secuenciaModal)return;
        $('#modalBody').innerHTML=`<div class="modal-error"><b>No se pudo cargar el registro</b><p>${esc(translateError(error))}</p><button class="btn soft" type="button" data-cancel-modal>Cerrar</button></div>`;
        $('[data-cancel-modal]',$('#modalBody')).addEventListener('click',closeModal);
      });
  }

  async function saveResource(event,resource,id){
    event.preventDefault();const form=event.currentTarget;const data=Object.fromEntries(new FormData(form).entries());Object.keys(data).forEach(key=>{if(data[key]==='')delete data[key]});const button=$('button[type="submit"]',form);
    await conCargaBoton(button,'Guardando…',async()=>{
      try{
        setSave('Guardando…','saving');await api.request(id?'update':'create',{resource,id,data});
        invalidarListasFormulario(resource);cacheVistasModulo.delete(currentSection);closeModal();toast('Registro guardado','La información quedó almacenada.');setSave('Datos guardados');await go(currentSection);
      }catch(error){setSave('Error al guardar','error');toast('No se pudo guardar',translateError(error),'error');}
    });
  }

  async function deleteRecord(value,button){
    const [resource,id]=value.split(':');if(!confirm('¿Eliminar este registro? Quedará desactivado en la base de datos.'))return;
    await conCargaBoton(button,'Eliminando…',async()=>{
      try{await api.request('delete',{resource,id});invalidarListasFormulario(resource);cacheVistasModulo.delete(currentSection);toast('Registro eliminado');await go(currentSection);}
      catch(error){toast('No se pudo eliminar',translateError(error),'error');}
    });
  }
  function filterTable(input){const q=input.value.trim().toLowerCase();$$('[data-search-row]').forEach(row=>row.style.display=row.dataset.searchRow.includes(q)?'':'none');}

  function permissionMatrixMarkup(user){
    const custom=new Set(Array.isArray(user.PERMISOS_PERSONALIZADOS)?user.PERMISOS_PERSONALIZADOS:[]),admin=user.ROL_ID==='ROL-ADMIN';
    const mandatory=new Set(['PANEL_PRINCIPAL:LEER','CONEXIONES:CREAR','CONEXIONES:ACTUALIZAR']);
    return `<div class="permission-help"><b>${admin?'Administrador con acceso completo':'Permisos de '+esc(user.NOMBRE)}</b><span>${admin?'Los permisos del administrador no pueden reducirse para evitar perder el control del sistema.':'Puede mantener los permisos del rol o definir una selección personalizada. Los permisos técnicos mínimos aparecen bloqueados y permanecen activos para no interrumpir la sesión.'}</span></div><form id="userPermissionsForm" class="permission-form"><input type="hidden" name="USUARIO_ID" value="${esc(user.ID)}"><div class="permission-mode"><label><input type="radio" name="MODO_PERMISOS" value="ROL" ${user.MODO_PERMISOS!=='PERSONALIZADO'||admin?'checked':''} ${admin?'disabled':''}><span>Usar permisos del rol</span></label><label><input type="radio" name="MODO_PERMISOS" value="PERSONALIZADO" ${user.MODO_PERMISOS==='PERSONALIZADO'&&!admin?'checked':''} ${admin?'disabled':''}><span>Personalizar permisos</span></label></div><div class="permission-matrix ${user.MODO_PERMISOS==='PERSONALIZADO'&&!admin?'enabled':''}" data-permission-matrix><div class="permission-row permission-head"><b>Módulo</b>${permissionActions.map(([,label])=>`<b>${label}</b>`).join('')}</div>${permissionCatalog.map(([module,label])=>`<div class="permission-row"><span>${esc(label)}</span>${permissionActions.map(([action])=>{const value=`${module}:${action}`,required=mandatory.has(value);return `<label title="${required?'Permiso técnico obligatorio':''}"><input type="checkbox" name="PERMISOS" value="${value}" ${custom.has(value)||required?'checked':''} ${admin||required?'disabled':''}><i></i></label>`;}).join('')}</div>`).join('')}</div><div class="form-actions"><button class="btn soft" type="button" data-cancel-modal>Cancelar</button><button class="btn primary" type="submit" ${admin?'disabled':''}>Guardar permisos sin cerrar sesión</button></div></form>`;
  }

  function openUserPermissionsModal(userId){
    const user=registroFormulario('users',userId);if(!user){toast('Usuario no disponible','Sincronice la lista e intente nuevamente.','error');return;}
    $('#modalEyebrow').textContent='CONTROL DE ACCESO';$('#modalTitle').textContent='Permisos del usuario';$('#modalBody').innerHTML=permissionMatrixMarkup(user);openModal();
    const form=$('#userPermissionsForm'),matrix=$('[data-permission-matrix]',form);$('[data-cancel-modal]',form).onclick=closeModal;
    $$('input[name="MODO_PERMISOS"]',form).forEach(radio=>radio.addEventListener('change',()=>matrix.classList.toggle('enabled',radio.value==='PERSONALIZADO'&&radio.checked)));
    form.onsubmit=async event=>{event.preventDefault();const button=$('button[type="submit"]',form),mode=form.elements.MODO_PERMISOS.value,permissions=[...form.querySelectorAll('input[name="PERMISOS"]:checked')].map(input=>input.value);await conCargaBoton(button,'Guardando…',async()=>{try{const result=await api.request('saveUserPermissions',{data:{USUARIO_ID:userId,MODO_PERMISOS:mode,PERMISOS:permissions}});guardarRegistro('users',result.row);invalidarListasFormulario('users');cacheVistasModulo.delete('users');if(currentUser.ID===userId){currentUser=result.row;const auth=api.getAuth();api.setAuth({...auth,user:result.row});postParent({tipo:'flotas:modulo-listo',usuario:result.row,seccion:currentSection});}closeModal();toast('Permisos actualizados','La sesión se mantuvo abierta y los nuevos permisos se aplicarán al cambiar de módulo.');await go('users');}catch(error){toast('No se pudieron actualizar los permisos',translateError(error),'error');}});};
  }

  function reconocimientoDisponible(){return window.SpeechRecognition||window.webkitSpeechRecognition||null;}
  function actualizarEstadoVoz(texto){const element=$('#voiceCommandStatus');if(element)element.textContent=texto;}
  function hablar(texto){if(!('speechSynthesis'in window)){toast('Lectura de voz no disponible','Este navegador no permite reproducir notificaciones por voz.','error');return false;}window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(String(texto||''));utterance.lang='es-CL';utterance.rate=1;utterance.pitch=1;window.speechSynthesis.speak(utterance);return true;}
  function detenerVoz(){try{reconocimientoVoz?.stop();}catch(_){ }if('speechSynthesis'in window)window.speechSynthesis.cancel();vozEscuchando=false;actualizarEstadoVoz('Control de voz detenido.');}
  function notificacionesActuales(){return (cacheListasFormulario.get('notifications')||[]).slice().sort((a,b)=>new Date(b.FECHA_ENVIO||0)-new Date(a.FECHA_ENVIO||0));}
  function leerNotificacionesVoz(){const unread=notificacionesActuales().filter(item=>item.LEIDA!=='SI');if(!unread.length){hablar('No tiene notificaciones pendientes.');actualizarEstadoVoz('No hay notificaciones pendientes.');return;}const limit=unread.slice(0,10),text=`Tiene ${unread.length} notificaciones pendientes. `+limit.map((item,index)=>`Notificación ${index+1}. ${item.TITULO}. ${item.MENSAJE}`).join('. ');hablar(text);actualizarEstadoVoz(`Leyendo ${limit.length} de ${unread.length} notificaciones pendientes.`);}
  async function marcarTodasNotificacionesLeidas(){const unread=notificacionesActuales().filter(item=>item.LEIDA!=='SI');if(!unread.length){hablar('No hay notificaciones pendientes.');return;}actualizarEstadoVoz('Marcando notificaciones como leídas…');for(const item of unread){await api.request('readNotification',{id:item.ID});}invalidarListasFormulario('notifications');cacheVistasModulo.delete('notifications');hablar(`${unread.length} notificaciones fueron marcadas como leídas.`);toast('Notificaciones actualizadas',`${unread.length} mensajes marcados como leídos.`);await go('notifications');}
  async function ejecutarComandoVoz(transcript){const command=String(transcript||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();actualizarEstadoVoz(`Comando detectado: “${transcript}”`);if(/detener|parar|silencio/.test(command)){detenerVoz();return;}if(/leer.*(notificacion|pendiente)|notificacion.*leer/.test(command)){leerNotificacionesVoz();return;}if(/marcar.*todas.*leida/.test(command)){await marcarTodasNotificacionesLeidas();return;}if(/crear|nueva|enviar/.test(command)&&/notificacion|mensaje/.test(command)){openNotificationModal();hablar('Formulario de notificación abierto. Puede usar los micrófonos para dictar el título y el mensaje.');return;}hablar('Comando no reconocido. Diga leer notificaciones, marcar todas como leídas, crear notificación o detener lectura.');actualizarEstadoVoz('Comando no reconocido. Revise los ejemplos disponibles.');}
  function iniciarComandoVoz(){const Recognition=reconocimientoDisponible();if(!Recognition){toast('Reconocimiento de voz no disponible','Use Chrome o un navegador compatible. La lectura en voz alta seguirá disponible.','error');actualizarEstadoVoz('Este navegador no admite reconocimiento de voz.');return;}detenerVoz();reconocimientoVoz=new Recognition();reconocimientoVoz.lang='es-CL';reconocimientoVoz.interimResults=false;reconocimientoVoz.continuous=false;reconocimientoVoz.maxAlternatives=1;reconocimientoVoz.onstart=()=>{vozEscuchando=true;actualizarEstadoVoz('Escuchando… diga un comando.');};reconocimientoVoz.onresult=event=>ejecutarComandoVoz(event.results?.[0]?.[0]?.transcript||'');reconocimientoVoz.onerror=event=>{vozEscuchando=false;const message=event.error==='not-allowed'?'Permiso de micrófono bloqueado.':'No se pudo reconocer el comando.';actualizarEstadoVoz(message);toast('Comando de voz',message,'error');};reconocimientoVoz.onend=()=>{vozEscuchando=false;};try{reconocimientoVoz.start();}catch(error){toast('Comando de voz','No se pudo activar el micrófono.','error');}}
  function dictarEnCampo(campo,boton){const Recognition=reconocimientoDisponible();if(!Recognition){toast('Dictado no disponible','Este navegador no admite reconocimiento de voz.','error');return;}const recognition=new Recognition();recognition.lang='es-CL';recognition.interimResults=false;recognition.continuous=false;const original=boton.textContent;boton.textContent='●';boton.classList.add('listening');recognition.onresult=event=>{const text=event.results?.[0]?.[0]?.transcript||'';campo.value=(campo.value?campo.value.trim()+' ':'')+text;campo.dispatchEvent(new Event('input',{bubbles:true}));};recognition.onerror=()=>toast('Dictado','No se pudo reconocer la voz.','error');recognition.onend=()=>{boton.textContent=original;boton.classList.remove('listening');};try{recognition.start();}catch(_){boton.textContent=original;boton.classList.remove('listening');}}

  function openRouteModal(){
    const base=configuracionPuntoOperacion();
    $('#modalEyebrow').textContent='PLANIFICACIÓN';$('#modalTitle').textContent='Asignar nueva ruta';
    $('#modalBody').innerHTML=`<form class="form-grid" id="routeForm">${base.configurada?`<div class="operation-base-summary full"><i>⌖</i><div><b>Salida operacional: ${esc(base.nombre)}</b><span>La ruta comenzará en ${esc(base.direccion)} y la operación solo podrá cerrarse al regresar a esta base.</span></div></div>`:''}<label class="field"><span>Conductor</span>${selectorDinamico('drivers','routeDrivers','CONDUCTOR_ID','',true)}</label><label class="field"><span>Vehículo</span>${selectorDinamico('vehicles','routeVehicles','VEHICULO_ID')}</label><label class="field"><span>Nombre de la ruta</span><input name="NOMBRE" placeholder="Ej. Entrega sector norte"></label><label class="field"><span>Aplicación de navegación</span><select name="PROVEEDOR_NAVEGACION"><option>Google Maps</option><option>Waze</option></select></label><label class="field full"><span>Origen operacional</span><input name="ORIGEN" value="${esc(base.configurada?base.direccion:'Ubicación actual')}" ${base.configurada?'readonly':'data-address-autocomplete data-lat-target="ORIGEN_LATITUD" data-lng-target="ORIGEN_LONGITUD"'}><input name="ORIGEN_LATITUD" type="hidden" value="${base.configurada?esc(base.latitud):''}"><input name="ORIGEN_LONGITUD" type="hidden" value="${base.configurada?esc(base.longitud):''}"></label><label class="field full"><span>Destino de la ruta</span><input name="DESTINO" required data-address-autocomplete data-lat-target="DESTINO_LATITUD" data-lng-target="DESTINO_LONGITUD" placeholder="Comience a escribir el destino"></label><label class="field"><span>Latitud destino</span><input name="DESTINO_LATITUD" type="number" step="any" readonly placeholder="Se completará automáticamente"></label><label class="field"><span>Longitud destino</span><input name="DESTINO_LONGITUD" type="number" step="any" readonly placeholder="Se completará automáticamente"></label><label class="field"><span>Prioridad</span><select name="PRIORIDAD"><option>Normal</option><option selected>Alta</option><option>Urgente</option></select></label><label class="field full"><span>Instrucciones al conductor</span><textarea name="INSTRUCCIONES" placeholder="Indicaciones, horarios, contacto o restricciones"></textarea></label><div class="form-actions"><button class="btn soft" type="button" data-cancel-modal>Cancelar</button><button class="btn primary" type="submit">Asignar y notificar</button></div></form>`;
    const token=openModal();bindAddressAutocomplete($('#routeForm'));$('[data-cancel-modal]',$('#modalBody')).onclick=closeModal;
    $('#routeForm').onsubmit=async event=>{event.preventDefault();const form=event.currentTarget,button=$('button[type="submit"]',form),data=Object.fromEntries(new FormData(form).entries());await conCargaBoton(button,'Asignando…',async()=>{try{await api.request('assignRoute',{data});invalidarListasFormulario('routes','notifications');cacheVistasModulo.delete('routes');cacheVistasModulo.delete('dashboard');closeModal();toast('Ruta asignada','El conductor recibió una notificación en su bandeja.');await go('routes');}catch(error){toast('No se pudo asignar',translateError(error),'error');}});};
    prepararListasModal(token,['drivers','vehicles']);
  }
  async function changeRouteState(value){const split=value.indexOf(':'),id=value.slice(0,split),state=value.slice(split+1);try{await api.request('updateRouteStatus',{id,ESTADO:state});invalidarListasFormulario('routes','notifications');cacheVistasModulo.delete(currentSection);cacheVistasModulo.delete('dashboard');toast('Ruta actualizada',`Nuevo estado: ${state}.`);await go(currentSection);}catch(error){toast('No se pudo actualizar',translateError(error),'error');}}
  function openNotificationModal(){
    $('#modalEyebrow').textContent='COMUNICACIONES';$('#modalTitle').textContent='Enviar notificación';
    $('#modalBody').innerHTML=`<form class="form-grid" id="notificationForm"><label class="field full"><span>Conductor destinatario</span>${selectorDinamico('drivers','notificationDrivers','DESTINATARIO_CONDUCTOR_ID','',true)}</label><label class="field"><span>Tipo</span><select name="TIPO"><option>Información</option><option>Ruta</option><option>Operación</option><option>Seguridad</option><option>Documento</option></select></label><label class="field"><span>Prioridad</span><select name="PRIORIDAD"><option>Baja</option><option selected>Normal</option><option>Alta</option><option>Urgente</option></select></label><label class="field full"><span>Título</span><div class="voice-field"><input name="TITULO" required><button type="button" class="voice-field-button" data-dictate-field="TITULO" title="Dictar título">🎙</button></div></label><label class="field full"><span>Mensaje</span><div class="voice-field"><textarea name="MENSAJE" required></textarea><button type="button" class="voice-field-button" data-dictate-field="MENSAJE" title="Dictar mensaje">🎙</button></div></label><div class="form-actions"><button class="btn soft" type="button" data-cancel-modal>Cancelar</button><button class="btn primary" type="submit">Enviar notificación</button></div></form>`;
    const token=openModal();$$('[data-dictate-field]',$('#modalBody')).forEach(button=>button.addEventListener('click',()=>dictarEnCampo($('#notificationForm').elements[button.dataset.dictateField],button)));$('[data-cancel-modal]',$('#modalBody')).onclick=closeModal;
    $('#notificationForm').onsubmit=async event=>{event.preventDefault();const form=event.currentTarget,button=$('button[type="submit"]',form),data=Object.fromEntries(new FormData(form).entries());await conCargaBoton(button,'Enviando…',async()=>{try{await api.request('sendNotification',{data});invalidarListasFormulario('notifications');cacheVistasModulo.delete('notifications');cacheVistasModulo.delete('dashboard');closeModal();toast('Notificación enviada','El mensaje aparecerá en la cuenta del conductor.');await go('notifications');}catch(error){toast('No se pudo enviar',translateError(error),'error');}});};
    prepararListasModal(token,['drivers']);
  }
  async function readNotification(id){try{await api.request('readNotification',{id});invalidarListasFormulario('notifications');cacheVistasModulo.delete(currentSection);await refreshNotificationBadge();if(currentSection==='notifications'||currentSection==='dashboard')await go(currentSection);}catch(error){toast('No se pudo actualizar',translateError(error),'error');}}

  function updateInlineCheckinProgress(form) {
    const answered=checkinCatalog.filter(item=>form.querySelector(`input[name="checkin_${item.id}"]:checked`)).length;
    const count=$('[data-checkin-progress-count]');if(count)count.textContent=`${answered} / ${checkinCatalog.length}`;
    const bar=$('[data-checkin-progress-bar]');if(bar)bar.style.width=`${Math.round(answered/checkinCatalog.length*100)}%`;
    checkinCatalog.forEach(item=>{
      const selected=form.querySelector(`input[name="checkin_${item.id}"]:checked`),card=form.querySelector(`[data-checkin-control="${item.id}"]`),state=form.querySelector(`[data-checkin-state="${item.id}"]`);
      card?.classList.toggle('answered',Boolean(selected));card?.classList.toggle('failed',selected?.value==='FALLA');
      if(state){state.textContent=selected?.value==='OK'?'Conforme':selected?.value==='FALLA'?'Con falla':selected?.value==='NA'?'No aplica':'Sin revisar';state.className=`checkin-control-state ${selected?.value==='FALLA'?'failed':selected?'done':''}`;}
      const note=form.querySelector(`[data-checkin-note="${item.id}"]`);if(note)note.required=selected?.value==='FALLA';
    });
  }

  async function submitInlineCheckin(form) {
    const button=$('button[type="submit"]',form),data=Object.fromEntries(new FormData(form).entries());
    const incomplete=checkinCatalog.filter(item=>!form.querySelector(`input[name="checkin_${item.id}"]:checked`));
    if(incomplete.length){toast('Faltan controles por revisar',`Complete los ${incomplete.length} controles pendientes antes de guardar.`,'error');form.querySelector(`[data-checkin-control="${incomplete[0].id}"]`)?.scrollIntoView({behavior:'smooth',block:'center'});return;}
    const missingNotes=checkinCatalog.filter(item=>form.querySelector(`input[name="checkin_${item.id}"]:checked`)?.value==='FALLA'&&!form.querySelector(`[data-checkin-note="${item.id}"]`)?.value.trim());
    if(missingNotes.length){toast('Describa las fallas',`Agregue una observación en ${missingNotes.length} control(es) marcados con falla.`,'error');form.querySelector(`[data-checkin-control="${missingNotes[0].id}"]`)?.scrollIntoView({behavior:'smooth',block:'center'});return;}
    data.LISTA_CODIFICADA=JSON.stringify(checkinCatalog.map(item=>({id:item.id,respuesta:form.querySelector(`input[name="checkin_${item.id}"]:checked`)?.value||'',observacion:form.querySelector(`[data-checkin-note="${item.id}"]`)?.value||''})));
    data.SOLICITUD_CLIENTE_ID=form.dataset.solicitudClienteId||crearSolicitudClienteCheckin();
    form.dataset.solicitudClienteId=data.SOLICITUD_CLIENTE_ID;
    await conCargaBoton(button,'Guardando en la base…',async()=>{try{
      const result=await api.request('createVehicleCheckin',{data});
      if(!result.row?.ID)throw new Error('CHECKIN_RESPUESTA_SIN_IDENTIFICADOR');
      const persistencia=result.persistencia || (api.isRemote()?'CENTRAL_CONFIRMADA':'LOCAL');
      if(api.isRemote()&&result.persistenciaConfirmada!==true)throw new Error('CHECKIN_NO_CONFIRMADO_EN_BASE_CENTRAL');
      guardarReciboCheckin(result.row,persistencia);
      invalidarListasFormulario('checkins');['checkin','checkinApprovals','checkinHistory','operations','dashboard'].forEach(section=>cacheVistasModulo.delete(section));
      const state=result.row.ESTADO_REVISION||'Registrado',isCentral=persistencia==='CENTRAL_CONFIRMADA';
      toast(state==='Bloqueado'?'Salida bloqueada':'Check-in guardado',`${isCentral?'Base central confirmada':'Almacenamiento local'} · ${result.row.ID}. ${state==='Aprobado'?'La inspección quedó aprobada y vigente por 12 horas.':state==='Pendiente'?'Un supervisor debe revisar las observaciones antes de iniciar.':'Se detectaron fallas críticas.'}`,state==='Bloqueado'?'error':'success');
      form.dataset.solicitudClienteId='';
      await go('checkin',{force:true});
    }catch(error){
      const code=String(error?.message||error||'');
      const detail=code.includes('HOJA_NO_ENCONTRADA_CHECKINS')?'La hoja CHECKINS no existe. Actualice Google Apps Script y ejecute actualizarSistema().':code.includes('CHECKIN_NO_CONFIRMADO')?'El servidor respondió, pero no confirmó el registro en la hoja CHECKINS.':translateError(error);
      toast('No se pudo confirmar el guardado',detail,'error');
    }});
  }

  function bindInlineCheckinForm(form) {
    form.addEventListener('change',()=>updateInlineCheckinProgress(form));
    form.querySelector('[data-checkin-all-ok]')?.addEventListener('click',()=>{checkinCatalog.forEach(item=>{const input=form.querySelector(`input[name="checkin_${item.id}"][value="OK"]`);if(input)input.checked=true;});updateInlineCheckinProgress(form);});
    form.querySelector('[data-checkin-clear]')?.addEventListener('click',()=>{form.querySelectorAll('input[type="radio"]').forEach(input=>input.checked=false);form.querySelectorAll('[data-checkin-note]').forEach(input=>{input.value='';input.required=false;});updateInlineCheckinProgress(form);});
    form.addEventListener('submit',event=>{event.preventDefault();submitInlineCheckin(form);});
    updateInlineCheckinProgress(form);
  }

  function checkinItemsMarkup() {
    const groups={};checkinCatalog.forEach(item=>(groups[item.categoria]||(groups[item.categoria]=[])).push(item));
    return Object.entries(groups).map(([category,items])=>`<fieldset class="checkin-group full"><legend>${esc(category)}</legend>${items.map(item=>`<div class="checkin-item"><div class="checkin-item-copy"><b>${esc(item.item)}</b><span class="${item.critico?'critical-label':''}">${item.critico?'Crítico · No admite N/A':'Control complementario'}</span></div><label><span>Resultado</span><select data-checkin-item="${esc(item.id)}" required><option value="">Seleccione</option><option value="OK">✓ Conforme</option><option value="FALLA">! Falla</option>${item.critico?'':'<option value="NA">— No aplica</option>'}</select></label><label class="checkin-observation"><span>Observación</span><input data-checkin-note="${esc(item.id)}" placeholder="Detalle opcional"></label></div>`).join('')}</fieldset>`).join('');
  }
  function openCheckinModal() {
    $('#modalEyebrow').textContent='SEGURIDAD PREOPERACIONAL';$('#modalTitle').textContent='Realizar check-in vehicular';
    $('#modalBody').innerHTML=`<form class="form-grid checkin-form" id="checkinForm"><div class="tracking-notice active full"><i>✓</i><div><b>Inspección obligatoria antes de la operación</b><span>Complete los 16 controles. Las fallas críticas bloquean el inicio.</span></div></div><label class="field"><span>Vehículo</span>${selectorDinamico('vehicles','checkinVehicles','VEHICULO_ID','',true)}</label><label class="field"><span>Conductor</span>${selectorDinamico('drivers','checkinDrivers','CONDUCTOR_ID',currentUser.CONDUCTOR_ID||'',true)}</label><label class="field"><span>Kilometraje actual</span><input name="KILOMETRAJE" type="number" min="0" required inputmode="numeric"></label><label class="field"><span>Nivel de combustible/carga</span><select name="NIVEL_COMBUSTIBLE" required><option value="">Seleccione</option><option>Vacío / crítico</option><option>1/4</option><option>1/2</option><option>3/4</option><option>Lleno</option><option>No aplica</option></select></label>${checkinItemsMarkup()}<label class="field full"><span>Observaciones generales</span><textarea name="OBSERVACIONES" placeholder="Indique ruidos, daños, testigos del tablero u otras condiciones"></textarea></label><label class="field full"><span>Nombre o firma del conductor</span><input name="FIRMA_CONDUCTOR" value="${esc(currentUser.NOMBRE||'')}" required></label><label class="checkin-confirm full"><input type="checkbox" name="CONFIRMACION_CONDUCTOR" value="SI" required><span>Confirmo que realicé personalmente esta inspección y que la información es correcta.</span></label><div class="form-actions"><button class="btn soft" type="button" data-cancel-modal>Cancelar</button><button class="btn primary" type="submit">Guardar y evaluar check-in</button></div></form>`;
    const token=openModal();$('[data-cancel-modal]',$('#modalBody')).onclick=closeModal;prepararListasModal(token,['vehicles','drivers']);
    $('#checkinForm').onsubmit=async event=>{event.preventDefault();const form=event.currentTarget,button=$('button[type="submit"]',form),data=Object.fromEntries(new FormData(form).entries());const list=checkinCatalog.map(item=>({id:item.id,respuesta:$(`[data-checkin-item="${item.id}"]`,form)?.value||'',observacion:$(`[data-checkin-note="${item.id}"]`,form)?.value||''}));data.LISTA_CODIFICADA=JSON.stringify(list);await conCargaBoton(button,'Evaluando…',async()=>{try{const result=await api.request('createVehicleCheckin',{data});invalidarListasFormulario('checkins');cacheVistasModulo.delete('checkin');cacheVistasModulo.delete('checkinApprovals');cacheVistasModulo.delete('checkinHistory');cacheVistasModulo.delete('operations');closeModal();const state=result.row?.ESTADO_REVISION||'Registrado';toast(state==='Bloqueado'?'Salida bloqueada':'Check-in guardado',state==='Aprobado'?'La inspección quedó aprobada y vigente por 12 horas.':state==='Pendiente'?'Un supervisor debe revisar las observaciones antes de iniciar.':'Se detectaron fallas críticas. Corríjalas y realice un nuevo check-in.',state==='Bloqueado'?'error':'success');await go('checkin');}catch(error){toast('No se pudo guardar el check-in',translateError(error),'error');}});};
  }
  function checkinDetailMarkup(row) {
    const vehicle=registroFormulario('vehicles',row.VEHICULO_ID),driver=registroFormulario('drivers',row.CONDUCTOR_ID),items=parseCheckinItems(row);
    return `<div class="checkin-detail"><div class="info-grid"><div class="info-item"><span>Check-in</span><b>${esc(row.ID)}</b></div><div class="info-item"><span>Estado</span><b>${status(checkinVisualState(row))}</b></div><div class="info-item"><span>Vehículo</span><b>${esc(vehicle?.PATENTE||row.VEHICULO_ID)}</b></div><div class="info-item"><span>Conductor</span><b>${esc(driver?.NOMBRE||row.CONDUCTOR_ID)}</b></div><div class="info-item"><span>Fecha</span><b>${fmtDate(row.FECHA_HORA,true)}</b></div><div class="info-item"><span>Vigencia</span><b>${fmtDate(row.VIGENTE_HASTA,true)}</b></div><div class="info-item"><span>Kilometraje</span><b>${number(row.KILOMETRAJE)} km</b></div><div class="info-item"><span>Combustible/carga</span><b>${esc(row.NIVEL_COMBUSTIBLE||'—')}</b></div></div><div class="checkin-detail-list">${items.map(item=>`<article class="${item.respuesta==='FALLA'?'failed':''}"><i>${item.respuesta==='OK'?'✓':item.respuesta==='NA'?'—':'!'}</i><div><b>${esc(item.item)}</b><span>${esc(item.categoria)} · ${item.critico?'Crítico':'Complementario'}</span>${item.observacion?`<small>${esc(item.observacion)}</small>`:''}</div>${status(item.respuesta)}</article>`).join('')}</div>${row.OBSERVACIONES?`<div class="checkin-comment"><b>Observaciones generales</b><p>${esc(row.OBSERVACIONES)}</p></div>`:''}${row.COMENTARIO_REVISION?`<div class="checkin-comment"><b>Comentario de revisión</b><p>${esc(row.COMENTARIO_REVISION)}</p></div>`:''}<div class="form-actions"><button class="btn soft" type="button" data-cancel-modal>Cerrar</button></div></div>`;
  }
  function openCheckinDetailModal(id) {
    const row=registroFormulario('checkins',id);$('#modalEyebrow').textContent='DETALLE DE INSPECCIÓN';$('#modalTitle').textContent=id;$('#modalBody').innerHTML=row?checkinDetailMarkup(row):contenidoCargaModal('Cargando check-in…');const token=openModal();
    const bind=()=>{const close=$('[data-cancel-modal]',$('#modalBody'));if(close)close.onclick=closeModal;};
    if(row){bind();return;}
    api.request('get',{resource:'checkins',id}).then(result=>{if(token!==secuenciaModal)return;guardarRegistro('checkins',result.row);$('#modalBody').innerHTML=checkinDetailMarkup(result.row);bind();}).catch(error=>{if(token!==secuenciaModal)return;$('#modalBody').innerHTML=`<div class="modal-error"><b>No se pudo cargar el check-in</b><p>${esc(translateError(error))}</p><button class="btn soft" data-cancel-modal>Cerrar</button></div>`;bind();});
  }
  function openCheckinReviewModal(id) {
    const row=registroFormulario('checkins',id);if(!row){openCheckinDetailModal(id);return;}
    $('#modalEyebrow').textContent='APROBACIÓN DE SEGURIDAD';$('#modalTitle').textContent=`Revisar ${id}`;
    $('#modalBody').innerHTML=`<div class="checkin-review">${checkinDetailMarkup(row).replace(/<div class="form-actions">[\s\S]*?<\/div><\/div>$/,'')}</div><label class="field"><span>Comentario del supervisor</span><textarea id="checkinReviewComment" required placeholder="Indique la decisión y las medidas necesarias"></textarea></label><div class="form-actions"><button class="btn soft" type="button" data-cancel-modal>Cancelar</button><button class="btn danger" type="button" data-checkin-decision="RECHAZAR">Rechazar</button>${Number(row.FALLAS_CRITICAS||0)===0?'<button class="btn primary" type="button" data-checkin-decision="APROBAR">Aprobar check-in</button>':''}</div></div>`;
    openModal();$('[data-cancel-modal]',$('#modalBody')).onclick=closeModal;$$('[data-checkin-decision]',$('#modalBody')).forEach(button=>button.onclick=()=>conCargaBoton(button,button.dataset.checkinDecision==='APROBAR'?'Aprobando…':'Rechazando…',async()=>{const comment=$('#checkinReviewComment').value.trim();if(!comment){toast('Comentario requerido','Explique la decisión tomada.','error');return;}try{await api.request('reviewVehicleCheckin',{id,data:{CHECKIN_ID:id,DECISION:button.dataset.checkinDecision,COMENTARIO_REVISION:comment}});invalidarListasFormulario('checkins','notifications');['checkin','checkinApprovals','checkinHistory','operations','dashboard'].forEach(section=>cacheVistasModulo.delete(section));closeModal();toast('Check-in revisado',button.dataset.checkinDecision==='APROBAR'?'La operación puede iniciarse mientras la inspección esté vigente.':'El conductor deberá corregir y realizar un check-in nuevo.');await go(currentSection);}catch(error){toast('No se pudo revisar',translateError(error),'error');}}));
  }
  async function refreshOperationCheckins(form) {
    const vehicle=form.elements.VEHICULO_ID?.value||'',driver=form.elements.CONDUCTOR_ID?.value||'',select=form.elements.CHECKIN_ID;if(!select)return;
    if(!vehicle||!driver){select.innerHTML='<option value="">Seleccione primero vehículo y conductor</option>';select.disabled=true;return;}
    select.disabled=true;select.innerHTML='<option value="">Buscando check-ins aprobados…</option>';
    try{const result=await api.request('availableCheckins',{data:{VEHICULO_ID:vehicle,CONDUCTOR_ID:driver},cache:false});const rows=result.rows||[];select.innerHTML=`<option value="">${rows.length?'Seleccione check-in aprobado':'No hay check-in vigente para esta combinación'}</option>${rows.map(row=>`<option value="${esc(row.ID)}">${esc(row.ID)} · ${fmtDate(row.FECHA_HORA,true)} · vigente hasta ${fmtDate(row.VIGENTE_HASTA,true)}</option>`).join('')}`;select.disabled=false;}catch(error){select.innerHTML='<option value="">No fue posible consultar check-ins</option>';select.disabled=true;toast('No se pudieron consultar los check-ins',translateError(error),'error');}
  }

  function openOperationModal(prefillVehicle=null) {
    const base=configuracionPuntoOperacion();
    if(!base.configurada){$('#modalEyebrow').textContent='UBICACIÓN OBLIGATORIA';$('#modalTitle').textContent='Punto operacional no configurado';$('#modalBody').innerHTML=`<div class="modal-error"><b>No se puede iniciar una operación</b><p>El Administrador debe definir la dirección, coordenadas y radios autorizados en Configuración.</p><div class="form-actions"><button class="btn soft" data-cancel-modal>Cerrar</button>${hasPermission('CONFIGURACION','ACTUALIZAR')?'<button class="btn primary" data-go-operation-settings>Ir a Configuración</button>':''}</div></div>`;openModal();$('[data-cancel-modal]',$('#modalBody')).onclick=closeModal;$('[data-go-operation-settings]',$('#modalBody'))?.addEventListener('click',()=>{closeModal();navigateSection('settings');});return;}
    const prefillObject=typeof prefillVehicle==='object'&&prefillVehicle?prefillVehicle:null,prefillId=prefillObject?.ID||String(prefillVehicle||'');if(prefillObject)guardarRegistro('vehicles',prefillObject);
    $('#modalEyebrow').textContent='OPERACIÓN GEOVALIDADA';$('#modalTitle').textContent='Iniciar nueva operación';
    $('#modalBody').innerHTML=`<form class="form-grid" id="operationForm">${prefillObject?`<div class="tracking-notice active full"><i>✓</i><div><b>QR validado: ${esc(prefillObject.PATENTE)}</b><span>${esc(prefillObject.MARCA||'')} ${esc(prefillObject.MODELO||'')}</span></div></div><input type="hidden" name="AUTORIZACION_QR" value="${esc(prefillObject.AUTORIZACION_QR||'')}">`:''}<div class="operation-base-summary full"><i>⌖</i><div><b>${esc(base.nombre)}</b><span>${esc(base.direccion)} · inicio permitido en un radio de ${number(base.radioInicio)} m</span></div></div><div class="operation-checkin-required full"><i>✓</i><div><b>Check-in preoperacional obligatorio</b><span>Solo aparecen inspecciones aprobadas, vigentes y sin utilizar.</span></div><button class="btn soft small" type="button" data-nav-checkin>Realizar check-in</button></div><label class="field"><span>Vehículo</span>${selectorDinamico('vehicles','operationVehicles','VEHICULO_ID',prefillId,true)}</label><label class="field"><span>Conductor</span>${selectorDinamico('drivers','operationDrivers','CONDUCTOR_ID',currentUser.CONDUCTOR_ID||'',true)}</label><label class="field full"><span>Check-in aprobado</span><select name="CHECKIN_ID" required disabled><option value="">Seleccione primero vehículo y conductor</option></select></label><label class="field full"><span>Ruta asignada</span><select name="RUTA_ID"><option value="">Sin ruta asignada · salida y regreso a base</option></select><small data-operation-type>Salida y regreso al mismo punto base</small></label><label class="field"><span>Origen obligatorio</span><input name="ORIGEN" value="${esc(base.direccion)}" readonly></label><label class="field"><span>Destino operacional</span><input name="DESTINO" value="${esc(base.direccion)}" readonly></label><label class="field"><span>KM inicial</span><input name="KM_INICIO" type="number" min="0" required></label><label class="field full"><span>Observaciones</span><textarea name="OBSERVACIONES"></textarea></label><input type="hidden" name="INICIO_LATITUD"><input type="hidden" name="INICIO_LONGITUD"><input type="hidden" name="INICIO_PRECISION"><div class="operation-location-status full" data-operation-location-status><i>⌖</i><div><b>Ubicación aún no validada</b><span>Pulse el botón para comprobar que está dentro del punto autorizado.</span></div></div><div class="form-actions"><button class="btn soft" type="button" data-cancel-modal>Cancelar</button><button class="btn soft" type="button" data-capture-operation-location>⌖ Validar ubicación</button><button class="btn primary" type="submit">Iniciar operación</button></div></form>`;
    const token=openModal(),form=$('#operationForm');$('[data-cancel-modal]',$('#modalBody')).onclick=closeModal;$('[data-nav-checkin]',form).onclick=()=>{closeModal();navigateSection('checkin');};
    const updateDependencies=()=>{refreshOperationCheckins(form);rutasDisponiblesOperacion(form);};['VEHICULO_ID','CONDUCTOR_ID'].forEach(name=>form.elements[name]?.addEventListener('change',updateDependencies));form.elements.RUTA_ID?.addEventListener('change',()=>actualizarDestinoOperacion(form));
    $('[data-capture-operation-location]',form).onclick=event=>conCargaBoton(event.currentTarget,'Validando GPS…',async()=>{try{await capturarUbicacionFormularioOperacion(form,'INICIO');}catch(error){toast('No se validó la ubicación',translateError(error),'error');}});
    form.onsubmit=async event=>{event.preventDefault();const button=$('button[type="submit"]',form);await conCargaBoton(button,'Validando e iniciando…',async()=>{try{let locationResult=null;if(!form.elements.INICIO_LATITUD.value)locationResult=await capturarUbicacionFormularioOperacion(form,'INICIO');else locationResult=resumenValidacionLocalUbicacion({latitud:Number(form.elements.INICIO_LATITUD.value),longitud:Number(form.elements.INICIO_LONGITUD.value),precision:Number(form.elements.INICIO_PRECISION.value)},base,'INICIO');if(!locationResult.valida)throw new Error(locationResult.precisionValida?'FUERA_DEL_PUNTO_DE_INICIO':'UBICACION_GPS_IMPRECISA');const data=Object.fromEntries(new FormData(form).entries()),result=await api.request('startOperation',{data});invalidarListasFormulario('operations','vehicles','drivers','history','checkins','routes');['operations','dashboard','checkin','checkinHistory','routes'].forEach(section=>cacheVistasModulo.delete(section));closeModal();toast('Operación iniciada',`Ubicación confirmada a ${Math.round(result.locationValidation?.DISTANCIA_METROS??locationResult.distancia)} m de la base.`);await go('operations');}catch(error){toast('No se pudo iniciar',translateError(error),'error');}});};
    prepararListasModal(token,['vehicles','drivers','routes']);Promise.all(['vehicles','drivers','routes'].map(cargarListaFormulario)).then(()=>{if(token!==secuenciaModal)return;actualizarSelectoresModal(token);updateDependencies();}).catch(()=>{});
  }
  function openFinishOperationModal(id,button){const operation=registroFormulario('operations',id)||(listasFormulario.get('operations')||[]).find(row=>row.ID===id);if(!operation)return toast('Operación no encontrada','Sincronice el módulo e inténtelo nuevamente.','error');const base=configuracionPuntoOperacion({...currentCompany,VALIDAR_UBICACION_OPERACION:'SI',PUNTO_OPERACION_NOMBRE:operation.BASE_NOMBRE||currentCompany?.PUNTO_OPERACION_NOMBRE,PUNTO_OPERACION_DIRECCION:operation.BASE_DIRECCION||operation.PUNTO_RETORNO||currentCompany?.PUNTO_OPERACION_DIRECCION,PUNTO_OPERACION_LATITUD:operation.BASE_LATITUD||currentCompany?.PUNTO_OPERACION_LATITUD,PUNTO_OPERACION_LONGITUD:operation.BASE_LONGITUD||currentCompany?.PUNTO_OPERACION_LONGITUD,RADIO_FIN_METROS:operation.RADIO_FIN_METROS||currentCompany?.RADIO_FIN_METROS,PRECISION_GPS_MAXIMA_METROS:operation.PRECISION_GPS_MAXIMA_METROS||currentCompany?.PRECISION_GPS_MAXIMA_METROS});$('#modalEyebrow').textContent='RETORNO OBLIGATORIO';$('#modalTitle').textContent=`Finalizar ${esc(id)}`;$('#modalBody').innerHTML=`<form class="form-grid" id="finishOperationForm"><div class="operation-base-summary full"><i>⌖</i><div><b>Debe regresar a ${esc(base.nombre)}</b><span>${esc(base.direccion)} · finalización permitida dentro de ${number(base.radioFin)} m</span></div></div><label class="field"><span>KM final</span><input name="KM_FIN" type="number" min="${number(operation.KM_INICIO||0)}" value="${number(operation.KM_INICIO||0)}" required></label><label class="field full"><span>Observaciones de cierre</span><textarea name="OBSERVACIONES" placeholder="Novedades al regresar"></textarea></label><input type="hidden" name="FIN_LATITUD"><input type="hidden" name="FIN_LONGITUD"><input type="hidden" name="FIN_PRECISION"><div class="operation-location-status full" data-operation-location-status><i>⌖</i><div><b>Retorno aún no validado</b><span>El sistema comprobará que el vehículo regresó al punto autorizado.</span></div></div><div class="form-actions"><button class="btn soft" type="button" data-cancel-modal>Cancelar</button><button class="btn soft" type="button" data-capture-operation-location>⌖ Validar retorno</button><button class="btn danger" type="submit">Finalizar operación</button></div></form>`;openModal();const form=$('#finishOperationForm');$('[data-cancel-modal]',form).onclick=closeModal;$('[data-capture-operation-location]',form).onclick=event=>conCargaBoton(event.currentTarget,'Validando GPS…',async()=>{try{await capturarUbicacionFormularioOperacion(form,'FIN');}catch(error){toast('No se validó el retorno',translateError(error),'error');}});form.onsubmit=async event=>{event.preventDefault();const submit=$('button[type="submit"]',form);await conCargaBoton(submit,'Validando y finalizando…',async()=>{try{let locationResult=null;if(!form.elements.FIN_LATITUD.value)locationResult=await capturarUbicacionFormularioOperacion(form,'FIN');else locationResult=resumenValidacionLocalUbicacion({latitud:Number(form.elements.FIN_LATITUD.value),longitud:Number(form.elements.FIN_LONGITUD.value),precision:Number(form.elements.FIN_PRECISION.value)},base,'FIN');if(!locationResult.valida)throw new Error(locationResult.precisionValida?'FUERA_DEL_PUNTO_DE_FINALIZACION':'UBICACION_GPS_IMPRECISA');const data=Object.fromEntries(new FormData(form).entries()),result=await api.request('finishOperation',{id,data});invalidarListasFormulario('operations','vehicles','drivers','history','routes');['operations','dashboard','routes'].forEach(section=>cacheVistasModulo.delete(section));closeModal();toast('Operación finalizada',`Regreso confirmado a ${Math.round(result.locationValidation?.DISTANCIA_METROS??locationResult.distancia)} m de la base.`);await go('operations');}catch(error){toast('No se pudo finalizar',translateError(error),'error');}});};}
  async function finishOperation(id,button){openFinishOperationModal(id,button);}


  function antiguedadUbicacion(fecha) {
    const tiempo = new Date(fecha || 0).getTime();
    return Number.isFinite(tiempo) ? Date.now() - tiempo : Number.MAX_SAFE_INTEGER;
  }

  function distanciaMetros(lat1, lon1, lat2, lon2) {
    const radio = 6371000;
    const rad = valor => Number(valor) * Math.PI / 180;
    const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * radio * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function updateGpsFilterUi() {
    $$('[data-gps-scope]').forEach(button=>button.classList.toggle('active',button.dataset.gpsScope===gpsDraftTrackingMode));
    $('#vehicleTrackingPanel')?.classList.toggle('open',gpsDraftTrackingMode==='specific');
    const summary=$('#trackingSelectionSummary');if(summary)summary.textContent=gpsDraftTrackingMode==='all'?'Toda la flota':selectedVehiclesLabel();
    $$('[data-gps-vehicle]').forEach(input=>{input.checked=gpsDraftSelectedVehicles.has(String(input.dataset.gpsVehicle));});
    const dirty=gpsFilterHasChanges();
    const pending=$('#trackingPendingText');if(pending)pending.textContent=dirty?'Hay cambios pendientes por aplicar.':'El mapa ya está usando este filtro.';
    const applied=$('#trackingAppliedSummary');if(applied)applied.textContent=`Filtro aplicado: ${appliedVehiclesLabel()}`;
    const apply=$('[data-gps-apply]');if(apply)apply.disabled=!dirty;
    const reset=$('[data-gps-reset]');if(reset)reset.disabled=!dirty;
  }
  function changeGpsTrackingScope(scope) {
    gpsDraftTrackingMode=scope==='specific'?'specific':'all';updateGpsFilterUi();
  }
  function toggleGpsVehicle(id,checked) {
    if(checked)gpsDraftSelectedVehicles.add(String(id));else gpsDraftSelectedVehicles.delete(String(id));
    gpsDraftTrackingMode='specific';updateGpsFilterUi();
  }
  function selectAllGpsVehicles() {
    (ultimoResumenGps.trackingVehicles||[]).forEach(vehicle=>gpsDraftSelectedVehicles.add(String(vehicle.ID)));
    gpsDraftTrackingMode='specific';updateGpsFilterUi();
  }
  function clearGpsVehicles() {
    gpsDraftSelectedVehicles.clear();gpsDraftTrackingMode='specific';updateGpsFilterUi();
  }
  function resetGpsVehicleFilterDraft() {
    gpsDraftTrackingMode=gpsTrackingMode;gpsDraftSelectedVehicles=new Set(gpsSelectedVehicles);updateGpsFilterUi();
  }
  async function applyGpsVehicleFilter() {
    if(!canSelectGpsVehicles())return;
    gpsTrackingMode=gpsDraftTrackingMode;
    gpsSelectedVehicles=new Set(gpsDraftSelectedVehicles);
    saveGpsFilterPreference();updateGpsFilterUi();
    const result=await refreshLocations(false,true);
    if(result)toast('Filtro de seguimiento aplicado',gpsTrackingMode==='all'?'Se muestran todos los vehículos.':`${gpsSelectedVehicles.size} vehículos seleccionados.`);
  }
  function filterGpsVehicleOptions(value='') {
    const term=String(value).trim().toLowerCase();$$('[data-vehicle-filter-text]').forEach(node=>{node.hidden=Boolean(term)&&!node.dataset.vehicleFilterText.includes(term);});
  }
  function refreshGpsVehicleOptions(realtime) {
    const list=$('#vehicleTrackingList');if(!list)return;
    const key=(realtime.trackingVehicles||[]).map(vehicle=>`${vehicle.ID}:${vehicle.PATENTE}:${vehicle.MARCA}:${vehicle.MODELO}:${vehicle.ESTADO}:${vehicle.CONDUCTOR_NOMBRE||''}`).join('|');
    if(list.dataset.optionsKey!==key){list.dataset.optionsKey=key;list.innerHTML=gpsVehicleOptions(realtime);$$('[data-gps-vehicle]',list).forEach(input=>input.addEventListener('change',()=>toggleGpsVehicle(input.dataset.gpsVehicle,input.checked)));}
    updateGpsFilterUi();
  }
  function paintGpsData(result, ajustar=false) {
    ultimoResumenGps=result||ultimoResumenGps;
    const filas=ultimoResumenGps.locations||[];
    const marcadores=filas.map(row=>{const latitud=Number(row.LATITUD),longitud=Number(row.LONGITUD);if(!Number.isFinite(latitud)||!Number.isFinite(longitud))return null;const activo=antiguedadUbicacion(row.FECHA_HORA)<=config.ANTIGUEDAD_UBICACION_ACTIVA_MILISEGUNDOS;const nombre=row.CONDUCTOR_NOMBRE||row.CONDUCTOR_ID||'Conductor',vehiculo=row.VEHICULO_PATENTE||row.VEHICULO_ID||'Sin vehículo';return{id:row.VEHICULO_ID||row.CONDUCTOR_ID||row.ID,latitud,longitud,nombre:`${vehiculo} · ${nombre}`,activo,detalle:`<b>${esc(vehiculo)}</b><span>${esc(nombre)}</span><span>${esc(row.DIRECCION||`${latitud.toFixed(5)}, ${longitud.toFixed(5)}`)}</span><span>${Number(row.VELOCIDAD_KMH||0).toFixed(0)} km/h</span><small>${activo?'Activo · Ubicación reciente':'Inactivo · Sin actualización reciente'} · ${fmtDate(row.FECHA_HORA,true)}</small>`};}).filter(Boolean);
    mapaFlota?.actualizarMarcadores(marcadores,ajustar);
    const locationKey=filas.map(row=>`${row.ID||''}:${row.FECHA_HORA||''}:${row.LATITUD||''}:${row.LONGITUD||''}:${row.VELOCIDAD_KMH||''}:${row.DIRECCION||''}`).join('|');
    const list=$('#driverLocationList');if(list&&locationKey!==gpsLocationsPaintKey){gpsLocationsPaintKey=locationKey;list.innerHTML=locationList(filas);const count=$('#locationCount');if(count)count.textContent=visibleVehiclesLabel(filas.length);$$('[data-focus-location]',list).forEach(btn=>btn.onclick=()=>{const[lat,lng]=btn.dataset.focusLocation.split(',').map(Number);mapaFlota?.establecerVista(lat,lng,16);});}
    const deviceRows=ultimoResumenGps.devices||[];const deviceKey=deviceRows.map(row=>`${row.ID||''}:${row.ULTIMA_CONEXION||''}:${row.ACTIVIDAD||''}:${row.VEHICULO_ID||''}:${row.GPS_ACTIVO||''}`).join('|');
    const devices=$('#deviceList');if(devices&&deviceKey!==gpsDevicesPaintKey){gpsDevicesPaintKey=deviceKey;devices.innerHTML=deviceRows.map(deviceCard).join('')||empty('○','Sin conexiones','Esperando señales de dispositivos.');}
    const totals=ultimoResumenGps.totals||{};const totalsKey=`${filas.length}:${totals.onlineDevices||0}:${totals.drivingSessions||0}:${totals.sessionsWithoutGps||0}`;if(totalsKey!==gpsTotalsPaintKey){gpsTotalsPaintKey=totalsKey;if($('#gpsVisibleCount'))$('#gpsVisibleCount').textContent=filas.length;if($('#gpsOnlineCount'))$('#gpsOnlineCount').textContent=totals.onlineDevices||0;if($('#gpsDrivingCount'))$('#gpsDrivingCount').textContent=totals.drivingSessions||0;if($('#gpsWithoutCount'))$('#gpsWithoutCount').textContent=totals.sessionsWithoutGps||0;}
    refreshGpsVehicleOptions(ultimoResumenGps);
    const sync=$('#gpsLastSync');if(sync)sync.textContent=`Última consulta: ${new Intl.DateTimeFormat('es-CL',{timeStyle:'medium'}).format(new Date())}`;
  }
  function gpsRefreshDelay() {
    const base=document.hidden?Number(config.INTERVALO_TIEMPO_REAL_OCULTO_MILISEGUNDOS||15000):Number(config.INTERVALO_TIEMPO_REAL_MILISEGUNDOS||3000);
    return Math.min(Number(config.RETARDO_REINTENTO_TIEMPO_REAL_MAXIMO_MILISEGUNDOS||30000),base*Math.pow(2,Math.min(gpsRefreshFailures,3)));
  }
  function scheduleGpsRefresh(delay=gpsRefreshDelay()) {
    if(gpsRefreshTimer)clearTimeout(gpsRefreshTimer);gpsRefreshTimer=null;
    if(currentSection!=='gps'||!currentUser)return;
    gpsRefreshTimer=setTimeout(()=>refreshLocations(false,false),Math.max(250,delay));
  }
  async function initMap() {
    const contenedor=$('#fleetMap');if(!contenedor||!window.MapaFlotas){toast('Mapa no disponible','No se pudo iniciar el componente del mapa.','error');return;}
    mapaFlota=new MapaFlotas(contenedor,{centro:config.CENTRO_MAPA,nivel:config.NIVEL_ACERCAMIENTO_MAPA});paintGpsData(ultimoResumenGps,true);scheduleGpsRefresh(500);
  }
  async function refreshLocations(showToast=true,ajustar=false) {
    if(gpsRefreshPending){gpsRefreshQueued=true;return gpsRefreshPending;}
    gpsRefreshPending=(async()=>{try{const result=await api.request('realtimeSummary',{...gpsFilterPayload(),marcaTiempo:Date.now(),force:true});gpsRefreshFailures=0;paintGpsData(result,ajustar);if(showToast)toast('Mapa actualizado',`${result.locations?.length||0} ubicaciones visibles.`);setConnection(true,api.isRemote()?'Base de datos conectada':'Base de datos local activa');return result;}catch(error){gpsRefreshFailures+=1;setConnection(false,'Error GPS');if(showToast)toast('No se pudo actualizar',translateError(error),'error');return null;}finally{gpsRefreshPending=null;const rerun=gpsRefreshQueued;gpsRefreshQueued=false;if(currentSection==='gps')scheduleGpsRefresh(rerun?300:gpsRefreshDelay());}})();
    return gpsRefreshPending;
  }

  function captureGps() {
    if (!navigator.geolocation) {toast('GPS no compatible','Este navegador no ofrece geolocalización.','error');return Promise.resolve(false);}
    return new Promise(resolve=>navigator.geolocation.getCurrentPosition(
      async position => {geolocationPermissionState='granted';updateTrackingUi();await sendPosition(position,'GPS real',true);resolve(true);},
      error => {handleTrackingError(error,'No se obtuvo ubicación');resolve(false);},
      {enableHighAccuracy:true,timeout:20000,maximumAge:3000}
    ));
  }

  function trackingPreferenceEnabled(){return localStorage.getItem(trackingPreferenceKey)==='1';}
  function permissionLabel(state=geolocationPermissionState){
    return ({granted:'Concedido',prompt:'Pendiente de autorización',denied:'Bloqueado',desconocido:'No disponible'})[state]||'No disponible';
  }
  function wakeLockLabel(){
    if(!navigator.wakeLock)return 'No compatible';
    if(wakeLock&&!wakeLock.released)return 'Activa';
    return gpsWatchId===null?'No requerida':'En espera';
  }
  function trackingDetail(){
    if(gpsWatchId!==null)return 'La preferencia quedó guardada y se reanudará cuando vuelva a abrir la sesión con el permiso concedido. Mantenga la aplicación abierta; el teléfono todavía puede suspender el navegador.';
    if(trackingPreferenceEnabled())return 'La preferencia está guardada. Se reactivará automáticamente cuando el navegador tenga el permiso concedido y la aplicación esté abierta.';
    return 'Actívela una vez y acepte el permiso del teléfono. El navegador no permite conceder “Siempre” automáticamente ni garantiza datos con la aplicación cerrada.';
  }
  function updateTrackingUi(){
    const active=gpsWatchId!==null;
    $$('[data-tracking-notice]').forEach(node=>{node.classList.toggle('active',active);node.classList.toggle('inactive',!active);});
    $$('[data-tracking-icon]').forEach(node=>{node.textContent=active?'●':'○';});
    $$('[data-tracking-title]').forEach(node=>{node.textContent=active?'Ubicación continua activada':'Ubicación continua detenida';});
    $$('[data-tracking-detail]').forEach(node=>{node.textContent=trackingDetail();});
    $$('[data-tracking-permission]').forEach(node=>{node.textContent=permissionLabel();});
    $$('[data-tracking-preference]').forEach(node=>{node.textContent=trackingPreferenceEnabled()?'Activada':'Desactivada';});
    $$('[data-wake-lock]').forEach(node=>{node.textContent=wakeLockLabel();});
    $$('[data-toggle-tracking]').forEach(button=>{if(button.dataset.loading!=='1')button.textContent=active?'Detener ubicación continua':'Activar ubicación continua';button.classList.toggle('primary',!active);button.classList.toggle('danger',active);});
  }
  async function monitorGeolocationPermission(){
    if(!navigator.permissions?.query){geolocationPermissionState='desconocido';updateTrackingUi();return geolocationPermissionState;}
    try{
      if(!geolocationPermissionHandle){
        geolocationPermissionHandle=await navigator.permissions.query({name:'geolocation'});
        geolocationPermissionHandle.addEventListener?.('change',()=>{
          geolocationPermissionState=geolocationPermissionHandle.state||'desconocido';
          if(geolocationPermissionState==='denied'&&gpsWatchId!==null)stopTracking({remember:false,silent:true});
          if(geolocationPermissionState==='granted'&&trackingPreferenceEnabled()&&currentUser&&gpsWatchId===null)startTracking({silent:true});
          updateTrackingUi();
        });
      }
      geolocationPermissionState=geolocationPermissionHandle.state||'desconocido';
    }catch(_){geolocationPermissionState='desconocido';}
    updateTrackingUi();return geolocationPermissionState;
  }
  async function requestWakeLock(){
    if(!navigator.wakeLock?.request||document.hidden||gpsWatchId===null)return;
    try{
      if(!wakeLock||wakeLock.released){
        wakeLock=await navigator.wakeLock.request('screen');
        wakeLock.addEventListener?.('release',()=>{wakeLock=null;updateTrackingUi();});
      }
    }catch(_){wakeLock=null;}
    updateTrackingUi();
  }
  async function releaseWakeLock(){
    const activeLock=wakeLock;wakeLock=null;
    try{await activeLock?.release?.();}catch(_){}
    updateTrackingUi();
  }
  function handleTrackingError(error,title='Seguimiento GPS'){
    const messages={1:'El permiso de ubicación está bloqueado. Habilítelo en la configuración del navegador.',2:'El teléfono no pudo determinar la ubicación. Revise el GPS y la señal.',3:'La ubicación tardó demasiado. El sistema seguirá intentando.'};
    if(error?.code===1){
      geolocationPermissionState='denied';
      if(gpsWatchId!==null&&navigator.geolocation)navigator.geolocation.clearWatch(gpsWatchId);
      gpsWatchId=null;releaseWakeLock();
    }
    updateTrackingUi();
    if(Date.now()-lastGpsErrorAt>8000){lastGpsErrorAt=Date.now();toast(title,messages[error?.code]||error?.message||'No fue posible obtener la ubicación.','error');}
  }
  async function startTracking({silent=false}={}){
    if(gpsWatchId!==null)return true;
    if(!navigator.geolocation){if(!silent)toast('GPS no compatible','Este navegador no ofrece geolocalización.','error');return false;}
    await monitorGeolocationPermission();
    if(geolocationPermissionState==='denied'){if(!silent)toast('Permiso de ubicación bloqueado','Abra la configuración del navegador y cambie el permiso de ubicación a permitido.','error');return false;}
    try{
      gpsWatchId=navigator.geolocation.watchPosition(
        position=>{geolocationPermissionState='granted';updateTrackingUi();sendPosition(position,'Seguimiento continuo',false);},
        error=>handleTrackingError(error),
        {enableHighAccuracy:true,timeout:25000,maximumAge:3000}
      );
      localStorage.setItem(trackingPreferenceKey,'1');
      requestWakeLock();updateTrackingUi();sendHeartbeat();
      if(!silent)toast('Ubicación continua activada',`La posición se enviará aproximadamente cada ${Math.round(config.INTERVALO_GPS_MILISEGUNDOS/1000)} segundos mientras la aplicación pueda ejecutarse.`);
      return true;
    }catch(error){handleTrackingError(error);return false;}
  }
  function stopTracking({remember=true,silent=false}={}){
    if(gpsWatchId!==null&&navigator.geolocation)navigator.geolocation.clearWatch(gpsWatchId);
    gpsWatchId=null;ultimaUbicacionEnviada=null;
    if(remember)localStorage.setItem(trackingPreferenceKey,'0');
    releaseWakeLock();updateTrackingUi();
    if(!silent)toast('Ubicación continua detenida');
  }
  async function resumeTrackingIfAllowed(){
    if(!currentUser||!trackingPreferenceEnabled()||gpsWatchId!==null)return;
    const state=await monitorGeolocationPermission();
    if(state==='granted')await startTracking({silent:true});
  }
  async function toggleTracking() {
    if(gpsWatchId===null)await startTracking();
    else{stopTracking();sendHeartbeat();}
    if(currentSection!=='gps')navigateSection('gps');else updateTrackingUi();
  }

  async function resolveAddress(latitude,longitude){
    const fallback=`${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`;
    if(!config.RESOLVER_DIRECCIONES)return fallback;
    const now=Date.now(),sameArea=lastAddressLookup.address&&distanciaMetros(latitude,longitude,lastAddressLookup.latitude,lastAddressLookup.longitude)<35;
    if(sameArea&&now-lastAddressLookup.time<60000)return lastAddressLookup.address;
    if(now-lastAddressLookup.time<30000&&lastAddressLookup.address)return lastAddressLookup.address;
    try{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
      const url=new URL(config.DIRECCION_GEOCODIFICACION_INVERSA);url.searchParams.set('format','jsonv2');url.searchParams.set('lat',latitude);url.searchParams.set('lon',longitude);url.searchParams.set('zoom','18');url.searchParams.set('addressdetails','0');url.searchParams.set('accept-language','es');
      const response=await fetch(url,{headers:{Accept:'application/json'},signal:controller.signal});clearTimeout(timer);if(!response.ok)throw new Error('GEOCODIFICACION_NO_DISPONIBLE');
      const data=await response.json(),address=data.display_name||fallback;lastAddressLookup={address,time:now,latitude,longitude};return address;
    }catch(_){return fallback;}
  }

  async function procesarColaGps(position,source,forzar) {
    const c=position.coords,ahora=Date.now();
    if(!forzar&&ultimaUbicacionEnviada){const tiempo=ahora-ultimaUbicacionEnviada.tiempo,movimiento=distanciaMetros(ultimaUbicacionEnviada.latitud,ultimaUbicacionEnviada.longitud,c.latitude,c.longitude);if(tiempo<config.INTERVALO_GPS_MILISEGUNDOS&&movimiento<Number(config.DISTANCIA_MINIMA_ENVIO_GPS_METROS||6))return;}
    const fallback=`${Number(c.latitude).toFixed(6)}, ${Number(c.longitude).toFixed(6)}`;
    const cachedAddress=lastAddressLookup.address&&distanciaMetros(c.latitude,c.longitude,lastAddressLookup.latitude,lastAddressLookup.longitude)<50?lastAddressLookup.address:fallback;
    await api.request('saveLocation',{data:{LATITUD:c.latitude,LONGITUD:c.longitude,PRECISION_METROS:c.accuracy||0,VELOCIDAD_KMH:c.speed==null?0:c.speed*3.6,RUMBO:c.heading||0,DIRECCION:cachedAddress,BATERIA_PORCENTAJE:batteryLevel,DISPOSITIVO_ID:deviceId,SESION_CLIENTE_ID:clientSessionId,SECCION_ACTUAL:currentSection,PAGINA_VISIBLE:document.hidden?'NO':'SI',TIPO_RED:connectionType(),PLATAFORMA:navigator.platform||'',NAVEGADOR:navigator.userAgent,FECHA_HORA:new Date(position.timestamp).toISOString(),FUENTE:source}});
    ultimaUbicacionEnviada={tiempo:ahora,latitud:c.latitude,longitud:c.longitude};setSave('Ubicación sincronizada');
    resolveAddress(c.latitude,c.longitude).catch(()=>{});
    if(currentSection==='gps')refreshLocations(false,false);
  }
  async function sendPosition(position,source,forzar=false) {
    gpsPendingPosition={position,source,forzar};
    if(gpsSendPending)return;
    gpsSendPending=true;
    try{while(gpsPendingPosition){const next=gpsPendingPosition;gpsPendingPosition=null;try{await procesarColaGps(next.position,next.source,next.forzar);}catch(error){setSave('Error GPS','error');if(Date.now()-lastGpsErrorAt>8000){lastGpsErrorAt=Date.now();toast('No se pudo enviar GPS',translateError(error),'error');}}}}
    finally{gpsSendPending=false;}
  }

  async function exportResource(resource){try{const result=await api.request('list',{resource});const rows=result.rows||[];if(!rows.length)return toast('Sin datos','No hay registros para exportar.','error');const headers=[...new Set(rows.flatMap(Object.keys))];const csv=[headers,...rows.map(row=>headers.map(h=>row[h]??''))].map(line=>line.map(value=>`"${String(value).replaceAll('"','""')}"`).join(';')).join('\n');const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${resource}_${new Date().toISOString().slice(0,10)}.csv`;link.click();URL.revokeObjectURL(url);toast('CSV generado',`${rows.length} registros exportados.`);}catch(error){toast('No se pudo exportar',translateError(error),'error');}}

  async function clearData(button){const confirmation=prompt('Escriba exactamente LIMPIAR DATOS para continuar:','');if(confirmation===null)return;await conCargaBoton(button,'Limpiando…',async()=>{try{await api.request('clearOperationalData',{confirmacion:confirmation});invalidarListasFormulario();cacheVistasModulo.clear();toast('Datos operativos eliminados','Se conservaron los usuarios, roles y la configuración de empresa.');await go('settings');}catch(error){toast('No se pudo limpiar',translateError(error),'error');}});}
  function setTheme(dark){document.body.classList.toggle('dark',dark);localStorage.setItem('flotas_tema',dark?'dark':'light');window.TemaFlotas?.aplicarGuardado?.();}

  function openModal(){const token=++secuenciaModal;$('#modalBackdrop').classList.add('open');document.body.classList.add('modal-open');return token;}
  function closeModal(){secuenciaModal+=1;$('#modalBackdrop').classList.remove('open');document.body.classList.remove('modal-open');}
  function openSidebar(){$('#sidebar').classList.add('open');$('#overlay').classList.add('open');}
  function closeSidebar(){$('#sidebar').classList.remove('open');$('#overlay').classList.remove('open');}

  async function openQr(){openQrBackdrop();await enumerateCameras();}
  function openQrBackdrop(){$('#qrBackdrop').classList.add('open');document.body.classList.add('modal-open');}
  function closeQr(){stopCamera();$('#qrBackdrop').classList.remove('open');if(!$('#modalBackdrop').classList.contains('open'))document.body.classList.remove('modal-open');}
  async function enumerateCameras(){try{const devices=await navigator.mediaDevices?.enumerateDevices();const cameras=(devices||[]).filter(d=>d.kind==='videoinput');$('#cameraSelect').innerHTML=cameras.length?cameras.map((c,i)=>`<option value="${c.deviceId}">${esc(c.label||`Cámara ${i+1}`)}</option>`).join(''):'<option value="">Cámara predeterminada</option>';}catch(_) {}}
  async function startCamera(deviceId=''){if(!navigator.mediaDevices?.getUserMedia)return toast('Cámara no compatible','Use el código manual.','error');stopCamera();try{mediaStream=await navigator.mediaDevices.getUserMedia({video:deviceId?{deviceId:{exact:deviceId}}:{facingMode:{ideal:facingMode}},audio:false});$('#qrVideo').srcObject=mediaStream;await $('#qrVideo').play();$('#cameraEmpty').classList.add('hidden');$('#scannerStatus').classList.add('active');$('#scannerStatus span').textContent='Buscando QR…';await enumerateCameras();if('BarcodeDetector'in window){barcodeDetector=new BarcodeDetector({formats:['qr_code']});scanFrame();}else $('#scannerStatus span').textContent='Cámara activa · use ingreso manual';}catch(error){toast('No se pudo abrir la cámara','Revise el permiso del navegador.','error');}}
  async function scanFrame(){if(!barcodeDetector||!mediaStream)return;try{if($('#qrVideo').readyState>=2){const codes=await barcodeDetector.detect($('#qrVideo'));if(codes.length)return processQr(codes[0].rawValue);}}catch(_){}scanFrameId=requestAnimationFrame(scanFrame);}
  function stopCamera(){if(scanFrameId)cancelAnimationFrame(scanFrameId);scanFrameId=null;if(mediaStream)mediaStream.getTracks().forEach(track=>track.stop());mediaStream=null;if($('#qrVideo'))$('#qrVideo').srcObject=null;$('#cameraEmpty')?.classList.remove('hidden');$('#scannerStatus')?.classList.remove('active');if($('#scannerStatus span'))$('#scannerStatus span').textContent='Cámara detenida';}
  async function processQr(code){try{const result=await api.request('validateVehicleQr',{codigo:String(code||'').trim()});const vehicle=result.row;if(!vehicle)throw new Error('QR_NO_RECONOCIDO');vehicle.AUTORIZACION_QR=result.autorizacionQr||'';closeQr();toast('Vehículo validado',`${vehicle.PATENTE} quedó listo para asociarlo a la operación.`);openOperationModal(vehicle);}catch(error){toast('No se pudo validar el QR',translateError(error),'error');}}

  async function logout(){try{await api.request('logout',{data:{SESION_CLIENTE_ID:clientSessionId}});}catch(_){}forceLogout();}
  function forceLogout(){cleanupSection();stopRealtimeServices();stopCamera();stopTracking({remember:false,silent:true});currentUser=null;precargaIniciada=false;cacheVistasModulo.clear();invalidarListasFormulario();api.setAuth({});postParent({tipo:'flotas:sesion-cerrada'});$('#appShell').classList.add('hidden');if(embeddedMode)return;$('#authScreen').classList.remove('hidden');checkSystem();}
  function showProfile(){openInfoModal('Mi perfil',[['Nombre',currentUser.NOMBRE],['Correo',currentUser.CORREO],['Rol',currentUser.ROL_NOMBRE],['Estado',currentUser.ESTADO],['Último acceso',fmtDate(currentUser.ULTIMO_ACCESO,true)]]);}
  function openInfoModal(title,items){$('#modalEyebrow').textContent='INFORMACIÓN';$('#modalTitle').textContent=title;$('#modalBody').innerHTML=`<div class="info-grid">${items.map(([a,b])=>`<div class="info-item"><span>${a}</span><b>${esc(b||'—')}</b></div>`).join('')}</div>`;openModal();}
  function openPasswordModal(){$('#modalEyebrow').textContent='SEGURIDAD';$('#modalTitle').textContent='Cambiar contraseña';$('#modalBody').innerHTML=`<form class="form-grid" id="passwordForm"><label class="field full"><span>Contraseña actual</span><input name="contrasenaActual" type="password" required></label><label class="field full"><span>Nueva contraseña</span><input name="nuevaContrasena" type="password" required placeholder="Letras, números o símbolos"></label><p class="helper full">Puede elegir cualquier combinación. La contraseña distingue mayúsculas y minúsculas.</p><div class="form-actions"><button class="btn soft" type="button" data-cancel-modal>Cancelar</button><button class="btn primary" type="submit">Cambiar contraseña</button></div></form>`;openModal();$('[data-cancel-modal]').onclick=closeModal;$('#passwordForm').onsubmit=async event=>{event.preventDefault();const form=event.currentTarget,button=$('button[type="submit"]',form);await conCargaBoton(button,'Actualizando…',async()=>{try{await api.request('changePassword',Object.fromEntries(new FormData(form).entries()));invalidarListasFormulario('users');closeModal();toast('Contraseña actualizada');}catch(error){toast('No se pudo cambiar',translateError(error),'error');}});};}

  function bindGlobal() {
    $('#setupForm').addEventListener('submit',handleSetup);$('#loginForm').addEventListener('submit',handleLogin);$('#showPassword').addEventListener('click',()=>{const input=$('#loginPassword');input.type=input.type==='password'?'text':'password';});
    $('#retryConnection').addEventListener('click',event=>conCargaBoton(event.currentTarget,'Conectando…',checkSystem));$('#recheckConnection').addEventListener('click',event=>conCargaBoton(event.currentTarget,'Conectando…',checkSystem));$('#useLocalMode').addEventListener('click',()=>{sessionStorage.setItem('flotas_forzar_local','1');location.reload();});
    $('#openSidebar').addEventListener('click',openSidebar);$('#closeSidebar').addEventListener('click',closeSidebar);$('#overlay').addEventListener('click',closeSidebar);$('#logoutButton').addEventListener('click',event=>conCargaBoton(event.currentTarget,'Cerrando…',logout));
    $('#syncButton').addEventListener('click',event=>sincronizarSistema(event.currentTarget));$('#sidebarSyncButton').addEventListener('click',event=>sincronizarSistema(event.currentTarget));
    $('#notificationButton').addEventListener('click',()=>{if(currentUser&&hasPermission('NOTIFICACIONES','LEER'))navigateSection('notifications');});
    $('#themeButton').addEventListener('click',()=>setTheme(!document.body.classList.contains('dark')));$('#profileButton').addEventListener('click',()=>$('#profileMenu').classList.toggle('open'));
    $('#profileMenu').addEventListener('click',event=>{const action=event.target.dataset.profileAction;if(action==='profile')showProfile();if(action==='password')openPasswordModal();if(action==='logout')conCargaBoton(event.target,'Cerrando…',logout);$('#profileMenu').classList.remove('open');});
    $('#closeModal').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',event=>{if(event.target===$('#modalBackdrop'))closeModal();});
    $('#closeQr').addEventListener('click',closeQr);$('#qrBackdrop').addEventListener('click',event=>{if(event.target===$('#qrBackdrop'))closeQr();});$('#startCamera').addEventListener('click',event=>conCargaBoton(event.currentTarget,'Activando…',()=>startCamera($('#cameraSelect').value)));$('#cameraSelect').addEventListener('change',event=>startCamera(event.target.value));$('#switchCamera').addEventListener('click',event=>conCargaBoton(event.currentTarget,'Cambiando…',()=>{facingMode=facingMode==='environment'?'user':'environment';return startCamera();}));$('#validateQr').addEventListener('click',event=>conCargaBoton(event.currentTarget,'Validando…',()=>processQr($('#manualQr').value)));
    window.addEventListener('flotas:guardado-local',()=>{setSave('Datos guardados');});
    window.addEventListener('flotas:sesion-invalida',event=>{
      if(embeddedMode){postParent({tipo:'flotas:autenticacion-requerida',codigo:event.detail?.codigo||'SESION_INVALIDA'});return;}
      if(currentUser)forceLogout();
    });
    window.addEventListener('flotas:sesion-cambiada',event=>{if(!event.detail?.token&&currentUser)forceLogout();});
    window.addEventListener('storage',event=>{if(event.key===config.CLAVE_ALMACENAMIENTO_LOCAL&&!api.isRemote()){api.reloadLocal();if(currentUser)go(currentSection);}});
    window.addEventListener('online',()=>{setConnection(true,'Conexión restablecida');sendHeartbeat();});window.addEventListener('offline',()=>setConnection(false,'Sin conexión a Internet'));
    document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeModal();closeQr();$('#profileMenu').classList.remove('open');}});
    window.addEventListener('message',event=>{
      if(!embeddedMode)return;
      if(event.origin!==location.origin&&event.origin!=='null')return;
      const data=event.data||{};
      if(data.tipo==='flotas:cerrar-sesion'&&currentUser)logout();
      if(data.tipo==='flotas:sincronizar'&&currentUser)go(currentSection,{force:true});
      if(data.tipo==='flotas:tema')setTheme(Boolean(data.oscuro));
    });
    document.addEventListener('visibilitychange',()=>{if(document.hidden){if(currentUser)sendHeartbeat('En segundo plano');releaseWakeLock();return;}if(currentUser){sendHeartbeat('En línea');resumeTrackingIfAllowed();if(gpsWatchId!==null)requestWakeLock();if(currentSection==='gps')refreshLocations(false,false);}});
  }

  function init(){bindGlobal();setTheme(window.TemaFlotas?.modoOscuroInicial?.()??localStorage.getItem('flotas_tema')==='dark');checkSystem();}
  window.addEventListener('pagehide',()=>{cleanupSection();stopRealtimeServices();stopCamera();releaseWakeLock();});
  init();
})();
