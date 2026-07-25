/** Registro rápido de posición actual y conservación espaciada del historial GPS. */
function obtenerHojaGpsActual_() {
  try {
    return obtenerHoja_('GPS_ACTUAL');
  } catch (error) {
    return asegurarHoja_('GPS_ACTUAL');
  }
}

function claveSeguimientoGps_(data) {
  return String(data.VEHICULO_ID || data.CONDUCTOR_ID || data.DISPOSITIVO_ID || '').slice(0, 160);
}

function migrarGpsActualDesdeHistorial_() {
  const properties = PropertiesService.getScriptProperties();
  const marker = 'GPS_ACTUAL_MIGRADO_' + VERSION_APLICACION;
  if (properties.getProperty(marker) === 'SI') return;
  obtenerHojaGpsActual_();
  const currentRows = listarRegistros_('GPS_ACTUAL', {});
  const currentKeys = {};
  currentRows.forEach(function(row) { currentKeys[String(row.CLAVE_SEGUIMIENTO || claveSeguimientoGps_(row))] = true; });
  const history = listarRegistros_('GPS', {});
  history.sort(function(a,b) { return new Date(b.FECHA_HORA).getTime() - new Date(a.FECHA_HORA).getTime(); });
  const pending = {};
  history.forEach(function(row) {
    const key = claveSeguimientoGps_(row);
    if (key && !currentKeys[key] && !pending[key]) pending[key] = row;
  });
  Object.keys(pending).forEach(function(key) { guardarPosicionActual_(pending[key]); });
  properties.setProperty(marker, 'SI');
}

function guardarPosicionActual_(data) {
  const key = claveSeguimientoGps_(data);
  if (!key) throw new Error('CLAVE_SEGUIMIENTO_GPS_REQUERIDA');
  const lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    const sheet = obtenerHojaGpsActual_();
    const headers = ESQUEMAS_APLICACION.GPS_ACTUAL;
    const keyIndex = headers.indexOf('CLAVE_SEGUIMIENTO');
    const rowNumber = buscarFilaExacta_(sheet, keyIndex + 1, key);
    const now = new Date();
    let current = {};
    if (rowNumber >= 2) {
      const values = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
      headers.forEach(function(header, index) { current[header] = values[index]; });
    } else {
      current.ID = generarId_('GPA');
      current.CREADO_EN = now;
      current.ELIMINADO = 'NO';
    }
    Object.keys(data).forEach(function(field) {
      if (headers.indexOf(field) >= 0 && field !== 'ID' && field !== 'CREADO_EN') current[field] = data[field];
    });
    current.CLAVE_SEGUIMIENTO = key;
    current.ACTUALIZADO_EN = now;
    const values = headers.map(function(header) { return deserializarFecha_(current[header]); });
    const destinationRow = rowNumber >= 2 ? rowNumber : Math.max(2, sheet.getLastRow() + 1);
    sheet.getRange(destinationRow, 1, 1, headers.length).setValues([values]);
    invalidarCacheHoja_('GPS_ACTUAL');
    invalidarCacheTiempoReal_('GPS_ACTUAL');
    return limpiarSalidaRecurso_('GPS_ACTUAL', current);
  } finally {
    lock.releaseLock();
  }
}

function debeGuardarHistorialGps_(data) {
  const key = 'hist_gps_' + claveSeguimientoGps_(data).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 80);
  const cache = CacheService.getScriptCache();
  const now = Date.now();
  const previous = Number(cache.get(key) || 0);
  const seconds = Number(CONFIGURACION_APLICACION.SEGUNDOS_HISTORIAL_GPS || 60);
  if (previous && now - previous < seconds * 1000) return false;
  cache.put(key, String(now), Math.max(60, seconds * 3));
  return true;
}

function claveAsignacionGps_(userId) {
  return ('asig_gps_' + userId).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 220);
}

function guardarAsignacionGpsCache_(userId, values) {
  if (!userId) return;
  try { CacheService.getScriptCache().put(claveAsignacionGps_(userId), JSON.stringify(values || {}), 90); } catch (_) {}
}

function obtenerAsignacionGpsCache_(userId, driverId) {
  try {
    const saved = CacheService.getScriptCache().get(claveAsignacionGps_(userId));
    const values = saved ? JSON.parse(saved) : null;
    if (values && (!driverId || !values.CONDUCTOR_ID || values.CONDUCTOR_ID === driverId)) return values;
  } catch (_) {}
  return null;
}

function debeActualizarConexionDesdeGps_(userId, deviceId) {
  if (!deviceId) return false;
  const key = ('cnx_gps_' + userId + '_' + deviceId).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 220);
  const cache = CacheService.getScriptCache();
  if (cache.get(key)) return false;
  const seconds = Number(CONFIGURACION_APLICACION.SEGUNDOS_ACTUALIZAR_CONEXION_DESDE_GPS || 20);
  cache.put(key, '1', Math.max(10, seconds));
  return true;
}

