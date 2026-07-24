/**
 * Asignación de rutas, mensajería dirigida y presencia de dispositivos.
 * Google Apps Script no mantiene conexiones WebSocket; la interfaz consulta
 * estos servicios en intervalos breves y registra latidos de presencia.
 */
function asignarRuta_(request, session) {
  exigirPermiso_(session.user, 'RUTAS', 'CREAR');
  const data = request.datos || request;
  validarRequeridos_(data, ['CONDUCTOR_ID','ORIGEN','DESTINO']);
  const driver = obtenerRegistro_('CONDUCTORES', data.CONDUCTOR_ID);
  if (!driver || driver.ESTADO === 'Inactivo') throw new Error('CONDUCTOR_NO_DISPONIBLE');
  const vehicle = data.VEHICULO_ID ? obtenerRegistro_('VEHICULOS', data.VEHICULO_ID) : null;
  if (data.VEHICULO_ID && !vehicle) throw new Error('VEHICULO_NO_ENCONTRADO');
  const provider = ['Google Maps','Waze'].indexOf(data.PROVEEDOR_NAVEGACION) >= 0
    ? data.PROVEEDOR_NAVEGACION : 'Google Maps';
  const company = obtenerEmpresaPrincipal_() || {};
  const baseLatitudeText = String(company.PUNTO_OPERACION_LATITUD == null ? '' : company.PUNTO_OPERACION_LATITUD).trim();
  const baseLongitudeText = String(company.PUNTO_OPERACION_LONGITUD == null ? '' : company.PUNTO_OPERACION_LONGITUD).trim();
  const baseLatitude = Number(baseLatitudeText);
  const baseLongitude = Number(baseLongitudeText);
  const hasOperationalBase = Boolean(baseLatitudeText && baseLongitudeText)
    && isFinite(baseLatitude) && isFinite(baseLongitude)
    && baseLatitude >= -90 && baseLatitude <= 90 && baseLongitude >= -180 && baseLongitude <= 180;
  const plannedOrigin = String(data.ORIGEN || (hasOperationalBase ? (company.PUNTO_OPERACION_DIRECCION || company.DIRECCION || 'Base operacional') : '')).trim();
  if (!plannedOrigin) throw new Error('CAMPO_REQUERIDO_ORIGEN');

  const route = insertarRegistro_('RUTAS', {
    NOMBRE: data.NOMBRE || ('Ruta a ' + data.DESTINO),
    CONDUCTOR_ID: driver.ID,
    VEHICULO_ID: vehicle ? vehicle.ID : '',
    OPERACION_ID: data.OPERACION_ID || '',
    ORIGEN: plannedOrigin,
    ORIGEN_LATITUD: data.ORIGEN_LATITUD || (hasOperationalBase ? baseLatitude : ''),
    ORIGEN_LONGITUD: data.ORIGEN_LONGITUD || (hasOperationalBase ? baseLongitude : ''),
    DESTINO: data.DESTINO,
    DESTINO_LATITUD: data.DESTINO_LATITUD || '',
    DESTINO_LONGITUD: data.DESTINO_LONGITUD || '',
    PARADAS_CODIFICADAS: data.PARADAS_CODIFICADAS || '',
    PROVEEDOR_NAVEGACION: provider,
    ESTADO: 'Asignada',
    INSTRUCCIONES: data.INSTRUCCIONES || '',
    FECHA_ASIGNACION: new Date(),
    CREADO_POR: session.user.ID,
    ELIMINADO: 'NO',
  }, 'RUT');

  const notification = crearNotificacionInterna_({
    DESTINATARIO_USUARIO_ID: driver.USUARIO_ID || '',
    DESTINATARIO_CONDUCTOR_ID: driver.ID,
    TITULO: 'Nueva ruta asignada',
    MENSAJE: route.NOMBRE + ': ' + route.ORIGEN + ' → ' + route.DESTINO,
    TIPO: 'Ruta',
    PRIORIDAD: data.PRIORIDAD || 'Alta',
    RUTA_ID: route.ID,
    OPERACION_ID: route.OPERACION_ID || '',
    CREADO_POR: session.user.ID,
  });
  registrarBitacora_(session.user, 'ASIGNAR', 'RUTAS', route.ID, 'Ruta asignada a ' + driver.NOMBRE);
  return ok_({ row: limpiarSalidaRecurso_('RUTAS', route), notification: limpiarSalidaRecurso_('NOTIFICACIONES', notification) });
}

