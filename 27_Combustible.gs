/** Módulo de cargas, consumo y gasto de combustible. */
function numeroCombustible_(value, fieldName, allowZero) {
  const numberValue = Number(value);
  if (!isFinite(numberValue) || (allowZero ? numberValue < 0 : numberValue <= 0)) {
    throw new Error('COMBUSTIBLE_' + fieldName + '_INVALIDO');
  }
  return numberValue;
}

function redondearCombustible_(value, decimals) {
  const factor = Math.pow(10, decimals || 2);
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function ipSolicitudCombustible_(request) {
  const data = request.datos || {};
  return normalizarIpPublica_(data.IP_PUBLICA || request.IP_PUBLICA || request.ipPublica || '');
}

function resolverVinculoCombustible_(data, existing, session, isCreate) {
  const isAdmin = session && session.user && session.user.ROL_ID === 'ROL-ADMIN';
  let operationId = String(data.OPERACION_ID !== undefined ? data.OPERACION_ID : (existing && existing.OPERACION_ID) || '').trim();
  let routeId = String(data.RUTA_ID !== undefined ? data.RUTA_ID : (existing && existing.RUTA_ID) || '').trim();
  let vehicleId = String(data.VEHICULO_ID !== undefined ? data.VEHICULO_ID : (existing && existing.VEHICULO_ID) || '').trim();
  let driverId = String(data.CONDUCTOR_ID !== undefined ? data.CONDUCTOR_ID : (existing && existing.CONDUCTOR_ID) || '').trim();
  let operation = null;
  let route = null;

  if (operationId) {
    operation = obtenerRegistro_('OPERACIONES', operationId);
    if (!operation) throw new Error('OPERACION_NO_ENCONTRADA');
    if (!routeId && operation.RUTA_ID) routeId = String(operation.RUTA_ID).trim();
  }

  if (routeId) {
    route = obtenerRegistro_('RUTAS', routeId);
    if (!route) throw new Error('RUTA_NO_ENCONTRADA');
    if (!operation && route.OPERACION_ID) {
      operationId = String(route.OPERACION_ID).trim();
      operation = obtenerRegistro_('OPERACIONES', operationId);
      if (!operation) throw new Error('OPERACION_NO_ENCONTRADA');
    }
  }

  if (operation && route) {
    const routeOfOperation = String(operation.RUTA_ID || '').trim();
    const operationOfRoute = String(route.OPERACION_ID || '').trim();
    if ((routeOfOperation && routeOfOperation !== String(route.ID)) ||
        (operationOfRoute && operationOfRoute !== String(operation.ID)) ||
        (!routeOfOperation && !operationOfRoute)) {
      throw new Error('COMBUSTIBLE_RUTA_NO_COINCIDE');
    }
  }

  if (operation) {
    vehicleId = String(operation.VEHICULO_ID || '').trim();
    driverId = String(operation.CONDUCTOR_ID || '').trim();
  } else if (route) {
    vehicleId = String(route.VEHICULO_ID || '').trim();
    driverId = String(route.CONDUCTOR_ID || '').trim();
  }

  if (!isAdmin && isCreate) {
    if (!operation && !route) throw new Error('COMBUSTIBLE_ASIGNACION_ACTIVA_REQUERIDA');
    if (operation && operation.ESTADO !== 'Activa') throw new Error('COMBUSTIBLE_ASIGNACION_NO_VIGENTE');
    if (route && ['Asignada','En curso'].indexOf(route.ESTADO) < 0) throw new Error('COMBUSTIBLE_ASIGNACION_NO_VIGENTE');
  }

  if (!vehicleId) throw new Error('COMBUSTIBLE_VEHICULO_REQUERIDO');
  if (!driverId) throw new Error('COMBUSTIBLE_CONDUCTOR_REQUERIDO');
  if (!obtenerRegistro_('VEHICULOS', vehicleId)) throw new Error('VEHICULO_NO_ENCONTRADO');
  if (!obtenerRegistro_('CONDUCTORES', driverId)) throw new Error('CONDUCTOR_NO_ENCONTRADO');
  if (operation && (String(operation.VEHICULO_ID) !== vehicleId || String(operation.CONDUCTOR_ID) !== driverId)) throw new Error('COMBUSTIBLE_OPERACION_NO_COINCIDE');
  if (route && (String(route.VEHICULO_ID) !== vehicleId || String(route.CONDUCTOR_ID) !== driverId)) throw new Error('COMBUSTIBLE_RUTA_NO_COINCIDE');

  return { VEHICULO_ID:vehicleId, CONDUCTOR_ID:driverId, OPERACION_ID:operationId, RUTA_ID:routeId };
}

function validarCargaCombustible_(data, existing, session, isCreate) {
  const link = resolverVinculoCombustible_(data, existing, session, isCreate);
  const liters = numeroCombustible_(data.LITROS !== undefined ? data.LITROS : (existing && existing.LITROS), 'LITROS', false);
  const price = numeroCombustible_(data.PRECIO_LITRO !== undefined ? data.PRECIO_LITRO : (existing && existing.PRECIO_LITRO), 'PRECIO_LITRO', true);
  const mileageRaw = data.KILOMETRAJE !== undefined ? data.KILOMETRAJE : (existing && existing.KILOMETRAJE);
  const mileage = mileageRaw === '' || mileageRaw === null || mileageRaw === undefined ? '' : numeroCombustible_(mileageRaw, 'KILOMETRAJE', true);
  const dateValue = data.FECHA_HORA || (existing && existing.FECHA_HORA) || new Date();
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) throw new Error('COMBUSTIBLE_FECHA_INVALIDA');

  return {
    VEHICULO_ID: link.VEHICULO_ID,
    CONDUCTOR_ID: link.CONDUCTOR_ID,
    OPERACION_ID: link.OPERACION_ID,
    RUTA_ID: link.RUTA_ID,
    FECHA_HORA: date,
    TIPO_COMBUSTIBLE: String(data.TIPO_COMBUSTIBLE !== undefined ? data.TIPO_COMBUSTIBLE : (existing && existing.TIPO_COMBUSTIBLE) || 'Diésel').trim(),
    LITROS: redondearCombustible_(liters, 3),
    PRECIO_LITRO: redondearCombustible_(price, 2),
    COSTO_TOTAL: redondearCombustible_(liters * price, 2),
    KILOMETRAJE: mileage === '' ? '' : redondearCombustible_(mileage, 1),
    ESTACION_SERVICIO: String(data.ESTACION_SERVICIO !== undefined ? data.ESTACION_SERVICIO : (existing && existing.ESTACION_SERVICIO) || '').trim(),
    NUMERO_DOCUMENTO: String(data.NUMERO_DOCUMENTO !== undefined ? data.NUMERO_DOCUMENTO : (existing && existing.NUMERO_DOCUMENTO) || '').trim(),
    MEDIO_PAGO: String(data.MEDIO_PAGO !== undefined ? data.MEDIO_PAGO : (existing && existing.MEDIO_PAGO) || '').trim(),
    TANQUE_LLENO: String(data.TANQUE_LLENO !== undefined ? data.TANQUE_LLENO : (existing && existing.TANQUE_LLENO) || 'SI').toUpperCase() === 'NO' ? 'NO' : 'SI',
    COMPROBANTE_URL: String(data.COMPROBANTE_URL !== undefined ? data.COMPROBANTE_URL : (existing && existing.COMPROBANTE_URL) || '').trim(),
    OBSERVACIONES: String(data.OBSERVACIONES !== undefined ? data.OBSERVACIONES : (existing && existing.OBSERVACIONES) || '').trim().slice(0, 1500),
    ESTADO_REGISTRO: 'Activo',
  };
}

