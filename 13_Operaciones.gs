/** Inicio y finalización de operaciones con validación geográfica. */
function numeroUbicacionOperacion_(value, field) {
  const number = Number(value);
  if (!isFinite(number)) throw new Error('UBICACION_OPERACION_REQUERIDA');
  if ((field === 'LATITUD' && (number < -90 || number > 90)) || (field === 'LONGITUD' && (number < -180 || number > 180))) {
    throw new Error('COORDENADAS_INVALIDAS');
  }
  return number;
}

function distanciaGeograficaMetros_(lat1, lng1, lat2, lng2) {
  const radius = 6371000;
  const radians = function(value) { return Number(value) * Math.PI / 180; };
  const dLat = radians(lat2 - lat1);
  const dLng = radians(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2))
    * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function obtenerPuntoOperacionConfigurado_() {
  const company = obtenerEmpresaPrincipal_();
  if (company && String(company.VALIDAR_UBICACION_OPERACION || 'SI') === 'NO') throw new Error('VALIDACION_UBICACION_DESACTIVADA');
  const point = puntoOperacionDesdeEmpresa_(company) || obtenerRespaldoPuntoOperacion_();
  if (!point) throw new Error('PUNTO_OPERACION_NO_CONFIGURADO');
  return point;
}

function validarUbicacionEnPuntoOperacion_(data, point, phase) {
  const prefix = phase === 'FIN' ? 'FIN_' : 'INICIO_';
  const latitude = numeroUbicacionOperacion_(data[prefix + 'LATITUD'] || data.LATITUD, 'LATITUD');
  const longitude = numeroUbicacionOperacion_(data[prefix + 'LONGITUD'] || data.LONGITUD, 'LONGITUD');
  const accuracy = Number(data[prefix + 'PRECISION'] || data.PRECISION || 0);
  if (!isFinite(accuracy) || accuracy <= 0) throw new Error('PRECISION_GPS_REQUERIDA');
  if (accuracy > point.PRECISION_GPS_MAXIMA_METROS) throw new Error('UBICACION_GPS_IMPRECISA');
  const distance = distanciaGeograficaMetros_(latitude, longitude, point.LATITUD, point.LONGITUD);
  const allowedRadius = phase === 'FIN' ? point.RADIO_FIN_METROS : point.RADIO_INICIO_METROS;
  if (distance > allowedRadius) throw new Error(phase === 'FIN' ? 'FUERA_DEL_PUNTO_DE_FINALIZACION' : 'FUERA_DEL_PUNTO_DE_INICIO');
  return {
    LATITUD: latitude,
    LONGITUD: longitude,
    PRECISION: Math.round(accuracy * 10) / 10,
    DISTANCIA_METROS: Math.round(distance * 10) / 10,
    RADIO_PERMITIDO: allowedRadius,
    ESTADO: 'VALIDADA'
  };
}

function obtenerRutaParaOperacion_(data, vehicle, driver, session) {
  const routeId = String(data.RUTA_ID || '').trim();
  if (!routeId) return null;
  const route = obtenerRegistro_('RUTAS', routeId);
  if (!route) throw new Error('RUTA_NO_ENCONTRADA');
  if (!filtrarPorUsuario_('RUTAS', [route], session.user).length) throw new Error('PERMISO_DENEGADO');
  if (['Asignada','En curso'].indexOf(String(route.ESTADO || '')) < 0) throw new Error('RUTA_NO_DISPONIBLE');
  if (String(route.CONDUCTOR_ID || '') !== String(driver.ID)) throw new Error('RUTA_NO_COINCIDE_CONDUCTOR');
  if (route.VEHICULO_ID && String(route.VEHICULO_ID) !== String(vehicle.ID)) throw new Error('RUTA_NO_COINCIDE_VEHICULO');
  if (route.OPERACION_ID) {
    const linked = obtenerRegistro_('OPERACIONES', route.OPERACION_ID);
    if (linked && linked.ESTADO === 'Activa') throw new Error('RUTA_YA_VINCULADA');
  }
  return route;
}