function actualizarEstadoRuta_(request, session) {
  exigirPermiso_(session.user, 'RUTAS', 'ACTUALIZAR');
  const routeId = request.identificador || request.RUTA_ID;
  const route = obtenerRegistro_('RUTAS', routeId);
  if (!route) throw new Error('RUTA_NO_ENCONTRADA');
  if (!filtrarPorUsuario_('RUTAS', [route], session.user).length) throw new Error('PERMISO_DENEGADO');
  const state = String(request.ESTADO || (request.datos || {}).ESTADO || '');
  if (['Asignada','En curso','Completada','Cancelada'].indexOf(state) < 0) throw new Error('ESTADO_RUTA_INVALIDO');
  if (session.user.ROL_ID === 'ROL-CONDUCTOR' && ['En curso','Completada'].indexOf(state) < 0) throw new Error('PERMISO_DENEGADO');
  const changes = { ESTADO: state };
  if (state === 'En curso' && !route.FECHA_INICIO) changes.FECHA_INICIO = new Date();
  if (state === 'Completada' || state === 'Cancelada') changes.FECHA_FIN = new Date();
  const updated = actualizarRegistro_('RUTAS', route.ID, changes);
  registrarBitacora_(session.user, 'CAMBIAR_ESTADO', 'RUTAS', route.ID, 'Estado: ' + state);
  return ok_({ row: limpiarSalidaRecurso_('RUTAS', updated) });
}

function enviarNotificacion_(request, session) {
  exigirPermiso_(session.user, 'NOTIFICACIONES', 'CREAR');
  const data = request.datos || request;
  validarRequeridos_(data, ['TITULO','MENSAJE']);
  let userId = data.DESTINATARIO_USUARIO_ID || '';
  let driverId = data.DESTINATARIO_CONDUCTOR_ID || '';
  if (driverId) {
    const driver = obtenerRegistro_('CONDUCTORES', driverId);
    if (!driver) throw new Error('CONDUCTOR_NO_ENCONTRADO');
    userId = userId || driver.USUARIO_ID || '';
  }
  if (!userId && !driverId) throw new Error('DESTINATARIO_REQUERIDO');
  const notification = crearNotificacionInterna_(Object.assign({}, data, {
    DESTINATARIO_USUARIO_ID: userId,
    DESTINATARIO_CONDUCTOR_ID: driverId,
    CREADO_POR: session.user.ID,
  }));
  registrarBitacora_(session.user, 'ENVIAR', 'NOTIFICACIONES', notification.ID, notification.TITULO);
  return ok_({ row: limpiarSalidaRecurso_('NOTIFICACIONES', notification) });
}

function crearNotificacionInterna_(data) {
  return insertarRegistro_('NOTIFICACIONES', {
    DESTINATARIO_USUARIO_ID: data.DESTINATARIO_USUARIO_ID || '',
    DESTINATARIO_CONDUCTOR_ID: data.DESTINATARIO_CONDUCTOR_ID || '',
    TITULO: data.TITULO,
    MENSAJE: data.MENSAJE,
    TIPO: data.TIPO || 'Información',
    PRIORIDAD: data.PRIORIDAD || 'Normal',
    RUTA_ID: data.RUTA_ID || '',
    OPERACION_ID: data.OPERACION_ID || '',
    LEIDA: 'NO',
    FECHA_ENVIO: new Date(),
    CREADO_POR: data.CREADO_POR || '',
    ELIMINADO: 'NO',
  }, 'NOT');
}

function marcarNotificacionLeida_(request, session) {
  exigirPermiso_(session.user, 'NOTIFICACIONES', 'ACTUALIZAR');
  const notificationId = request.identificador || request.NOTIFICACION_ID;
  const notification = obtenerRegistro_('NOTIFICACIONES', notificationId);
  if (!notification) throw new Error('NOTIFICACION_NO_ENCONTRADA');
  if (!filtrarPorUsuario_('NOTIFICACIONES', [notification], session.user).length) throw new Error('PERMISO_DENEGADO');
  const updated = actualizarRegistro_('NOTIFICACIONES', notification.ID, {
    LEIDA: 'SI',
    FECHA_LECTURA: new Date(),
  });
  return ok_({ row: limpiarSalidaRecurso_('NOTIFICACIONES', updated) });
}