function recalcularConsumosVehiculo_(vehicleId) {
  const rows = listarRegistros_('CARGAS_COMBUSTIBLE', {}).filter(function(row) { return row.VEHICULO_ID === vehicleId; }).sort(function(a, b) {
    const dateDiff = new Date(a.FECHA_HORA || a.CREADO_EN).getTime() - new Date(b.FECHA_HORA || b.CREADO_EN).getTime();
    return dateDiff || String(a.ID).localeCompare(String(b.ID));
  });
  let previousMileage = null;
  rows.forEach(function(row) {
    const mileage = row.KILOMETRAJE === '' || row.KILOMETRAJE === null || row.KILOMETRAJE === undefined ? null : Number(row.KILOMETRAJE);
    const liters = Number(row.LITROS || 0);
    let distance = '';
    let kmPerLiter = '';
    let litersPer100 = '';
    if (mileage !== null && isFinite(mileage) && previousMileage !== null && mileage >= previousMileage) {
      distance = redondearCombustible_(mileage - previousMileage, 1);
      if (distance > 0 && liters > 0) {
        kmPerLiter = redondearCombustible_(distance / liters, 2);
        litersPer100 = redondearCombustible_((liters / distance) * 100, 2);
      }
    }
    if (mileage !== null && isFinite(mileage)) previousMileage = mileage;
    const previousValue = row.KILOMETRAJE_ANTERIOR === '' || row.KILOMETRAJE_ANTERIOR === null || row.KILOMETRAJE_ANTERIOR === undefined ? '' : Number(row.KILOMETRAJE_ANTERIOR);
    const targetPrevious = distance === '' ? '' : redondearCombustible_(mileage - Number(distance), 1);
    if (String(previousValue) !== String(targetPrevious) || String(row.DISTANCIA_DESDE_ULTIMA_CARGA_KM || '') !== String(distance) || String(row.CONSUMO_KM_L || '') !== String(kmPerLiter) || String(row.CONSUMO_L_100KM || '') !== String(litersPer100)) {
      actualizarRegistro_('CARGAS_COMBUSTIBLE', row.ID, { KILOMETRAJE_ANTERIOR:targetPrevious, DISTANCIA_DESDE_ULTIMA_CARGA_KM:distance, CONSUMO_KM_L:kmPerLiter, CONSUMO_L_100KM:litersPer100 });
    }
  });
  const vehicle = obtenerRegistro_('VEHICULOS', vehicleId);
  const maxMileage = rows.reduce(function(max, row) { const value = Number(row.KILOMETRAJE); return isFinite(value) ? Math.max(max, value) : max; }, 0);
  if (vehicle && maxMileage > Number(vehicle.KILOMETRAJE || 0)) actualizarRegistro_('VEHICULOS', vehicleId, { KILOMETRAJE:maxMileage });
}