function iniciarOperacion_(request, session) {
  exigirPermiso_(session.user, 'OPERACIONES', 'CREAR');
  const data = request.datos || request;
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const ownDriver = obtenerConductorDeUsuario_(session.user.ID);
    if (!ownDriver) throw new Error('CONDUCTOR_NO_ASOCIADO');
    data.CONDUCTOR_ID = ownDriver.ID;
    const authorization = String(data.AUTORIZACION_QR || '');
    const cacheKey = authorization ? 'qr_aut_' + cifrarFichaSesion_(authorization) : '';
    const saved = cacheKey ? CacheService.getScriptCache().get(cacheKey) : '';
    let authorized = null;
    try { authorized = saved ? JSON.parse(saved) : null; } catch (error) { authorized = null; }
    if (!authorized || authorized.USUARIO_ID !== session.user.ID || authorized.VEHICULO_ID !== data.VEHICULO_ID) {
      throw new Error('AUTORIZACION_QR_INVALIDA');
    }
    CacheService.getScriptCache().remove(cacheKey);
  }
  validarRequeridos_(data, ['VEHICULO_ID','CONDUCTOR_ID']);
  const vehicle = obtenerRegistro_('VEHICULOS', data.VEHICULO_ID);
  const driver = obtenerRegistro_('CONDUCTORES', data.CONDUCTOR_ID);
  if (!vehicle || vehicle.ESTADO !== 'Disponible') throw new Error('VEHICULO_NO_DISPONIBLE');
  if (!driver || driver.ESTADO !== 'Disponible') throw new Error('CONDUCTOR_NO_DISPONIBLE');
  const checkin = validarCheckinParaOperacion_(data.CHECKIN_ID, vehicle.ID, driver.ID);
  const point = obtenerPuntoOperacionConfigurado_();
  const startLocation = validarUbicacionEnPuntoOperacion_(data, point, 'INICIO');
  const route = obtenerRutaParaOperacion_(data, vehicle, driver, session);
  const destination = route ? String(route.DESTINO || point.DIRECCION) : point.DIRECCION;
  const operationType = route ? 'Ruta asignada con retorno a base' : 'Salida y regreso a base';

  const operation = insertarRegistro_('OPERACIONES', {
    VEHICULO_ID: vehicle.ID,
    CONDUCTOR_ID: driver.ID,
    ORIGEN: point.DIRECCION,
    DESTINO: destination,
    FECHA_INICIO: new Date(),
    ESTADO: 'Activa',
    KM_INICIO: Number(data.KM_INICIO || vehicle.KILOMETRAJE || 0),
    OBSERVACIONES: data.OBSERVACIONES || '',
    CREADO_POR: session.user.ID,
    ELIMINADO: 'NO',
    CHECKIN_ID: checkin.ID,
    RUTA_ID: route ? route.ID : '',
    TIPO_OPERACION: operationType,
    PUNTO_RETORNO: point.DIRECCION,
    BASE_NOMBRE: point.NOMBRE,
    BASE_DIRECCION: point.DIRECCION,
    BASE_LATITUD: point.LATITUD,
    BASE_LONGITUD: point.LONGITUD,
    RADIO_INICIO_METROS: point.RADIO_INICIO_METROS,
    RADIO_FIN_METROS: point.RADIO_FIN_METROS,
    PRECISION_GPS_MAXIMA_METROS: point.PRECISION_GPS_MAXIMA_METROS,
    INICIO_LATITUD: startLocation.LATITUD,
    INICIO_LONGITUD: startLocation.LONGITUD,
    INICIO_PRECISION: startLocation.PRECISION,
    DISTANCIA_INICIO_BASE_METROS: startLocation.DISTANCIA_METROS,
    VALIDACION_INICIO: 'VALIDADA'
  }, 'OPE');
  actualizarRegistro_('VEHICULOS', vehicle.ID, { ESTADO:'En ruta' });
  actualizarRegistro_('CONDUCTORES', driver.ID, { ESTADO:'En viaje' });
  consumirCheckinOperacion_(checkin.ID, operation.ID);
  if (route) {
    actualizarRegistro_('RUTAS', route.ID, {
      OPERACION_ID: operation.ID,
      VEHICULO_ID: vehicle.ID,
      ORIGEN: point.DIRECCION,
      ORIGEN_LATITUD: point.LATITUD,
      ORIGEN_LONGITUD: point.LONGITUD,
      ESTADO: 'En curso',
      FECHA_INICIO: route.FECHA_INICIO || new Date()
    });
  }
  insertarRegistro_('HISTORIAL', {
    OPERACION_ID: operation.ID,
    EVENTO:'INICIO',
    DETALLE:'Operación iniciada en punto autorizado a ' + startLocation.DISTANCIA_METROS + ' m de la base',
    FECHA_HORA:new Date(),
    USUARIO_ID:session.user.ID,
    ELIMINADO:'NO'
  }, 'HIS');
  registrarBitacora_(session.user, 'INICIAR', 'OPERACIONES', operation.ID, vehicle.PATENTE + ' / ' + driver.NOMBRE + ' / ubicación validada');
  return ok_({ row: limpiarSalidaRecurso_('OPERACIONES', operation), locationValidation:startLocation, base:point });
}