function actualizarConexion_(request, session) {
  const data = request.datos || request;
  validarRequeridos_(data, ['DISPOSITIVO_ID']);
  const deviceId = String(data.DISPOSITIVO_ID).slice(0, 120);
  const clientSessionId = String(data.SESION_CLIENTE_ID || '').slice(0, 120);
  const driver = obtenerConductorDeUsuario_(session.user.ID);
  const operation = driver ? listarRegistros_('OPERACIONES', {}).find(function(row) {
    return row.CONDUCTOR_ID === driver.ID && row.ESTADO === 'Activa';
  }) : null;
  const route = driver ? listarRegistros_('RUTAS', {}).find(function(row) {
    return row.CONDUCTOR_ID === driver.ID && row.ESTADO === 'En curso';
  }) || listarRegistros_('RUTAS', {}).find(function(row) {
    return row.CONDUCTOR_ID === driver.ID && row.ESTADO === 'Asignada';
  }) : null;
  const gpsActive = data.GPS_ACTIVO === 'SI';
  const drivingAssignment = Boolean(operation || (route && route.ESTADO === 'En curso'));
  const activity = !driver
    ? 'Sesión administrativa'
    : drivingAssignment && gpsActive
      ? 'Conduciendo'
      : drivingAssignment
        ? 'Operación activa sin GPS'
        : 'Conectado';
  const vehicleId = operation ? operation.VEHICULO_ID : route ? route.VEHICULO_ID : '';
  const existing = listarRegistros_('CONEXIONES', {}).find(function(row) {
    return row.USUARIO_ID === session.user.ID
      && row.DISPOSITIVO_ID === deviceId
      && row.SESION_ID === session.session.ID
      && String(row.SESION_CLIENTE_ID || '') === clientSessionId;
  });
  exigirPermiso_(session.user, 'CONEXIONES', existing ? 'ACTUALIZAR' : 'CREAR');
  const values = {
    USUARIO_ID: session.user.ID,
    CONDUCTOR_ID: driver ? driver.ID : '',
    DISPOSITIVO_ID: deviceId,
    SESION_ID: session.session.ID,
    SESION_CLIENTE_ID: clientSessionId,
    SECCION_ACTUAL: String(data.SECCION_ACTUAL || 'dashboard').slice(0, 80),
    ACTIVIDAD: activity,
    VEHICULO_ID: vehicleId || '',
    OPERACION_ID: operation ? operation.ID : '',
    RUTA_ID: route ? route.ID : '',
    GPS_ACTIVO: gpsActive ? 'SI' : 'NO',
    PAGINA_VISIBLE: data.PAGINA_VISIBLE === 'NO' ? 'NO' : 'SI',
    ESTADO: data.ESTADO || 'En línea',
    ULTIMA_CONEXION: new Date(),
    PLATAFORMA: String(data.PLATAFORMA || '').slice(0, 120),
    NAVEGADOR: String(data.NAVEGADOR || request.agenteNavegador || '').slice(0, 300),
    TIPO_RED: String(data.TIPO_RED || '').slice(0, 80),
    BATERIA_PORCENTAJE: data.BATERIA_PORCENTAJE === '' ? '' : Number(data.BATERIA_PORCENTAJE || 0),
    ELIMINADO: 'NO',
  };
  const row = existing
    ? actualizarRegistro_('CONEXIONES', existing.ID, values)
    : insertarRegistro_('CONEXIONES', values, 'CNX');
  invalidarCacheTiempoReal_('CONEXIONES');
  guardarAsignacionGpsCache_(session.user.ID, {
    CONDUCTOR_ID: driver ? driver.ID : '',
    OPERACION_ID: operation ? operation.ID : '',
    VEHICULO_ID: vehicleId || '',
    RUTA_ID: route ? route.ID : ''
  });
  return ok_({ row: limpiarSalidaRecurso_('CONEXIONES', row), serverTime: fechaIso_() });
}