function crearCargaCombustible_(request, session) {
  exigirPermiso_(session.user, 'COMBUSTIBLE', 'CREAR');
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') throw new Error('PERMISO_DENEGADO');
  const clean = validarCargaCombustible_(request.datos || {}, null, session, true);
  clean.CREADO_POR = session.user.ID;
  clean.ACTUALIZADO_POR = session.user.ID;
  clean.ELIMINADO = 'NO';
  const row = insertarRegistro_('CARGAS_COMBUSTIBLE', clean, 'COM');
  recalcularConsumosVehiculo_(row.VEHICULO_ID);
  const updated = obtenerRegistro_('CARGAS_COMBUSTIBLE', row.ID);
  registrarBitacora_(session.user, 'CREAR_CARGA', 'COMBUSTIBLE', row.ID, 'Carga registrada. Datos: ' + respaldoAuditoria_(updated), ipSolicitudCombustible_(request));
  if (session.user.ROL_ID === 'ROL-SUPERVISOR') {
    notificarRolesInterno_(['ROL-ADMIN'], { TITULO:'Nueva carga de combustible', MENSAJE:session.user.NOMBRE + ' registró ' + clean.LITROS + ' L para el vehículo ' + clean.VEHICULO_ID + '.', TIPO:'Combustible', PRIORIDAD:'Normal', OPERACION_ID:clean.OPERACION_ID, CREADO_POR:session.user.ID });
  }
  return ok_({ row:limpiarSalidaRecurso_('CARGAS_COMBUSTIBLE', updated) });
}

