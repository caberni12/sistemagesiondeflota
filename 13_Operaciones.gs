/** Inicio y finalización de operaciones con validación geográfica. */
function numeroUbicacionOperacion_(value, field) {
  const number = Number(value);
  if (!isFinite(number)) throw new Error('UBICACION_OPERACION_REQUERIDA');
  if ((field === 'LATITUD' && (number < -90 || number > 90)) || (field === 'LONGITUD' && (number < -180 || number > 180))) {
    throw new Error('COORDENADAS_INVALIDAS');
  }
  return number;
}

function kilometrajeOperacionOpcional_(value) {
  const text = String(value == null ? '' : value).trim().replace(',', '.');
  if (!text) return '';
  const number = Number(text);
  if (!isFinite(number) || number < 0) return '';
  return Math.round(number * 10) / 10;
}

function fechaOperacionOpcional_(value, fallback) {
  const text = String(value == null ? '' : value).trim();
  if (!text) return fallback || '';
  const date = new Date(text);
  if (isNaN(date.getTime())) throw new Error('FECHA_OPERACION_INVALIDA');
  return date;
}

function resumenOperacionAuditoria_(operation) {
  const fields = ['ID','VEHICULO_ID','CONDUCTOR_ID','RUTA_ID','ORIGEN','DESTINO','FECHA_INICIO','FECHA_FIN','ESTADO','KM_INICIO','KM_FIN','DISTANCIA_KM','OBSERVACIONES'];
  const output = {};
  fields.forEach(function(field) { output[field] = operation && operation[field] != null ? operation[field] : ''; });
  return output;
}