function resumenTiempoReal_(request, session) {
  exigirPermiso_(session.user, 'PANEL_PRINCIPAL', 'LEER');
  const onlyGps = String(request.soloGps || request.SOLO_GPS || '') === 'SI';
  const vehicleFilter = filtroVehiculosTiempoReal_(request, session.user);
  const locations = tienePermiso_(session.user, 'GPS', 'LEER')
    ? ultimasUbicaciones_(request, session).data : { rows:[], total:0, trackingVehicles:[] };
  let connections = tienePermiso_(session.user, 'CONEXIONES', 'LEER')
    ? filtrarPorUsuario_('CONEXIONES', listarRegistrosCacheadosTiempoReal_('CONEXIONES', 3), session.user) : [];
  connections.sort(function(a, b) {
    return new Date(b.ULTIMA_CONEXION).getTime() - new Date(a.ULTIMA_CONEXION).getTime();
  });
  const latest = {};
  connections.forEach(function(row) {
    const key = (row.SESION_ID || row.USUARIO_ID) + ':' + (row.SESION_CLIENTE_ID || row.DISPOSITIVO_ID);
    if (!latest[key]) latest[key] = row;
  });
  const users = listarRegistrosCacheadosTiempoReal_('USUARIOS');
  const drivers = listarRegistrosCacheadosTiempoReal_('CONDUCTORES');
  const vehicles = listarRegistrosCacheadosTiempoReal_('VEHICULOS');
  const operations = onlyGps ? [] : listarRegistros_('OPERACIONES', {});
  const allRoutes = onlyGps ? [] : listarRegistros_('RUTAS', {});
  const limit = Date.now() - CONFIGURACION_APLICACION.SEGUNDOS_CONEXION_ACTIVA * 1000;
  let devices = Object.keys(latest).map(function(key) {
    const row = latest[key];
    const user = users.find(function(item) { return item.ID === row.USUARIO_ID; });
    const driver = drivers.find(function(item) { return item.ID === row.CONDUCTOR_ID; });
    const operation = !onlyGps && driver ? operations.find(function(item) {
      return item.CONDUCTOR_ID === driver.ID && item.ESTADO === 'Activa';
    }) : null;
    const route = !onlyGps && driver ? allRoutes.find(function(item) {
      return item.CONDUCTOR_ID === driver.ID && item.ESTADO === 'En curso';
    }) || allRoutes.find(function(item) {
      return item.CONDUCTOR_ID === driver.ID && item.ESTADO === 'Asignada';
    }) : null;
    const vehicleId = onlyGps ? row.VEHICULO_ID : operation ? operation.VEHICULO_ID : route ? route.VEHICULO_ID : row.VEHICULO_ID;
    const vehicle = vehicles.find(function(item) { return item.ID === vehicleId; });
    const online = new Date(row.ULTIMA_CONEXION).getTime() >= limit && row.ESTADO !== 'Desconectado';
    const drivingAssignment = onlyGps
      ? Boolean(row.OPERACION_ID || row.RUTA_ID)
      : Boolean(operation || (route && route.ESTADO === 'En curso'));
    const activity = !online
      ? 'Inactivo'
      : onlyGps && row.ACTIVIDAD
        ? row.ACTIVIDAD
        : !driver
          ? 'Sesión administrativa'
          : drivingAssignment && row.GPS_ACTIVO === 'SI'
            ? 'Conduciendo'
            : drivingAssignment
              ? 'Operación activa sin GPS'
              : 'Conectado';
    return Object.assign({}, row, {
      USUARIO_NOMBRE: user ? user.NOMBRE : '',
      CONDUCTOR_NOMBRE: driver ? driver.NOMBRE : '',
      VEHICULO_ID: vehicleId || '',
      VEHICULO_PATENTE: vehicle ? vehicle.PATENTE : '',
      OPERACION_ID: operation ? operation.ID : '',
      RUTA_ID: route ? route.ID : '',
      ACTIVIDAD: activity,
      EN_LINEA: online,
    });
  });
  if (vehicleFilter.activo) devices = devices.filter(function(row) { return Boolean(vehicleFilter.ids[row.VEHICULO_ID]); });
  devices.sort(function(a, b) {
    if (a.EN_LINEA !== b.EN_LINEA) return a.EN_LINEA ? -1 : 1;
    return new Date(b.ULTIMA_CONEXION).getTime() - new Date(a.ULTIMA_CONEXION).getTime();
  });

  let routes = [];
  let notifications = [];
  if (!onlyGps) {
    routes = (tienePermiso_(session.user, 'RUTAS', 'LEER')
      ? filtrarPorUsuario_('RUTAS', allRoutes, session.user) : [])
      .filter(function(row) { return row.ESTADO === 'Asignada' || row.ESTADO === 'En curso'; });
    notifications = (tienePermiso_(session.user, 'NOTIFICACIONES', 'LEER')
      ? filtrarPorUsuario_('NOTIFICACIONES', listarRegistros_('NOTIFICACIONES', {}), session.user) : [])
      .filter(function(row) { return row.LEIDA !== 'SI'; });
  }
  return ok_({
    locations: locations.rows || [],
    trackingVehicles: locations.trackingVehicles || [],
    devices: devices.slice(0, 100),
    routes: routes,
    notifications: notifications.slice(-50).reverse(),
    totals: {
      locations: locations.total || 0,
      onlineDevices: devices.filter(function(row) { return row.EN_LINEA; }).length,
      drivingSessions: devices.filter(function(row) { return row.EN_LINEA && row.ACTIVIDAD === 'Conduciendo'; }).length,
      sessionsWithoutGps: devices.filter(function(row) { return row.EN_LINEA && row.ACTIVIDAD === 'Operación activa sin GPS'; }).length,
      activeRoutes: routes.length,
      unreadNotifications: notifications.length,
    },
    serverTime: fechaIso_(),
  });
}