function actualizarCargaCombustible_(request, session) {
  exigirPermiso_(session.user, 'COMBUSTIBLE', 'ACTUALIZAR');
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') throw new Error('PERMISO_DENEGADO');
  const existing = obtenerRegistro_('CARGAS_COMBUSTIBLE', request.identificador);
  if (!existing) throw new Error('REGISTRO_NO_ENCONTRADO');
  const oldVehicleId = existing.VEHICULO_ID;
  const clean = validarCargaCombustible_(request.datos || {}, existing, session, false);
  clean.ACTUALIZADO_POR = session.user.ID;
  const row = actualizarRegistro_('CARGAS_COMBUSTIBLE', existing.ID, clean);
  recalcularConsumosVehiculo_(oldVehicleId);
  if (oldVehicleId !== row.VEHICULO_ID) recalcularConsumosVehiculo_(row.VEHICULO_ID);
  const updated = obtenerRegistro_('CARGAS_COMBUSTIBLE', row.ID);
  registrarBitacora_(session.user, 'ACTUALIZAR_CARGA', 'COMBUSTIBLE', row.ID, 'Respaldo anterior: ' + respaldoAuditoria_(existing) + '. Datos posteriores: ' + respaldoAuditoria_(updated), ipSolicitudCombustible_(request));
  return ok_({ row:limpiarSalidaRecurso_('CARGAS_COMBUSTIBLE', updated) });
}

function solicitarEliminacionCombustible_(request, session) {
  exigirPermiso_(session.user, 'COMBUSTIBLE', 'ELIMINAR');
  if (session.user.ROL_ID !== 'ROL-SUPERVISOR') throw new Error('SOLO_SUPERVISOR_SOLICITA_ELIMINACION');
  const data = request.datos || {};
  const chargeId = String(data.CARGA_ID || request.identificador || '').trim();
  const reason = String(data.MOTIVO || '').trim();
  if (reason.length < 10) throw new Error('COMBUSTIBLE_MOTIVO_ELIMINACION_REQUERIDO');
  if (!obtenerRegistro_('CARGAS_COMBUSTIBLE', chargeId)) throw new Error('REGISTRO_NO_ENCONTRADO');
  const duplicate = listarRegistros_('AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', {}).find(function(row) { return row.CARGA_ID === chargeId && row.SOLICITADO_POR === session.user.ID && ['PENDIENTE','APROBADA'].indexOf(row.ESTADO) >= 0; });
  if (duplicate) throw new Error('COMBUSTIBLE_SOLICITUD_YA_EXISTE');
  const row = insertarRegistro_('AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', { CARGA_ID:chargeId, SOLICITADO_POR:session.user.ID, SOLICITANTE_NOMBRE:session.user.NOMBRE, MOTIVO:reason, ESTADO:'PENDIENTE', AUTORIZADO_POR:'', AUTORIZADOR_NOMBRE:'', COMENTARIO_AUTORIZACION:'', FECHA_SOLICITUD:new Date(), FECHA_AUTORIZACION:'', FECHA_EJECUCION:'', IP_SOLICITUD:ipSolicitudCombustible_(request), IP_AUTORIZACION:'', EJECUTADO_POR:'', ELIMINADO:'NO' }, 'AUT-COM');
  registrarBitacora_(session.user, 'SOLICITAR_ELIMINACION', 'COMBUSTIBLE', chargeId, 'Solicitud ' + row.ID + '. Motivo: ' + reason, ipSolicitudCombustible_(request));
  notificarRolesInterno_(['ROL-ADMIN'], { TITULO:'Autorización de eliminación pendiente', MENSAJE:session.user.NOMBRE + ' solicita eliminar la carga ' + chargeId + '. Motivo: ' + reason, TIPO:'Combustible', PRIORIDAD:'Alta', CREADO_POR:session.user.ID });
  return ok_({ row:limpiarSalidaRecurso_('AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', row) });
}

