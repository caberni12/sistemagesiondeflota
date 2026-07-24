/** Diagnóstico y reparación segura de los módulos críticos. */
function diagnosticarHojaSistema_(sheetName) {
  const ss = obtenerSpreadsheet_();
  const expected = ESQUEMAS_APLICACION[sheetName] || [];
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { existe:false, columnas:false, filas:0, detalle:'Hoja no encontrada: ' + sheetName };
  const lastColumn = Math.max(1, sheet.getLastColumn());
  const current = sheet.getRange(1, 1, 1, Math.min(lastColumn, expected.length || lastColumn)).getValues()[0].map(function(value) { return String(value || '').trim(); });
  const columnsOk = expected.length > 0 && current.slice(0, expected.length).join('|') === expected.join('|');
  return {
    existe:true,
    columnas:columnsOk,
    filas:Math.max(0, sheet.getLastRow() - 1),
    detalle:(columnsOk ? 'Columnas correctas' : 'Columnas desactualizadas') + ' · ' + Math.max(0, sheet.getLastRow() - 1) + ' registros'
  };
}

function estadoModuloDiagnostico_(nombre, sheetNames, extraOk, extraDetail) {
  const sheets = sheetNames.map(diagnosticarHojaSistema_);
  const structureOk = sheets.every(function(item) { return item.existe && item.columnas; });
  const ok = structureOk && extraOk !== false;
  return {
    nombre:nombre,
    estado:ok ? 'OK' : 'REVISAR',
    detalle:sheets.map(function(item) { return item.detalle; }).join(' · ') + (extraDetail ? ' · ' + extraDetail : '')
  };
}

function listarRegistrosDiagnosticoSeguro_(sheetName) {
  try { return listarRegistros_(sheetName, {}); }
  catch (error) { return []; }
}

function diagnosticoSistema_(request, session) {
  exigirPermiso_(session.user, 'CONFIGURACION', 'LEER');
  const company = obtenerEmpresaPrincipal_() || {};
  const point = puntoOperacionDesdeEmpresa_(company) || obtenerRespaldoPuntoOperacion_();
  const latitude = point ? Number(point.LATITUD) : NaN;
  const longitude = point ? Number(point.LONGITUD) : NaN;
  const pointOk = Boolean(point) && isFinite(latitude) && isFinite(longitude);
  const drivers = listarRegistrosDiagnosticoSeguro_('CONDUCTORES').length;
  const vehicles = listarRegistrosDiagnosticoSeguro_('VEHICULOS').length;
  const approvedCheckins = listarRegistrosDiagnosticoSeguro_('CHECKINS').filter(function(row) {
    return row.ESTADO_REVISION === 'Aprobado' && row.UTILIZADO !== 'SI' && (!row.VIGENTE_HASTA || new Date(row.VIGENTE_HASTA).getTime() > Date.now());
  }).length;
  const modules = {
    structure: estadoModuloDiagnostico_('Estructura general', Object.keys(ESQUEMAS_APLICACION), true, 'Todas las hojas del sistema'),
    routes: estadoModuloDiagnostico_('Asignación de rutas', ['RUTAS','CONDUCTORES','VEHICULOS'], drivers > 0, drivers + ' conductores · ' + vehicles + ' vehículos'),
    operations: estadoModuloDiagnostico_('Operaciones y punto base', ['OPERACIONES','EMPRESAS','CHECKINS'], pointOk, pointOk ? 'Punto operacional configurado · ' + approvedCheckins + ' check-ins disponibles' : 'Falta configurar el punto operacional'),
    gps: estadoModuloDiagnostico_('Mapa en tiempo real', ['GPS','GPS_ACTUAL','CONEXIONES'], true, listarRegistrosDiagnosticoSeguro_('GPS_ACTUAL').length + ' posiciones actuales'),
    notifications: estadoModuloDiagnostico_('Notificaciones', ['NOTIFICACIONES'], true, listarRegistrosDiagnosticoSeguro_('NOTIFICACIONES').length + ' registros'),
    alerts: estadoModuloDiagnostico_('Alertas', ['ALERTAS'], true, listarRegistrosDiagnosticoSeguro_('ALERTAS').length + ' registros'),
    history: estadoModuloDiagnostico_('Historiales', ['HISTORIAL','BITACORA','CHECKINS'], true, listarRegistrosDiagnosticoSeguro_('HISTORIAL').length + ' eventos operativos')
  };
  const correct = Object.keys(modules).every(function(key) { return modules[key].estado === 'OK'; });
  return ok_({ version:VERSION_APLICACION, fecha:fechaIso_(), correcto:correct, modules:modules });
}

function repararSistema_(request, session) {
  exigirPermiso_(session.user, 'CONFIGURACION', 'ACTUALIZAR');
  reiniciarCachesEjecucion_();
  Object.keys(ESQUEMAS_APLICACION).forEach(function(sheetName) { asegurarHoja_(sheetName); });
  reiniciarCachesEjecucion_();
  asegurarCatalogos_();
  migrarGpsActualDesdeHistorial_();
  try { repararModuloCheckin(); } catch (error) { Logger.log('Check-in: ' + error.message); }
  registrarBitacora_(session.user, 'REPARAR_SISTEMA', 'CONFIGURACION', '', 'Hojas, columnas, catálogos, permisos, GPS actual y check-in verificados');
  reiniciarCachesEjecucion_();
  const diagnostic = diagnosticoSistema_({}, session).data;
  return ok_({ repaired:true, diagnostico:diagnostic });
}
