/** Panel principal y datos de reportes. */
function panelPrincipal_(session) {
  exigirPermiso_(session.user, 'PANEL_PRINCIPAL', 'LEER');
  actualizarEstadosDocumentos_();
  const visibleRows = function(sheetName, moduleName) {
    return tienePermiso_(session.user, moduleName, 'LEER')
      ? filtrarPorUsuario_(sheetName, listarRegistros_(sheetName, {}), session.user) : [];
  };
  const vehicles = visibleRows('VEHICULOS', 'VEHICULOS');
  const drivers = visibleRows('CONDUCTORES', 'CONDUCTORES');
  const operations = visibleRows('OPERACIONES', 'OPERACIONES');
  const maintenance = visibleRows('MANTENCIONES', 'MANTENCIONES');
  const fuelLoads = visibleRows('CARGAS_COMBUSTIBLE', 'COMBUSTIBLE');
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  const fuelMonth = fuelLoads.filter(function(row) { return new Date(row.FECHA_HORA || row.CREADO_EN).getTime() >= monthStart; });
  const documents = visibleRows('DOCUMENTOS', 'DOCUMENTOS');
  const alerts = visibleRows('ALERTAS', 'ALERTAS').filter(function(row) { return row.LEIDA !== 'SI'; });
  const routes = visibleRows('RUTAS', 'RUTAS');
  const notifications = visibleRows('NOTIFICACIONES', 'NOTIFICACIONES')
    .filter(function(row) { return row.LEIDA !== 'SI'; });
  const checkins = visibleRows('CHECKINS', 'CHECKIN');
  const activeLimit = Date.now() - CONFIGURACION_APLICACION.SEGUNDOS_CONEXION_ACTIVA * 1000;
  const connections = visibleRows('CONEXIONES', 'CONEXIONES')
    .filter(function(row) {
      return row.ESTADO !== 'Desconectado' && new Date(row.ULTIMA_CONEXION).getTime() >= activeLimit;
    });
  return ok_({
    metrics: {
      vehicles: vehicles.length,
      availableVehicles: vehicles.filter(function(row) { return row.ESTADO === 'Disponible'; }).length,
      drivers: drivers.length,
      availableDrivers: drivers.filter(function(row) { return row.ESTADO === 'Disponible'; }).length,
      activeOperations: operations.filter(function(row) { return row.ESTADO === 'Activa'; }).length,
      openMaintenance: maintenance.filter(function(row) { return ['Programada','En proceso','Atrasada'].indexOf(row.ESTADO) >= 0; }).length,
      fuelLoadsMonth: fuelMonth.length,
      fuelLitersMonth: fuelMonth.reduce(function(total, row) { return total + Number(row.LITROS || 0); }, 0),
      fuelCostMonth: fuelMonth.reduce(function(total, row) { return total + Number(row.COSTO_TOTAL || 0); }, 0),
      expiredDocuments: documents.filter(function(row) { return row.ESTADO === 'Vencido'; }).length,
      unreadAlerts: alerts.length,
      assignedRoutes: routes.filter(function(row) { return row.ESTADO === 'Asignada' || row.ESTADO === 'En curso'; }).length,
      unreadNotifications: notifications.length,
      onlineDevices: connections.length,
      pendingCheckins: checkins.filter(function(row) { return row.ESTADO_REVISION === 'Pendiente' && row.UTILIZADO !== 'SI'; }).length,
      blockedCheckins: checkins.filter(function(row) { return row.ESTADO_REVISION === 'Bloqueado' && row.UTILIZADO !== 'SI'; }).length,
      approvedCheckins: checkins.filter(function(row) { return row.ESTADO_REVISION === 'Aprobado' && row.UTILIZADO !== 'SI' && new Date(row.VIGENTE_HASTA || 0).getTime() > Date.now(); }).length,
    },
    recentOperations: operations.slice(-10).reverse(),
    alerts: alerts.slice(-10).reverse(),
    notifications: notifications.slice(-10).reverse(),
    routes: routes.slice(-10).reverse(),
    charts: {
      operationsByDay: operacionesPorDiaUltimosSiete_(operations),
      vehicleStates: contarPorEstado_(vehicles),
      routeStates: contarPorEstado_(routes),
    },
  });
}

function operacionesPorDiaUltimosSiete_(operations) {
  const output = [];
  const counts = {};
  operations.forEach(function(row) {
    const date = new Date(row.FECHA_INICIO || row.CREADO_EN);
    if (!isNaN(date.getTime())) {
      const key = Utilities.formatDate(date, CONFIGURACION_APLICACION.ZONA_HORARIA, 'yyyy-MM-dd');
      counts[key] = (counts[key] || 0) + 1;
    }
  });
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = Utilities.formatDate(date, CONFIGURACION_APLICACION.ZONA_HORARIA, 'yyyy-MM-dd');
    output.push({
      FECHA: key,
      ETIQUETA: Utilities.formatDate(date, CONFIGURACION_APLICACION.ZONA_HORARIA, 'EEE'),
      TOTAL: counts[key] || 0,
    });
  }
  return output;
}

function contarPorEstado_(rows) {
  const counts = {};
  rows.forEach(function(row) {
    const state = String(row.ESTADO || 'Sin estado');
    counts[state] = (counts[state] || 0) + 1;
  });
  return Object.keys(counts).map(function(state) {
    return { ESTADO:state, TOTAL:counts[state] };
  }).sort(function(a, b) { return b.TOTAL - a.TOTAL; });
}