function resolverSolicitudEliminacionCombustible_(request, session) {
  if (session.user.ROL_ID !== 'ROL-ADMIN') throw new Error('SOLO_ADMINISTRADOR');
  const data = request.datos || {};
  const requestId = String(data.SOLICITUD_ID || request.identificador || '').trim();
  const decision = String(data.DECISION || '').trim().toUpperCase();
  if (['APROBAR','RECHAZAR'].indexOf(decision) < 0) throw new Error('COMBUSTIBLE_DECISION_INVALIDA');
  const authorization = obtenerRegistro_('AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', requestId);
  if (!authorization) throw new Error('COMBUSTIBLE_SOLICITUD_NO_ENCONTRADA');
  if (authorization.ESTADO !== 'PENDIENTE') throw new Error('COMBUSTIBLE_SOLICITUD_YA_RESUELTA');
  const statusValue = decision === 'APROBAR' ? 'APROBADA' : 'RECHAZADA';
  const row = actualizarRegistro_('AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', requestId, { ESTADO:statusValue, AUTORIZADO_POR:session.user.ID, AUTORIZADOR_NOMBRE:session.user.NOMBRE, COMENTARIO_AUTORIZACION:String(data.COMENTARIO || '').trim().slice(0, 1000), FECHA_AUTORIZACION:new Date(), IP_AUTORIZACION:ipSolicitudCombustible_(request) });
  registrarBitacora_(session.user, decision === 'APROBAR' ? 'AUTORIZAR_ELIMINACION' : 'RECHAZAR_ELIMINACION', 'COMBUSTIBLE', authorization.CARGA_ID, 'Solicitud ' + requestId + ' ' + statusValue.toLowerCase() + '. Comentario: ' + String(data.COMENTARIO || ''), ipSolicitudCombustible_(request));
  notificarUsuarioInterno_(authorization.SOLICITADO_POR, { TITULO:decision === 'APROBAR' ? 'Eliminación autorizada' : 'Eliminación rechazada', MENSAJE:'La solicitud ' + requestId + ' para la carga ' + authorization.CARGA_ID + ' fue ' + statusValue.toLowerCase() + ' por ' + session.user.NOMBRE + '.', TIPO:'Combustible', PRIORIDAD:decision === 'APROBAR' ? 'Alta' : 'Normal', CREADO_POR:session.user.ID });
  return ok_({ row:limpiarSalidaRecurso_('AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', row) });
}

function eliminarCargaCombustible_(request, session) {
  exigirPermiso_(session.user, 'COMBUSTIBLE', 'ELIMINAR');
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') throw new Error('PERMISO_DENEGADO');
  const data = request.datos || {};
  const chargeId = String(data.CARGA_ID || request.identificador || '').trim();
  const charge = obtenerRegistro_('CARGAS_COMBUSTIBLE', chargeId);
  if (!charge) throw new Error('REGISTRO_NO_ENCONTRADO');
  let detail = '';
  if (session.user.ROL_ID === 'ROL-SUPERVISOR') {
    const authorizationId = String(data.SOLICITUD_ID || '').trim();
    const authorization = authorizationId ? obtenerRegistro_('AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', authorizationId) : null;
    if (!authorization || authorization.CARGA_ID !== chargeId || authorization.SOLICITADO_POR !== session.user.ID || authorization.ESTADO !== 'APROBADA' || authorization.FECHA_EJECUCION) throw new Error('COMBUSTIBLE_AUTORIZACION_ADMIN_REQUERIDA');
    actualizarRegistro_('AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', authorization.ID, { ESTADO:'EJECUTADA', FECHA_EJECUCION:new Date(), EJECUTADO_POR:session.user.ID });
    detail = 'Eliminación ejecutada por Supervisor con autorización ' + authorization.ID + ' del Administrador ' + authorization.AUTORIZADOR_NOMBRE + '.';
    notificarUsuarioInterno_(authorization.AUTORIZADO_POR, { TITULO:'Eliminación ejecutada', MENSAJE:session.user.NOMBRE + ' ejecutó la eliminación autorizada de la carga ' + chargeId + '.', TIPO:'Combustible', PRIORIDAD:'Normal', CREADO_POR:session.user.ID });
  } else if (session.user.ROL_ID === 'ROL-ADMIN') {
    const reason = String(data.MOTIVO || '').trim() || 'Eliminación administrativa sin motivo adicional';
    detail = 'Eliminación directa por Administrador. Motivo: ' + reason + '.';
    listarRegistros_('AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', {}).filter(function(row) { return row.CARGA_ID === chargeId && ['PENDIENTE','APROBADA'].indexOf(row.ESTADO) >= 0; }).forEach(function(row) { actualizarRegistro_('AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', row.ID, { ESTADO:'ANULADA', FECHA_EJECUCION:new Date(), EJECUTADO_POR:session.user.ID }); });
  } else throw new Error('PERMISO_DENEGADO');
  eliminarRegistro_('CARGAS_COMBUSTIBLE', chargeId);
  recalcularConsumosVehiculo_(charge.VEHICULO_ID);
  registrarBitacora_(session.user, 'ELIMINAR_CARGA', 'COMBUSTIBLE', chargeId, detail + ' Respaldo íntegro previo: ' + respaldoAuditoria_(charge), ipSolicitudCombustible_(request));
  return ok_({ id:chargeId, respaldo:true, eliminacionLogica:true });
}