function finalizarOperacion_(request, session) {
  exigirPermiso_(session.user, 'OPERACIONES', 'ACTUALIZAR');
  const operation = obtenerRegistro_('OPERACIONES', request.identificador || request.OPERACION_ID);
  if (!operation || operation.ESTADO !== 'Activa') throw new Error('OPERACION_NO_ACTIVA');
  if (!filtrarPorUsuario_('OPERACIONES', [operation], session.user).length) throw new Error('PERMISO_DENEGADO');
  const currentPoint = obtenerPuntoOperacionConfigurado_();
  const snapshotLatitudeText = String(operation.BASE_LATITUD == null ? '' : operation.BASE_LATITUD).trim();
  const snapshotLongitudeText = String(operation.BASE_LONGITUD == null ? '' : operation.BASE_LONGITUD).trim();
  const hasSnapshot = Boolean(snapshotLatitudeText && snapshotLongitudeText);
  const point = {
    NOMBRE: hasSnapshot ? (operation.BASE_NOMBRE || currentPoint.NOMBRE) : currentPoint.NOMBRE,
    DIRECCION: hasSnapshot ? (operation.BASE_DIRECCION || operation.PUNTO_RETORNO || operation.ORIGEN || currentPoint.DIRECCION) : currentPoint.DIRECCION,
    LATITUD: hasSnapshot ? Number(snapshotLatitudeText) : currentPoint.LATITUD,
    LONGITUD: hasSnapshot ? Number(snapshotLongitudeText) : currentPoint.LONGITUD,
    RADIO_INICIO_METROS: hasSnapshot ? Number(operation.RADIO_INICIO_METROS || currentPoint.RADIO_INICIO_METROS) : currentPoint.RADIO_INICIO_METROS,
    RADIO_FIN_METROS: hasSnapshot ? Number(operation.RADIO_FIN_METROS || currentPoint.RADIO_FIN_METROS) : currentPoint.RADIO_FIN_METROS,
    PRECISION_GPS_MAXIMA_METROS: hasSnapshot ? Math.max(10, Number(operation.PRECISION_GPS_MAXIMA_METROS || currentPoint.PRECISION_GPS_MAXIMA_METROS)) : currentPoint.PRECISION_GPS_MAXIMA_METROS,
    RETORNO_BASE_OBLIGATORIO: 'SI'
  };
  if (!isFinite(point.LATITUD) || !isFinite(point.LONGITUD)) throw new Error('PUNTO_OPERACION_NO_CONFIGURADO');
  const finishLocation = validarUbicacionEnPuntoOperacion_(request.datos || request, point, 'FIN');
  const kmEnd = Number(request.KM_FIN || (request.datos || {}).KM_FIN || operation.KM_INICIO || 0);
  const kmStart = Number(operation.KM_INICIO || 0);
  const updated = actualizarRegistro_('OPERACIONES', operation.ID, {
    FECHA_FIN: new Date(),
    ESTADO: 'Finalizada',
    KM_FIN: kmEnd,
    DISTANCIA_KM: Math.max(0, kmEnd - kmStart),
    OBSERVACIONES: request.OBSERVACIONES || (request.datos || {}).OBSERVACIONES || operation.OBSERVACIONES || '',
    FIN_LATITUD: finishLocation.LATITUD,
    FIN_LONGITUD: finishLocation.LONGITUD,
    FIN_PRECISION: finishLocation.PRECISION,
    DISTANCIA_FIN_BASE_METROS: finishLocation.DISTANCIA_METROS,
    VALIDACION_FIN: 'VALIDADA'
  });
  actualizarRegistro_('VEHICULOS', operation.VEHICULO_ID, { ESTADO:'Disponible', KILOMETRAJE:kmEnd });
  actualizarRegistro_('CONDUCTORES', operation.CONDUCTOR_ID, { ESTADO:'Disponible' });
  if (operation.RUTA_ID) {
    const route = obtenerRegistro_('RUTAS', operation.RUTA_ID);
    if (route && ['Asignada','En curso'].indexOf(route.ESTADO) >= 0) {
      actualizarRegistro_('RUTAS', route.ID, { ESTADO:'Completada', FECHA_FIN:new Date(), OPERACION_ID:operation.ID });
    }
  }
  insertarRegistro_('HISTORIAL', {
    OPERACION_ID: operation.ID,
    EVENTO:'FIN',
    DETALLE:'Operación finalizada en punto autorizado a ' + finishLocation.DISTANCIA_METROS + ' m de la base',
    FECHA_HORA:new Date(),
    USUARIO_ID:session.user.ID,
    ELIMINADO:'NO'
  }, 'HIS');
  registrarBitacora_(session.user, 'FINALIZAR', 'OPERACIONES', operation.ID, 'Operación finalizada con ubicación validada');
  return ok_({ row: limpiarSalidaRecurso_('OPERACIONES', updated), locationValidation:finishLocation, base:point });
}
