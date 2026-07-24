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
  const companies = listarRegistros_('EMPRESAS', {});
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


/** Guarda la identidad y los datos institucionales de la empresa. */
function guardarEmpresaServicio_(request, session) {
  exigirPermiso_(session.user, 'CONFIGURACION', 'ACTUALIZAR');
  const current = listarRegistros_('EMPRESAS', {})[0] || null;
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

  registrarBitacora_(session.user, 'ACTUALIZAR', 'CONFIGURACION', row.ID, 'Configuración de empresa guardada');
  return ok_({ row: limpiarSalidaRecurso_('EMPRESAS', row) });
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