function claveCacheTiempoReal_(sheetName) {
  return 'tr_meta_' + VERSION_APLICACION + '_' + sheetName;
}

function invalidarCacheTiempoReal_(sheetName) {
  try { CacheService.getScriptCache().remove(claveCacheTiempoReal_(sheetName)); } catch (_) {}
}

function listarRegistrosCacheadosTiempoReal_(sheetName, secondsOverride) {
  const seconds = Number(secondsOverride || CONFIGURACION_APLICACION.SEGUNDOS_CACHE_METADATOS_TIEMPO_REAL || 10);
  const key = claveCacheTiempoReal_(sheetName);
  const cache = CacheService.getScriptCache();
  try {
    const saved = cache.get(key);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  let rows = listarRegistros_(sheetName, {});
  if (sheetName === 'USUARIOS') rows = rows.map(function(row) { return { ID:row.ID, NOMBRE:row.NOMBRE }; });
  try { cache.put(key, JSON.stringify(rows), Math.max(5, seconds)); } catch (_) {}
  return rows;
}

function filtroVehiculosTiempoReal_(request, user) {
  if (user && ['ROL-ADMIN','ROL-SUPERVISOR'].indexOf(user.ROL_ID) < 0) return { activo:false, ids:{} };
  const raw = String(request.vehiculos || request.VEHICULOS || '').trim();
  if (!raw) return { activo:false, ids:{} };
  if (raw === '__NINGUNO__') return { activo:true, ids:{} };
  const ids = {};
  raw.split(',').map(function(value) { return value.trim(); }).filter(Boolean).forEach(function(id) { ids[id] = true; });
  return { activo:true, ids:ids };
}

function guardarUbicacion_(request, session) {
  exigirPermiso_(session.user, 'GPS', 'CREAR');
  const data = request.datos || request;
  validarRequeridos_(data, ['LATITUD','LONGITUD']);
  const latitude = Number(data.LATITUD);
  const longitude = Number(data.LONGITUD);
  if (!isFinite(latitude) || !isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error('COORDENADAS_INVALIDAS');
  }
  let driverId = data.CONDUCTOR_ID || '';
  if (!driverId && session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const driver = obtenerConductorDeUsuario_(session.user.ID);
    if (driver) driverId = driver.ID;
  }
  let operationId = data.OPERACION_ID || '';
  let vehicleId = data.VEHICULO_ID || '';
  const cachedAssignment = obtenerAsignacionGpsCache_(session.user.ID, driverId);
  if (!operationId && cachedAssignment) {
    operationId = cachedAssignment.OPERACION_ID || '';
    vehicleId = vehicleId || cachedAssignment.VEHICULO_ID || '';
  }
  if (!operationId && driverId) {
    const active = listarRegistros_('OPERACIONES', {}).find(function(row) {
      return row.CONDUCTOR_ID === driverId && row.ESTADO === 'Activa';
    });
    if (active) { operationId = active.ID; vehicleId = active.VEHICULO_ID; }
  }
  const fecha = data.FECHA_HORA ? new Date(data.FECHA_HORA) : new Date();
  const values = {
    OPERACION_ID: operationId,
    CONDUCTOR_ID: driverId,
    VEHICULO_ID: vehicleId,
    LATITUD: latitude,
    LONGITUD: longitude,
    DIRECCION: data.DIRECCION || (latitude.toFixed(6) + ', ' + longitude.toFixed(6)),
    PRECISION_METROS: Number(data.PRECISION_METROS || 0),
    VELOCIDAD_KMH: Number(data.VELOCIDAD_KMH || 0),
    RUMBO: Number(data.RUMBO || 0),
    BATERIA_PORCENTAJE: data.BATERIA_PORCENTAJE === '' ? '' : Number(data.BATERIA_PORCENTAJE || 0),
    DISPOSITIVO_ID: String(data.DISPOSITIVO_ID || ''),
    FECHA_HORA: fecha,
    FUENTE: data.FUENTE || 'GPS real',
    ELIMINADO: 'NO',
  };

  const current = guardarPosicionActual_(values);
  let history = null;
  if (debeGuardarHistorialGps_(values)) history = insertarRegistro_('GPS', values, 'GPS');

  if (data.DISPOSITIVO_ID && debeActualizarConexionDesdeGps_(session.user.ID, data.DISPOSITIVO_ID)) {
    actualizarConexion_({ datos:{
      DISPOSITIVO_ID: data.DISPOSITIVO_ID,
      SESION_CLIENTE_ID: data.SESION_CLIENTE_ID || '',
      SECCION_ACTUAL: data.SECCION_ACTUAL || 'gps',
      GPS_ACTIVO: 'SI',
      PAGINA_VISIBLE: data.PAGINA_VISIBLE || 'SI',
      ESTADO: 'En línea',
      BATERIA_PORCENTAJE: data.BATERIA_PORCENTAJE,
      TIPO_RED: data.TIPO_RED || '',
      PLATAFORMA: data.PLATAFORMA || '',
      NAVEGADOR: data.NAVEGADOR || ''
    } }, session);
  }
  try { solicitarRevisionAlertasSegundoPlano_('Nueva ubicación GPS'); } catch (_) {}
  return ok_({ row: current, historialGuardado:Boolean(history) });
}

function ultimasUbicaciones_(request, session) {
  exigirPermiso_(session.user, 'GPS', 'LEER');
  migrarGpsActualDesdeHistorial_();
  let rows = [];
  try { rows = listarRegistrosCacheadosTiempoReal_('GPS_ACTUAL', 2); } catch (_) {}
  if (!rows.length) {
    const history = listarRegistros_('GPS', {});
    history.sort(function(a,b) { return new Date(b.FECHA_HORA).getTime() - new Date(a.FECHA_HORA).getTime(); });
    const latest = {};
    history.forEach(function(row) {
      const key = row.VEHICULO_ID || row.CONDUCTOR_ID || row.DISPOSITIVO_ID || row.ID;
      if (!latest[key]) latest[key] = row;
    });
    rows = Object.keys(latest).map(function(key) { return latest[key]; });
  }
  rows = filtrarPorUsuario_('GPS_ACTUAL', rows, session.user);
  rows.sort(function(a,b) { return new Date(b.FECHA_HORA).getTime() - new Date(a.FECHA_HORA).getTime(); });

  const drivers = listarRegistrosCacheadosTiempoReal_('CONDUCTORES');
  const allVehicles = listarRegistrosCacheadosTiempoReal_('VEHICULOS');
  const visibleVehicles = filtrarPorUsuario_('VEHICULOS', allVehicles, session.user);
  const vehicleFilter = filtroVehiculosTiempoReal_(request, session.user);
  const enrichedRows = rows.map(function(row) {
    const driver = drivers.find(function(item) { return item.ID === row.CONDUCTOR_ID; });
    const vehicle = allVehicles.find(function(item) { return item.ID === row.VEHICULO_ID; });
    return Object.assign({}, row, {
      CONDUCTOR_NOMBRE: driver ? driver.NOMBRE : '',
      VEHICULO_PATENTE: vehicle ? vehicle.PATENTE : '',
      VEHICULO_MARCA: vehicle ? vehicle.MARCA : '',
      VEHICULO_MODELO: vehicle ? vehicle.MODELO : '',
    });
  });
  const latestByVehicle = {};
  enrichedRows.forEach(function(row) {
    if (row.VEHICULO_ID && !latestByVehicle[row.VEHICULO_ID]) latestByVehicle[row.VEHICULO_ID] = row;
  });
  const output = enrichedRows.filter(function(row) {
    return !vehicleFilter.activo || Boolean(vehicleFilter.ids[row.VEHICULO_ID]);
  });

  return ok_({
    rows: output,
    total: output.length,
    trackingVehicles: visibleVehicles.map(function(vehicle) {
      const latest = latestByVehicle[vehicle.ID] || {};
      return {
        ID: vehicle.ID,
        PATENTE: vehicle.PATENTE || vehicle.ID,
        MARCA: vehicle.MARCA || '',
        MODELO: vehicle.MODELO || '',
        ESTADO: vehicle.ESTADO || '',
        CONDUCTOR_ID: latest.CONDUCTOR_ID || '',
        CONDUCTOR_NOMBRE: latest.CONDUCTOR_NOMBRE || '',
        ULTIMA_POSICION: latest.FECHA_HORA || '',
      };
    }).sort(function(a,b) { return String(a.PATENTE).localeCompare(String(b.PATENTE)); })
  });
}

function obtenerDireccionCoordenadas_(latitude, longitude) {
  const key = 'direccion_' + Number(latitude).toFixed(5) + '_' + Number(longitude).toFixed(5);
  const cache = CacheService.getScriptCache();
  const saved = cache.get(key);
  if (saved) return saved;
  let address = Number(latitude).toFixed(6) + ', ' + Number(longitude).toFixed(6);
  try {
    const response = Maps.newGeocoder().setLanguage('es').reverseGeocode(latitude, longitude);
    if (response && response.status === 'OK' && response.results && response.results.length) {
      address = response.results[0].formatted_address || address;
    }
  } catch (error) {
    console.log('No fue posible convertir coordenadas en dirección: ' + error.message);
  }
  cache.put(key, address, 21600);
  return address;
}
