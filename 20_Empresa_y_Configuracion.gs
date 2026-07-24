/** Configuración y parámetros. */

const CAMPOS_COLOR_TEMA_EMPRESA_ = [
  'COLOR_PRINCIPAL','COLOR_SECUNDARIO','COLOR_ACENTO','COLOR_FONDO','COLOR_SUPERFICIE','COLOR_TEXTO','COLOR_TEXTO_SECUNDARIO','COLOR_BORDE',
  'COLOR_MENU','COLOR_MENU_SECUNDARIO','COLOR_EXITO','COLOR_ADVERTENCIA','COLOR_PELIGRO','COLOR_FONDO_OSCURO','COLOR_SUPERFICIE_OSCURO',
  'COLOR_TEXTO_OSCURO','COLOR_TEXTO_SECUNDARIO_OSCURO','COLOR_BORDE_OSCURO'
];
function validarTemaEmpresa_(data) {
  CAMPOS_COLOR_TEMA_EMPRESA_.forEach(function(campo) {
    if (!Object.prototype.hasOwnProperty.call(data, campo) || data[campo] === '') return;
    const value = String(data[campo] || '').trim().toUpperCase();
    if (!/^#[0-9A-F]{6}$/.test(value)) throw new Error('COLOR_TEMA_INVALIDO_' + campo);
    data[campo] = value;
  });
  if (Object.prototype.hasOwnProperty.call(data, 'TEMA_PREDETERMINADO')) {
    const mode = String(data.TEMA_PREDETERMINADO || 'Sistema');
    if (['Claro','Oscuro','Sistema'].indexOf(mode) < 0) throw new Error('TEMA_PREDETERMINADO_INVALIDO');
    data.TEMA_PREDETERMINADO = mode;
  }
  return data;
}


function fechaEmpresaMilisegundos_(row) {
  const value = row && (row.ACTUALIZADO_EN || row.CREADO_EN);
  const time = value ? new Date(value).getTime() : 0;
  return isFinite(time) ? time : 0;
}

function ordenarEmpresasPrincipal_(rows) {
  return (rows || []).slice().sort(function(a, b) {
    const activeA = String(a.ESTADO || 'Activo') === 'Activo' ? 1 : 0;
    const activeB = String(b.ESTADO || 'Activo') === 'Activo' ? 1 : 0;
    if (activeA !== activeB) return activeB - activeA;
    return fechaEmpresaMilisegundos_(b) - fechaEmpresaMilisegundos_(a);
  });
}

function obtenerEmpresaPrincipal_() {
  asegurarHoja_('EMPRESAS');
  return ordenarEmpresasPrincipal_(listarRegistros_('EMPRESAS', {}))[0] || null;
}

function puntoOperacionDesdeEmpresa_(company) {
  if (!company || String(company.VALIDAR_UBICACION_OPERACION || 'SI') === 'NO') return null;
  const latitudeText = String(company.PUNTO_OPERACION_LATITUD == null ? '' : company.PUNTO_OPERACION_LATITUD).trim();
  const longitudeText = String(company.PUNTO_OPERACION_LONGITUD == null ? '' : company.PUNTO_OPERACION_LONGITUD).trim();
  const latitude = Number(latitudeText);
  const longitude = Number(longitudeText);
  if (!latitudeText || !longitudeText || !isFinite(latitude) || !isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  return {
    NOMBRE: String(company.PUNTO_OPERACION_NOMBRE || 'Base operacional').trim(),
    DIRECCION: String(company.PUNTO_OPERACION_DIRECCION || company.DIRECCION || 'Base operacional').trim(),
    LATITUD: latitude,
    LONGITUD: longitude,
    RADIO_INICIO_METROS: Math.max(10, Number(company.RADIO_INICIO_METROS || 150)),
    RADIO_FIN_METROS: Math.max(10, Number(company.RADIO_FIN_METROS || 150)),
    PRECISION_GPS_MAXIMA_METROS: Math.max(10, Number(company.PRECISION_GPS_MAXIMA_METROS || 120)),
    RETORNO_BASE_OBLIGATORIO: String(company.RETORNO_BASE_OBLIGATORIO || 'SI') !== 'NO' ? 'SI' : 'NO'
  };
}

function guardarRespaldoPuntoOperacion_(company) {
  const point = puntoOperacionDesdeEmpresa_(company);
  if (!point) return null;
  PropertiesService.getScriptProperties().setProperty('PUNTO_OPERACIONAL_RESPALDO', JSON.stringify(point));
  return point;
}

function obtenerRespaldoPuntoOperacion_() {
  const text = PropertiesService.getScriptProperties().getProperty('PUNTO_OPERACIONAL_RESPALDO');
  if (!text) return null;
  try {
    const point = JSON.parse(text);
    const company = {
      VALIDAR_UBICACION_OPERACION: 'SI',
      PUNTO_OPERACION_NOMBRE: point.NOMBRE,
      PUNTO_OPERACION_DIRECCION: point.DIRECCION,
      PUNTO_OPERACION_LATITUD: point.LATITUD,
      PUNTO_OPERACION_LONGITUD: point.LONGITUD,
      RADIO_INICIO_METROS: point.RADIO_INICIO_METROS,
      RADIO_FIN_METROS: point.RADIO_FIN_METROS,
      PRECISION_GPS_MAXIMA_METROS: point.PRECISION_GPS_MAXIMA_METROS,
      RETORNO_BASE_OBLIGATORIO: point.RETORNO_BASE_OBLIGATORIO
    };
    return puntoOperacionDesdeEmpresa_(company);
  } catch (error) {
    return null;
  }
}


function validarPuntoOperacionEmpresa_(data, current) {
  const merged = Object.assign({}, current || {}, data || {});
  const enabled = String(merged.VALIDAR_UBICACION_OPERACION || 'SI') !== 'NO';
  if (Object.prototype.hasOwnProperty.call(data, 'VALIDAR_UBICACION_OPERACION')) data.VALIDAR_UBICACION_OPERACION = enabled ? 'SI' : 'NO';
  if (Object.prototype.hasOwnProperty.call(data, 'RETORNO_BASE_OBLIGATORIO')) data.RETORNO_BASE_OBLIGATORIO = String(data.RETORNO_BASE_OBLIGATORIO || 'SI') === 'NO' ? 'NO' : 'SI';
  ['PUNTO_OPERACION_LATITUD','PUNTO_OPERACION_LONGITUD'].forEach(function(field) {
    if (!Object.prototype.hasOwnProperty.call(data, field) || data[field] === '') return;
    const value = Number(data[field]);
    if (!isFinite(value)) throw new Error('COORDENADAS_INVALIDAS');
    if (field.indexOf('LATITUD') >= 0 && (value < -90 || value > 90)) throw new Error('COORDENADAS_INVALIDAS');
    if (field.indexOf('LONGITUD') >= 0 && (value < -180 || value > 180)) throw new Error('COORDENADAS_INVALIDAS');
    data[field] = value;
  });
  ['RADIO_INICIO_METROS','RADIO_FIN_METROS','PRECISION_GPS_MAXIMA_METROS'].forEach(function(field) {
    if (!Object.prototype.hasOwnProperty.call(data, field) || data[field] === '') return;
    const value = Math.round(Number(data[field]));
    if (!isFinite(value) || value < 10 || value > 5000) throw new Error('RADIO_OPERACION_INVALIDO');
    data[field] = value;
  });
  if (enabled && (Object.prototype.hasOwnProperty.call(data, 'PUNTO_OPERACION_LATITUD') || Object.prototype.hasOwnProperty.call(data, 'PUNTO_OPERACION_LONGITUD') || Object.prototype.hasOwnProperty.call(data, 'VALIDAR_UBICACION_OPERACION'))) {
    const latitude = Number(Object.prototype.hasOwnProperty.call(data, 'PUNTO_OPERACION_LATITUD') ? data.PUNTO_OPERACION_LATITUD : merged.PUNTO_OPERACION_LATITUD);
    const longitude = Number(Object.prototype.hasOwnProperty.call(data, 'PUNTO_OPERACION_LONGITUD') ? data.PUNTO_OPERACION_LONGITUD : merged.PUNTO_OPERACION_LONGITUD);
    if (!isFinite(latitude) || !isFinite(longitude)) throw new Error('PUNTO_OPERACION_NO_CONFIGURADO');
  }
  return data;
}

function estadoSistema_() {
  const ss = obtenerSpreadsheet_();
  try { obtenerHoja_('USUARIOS'); }
  catch (error) { instalarSistema(); reiniciarCachesEjecucion_(); }
  asegurarCatalogos_();
  const users = listarRegistros_('USUARIOS', {});
  const usersWithAccess = users.filter(usuarioTieneAccesoConfigurado_);
  const companies = ordenarEmpresasPrincipal_(listarRegistros_('EMPRESAS', {}));
  return ok_({
    connected: true,
    version: VERSION_APLICACION,
    spreadsheetName: ss.getName(),
    needsSetup: usersWithAccess.length === 0,
    setupMode: usersWithAccess.length === 0 ? 'PRECONFIGURACION_AUTOMATICA' : 'ACCESO',
    company: companies.length ? limpiarSalidaRecurso_('EMPRESAS', companies[0]) : null,
    rows: {
      users: users.length,
      usersWithAccess: usersWithAccess.length,
      vehicles: listarRegistros_('VEHICULOS', {}).length,
      drivers: listarRegistros_('CONDUCTORES', {}).length,
      operations: listarRegistros_('OPERACIONES', {}).length,
    },
  });
}


/** Repara o restaura el punto operacional sin eliminar información. */
function repararPuntoOperacional() {
  asegurarHoja_('EMPRESAS');
  reiniciarCachesEjecucion_();
  let company = obtenerEmpresaPrincipal_();
  let point = puntoOperacionDesdeEmpresa_(company);
  if (point) {
    guardarRespaldoPuntoOperacion_(company);
    return { ok:true, configurado:true, restaurado:false, empresaId:company.ID, point:point };
  }
  point = obtenerRespaldoPuntoOperacion_();
  if (!point) return { ok:true, configurado:false, restaurado:false, message:'Configure la base desde Operaciones o Configuración.' };
  const data = {
    VALIDAR_UBICACION_OPERACION:'SI', RETORNO_BASE_OBLIGATORIO:'SI',
    PUNTO_OPERACION_NOMBRE:point.NOMBRE, PUNTO_OPERACION_DIRECCION:point.DIRECCION,
    PUNTO_OPERACION_LATITUD:point.LATITUD, PUNTO_OPERACION_LONGITUD:point.LONGITUD,
    RADIO_INICIO_METROS:point.RADIO_INICIO_METROS, RADIO_FIN_METROS:point.RADIO_FIN_METROS,
    PRECISION_GPS_MAXIMA_METROS:point.PRECISION_GPS_MAXIMA_METROS
  };
  if (!company) {
    data.NOMBRE_FANTASIA = point.NOMBRE || 'Empresa'; data.RAZON_SOCIAL = data.NOMBRE_FANTASIA;
    data.DIRECCION = point.DIRECCION || ''; data.ESTADO = 'Activo';
    company = insertarRegistro_('EMPRESAS', data, 'EMP');
  } else {
    company = actualizarRegistro_('EMPRESAS', company.ID, data);
  }
  SpreadsheetApp.flush(); reiniciarCachesEjecucion_();
  const confirmed = obtenerRegistro_('EMPRESAS', company.ID);
  const confirmedPoint = puntoOperacionDesdeEmpresa_(confirmed);
  if (!confirmedPoint) throw new Error('PUNTO_OPERACION_NO_CONFIRMADO');
  return { ok:true, configurado:true, restaurado:true, empresaId:company.ID, point:confirmedPoint };
}

/** Guarda la identidad y los datos institucionales de la empresa. */
function guardarEmpresaServicio_(request, session) {
  if (String(session.user.ROL_ID || '') !== 'ROL-ADMIN') throw new Error('PERMISO_DENEGADO');
  exigirPermiso_(session.user, 'CONFIGURACION', 'ACTUALIZAR');
  asegurarHoja_('EMPRESAS');
  const current = obtenerEmpresaPrincipal_();
  const data = validarPuntoOperacionEmpresa_(validarTemaEmpresa_(normalizarEntradaRecurso_('EMPRESAS', request.datos || {}, session.user)), current);

  if (String(request.eliminarLogotipo || '') === 'SI') {
    eliminarLogoAnterior_(current);
    data.DIRECCION_LOGOTIPO = '';
    data.ID_ARCHIVO_LOGOTIPO = '';
    data.NOMBRE_ARCHIVO_LOGOTIPO = '';
    data.TIPO_ARCHIVO_LOGOTIPO = '';
  }

  if (request.logotipoBase64) {
    eliminarLogoAnterior_(current);
    const logo = guardarLogoEmpresaEnDrive_(request.logotipoBase64, request.nombreLogotipo, request.tipoLogotipo);
    data.DIRECCION_LOGOTIPO = logo.url;
    data.ID_ARCHIVO_LOGOTIPO = logo.id;
    data.NOMBRE_ARCHIVO_LOGOTIPO = logo.nombre;
    data.TIPO_ARCHIVO_LOGOTIPO = logo.tipo;
  }

  if (!data.ESTADO) data.ESTADO = 'Activo';
  const row = current
    ? actualizarRegistro_('EMPRESAS', current.ID, data)
    : insertarRegistro_('EMPRESAS', data, 'EMP');
  SpreadsheetApp.flush();
  invalidarCacheHoja_('EMPRESAS');
  const confirmed = obtenerRegistro_('EMPRESAS', row.ID) || row;
  if (puntoOperacionDesdeEmpresa_(confirmed)) guardarRespaldoPuntoOperacion_(confirmed);

  registrarBitacora_(session.user, 'ACTUALIZAR', 'CONFIGURACION', row.ID, 'Configuración de empresa guardada');
  return ok_({ row: limpiarSalidaRecurso_('EMPRESAS', confirmed), confirmado:true });
}

/** Guarda y confirma exclusivamente el punto operacional. */
function guardarPuntoOperacionServicio_(request, session) {
  if (['ROL-ADMIN','ROL-SUPERVISOR'].indexOf(String(session.user.ROL_ID || '')) < 0) throw new Error('PUNTO_OPERACION_ROL_NO_AUTORIZADO');
  asegurarHoja_('EMPRESAS');
  const current = obtenerEmpresaPrincipal_();
  const raw = Object.assign({}, request.datos || request || {});
  raw.VALIDAR_UBICACION_OPERACION = 'SI';
  raw.RETORNO_BASE_OBLIGATORIO = 'SI';
  if (!String(raw.PUNTO_OPERACION_NOMBRE || '').trim()) raw.PUNTO_OPERACION_NOMBRE = 'Base operacional';
  if (!String(raw.PUNTO_OPERACION_DIRECCION || '').trim()) raw.PUNTO_OPERACION_DIRECCION = String((current && current.DIRECCION) || raw.PUNTO_OPERACION_NOMBRE || 'Base operacional');
  const clean = normalizarEntradaRecurso_('EMPRESAS', raw, session.user);
  const data = validarPuntoOperacionEmpresa_(clean, current);
  const fields = ['VALIDAR_UBICACION_OPERACION','PUNTO_OPERACION_NOMBRE','PUNTO_OPERACION_DIRECCION','PUNTO_OPERACION_LATITUD','PUNTO_OPERACION_LONGITUD','RADIO_INICIO_METROS','RADIO_FIN_METROS','PRECISION_GPS_MAXIMA_METROS','RETORNO_BASE_OBLIGATORIO'];
  const pointData = {};
  fields.forEach(function(field) { if (Object.prototype.hasOwnProperty.call(data, field)) pointData[field] = data[field]; });
  const oldPoint = puntoOperacionDesdeEmpresa_(current);
  const ipCliente = normalizarIpPublica_((request.datos || request || {}).IP_PUBLICA || session.session.IP_PUBLICA || '');
  pointData.PUNTO_OPERACION_MODIFICADO_POR = session.user.ID;
  pointData.PUNTO_OPERACION_MODIFICADO_ROL = session.user.ROL_ID;
  pointData.PUNTO_OPERACION_MODIFICADO_IP = ipCliente;
  pointData.PUNTO_OPERACION_MODIFICADO_EN = new Date();
  if (!current) {
    pointData.NOMBRE_FANTASIA = pointData.PUNTO_OPERACION_NOMBRE || 'Empresa';
    pointData.RAZON_SOCIAL = pointData.NOMBRE_FANTASIA;
    pointData.DIRECCION = pointData.PUNTO_OPERACION_DIRECCION || '';
    pointData.ESTADO = 'Activo';
  }
  const row = current
    ? actualizarRegistro_('EMPRESAS', current.ID, pointData)
    : insertarRegistro_('EMPRESAS', pointData, 'EMP');
  SpreadsheetApp.flush();
  reiniciarCachesEjecucion_();
  const confirmed = obtenerRegistro_('EMPRESAS', row.ID);
  const point = puntoOperacionDesdeEmpresa_(confirmed);
  if (!confirmed || !point) throw new Error('PUNTO_OPERACION_NO_CONFIRMADO');
  guardarRespaldoPuntoOperacion_(confirmed);
  const detalleCambio = oldPoint
    ? 'Punto operacional actualizado de ' + oldPoint.LATITUD + ',' + oldPoint.LONGITUD + ' a ' + point.LATITUD + ',' + point.LONGITUD
    : 'Punto operacional creado en ' + point.LATITUD + ',' + point.LONGITUD;
  registrarBitacora_(session.user, 'CONFIGURAR_PUNTO', 'CONFIGURACION', row.ID, detalleCambio, ipCliente);
  return ok_({ row: limpiarSalidaRecurso_('EMPRESAS', confirmed), point:point, confirmado:true });
}

function guardarLogoEmpresaEnDrive_(dataUrl, nombre, tipo) {
  const text = String(dataUrl || '');
  const match = text.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('FORMATO_LOGOTIPO_INVALIDO');
  const mimeType = String(tipo || match[1] || 'image/png');
  if (['image/png','image/jpeg','image/webp'].indexOf(mimeType) < 0) throw new Error('FORMATO_LOGOTIPO_INVALIDO');
  const bytes = Utilities.base64Decode(match[2]);
  if (bytes.length > 1572864) throw new Error('LOGOTIPO_DEMASIADO_GRANDE');

  const properties = PropertiesService.getScriptProperties();
  let folderId = properties.getProperty('ID_CARPETA_LOGOTIPOS');
  let folder = null;
  if (folderId) {
    try { folder = DriveApp.getFolderById(folderId); } catch (error) { folder = null; }
  }
  if (!folder) {
    folder = DriveApp.createFolder('Logotipos - Sistema de Gestión de Flotas');
    properties.setProperty('ID_CARPETA_LOGOTIPOS', folder.getId());
  }

  const cleanName = String(nombre || 'logotipo_empresa.png').replace(/[^a-zA-Z0-9._-]/g, '_');
  const blob = Utilities.newBlob(bytes, mimeType, cleanName);
  const file = folder.createFile(blob);
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (error) {}
  return {
    id: file.getId(),
    nombre: file.getName(),
    tipo: mimeType,
    url: 'https://drive.google.com/uc?export=view&id=' + file.getId(),
  };
}

function eliminarLogoAnterior_(company) {
  if (!company || !company.ID_ARCHIVO_LOGOTIPO) return;
  try { DriveApp.getFileById(company.ID_ARCHIVO_LOGOTIPO).setTrashed(true); } catch (error) {}
}