function resumenCombustible_(request, session) {
  exigirPermiso_(session.user, 'COMBUSTIBLE', 'LEER');
  const rows = filtrarPorUsuario_('CARGAS_COMBUSTIBLE', listarRegistros_('CARGAS_COMBUSTIBLE', {}), session.user);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const currentMonth = rows.filter(function(row) { return new Date(row.FECHA_HORA || row.CREADO_EN).getTime() >= monthStart; });
  const sum = function(list, field) { return list.reduce(function(total, row) { return total + Number(row[field] || 0); }, 0); };
  const distanceRows = rows.filter(function(row) { return Number(row.DISTANCIA_DESDE_ULTIMA_CARGA_KM || 0) > 0 && Number(row.LITROS || 0) > 0; });
  const totalDistance = sum(distanceRows, 'DISTANCIA_DESDE_ULTIMA_CARGA_KM');
  const consumptionLiters = sum(distanceRows, 'LITROS');
  const byVehicle = {};
  rows.forEach(function(row) {
    const key = row.VEHICULO_ID || 'SIN-VEHICULO';
    if (!byVehicle[key]) byVehicle[key] = { VEHICULO_ID:key, CARGAS:0, LITROS:0, COSTO_TOTAL:0, DISTANCIA_KM:0 };
    byVehicle[key].CARGAS += 1;
    byVehicle[key].LITROS += Number(row.LITROS || 0);
    byVehicle[key].COSTO_TOTAL += Number(row.COSTO_TOTAL || 0);
    byVehicle[key].DISTANCIA_KM += Number(row.DISTANCIA_DESDE_ULTIMA_CARGA_KM || 0);
  });
  return ok_({ totalCargas:rows.length, totalLitros:redondearCombustible_(sum(rows, 'LITROS'), 2), gastoTotal:redondearCombustible_(sum(rows, 'COSTO_TOTAL'), 2), precioPromedioLitro:rows.length ? redondearCombustible_(sum(rows, 'COSTO_TOTAL') / Math.max(sum(rows, 'LITROS'), 0.001), 2) : 0, consumoPromedioKmL:totalDistance > 0 && consumptionLiters > 0 ? redondearCombustible_(totalDistance / consumptionLiters, 2) : 0, consumoPromedioL100Km:totalDistance > 0 && consumptionLiters > 0 ? redondearCombustible_((consumptionLiters / totalDistance) * 100, 2) : 0, mesActual:{ cargas:currentMonth.length, litros:redondearCombustible_(sum(currentMonth, 'LITROS'), 2), gasto:redondearCombustible_(sum(currentMonth, 'COSTO_TOTAL'), 2) }, porVehiculo:Object.keys(byVehicle).map(function(key) { return byVehicle[key]; }).sort(function(a,b) { return b.COSTO_TOTAL - a.COSTO_TOTAL; }) });
}