function exigirAdministradorOperacion_(session) {
  if (!session || !session.user || String(session.user.ROL_ID || '') !== 'ROL-ADMIN') throw new Error('SOLO_ADMINISTRADOR');
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

function evaluarUbicacionRespectoPunto_(data, point, phase) {
  const prefix = phase === 'FIN' ? 'FIN_' : 'INICIO_';
  const latitude = numeroUbicacionOperacion_(data[prefix + 'LATITUD'] || data.LATITUD, 'LATITUD');
  const longitude = numeroUbicacionOperacion_(data[prefix + 'LONGITUD'] || data.LONGITUD, 'LONGITUD');
  const accuracy = Number(data[prefix + 'PRECISION'] || data.PRECISION || 0);
  if (!isFinite(accuracy) || accuracy <= 0) throw new Error('PRECISION_GPS_REQUERIDA');
  const precisionValid = accuracy <= point.PRECISION_GPS_MAXIMA_METROS;
  if (phase !== 'FIN' && !precisionValid) throw new Error('UBICACION_GPS_IMPRECISA');
  const distance = distanciaGeograficaMetros_(latitude, longitude, point.LATITUD, point.LONGITUD);
  const allowedRadius = phase === 'FIN' ? point.RADIO_FIN_METROS : point.RADIO_INICIO_METROS;
  const tolerance = phase === 'FIN' && !precisionValid
    ? Math.min(accuracy, Number(CONFIGURACION_APLICACION.TOLERANCIA_GPS_IMPRECISA_FIN_METROS || 500)) : 0;
  const inside = distance <= allowedRadius + tolerance;
  return {
    LATITUD: latitude,
    LONGITUD: longitude,
    PRECISION: Math.round(accuracy * 10) / 10,
    PRECISION_VALIDA: precisionValid,
    PRECISION_BAJA: inside && !precisionValid,
    TOLERANCIA_PRECISION_METROS: Math.round(tolerance * 10) / 10,
    DISTANCIA_METROS: Math.round(distance * 10) / 10,
    RADIO_PERMITIDO: allowedRadius,
    DENTRO_PERIMETRO: inside,
    ESTADO: inside ? (precisionValid ? 'VALIDADA' : 'VALIDADA_PRECISION_BAJA') : 'FUERA_PERIMETRO'
  };
}

function validarUbicacionEnPuntoOperacion_(data, point, phase) {
  const result = evaluarUbicacionRespectoPunto_(data, point, phase);
  if (!result.DENTRO_PERIMETRO) throw new Error(phase === 'FIN' ? 'FUERA_DEL_PUNTO_DE_FINALIZACION' : 'FUERA_DEL_PUNTO_DE_INICIO');
  return result;
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
    KM_INICIO: kilometrajeOperacionOpcional_(data.KM_INICIO) === '' ? kilometrajeOperacionOpcional_(vehicle.KILOMETRAJE) : kilometrajeOperacionOpcional_(data.KM_INICIO),
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
  const role = String(session.user.ROL_ID || '');
  if (['ROL-ADMIN','ROL-SUPERVISOR','ROL-CONDUCTOR'].indexOf(role) < 0) throw new Error('PERMISO_DENEGADO');
  const data = request.datos || request || {};
  const operation = obtenerRegistro_('OPERACIONES', request.identificador || request.OPERACION_ID);
  if (!operation || operation.ESTADO !== 'Activa') throw new Error('OPERACION_NO_ACTIVA');
  if (!filtrarPorUsuario_('OPERACIONES', [operation], session.user).length) throw new Error('PERMISO_DENEGADO');
  if (role === 'ROL-CONDUCTOR') {
    const ownDriver = obtenerConductorDeUsuario_(session.user.ID);
    if (!ownDriver || String(operation.CONDUCTOR_ID) !== String(ownDriver.ID)) throw new Error('PERMISO_DENEGADO');
  }

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

  let finishLocation = null;
  let exceptional = false;
  const reason = String(data.CIERRE_MOTIVO || data.MOTIVO_CIERRE_EXCEPCIONAL || '').trim();
  try {
    finishLocation = validarUbicacionEnPuntoOperacion_(data, point, 'FIN');
  } catch (error) {
    const code = String(error && error.message ? error.message : error);
    if (code !== 'FUERA_DEL_PUNTO_DE_FINALIZACION') throw error;
    if (role === 'ROL-CONDUCTOR') throw error;
    if (['ROL-ADMIN','ROL-SUPERVISOR'].indexOf(role) < 0) throw new Error('CIERRE_EXCEPCIONAL_NO_AUTORIZADO');
    if (String(data.CIERRE_EXCEPCIONAL || '') !== 'SI') throw new Error('CIERRE_EXCEPCIONAL_CONFIRMACION_REQUERIDA');
    if (reason.length < 10) throw new Error('CIERRE_EXCEPCIONAL_MOTIVO_REQUERIDO');
    finishLocation = evaluarUbicacionRespectoPunto_(data, point, 'FIN');
    exceptional = true;
  }

  const kmStart = kilometrajeOperacionOpcional_(operation.KM_INICIO);
  const kmEnd = kilometrajeOperacionOpcional_(data.KM_FIN);
  const kmConsistente = kmStart !== '' && kmEnd !== '' && kmEnd >= kmStart;
  const kilometrajeAdvertencia = kmEnd === '' ? 'Kilometraje final no informado.' : (kmStart !== '' && kmEnd < kmStart ? 'Kilometraje final menor que el inicial; cierre permitido y dato marcado para revisión.' : '');
  const ipCliente = normalizarIpPublica_(data.IP_PUBLICA || session.session.IP_PUBLICA || '');
  const now = new Date();
  const updated = actualizarRegistro_('OPERACIONES', operation.ID, {
    FECHA_FIN: now,
    ESTADO: 'Finalizada',
    KM_FIN: kmEnd,
    DISTANCIA_KM: kmConsistente ? Math.round((kmEnd - kmStart) * 10) / 10 : '',
    OBSERVACIONES: data.OBSERVACIONES || operation.OBSERVACIONES || '',
    FIN_LATITUD: finishLocation.LATITUD,
    FIN_LONGITUD: finishLocation.LONGITUD,
    FIN_PRECISION: finishLocation.PRECISION,
    DISTANCIA_FIN_BASE_METROS: finishLocation.DISTANCIA_METROS,
    VALIDACION_FIN: exceptional ? 'EXCEPCIONAL_AUTORIZADA' : (finishLocation.PRECISION_BAJA ? 'VALIDADA_PRECISION_BAJA' : 'VALIDADA'),
    CIERRE_TIPO: exceptional ? 'Excepcional fuera de base' : (finishLocation.PRECISION_BAJA ? 'Normal en base con GPS impreciso' : 'Normal en base'),
    CIERRE_FUERA_BASE: exceptional ? 'SI' : 'NO',
    CIERRE_MOTIVO: exceptional ? reason : '',
    CIERRE_AUTORIZADO_POR: session.user.ID,
    CIERRE_AUTORIZADO_ROL: role,
    CIERRE_IP_PUBLICA: ipCliente,
    CIERRE_FECHA_AUTORIZACION: now
  });
  const vehicleClose = obtenerRegistro_('VEHICULOS', operation.VEHICULO_ID);
  const vehicleCloseData = { ESTADO:'Disponible' };
  if (kmEnd !== '' && (!vehicleClose || kilometrajeOperacionOpcional_(vehicleClose.KILOMETRAJE) === '' || kmEnd >= Number(vehicleClose.KILOMETRAJE || 0))) vehicleCloseData.KILOMETRAJE = kmEnd;
  actualizarRegistro_('VEHICULOS', operation.VEHICULO_ID, vehicleCloseData);
  actualizarRegistro_('CONDUCTORES', operation.CONDUCTOR_ID, { ESTADO:'Disponible' });
  if (operation.RUTA_ID) {
    const route = obtenerRegistro_('RUTAS', operation.RUTA_ID);
    if (route && ['Asignada','En curso'].indexOf(route.ESTADO) >= 0) {
      actualizarRegistro_('RUTAS', route.ID, { ESTADO:'Completada', FECHA_FIN:now, OPERACION_ID:operation.ID });
    }
  }
  const historyDetail = exceptional
    ? 'Cierre excepcional autorizado fuera de base a ' + finishLocation.DISTANCIA_METROS + ' m. Motivo: ' + reason
    : (finishLocation.PRECISION_BAJA
      ? 'Operación finalizada en base con señal GPS imprecisa. Distancia calculada: ' + finishLocation.DISTANCIA_METROS + ' m; precisión ±' + finishLocation.PRECISION + ' m; tolerancia aplicada ' + finishLocation.TOLERANCIA_PRECISION_METROS + ' m.'
      : 'Operación finalizada en punto autorizado a ' + finishLocation.DISTANCIA_METROS + ' m de la base') + (kilometrajeAdvertencia ? ' ' + kilometrajeAdvertencia : '');
  insertarRegistro_('HISTORIAL', {
    OPERACION_ID: operation.ID,
    EVENTO: exceptional ? 'FIN_EXCEPCIONAL' : (finishLocation.PRECISION_BAJA ? 'FIN_GPS_IMPRECISO' : 'FIN'),
    DETALLE: historyDetail,
    FECHA_HORA:now,
    USUARIO_ID:session.user.ID,
    ELIMINADO:'NO'
  }, 'HIS');
  registrarBitacora_(session.user, exceptional ? 'FINALIZAR_EXCEPCIONAL' : (finishLocation.PRECISION_BAJA ? 'FINALIZAR_GPS_IMPRECISO' : 'FINALIZAR'), 'OPERACIONES', operation.ID, historyDetail, ipCliente);
  if (exceptional) {
    try {
      insertarRegistro_('ALERTAS', {
        TIPO:'Cierre excepcional', NIVEL:'Advertencia', TITULO:'Operación finalizada fuera de la base',
        MENSAJE:operation.ID + ' fue cerrada por ' + session.user.NOMBRE + ' a ' + finishLocation.DISTANCIA_METROS + ' m de la base. Motivo: ' + reason,
        MODULO:'OPERACIONES', REGISTRO_ID:operation.ID, LEIDA:'NO', USUARIO_ID:'', FECHA_HORA:now, ELIMINADO:'NO'
      }, 'ALT');
    } catch (alertError) { console.error(alertError); }
  }
  if (!exceptional && finishLocation.PRECISION_BAJA) {
    try {
      insertarRegistro_('ALERTAS', {
        TIPO:'GPS impreciso', NIVEL:'Advertencia', TITULO:'Cierre aceptado con baja precisión GPS',
        MENSAJE:operation.ID + ' finalizó dentro de la tolerancia de base con precisión ±' + finishLocation.PRECISION + ' m. Distancia calculada: ' + finishLocation.DISTANCIA_METROS + ' m.',
        MODULO:'OPERACIONES', REGISTRO_ID:operation.ID, LEIDA:'NO', USUARIO_ID:'', FECHA_HORA:now, ELIMINADO:'NO'
      }, 'ALT');
    } catch (precisionAlertError) { console.error(precisionAlertError); }
  }
  return ok_({
    row: limpiarSalidaRecurso_('OPERACIONES', updated),
    locationValidation:finishLocation,
    base:point,
    cierreExcepcional:exceptional,
    autorizadoPor:{ ID:session.user.ID, NOMBRE:session.user.NOMBRE, ROL_ID:role }
  });
}

function editarOperacionAdministrativa_(request, session) {
  exigirAdministradorOperacion_(session);
  const data = request.datos || request || {};
  const operationId = request.identificador || request.OPERACION_ID || request.id;
  const operation = obtenerRegistro_('OPERACIONES', operationId);
  if (!operation) throw new Error('REGISTRO_NO_ENCONTRADO');
  const before = resumenOperacionAuditoria_(operation);
  const reason = String(data.MOTIVO_EDICION || '').trim();
  if (reason.length < 5) throw new Error('MOTIVO_EDICION_REQUERIDO');

  const newVehicleId = String(data.VEHICULO_ID || operation.VEHICULO_ID || '').trim();
  const newDriverId = String(data.CONDUCTOR_ID || operation.CONDUCTOR_ID || '').trim();
  const newRouteId = String(data.RUTA_ID == null ? operation.RUTA_ID || '' : data.RUTA_ID).trim();
  const vehicleChanged = newVehicleId !== String(operation.VEHICULO_ID || '');
  const driverChanged = newDriverId !== String(operation.CONDUCTOR_ID || '');
  const routeChanged = newRouteId !== String(operation.RUTA_ID || '');
  const active = String(operation.ESTADO || '') === 'Activa';

  const newVehicle = obtenerRegistro_('VEHICULOS', newVehicleId);
  const newDriver = obtenerRegistro_('CONDUCTORES', newDriverId);
  if (!newVehicle) throw new Error('VEHICULO_NO_ENCONTRADO');
  if (!newDriver) throw new Error('CONDUCTOR_NO_ENCONTRADO');
  if (active && vehicleChanged && String(newVehicle.ESTADO || '') !== 'Disponible') throw new Error('VEHICULO_NO_DISPONIBLE');
  if (active && driverChanged && String(newDriver.ESTADO || '') !== 'Disponible') throw new Error('CONDUCTOR_NO_DISPONIBLE');

  let newRoute = null;
  if (newRouteId) {
    newRoute = obtenerRegistro_('RUTAS', newRouteId);
    if (!newRoute) throw new Error('RUTA_NO_ENCONTRADA');
    if (newRoute.OPERACION_ID && String(newRoute.OPERACION_ID) !== String(operation.ID)) {
      const linked = obtenerRegistro_('OPERACIONES', newRoute.OPERACION_ID);
      if (linked && linked.ESTADO === 'Activa') throw new Error('RUTA_YA_VINCULADA');
    }
    if (newRoute.VEHICULO_ID && String(newRoute.VEHICULO_ID) !== newVehicleId) throw new Error('RUTA_NO_COINCIDE_VEHICULO');
    if (newRoute.CONDUCTOR_ID && String(newRoute.CONDUCTOR_ID) !== newDriverId) throw new Error('RUTA_NO_COINCIDE_CONDUCTOR');
  }

  const kmStart = kilometrajeOperacionOpcional_(data.KM_INICIO);
  const kmEnd = kilometrajeOperacionOpcional_(data.KM_FIN);
  const distance = kmStart !== '' && kmEnd !== '' && kmEnd >= kmStart ? Math.round((kmEnd - kmStart) * 10) / 10 : '';
  const changes = {
    VEHICULO_ID: newVehicleId,
    CONDUCTOR_ID: newDriverId,
    RUTA_ID: newRouteId,
    ORIGEN: String(data.ORIGEN == null ? operation.ORIGEN || '' : data.ORIGEN).trim(),
    DESTINO: String(data.DESTINO == null ? operation.DESTINO || '' : data.DESTINO).trim(),
    FECHA_INICIO: fechaOperacionOpcional_(data.FECHA_INICIO, operation.FECHA_INICIO),
    FECHA_FIN: fechaOperacionOpcional_(data.FECHA_FIN, operation.FECHA_FIN),
    KM_INICIO: kmStart,
    KM_FIN: kmEnd,
    DISTANCIA_KM: distance,
    OBSERVACIONES: String(data.OBSERVACIONES == null ? operation.OBSERVACIONES || '' : data.OBSERVACIONES).slice(0, 3000)
  };

  if (active && vehicleChanged) {
    actualizarRegistro_('VEHICULOS', operation.VEHICULO_ID, { ESTADO:'Disponible' });
    actualizarRegistro_('VEHICULOS', newVehicleId, { ESTADO:'En ruta' });
  }
  if (active && driverChanged) {
    actualizarRegistro_('CONDUCTORES', operation.CONDUCTOR_ID, { ESTADO:'Disponible' });
    actualizarRegistro_('CONDUCTORES', newDriverId, { ESTADO:'En viaje' });
  }
  if (routeChanged && operation.RUTA_ID) {
    const oldRoute = obtenerRegistro_('RUTAS', operation.RUTA_ID);
    if (oldRoute && String(oldRoute.OPERACION_ID || '') === String(operation.ID)) {
      actualizarRegistro_('RUTAS', oldRoute.ID, active ? { OPERACION_ID:'', ESTADO:'Asignada', FECHA_INICIO:'' } : { OPERACION_ID:'' });
    }
  }
  if (newRoute) {
    actualizarRegistro_('RUTAS', newRoute.ID, {
      OPERACION_ID: operation.ID,
      VEHICULO_ID: newVehicleId,
      CONDUCTOR_ID: newDriverId,
      ESTADO: active ? 'En curso' : (newRoute.ESTADO || 'Completada')
    });
  }

  const updated = actualizarRegistro_('OPERACIONES', operation.ID, changes);
  const after = resumenOperacionAuditoria_(updated);
  const ipCliente = normalizarIpPublica_(data.IP_PUBLICA || session.session.IP_PUBLICA || '');
  const detail = 'Edición administrativa. Motivo: ' + reason + '. Antes: ' + JSON.stringify(before) + '. Después: ' + JSON.stringify(after);
  insertarRegistro_('HISTORIAL', {
    OPERACION_ID:operation.ID, EVENTO:'EDICION_ADMIN', DETALLE:detail, FECHA_HORA:new Date(), USUARIO_ID:session.user.ID, ELIMINADO:'NO'
  }, 'HIS');
  registrarBitacora_(session.user, 'EDITAR_ADMIN', 'OPERACIONES', operation.ID, detail, ipCliente);
  return ok_({ row:limpiarSalidaRecurso_('OPERACIONES', updated), auditoriaRegistrada:true });
}

function eliminarOperacionAdministrativa_(request, session) {
  exigirAdministradorOperacion_(session);
  const data = request.datos || request || {};
  const operationId = request.identificador || request.OPERACION_ID || request.id;
  const operation = obtenerRegistro_('OPERACIONES', operationId);
  if (!operation) throw new Error('REGISTRO_NO_ENCONTRADO');
  const reason = String(data.MOTIVO_ELIMINACION || '').trim() || 'Eliminación administrativa solicitada por el Administrador.';
  const snapshot = resumenOperacionAuditoria_(operation);
  const active = String(operation.ESTADO || '') === 'Activa';
  if (active) {
    if (operation.VEHICULO_ID) actualizarRegistro_('VEHICULOS', operation.VEHICULO_ID, { ESTADO:'Disponible' });
    if (operation.CONDUCTOR_ID) actualizarRegistro_('CONDUCTORES', operation.CONDUCTOR_ID, { ESTADO:'Disponible' });
  }
  if (operation.RUTA_ID) {
    const route = obtenerRegistro_('RUTAS', operation.RUTA_ID);
    if (route && String(route.OPERACION_ID || '') === String(operation.ID)) {
      actualizarRegistro_('RUTAS', route.ID, active ? { OPERACION_ID:'', ESTADO:'Asignada', FECHA_INICIO:'' } : { OPERACION_ID:'' });
    }
  }
  insertarRegistro_('HISTORIAL', {
    OPERACION_ID:operation.ID, EVENTO:'ELIMINACION_ADMIN', DETALLE:'Operación eliminada lógicamente por Administrador. Motivo: ' + reason + '. Datos: ' + JSON.stringify(snapshot), FECHA_HORA:new Date(), USUARIO_ID:session.user.ID, ELIMINADO:'NO'
  }, 'HIS');
  eliminarRegistro_('OPERACIONES', operation.ID);
  const ipCliente = normalizarIpPublica_(data.IP_PUBLICA || session.session.IP_PUBLICA || '');
  registrarBitacora_(session.user, 'ELIMINAR_ADMIN', 'OPERACIONES', operation.ID, 'Eliminación lógica sin aprobación adicional. Motivo: ' + reason + '. Datos: ' + JSON.stringify(snapshot), ipCliente);
  return ok_({ id:operation.ID, eliminacionLogica:true, auditoriaRegistrada:true });
}

