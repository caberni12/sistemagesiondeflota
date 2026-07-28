/** ============================================================
 * ARCHIVO: 00_Configuracion.gs
 * ============================================================ */
/**
 * Sistema de Gestión de Flotas - Configuración central.
 * Si el proyecto Apps Script está vinculado a la hoja, instalarSistema() guardará
 * automáticamente el ID. Para un proyecto independiente, pegue el ID aquí.
 */
const VERSION_APLICACION = '3.18.3';

const CONFIGURACION_APLICACION = Object.freeze({
  ID_HOJA_CALCULO: '1onJJEN1rgz0N9GXOiUqV7ong4-nlbdAjzMyW_rumXCM',
  CLAVE_INSTALACION: 'GENERAR_AUTOMATICAMENTE',
  HORAS_SESION: 72,
  ZONA_HORARIA: 'America/Santiago',
  MAXIMO_FILAS_LISTADO: 2000,
  MAXIMO_HISTORIAL_OPERACIONES_RAPIDO: 80,
  MAXIMO_FILAS_GPS_RESPUESTA: 500,
  SEGUNDOS_CONEXION_ACTIVA: 90,
  SEGUNDOS_ACTUALIZAR_SESION: 120,
  MAXIMO_CONSULTAS_CARGA_RAPIDA: 18,
  SEGUNDOS_MINIMOS_GEOCODIFICACION: 30,
  SEGUNDOS_HISTORIAL_GPS: 60,
  SEGUNDOS_ACTUALIZAR_CONEXION_DESDE_GPS: 20,
  MAXIMA_EDAD_UBICACION_SEGUNDOS: 180,
  MAXIMA_PRECISION_UBICACION_METROS: 120,
  PRECISION_MAPA_CONFIABLE_METROS: 250,
  VELOCIDAD_SALTO_MAXIMA_KMH: 240,
  SEGUNDOS_GPS_RECIENTE_PREFERIDO: 120,
  SEGUNDOS_CACHE_METADATOS_TIEMPO_REAL: 10,
  MAXIMO_CONEXIONES_EN_LINEA_RESPUESTA: 120,
  MAXIMO_GEOCODIFICACIONES_CONEXIONES_POR_CONSULTA: 2,
  SEGUNDOS_CACHE_RASTRO_CONEXIONES: 21600,
  MAXIMO_FILAS_IMPORTACION: 1500,
  TOLERANCIA_GPS_IMPRECISA_FIN_METROS: 500,
  ID_CARPETA_DOCUMENTOS_FOTOS: '1lWKDp7E28XU2D45ihvZctIq29Ji_aoq9',
  ID_CARPETA_DOCUMENTOS_PDF: '1_2TgmSkzhRzcOQvw0_-ZiHfLTdUuQD2M',
  ID_CARPETA_BOLETAS_COMBUSTIBLE: '1JE9_yNAo0gpCZ1CnAnXMN8bhNh6fZTPj',
  ID_CARPETA_EVIDENCIAS_RUTA: '1lWKDp7E28XU2D45ihvZctIq29Ji_aoq9',
  MAXIMO_ARCHIVO_DRIVE_BYTES: 12582912,
  MINUTOS_SIN_GPS_ALERTA: 5,
  METROS_PRECISION_GPS_ALERTA: 150,
  DIAS_AVISO_MANTENCION: 7,
  DIAS_AVISO_DOCUMENTO: 30,
  HORAS_REPETICION_ALERTA: 8,
});

const OFICINA_VIRTUAL_MODO_AUTO_ = 'OFICINA_VIRTUAL_MODO_AUTO';
const OFICINA_VIRTUAL_ULTIMA_REVISION_ = 'OFICINA_VIRTUAL_ULTIMA_REVISION';
const OFICINA_VIRTUAL_ULTIMO_RESULTADO_ = 'OFICINA_VIRTUAL_ULTIMO_RESULTADO';
const OFICINA_VIRTUAL_EJECUTANDO_ = 'OFICINA_VIRTUAL_EJECUTANDO';
const OFICINA_VIRTUAL_CACHE_VERSION_ = 'OFICINA_VIRTUAL_CACHE_VERSION';
const OFICINA_VIRTUAL_CACHE_SEGUNDOS_ = 300;

const ESQUEMAS_APLICACION = Object.freeze({
  CONFIGURACION: ['CLAVE','VALOR','DESCRIPCION','ACTUALIZADO_EN'],
  USUARIOS: ['ID','NOMBRE','CORREO','CONTRASENA_CIFRADA','SAL_CONTRASENA','ROL_ID','ESTADO','TELEFONO','ULTIMO_ACCESO','CREADO_EN','ACTUALIZADO_EN','ELIMINADO','MODO_PERMISOS','PERMISOS_PERSONALIZADOS','VERSION_PERMISOS'],
  ROLES: ['ID','NOMBRE','DESCRIPCION','ESTADO','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  PERMISOS: ['ID','ROL_ID','MODULO','ACCION','PERMITIDO','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  VEHICULOS: ['ID','PATENTE','MARCA','MODELO','ANIO','COLOR','COMBUSTIBLE','VIN','KILOMETRAJE','ESTADO','QR_CODIGO','PROXIMA_MANTENCION','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  CONDUCTORES: ['ID','NOMBRE','RUT','TELEFONO','CORREO','LICENCIA_CLASE','LICENCIA_VENCIMIENTO','ESTADO','USUARIO_ID','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  OPERACIONES: ['ID','VEHICULO_ID','CONDUCTOR_ID','ORIGEN','DESTINO','FECHA_INICIO','FECHA_FIN','ESTADO','KM_INICIO','KM_FIN','DISTANCIA_KM','OBSERVACIONES','CREADO_POR','CREADO_EN','ACTUALIZADO_EN','ELIMINADO','CHECKIN_ID','RUTA_ID','TIPO_OPERACION','PUNTO_RETORNO','BASE_NOMBRE','BASE_DIRECCION','BASE_LATITUD','BASE_LONGITUD','RADIO_INICIO_METROS','RADIO_FIN_METROS','PRECISION_GPS_MAXIMA_METROS','INICIO_LATITUD','INICIO_LONGITUD','INICIO_PRECISION','DISTANCIA_INICIO_BASE_METROS','VALIDACION_INICIO','FIN_LATITUD','FIN_LONGITUD','FIN_PRECISION','DISTANCIA_FIN_BASE_METROS','VALIDACION_FIN','CIERRE_TIPO','CIERRE_FUERA_BASE','CIERRE_MOTIVO','CIERRE_AUTORIZADO_POR','CIERRE_AUTORIZADO_ROL','CIERRE_IP_PUBLICA','CIERRE_FECHA_AUTORIZACION'],
  GPS: ['ID','OPERACION_ID','RUTA_ID','CONDUCTOR_ID','VEHICULO_ID','LATITUD','LONGITUD','PRECISION_METROS','VELOCIDAD_KMH','RUMBO','FECHA_HORA','FUENTE','PROVEEDOR','EDAD_SEGUNDOS','ES_SIMULADA','CALIDAD_GPS','CREADO_EN','ELIMINADO','DIRECCION','BATERIA_PORCENTAJE','DISPOSITIVO_ID'],
  GPS_ACTUAL: ['ID','CLAVE_SEGUIMIENTO','OPERACION_ID','RUTA_ID','CONDUCTOR_ID','VEHICULO_ID','LATITUD','LONGITUD','PRECISION_METROS','VELOCIDAD_KMH','RUMBO','FECHA_HORA','FUENTE','PROVEEDOR','EDAD_SEGUNDOS','ES_SIMULADA','CALIDAD_GPS','CREADO_EN','ACTUALIZADO_EN','ELIMINADO','DIRECCION','BATERIA_PORCENTAJE','DISPOSITIVO_ID'],
  HISTORIAL: ['ID','OPERACION_ID','EVENTO','DETALLE','FECHA_HORA','USUARIO_ID','CREADO_EN','ELIMINADO'],
  MANTENCIONES: ['ID','VEHICULO_ID','TIPO','TITULO','DESCRIPCION','FECHA_PROGRAMADA','FECHA_REALIZADA','KILOMETRAJE','COSTO','ESTADO','TALLER','OBSERVACIONES','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  CARGAS_COMBUSTIBLE: ['ID','VEHICULO_ID','CONDUCTOR_ID','OPERACION_ID','RUTA_ID','FECHA_HORA','TIPO_COMBUSTIBLE','LITROS','PRECIO_LITRO','COSTO_TOTAL','KILOMETRAJE','KILOMETRAJE_ANTERIOR','DISTANCIA_DESDE_ULTIMA_CARGA_KM','CONSUMO_KM_L','CONSUMO_L_100KM','ESTACION_SERVICIO','NUMERO_DOCUMENTO','MEDIO_PAGO','TANQUE_LLENO','COMPROBANTE_URL','OBSERVACIONES','CREADO_POR','CREADO_EN','ACTUALIZADO_POR','ACTUALIZADO_EN','ESTADO_REGISTRO','ELIMINADO'],
  AUTORIZACIONES_ELIMINACION_COMBUSTIBLE: ['ID','CARGA_ID','SOLICITADO_POR','SOLICITANTE_NOMBRE','MOTIVO','ESTADO','AUTORIZADO_POR','AUTORIZADOR_NOMBRE','COMENTARIO_AUTORIZACION','FECHA_SOLICITUD','FECHA_AUTORIZACION','FECHA_EJECUCION','IP_SOLICITUD','IP_AUTORIZACION','EJECUTADO_POR','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  DOCUMENTOS: ['ID','TIPO','ASOCIADO_TIPO','ASOCIADO_ID','CONDUCTOR_ASOCIADO_ID','USUARIO_ASOCIADO_ID','CORREO_ASOCIADO','IDENTIFICACION','FECHA_EMISION','FECHA_VENCIMIENTO','ESTADO','DIRECCION_ARCHIVO','OBSERVACIONES','CARGADO_POR_USUARIO_ID','CARGADO_POR_CORREO','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  ALERTAS: ['ID','TIPO','NIVEL','TITULO','MENSAJE','MODULO','REGISTRO_ID','CLAVE_UNICA','LEIDA','USUARIO_ID','FECHA_HORA','FECHA_LECTURA','LEIDA_POR','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  REPORTES: ['ID','TIPO','PARAMETROS_CODIFICADOS','DIRECCION_ARCHIVO','GENERADO_POR','FECHA_HORA','ESTADO','CREADO_EN','ELIMINADO'],
  BITACORA: ['ID','USUARIO_ID','USUARIO_NOMBRE','ACCION','MODULO','REGISTRO_ID','DETALLE','IP_CLIENTE','FECHA_HORA','CREADO_EN','ELIMINADO'],
  PARAMETROS: ['ID','GRUPO','CLAVE','VALOR','TIPO','DESCRIPCION','ACTIVO','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  EMPRESAS: ['ID','RUT','RAZON_SOCIAL','NOMBRE_FANTASIA','GIRO','DIRECCION','COMUNA','CIUDAD','REGION','PAIS','TELEFONO_PRINCIPAL','TELEFONO_SECUNDARIO','CORREO','SITIO_WEB','REPRESENTANTE_LEGAL','RUT_REPRESENTANTE','DIRECCION_LOGOTIPO','ID_ARCHIVO_LOGOTIPO','NOMBRE_ARCHIVO_LOGOTIPO','TIPO_ARCHIVO_LOGOTIPO','COLOR_PRINCIPAL','COLOR_SECUNDARIO','ZONA_HORARIA','MONEDA','UNIDAD_DISTANCIA','FORMATO_FECHA','TEXTO_PIE','ESTADO','CREADO_EN','ACTUALIZADO_EN','ELIMINADO','COLOR_ACENTO','COLOR_FONDO','COLOR_SUPERFICIE','COLOR_TEXTO','COLOR_TEXTO_SECUNDARIO','COLOR_BORDE','COLOR_MENU','COLOR_MENU_SECUNDARIO','COLOR_EXITO','COLOR_ADVERTENCIA','COLOR_PELIGRO','COLOR_FONDO_OSCURO','COLOR_SUPERFICIE_OSCURO','COLOR_TEXTO_OSCURO','COLOR_TEXTO_SECUNDARIO_OSCURO','COLOR_BORDE_OSCURO','TEMA_PREDETERMINADO','VALIDAR_UBICACION_OPERACION','PUNTO_OPERACION_NOMBRE','PUNTO_OPERACION_DIRECCION','PUNTO_OPERACION_LATITUD','PUNTO_OPERACION_LONGITUD','RADIO_INICIO_METROS','RADIO_FIN_METROS','PRECISION_GPS_MAXIMA_METROS','RETORNO_BASE_OBLIGATORIO','PUNTO_OPERACION_MODIFICADO_POR','PUNTO_OPERACION_MODIFICADO_ROL','PUNTO_OPERACION_MODIFICADO_IP','PUNTO_OPERACION_MODIFICADO_EN'],
  QR: ['ID','CODIGO','TIPO','REGISTRO_ID','ESTADO','FECHA_GENERACION','FECHA_ULTIMO_USO','USOS','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  RUTAS: ['ID','NOMBRE','CONDUCTOR_ID','VEHICULO_ID','OPERACION_ID','ORIGEN','ORIGEN_LATITUD','ORIGEN_LONGITUD','DESTINO','DESTINO_LATITUD','DESTINO_LONGITUD','PARADAS_CODIFICADAS','PROVEEDOR_NAVEGACION','ESTADO','INSTRUCCIONES','FECHA_ASIGNACION','FECHA_INICIO','FECHA_FIN','CREADO_POR','CREADO_EN','ACTUALIZADO_EN','ELIMINADO','EVIDENCIAS_FOTOS_CODIFICADAS','ULTIMA_EVIDENCIA_URL','ULTIMA_EVIDENCIA_FECHA','ULTIMA_EVIDENCIA_POR','ULTIMA_EVIDENCIA_OBSERVACION','CHECKIN_ID','GPS_SEGUIMIENTO_ACTIVO','SEGUIMIENTO_INICIADO_POR','ULTIMA_UBICACION_EN'],
  NOTIFICACIONES: ['ID','DESTINATARIO_USUARIO_ID','DESTINATARIO_CONDUCTOR_ID','TITULO','MENSAJE','TIPO','PRIORIDAD','RUTA_ID','OPERACION_ID','CLAVE_UNICA','LEIDA','FECHA_ENVIO','FECHA_LECTURA','LEIDA_POR','CREADO_POR','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  CHECKINS: ['ID','VEHICULO_ID','CONDUCTOR_ID','OPERACION_ID','FECHA_HORA','KILOMETRAJE','NIVEL_COMBUSTIBLE','LISTA_CODIFICADA','TOTAL_ITEMS','ITEMS_OK','FALLAS_LEVES','FALLAS_CRITICAS','RESULTADO','ESTADO_REVISION','OBSERVACIONES','FIRMA_CONDUCTOR','REVISADO_POR','FECHA_REVISION','COMENTARIO_REVISION','VIGENTE_HASTA','UTILIZADO','CREADO_POR','CREADO_EN','ACTUALIZADO_EN','ELIMINADO','SOLICITUD_CLIENTE_ID','FECHA_OPERATIVA'],
  CONEXIONES: ['ID','USUARIO_ID','CONDUCTOR_ID','DISPOSITIVO_ID','SESION_ID','SESION_CLIENTE_ID','SECCION_ACTUAL','ACTIVIDAD','VEHICULO_ID','OPERACION_ID','RUTA_ID','GPS_ACTIVO','PAGINA_VISIBLE','ESTADO','ULTIMA_CONEXION','PLATAFORMA','NAVEGADOR','TIPO_RED','BATERIA_PORCENTAJE','LATITUD','LONGITUD','PRECISION_METROS','FECHA_GPS','FUENTE_GPS','PROVEEDOR_GPS','CALIDAD_GPS','IP_PUBLICA','IP_VERSION','IP_CAPTURADA_EN','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  CONEXIONES_ACTUAL: ['ID','CLAVE_CONEXION','CONEXION_ID','USUARIO_ID','CONDUCTOR_ID','DISPOSITIVO_ID','SESION_ID','SESION_CLIENTE_ID','SECCION_ACTUAL','ACTIVIDAD','VEHICULO_ID','OPERACION_ID','RUTA_ID','GPS_ACTIVO','PAGINA_VISIBLE','ESTADO','ULTIMA_CONEXION','PLATAFORMA','NAVEGADOR','TIPO_RED','BATERIA_PORCENTAJE','LATITUD','LONGITUD','PRECISION_METROS','FECHA_GPS','FUENTE_GPS','PROVEEDOR_GPS','CALIDAD_GPS','IP_PUBLICA','IP_VERSION','IP_CAPTURADA_EN','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  SESIONES: ['ID','USUARIO_ID','FICHA_SESION_CIFRADA','FECHA_INICIO','FECHA_EXPIRACION','ULTIMO_USO','ACTIVA','AGENTE_NAVEGADOR','IP_PUBLICA','IP_VERSION','IP_CAPTURADA_EN','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
});

const RECURSOS_APLICACION = Object.freeze({
  usuarios: { sheet: 'USUARIOS', prefix: 'USR', module: 'USUARIOS' },
  roles: { sheet: 'ROLES', prefix: 'ROL', module: 'USUARIOS' },
  permisos: { sheet: 'PERMISOS', prefix: 'PER', module: 'USUARIOS' },
  vehiculos: { sheet: 'VEHICULOS', prefix: 'VEH', module: 'VEHICULOS' },
  conductores: { sheet: 'CONDUCTORES', prefix: 'CON', module: 'CONDUCTORES' },
  operaciones: { sheet: 'OPERACIONES', prefix: 'OPE', module: 'OPERACIONES' },
  checkins: { sheet: 'CHECKINS', prefix: 'CHK', module: 'CHECKIN' },
  gps: { sheet: 'GPS', prefix: 'GPS', module: 'GPS' },
  historial: { sheet: 'HISTORIAL', prefix: 'HIS', module: 'HISTORIAL' },
  mantenciones: { sheet: 'MANTENCIONES', prefix: 'MAN', module: 'MANTENCIONES' },
  combustible: { sheet: 'CARGAS_COMBUSTIBLE', prefix: 'COM', module: 'COMBUSTIBLE' },
  autorizacionesCombustible: { sheet: 'AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', prefix: 'AUT-COM', module: 'COMBUSTIBLE' },
  documentos: { sheet: 'DOCUMENTOS', prefix: 'DOC', module: 'DOCUMENTOS' },
  alertas: { sheet: 'ALERTAS', prefix: 'ALT', module: 'ALERTAS' },
  reportes: { sheet: 'REPORTES', prefix: 'REP', module: 'REPORTES' },
  bitacora: { sheet: 'BITACORA', prefix: 'BIT', module: 'BITACORA' },
  parametros: { sheet: 'PARAMETROS', prefix: 'PAR', module: 'CONFIGURACION' },
  empresas: { sheet: 'EMPRESAS', prefix: 'EMP', module: 'CONFIGURACION' },
  qr: { sheet: 'QR', prefix: 'QR', module: 'QR' },
  rutas: { sheet: 'RUTAS', prefix: 'RUT', module: 'RUTAS' },
  notificaciones: { sheet: 'NOTIFICACIONES', prefix: 'NOT', module: 'NOTIFICACIONES' },
  conexiones: { sheet: 'CONEXIONES', prefix: 'CNX', module: 'CONEXIONES' },
});

const ACCIONES_PUBLICAS = Object.freeze(['salud','estadoSistema','instalacionInicial','iniciarSesion']);

/** ============================================================
 * ARCHIVO: 01_Principal.gs
 * ============================================================ */
/** Punto de entrada de la aplicación web. */
function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.accion) || 'salud');
    const request = Object.assign({}, e && e.parameter ? e.parameter : {}, { accion: action });
    return respuestaJson_(enrutarSolicitud_(request, e));
  } catch (error) {
    return respuestaJson_(respuestaError_(error));
  }
}

function doPost(e) {
  try {
    const request = parsearSolicitud_(e);
    return respuestaJson_(enrutarSolicitud_(request, e));
  } catch (error) {
    return respuestaJson_(respuestaError_(error));
  }
}

/** ============================================================
 * ARCHIVO: 02_Rutas.gs
 * ============================================================ */
/** Enrutador único del servicio de datos. */
function normalizarAccionSolicitud_(request) {
  const entrada = String((request && (request.accion || request.action || request.ACCION)) || '').trim();
  if (!entrada) return '';
  const clave = entrada.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s_-]+/g, '').toLowerCase();
  const alias = {
    iniciarruta:'iniciarRuta',
    startroute:'iniciarRuta',
    iniciaruta:'iniciarRuta',
    iniciarrutaasignada:'iniciarRuta',
    startassignedroute:'iniciarRuta',
    completarruta:'completarRuta',
    completaruta:'completarRuta',
    completeroute:'completarRuta',
    routecomplete:'completarRuta',
    completado:'completarRuta',
    completada:'completarRuta',
    finalizarruta:'completarRuta',
    finishroute:'completarRuta',
    terminarruta:'completarRuta',
    cerrarruta:'completarRuta',
    marcarrutacompletada:'completarRuta',
    actualizarestadoruta:'actualizarEstadoRuta',
    updateroutestatus:'actualizarEstadoRuta',
    resumenconexionesadministrador:'resumenConexionesAdministrador',
    resumenconexiones:'resumenConexionesAdministrador',
    conexionesenlinea:'resumenConexionesAdministrador',
    listarconexionesenlinea:'resumenConexionesAdministrador',
    onlineconnections:'resumenConexionesAdministrador',
    connectionsonline:'resumenConexionesAdministrador',
    consultarconexiones:'resumenConexionesAdministrador',
    consultarconexionesenlinea:'resumenConexionesAdministrador',
    guardarseguimientoconexionusuario:'guardarSeguimientoConexionUsuario',
    guardarseguimientousuario:'guardarSeguimientoConexionUsuario',
    saveconnectiontracking:'guardarSeguimientoConexionUsuario',
    marcarnotificacionleida:'marcarNotificacionLeida',
    readnotification:'marcarNotificacionLeida',
    marcaralertaleida:'marcarAlertaLeida',
    readalert:'marcarAlertaLeida'
  };
  return alias[clave] || entrada;
}

function enrutarSolicitud_(request, event) {
  reiniciarCachesEjecucion_();
  request = request || {};
  const accion = normalizarAccionSolicitud_(request);
  if (!accion) throw new Error('ACCION_REQUERIDA');

  if (accion === 'salud') {
    return ok_({ version: VERSION_APLICACION, service: 'Base de datos central del Sistema de Gestión de Flotas', now: fechaIso_() });
  }
  if (accion === 'estadoSistema') return estadoSistema_();
  if (accion === 'instalacionInicial') return instalarSistemaInicial_(request);
  if (accion === 'iniciarSesion') return iniciarSesion_(request);

  const session = requerirSesion_(request.fichaSesion);

  switch (accion) {
    case 'cerrarSesion': return cerrarSesion_(request.fichaSesion, session);
    case 'miSesion': return ok_({ user: usuarioPublico_(session.user) });
    case 'cargaRapida': return cargaRapida_(request, session);
    case 'panelPrincipal': return panelPrincipal_(session);
    case 'resumenOperaciones': return resumenOperacionesRapido_(request, session);
    case 'listar': return servicioListar_(request, session);
    case 'obtener': return servicioObtener_(request, session);
    case 'crear': return servicioCrear_(request, session);
    case 'actualizar': return servicioActualizar_(request, session);
    case 'eliminar': return servicioEliminar_(request, session);
    case 'iniciarOperacion': return iniciarOperacion_(request, session);
    case 'finalizarOperacion': return finalizarOperacion_(request, session);
    case 'editarOperacionAdministrativa': return editarOperacionAdministrativa_(request, session);
    case 'eliminarOperacionAdministrativa': return eliminarOperacionAdministrativa_(request, session);
    case 'crearCheckinVehicular': return crearCheckinVehicular_(request, session);
    case 'revisarCheckinVehicular': return revisarCheckinVehicular_(request, session);
    case 'checkinsDisponibles': return checkinsDisponibles_(request, session);
    case 'validarQrVehiculo': return validarQrVehiculo_(request, session);
    case 'guardarUbicacion': return guardarUbicacion_(request, session);
    case 'ultimasUbicaciones': return ultimasUbicaciones_(request, session);
    case 'asignarRuta': return asignarRuta_(request, session);
    case 'iniciarRuta':
    case 'startRoute':
    case 'iniciar_ruta':
    case 'iniciar-ruta': return iniciarRuta_(request, session);
    case 'completarRuta':
    case 'completeRoute':
    case 'finalizarRuta':
    case 'terminarRuta':
    case 'cerrarRuta':
    case 'Completado':
    case 'Completada': return completarRuta_(request, session);
    case 'actualizarEstadoRuta':
    case 'updateRouteStatus': return actualizarEstadoRuta_(request, session);
    case 'registrarEvidenciaRuta': return registrarEvidenciaRuta_(request, session);
    case 'obtenerImagenEvidenciaRuta': return obtenerImagenEvidenciaRuta_(request, session);
    case 'enviarNotificacion': return enviarNotificacion_(request, session);
    case 'marcarNotificacionLeida':
    case 'readNotification': return marcarNotificacionLeida_(request, session);
    case 'marcarAlertaLeida':
    case 'readAlert': return marcarAlertaLeida_(request, session);
    case 'actualizarConexion': return actualizarConexion_(request, session);
    case 'resumenTiempoReal': return resumenTiempoReal_(request, session);
    case 'resumenConexionesAdministrador':
    case 'resumenConexiones':
    case 'conexionesEnLinea':
    case 'listarConexionesEnLinea':
    case 'onlineConnections':
    case 'connectionsOnline': return resumenConexionesAdministrador_(request, session);
    case 'guardarSeguimientoConexionUsuario': return guardarSeguimientoConexionUsuario_(request, session);
    case 'seguimientoConexionTiempoReal': return seguimientoConexionTiempoReal_(request, session);
    case 'enviarAvisoConexiones': return enviarAvisoConexiones_(request, session);
    case 'resumenCombustible': return resumenCombustible_(request, session);
    case 'solicitarEliminacionCombustible': return solicitarEliminacionCombustible_(request, session);
    case 'resolverSolicitudEliminacionCombustible': return resolverSolicitudEliminacionCombustible_(request, session);
    case 'eliminarCargaCombustible': return eliminarCargaCombustible_(request, session);
    case 'subirArchivoDrive': return subirArchivoDrive_(request, session);
    case 'ejecutarAlertasAutomaticas': return ejecutarAlertasAutomaticasServicio_(request, session);
    case 'diagnosticoSistema': return diagnosticoSistema_(request, session);
    case 'repararSistema': return repararSistema_(request, session);
    case 'estadoRapidoOficinaVirtual': return estadoRapidoOficinaVirtual_(request, session);
    case 'pendientesOficinaVirtual': return consultarPendientesOficinaVirtual_(request, session);
    case 'estadoOficinaVirtual': return estadoOficinaVirtual_(request, session);
    case 'consultarOficinaVirtual': return consultarOficinaVirtual_(request, session);
    case 'configurarModoOficinaVirtual': return configurarModoOficinaVirtual_(request, session);
    case 'ejecutarRevisionOficinaVirtual': return ejecutarRevisionOficinaVirtual_(request, session);
    case 'repararOficinaVirtual': return repararOficinaVirtual_(request, session);
    case 'cambiarContrasena': return cambiarPassword_(request, session);
    case 'actualizarPermisosUsuario': return actualizarPermisosUsuario_(request, session);
    case 'guardarEmpresa': return guardarEmpresaServicio_(request, session);
    case 'guardarPuntoOperacion': return guardarPuntoOperacionServicio_(request, session);
    case 'obtenerPuntoOperacion': return obtenerPuntoOperacionServicio_(request, session);
    case 'limpiarDatosOperativos': return limpiarDatosOperativosServicio_(request, session);
    case 'importarMasivo': return importarMasivoServicio_(request, session);
    case 'registrarIpConexion': return registrarIpConexion_(request, session);
    default: throw new Error('ACCION_NO_ENCONTRADA');
  }
}

function cargaRapida_(request, session) {
  const data = request.datos || {};
  const consultas = Array.isArray(data.consultas) ? data.consultas : [];
  const maximo = Number(CONFIGURACION_APLICACION.MAXIMO_CONSULTAS_CARGA_RAPIDA || 18);
  if (!consultas.length) throw new Error('CONSULTAS_REQUERIDAS');
  if (consultas.length > maximo) throw new Error('DEMASIADAS_CONSULTAS');

  const resultados = {};
  consultas.forEach(function(consulta, index) {
    const clave = String(consulta.clave || index).slice(0, 240);
    const accion = String(consulta.accion || '');
    let respuesta;
    if (accion === 'miSesion') {
      respuesta = ok_({ user: usuarioPublico_(session.user) });
    } else if (accion === 'panelPrincipal') {
      respuesta = panelPrincipal_(session);
    } else if (accion === 'resumenTiempoReal') {
      respuesta = resumenTiempoReal_(consulta, session);
    } else if (accion === 'resumenCombustible') {
      respuesta = resumenCombustible_(consulta, session);
    } else if (accion === 'resumenOperaciones') {
      respuesta = resumenOperacionesRapido_(consulta, session);
    } else if (accion === 'obtenerPuntoOperacion') {
      respuesta = obtenerPuntoOperacionServicio_(consulta, session);
    } else if (accion === 'listar') {
      respuesta = servicioListar_({
        recurso: consulta.recurso,
        filtros: consulta.filtros || {},
        limite: consulta.limite,
      }, session);
    } else {
      throw new Error('CONSULTA_CARGA_RAPIDA_NO_PERMITIDA');
    }
    resultados[clave] = respuesta && respuesta.data ? respuesta.data : {};
  });
  return ok_({ resultados: resultados, total: consultas.length });
}

function servicioListar_(request, session) {
  const resource = obtenerRecurso_(request.recurso);
  exigirPermiso_(session.user, resource.module, 'LEER');
  let rows = listarRegistros_(resource.sheet, request.filtros || {});
  if (resource.sheet === 'EMPRESAS') rows = ordenarEmpresasPrincipal_(rows);
  rows = filtrarPorUsuario_(resource.sheet, rows, session.user);
  // Los usuarios deben salir en formato público. Devolver la fila cruda dejaba
  // PERMISOS_PERSONALIZADOS como texto JSON y la matriz aparecía vacía al reabrirla.
  if (resource.sheet === 'USUARIOS') {
    rows = rows.map(function(row) { return usuarioPublico_(row); }).filter(Boolean);
  }
  const limit = Math.min(Number(request.limite || CONFIGURACION_APLICACION.MAXIMO_FILAS_LISTADO), CONFIGURACION_APLICACION.MAXIMO_FILAS_LISTADO);
  return ok_({ rows: rows.slice(0, limit), total: rows.length });
}

function servicioObtener_(request, session) {
  const resource = obtenerRecurso_(request.recurso);
  exigirPermiso_(session.user, resource.module, 'LEER');
  const row = obtenerRegistro_(resource.sheet, request.identificador);
  if (!row) throw new Error('REGISTRO_NO_ENCONTRADO');
  const visible = filtrarPorUsuario_(resource.sheet, [row], session.user);
  if (!visible.length) throw new Error('PERMISO_DENEGADO');
  return ok_({ row: resource.sheet === 'USUARIOS' ? usuarioPublico_(row) : visible[0] });
}

function servicioCrear_(request, session) {
  const resource = obtenerRecurso_(request.recurso);
  if (resource.sheet === 'DOCUMENTOS' && session.user.ROL_ID === 'ROL-CONDUCTOR' && !tienePermiso_(session.user, 'DOCUMENTOS', 'CREAR')) {
    throw new Error('CARGA_DOCUMENTOS_BLOQUEADA_ADMIN');
  }
  exigirPermiso_(session.user, resource.module, 'CREAR');
  if (resource.sheet === 'USUARIOS') return crearUsuarioServicio_(request.datos || {}, session);
  if (resource.sheet === 'CHECKINS') return crearCheckinVehicular_({ datos:request.datos || {} }, session);
  if (resource.sheet === 'CARGAS_COMBUSTIBLE') return crearCargaCombustible_(request, session);
  if (resource.sheet === 'DOCUMENTOS') return crearDocumentoServicio_(request, session);
  if (resource.sheet === 'AUTORIZACIONES_ELIMINACION_COMBUSTIBLE') throw new Error('ACCION_ESPECIAL_REQUERIDA');
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    if (resource.sheet === 'OPERACIONES') return iniciarOperacion_({ datos:request.datos || {} }, session);
    if (resource.sheet === 'GPS') return guardarUbicacion_({ datos:request.datos || {} }, session);
    if (resource.sheet === 'CONEXIONES') throw new Error('ACCION_ESPECIAL_REQUERIDA');
  }
  const data = normalizarEntradaRecurso_(resource.sheet, request.datos || {}, session.user);
  const row = insertarRegistro_(resource.sheet, data, resource.prefix);
  registrarBitacora_(session.user, 'CREAR', resource.module, row.ID, 'Registro creado. Datos: ' + respaldoAuditoria_(row));
  if (['MANTENCIONES','DOCUMENTOS','VEHICULOS','CONDUCTORES'].indexOf(resource.sheet) >= 0) { try { solicitarRevisionAlertasSegundoPlano_('Creación en ' + resource.sheet); } catch (_) {} }
  return ok_({ row: limpiarSalidaRecurso_(resource.sheet, row) });
}

function servicioActualizar_(request, session) {
  const resource = obtenerRecurso_(request.recurso);
  exigirPermiso_(session.user, resource.module, 'ACTUALIZAR');
  const existing = obtenerRegistro_(resource.sheet, request.identificador);
  if (!existing) throw new Error('REGISTRO_NO_ENCONTRADO');
  if (!filtrarPorUsuario_(resource.sheet, [existing], session.user).length) throw new Error('PERMISO_DENEGADO');
  if (resource.sheet === 'CHECKINS' || resource.sheet === 'AUTORIZACIONES_ELIMINACION_COMBUSTIBLE') throw new Error('ACCION_ESPECIAL_REQUERIDA');
  if (resource.sheet === 'CARGAS_COMBUSTIBLE') return actualizarCargaCombustible_(request, session);
  if (resource.sheet === 'DOCUMENTOS') return actualizarDocumentoServicio_(request, session);
  const datosActualizacion = request.datos || {};
  if (resource.sheet === 'NOTIFICACIONES') {
    if (String(datosActualizacion.LEIDA || '').toUpperCase() !== 'SI' || Object.keys(datosActualizacion).some(function(key) { return ['LEIDA'].indexOf(key) < 0; })) throw new Error('PERMISO_DENEGADO');
    return marcarNotificacionLeida_({ NOTIFICACION_ID:request.identificador }, session);
  }
  if (resource.sheet === 'ALERTAS') {
    if (String(datosActualizacion.LEIDA || '').toUpperCase() !== 'SI' || Object.keys(datosActualizacion).some(function(key) { return ['LEIDA'].indexOf(key) < 0; })) throw new Error('PERMISO_DENEGADO');
    return marcarAlertaLeida_({ ALERTA_ID:request.identificador }, session);
  }
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const driverData = request.datos || {};
    if (resource.sheet === 'RUTAS') {
      return actualizarEstadoRuta_({ RUTA_ID:request.identificador, ESTADO:driverData.ESTADO }, session);
    }
    if (resource.sheet === 'OPERACIONES' || resource.sheet === 'CONEXIONES') throw new Error('ACCION_ESPECIAL_REQUERIDA');
  }
  if (resource.sheet === 'USUARIOS') return actualizarUsuarioServicio_(request.identificador, request.datos || {}, session);
  const data = normalizarEntradaRecurso_(resource.sheet, request.datos || {}, session.user);
  const row = actualizarRegistro_(resource.sheet, request.identificador, data);
  registrarBitacora_(session.user, 'ACTUALIZAR', resource.module, request.identificador,
    'Respaldo anterior: ' + respaldoAuditoria_(existing) + '. Datos posteriores: ' + respaldoAuditoria_(row));
  if (['MANTENCIONES','DOCUMENTOS','VEHICULOS','CONDUCTORES'].indexOf(resource.sheet) >= 0) { try { solicitarRevisionAlertasSegundoPlano_('Actualización en ' + resource.sheet); } catch (_) {} }
  return ok_({ row: limpiarSalidaRecurso_(resource.sheet, row) });
}

function servicioEliminar_(request, session) {
  const resource = obtenerRecurso_(request.recurso);
  exigirPermiso_(session.user, resource.module, 'ELIMINAR');
  const existing = obtenerRegistro_(resource.sheet, request.identificador);
  if (!existing) throw new Error('REGISTRO_NO_ENCONTRADO');
  if (!filtrarPorUsuario_(resource.sheet, [existing], session.user).length) throw new Error('PERMISO_DENEGADO');
  if (resource.sheet === 'CARGAS_COMBUSTIBLE') return eliminarCargaCombustible_(request, session);
  if (resource.sheet === 'AUTORIZACIONES_ELIMINACION_COMBUSTIBLE') throw new Error('ACCION_ESPECIAL_REQUERIDA');
  eliminarRegistro_(resource.sheet, request.identificador);
  registrarBitacora_(session.user, 'ELIMINAR', resource.module, request.identificador,
    'Registro eliminado lógicamente. Respaldo íntegro previo: ' + respaldoAuditoria_(existing));
  return ok_({ id: request.identificador });
}

/** ============================================================
 * ARCHIVO: 03_Seguridad.gs
 * ============================================================ */
/** Seguridad, contraseñas, sesiones y permisos. */
function validarContrasenaElegida_(contrasena) {
  if (contrasena === null || typeof contrasena === 'undefined' || String(contrasena).length === 0) {
    throw new Error('CONTRASENA_REQUERIDA');
  }
  return String(contrasena);
}

function usuarioTieneAccesoConfigurado_(usuario) {
  if (!usuario || usuario.ELIMINADO === 'SI' || usuario.ESTADO !== 'Activo') return false;
  const correo = normalizarEmail_(usuario.CORREO);
  const claveCifrada = String(usuario.CONTRASENA_CIFRADA || '');
  const sal = String(usuario.SAL_CONTRASENA || '');
  return Boolean(correo) && /^[a-f0-9]{64}$/i.test(claveCifrada) && sal.length >= 16;
}

function instalarSistemaInicial_(request) {
  // La instalación prepara hojas y catálogos antes de tomar el bloqueo final.
  // Esto evita intentar adquirir el mismo ScriptLock de forma anidada.
  instalarSistema();
  reiniciarCachesEjecucion_();
  const bloqueo = LockService.getScriptLock();
  bloqueo.waitLock(30000);
  try {
    const users = listarRegistros_('USUARIOS', {});
    if (users.some(usuarioTieneAccesoConfigurado_)) throw new Error('SISTEMA_YA_INICIALIZADO');
    validarRequeridos_(request, ['nombre','correo']);
    const contrasena = validarContrasenaElegida_(request.contrasena);
    if (String(request.contrasenaConfirmacion || request.contrasena || '') !== contrasena) {
      throw new Error('CONTRASENAS_NO_COINCIDEN');
    }

    asegurarCatalogos_();
    users.forEach(function(usuario) {
      actualizarRegistro_('USUARIOS', usuario.ID, { ESTADO:'Inactivo', ELIMINADO:'SI' });
    });
    const user = crearUsuarioInterno_({
      NOMBRE: request.nombre,
      CORREO: request.correo,
      CONTRASENA: contrasena,
      ROL_ID: 'ROL-ADMIN',
      ESTADO: 'Activo',
      TELEFONO: request.telefono || '',
    });

    const nombreEmpresa = String(request.nombreEmpresa || request.empresa || '').trim();
    if (nombreEmpresa) {
      const actual = obtenerEmpresaPrincipal_();
      const empresa = {
        RUT: String(request.rutEmpresa || '').trim(),
        RAZON_SOCIAL: String(request.razonSocial || nombreEmpresa).trim(),
        NOMBRE_FANTASIA: nombreEmpresa,
        TELEFONO_PRINCIPAL: String(request.telefonoEmpresa || request.telefono || '').trim(),
        CORREO: normalizarEmail_(request.correoEmpresa || request.correo),
        PAIS: String(request.pais || 'Chile').trim(),
        ZONA_HORARIA: CONFIGURACION_APLICACION.ZONA_HORARIA,
        MONEDA: 'CLP',
        UNIDAD_DISTANCIA: 'km',
        FORMATO_FECHA: 'DD/MM/AAAA',
        COLOR_PRINCIPAL: '#0E9F91', COLOR_SECUNDARIO: '#08746B', COLOR_ACENTO: '#3578E5',
        COLOR_FONDO: '#F3F7FA', COLOR_SUPERFICIE: '#FFFFFF', COLOR_TEXTO: '#173047', COLOR_TEXTO_SECUNDARIO: '#65798B', COLOR_BORDE: '#DCE6EC',
        COLOR_MENU: '#071725', COLOR_MENU_SECUNDARIO: '#0D2638', COLOR_EXITO: '#0E9F91', COLOR_ADVERTENCIA: '#D89216', COLOR_PELIGRO: '#DC4D60',
        COLOR_FONDO_OSCURO: '#071725', COLOR_SUPERFICIE_OSCURO: '#0D2638', COLOR_TEXTO_OSCURO: '#E9F1F7', COLOR_TEXTO_SECUNDARIO_OSCURO: '#9EB0BF', COLOR_BORDE_OSCURO: '#214359',
        TEMA_PREDETERMINADO: 'Sistema',
        ESTADO: 'Activo',
      };
      actual ? actualizarRegistro_('EMPRESAS', actual.ID, empresa) : insertarRegistro_('EMPRESAS', empresa, 'EMP');
    }

    PropertiesService.getScriptProperties().setProperty('INSTALACION_COMPLETADA', 'SI');
    registrarBitacora_(user, 'INSTALACION_INICIAL', 'SEGURIDAD', user.ID, 'Preconfiguración automática y administrador inicial creados');
    return ok_({ initialized:true, user:usuarioPublico_(user), companyConfigured:Boolean(nombreEmpresa) });
  } finally {
    bloqueo.releaseLock();
  }
}

function iniciarSesion_(request) {
  validarRequeridos_(request, ['correo','contrasena']);
  const email = normalizarEmail_(request.correo);
  const user = listarRegistros_('USUARIOS', {}).find(function(row) {
    return normalizarEmail_(row.CORREO) === email && usuarioTieneAccesoConfigurado_(row);
  });
  if (!user || cifrarContrasena_(request.contrasena, user.SAL_CONTRASENA) !== user.CONTRASENA_CIFRADA) {
    throw new Error('CREDENCIALES_INVALIDAS');
  }
  const rawToken = crearToken_();
  const now = new Date();
  const expires = new Date(now.getTime() + CONFIGURACION_APLICACION.HORAS_SESION * 60 * 60 * 1000);
  const sessionRow = insertarRegistro_('SESIONES', {
    USUARIO_ID: user.ID,
    FICHA_SESION_CIFRADA: cifrarFichaSesion_(rawToken),
    FECHA_INICIO: now,
    FECHA_EXPIRACION: expires,
    ULTIMO_USO: now,
    ACTIVA: 'SI',
    AGENTE_NAVEGADOR: String(request.agenteNavegador || '').slice(0, 500),
    IP_PUBLICA: normalizarIpPublica_(request.IP_PUBLICA || request.ipPublica || ''),
    IP_VERSION: versionIp_(request.IP_PUBLICA || request.ipPublica || ''),
    IP_CAPTURADA_EN: (request.IP_PUBLICA || request.ipPublica) ? now : '',
    ELIMINADO: 'NO',
  }, 'SES');
  actualizarRegistro_('USUARIOS', user.ID, { ULTIMO_ACCESO: now });
  registrarBitacora_(user, 'INICIO_SESION', 'SEGURIDAD', user.ID, 'Inicio de sesión correcto', normalizarIpPublica_(request.IP_PUBLICA || request.ipPublica || ''));
  return ok_({ token: rawToken, sessionId:sessionRow.ID, expiresAt: expires.toISOString(), user: usuarioPublico_(user) });
}

function cerrarSesion_(token, session) {
  actualizarRegistro_('SESIONES', session.session.ID, { ACTIVA: 'NO', ULTIMO_USO: new Date() });
  try {
    encolarTrabajoSegundoPlano_('CIERRE_SESION', { sesionId:session.session.ID, usuario:resumenUsuarioSegundoPlano_(session.user), fechaHora:fechaIso_() });
  } catch (_) {}
  return ok_({ loggedOut: true });
}

function requerirSesion_(token) {
  if (!token) throw new Error('AUTENTICACION_REQUERIDA');
  const tokenHash = cifrarFichaSesion_(token);
  const session = listarRegistros_('SESIONES', {}).find(function(row) {
    return row.FICHA_SESION_CIFRADA === tokenHash && row.ACTIVA === 'SI';
  });
  if (!session) throw new Error('SESION_INVALIDA');
  if (new Date(session.FECHA_EXPIRACION).getTime() <= Date.now()) {
    actualizarRegistro_('SESIONES', session.ID, { ACTIVA: 'NO' });
    throw new Error('SESION_EXPIRADA');
  }
  const user = obtenerRegistro_('USUARIOS', session.USUARIO_ID);
  if (!user || user.ESTADO !== 'Activo') throw new Error('USUARIO_DESHABILITADO');
  const ultimoUso = new Date(session.ULTIMO_USO || session.FECHA_INICIO || 0).getTime();
  const intervaloActualizacion = Number(CONFIGURACION_APLICACION.SEGUNDOS_ACTUALIZAR_SESION || 120) * 1000;
  if (!isFinite(ultimoUso) || Date.now() - ultimoUso >= intervaloActualizacion) {
    const ahora = new Date();
    const nuevaExpiracion = new Date(ahora.getTime() + CONFIGURACION_APLICACION.HORAS_SESION * 60 * 60 * 1000);
    actualizarRegistro_('SESIONES', session.ID, { ULTIMO_USO: ahora, FECHA_EXPIRACION: nuevaExpiracion });
    session.ULTIMO_USO = ahora;
    session.FECHA_EXPIRACION = nuevaExpiracion;
  }
  return { user: user, session: session };
}

function cambiarPassword_(request, session) {
  validarRequeridos_(request, ['contrasenaActual']);
  if (cifrarContrasena_(request.contrasenaActual, session.user.SAL_CONTRASENA) !== session.user.CONTRASENA_CIFRADA) {
    throw new Error('CONTRASENA_ACTUAL_INVALIDA');
  }
  const nuevaContrasena = validarContrasenaElegida_(request.nuevaContrasena);
  const salt = crearToken_();
  actualizarRegistro_('USUARIOS', session.user.ID, {
    SAL_CONTRASENA: salt,
    CONTRASENA_CIFRADA: cifrarContrasena_(nuevaContrasena, salt),
  });
  registrarBitacora_(session.user, 'CAMBIAR_PASSWORD', 'SEGURIDAD', session.user.ID, 'Contraseña modificada');
  return ok_({ changed: true });
}

function normalizarRolSistema_(valor) {
  const rol = String(valor || '').trim().toUpperCase().replace(/[ÁÀÄÂ]/g, 'A');
  if (rol === 'ROL-ADMIN' || rol === 'ADMIN' || rol === 'ADMINISTRADOR' || rol === 'ROLE-ADMIN') return 'ROL-ADMIN';
  if (rol === 'ROL-SUPERVISOR' || rol === 'SUPERVISOR' || rol === 'ROLE-SUPERVISOR') return 'ROL-SUPERVISOR';
  if (rol === 'ROL-CONDUCTOR' || rol === 'CONDUCTOR' || rol === 'DRIVER' || rol === 'ROLE-DRIVER') return 'ROL-CONDUCTOR';
  return String(valor || '').trim() || 'ROL-CONDUCTOR';
}

function esAdministradorSistema_(usuario) {
  if (!usuario) return false;
  return normalizarRolSistema_(usuario.ROL_ID || usuario.ROL || usuario.ROL_NOMBRE) === 'ROL-ADMIN';
}

function crearUsuarioInterno_(data) {
  const email = normalizarEmail_(data.CORREO);
  if (!email) throw new Error('CORREO_REQUERIDO');
  const contrasena = validarContrasenaElegida_(data.CONTRASENA);
  if (listarRegistros_('USUARIOS', {}).some(function(row) { return normalizarEmail_(row.CORREO) === email; })) {
    throw new Error('CORREO_YA_EXISTE');
  }
  const salt = crearToken_();
  return insertarRegistro_('USUARIOS', {
    NOMBRE: data.NOMBRE,
    CORREO: email,
    CONTRASENA_CIFRADA: cifrarContrasena_(contrasena, salt),
    SAL_CONTRASENA: salt,
    ROL_ID: normalizarRolSistema_(data.ROL_ID || 'ROL-CONDUCTOR'),
    ESTADO: data.ESTADO || 'Activo',
    TELEFONO: data.TELEFONO || '',
    MODO_PERMISOS: data.MODO_PERMISOS || 'ROL',
    PERMISOS_PERSONALIZADOS: JSON.stringify(normalizarListaPermisos_(data.PERMISOS_PERSONALIZADOS || [])),
    VERSION_PERMISOS: 1,
    ELIMINADO: 'NO',
  }, 'USR');
}

function crearUsuarioServicio_(data, session) {
  validarRequeridos_(data, ['NOMBRE','CORREO']);
  const row = crearUsuarioInterno_(data);
  registrarBitacora_(session.user, 'CREAR', 'USUARIOS', row.ID, 'Usuario creado. Datos: ' + respaldoAuditoria_(row));
  return ok_({ row: usuarioPublico_(row) });
}

function actualizarUsuarioServicio_(id, data, session) {
  const existente = obtenerRegistro_('USUARIOS', id);
  if (!existente) throw new Error('REGISTRO_NO_ENCONTRADO');
  protegerUltimoAdministrador_(existente, data || {});
  const clean = Object.assign({}, data);
  delete clean.CONTRASENA_CIFRADA;
  delete clean.SAL_CONTRASENA;
  // Los permisos solo se actualizan mediante actualizarPermisosUsuario_.
  delete clean.MODO_PERMISOS;
  delete clean.PERMISOS_PERSONALIZADOS;
  delete clean.VERSION_PERMISOS;
  if (Object.prototype.hasOwnProperty.call(clean, 'CONTRASENA')) {
    const contrasena = validarContrasenaElegida_(clean.CONTRASENA);
    const salt = crearToken_();
    clean.SAL_CONTRASENA = salt;
    clean.CONTRASENA_CIFRADA = cifrarContrasena_(contrasena, salt);
    delete clean.CONTRASENA;
  }
  if (clean.CORREO) clean.CORREO = normalizarEmail_(clean.CORREO);
  if (Object.prototype.hasOwnProperty.call(clean, 'ROL_ID')) clean.ROL_ID = normalizarRolSistema_(clean.ROL_ID);
  const row = actualizarRegistro_('USUARIOS', id, clean);
  registrarBitacora_(session.user, 'ACTUALIZAR', 'USUARIOS', id, 'Respaldo anterior: ' + respaldoAuditoria_(existente) + '. Datos posteriores: ' + respaldoAuditoria_(row));
  return ok_({ row: usuarioPublico_(row) });
}

function protegerUltimoAdministrador_(usuarioActual, cambios) {
  if (!usuarioActual || !esAdministradorSistema_(usuarioActual) || usuarioActual.ESTADO !== 'Activo') return;
  const nuevoRol = normalizarRolSistema_(Object.prototype.hasOwnProperty.call(cambios, 'ROL_ID') ? cambios.ROL_ID : usuarioActual.ROL_ID);
  const nuevoEstado = Object.prototype.hasOwnProperty.call(cambios, 'ESTADO') ? String(cambios.ESTADO) : usuarioActual.ESTADO;
  const eliminado = String(cambios.ELIMINADO || usuarioActual.ELIMINADO || 'NO');
  if (nuevoRol === 'ROL-ADMIN' && nuevoEstado === 'Activo' && eliminado !== 'SI') return;
  const otros = listarRegistros_('USUARIOS', {}).filter(function(row) {
    return row.ID !== usuarioActual.ID && esAdministradorSistema_(row) && usuarioTieneAccesoConfigurado_(row);
  });
  if (!otros.length) throw new Error('ULTIMO_ADMINISTRADOR_PROTEGIDO');
}

const PERMISOS_TECNICOS_OBLIGATORIOS_ = Object.freeze([
  'PANEL_PRINCIPAL:LEER',
  'CONEXIONES:CREAR',
  'CONEXIONES:ACTUALIZAR'
]);

function normalizarListaPermisos_(value) {
  let lista = value;
  if (typeof lista === 'string') {
    try { lista = JSON.parse(lista || '[]'); } catch (error) { lista = []; }
  }
  if (!Array.isArray(lista)) lista = [];
  const validos = {};
  lista.forEach(function(item) {
    const permiso = String(item || '').trim().toUpperCase();
    if (/^[A-Z_]+:(LEER|CREAR|ACTUALIZAR|ELIMINAR)$/.test(permiso)) validos[permiso] = true;
  });
  return Object.keys(validos).sort();
}

function catalogoClavesPermisosUsuario_() {
  const modulos = ['PANEL_PRINCIPAL','OFICINA_VIRTUAL','USUARIOS','VEHICULOS','CONDUCTORES','OPERACIONES','CHECKIN','CHECKIN_APROBACIONES','GPS','HISTORIAL','MANTENCIONES','COMBUSTIBLE','DOCUMENTOS','ALERTAS','REPORTES','BITACORA','CONFIGURACION','QR','RUTAS','NOTIFICACIONES','CONEXIONES'];
  const acciones = ['LEER','CREAR','ACTUALIZAR','ELIMINAR'];
  const claves = [];
  modulos.forEach(function(modulo) {
    acciones.forEach(function(accion) { claves.push(modulo + ':' + accion); });
  });
  return claves;
}

function crearMatrizBooleanaPermisos_(permisos) {
  const activos = {};
  const lista = Array.isArray(permisos) ? permisos : normalizarListaPermisos_(permisos);
  lista.forEach(function(permiso) { activos[String(permiso || '').toUpperCase()] = true; });
  const accesoTotal = Boolean(activos['*:*']);
  const matriz = {};
  catalogoClavesPermisosUsuario_().forEach(function(clave) {
    matriz[clave] = accesoTotal || Boolean(activos[clave]);
  });
  return matriz;
}

function matricesPermisosUsuario_(user) {
  const esAdmin = esAdministradorSistema_(user);
  const modo = esAdmin ? 'ROL' : String(user && user.MODO_PERMISOS || 'ROL').toUpperCase();
  const personalizados = esAdmin ? ['*:*'] : normalizarListaPermisos_(user && user.PERMISOS_PERSONALIZADOS || []);
  const baseRol = esAdmin ? ['*:*'] : permisosBaseRol_(user);
  const obligatorios = esAdmin ? [] : PERMISOS_TECNICOS_OBLIGATORIOS_;
  const permisosRol = baseRol.concat(obligatorios);
  const permisosPersonalizados = personalizados.concat(obligatorios);
  const efectivos = modo === 'PERSONALIZADO' ? permisosPersonalizados : permisosRol;
  return {
    actual: crearMatrizBooleanaPermisos_(efectivos),
    rol: crearMatrizBooleanaPermisos_(permisosRol),
    personalizados: crearMatrizBooleanaPermisos_(permisosPersonalizados)
  };
}

function permisosBaseRol_(user) {
  if (!user) return [];
  if (esAdministradorSistema_(user)) return ['*:*'];
  return listarRegistros_('PERMISOS', {}).filter(function(row) {
    return row.ROL_ID === user.ROL_ID && row.PERMITIDO === 'SI';
  }).map(function(row) { return row.MODULO + ':' + row.ACCION; });
}

function permisosEfectivosUsuario_(user) {
  if (!user) return [];
  if (esAdministradorSistema_(user)) return ['*:*'];
  const modo = String(user.MODO_PERMISOS || 'ROL').toUpperCase();
  const seleccionados = modo === 'PERSONALIZADO'
    ? normalizarListaPermisos_(user.PERMISOS_PERSONALIZADOS)
    : permisosBaseRol_(user);
  const mapa = {};
  seleccionados.concat(PERMISOS_TECNICOS_OBLIGATORIOS_).forEach(function(item) { mapa[item] = true; });
  return Object.keys(mapa).sort();
}

function usuarioPublico_(user) {
  if (!user) return null;
  const esAdmin = esAdministradorSistema_(user);
  const rolId = esAdmin ? 'ROL-ADMIN' : normalizarRolSistema_(user.ROL_ID);
  const role = obtenerRegistro_('ROLES', rolId);
  const driver = listarRegistros_('CONDUCTORES', {}).find(function(row) { return row.USUARIO_ID === user.ID; });
  const personalizados = esAdmin ? [] : normalizarListaPermisos_(user.PERMISOS_PERSONALIZADOS);
  const matrices = matricesPermisosUsuario_(user);
  return {
    ID: user.ID,
    NOMBRE: user.NOMBRE,
    CORREO: user.CORREO,
    ROL_ID: rolId,
    ROL_NOMBRE: esAdmin ? 'Administrador' : (role ? role.NOMBRE : rolId),
    ESTADO: user.ESTADO,
    TELEFONO: user.TELEFONO || '',
    ULTIMO_ACCESO: serializarValor_(user.ULTIMO_ACCESO),
    CONDUCTOR_ID: driver ? driver.ID : '',
    MODO_PERMISOS: esAdmin ? 'ROL' : String(user.MODO_PERMISOS || 'ROL').toUpperCase(),
    PERMISOS_PERSONALIZADOS: personalizados,
    VERSION_PERMISOS: Number(user.VERSION_PERMISOS || 0),
    PERMISOS: permisosEfectivosUsuario_(user),
    MATRIZ_PERMISOS: matrices.actual,
    MATRIZ_PERMISOS_ROL: matrices.rol,
    MATRIZ_PERMISOS_PERSONALIZADOS: matrices.personalizados,
  };
}

function exigirPermiso_(user, moduleName, action) {
  if (!tienePermiso_(user, moduleName, action)) throw new Error('PERMISO_DENEGADO');
  return true;
}

function tienePermiso_(user, moduleName, action) {
  if (!user) return false;
  if (esAdministradorSistema_(user)) return true;
  const permiso = String(moduleName || '').toUpperCase() + ':' + String(action || '').toUpperCase();
  return permisosEfectivosUsuario_(user).indexOf(permiso) >= 0;
}

function cifrarContrasena_(password, salt) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(password) + ':' + String(salt),
    Utilities.Charset.UTF_8
  );
  return bytesAHex_(bytes);
}

function cifrarFichaSesion_(token) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(token), Utilities.Charset.UTF_8);
  return bytesAHex_(bytes);
}

function bytesAHex_(bytes) {
  return bytes.map(function(value) {
    const normalized = value < 0 ? value + 256 : value;
    return ('0' + normalized.toString(16)).slice(-2);
  }).join('');
}

function crearToken_() {
  return Utilities.getUuid() + Utilities.getUuid();
}

function limpiarSesionesExpiradas_() {
  const now = Date.now();
  listarRegistros_('SESIONES', {}).forEach(function(row) {
    if (row.ACTIVA === 'SI' && new Date(row.FECHA_EXPIRACION).getTime() <= now) {
      actualizarRegistro_('SESIONES', row.ID, { ACTIVA: 'NO' });
    }
  });
}

/** ============================================================
 * ARCHIVO: 04_Base_de_Datos.gs
 * ============================================================ */
/** Capa genérica de acceso a Google Sheets. */
let CACHE_SPREADSHEET_EJECUCION_ = null;
let CACHE_HOJAS_EJECUCION_ = {};
let CACHE_LECTURAS_EJECUCION_ = {};

function reiniciarCachesEjecucion_() {
  CACHE_SPREADSHEET_EJECUCION_ = null;
  CACHE_HOJAS_EJECUCION_ = {};
  CACHE_LECTURAS_EJECUCION_ = {};
}

function invalidarCacheHoja_(sheetName) {
  delete CACHE_LECTURAS_EJECUCION_[sheetName];
}

function obtenerSpreadsheet_() {
  if (CACHE_SPREADSHEET_EJECUCION_) return CACHE_SPREADSHEET_EJECUCION_;
  const properties = PropertiesService.getScriptProperties();
  const savedId = properties.getProperty('ID_HOJA_CALCULO');
  const configuredId = CONFIGURACION_APLICACION.ID_HOJA_CALCULO;
  const id = savedId || (configuredId && configuredId.indexOf('PEGAR_') !== 0 ? configuredId : '');
  if (id) {
    CACHE_SPREADSHEET_EJECUCION_ = SpreadsheetApp.openById(id);
    return CACHE_SPREADSHEET_EJECUCION_;
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    CACHE_SPREADSHEET_EJECUCION_ = active;
    return CACHE_SPREADSHEET_EJECUCION_;
  }
  throw new Error('ID_HOJA_NO_CONFIGURADO');
}

function obtenerHoja_(sheetName) {
  if (CACHE_HOJAS_EJECUCION_[sheetName]) return CACHE_HOJAS_EJECUCION_[sheetName];
  const ss = obtenerSpreadsheet_();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('HOJA_NO_ENCONTRADA_' + sheetName);
  CACHE_HOJAS_EJECUCION_[sheetName] = sheet;
  return sheet;
}

function asegurarHoja_(sheetName) {
  const ss = obtenerSpreadsheet_();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  const headers = ESQUEMAS_APLICACION[sheetName];
  if (!headers) throw new Error('ESQUEMA_NO_ENCONTRADO_' + sheetName);

  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }
  const lastRow = Math.max(1, sheet.getLastRow());
  const lastColumn = Math.max(1, sheet.getLastColumn());
  const currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function(value) {
    return String(value || '').trim();
  });
  const currentSignature = currentHeaders.slice(0, headers.length).join('|');
  const expectedSignature = headers.join('|');

  if (currentSignature !== expectedSignature) {
    const hasNamedHeaders = currentHeaders.some(function(value) { return Boolean(value); });
    const existingRows = lastRow > 1
      ? sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues()
      : [];
    let migratedRows = [];
    if (hasNamedHeaders && existingRows.length) {
      const indexes = {};
      currentHeaders.forEach(function(header, index) {
        if (header && !Object.prototype.hasOwnProperty.call(indexes, header)) indexes[header] = index;
      });
      migratedRows = existingRows.map(function(row) {
        return headers.map(function(header) {
          return Object.prototype.hasOwnProperty.call(indexes, header) ? row[indexes[header]] : '';
        });
      });
    }
    const clearRows = Math.max(lastRow, migratedRows.length + 1);
    const clearColumns = Math.max(lastColumn, headers.length);
    sheet.getRange(1, 1, clearRows, clearColumns).clearContent();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    if (migratedRows.length) sheet.getRange(2, 1, migratedRows.length, headers.length).setValues(migratedRows);
  }

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#0B5F59')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setWrap(true);
  CACHE_HOJAS_EJECUCION_[sheetName] = sheet;
  invalidarCacheHoja_(sheetName);
  return sheet;
}

function listarRegistros_(sheetName, filters) {
  if (!Object.prototype.hasOwnProperty.call(CACHE_LECTURAS_EJECUCION_, sheetName)) {
    const sheet = obtenerHoja_(sheetName);
    const headers = ESQUEMAS_APLICACION[sheetName];
    const lastRow = sheet.getLastRow();
    const values = lastRow < 2 ? [] : sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
    CACHE_LECTURAS_EJECUCION_[sheetName] = values.filter(function(row) {
      return row.some(function(value) { return value !== '' && value !== null; });
    }).map(function(row) {
      const object = {};
      headers.forEach(function(header, index) { object[header] = serializarValor_(row[index]); });
      return object;
    }).filter(function(row) {
      return !Object.prototype.hasOwnProperty.call(row, 'ELIMINADO') || row.ELIMINADO !== 'SI';
    });
  }
  const rows = CACHE_LECTURAS_EJECUCION_[sheetName].map(function(row) {
    return Object.assign({}, row);
  });
  return aplicarFiltros_(rows, filters || {});
}

function aplicarFiltros_(rows, filters) {
  const keys = Object.keys(filters || {});
  if (!keys.length) return rows;
  return rows.filter(function(row) {
    return keys.every(function(key) {
      const expected = filters[key];
      if (expected === '' || expected === null || typeof expected === 'undefined') return true;
      return String(row[key] || '').toLowerCase() === String(expected).toLowerCase();
    });
  });
}

function obtenerRegistro_(sheetName, id) {
  if (!id) return null;
  return listarRegistros_(sheetName, {}).find(function(row) { return String(row.ID) === String(id); }) || null;
}

function buscarFilaExacta_(sheet, columnIndex, value) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const match = sheet.getRange(2, columnIndex, lastRow - 1, 1)
    .createTextFinder(String(value))
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : -1;
}

function insertarRegistro_(sheetName, data, prefix) {
  const lock = LockService.getScriptLock();
  const lockYaAdquirido = lock.hasLock();
  if (!lockYaAdquirido) lock.waitLock(20000);
  try {
    const sheet = obtenerHoja_(sheetName);
    const headers = ESQUEMAS_APLICACION[sheetName];
    const now = new Date();
    const object = Object.assign({}, data);
    if (headers.indexOf('ID') >= 0 && !object.ID) object.ID = generarId_(prefix || sheetName.slice(0, 3));
    if (headers.indexOf('CREADO_EN') >= 0 && !object.CREADO_EN) object.CREADO_EN = now;
    if (headers.indexOf('ACTUALIZADO_EN') >= 0) object.ACTUALIZADO_EN = now;
    if (headers.indexOf('ELIMINADO') >= 0 && !object.ELIMINADO) object.ELIMINADO = 'NO';
    const row = headers.map(function(header) {
      return Object.prototype.hasOwnProperty.call(object, header) ? deserializarFecha_(object[header]) : '';
    });
    sheet.getRange(Math.max(2, sheet.getLastRow() + 1), 1, 1, headers.length).setValues([row]);
    invalidarCacheHoja_(sheetName);
    invalidarCacheTareasOficinaVirtualSiAplica_(sheetName);
    return limpiarSalidaRecurso_(sheetName, object);
  } finally {
    if (!lockYaAdquirido) lock.releaseLock();
  }
}

function insertarRegistrosMasivos_(sheetName, registros, prefix) {
  const datos = Array.isArray(registros) ? registros : [];
  if (!datos.length) return [];
  const lock = LockService.getScriptLock();
  const lockYaAdquirido = lock.hasLock();
  if (!lockYaAdquirido) lock.waitLock(20000);
  try {
    const sheet = obtenerHoja_(sheetName);
    const headers = ESQUEMAS_APLICACION[sheetName];
    const now = new Date();
    const objetos = datos.map(function(data) {
      const object = Object.assign({}, data || {});
      if (headers.indexOf('ID') >= 0 && !object.ID) object.ID = generarId_(prefix || sheetName.slice(0, 3));
      if (headers.indexOf('CREADO_EN') >= 0 && !object.CREADO_EN) object.CREADO_EN = now;
      if (headers.indexOf('ACTUALIZADO_EN') >= 0) object.ACTUALIZADO_EN = now;
      if (headers.indexOf('ELIMINADO') >= 0 && !object.ELIMINADO) object.ELIMINADO = 'NO';
      return object;
    });
    const filas = objetos.map(function(object) {
      return headers.map(function(header) {
        return Object.prototype.hasOwnProperty.call(object, header) ? deserializarFecha_(object[header]) : '';
      });
    });
    sheet.getRange(Math.max(2, sheet.getLastRow() + 1), 1, filas.length, headers.length).setValues(filas);
    invalidarCacheHoja_(sheetName);
    invalidarCacheTareasOficinaVirtualSiAplica_(sheetName);
    return objetos.map(function(object) { return limpiarSalidaRecurso_(sheetName, object); });
  } finally {
    if (!lockYaAdquirido) lock.releaseLock();
  }
}

function actualizarRegistro_(sheetName, id, data) {
  if (!id) throw new Error('ID_REQUERIDO');
  const lock = LockService.getScriptLock();
  const lockYaAdquirido = lock.hasLock();
  if (!lockYaAdquirido) lock.waitLock(20000);
  try {
    const sheet = obtenerHoja_(sheetName);
    const headers = ESQUEMAS_APLICACION[sheetName];
    const idIndex = headers.indexOf('ID');
    if (idIndex < 0) throw new Error('COLUMNA_ID_NO_ENCONTRADA');
    const rowNumber = buscarFilaExacta_(sheet, idIndex + 1, id);
    if (rowNumber < 2) throw new Error('REGISTRO_NO_ENCONTRADO');
    const values = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
    const current = {};
    headers.forEach(function(header, index) { current[header] = values[index]; });
    Object.keys(data || {}).forEach(function(key) {
      if (headers.indexOf(key) >= 0 && key !== 'ID' && key !== 'CREADO_EN') current[key] = data[key];
    });
    if (headers.indexOf('ACTUALIZADO_EN') >= 0) current.ACTUALIZADO_EN = new Date();
    const newRow = headers.map(function(header) { return deserializarFecha_(current[header]); });
    sheet.getRange(rowNumber, 1, 1, headers.length).setValues([newRow]);
    invalidarCacheHoja_(sheetName);
    invalidarCacheTareasOficinaVirtualSiAplica_(sheetName);
    return limpiarSalidaRecurso_(sheetName, current);
  } finally {
    if (!lockYaAdquirido) lock.releaseLock();
  }
}

function eliminarRegistro_(sheetName, id) {
  const headers = ESQUEMAS_APLICACION[sheetName];
  if (headers.indexOf('ELIMINADO') >= 0) return actualizarRegistro_(sheetName, id, { ELIMINADO: 'SI' });
  throw new Error('ELIMINACION_NO_ADMITIDA');
}

function limpiarHojaDatos_(sheetName) {
  const sheet = obtenerHoja_(sheetName);
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  invalidarCacheHoja_(sheetName);
  invalidarCacheTareasOficinaVirtualSiAplica_(sheetName);
}

function obtenerRecurso_(resourceName) {
  const resource = RECURSOS_APLICACION[String(resourceName || '')];
  if (!resource) throw new Error('RECURSO_NO_ENCONTRADO');
  return resource;
}

function conductorDeUsuario_(usuarioId) {
  return listarRegistros_('CONDUCTORES', {}).find(function(row) {
    return String(row.USUARIO_ID || '') === String(usuarioId || '');
  }) || null;
}

function normalizarDocumentoSegunSesion_(datos, session, existente) {
  const input = Object.assign({}, datos || {});
  const user = session.user;
  const admin = esAdministradorSistema_(user);
  const driver = conductorDeUsuario_(user.ID);
  let type = String(input.ASOCIADO_TIPO !== undefined ? input.ASOCIADO_TIPO : (existente && existente.ASOCIADO_TIPO) || '').trim();
  let associatedId = String(input.ASOCIADO_ID !== undefined ? input.ASOCIADO_ID : (existente && existente.ASOCIADO_ID) || '').trim();
  let driverId = String(input.CONDUCTOR_ASOCIADO_ID !== undefined ? input.CONDUCTOR_ASOCIADO_ID : (existente && existente.CONDUCTOR_ASOCIADO_ID) || '').trim();
  let userId = String(input.USUARIO_ASOCIADO_ID !== undefined ? input.USUARIO_ASOCIADO_ID : (existente && existente.USUARIO_ASOCIADO_ID) || '').trim();
  let email = normalizarEmail_(input.CORREO_ASOCIADO !== undefined ? input.CORREO_ASOCIADO : (existente && existente.CORREO_ASOCIADO) || '');

  if (user.ROL_ID === 'ROL-CONDUCTOR') {
    userId = user.ID;
    email = normalizarEmail_(user.CORREO || '');
    if (driver) {
      type = 'Conductor';
      driverId = driver.ID;
      associatedId = driver.ID;
      if (!input.IDENTIFICACION) input.IDENTIFICACION = driver.RUT || email;
    } else {
      type = 'Usuario';
      driverId = '';
      associatedId = user.ID;
      if (!input.IDENTIFICACION) input.IDENTIFICACION = email || user.ID;
    }
  } else if (!admin && !type) {
    type = driver ? 'Conductor' : 'Usuario';
    driverId = driver ? driver.ID : '';
    userId = user.ID;
    associatedId = driver ? driver.ID : user.ID;
    email = normalizarEmail_(user.CORREO || '');
  } else if (type === 'Conductor') {
    driverId = driverId || associatedId;
    const selectedDriver = obtenerRegistro_('CONDUCTORES', driverId);
    if (!selectedDriver) throw new Error('DOCUMENTO_CONDUCTOR_NO_ENCONTRADO');
    associatedId = selectedDriver.ID;
    userId = selectedDriver.USUARIO_ID || userId;
    const selectedUser = userId ? obtenerRegistro_('USUARIOS', userId) : null;
    email = normalizarEmail_((selectedUser && selectedUser.CORREO) || selectedDriver.CORREO || email);
    if (!input.IDENTIFICACION) input.IDENTIFICACION = selectedDriver.RUT || email;
  } else if (type === 'Usuario') {
    userId = userId || associatedId || (!admin ? user.ID : '');
    const selectedUser = userId ? obtenerRegistro_('USUARIOS', userId) : null;
    if (!selectedUser) throw new Error('DOCUMENTO_USUARIO_NO_ENCONTRADO');
    associatedId = selectedUser.ID;
    driverId = '';
    email = normalizarEmail_(selectedUser.CORREO || email);
    if (!input.IDENTIFICACION) input.IDENTIFICACION = email || selectedUser.ID;
  } else {
    if (!type) type = 'Usuario';
    if (!associatedId && !admin) associatedId = user.ID;
  }

  input.ASOCIADO_TIPO = type;
  input.ASOCIADO_ID = associatedId;
  input.CONDUCTOR_ASOCIADO_ID = driverId;
  input.USUARIO_ASOCIADO_ID = userId;
  input.CORREO_ASOCIADO = email;
  input.CARGADO_POR_USUARIO_ID = existente && existente.CARGADO_POR_USUARIO_ID ? existente.CARGADO_POR_USUARIO_ID : user.ID;
  input.CARGADO_POR_CORREO = existente && existente.CARGADO_POR_CORREO ? existente.CARGADO_POR_CORREO : normalizarEmail_(user.CORREO || '');
  return input;
}

function crearDocumentoServicio_(request, session) {
  if (session.user.ROL_ID === 'ROL-CONDUCTOR' && !tienePermiso_(session.user, 'DOCUMENTOS', 'CREAR')) {
    throw new Error('CARGA_DOCUMENTOS_BLOQUEADA_ADMIN');
  }
  const entrada = normalizarDocumentoSegunSesion_(request.datos || {}, session, null);
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') entrada.ESTADO = 'Pendiente de revisión';
  const data = normalizarEntradaRecurso_('DOCUMENTOS', entrada, session.user);
  const row = insertarRegistro_('DOCUMENTOS', data, 'DOC');
  registrarBitacora_(session.user, 'CREAR_DOCUMENTO', 'DOCUMENTOS', row.ID, 'Documento asociado a ' + row.ASOCIADO_TIPO + ' ' + row.ASOCIADO_ID + ' · correo ' + (row.CORREO_ASOCIADO || 'sin correo') + (session.user.ROL_ID === 'ROL-CONDUCTOR' ? ' · pendiente de revisión administrativa' : ''));
  let notificaciones = [];
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const conductor = conductorDeUsuario_(session.user.ID);
    const nombreConductor = (conductor && conductor.NOMBRE) || session.user.NOMBRE || 'Conductor';
    const mensaje = nombreConductor + ' (' + (session.user.CORREO || 'sin correo') + ') cargó el documento "' + (row.TIPO || 'Documento') + '" identificado como ' + (row.IDENTIFICACION || row.ID) + '. Revíselo en el módulo Documentos.';
    notificaciones = notificarRolesInterno_(['ROL-ADMIN'], {
      TITULO:'Documento pendiente de revisión',
      MENSAJE:mensaje,
      TIPO:'Documento',
      PRIORIDAD:'Alta',
      CREADO_POR:session.user.ID,
      CLAVE_UNICA:'DOCUMENTO-REVISION-' + row.ID
    });
  }
  try { solicitarRevisionAlertasSegundoPlano_('Creación en DOCUMENTOS'); } catch (_) {}
  return ok_({ row:limpiarSalidaRecurso_('DOCUMENTOS', row), revisionPendiente:session.user.ROL_ID === 'ROL-CONDUCTOR', notificacionesAdministradores:notificaciones.length });
}

function actualizarDocumentoServicio_(request, session) {
  const existing = obtenerRegistro_('DOCUMENTOS', request.identificador);
  if (!existing) throw new Error('REGISTRO_NO_ENCONTRADO');
  const data = normalizarEntradaRecurso_('DOCUMENTOS', normalizarDocumentoSegunSesion_(request.datos || {}, session, existing), session.user);
  const row = actualizarRegistro_('DOCUMENTOS', request.identificador, data);
  registrarBitacora_(session.user, 'ACTUALIZAR_DOCUMENTO', 'DOCUMENTOS', row.ID, 'Documento actualizado para ' + row.ASOCIADO_TIPO + ' ' + row.ASOCIADO_ID + ' · correo ' + (row.CORREO_ASOCIADO || 'sin correo'));
  try { solicitarRevisionAlertasSegundoPlano_('Actualización en DOCUMENTOS'); } catch (_) {}
  return ok_({ row:limpiarSalidaRecurso_('DOCUMENTOS', row) });
}

function normalizarEntradaRecurso_(sheetName, data, user) {
  const clean = {};
  const headers = ESQUEMAS_APLICACION[sheetName];
  Object.keys(data || {}).forEach(function(key) {
    if (headers.indexOf(key) >= 0 && ['ID','CONTRASENA_CIFRADA','SAL_CONTRASENA','FICHA_SESION_CIFRADA','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'].indexOf(key) < 0) {
      clean[key] = data[key];
    }
  });
  if (sheetName === 'VEHICULOS') {
    if (clean.PATENTE) clean.PATENTE = String(clean.PATENTE).trim().toUpperCase();
    if (!clean.ESTADO) clean.ESTADO = 'Disponible';
    if (!clean.QR_CODIGO && clean.PATENTE) clean.QR_CODIGO = 'VEH-' + clean.PATENTE.replace(/[^A-Z0-9]/g, '');
  }
  if (sheetName === 'CONDUCTORES' && !clean.ESTADO) clean.ESTADO = 'Disponible';
  if (sheetName === 'DOCUMENTOS' && !clean.ESTADO) clean.ESTADO = 'Vigente';
  if (sheetName === 'ALERTAS') {
    if (!clean.LEIDA) clean.LEIDA = 'NO';
    if (!clean.FECHA_HORA) clean.FECHA_HORA = new Date();
  }
  if (sheetName === 'RUTAS') {
    if (!clean.ESTADO) clean.ESTADO = 'Asignada';
    if (!clean.PROVEEDOR_NAVEGACION) clean.PROVEEDOR_NAVEGACION = 'Google Maps';
    if (!clean.FECHA_ASIGNACION) clean.FECHA_ASIGNACION = new Date();
  }
  if (sheetName === 'NOTIFICACIONES') {
    if (!clean.LEIDA) clean.LEIDA = 'NO';
    if (!clean.PRIORIDAD) clean.PRIORIDAD = 'Normal';
    if (!clean.TIPO) clean.TIPO = 'Información';
    if (!clean.FECHA_ENVIO) clean.FECHA_ENVIO = new Date();
  }
  return clean;
}

function limpiarSalidaRecurso_(sheetName, row) {
  const output = {};
  Object.keys(row || {}).forEach(function(key) {
    if (['CONTRASENA_CIFRADA','SAL_CONTRASENA','FICHA_SESION_CIFRADA'].indexOf(key) < 0) output[key] = serializarValor_(row[key]);
  });
  return output;
}

function filtrarPorUsuario_(sheetName, rows, user) {
  if (esAdministradorSistema_(user)) return rows.map(function(row) { return limpiarSalidaRecurso_(sheetName, row); });
  if (user.ROL_ID === 'ROL-SUPERVISOR') {
    if (sheetName === 'AUTORIZACIONES_ELIMINACION_COMBUSTIBLE') {
      rows = rows.filter(function(row) { return row.SOLICITADO_POR === user.ID; });
    } else if (sheetName === 'NOTIFICACIONES') {
      rows = rows.filter(function(row) { return !row.DESTINATARIO_USUARIO_ID || row.DESTINATARIO_USUARIO_ID === user.ID; });
    } else if (sheetName === 'ALERTAS') {
      rows = rows.filter(function(row) { return !row.USUARIO_ID || row.USUARIO_ID === user.ID; });
    }
    return rows.map(function(row) { return limpiarSalidaRecurso_(sheetName, row); });
  }
  if (user.ROL_ID !== 'ROL-CONDUCTOR') return rows.map(function(row) { return limpiarSalidaRecurso_(sheetName, row); });
  const driver = listarRegistros_('CONDUCTORES', {}).find(function(row) { return row.USUARIO_ID === user.ID; });
  if (sheetName === 'AUTORIZACIONES_ELIMINACION_COMBUSTIBLE') {
    rows = [];
  } else if (sheetName === 'NOTIFICACIONES') {
    rows = rows.filter(function(row) {
      return row.DESTINATARIO_USUARIO_ID === user.ID || (driver && row.DESTINATARIO_CONDUCTOR_ID === driver.ID);
    });
  } else if (sheetName === 'CONEXIONES') {
    rows = rows.filter(function(row) { return row.USUARIO_ID === user.ID; });
  } else if (!driver && ['CONDUCTORES','VEHICULOS','OPERACIONES','GPS','GPS_ACTUAL','RUTAS','HISTORIAL','MANTENCIONES','CHECKINS','CARGAS_COMBUSTIBLE'].indexOf(sheetName) >= 0) {
    rows = [];
  } else if (sheetName === 'CONDUCTORES') {
    rows = rows.filter(function(row) { return row.ID === driver.ID; });
  } else if (sheetName === 'OPERACIONES' || sheetName === 'GPS' || sheetName === 'GPS_ACTUAL' || sheetName === 'RUTAS' || sheetName === 'CARGAS_COMBUSTIBLE') {
    rows = rows.filter(function(row) { return row.CONDUCTOR_ID === driver.ID; });
  } else if (sheetName === 'CHECKINS') {
    rows = rows.filter(function(row) { return row.CONDUCTOR_ID === driver.ID; });
  } else if (sheetName === 'VEHICULOS') {
    const vehicleIds = {};
    listarRegistros_('OPERACIONES', {}).forEach(function(row) { if (row.CONDUCTOR_ID === driver.ID) vehicleIds[row.VEHICULO_ID] = true; });
    listarRegistros_('RUTAS', {}).forEach(function(row) { if (row.CONDUCTOR_ID === driver.ID) vehicleIds[row.VEHICULO_ID] = true; });
    listarRegistros_('CARGAS_COMBUSTIBLE', {}).forEach(function(row) { if (row.CONDUCTOR_ID === driver.ID) vehicleIds[row.VEHICULO_ID] = true; });
    rows = rows.filter(function(row) { return vehicleIds[row.ID]; });
  } else if (sheetName === 'HISTORIAL') {
    const operationIds = {};
    listarRegistros_('OPERACIONES', {}).forEach(function(row) { if (row.CONDUCTOR_ID === driver.ID) operationIds[row.ID] = true; });
    rows = rows.filter(function(row) { return operationIds[row.OPERACION_ID]; });
  } else if (sheetName === 'DOCUMENTOS') {
    rows = rows.filter(function(row) {
      const propioUsuario = String(row.USUARIO_ASOCIADO_ID || '') === String(user.ID) ||
        (row.ASOCIADO_TIPO === 'Usuario' && String(row.ASOCIADO_ID || '') === String(user.ID)) ||
        (String(row.CORREO_ASOCIADO || '').toLowerCase() === String(user.CORREO || '').toLowerCase());
      const propioConductor = driver && (String(row.CONDUCTOR_ASOCIADO_ID || '') === String(driver.ID) ||
        (row.ASOCIADO_TIPO === 'Conductor' && String(row.ASOCIADO_ID || '') === String(driver.ID)));
      return propioUsuario || propioConductor;
    });
  } else if (sheetName === 'MANTENCIONES') {
    const maintenanceVehicles = {};
    listarRegistros_('OPERACIONES', {}).forEach(function(row) { if (row.CONDUCTOR_ID === driver.ID) maintenanceVehicles[row.VEHICULO_ID] = true; });
    listarRegistros_('RUTAS', {}).forEach(function(row) { if (row.CONDUCTOR_ID === driver.ID) maintenanceVehicles[row.VEHICULO_ID] = true; });
    rows = rows.filter(function(row) { return maintenanceVehicles[row.VEHICULO_ID]; });
  } else if (sheetName === 'ALERTAS') {
    rows = rows.filter(function(row) { return !row.USUARIO_ID || row.USUARIO_ID === user.ID; });
  }
  return rows.map(function(row) { return limpiarSalidaRecurso_(sheetName, row); });
}

/** ============================================================
 * ARCHIVO: 05_Instalacion_Inicial.gs
 * ============================================================ */
/** Instalación y mantenimiento inicial del sistema. */
function generarClaveInstalacion_() {
  const entropia = (
    Utilities.getUuid().replace(/-/g, '') +
    Utilities.getUuid().replace(/-/g, '')
  ).toUpperCase();
  return 'SGF-' + [
    entropia.slice(0, 8),
    entropia.slice(8, 16),
    entropia.slice(16, 24),
    entropia.slice(24, 32),
  ].join('-');
}

function obtenerOCrearClaveInstalacion_() {
  const propiedades = PropertiesService.getScriptProperties();
  const existente = propiedades.getProperty('CLAVE_INSTALACION');
  if (existente) return existente;

  const bloqueo = LockService.getScriptLock();
  bloqueo.waitLock(30000);
  try {
    const creadaPorOtraEjecucion = propiedades.getProperty('CLAVE_INSTALACION');
    if (creadaPorOtraEjecucion) return creadaPorOtraEjecucion;

    const configurada = String(CONFIGURACION_APLICACION.CLAVE_INSTALACION || '').trim();
    const valoresAutomaticos = ['CAMBIAR-CLAVE-INSTALACION', 'GENERAR_AUTOMATICAMENTE'];
    const clave = configurada && valoresAutomaticos.indexOf(configurada) === -1
      ? configurada
      : generarClaveInstalacion_();
    propiedades.setProperty('CLAVE_INSTALACION', clave);
    return clave;
  } finally {
    bloqueo.releaseLock();
  }
}

function crearClaveInstalacion() {
  const bloqueo = LockService.getScriptLock();
  bloqueo.waitLock(30000);
  try {
    const clave = generarClaveInstalacion_();
    PropertiesService.getScriptProperties().setProperty('CLAVE_INSTALACION', clave);
    Logger.log('CLAVE DE INSTALACIÓN: ' + clave);
    return {
      ok: true,
      claveInstalacion: clave,
      message: 'Clave creada y guardada en las propiedades del proyecto.',
    };
  } finally {
    bloqueo.releaseLock();
  }
}

function mostrarClaveInstalacion() {
  const clave = obtenerOCrearClaveInstalacion_();
  Logger.log('CLAVE DE INSTALACIÓN: ' + clave);
  return {
    ok: true,
    claveInstalacion: clave,
    message: 'Utilice esta clave una sola vez para crear el administrador inicial.',
  };
}

function generarContrasenaTemporalAdministrador_() {
  const codigo = Utilities.getUuid().replace(/-/g, '').slice(0, 12).toUpperCase();
  return 'Flotas-' + codigo + '-9';
}

function prepararAccesoAdministrador() {
  instalarSistema();
  const bloqueo = LockService.getScriptLock();
  bloqueo.waitLock(30000);
  try {
    const users = listarRegistros_('USUARIOS', {});
    let user = users.find(function(row) { return esAdministradorSistema_(row); }) || users[0] || null;
    const effectiveEmail = normalizarEmail_(
      Session.getEffectiveUser().getEmail() ||
      Session.getActiveUser().getEmail()
    );
    const email = normalizarEmail_(user && user.CORREO) || effectiveEmail;
    if (!email) throw new Error('NO_SE_PUDO_OBTENER_CORREO_ADMINISTRADOR');

    const temporaryPassword = generarContrasenaTemporalAdministrador_();
    const salt = crearToken_();
    const userData = {
      NOMBRE: user && user.NOMBRE ? user.NOMBRE : 'Administrador del sistema',
      CORREO: email,
      CONTRASENA_CIFRADA: cifrarContrasena_(temporaryPassword, salt),
      SAL_CONTRASENA: salt,
      ROL_ID: 'ROL-ADMIN',
      ESTADO: 'Activo',
      ELIMINADO: 'NO',
    };

    user = user
      ? actualizarRegistro_('USUARIOS', user.ID, userData)
      : insertarRegistro_('USUARIOS', userData, 'USR');

    listarRegistros_('SESIONES', {}).filter(function(row) {
      return row.USUARIO_ID === user.ID;
    }).forEach(function(row) {
      actualizarRegistro_('SESIONES', row.ID, {
        ACTIVA: 'NO',
        ULTIMO_USO: new Date(),
      });
    });

    PropertiesService.getScriptProperties().setProperty('INSTALACION_COMPLETADA', 'SI');
    Logger.log('CORREO DE ACCESO: ' + email);
    Logger.log('CONTRASEÑA TEMPORAL: ' + temporaryPassword);
    Logger.log('Abra la interfaz e inicie sesión con estos datos.');

    return {
      ok: true,
      correo: email,
      contrasenaTemporal: temporaryPassword,
      usuarioId: user.ID,
      message: 'Acceso de administrador preparado correctamente.',
    };
  } finally {
    bloqueo.releaseLock();
  }
}

function instalarSistema() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    const configuredId = CONFIGURACION_APLICACION.ID_HOJA_CALCULO;
    if (!configuredId || configuredId.indexOf('PEGAR_') === 0) throw new Error('Abra el Apps Script desde la hoja o configure ID_HOJA_CALCULO.');
    ss = SpreadsheetApp.openById(configuredId);
  }
  PropertiesService.getScriptProperties().setProperty('ID_HOJA_CALCULO', ss.getId());
  Object.keys(ESQUEMAS_APLICACION).forEach(function(sheetName) { asegurarHoja_(sheetName); });
  migrarGpsActualDesdeHistorial_();
  asegurarCatalogos_();
  try { instalarActivadorAlertasAutomaticas_(); } catch (error) { Logger.log('Activador de alertas: ' + error.message); }
  try { instalarActivadorOficinaVirtual_(); } catch (error) { Logger.log('Activador de Oficina Virtual: ' + error.message); }
  let duplicadosDepurados = { alertas:0, notificaciones:0 };
  try { duplicadosDepurados = depurarDuplicadosAvisos_(); } catch (error) { Logger.log('Depuración de avisos: ' + error.message); }
  const claveInstalacion = obtenerOCrearClaveInstalacion_();
  Logger.log('CLAVE DE INSTALACIÓN: ' + claveInstalacion);
  return {
    ok: true,
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl(),
    sheets: Object.keys(ESQUEMAS_APLICACION),
    claveInstalacion: claveInstalacion,
    duplicadosDepurados: duplicadosDepurados,
    message: 'Estructura instalada. Copie la clave mostrada en el registro de ejecución para crear el administrador inicial.',
  };
}


function reiniciarInstantaneasGpsVersion_() {
  const properties = PropertiesService.getScriptProperties();
  const marker = 'GPS_ACTUAL_REINICIADO_' + VERSION_APLICACION;
  if (properties.getProperty(marker) === 'SI') return { ejecutado:false, motivo:'YA_REALIZADO' };
  let gpsActualEliminadas = 0;
  try {
    const sheet = asegurarHoja_('GPS_ACTUAL');
    gpsActualEliminadas = Math.max(0, sheet.getLastRow() - 1);
    if (sheet.getLastRow() > 1) sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
    invalidarCacheHoja_('GPS_ACTUAL');
    invalidarCacheTiempoReal_('GPS_ACTUAL');
  } catch (_) {}

  let conexionesLimpiadas = 0;
  try {
    const sheet = asegurarHoja_('CONEXIONES_ACTUAL');
    const headers = ESQUEMAS_APLICACION.CONEXIONES_ACTUAL;
    const fields = ['LATITUD','LONGITUD','PRECISION_METROS','FECHA_GPS','FUENTE_GPS','PROVEEDOR_GPS','CALIDAD_GPS'];
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      fields.forEach(function(field) {
        const index = headers.indexOf(field);
        if (index >= 0) sheet.getRange(2, index + 1, lastRow - 1, 1).clearContent();
      });
      conexionesLimpiadas = lastRow - 1;
    }
    invalidarCacheHoja_('CONEXIONES_ACTUAL');
    invalidarCacheTiempoReal_('CONEXIONES_ACTUAL');
  } catch (_) {}

  properties.setProperty('GPS_ACTUAL_MIGRADO_' + VERSION_APLICACION, 'SI');
  properties.setProperty(marker, 'SI');
  return { ejecutado:true, gpsActualEliminadas:gpsActualEliminadas, conexionesLimpiadas:conexionesLimpiadas, historialConservado:true, historialNoReutilizado:true };
}

function actualizarSistema() {
  const resultado = instalarSistema();
  try { repararModuloCheckin(); } catch (error) { Logger.log('Reparación de check-in: ' + error.message); }
  try { resultado.puntoOperacional = repararPuntoOperacional(); } catch (error) { Logger.log('Punto operacional: ' + error.message); }
  try { resultado.reinicioGpsActual = reiniciarInstantaneasGpsVersion_(); } catch (error) { Logger.log('Reinicio de posiciones actuales: ' + error.message); }
  try { instalarActivadorOficinaVirtual_(); } catch (error) { Logger.log('Oficina Virtual: ' + error.message); }
  try {
    resultado.alertasTecnicasCerradas = cerrarAlertaTecnicaActivadorResueltaOficinaVirtual_({
      problemasDetalle:activadorOficinaVirtualInstalado_() ? [] : [{ id:'ACTIVADOR-OFICINA' }]
    });
  } catch (error) { Logger.log('Cierre de alerta técnica: ' + error.message); }
  reiniciarCachesEjecucion_();
  resultado.message = 'Sistema 3.18.3 actualizado con la nueva URL de despliegue, migración automática en Android y control administrativo de avisos emergentes, con Oficina Virtual, QR, GPS, permisos y auditoría conservados.';
  return resultado;
}

function probarConexion() {
  const ss = obtenerSpreadsheet_();
  return {
    ok: true,
    name: ss.getName(),
    id: ss.getId(),
    url: ss.getUrl(),
    version: VERSION_APLICACION,
  };
}

function asegurarCatalogos_() {
  asegurarRol_('ROL-ADMIN', 'Administrador', 'Acceso completo');
  asegurarRol_('ROL-SUPERVISOR', 'Supervisor', 'Gestión operacional y reportes');
  asegurarRol_('ROL-CONDUCTOR', 'Conductor', 'Operaciones, rutas, GPS y notificaciones propias');

  const modules = ['PANEL_PRINCIPAL','OFICINA_VIRTUAL','USUARIOS','VEHICULOS','CONDUCTORES','OPERACIONES','CHECKIN','CHECKIN_APROBACIONES','GPS','HISTORIAL','MANTENCIONES','COMBUSTIBLE','DOCUMENTOS','ALERTAS','REPORTES','BITACORA','CONFIGURACION','QR','RUTAS','NOTIFICACIONES','CONEXIONES'];
  const actions = ['LEER','CREAR','ACTUALIZAR','ELIMINAR'];
  modules.forEach(function(moduleName) {
    actions.forEach(function(action) {
      asegurarPermisoCatalogo_('ROL-ADMIN', moduleName, action, 'SI');
    });
  });
  const supervisorModules = ['PANEL_PRINCIPAL','VEHICULOS','CONDUCTORES','OPERACIONES','CHECKIN','CHECKIN_APROBACIONES','GPS','HISTORIAL','MANTENCIONES','COMBUSTIBLE','DOCUMENTOS','ALERTAS','REPORTES','QR','RUTAS','NOTIFICACIONES'];
  supervisorModules.forEach(function(moduleName) {
    actions.forEach(function(action) {
      asegurarPermisoCatalogo_('ROL-SUPERVISOR', moduleName, action, action === 'ELIMINAR' && moduleName !== 'COMBUSTIBLE' ? 'NO' : 'SI');
    });
  });
  const driverRules = {
    PANEL_PRINCIPAL:['LEER'], VEHICULOS:['LEER'], CONDUCTORES:['LEER'], OPERACIONES:['LEER','CREAR','ACTUALIZAR'], CHECKIN:['LEER','CREAR'],
    GPS:['LEER','CREAR'], HISTORIAL:['LEER'], COMBUSTIBLE:['LEER','CREAR'], DOCUMENTOS:['LEER','CREAR'], ALERTAS:['LEER','ACTUALIZAR'],
    QR:['LEER','ACTUALIZAR'], RUTAS:['LEER','ACTUALIZAR'], NOTIFICACIONES:['LEER','ACTUALIZAR'],
    CONEXIONES:['CREAR','ACTUALIZAR']
  };
  Object.keys(driverRules).forEach(function(moduleName) {
    driverRules[moduleName].forEach(function(action) {
      asegurarPermisoCatalogo_('ROL-CONDUCTOR', moduleName, action, 'SI');
    });
  });

  asegurarPermisoCatalogo_('ROL-SUPERVISOR', 'OFICINA_VIRTUAL', 'LEER', 'SI');
  asegurarPermisoCatalogo_('ROL-SUPERVISOR', 'OFICINA_VIRTUAL', 'CREAR', 'SI');
  asegurarPermisoCatalogo_('ROL-SUPERVISOR', 'OFICINA_VIRTUAL', 'ACTUALIZAR', 'NO');
  asegurarPermisoCatalogo_('ROL-SUPERVISOR', 'OFICINA_VIRTUAL', 'ELIMINAR', 'NO');
  asegurarPermisoCatalogo_('ROL-CONDUCTOR', 'OFICINA_VIRTUAL', 'LEER', 'SI');
  asegurarPermisoCatalogo_('ROL-CONDUCTOR', 'OFICINA_VIRTUAL', 'CREAR', 'SI');
  asegurarPermisoCatalogo_('ROL-CONDUCTOR', 'OFICINA_VIRTUAL', 'ACTUALIZAR', 'NO');
  asegurarPermisoCatalogo_('ROL-CONDUCTOR', 'OFICINA_VIRTUAL', 'ELIMINAR', 'NO');

  // La lectura del panel de conexiones no pertenece a Supervisor ni Conductor.
  // Ambos conservan solo los permisos técnicos necesarios para reportar su propia presencia.
  actions.forEach(function(action) {
    const permitidoTecnico = ['CREAR','ACTUALIZAR'].indexOf(action) >= 0 ? 'SI' : 'NO';
    asegurarPermisoCatalogo_('ROL-SUPERVISOR', 'CONEXIONES', action, permitidoTecnico);
    asegurarPermisoCatalogo_('ROL-CONDUCTOR', 'CONEXIONES', action, permitidoTecnico);
  });
}

function asegurarRol_(id, nombre, descripcion) {
  if (!obtenerRegistro_('ROLES', id)) {
    insertarRegistro_('ROLES', { ID:id, NOMBRE:nombre, DESCRIPCION:descripcion, ESTADO:'Activo', ELIMINADO:'NO' }, 'ROL');
  }
}

function asegurarPermisoCatalogo_(rolId, modulo, accion, permitido) {
  const existing = listarRegistros_('PERMISOS', {}).find(function(row) {
    return row.ROL_ID === rolId && row.MODULO === modulo && row.ACCION === accion;
  });
  if (!existing) {
    insertarRegistro_('PERMISOS', { ROL_ID:rolId, MODULO:modulo, ACCION:accion, PERMITIDO:permitido, ELIMINADO:'NO' }, 'PER');
  } else if (String(existing.PERMITIDO || 'NO') !== String(permitido || 'NO') || String(existing.ELIMINADO || 'NO') === 'SI') {
    actualizarRegistro_('PERMISOS', existing.ID, { PERMITIDO:permitido, ELIMINADO:'NO' });
  }
}

function limpiarDatosOperativosServicio_(request, session) {
  exigirPermiso_(session.user, 'CONFIGURACION', 'ELIMINAR');
  if (String(request.confirmacion || '') !== 'LIMPIAR DATOS') throw new Error('CONFIRMACION_REQUERIDA');
  PropertiesService.getScriptProperties().deleteProperty('GPS_ACTUAL_MIGRADO_' + VERSION_APLICACION);
  ['VEHICULOS','CONDUCTORES','OPERACIONES','CHECKINS','GPS','GPS_ACTUAL','HISTORIAL','MANTENCIONES','CARGAS_COMBUSTIBLE','AUTORIZACIONES_ELIMINACION_COMBUSTIBLE','DOCUMENTOS','ALERTAS','REPORTES','BITACORA','QR','RUTAS','NOTIFICACIONES','CONEXIONES','CONEXIONES_ACTUAL'].forEach(limpiarHojaDatos_);
  registrarBitacora_(session.user, 'LIMPIAR', 'CONFIGURACION', '', 'Datos operativos eliminados; usuarios y empresa conservados');
  return ok_({ cleared: true });
}

/** ============================================================
 * ARCHIVO: 10_Usuarios.gs
 * ============================================================ */
/** Módulo Usuarios. Las operaciones CRUD se enrutan mediante create/update/list/delete. */
function listarUsuarios_(session) {
  exigirPermiso_(session.user, 'USUARIOS', 'LEER');
  return listarRegistros_('USUARIOS', {}).map(usuarioPublico_);
}

/** ============================================================
 * ARCHIVO: 11_Vehiculos.gs
 * ============================================================ */
/** Módulo Vehículos. */
function extraerCodigoQrVehiculo_(contenido) {
  let codigo=String(contenido||'').trim();
  if(!codigo)return '';
  try {
    const json=JSON.parse(codigo);
    codigo=String(json.CODIGO||json.codigo||json.QR_CODIGO||json.qrCodigo||json.qr||json.VEHICULO||json.vehiculo||json.PATENTE||json.patente||codigo).trim();
  } catch (_) {}
  const parametro=codigo.match(/[?&#](?:codigo|qr|qr_codigo|vehiculo|patente)=([^&#]+)/i);
  if(parametro)try{codigo=decodeURIComponent(parametro[1].replace(/\+/g,' '));}catch(_){codigo=parametro[1];}
  codigo=codigo.replace(/^(?:QR|CODIGO|VEHICULO|PATENTE)\s*[:=]\s*/i,'').trim();
  return codigo;
}

function obtenerVehiculoPorQr_(code) {
  const extracted=extraerCodigoQrVehiculo_(code);
  const normalized = String(extracted || '').trim().toUpperCase();
  const comparable=normalized.replace(/[^A-Z0-9]/g, '');
  return listarRegistros_('VEHICULOS', {}).find(function(row) {
    const qr=String(row.QR_CODIGO||'').trim().toUpperCase();
    const patente=String(row.PATENTE||'').trim().toUpperCase();
    return qr===normalized||qr.replace(/[^A-Z0-9]/g,'')===comparable||patente.replace(/[^A-Z0-9]/g,'')===comparable;
  }) || null;
}

function normalizarContextoQrVehiculo_(value) {
  const context = String(value || 'vehiculo-operacion').trim().toLowerCase();
  return ['vehiculo-operacion','combustible','checkin'].indexOf(context) >= 0 ? context : 'vehiculo-operacion';
}

function consumirAutorizacionQr_(authorization, session, vehicleId, context, required) {
  const token = String(authorization || '').trim();
  if (!token && !required) return false;
  const cacheKey = token ? 'qr_aut_' + cifrarFichaSesion_(token) : '';
  const saved = cacheKey ? CacheService.getScriptCache().get(cacheKey) : '';
  let authorized = null;
  try { authorized = saved ? JSON.parse(saved) : null; } catch (error) { authorized = null; }
  const expectedContext = normalizarContextoQrVehiculo_(context);
  const savedContext = normalizarContextoQrVehiculo_(authorized && authorized.CONTEXTO);
  if (!authorized ||
      String(authorized.USUARIO_ID || '') !== String(session.user.ID || '') ||
      String(authorized.VEHICULO_ID || '') !== String(vehicleId || '') ||
      savedContext !== expectedContext) {
    throw new Error('AUTORIZACION_QR_INVALIDA');
  }
  CacheService.getScriptCache().remove(cacheKey);
  return true;
}

function validarQrVehiculo_(request, session) {
  exigirPermiso_(session.user, 'QR', 'LEER');
  const context = normalizarContextoQrVehiculo_(request.contexto || request.CONTEXTO || '');
  if (context === 'combustible') exigirPermiso_(session.user, 'COMBUSTIBLE', 'CREAR');
  else if (context === 'checkin') exigirPermiso_(session.user, 'CHECKIN', 'CREAR');
  else exigirPermiso_(session.user, 'OPERACIONES', 'CREAR');
  const code = extraerCodigoQrVehiculo_(request.codigo || request.CODIGO || '');
  if (!code) throw new Error('CODIGO_QR_REQUERIDO');
  const vehicle = obtenerVehiculoPorQr_(code);
  if (!vehicle) throw new Error('QR_NO_RECONOCIDO');
  if (context === 'combustible') {
    if (vehicle.ESTADO === 'Inactivo') throw new Error('VEHICULO_NO_DISPONIBLE');
    if (!esAdministradorSistema_(session.user)) {
      const ownDriver = session.user.ROL_ID === 'ROL-CONDUCTOR' ? obtenerConductorDeUsuario_(session.user.ID) : null;
      if (session.user.ROL_ID === 'ROL-CONDUCTOR' && !ownDriver) throw new Error('CONDUCTOR_NO_ASOCIADO');
      const activeOperation = listarRegistros_('OPERACIONES', {}).some(function(row) {
        return row.VEHICULO_ID === vehicle.ID && row.ESTADO === 'Activa' && (!ownDriver || row.CONDUCTOR_ID === ownDriver.ID);
      });
      const activeRoute = listarRegistros_('RUTAS', {}).some(function(row) {
        return row.VEHICULO_ID === vehicle.ID && ['Asignada','En curso'].indexOf(row.ESTADO) >= 0 && (!ownDriver || row.CONDUCTOR_ID === ownDriver.ID);
      });
      if (!activeOperation && !activeRoute) throw new Error('COMBUSTIBLE_ASIGNACION_ACTIVA_REQUERIDA');
    }
  } else if (vehicle.ESTADO !== 'Disponible') {
    throw new Error('VEHICULO_NO_DISPONIBLE');
  }
  const qr = listarRegistros_('QR', {}).find(function(row) {
    return row.CODIGO === vehicle.QR_CODIGO || row.REGISTRO_ID === vehicle.ID;
  });
  if (qr) {
    actualizarRegistro_('QR', qr.ID, {
      FECHA_ULTIMO_USO: new Date(),
      USOS: Number(qr.USOS || 0) + 1,
    });
  }
  const authorization = crearToken_();
  CacheService.getScriptCache().put(
    'qr_aut_' + cifrarFichaSesion_(authorization),
    JSON.stringify({ USUARIO_ID:session.user.ID, VEHICULO_ID:vehicle.ID, CONTEXTO:context }),
    300
  );
  const detail = context === 'combustible'
    ? 'Vehículo validado para carga de combustible: '
    : context === 'checkin'
      ? 'Vehículo validado para check-in: '
      : 'Vehículo validado para operación: ';
  registrarBitacora_(session.user, 'VALIDAR', 'QR', vehicle.ID, detail + vehicle.PATENTE);
  return ok_({ row: limpiarSalidaRecurso_('VEHICULOS', vehicle), autorizacionQr:authorization, validaPorSegundos:300, contexto:context });
}

/** ============================================================
 * ARCHIVO: 12_Conductores.gs
 * ============================================================ */
/** Módulo Conductores. */
function obtenerConductorDeUsuario_(userId) {
  return listarRegistros_('CONDUCTORES', {}).find(function(row) { return row.USUARIO_ID === userId; }) || null;
}

/** ============================================================
 * ARCHIVO: 13_Operaciones.gs
 * ============================================================ */
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
  if (!session || !session.user || !esAdministradorSistema_(session.user)) throw new Error('SOLO_ADMINISTRADOR');
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
  // Al iniciar, la ubicación se captura y audita sin bloquear por geocerca o precisión.
  // La validación estricta de retorno a base continúa aplicándose al finalizar.
  if (phase === 'FIN' && !result.DENTRO_PERIMETRO) throw new Error('FUERA_DEL_PUNTO_DE_FINALIZACION');
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


/**
 * Lectura liviana del módulo Operaciones.
 * Solo consulta las columnas necesarias para listar, editar, iniciar y cerrar,
 * evitando recorrer todas las evidencias GPS de cada operación histórica.
 */
function listarOperacionesCompactas_() {
  const sheet = obtenerHoja_('OPERACIONES');
  const allHeaders = ESQUEMAS_APLICACION.OPERACIONES;
  const compactColumnCount = Math.min(27, allHeaders.length);
  const headers = allHeaders.slice(0, compactColumnCount);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, compactColumnCount).getValues();
  return values.filter(function(row) {
    return row.some(function(value) { return value !== '' && value !== null; });
  }).map(function(row) {
    const object = {};
    headers.forEach(function(header, index) { object[header] = serializarValor_(row[index]); });
    return object;
  }).filter(function(row) {
    return String(row.ELIMINADO || 'NO') !== 'SI';
  });
}

/**
 * Carga compacta del módulo Operaciones.
 * Devuelve todas las operaciones activas y solo el historial reciente.
 * Incluye además los vehículos y conductores disponibles y las rutas vigentes,
 * para que el formulario pueda iniciar una operación sin consultas adicionales.
 */
function resumenOperacionesRapido_(request, session) {
  exigirPermiso_(session.user, 'OPERACIONES', 'LEER');
  const startedAt = Date.now();
  const requested = Number((request && (request.limite || request.limit)) || CONFIGURACION_APLICACION.MAXIMO_HISTORIAL_OPERACIONES_RAPIDO || 80);
  const historyLimit = Math.min(300, Math.max(20, Math.round(isFinite(requested) ? requested : 80)));

  const visibleOperations = filtrarPorUsuario_('OPERACIONES', listarOperacionesCompactas_(), session.user);
  const operationTime = function(row) {
    const value = row.FECHA_INICIO || row.CREADO_EN || row.ACTUALIZADO_EN || 0;
    const time = new Date(value).getTime();
    return isNaN(time) ? 0 : time;
  };
  const ordered = visibleOperations.slice().sort(function(a, b) { return operationTime(b) - operationTime(a); });
  const active = ordered.filter(function(row) { return String(row.ESTADO || '') === 'Activa'; });
  const recentClosed = ordered.filter(function(row) { return String(row.ESTADO || '') !== 'Activa'; }).slice(0, historyLimit);

  const selectedMap = {};
  active.concat(recentClosed).forEach(function(row) { selectedMap[String(row.ID)] = row; });
  const selected = Object.keys(selectedMap).map(function(id) { return selectedMap[id]; }).sort(function(a, b) {
    if (String(a.ESTADO || '') === 'Activa' && String(b.ESTADO || '') !== 'Activa') return -1;
    if (String(a.ESTADO || '') !== 'Activa' && String(b.ESTADO || '') === 'Activa') return 1;
    return operationTime(b) - operationTime(a);
  });

  const vehicleIds = {};
  const driverIds = {};
  const routeIds = {};
  selected.forEach(function(row) {
    if (row.VEHICULO_ID) vehicleIds[String(row.VEHICULO_ID)] = true;
    if (row.CONDUCTOR_ID) driverIds[String(row.CONDUCTOR_ID)] = true;
    if (row.RUTA_ID) routeIds[String(row.RUTA_ID)] = true;
  });

  const visibleVehicles = filtrarPorUsuario_('VEHICULOS', listarRegistros_('VEHICULOS', {}), session.user);
  const visibleDrivers = filtrarPorUsuario_('CONDUCTORES', listarRegistros_('CONDUCTORES', {}), session.user);
  const visibleRoutes = filtrarPorUsuario_('RUTAS', listarRegistros_('RUTAS', {}), session.user);

  const vehicles = visibleVehicles.filter(function(row) {
    return String(row.ESTADO || '') === 'Disponible' || Boolean(vehicleIds[String(row.ID)]);
  });
  const drivers = visibleDrivers.filter(function(row) {
    return String(row.ESTADO || '') === 'Disponible' || Boolean(driverIds[String(row.ID)]);
  });
  const routes = visibleRoutes.filter(function(row) {
    return ['Asignada','En curso'].indexOf(String(row.ESTADO || '')) >= 0 || Boolean(routeIds[String(row.ID)]);
  });

  const company = obtenerEmpresaPrincipal_();
  const point = puntoOperacionDesdeEmpresa_(company) || obtenerRespaldoPuntoOperacion_();

  return ok_({
    operations: selected.map(function(row) { return limpiarSalidaRecurso_('OPERACIONES', row); }),
    activeOperations: active.map(function(row) { return limpiarSalidaRecurso_('OPERACIONES', row); }),
    vehicles: vehicles.map(function(row) { return limpiarSalidaRecurso_('VEHICULOS', row); }),
    drivers: drivers.map(function(row) { return limpiarSalidaRecurso_('CONDUCTORES', row); }),
    routes: routes.map(function(row) { return limpiarSalidaRecurso_('RUTAS', row); }),
    total: visibleOperations.length,
    totalActive: active.length,
    availableVehicles: vehicles.filter(function(row) { return String(row.ESTADO || '') === 'Disponible'; }).length,
    availableDrivers: drivers.filter(function(row) { return String(row.ESTADO || '') === 'Disponible'; }).length,
    availableRoutes: routes.filter(function(row) { return ['Asignada','En curso'].indexOf(String(row.ESTADO || '')) >= 0; }).length,
    historyShown: recentClosed.length,
    historyLimit: historyLimit,
    pointConfigured: Boolean(point),
    point: point || null,
    company: company ? limpiarSalidaRecurso_('EMPRESAS', company) : null,
    generatedAt: fechaIso_(),
    processingMilliseconds: Date.now() - startedAt
  });
}

function iniciarOperacion_(request, session) {
  exigirPermiso_(session.user, 'OPERACIONES', 'CREAR');
  const data = request.datos || request;
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const ownDriver = obtenerConductorDeUsuario_(session.user.ID);
    if (!ownDriver) throw new Error('CONDUCTOR_NO_ASOCIADO');
    data.CONDUCTOR_ID = ownDriver.ID;
    consumirAutorizacionQr_(data.AUTORIZACION_QR, session, data.VEHICULO_ID, 'vehiculo-operacion', true);
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
  const startOrigin = startLocation.DENTRO_PERIMETRO
    ? point.DIRECCION
    : 'Ubicación capturada ' + Number(startLocation.LATITUD).toFixed(6) + ', ' + Number(startLocation.LONGITUD).toFixed(6);
  const startValidation = startLocation.DENTRO_PERIMETRO
    ? (startLocation.PRECISION_VALIDA ? 'CAPTURADA_EN_BASE' : 'CAPTURADA_EN_BASE_PRECISION_BAJA')
    : (startLocation.PRECISION_VALIDA ? 'CAPTURADA_FUERA_BASE' : 'CAPTURADA_FUERA_BASE_PRECISION_BAJA');

  const operation = insertarRegistro_('OPERACIONES', {
    VEHICULO_ID: vehicle.ID,
    CONDUCTOR_ID: driver.ID,
    ORIGEN: startOrigin,
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
    VALIDACION_INICIO: startValidation
  }, 'OPE');
  actualizarRegistro_('VEHICULOS', vehicle.ID, { ESTADO:'En ruta' });
  actualizarRegistro_('CONDUCTORES', driver.ID, { ESTADO:'En viaje' });
  consumirCheckinOperacion_(checkin.ID, operation.ID);
  let routeUpdated = null;
  if (route) {
    routeUpdated = actualizarRegistro_('RUTAS', route.ID, {
      OPERACION_ID: operation.ID,
      VEHICULO_ID: vehicle.ID,
      ORIGEN: startOrigin,
      ORIGEN_LATITUD: startLocation.LATITUD,
      ORIGEN_LONGITUD: startLocation.LONGITUD,
      ESTADO: 'En curso',
      FECHA_INICIO: route.FECHA_INICIO || new Date(),
      CHECKIN_ID: checkin.ID,
      GPS_SEGUIMIENTO_ACTIVO: 'SI',
      SEGUIMIENTO_INICIADO_POR: session.user.ID
    });
    guardarAsignacionGpsCache_(session.user.ID, {
      CONDUCTOR_ID:driver.ID,
      OPERACION_ID:operation.ID,
      VEHICULO_ID:vehicle.ID,
      RUTA_ID:route.ID
    });
  }
  encolarTrabajoSegundoPlano_('INICIO_OPERACION', {
    operacionId:operation.ID,
    detalle:'Operación iniciada con ubicación capturada a ' + startLocation.DISTANCIA_METROS + ' m de la base. Estado: ' + startValidation,
    usuario:resumenUsuarioSegundoPlano_(session.user),
    patente:vehicle.PATENTE || vehicle.ID,
    conductor:driver.NOMBRE || driver.ID,
    ip:normalizarIpPublica_(session.session.IP_PUBLICA || '')
  });
  return ok_({
    row: limpiarSalidaRecurso_('OPERACIONES', operation),
    route: routeUpdated ? limpiarSalidaRecurso_('RUTAS', routeUpdated) : null,
    seguimiento: route ? {
      activo:true,
      RUTA_ID:route.ID,
      OPERACION_ID:operation.ID,
      VEHICULO_ID:vehicle.ID,
      CONDUCTOR_ID:driver.ID,
      CHECKIN_ID:checkin.ID,
      FECHA_OPERATIVA:claveFechaOperativa_(checkin.FECHA_HORA || new Date())
    } : null,
    locationValidation:startLocation,
    base:point,
    procesamientoSegundoPlano:true
  });
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
      actualizarRegistro_('RUTAS', route.ID, {
        ESTADO:'Completada',
        FECHA_FIN:now,
        OPERACION_ID:operation.ID,
        GPS_SEGUIMIENTO_ACTIVO:'NO'
      });
      guardarAsignacionGpsCache_(session.user.ID, {
        CONDUCTOR_ID:operation.CONDUCTOR_ID || '',
        OPERACION_ID:operation.ID,
        VEHICULO_ID:operation.VEHICULO_ID || '',
        RUTA_ID:''
      });
    }
  }
  const historyDetail = exceptional
    ? 'Cierre excepcional autorizado fuera de base a ' + finishLocation.DISTANCIA_METROS + ' m. Motivo: ' + reason
    : (finishLocation.PRECISION_BAJA
      ? 'Operación finalizada en base con señal GPS imprecisa. Distancia calculada: ' + finishLocation.DISTANCIA_METROS + ' m; precisión ±' + finishLocation.PRECISION + ' m; tolerancia aplicada ' + finishLocation.TOLERANCIA_PRECISION_METROS + ' m.'
      : 'Operación finalizada en punto autorizado a ' + finishLocation.DISTANCIA_METROS + ' m de la base') + (kilometrajeAdvertencia ? ' ' + kilometrajeAdvertencia : '');
  const vehicleForNotification = obtenerRegistro_('VEHICULOS', operation.VEHICULO_ID) || vehicleClose || {};
  const driverForNotification = obtenerRegistro_('CONDUCTORES', operation.CONDUCTOR_ID) || {};
  const routeForNotification = operation.RUTA_ID ? obtenerRegistro_('RUTAS', operation.RUTA_ID) : null;
  encolarTrabajoSegundoPlano_('CIERRE_OPERACION', {
    operacionId:operation.ID,
    rutaId:operation.RUTA_ID || '',
    evento:exceptional ? 'FIN_EXCEPCIONAL' : (finishLocation.PRECISION_BAJA ? 'FIN_GPS_IMPRECISO' : 'FIN'),
    accionAuditoria:exceptional ? 'FINALIZAR_EXCEPCIONAL' : (finishLocation.PRECISION_BAJA ? 'FINALIZAR_GPS_IMPRECISO' : 'FINALIZAR'),
    detalle:historyDetail,
    usuario:resumenUsuarioSegundoPlano_(session.user),
    ip:ipCliente,
    excepcional:exceptional,
    precisionBaja:Boolean(finishLocation.PRECISION_BAJA),
    cierreTipo:updated.CIERRE_TIPO,
    validacion:updated.VALIDACION_FIN,
    distanciaMetros:finishLocation.DISTANCIA_METROS,
    precisionMetros:finishLocation.PRECISION,
    motivo:reason,
    observaciones:updated.OBSERVACIONES || '',
    fechaHora:fechaIso_(),
    base:{ nombre:point.NOMBRE, direccion:point.DIRECCION, latitud:point.LATITUD, longitud:point.LONGITUD },
    vehiculo:{ id:operation.VEHICULO_ID, patente:vehicleForNotification.PATENTE || operation.VEHICULO_ID },
    conductor:{ id:operation.CONDUCTOR_ID, nombre:driverForNotification.NOMBRE || operation.CONDUCTOR_ID },
    ruta:{ id:operation.RUTA_ID || '', nombre:routeForNotification ? (routeForNotification.NOMBRE || routeForNotification.ID) : '' }
  });
  return ok_({
    row: limpiarSalidaRecurso_('OPERACIONES', updated),
    locationValidation:finishLocation,
    base:point,
    cierreExcepcional:exceptional,
    procesamientoSegundoPlano:true,
    notificacionAdministradores:true,
    autorizadoPor:{ ID:session.user.ID, NOMBRE:session.user.NOMBRE, ROL_ID:role },
    seguimiento:operation.RUTA_ID ? {
      activo:false,
      RUTA_ID:operation.RUTA_ID,
      OPERACION_ID:operation.ID,
      VEHICULO_ID:operation.VEHICULO_ID || '',
      CONDUCTOR_ID:operation.CONDUCTOR_ID || ''
    } : null
  });
}

function editarOperacionAdministrativa_(request, session) {
  exigirAdministradorOperacion_(session);
  const data = request.datos || request || {};
  const operationId = request.identificador || request.OPERACION_ID || request.id;
  const operation = obtenerRegistro_('OPERACIONES', operationId);
  if (!operation) throw new Error('REGISTRO_NO_ENCONTRADO');
  const before = resumenOperacionAuditoria_(operation);
  const reason = String(data.MOTIVO_EDICION || '').trim() || 'Actualización administrativa sin motivo adicional.';

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

/** ============================================================
 * ARCHIVO: 14_GPS.gs
 * ============================================================ */
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
  const limite = Date.now() - Number(CONFIGURACION_APLICACION.MAXIMA_EDAD_UBICACION_SEGUNDOS || 180) * 1000;
  const history = listarRegistros_('GPS', {}).filter(function(row) {
    return ubicacionGpsMostrable_(row) && fechaGpsMs_(row.FECHA_HORA || row.ACTUALIZADO_EN) >= limite;
  });
  history.sort(function(a,b) { return fechaGpsMs_(b.FECHA_HORA || b.ACTUALIZADO_EN) - fechaGpsMs_(a.FECHA_HORA || a.ACTUALIZADO_EN); });
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
    const incomingTime = fechaGpsMs_(data.FECHA_HORA || data.ACTUALIZADO_EN);
    const currentTime = fechaGpsMs_(current.FECHA_HORA || current.ACTUALIZADO_EN);
    if (rowNumber >= 2 && currentTime && incomingTime && incomingTime <= currentTime) {
      const salidaActual = limpiarSalidaRecurso_('GPS_ACTUAL', current);
      salidaActual.IGNORADA_POR_ANTIGUA = 'SI';
      return salidaActual;
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

function claveCacheTiempoReal_(sheetName, perfil) {
  return 'tr_meta_' + VERSION_APLICACION + '_' + sheetName + (perfil ? '_' + perfil : '');
}

function invalidarCacheTiempoReal_(sheetName) {
  try {
    CacheService.getScriptCache().removeAll([
      claveCacheTiempoReal_(sheetName),
      claveCacheTiempoReal_(sheetName, 'RAPIDO')
    ]);
  } catch (_) {}
}

function listarRegistrosCacheadosTiempoReal_(sheetName, secondsOverride) {
  const seconds = Number(secondsOverride || CONFIGURACION_APLICACION.SEGUNDOS_CACHE_METADATOS_TIEMPO_REAL || 10);
  const perfil = Number(secondsOverride || 0) > 0 && Number(secondsOverride) <= 2 ? 'RAPIDO' : '';
  const key = claveCacheTiempoReal_(sheetName, perfil);
  const cache = CacheService.getScriptCache();
  try {
    const saved = cache.get(key);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  let rows = listarRegistros_(sheetName, {});
  if (sheetName === 'USUARIOS') rows = rows.map(function(row) {
    return { ID:row.ID, NOMBRE:row.NOMBRE, CORREO:row.CORREO, ROL_ID:row.ROL_ID, ESTADO:row.ESTADO, ELIMINADO:row.ELIMINADO };
  });
  try { cache.put(key, JSON.stringify(rows), Math.max(1, seconds)); } catch (_) {}
  return rows;
}

function filtroVehiculosTiempoReal_(request, user) {
  if (user && ['ROL-ADMIN','ROL-SUPERVISOR','ROL-CONDUCTOR'].indexOf(user.ROL_ID) < 0) return { activo:false, ids:{} };
  const raw = String(request.vehiculos || request.VEHICULOS || '').trim();
  if (!raw) return { activo:false, ids:{} };
  if (raw === '__NINGUNO__') return { activo:true, ids:{} };
  const ids = {};
  raw.split(',').map(function(value) { return value.trim(); }).filter(Boolean).forEach(function(id) { ids[id] = true; });
  return { activo:true, ids:ids };
}


function numeroGpsFinito_(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

function coordenadasGpsValidas_(latitud, longitud) {
  return Number.isFinite(Number(latitud)) && Number.isFinite(Number(longitud))
    && Number(latitud) >= -90 && Number(latitud) <= 90
    && Number(longitud) >= -180 && Number(longitud) <= 180
    && !(Math.abs(Number(latitud)) < 0.000001 && Math.abs(Number(longitud)) < 0.000001);
}

function fechaGpsMs_(valor) {
  const tiempo = new Date(valor || 0).getTime();
  return Number.isFinite(tiempo) ? tiempo : 0;
}

function calidadGps_(precision, proveedor) {
  const valor = Number(precision || 0);
  const origen = String(proveedor || '').toUpperCase();
  if (origen.indexOf('GPS') >= 0 && valor > 0 && valor <= 25) return 'ALTA';
  if (valor > 0 && valor <= 80) return 'BUENA';
  if (valor > 0 && valor <= Number(CONFIGURACION_APLICACION.PRECISION_MAPA_CONFIABLE_METROS || 250)) return 'ACEPTABLE';
  return 'BAJA';
}

function ubicacionGpsMostrable_(row) {
  if (!row || !coordenadasGpsValidas_(row.LATITUD, row.LONGITUD)) return false;
  if (String(row.ES_SIMULADA || '').toUpperCase() === 'SI') return false;
  const precision = Number(row.PRECISION_METROS || 0);
  if (!Number.isFinite(precision) || precision <= 0 || precision > Number(CONFIGURACION_APLICACION.MAXIMA_PRECISION_UBICACION_METROS || 120)) return false;
  const fecha = fechaGpsMs_(row.FECHA_HORA || row.FECHA_GPS || row.ACTUALIZADO_EN);
  if (fecha && Date.now() - fecha > Number(CONFIGURACION_APLICACION.MAXIMA_EDAD_UBICACION_SEGUNDOS || 180) * 1000) return false;
  return true;
}

function ultimaUbicacionDispositivo_(dispositivoId) {
  const id = String(dispositivoId || '').trim();
  if (!id) return null;
  let rows = [];
  try { rows = listarRegistrosCacheadosTiempoReal_('GPS_ACTUAL', 1); } catch (_) { rows = []; }
  const candidatas = rows.filter(function(row) {
    return String(row.DISPOSITIVO_ID || '') === id && ubicacionGpsMostrable_(row);
  });
  candidatas.sort(function(a,b) { return fechaGpsMs_(b.FECHA_HORA || b.ACTUALIZADO_EN) - fechaGpsMs_(a.FECHA_HORA || a.ACTUALIZADO_EN); });
  return candidatas[0] || null;
}

function normalizarUbicacionGpsEntrante_(data) {
  const latitud = numeroGpsFinito_(data.LATITUD);
  const longitud = numeroGpsFinito_(data.LONGITUD);
  if (!coordenadasGpsValidas_(latitud, longitud)) throw new Error('COORDENADAS_INVALIDAS');

  const precision = numeroGpsFinito_(data.PRECISION_METROS);
  if (precision === null || precision <= 0) throw new Error('PRECISION_GPS_REQUERIDA');
  if (precision > Number(CONFIGURACION_APLICACION.MAXIMA_PRECISION_UBICACION_METROS || 120)) {
    throw new Error('UBICACION_GPS_IMPRECISA');
  }

  const simulada = String(data.ES_SIMULADA || data.MOCK || '').toUpperCase() === 'SI';
  if (simulada) throw new Error('UBICACION_SIMULADA_RECHAZADA');

  const ahora = Date.now();
  let fechaMs = fechaGpsMs_(data.FECHA_HORA || data.TIEMPO_CAPTURA_MS);
  if (!fechaMs) fechaMs = ahora;
  const edadSegundos = Math.round((ahora - fechaMs) / 1000);
  if (edadSegundos < -120) throw new Error('FECHA_GPS_FUTURA');
  if (edadSegundos > Number(CONFIGURACION_APLICACION.MAXIMA_EDAD_UBICACION_SEGUNDOS || 180)) {
    throw new Error('UBICACION_GPS_ANTIGUA');
  }

  const proveedor = String(data.PROVEEDOR || data.PROVIDER || data.FUENTE || 'GPS').slice(0, 80);
  if (proveedor.toUpperCase().indexOf('NETWORK') >= 0 && precision > 80) {
    throw new Error('UBICACION_RED_IMPRECISA');
  }
  const anterior = ultimaUbicacionDispositivo_(data.DISPOSITIVO_ID);
  if (anterior) {
    const anteriorMs = fechaGpsMs_(anterior.FECHA_HORA || anterior.ACTUALIZADO_EN);
    if (anteriorMs && fechaMs <= anteriorMs) throw new Error('UBICACION_GPS_DESACTUALIZADA');

    const segundos = Math.max(1, (fechaMs - anteriorMs) / 1000);
    const distancia = distanciaGeograficaMetros_(latitud, longitud, Number(anterior.LATITUD), Number(anterior.LONGITUD));
    const velocidadCalculada = distancia / segundos * 3.6;
    const margen = Math.max(500, precision * 4, Number(anterior.PRECISION_METROS || 0) * 4);
    if (distancia > margen && velocidadCalculada > Number(CONFIGURACION_APLICACION.VELOCIDAD_SALTO_MAXIMA_KMH || 240)) {
      throw new Error('SALTO_GPS_INCONSISTENTE');
    }

    const anteriorProveedor = String(anterior.PROVEEDOR || anterior.FUENTE || '').toUpperCase();
    const proveedorActual = proveedor.toUpperCase();
    const anteriorEdad = Math.max(0, (ahora - anteriorMs) / 1000);
    if (proveedorActual.indexOf('NETWORK') >= 0
      && anteriorProveedor.indexOf('GPS') >= 0
      && anteriorEdad <= Number(CONFIGURACION_APLICACION.SEGUNDOS_GPS_RECIENTE_PREFERIDO || 120)
      && precision >= Number(anterior.PRECISION_METROS || 0)) {
      throw new Error('UBICACION_RED_DESCARTADA_POR_GPS_RECIENTE');
    }
  }

  return {
    LATITUD: latitud,
    LONGITUD: longitud,
    PRECISION_METROS: precision,
    FECHA_HORA: new Date(fechaMs),
    EDAD_SEGUNDOS: Math.max(0, edadSegundos),
    PROVEEDOR: proveedor,
    ES_SIMULADA: 'NO',
    CALIDAD_GPS: calidadGps_(precision, proveedor),
  };
}

function guardarUbicacion_(request, session) {
  exigirPermiso_(session.user, 'GPS', 'CREAR');
  const data = request.datos || request;
  validarRequeridos_(data, ['LATITUD','LONGITUD']);
  const ubicacionValidada = normalizarUbicacionGpsEntrante_(data);
  const latitude = ubicacionValidada.LATITUD;
  const longitude = ubicacionValidada.LONGITUD;
  let driverId = data.CONDUCTOR_ID || '';
  if (!driverId && session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const driver = obtenerConductorDeUsuario_(session.user.ID);
    if (driver) driverId = driver.ID;
  }
  let operationId = data.OPERACION_ID || '';
  let routeId = data.RUTA_ID || '';
  let vehicleId = data.VEHICULO_ID || '';
  const contextoRutaExplicito = String(data.CONTEXTO_RUTA_EXPLICITO || '') === 'SI' || Object.prototype.hasOwnProperty.call(data, 'RUTA_ID');
  const cachedAssignment = obtenerAsignacionGpsCache_(session.user.ID, driverId);
  if (cachedAssignment) {
    operationId = operationId || cachedAssignment.OPERACION_ID || '';
    if (!contextoRutaExplicito) routeId = routeId || cachedAssignment.RUTA_ID || '';
    vehicleId = vehicleId || cachedAssignment.VEHICULO_ID || '';
  }
  if (routeId) {
    const rutaActiva = obtenerRegistro_('RUTAS', routeId);
    if (!rutaActiva || String(rutaActiva.ESTADO || '') !== 'En curso' || String(rutaActiva.GPS_SEGUIMIENTO_ACTIVO || 'SI') === 'NO') routeId = '';
    else {
      driverId = driverId || rutaActiva.CONDUCTOR_ID || '';
      vehicleId = vehicleId || rutaActiva.VEHICULO_ID || '';
      operationId = operationId || rutaActiva.OPERACION_ID || '';
    }
  }
  if (!operationId && driverId) {
    const active = listarRegistros_('OPERACIONES', {}).find(function(row) {
      return row.CONDUCTOR_ID === driverId && row.ESTADO === 'Activa';
    });
    if (active) { operationId = active.ID; vehicleId = vehicleId || active.VEHICULO_ID; }
  }
  if (!routeId && driverId) {
    const activeRoute = listarRegistros_('RUTAS', {}).find(function(row) {
      return row.CONDUCTOR_ID === driverId && row.ESTADO === 'En curso' && String(row.GPS_SEGUIMIENTO_ACTIVO || 'SI') !== 'NO';
    });
    if (activeRoute) {
      routeId = activeRoute.ID;
      vehicleId = vehicleId || activeRoute.VEHICULO_ID || '';
      operationId = operationId || activeRoute.OPERACION_ID || '';
    }
  }
  const fecha = ubicacionValidada.FECHA_HORA;
  const values = {
    OPERACION_ID: operationId,
    RUTA_ID: routeId,
    CONDUCTOR_ID: driverId,
    VEHICULO_ID: vehicleId,
    LATITUD: latitude,
    LONGITUD: longitude,
    DIRECCION: data.DIRECCION || '',
    PRECISION_METROS: ubicacionValidada.PRECISION_METROS,
    VELOCIDAD_KMH: Number(data.VELOCIDAD_KMH || 0),
    RUMBO: Number(data.RUMBO || 0),
    BATERIA_PORCENTAJE: data.BATERIA_PORCENTAJE === '' ? '' : Number(data.BATERIA_PORCENTAJE || 0),
    DISPOSITIVO_ID: String(data.DISPOSITIVO_ID || ''),
    FECHA_HORA: fecha,
    FUENTE: data.FUENTE || 'GPS real',
    PROVEEDOR: ubicacionValidada.PROVEEDOR,
    EDAD_SEGUNDOS: ubicacionValidada.EDAD_SEGUNDOS,
    ES_SIMULADA: ubicacionValidada.ES_SIMULADA,
    CALIDAD_GPS: ubicacionValidada.CALIDAD_GPS,
    ELIMINADO: 'NO',
  };

  const current = guardarPosicionActual_(values);
  if (routeId) {
    try { actualizarRegistro_('RUTAS', routeId, { ULTIMA_UBICACION_EN:fecha, GPS_SEGUIMIENTO_ACTIVO:'SI' }); } catch (_) {}
  }
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
      NAVEGADOR: data.NAVEGADOR || '',
      LATITUD: latitude,
      LONGITUD: longitude,
      PRECISION_METROS: ubicacionValidada.PRECISION_METROS,
      FECHA_GPS: fecha,
      FUENTE_GPS: data.FUENTE || 'GPS real',
      PROVEEDOR_GPS: ubicacionValidada.PROVEEDOR,
      CALIDAD_GPS: ubicacionValidada.CALIDAD_GPS
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
  // Tiempo real utiliza únicamente posiciones actuales validadas; el historial no se reutiliza como ubicación vigente.
  rows = filtrarPorUsuario_('GPS_ACTUAL', rows, session.user).filter(ubicacionGpsMostrable_);
  rows.sort(function(a,b) { return new Date(b.FECHA_HORA).getTime() - new Date(a.FECHA_HORA).getTime(); });

  const drivers = listarRegistrosCacheadosTiempoReal_('CONDUCTORES');
  const visibleDrivers = filtrarPorUsuario_('CONDUCTORES', drivers, session.user);
  const allVehicles = listarRegistrosCacheadosTiempoReal_('VEHICULOS');
  const visibleVehicles = filtrarPorUsuario_('VEHICULOS', allVehicles, session.user);
  const vehicleFilter = filtroVehiculosTiempoReal_(request, session.user);
  const filtrosGps = filtrosGpsTiempoReal_(request);
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
    return (!vehicleFilter.activo || Boolean(vehicleFilter.ids[row.VEHICULO_ID])) && coincideFiltrosGpsUbicacion_(row, filtrosGps);
  }).slice(0, filtrosGps.limitePuntos);

  return ok_({
    rows: output,
    total: output.length,
    trackingDrivers: visibleDrivers.map(function(driver) {
      return { ID:driver.ID, NOMBRE:driver.NOMBRE || driver.ID };
    }).sort(function(a,b) { return String(a.NOMBRE).localeCompare(String(b.NOMBRE)); }),
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

function claveCacheDireccion_(latitude, longitude) {
  return 'direccion_' + Number(latitude).toFixed(5) + '_' + Number(longitude).toFixed(5);
}

function obtenerDireccionCoordenadasCache_(latitude, longitude, permitirConsulta) {
  const key = claveCacheDireccion_(latitude, longitude);
  const cache = CacheService.getScriptCache();
  const saved = cache.get(key);
  if (saved) return saved;
  if (!permitirConsulta) return '';
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

function obtenerDireccionCoordenadas_(latitude, longitude) {
  return obtenerDireccionCoordenadasCache_(latitude, longitude, true);
}

function direccionSoloCoordenadas_(value) {
  const text = String(value || '').trim();
  if (!text) return true;
  return /^-?\d{1,3}(?:\.\d+)?\s*,\s*-?\d{1,3}(?:\.\d+)?$/.test(text);
}

/** ============================================================
 * ARCHIVO: 15_Mantenciones.gs
 * ============================================================ */
/** Módulo de mantenciones. */
function mantencionesAbiertas_() {
  return listarRegistros_('MANTENCIONES', {}).filter(function(row) {
    return ['Programada','En proceso','Atrasada'].indexOf(row.ESTADO) >= 0;
  });
}

/** ============================================================
 * ARCHIVO: 15B_Archivos_Drive.gs
 * ============================================================ */
/** Carga rápida y segura de archivos en las carpetas configuradas de Google Drive. */
function subirArchivoDrive_(request, session) {
  const data = request.datos || {};
  const destino = String(data.DESTINO || '').trim().toUpperCase();
  const destinos = {
    DOCUMENTO_FOTO:{folderId:CONFIGURACION_APLICACION.ID_CARPETA_DOCUMENTOS_FOTOS,module:'DOCUMENTOS',mime:/^image\//i,label:'Fotos de documentos'},
    DOCUMENTO_PDF:{folderId:CONFIGURACION_APLICACION.ID_CARPETA_DOCUMENTOS_PDF,module:'DOCUMENTOS',mime:/^application\/pdf$/i,label:'PDF de documentos'},
    BOLETA_COMBUSTIBLE:{folderId:CONFIGURACION_APLICACION.ID_CARPETA_BOLETAS_COMBUSTIBLE,module:'COMBUSTIBLE',mime:/^image\//i,label:'Boletas de combustible'},
    RUTA_EVIDENCIA:{folderId:CONFIGURACION_APLICACION.ID_CARPETA_EVIDENCIAS_RUTA,module:'RUTAS',mime:/^image\//i,label:'Evidencias fotográficas de rutas'}
  };
  const configDestino=destinos[destino];
  if(!configDestino)throw new Error('DESTINO_ARCHIVO_INVALIDO');
  if(configDestino.module==='DOCUMENTOS'&&session.user.ROL_ID==='ROL-CONDUCTOR'&&!tienePermiso_(session.user,'DOCUMENTOS','CREAR'))throw new Error('CARGA_DOCUMENTOS_BLOQUEADA_ADMIN');
  if(!tienePermiso_(session.user,configDestino.module,'CREAR')&&!tienePermiso_(session.user,configDestino.module,'ACTUALIZAR'))throw new Error('PERMISO_DENEGADO');
  let base64=String(data.ARCHIVO_BASE64||'').trim(),tipoMime=String(data.TIPO_MIME||'').trim().toLowerCase();
  const match=base64.match(/^data:([^;,]+);base64,(.+)$/s);if(match){tipoMime=String(match[1]||tipoMime).toLowerCase();base64=match[2];}
  if(!base64)throw new Error('ARCHIVO_REQUERIDO');if(!tipoMime||!configDestino.mime.test(tipoMime))throw new Error('FORMATO_ARCHIVO_DRIVE_INVALIDO');
  let bytes;try{bytes=Utilities.base64Decode(base64);}catch(error){throw new Error('ARCHIVO_BASE64_INVALIDO');}
  if(!bytes||!bytes.length)throw new Error('ARCHIVO_REQUERIDO');if(bytes.length>Number(CONFIGURACION_APLICACION.MAXIMO_ARCHIVO_DRIVE_BYTES||12582912))throw new Error('ARCHIVO_DRIVE_DEMASIADO_GRANDE');
  const clean=function(value,max){return String(value||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._ -]+/g,'_').replace(/\s+/g,' ').slice(0,max);};
  const original=clean(data.NOMBRE_ARCHIVO||'archivo',120)||'archivo',contexto=clean(data.CONTEXTO||'',60),sello=Utilities.formatDate(new Date(),CONFIGURACION_APLICACION.ZONA_HORARIA,'yyyyMMdd_HHmmss'),nombreFinal=(contexto?contexto+' - ':'')+sello+' - '+original;
  let folder;try{folder=DriveApp.getFolderById(configDestino.folderId);}catch(error){throw new Error('CARPETA_DRIVE_NO_DISPONIBLE');}
  const file=folder.createFile(Utilities.newBlob(bytes,tipoMime,nombreFinal));
  file.setDescription('Cargado desde el Sistema de Gestión de Flotas por '+session.user.NOMBRE+' ('+session.user.CORREO+'). Destino: '+configDestino.label+'.');
  registrarBitacora_(session.user,'SUBIR_ARCHIVO',configDestino.module,file.getId(),'Archivo cargado en '+configDestino.label+': '+nombreFinal+'. Tamaño: '+bytes.length+' bytes.',String(data.IP_PUBLICA||''));
  return ok_({id:file.getId(),nombre:file.getName(),tipoMime:file.getMimeType(),tamanoBytes:bytes.length,url:file.getUrl(),carpetaId:configDestino.folderId,destino:destino});
}

/** ============================================================
 * ARCHIVO: 16_Documentos.gs
 * ============================================================ */
/** Módulo de documentos y vencimientos. */
function actualizarEstadosDocumentos_() {
  const today = new Date();
  const warning = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  listarRegistros_('DOCUMENTOS', {}).forEach(function(row) {
    if (['Pendiente de revisión','Rechazado','Anulado'].indexOf(String(row.ESTADO || '')) >= 0) return;
    if (!row.FECHA_VENCIMIENTO) return;
    const expiry = new Date(row.FECHA_VENCIMIENTO);
    const status = expiry < today ? 'Vencido' : expiry <= warning ? 'Por vencer' : 'Vigente';
    if (row.ESTADO !== status) actualizarRegistro_('DOCUMENTOS', row.ID, { ESTADO:status });
  });
}

/** ============================================================
 * ARCHIVO: 17_Alertas.gs
 * ============================================================ */
/** Módulo de alertas automáticas, anomalías y mantenciones. */
function huellaEvento_(prefijo, partes) {
  const texto = String(prefijo || 'EVENTO') + '|' + (Array.isArray(partes) ? partes : [partes]).map(function(valor) {
    return String(valor == null ? '' : valor).trim().toUpperCase().replace(/\s+/g, ' ');
  }).join('|');
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, texto, Utilities.Charset.UTF_8);
  return String(prefijo || 'EVENTO').toUpperCase() + '-' + bytes.map(function(byte) {
    const valor = byte < 0 ? byte + 256 : byte;
    return ('0' + valor.toString(16)).slice(-2);
  }).join('').toUpperCase();
}

function claveAlertaUnica_(data) {
  return String(data.CLAVE_UNICA || '').trim() || huellaEvento_('ALT', [
    data.TIPO || 'Sistema', data.MODULO || 'Sistema', data.REGISTRO_ID || '', data.TITULO || 'Alerta'
  ]);
}

function crearAlerta_(data){
  return insertarRegistro_('ALERTAS',{
    TIPO:data.TIPO||'Sistema',NIVEL:data.NIVEL||'Info',TITULO:data.TITULO||'Alerta',MENSAJE:data.MENSAJE||'',
    MODULO:data.MODULO||'',REGISTRO_ID:data.REGISTRO_ID||'',CLAVE_UNICA:claveAlertaUnica_(data),LEIDA:'NO',
    USUARIO_ID:data.USUARIO_ID||'',FECHA_HORA:new Date(),ELIMINADO:'NO'
  },'ALT');
}

function crearAlertaUnica_(data){
  const lock=LockService.getScriptLock(),lockYaAdquirido=lock.hasLock(),clave=claveAlertaUnica_(data);
  const type=String(data.TIPO||'Sistema'),moduleName=String(data.MODULO||'Sistema'),recordId=String(data.REGISTRO_ID||''),title=String(data.TITULO||'Alerta');
  let alert=null,created=false;
  try {
    if(!lockYaAdquirido)lock.waitLock(10000);
    const existing=listarRegistros_('ALERTAS',{}).find(function(row){
      if(String(row.ELIMINADO||'NO')==='SI')return false;
      const mismaClave=String(row.CLAVE_UNICA||'')===clave;
      const mismoEvento=Boolean(recordId)&&String(row.TIPO||'')===type&&String(row.MODULO||'')===moduleName&&String(row.REGISTRO_ID||'')===recordId&&String(row.USUARIO_ID||'')===String(data.USUARIO_ID||'');
      const legado=!row.CLAVE_UNICA&&String(row.TIPO||'')===type&&String(row.MODULO||'')===moduleName&&String(row.REGISTRO_ID||'')===recordId&&String(row.TITULO||'')===title;
      return mismaClave||mismoEvento||legado;
    });
    if(existing){
      const changes={};
      if(String(existing.CLAVE_UNICA||'')!==clave)changes.CLAVE_UNICA=clave;
      if(String(existing.NIVEL||'')!==String(data.NIVEL||'Info'))changes.NIVEL=data.NIVEL||'Info';
      if(String(existing.TITULO||'')!==title)changes.TITULO=title;
      if(String(existing.MENSAJE||'')!==String(data.MENSAJE||''))changes.MENSAJE=data.MENSAJE||'';
      if(String(existing.USUARIO_ID||'')!==String(data.USUARIO_ID||''))changes.USUARIO_ID=data.USUARIO_ID||'';
      const actualizado=Object.keys(changes).length?actualizarRegistro_('ALERTAS',existing.ID,changes):existing;
      return{row:actualizado,created:false,updated:Object.keys(changes).length>0};
    }
    alert=crearAlerta_(Object.assign({},data,{CLAVE_UNICA:clave}));
    created=true;
  } finally {
    if(!lockYaAdquirido)try{lock.releaseLock();}catch(_){ }
  }
  // Una alerta ya aparece en el centro de avisos y en el módulo Alertas.
  // No se crea otra NOTIFICACION espejo porque eso duplicaba el mismo evento.
  return{row:alert,created:created};
}
function diasHasta_(value,now){if(!value)return null;const date=new Date(value);if(isNaN(date.getTime()))return null;return Math.ceil((date.getTime()-now.getTime())/86400000);}
function ejecutarMotorAlertasAutomaticas_(options){
  const opts=options||{},cache=CacheService.getScriptCache();if(!opts.force&&cache.get('MOTOR_ALERTAS_EJECUTANDO')==='SI')return{creadas:0,omitida:true};cache.put('MOTOR_ALERTAS_EJECUTANDO','SI',45);
  const lock=LockService.getScriptLock();if(!lock.tryLock(3000))return{creadas:0,omitida:true};let created=0;
  try{
    const now=new Date(),maintenanceDays=Number(CONFIGURACION_APLICACION.DIAS_AVISO_MANTENCION||7),documentDays=Number(CONFIGURACION_APLICACION.DIAS_AVISO_DOCUMENTO||30),minutesWithoutGps=Number(CONFIGURACION_APLICACION.MINUTOS_SIN_GPS_ALERTA||5),precisionLimit=Number(CONFIGURACION_APLICACION.METROS_PRECISION_GPS_ALERTA||150),vehicles=listarRegistros_('VEHICULOS',{}),vehicleMap={};vehicles.forEach(function(row){vehicleMap[row.ID]=row;});
    listarRegistros_('MANTENCIONES',{}).forEach(function(row){if(['Realizada','Cancelada'].indexOf(String(row.ESTADO||''))>=0)return;const days=diasHasta_(row.FECHA_PROGRAMADA,now);if(days===null)return;const vehicle=vehicleMap[row.VEHICULO_ID]||{},label=vehicle.PATENTE||row.VEHICULO_ID||'Equipo';if(days<0){if(row.ESTADO!=='Atrasada')actualizarRegistro_('MANTENCIONES',row.ID,{ESTADO:'Atrasada'});if(crearAlertaUnica_({TIPO:'Mantención',NIVEL:'Crítica',TITULO:'Mantención atrasada',MENSAJE:label+' tiene la mantención "'+(row.TITULO||row.TIPO||row.ID)+'" atrasada por '+Math.abs(days)+' día(s).',MODULO:'MANTENCIONES',REGISTRO_ID:row.ID}).created)created++;}else if(days<=maintenanceDays){if(crearAlertaUnica_({TIPO:'Mantención',NIVEL:days<=2?'Crítica':'Advertencia',TITULO:'Mantención próxima',MENSAJE:label+' requiere "'+(row.TITULO||row.TIPO||row.ID)+'" en '+days+' día(s).',MODULO:'MANTENCIONES',REGISTRO_ID:row.ID}).created)created++;}});
    vehicles.forEach(function(row){const days=diasHasta_(row.PROXIMA_MANTENCION,now);if(days===null||days>maintenanceDays)return;if(crearAlertaUnica_({TIPO:'Mantención',NIVEL:days<0?'Crítica':'Advertencia',TITULO:days<0?'Equipo con mantención vencida':'Equipo próximo a mantención',MENSAJE:(row.PATENTE||row.ID)+(days<0?' superó la fecha de próxima mantención por '+Math.abs(days)+' día(s).':' debe entrar a mantención en '+days+' día(s).'),MODULO:'VEHICULOS',REGISTRO_ID:row.ID}).created)created++;});
    // Los vencimientos documentales se entregan como una única tarea personal
    // mediante Oficina Virtual. No se crea una segunda alerta global.
    actualizarEstadosDocumentos_();
    listarRegistros_('CHECKINS',{}).forEach(function(row){if(row.ESTADO_REVISION!=='Bloqueado'&&Number(row.FALLAS_CRITICAS||0)<=0)return;if(crearAlertaUnica_({TIPO:'Check-in',NIVEL:'Crítica',TITULO:'Vehículo bloqueado por inspección',MENSAJE:'El check-in '+row.ID+' registra '+Number(row.FALLAS_CRITICAS||0)+' falla(s) crítica(s).',MODULO:'CHECKIN',REGISTRO_ID:row.ID,USUARIO_ID:row.CREADO_POR||''}).created)created++;});
    const gpsRows=listarRegistros_('GPS_ACTUAL',{}),activeOperations=listarRegistros_('OPERACIONES',{}).filter(function(row){return row.ESTADO==='Activa';});
    activeOperations.forEach(function(operation){const gps=gpsRows.filter(function(row){return(operation.ID&&row.OPERACION_ID===operation.ID)||(operation.VEHICULO_ID&&row.VEHICULO_ID===operation.VEHICULO_ID)||(operation.CONDUCTOR_ID&&row.CONDUCTOR_ID===operation.CONDUCTOR_ID);}).sort(function(a,b){return new Date(b.FECHA_HORA||0)-new Date(a.FECHA_HORA||0);})[0],ageMinutes=gps?(now.getTime()-new Date(gps.FECHA_HORA||0).getTime())/60000:Infinity;if(!gps||!isFinite(ageMinutes)||ageMinutes>=minutesWithoutGps){if(crearAlertaUnica_({TIPO:'GPS',NIVEL:'Crítica',TITULO:'Operación activa sin ubicación reciente',MENSAJE:'La operación '+operation.ID+' no registra una ubicación válida desde hace '+(isFinite(ageMinutes)?Math.floor(ageMinutes)+' minutos':'varios minutos')+'.',MODULO:'GPS',REGISTRO_ID:operation.ID,USUARIO_ID:operation.CREADO_POR||''}).created)created++;}else if(Number(gps.PRECISION_METROS||0)>precisionLimit){if(crearAlertaUnica_({TIPO:'GPS',NIVEL:'Advertencia',TITULO:'Señal GPS con baja precisión',MENSAJE:'La operación '+operation.ID+' reporta una precisión aproximada de ±'+Math.round(Number(gps.PRECISION_METROS||0))+' metros.',MODULO:'GPS',REGISTRO_ID:operation.ID,USUARIO_ID:operation.CREADO_POR||''}).created)created++;}});
    return{creadas:created,revisadas:{mantenciones:listarRegistros_('MANTENCIONES',{}).length,vehiculos:vehicles.length,documentos:listarRegistros_('DOCUMENTOS',{}).length,operaciones:activeOperations.length}};
  }finally{lock.releaseLock();}
}
function solicitarRevisionAlertasSegundoPlano_(motivo){
  const cache=CacheService.getScriptCache(),clave='MOTOR_ALERTAS_EN_COLA';
  if(cache.get(clave)==='SI')return false;
  cache.put(clave,'SI',60);
  encolarTrabajoSegundoPlano_('MOTOR_ALERTAS',{motivo:String(motivo||'Evento del sistema'),solicitadoEn:fechaIso_()});
  return true;
}
function ejecutarAlertasAutomaticasServicio_(request,session){exigirPermiso_(session.user,'ALERTAS','LEER');const result=ejecutarMotorAlertasAutomaticas_({force:true});registrarBitacora_(session.user,'EJECUTAR_MOTOR','ALERTAS','','Motor automático ejecutado. Alertas creadas: '+Number(result.creadas||0));return ok_(result);}
function procesarAlertasAutomaticasProgramadas_(){return ejecutarMotorAlertasAutomaticas_({force:true});}
function depurarDuplicadosAvisos_(){
  function texto_(value){return String(value==null?'':value).trim().toUpperCase().replace(/\s+/g,' ');}
  function fechaMs_(row,campo){const ms=new Date(row[campo]||row.CREADO_EN||0).getTime();return isFinite(ms)?ms:0;}
  function firma_(hoja,row){
    if(hoja==='ALERTAS'&&texto_(row.REGISTRO_ID||'')){
      return ['ALT-EVENTO',row.TIPO,row.MODULO,row.REGISTRO_ID,row.USUARIO_ID].map(texto_).join('|');
    }
    const clave=texto_(row.CLAVE_UNICA||'');
    if(clave){
      if(hoja==='NOTIFICACIONES')return ['CLAVE',clave,row.DESTINATARIO_USUARIO_ID,row.DESTINATARIO_CONDUCTOR_ID].map(texto_).join('|');
      return 'CLAVE|'+clave;
    }
    if(hoja==='ALERTAS')return ['ALT',row.TIPO,row.MODULO,row.REGISTRO_ID,row.TITULO,row.MENSAJE,row.USUARIO_ID].map(texto_).join('|');
    return ['NOT',row.DESTINATARIO_USUARIO_ID,row.DESTINATARIO_CONDUCTOR_ID,row.TIPO,row.TITULO,row.MENSAJE,row.RUTA_ID,row.OPERACION_ID].map(texto_).join('|');
  }
  function depurar_(hoja,fechaCampo){
    const rows=listarRegistros_(hoja,{}).filter(function(row){return String(row.ELIMINADO||'NO')!=='SI';});
    const grupos={};
    rows.forEach(function(row){const firma=firma_(hoja,row);if(!firma)return;(grupos[firma]||(grupos[firma]=[])).push(row);});
    let eliminados=0,consolidados=0;
    Object.keys(grupos).forEach(function(firma){
      const grupo=grupos[firma].sort(function(a,b){return fechaMs_(b,fechaCampo)-fechaMs_(a,fechaCampo);});
      if(grupo.length<2)return;
      const principal=grupo[0];
      const leida=grupo.some(function(row){return String(row.LEIDA||'NO')==='SI';});
      const fechasLectura=grupo.map(function(row){return fechaMs_(row,'FECHA_LECTURA');}).filter(function(value){return value>0;});
      const ultimaLectura=fechasLectura.length?new Date(Math.max.apply(Math,fechasLectura)):null;
      const leidaPor=(grupo.find(function(row){return row.LEIDA_POR;})||{}).LEIDA_POR||'';
      const cambios={};
      if(leida&&String(principal.LEIDA||'NO')!=='SI')cambios.LEIDA='SI';
      if(leida&&ultimaLectura)cambios.FECHA_LECTURA=ultimaLectura;
      if(leida&&leidaPor)cambios.LEIDA_POR=leidaPor;
      if(Object.keys(cambios).length)actualizarRegistro_(hoja,principal.ID,cambios);
      grupo.slice(1).forEach(function(row){actualizarRegistro_(hoja,row.ID,{ELIMINADO:'SI'});eliminados++;});
      consolidados++;
    });
    return{eliminados:eliminados,gruposConsolidados:consolidados};
  }
  const alertas=depurar_('ALERTAS','FECHA_HORA');
  const notificaciones=depurar_('NOTIFICACIONES','FECHA_ENVIO');
  // Elimina notificaciones antiguas creadas como espejo de una alerta.
  const alertasActivas=listarRegistros_('ALERTAS',{}).filter(function(row){return String(row.ELIMINADO||'NO')!=='SI';});
  let espejosEliminados=0;
  listarRegistros_('NOTIFICACIONES',{}).filter(function(row){
    return String(row.ELIMINADO||'NO')!=='SI'&&String(row.CREADO_POR||'')==='SISTEMA'&&/^ALERTA\s*:/i.test(String(row.TITULO||''));
  }).forEach(function(notification){
    const titulo=String(notification.TITULO||'').replace(/^ALERTA\s*:\s*/i,'');
    const coincide=alertasActivas.some(function(alert){return texto_(alert.TITULO)===texto_(titulo)&&texto_(alert.MENSAJE)===texto_(notification.MENSAJE);});
    if(coincide){actualizarRegistro_('NOTIFICACIONES',notification.ID,{ELIMINADO:'SI'});espejosEliminados++;}
  });
  // Desde 3.18.1 los documentos usan una tarea personal única. Se retiran
  // únicamente las alertas globales heredadas que duplicaban ese mismo aviso.
  let alertasDocumentosHeredadas=0;
  listarRegistros_('ALERTAS',{}).filter(function(row){
    return String(row.ELIMINADO||'NO')!=='SI'
      && String(row.TIPO||'')==='Documento'
      && String(row.MODULO||'')==='DOCUMENTOS'
      && ['Documento vencido','Documento próximo a vencer'].indexOf(String(row.TITULO||''))>=0;
  }).forEach(function(row){
    actualizarRegistro_('ALERTAS',row.ID,{ELIMINADO:'SI'});
    alertasDocumentosHeredadas++;
  });
  return{alertas:alertas.eliminados+alertasDocumentosHeredadas,notificaciones:notificaciones.eliminados,gruposAlertas:alertas.gruposConsolidados,gruposNotificaciones:notificaciones.gruposConsolidados,notificacionesEspejoEliminadas:espejosEliminados,alertasDocumentosHeredadas:alertasDocumentosHeredadas};
}

function instalarActivadorAlertasAutomaticas_(){
  const handler='procesarAlertasAutomaticasProgramadas_',triggers=ScriptApp.getProjectTriggers().filter(function(trigger){return trigger.getHandlerFunction()===handler;});
  triggers.slice(1).forEach(function(trigger){try{ScriptApp.deleteTrigger(trigger);}catch(_){ }});
  if(!triggers.length)ScriptApp.newTrigger(handler).timeBased().everyMinutes(5).create();
  return true;
}

/** ============================================================
 * ARCHIVO: 18_Reportes.gs
 * ============================================================ */
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

/** ============================================================
 * ARCHIVO: 19_Auditoria.gs
 * ============================================================ */
/** Bitácora de auditoría. */
function registrarBitacora_(user, action, moduleName, recordId, detail, ipCliente) {
  try {
    insertarRegistro_('BITACORA', {
      USUARIO_ID: user && user.ID ? user.ID : '',
      USUARIO_NOMBRE: user && user.NOMBRE ? user.NOMBRE : 'Sistema',
      ACCION: action,
      MODULO: moduleName,
      REGISTRO_ID: recordId || '',
      DETALLE: detail || '',
      IP_CLIENTE: normalizarIpPublica_(ipCliente || ''),
      FECHA_HORA: new Date(),
      ELIMINADO: 'NO',
    }, 'BIT');
  } catch (error) {
    console.error('No fue posible registrar la bitácora', error);
  }
}

/** Serializa una copia recuperable para la bitácora administrativa. */
function respaldoAuditoria_(row) {
  try {
    return JSON.stringify(limpiarSalidaRecurso_('', row || {})).slice(0, 18000);
  } catch (error) {
    return String(row || '').slice(0, 18000);
  }
}

/** ============================================================
 * ARCHIVO: 20_Empresa_y_Configuracion.gs
 * ============================================================ */
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
  if (!esAdministradorSistema_(session.user)) throw new Error('PERMISO_DENEGADO');
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

  registrarBitacora_(session.user, 'ACTUALIZAR', 'CONFIGURACION', row.ID, 'Respaldo anterior: ' + respaldoAuditoria_(current || {}) + '. Datos posteriores: ' + respaldoAuditoria_(confirmed));
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

/** ============================================================
 * ARCHIVO: 21_Tiempo_Real_Rutas_y_Notificaciones.gs
 * ============================================================ */
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
    CLAVE_UNICA:'RUTA-ASIGNADA-' + route.ID
  });
  registrarBitacora_(session.user, 'ASIGNAR', 'RUTAS', route.ID, 'Ruta asignada a ' + driver.NOMBRE);
  return ok_({ row: limpiarSalidaRecurso_('RUTAS', route), notification: limpiarSalidaRecurso_('NOTIFICACIONES', notification) });
}


function extraerIdArchivoDrive_(valor) {
  const texto = String(valor || '').trim();
  if (/^[a-zA-Z0-9_-]{10,}$/.test(texto)) return texto;
  const coincidencia = texto.match(/(?:\/d\/|[?&]id=)([a-zA-Z0-9_-]{10,})/);
  return coincidencia ? coincidencia[1] : '';
}

function obtenerImagenEvidenciaRuta_(request, session) {
  const data = request.datos || {};
  const routeId = String(data.RUTA_ID || request.identificador || '').trim();
  if (!routeId) throw new Error('RUTA_REQUERIDA');
  const route = obtenerRegistro_('RUTAS', routeId);
  if (!route) throw new Error('RUTA_NO_ENCONTRADA');
  if (!filtrarPorUsuario_('RUTAS', [route], session.user).length) throw new Error('PERMISO_DENEGADO');

  let evidencias = [];
  try { evidencias = JSON.parse(String(route.EVIDENCIAS_FOTOS_CODIFICADAS || '[]')); }
  catch (_) { evidencias = []; }
  if (!Array.isArray(evidencias)) evidencias = [];
  if (route.ULTIMA_EVIDENCIA_URL) evidencias.push({ url:route.ULTIMA_EVIDENCIA_URL });

  const solicitado = extraerIdArchivoDrive_(data.ARCHIVO_ID || data.URL || '');
  const permitidos = evidencias.map(function(item) {
    return extraerIdArchivoDrive_(typeof item === 'string' ? item : (item.archivoId || item.id || item.url || ''));
  }).filter(Boolean);
  if (!solicitado || permitidos.indexOf(solicitado) < 0) throw new Error('EVIDENCIA_RUTA_NO_AUTORIZADA');

  let archivo;
  try { archivo = DriveApp.getFileById(solicitado); }
  catch (_) { throw new Error('EVIDENCIA_RUTA_NO_DISPONIBLE'); }
  const blob = archivo.getBlob();
  const mime = String(blob.getContentType() || archivo.getMimeType() || '').toLowerCase();
  if (!/^image\//.test(mime)) throw new Error('EVIDENCIA_RUTA_NO_ES_IMAGEN');
  const bytes = blob.getBytes();
  const maximo = Number(CONFIGURACION_APLICACION.MAXIMO_ARCHIVO_DRIVE_BYTES || 12582912);
  if (!bytes.length || bytes.length > maximo) throw new Error('EVIDENCIA_RUTA_DEMASIADO_GRANDE');
  return ok_({
    id: solicitado,
    nombre: archivo.getName(),
    tipoMime: mime,
    tamanoBytes: bytes.length,
    dataUrl: 'data:' + mime + ';base64,' + Utilities.base64Encode(bytes)
  });
}

function registrarEvidenciaRuta_(request, session) {
  exigirPermiso_(session.user,'RUTAS','ACTUALIZAR');const data=request.datos||request,routeId=String(request.identificador||data.RUTA_ID||'').trim(),route=obtenerRegistro_('RUTAS',routeId);
  if(!route)throw new Error('RUTA_NO_ENCONTRADA');if(!filtrarPorUsuario_('RUTAS',[route],session.user).length)throw new Error('PERMISO_DENEGADO');
  let urls=data.URLS;if(typeof urls==='string'){try{urls=JSON.parse(urls);}catch(_){urls=[urls];}}if(!Array.isArray(urls))urls=data.URL?[data.URL]:[];
  urls=urls.map(function(item){return typeof item==='string'?{url:item}:(item||{});}).filter(function(item){return /^https:\/\/drive\.google\.com\//i.test(String(item.url||''));});if(!urls.length)throw new Error('EVIDENCIA_RUTA_REQUERIDA');
  let existing=[];try{existing=JSON.parse(String(route.EVIDENCIAS_FOTOS_CODIFICADAS||'[]'));}catch(_){existing=[];}if(!Array.isArray(existing))existing=[];
  const observation=String(data.OBSERVACION||'').trim().slice(0,800),additions=urls.map(function(item){return{url:String(item.url||''),archivoId:extraerIdArchivoDrive_(item.archivoId||item.id||item.url||''),nombre:String(item.nombre||'Fotografía de ruta').slice(0,180),fecha:fechaIso_(),usuarioId:session.user.ID,usuarioNombre:session.user.NOMBRE||session.user.CORREO||session.user.ID,observacion:observation};}),all=existing.concat(additions).slice(-30),last=additions[additions.length-1];
  const updated=actualizarRegistro_('RUTAS',route.ID,{EVIDENCIAS_FOTOS_CODIFICADAS:JSON.stringify(all),ULTIMA_EVIDENCIA_URL:last.url,ULTIMA_EVIDENCIA_FECHA:new Date(),ULTIMA_EVIDENCIA_POR:session.user.ID,ULTIMA_EVIDENCIA_OBSERVACION:observation});
  registrarBitacora_(session.user,'CARGAR_EVIDENCIA','RUTAS',route.ID,additions.length+' fotografía(s) asociada(s) a la ruta. '+(observation?'Observación: '+observation:''));
  if(session.user.ROL_ID==='ROL-CONDUCTOR')notificarRolesInterno_(['ROL-ADMIN','ROL-SUPERVISOR'],{TITULO:'Nuevo respaldo fotográfico de ruta',MENSAJE:(session.user.NOMBRE||'El conductor')+' cargó '+additions.length+' fotografía(s) en la ruta '+(route.NOMBRE||route.ID)+'.',TIPO:'Ruta',PRIORIDAD:'Normal',RUTA_ID:route.ID,OPERACION_ID:route.OPERACION_ID||'',CREADO_POR:session.user.ID,CLAVE_UNICA:'RUTA-EVIDENCIA-'+route.ID+'-'+(last.archivoId||last.fecha)});
  return ok_({row:limpiarSalidaRecurso_('RUTAS',updated),evidencias:all,agregadas:additions.length});
}

function obtenerContextoInicioRuta_(route, session) {
  const conductorSesion = session.user.ROL_ID === 'ROL-CONDUCTOR' ? obtenerConductorDeUsuario_(session.user.ID) : null;
  if (session.user.ROL_ID === 'ROL-CONDUCTOR' && (!conductorSesion || String(route.CONDUCTOR_ID || '') !== String(conductorSesion.ID))) {
    throw new Error('RUTA_NO_COINCIDE_CONDUCTOR');
  }
  const conductorId = String(route.CONDUCTOR_ID || (conductorSesion && conductorSesion.ID) || '');
  if (!conductorId) throw new Error('CONDUCTOR_NO_ASOCIADO');
  let operaciones = listarRegistros_('OPERACIONES', {}).filter(function(row) {
    return String(row.CONDUCTOR_ID || '') === conductorId && String(row.ESTADO || '') === 'Activa';
  });
  if (route.OPERACION_ID) operaciones.sort(function(a,b) { return String(a.ID) === String(route.OPERACION_ID) ? -1 : String(b.ID) === String(route.OPERACION_ID) ? 1 : 0; });
  let operacion = null;
  if (route.VEHICULO_ID) operacion = operaciones.find(function(row) { return String(row.VEHICULO_ID || '') === String(route.VEHICULO_ID); }) || null;
  if (!operacion && !route.VEHICULO_ID) operacion = operaciones[0] || null;
  if (route.VEHICULO_ID && operaciones.length && !operacion) throw new Error('RUTA_VEHICULO_NO_COINCIDE_OPERACION');
  const vehiculoId = String(route.VEHICULO_ID || (operacion && operacion.VEHICULO_ID) || '');
  if (!vehiculoId) throw new Error('RUTA_VEHICULO_REQUERIDO');
  const vehiculo = obtenerRegistro_('VEHICULOS', vehiculoId);
  const conductor = obtenerRegistro_('CONDUCTORES', conductorId);
  if (!vehiculo) throw new Error('VEHICULO_NO_ENCONTRADO');
  if (!conductor) throw new Error('CONDUCTOR_NO_ENCONTRADO');
  const checkin = exigirCheckinDiarioRuta_(vehiculoId, conductorId);
  return { conductor:conductor, vehiculo:vehiculo, operacion:operacion, checkin:checkin };
}

function iniciarRuta_(request, session) {
  exigirPermiso_(session.user, 'RUTAS', 'ACTUALIZAR');
  const data = request.datos || request || {};
  const routeId = String(request.identificador || request.RUTA_ID || data.RUTA_ID || '').trim();
  const route = obtenerRegistro_('RUTAS', routeId);
  if (!route) throw new Error('RUTA_NO_ENCONTRADA');
  if (!filtrarPorUsuario_('RUTAS', [route], session.user).length) throw new Error('PERMISO_DENEGADO');
  if (['Completada','Cancelada'].indexOf(String(route.ESTADO || '')) >= 0) throw new Error('RUTA_NO_DISPONIBLE');
  const contexto = obtenerContextoInicioRuta_(route, session);
  const ahora = new Date();
  const cambios = {
    ESTADO:'En curso',
    FECHA_INICIO:route.FECHA_INICIO || ahora,
    VEHICULO_ID:contexto.vehiculo.ID,
    OPERACION_ID:contexto.operacion ? contexto.operacion.ID : (route.OPERACION_ID || ''),
    CHECKIN_ID:contexto.checkin.ID,
    GPS_SEGUIMIENTO_ACTIVO:'SI',
    SEGUIMIENTO_INICIADO_POR:session.user.ID,
    ULTIMA_UBICACION_EN:route.ULTIMA_UBICACION_EN || ''
  };
  const updated = actualizarRegistro_('RUTAS', route.ID, cambios);
  guardarAsignacionGpsCache_(session.user.ID, {
    CONDUCTOR_ID:contexto.conductor.ID,
    OPERACION_ID:cambios.OPERACION_ID,
    VEHICULO_ID:contexto.vehiculo.ID,
    RUTA_ID:route.ID
  });
  registrarBitacora_(session.user, 'INICIAR_RUTA', 'RUTAS', route.ID,
    'Seguimiento GPS activado. Check-in diario ' + contexto.checkin.ID + '. Operación vinculada: ' + (cambios.OPERACION_ID || 'sin operación activa') + '.');
  return ok_({
    row:limpiarSalidaRecurso_('RUTAS', updated),
    seguimiento:{
      activo:true,
      RUTA_ID:route.ID,
      OPERACION_ID:cambios.OPERACION_ID,
      VEHICULO_ID:contexto.vehiculo.ID,
      CONDUCTOR_ID:contexto.conductor.ID,
      CHECKIN_ID:contexto.checkin.ID,
      FECHA_OPERATIVA:claveFechaOperativa_(contexto.checkin.FECHA_HORA || ahora)
    },
    checkinReutilizado:String(contexto.checkin.UTILIZADO || '') === 'SI',
    operacionVinculada:Boolean(contexto.operacion)
  });
}

function completarRuta_(request, session) {
  exigirPermiso_(session.user, 'RUTAS', 'ACTUALIZAR');
  const data = request.datos || request.data || request || {};
  const routeId = String(
    request.identificador || request.id || request.RUTA_ID || request.routeId ||
    data.RUTA_ID || data.ID || data.id || data.routeId || ''
  ).trim();
  const route = obtenerRegistro_('RUTAS', routeId);
  if (!route) throw new Error('RUTA_NO_ENCONTRADA');
  if (!filtrarPorUsuario_('RUTAS', [route], session.user).length) throw new Error('PERMISO_DENEGADO');
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const propio = obtenerConductorDeUsuario_(session.user.ID);
    if (!propio || String(route.CONDUCTOR_ID || '') !== String(propio.ID)) throw new Error('RUTA_NO_COINCIDE_CONDUCTOR');
  }
  const yaCompletada = String(route.ESTADO || '') === 'Completada';
  const updated = actualizarRegistro_('RUTAS', route.ID, {
    ESTADO:'Completada',
    FECHA_FIN:route.FECHA_FIN || new Date(),
    GPS_SEGUIMIENTO_ACTIVO:'NO'
  });
  guardarAsignacionGpsCache_(session.user.ID, {
    CONDUCTOR_ID:route.CONDUCTOR_ID || '',
    OPERACION_ID:route.OPERACION_ID || '',
    VEHICULO_ID:route.VEHICULO_ID || '',
    RUTA_ID:''
  });
  registrarBitacora_(session.user, 'COMPLETAR_RUTA', 'RUTAS', route.ID, 'Seguimiento GPS de ruta desactivado.');
  if (!yaCompletada) {
    const driver = obtenerRegistro_('CONDUCTORES', route.CONDUCTOR_ID) || {};
    const vehicle = route.VEHICULO_ID ? (obtenerRegistro_('VEHICULOS', route.VEHICULO_ID) || {}) : {};
    encolarTrabajoSegundoPlano_('CIERRE_RUTA', {
      rutaId:route.ID,
      operacionId:route.OPERACION_ID || '',
      nombreRuta:route.NOMBRE || route.ID,
      origen:route.ORIGEN || '',
      destino:route.DESTINO || '',
      fechaHora:fechaIso_(),
      usuario:resumenUsuarioSegundoPlano_(session.user),
      conductor:{ id:route.CONDUCTOR_ID || '', nombre:driver.NOMBRE || route.CONDUCTOR_ID || '' },
      vehiculo:{ id:route.VEHICULO_ID || '', patente:vehicle.PATENTE || route.VEHICULO_ID || '' },
      finalizadaPorConductor:String(session.user.ROL_ID || '') === 'ROL-CONDUCTOR'
    });
  }
  return ok_({
    row:limpiarSalidaRecurso_('RUTAS', updated),
    seguimiento:{ activo:false, RUTA_ID:route.ID, OPERACION_ID:route.OPERACION_ID || '', VEHICULO_ID:route.VEHICULO_ID || '', CONDUCTOR_ID:route.CONDUCTOR_ID || '' },
    notificacionAdministradores:!yaCompletada
  });
}

function normalizarEstadoRuta_(valor) {
  const entrada = String(valor || '').trim();
  const clave = entrada.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s_-]+/g, '').toLowerCase();
  if (['encurso','iniciada','iniciado','activa','activo'].indexOf(clave) >= 0) return 'En curso';
  if (['completada','completado','finalizada','finalizado','terminada','terminado','cerrada','cerrado'].indexOf(clave) >= 0) return 'Completada';
  if (['cancelada','cancelado'].indexOf(clave) >= 0) return 'Cancelada';
  if (['asignada','asignado'].indexOf(clave) >= 0) return 'Asignada';
  return entrada;
}

function actualizarEstadoRuta_(request, session) {
  const data = request.datos || request.data || {};
  const state = normalizarEstadoRuta_(request.ESTADO || request.estado || data.ESTADO || data.estado || '');
  if (state === 'En curso') return iniciarRuta_(request, session);
  if (state === 'Completada') return completarRuta_(request, session);
  exigirPermiso_(session.user, 'RUTAS', 'ACTUALIZAR');
  const routeId = request.identificador || request.id || request.RUTA_ID || request.routeId ||
    data.RUTA_ID || data.ID || data.id || data.routeId;
  const route = obtenerRegistro_('RUTAS', routeId);
  if (!route) throw new Error('RUTA_NO_ENCONTRADA');
  if (!filtrarPorUsuario_('RUTAS', [route], session.user).length) throw new Error('PERMISO_DENEGADO');
  if (['Asignada','Cancelada'].indexOf(state) < 0) throw new Error('ESTADO_RUTA_INVALIDO');
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') throw new Error('PERMISO_DENEGADO');
  const changes = { ESTADO:state, GPS_SEGUIMIENTO_ACTIVO:'NO' };
  if (state === 'Cancelada') changes.FECHA_FIN = new Date();
  const updated = actualizarRegistro_('RUTAS', route.ID, changes);
  registrarBitacora_(session.user, 'CAMBIAR_ESTADO', 'RUTAS', route.ID, 'Estado: ' + state);
  return ok_({ row:limpiarSalidaRecurso_('RUTAS', updated), seguimiento:{activo:false,RUTA_ID:route.ID} });
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

function claveNotificacionUnica_(data) {
  const base=String(data.CLAVE_UNICA||'').trim();
  if(!base)return '';
  return huellaEvento_('NOT',[base,data.DESTINATARIO_USUARIO_ID||'',data.DESTINATARIO_CONDUCTOR_ID||'']);
}

function crearNotificacionInterna_(data) {
  const clave=claveNotificacionUnica_(data),lock=clave?LockService.getScriptLock():null,lockYaAdquirido=lock?lock.hasLock():false;
  try {
    if(lock&&!lockYaAdquirido)lock.waitLock(10000);
    if(clave){
      const existente=listarRegistros_('NOTIFICACIONES',{}).find(function(row){
        return String(row.ELIMINADO||'NO')!=='SI'
          && String(row.CLAVE_UNICA||'')===clave
          && String(row.DESTINATARIO_USUARIO_ID||'')===String(data.DESTINATARIO_USUARIO_ID||'')
          && String(row.DESTINATARIO_CONDUCTOR_ID||'')===String(data.DESTINATARIO_CONDUCTOR_ID||'');
      });
      if(existente)return existente;
    }
    return insertarRegistro_('NOTIFICACIONES', {
      DESTINATARIO_USUARIO_ID: data.DESTINATARIO_USUARIO_ID || '',
      DESTINATARIO_CONDUCTOR_ID: data.DESTINATARIO_CONDUCTOR_ID || '',
      TITULO: data.TITULO,
      MENSAJE: data.MENSAJE,
      TIPO: data.TIPO || 'Información',
      PRIORIDAD: data.PRIORIDAD || 'Normal',
      RUTA_ID: data.RUTA_ID || '',
      OPERACION_ID: data.OPERACION_ID || '',
      CLAVE_UNICA: clave,
      LEIDA: 'NO',
      FECHA_ENVIO: new Date(),
      CREADO_POR: data.CREADO_POR || '',
      ELIMINADO: 'NO',
    }, 'NOT');
  } finally {
    if(lock&&!lockYaAdquirido)try{lock.releaseLock();}catch(_){ }
  }
}

function notificarUsuarioInterno_(userId, data) {
  const id = String(userId || '').trim();
  if (!id) return null;
  return crearNotificacionInterna_(Object.assign({}, data || {}, { DESTINATARIO_USUARIO_ID:id }));
}

function notificarRolesInterno_(roleIds, data) {
  const roles = Array.isArray(roleIds) ? roleIds : [roleIds];
  const sent = [],vistos={};
  const payload=Object.assign({},data||{});
  if(!payload.CLAVE_UNICA){
    payload.CLAVE_UNICA=huellaEvento_('AVISO',[payload.TIPO||'',payload.TITULO||'',payload.MENSAJE||'',payload.RUTA_ID||'',payload.OPERACION_ID||'']);
  }
  listarRegistros_('USUARIOS', {}).filter(function(user) {
    return roles.indexOf(user.ROL_ID) >= 0 && user.ESTADO !== 'Inactivo'&&!vistos[user.ID];
  }).forEach(function(user) {
    vistos[user.ID]=true;
    const row = notificarUsuarioInterno_(user.ID, payload);
    if (row) sent.push(row);
  });
  return sent;
}

function marcarNotificacionLeida_(request, session) {
  exigirPermiso_(session.user, 'NOTIFICACIONES', 'ACTUALIZAR');
  const notificationId = request.identificador || request.NOTIFICACION_ID || request.id;
  const notification = obtenerRegistro_('NOTIFICACIONES', notificationId);
  if (!notification) throw new Error('NOTIFICACION_NO_ENCONTRADA');
  if (!filtrarPorUsuario_('NOTIFICACIONES', [notification], session.user).length) throw new Error('PERMISO_DENEGADO');
  if (String(notification.LEIDA || 'NO') === 'SI') return ok_({ row:limpiarSalidaRecurso_('NOTIFICACIONES', notification), persistenciaConfirmada:true, yaEstabaLeida:true });
  actualizarRegistro_('NOTIFICACIONES', notification.ID, { LEIDA:'SI', FECHA_LECTURA:new Date(), LEIDA_POR:session.user.ID });
  SpreadsheetApp.flush();
  invalidarCacheHoja_('NOTIFICACIONES');
  const confirmado=obtenerRegistro_('NOTIFICACIONES',notification.ID);
  if(!confirmado||String(confirmado.LEIDA||'NO')!=='SI')throw new Error('LECTURA_NOTIFICACION_NO_CONFIRMADA');
  registrarBitacora_(session.user,'MARCAR_LEIDA','NOTIFICACIONES',notification.ID,'Notificación marcada como leída.');
  return ok_({ row:limpiarSalidaRecurso_('NOTIFICACIONES', confirmado), persistenciaConfirmada:true });
}

function marcarAlertaLeida_(request, session) {
  exigirPermiso_(session.user, 'ALERTAS', 'ACTUALIZAR');
  const alertaId=request.identificador||request.ALERTA_ID||request.id;
  const alerta=obtenerRegistro_('ALERTAS',alertaId);
  if(!alerta)throw new Error('ALERTA_NO_ENCONTRADA');
  if(!filtrarPorUsuario_('ALERTAS',[alerta],session.user).length)throw new Error('PERMISO_DENEGADO');
  const modulosOperacionales=['OPERACIONES','GPS','CHECKIN','MANTENCIONES','VEHICULOS','DOCUMENTOS','RUTAS','COMBUSTIBLE','CONEXIONES'];
  const requiereAdministrador=modulosOperacionales.indexOf(String(alerta.MODULO||'').toUpperCase())>=0||String(alerta.TIPO||'')==='Reporte de conductor';
  if(requiereAdministrador&&!esAdministradorSistema_(session.user)){
    throw new Error('ALERTA_OPERACIONAL_REQUIERE_ADMINISTRADOR');
  }
  if(String(alerta.LEIDA||'NO')==='SI')return ok_({row:limpiarSalidaRecurso_('ALERTAS',alerta),persistenciaConfirmada:true,yaEstabaLeida:true});
  actualizarRegistro_('ALERTAS',alerta.ID,{LEIDA:'SI',FECHA_LECTURA:new Date(),LEIDA_POR:session.user.ID});
  SpreadsheetApp.flush();
  invalidarCacheHoja_('ALERTAS');
  const confirmado=obtenerRegistro_('ALERTAS',alerta.ID);
  if(!confirmado||String(confirmado.LEIDA||'NO')!=='SI')throw new Error('LECTURA_ALERTA_NO_CONFIRMADA');
  registrarBitacora_(session.user,'VALIDAR_Y_CERRAR','ALERTAS',alerta.ID,'Alerta validada y cerrada por '+(esAdministradorSistema_(session.user)?'Administrador':'usuario autorizado')+'. Módulo: '+String(alerta.MODULO||'Sistema')+'.');
  return ok_({row:limpiarSalidaRecurso_('ALERTAS',confirmado),persistenciaConfirmada:true});
}

function claveConexionActual_(usuarioId, dispositivoId, sesionId, sesionClienteId) {
  return [usuarioId, dispositivoId, sesionId, sesionClienteId].map(function(value) {
    return String(value || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 80);
  }).join('|').slice(0, 300);
}

function obtenerRegistroRapidoPorId_(sheetName, id) {
  if (!id) return null;
  const sheet = obtenerHoja_(sheetName);
  const headers = ESQUEMAS_APLICACION[sheetName];
  const idIndex = headers.indexOf('ID');
  const rowNumber = buscarFilaExacta_(sheet, idIndex + 1, id);
  if (rowNumber < 2) return null;
  const values = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
  const object = {};
  headers.forEach(function(header, index) { object[header] = serializarValor_(values[index]); });
  if (object.ELIMINADO === 'SI') return null;
  return object;
}

function obtenerConexionActualPorClave_(clave) {
  if (!clave) return null;
  let sheet;
  try { sheet = obtenerHoja_('CONEXIONES_ACTUAL'); } catch (_) { sheet = asegurarHoja_('CONEXIONES_ACTUAL'); }
  const headers = ESQUEMAS_APLICACION.CONEXIONES_ACTUAL;
  const keyIndex = headers.indexOf('CLAVE_CONEXION');
  const rowNumber = buscarFilaExacta_(sheet, keyIndex + 1, clave);
  if (rowNumber < 2) return null;
  const values = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
  const object = {};
  headers.forEach(function(header, index) { object[header] = serializarValor_(values[index]); });
  return object.ELIMINADO === 'SI' ? null : object;
}

function guardarConexionActual_(clave, conexionId, data) {
  let sheet;
  try { sheet = obtenerHoja_('CONEXIONES_ACTUAL'); } catch (_) { sheet = asegurarHoja_('CONEXIONES_ACTUAL'); }
  const headers = ESQUEMAS_APLICACION.CONEXIONES_ACTUAL;
  const keyIndex = headers.indexOf('CLAVE_CONEXION');
  const rowNumber = buscarFilaExacta_(sheet, keyIndex + 1, clave);
  const now = new Date();
  let current = {};
  if (rowNumber >= 2) {
    const existing = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
    headers.forEach(function(header, index) { current[header] = existing[index]; });
  } else {
    current.ID = generarId_('CNA');
    current.CREADO_EN = now;
  }
  current.CLAVE_CONEXION = clave;
  current.CONEXION_ID = conexionId || current.CONEXION_ID || '';
  Object.keys(data || {}).forEach(function(field) {
    if (headers.indexOf(field) >= 0 && ['ID','CLAVE_CONEXION','CONEXION_ID','CREADO_EN'].indexOf(field) < 0) current[field] = data[field];
  });
  current.ACTUALIZADO_EN = now;
  current.ELIMINADO = 'NO';
  const values = headers.map(function(header) { return deserializarFecha_(current[header]); });
  const destination = rowNumber >= 2 ? rowNumber : Math.max(2, sheet.getLastRow() + 1);
  sheet.getRange(destination, 1, 1, headers.length).setValues([values]);
  invalidarCacheHoja_('CONEXIONES_ACTUAL');
  invalidarCacheTiempoReal_('CONEXIONES_ACTUAL');
  return limpiarSalidaRecurso_('CONEXIONES_ACTUAL', current);
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
  const claveActual = claveConexionActual_(session.user.ID, deviceId, session.session.ID, clientSessionId);
  const snapshotActual = obtenerConexionActualPorClave_(claveActual);
  let existing = snapshotActual && snapshotActual.CONEXION_ID
    ? obtenerRegistroRapidoPorId_('CONEXIONES', snapshotActual.CONEXION_ID)
    : null;
  if (!existing) {
    existing = listarRegistros_('CONEXIONES', {}).find(function(row) {
      return row.USUARIO_ID === session.user.ID
        && row.DISPOSITIVO_ID === deviceId
        && row.SESION_ID === session.session.ID
        && String(row.SESION_CLIENTE_ID || '') === clientSessionId;
    });
  }
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
    IP_PUBLICA: normalizarIpPublica_(data.IP_PUBLICA || session.session.IP_PUBLICA || ''),
    IP_VERSION: versionIp_(data.IP_PUBLICA || session.session.IP_PUBLICA || ''),
    IP_CAPTURADA_EN: (data.IP_PUBLICA || session.session.IP_PUBLICA) ? new Date() : '',
    ELIMINADO: 'NO',
  };
  if (coordenadasGpsValidas_(data.LATITUD, data.LONGITUD)) {
    values.LATITUD = Number(data.LATITUD);
    values.LONGITUD = Number(data.LONGITUD);
    values.PRECISION_METROS = Number(data.PRECISION_METROS || 0);
    values.FECHA_GPS = data.FECHA_GPS ? new Date(data.FECHA_GPS) : new Date();
    values.FUENTE_GPS = String(data.FUENTE_GPS || '').slice(0, 120);
    values.PROVEEDOR_GPS = String(data.PROVEEDOR_GPS || '').slice(0, 80);
    values.CALIDAD_GPS = String(data.CALIDAD_GPS || calidadGps_(values.PRECISION_METROS, values.PROVEEDOR_GPS)).slice(0, 30);
  }
  const row = existing
    ? actualizarRegistro_('CONEXIONES', existing.ID, values)
    : insertarRegistro_('CONEXIONES', values, 'CNX');
  invalidarCacheTiempoReal_('CONEXIONES');
  guardarConexionActual_(claveActual, row.ID, values);
  guardarAsignacionGpsCache_(session.user.ID, {
    CONDUCTOR_ID: driver ? driver.ID : '',
    OPERACION_ID: operation ? operation.ID : '',
    VEHICULO_ID: vehicleId || '',
    RUTA_ID: route ? route.ID : ''
  });
  return ok_({ row: limpiarSalidaRecurso_('CONEXIONES', row), serverTime: fechaIso_(), user: usuarioPublico_(session.user) });
}

function filtroEstadoConexionTiempoReal_(request) {
  const value = String(request.estadoConexion || request.ESTADO_CONEXION || 'TODOS').toUpperCase();
  return ['TODOS','EN_LINEA','CONDUCIENDO','SIN_GPS','INACTIVOS'].indexOf(value) >= 0 ? value : 'TODOS';
}

function coincideEstadoConexionTiempoReal_(row, filter) {
  if (filter === 'TODOS') return true;
  if (filter === 'EN_LINEA') return Boolean(row.EN_LINEA);
  if (filter === 'CONDUCIENDO') return Boolean(row.EN_LINEA) && row.ACTIVIDAD === 'Conduciendo';
  if (filter === 'SIN_GPS') return Boolean(row.EN_LINEA) && row.ACTIVIDAD === 'Operación activa sin GPS';
  if (filter === 'INACTIVOS') return !row.EN_LINEA;
  return true;
}

function fechaInicioFiltroGps_(value) {
  const text = String(value || '').trim();
  if (!text) return null;
  const parts = text.split('-').map(Number);
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;
  return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0).getTime();
}

function fechaFinFiltroGps_(value) {
  const text = String(value || '').trim();
  if (!text) return null;
  const parts = text.split('-').map(Number);
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;
  return new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999).getTime();
}

function filtrosGpsTiempoReal_(request) {
  const estado = String(request.estadoGps || request.ESTADO_GPS || 'TODOS').toUpperCase();
  const limite = Math.max(1, Math.min(100, Number(request.limitePuntos || request.LIMITE_PUNTOS || 25)));
  return {
    conductorId: String(request.conductorId || request.CONDUCTOR_ID || '').trim(),
    fechaDesde: fechaInicioFiltroGps_(request.fechaDesde || request.FECHA_DESDE),
    fechaHasta: fechaFinFiltroGps_(request.fechaHasta || request.FECHA_HASTA),
    estadoGps: ['TODOS','ACTIVO','INACTIVO'].indexOf(estado) >= 0 ? estado : 'TODOS',
    limitePuntos: limite,
  };
}

function coincideFiltrosGpsUbicacion_(row, filtros) {
  if (filtros.conductorId && String(row.CONDUCTOR_ID || '') !== filtros.conductorId) return false;
  const time = new Date(row.FECHA_HORA || 0).getTime();
  if (filtros.fechaDesde !== null && time < filtros.fechaDesde) return false;
  if (filtros.fechaHasta !== null && time > filtros.fechaHasta) return false;
  const activa = Number.isFinite(time) && Date.now() - time <= Number(CONFIGURACION_APLICACION.ANTIGUEDAD_UBICACION_ACTIVA_MILISEGUNDOS || 120000);
  if (filtros.estadoGps === 'ACTIVO' && !activa) return false;
  if (filtros.estadoGps === 'INACTIVO' && activa) return false;
  return true;
}

function coincideFiltrosGpsConexion_(row, filtros) {
  if (filtros.conductorId && String(row.CONDUCTOR_ID || '') !== filtros.conductorId) return false;
  const time = new Date(row.ULTIMA_CONEXION || 0).getTime();
  if (filtros.fechaDesde !== null && time < filtros.fechaDesde) return false;
  if (filtros.fechaHasta !== null && time > filtros.fechaHasta) return false;
  const gpsActivo = String(row.GPS_ACTIVO || '') === 'SI' && Boolean(row.EN_LINEA);
  if (filtros.estadoGps === 'ACTIVO' && !gpsActivo) return false;
  if (filtros.estadoGps === 'INACTIVO' && gpsActivo) return false;
  return true;
}

function resumenTiempoReal_(request, session) {
  exigirPermiso_(session.user, 'PANEL_PRINCIPAL', 'LEER');
  try { solicitarRevisionAlertasSegundoPlano_('Consulta de seguimiento en tiempo real'); } catch (error) { console.log('Cola de alertas: ' + error.message); }
  const onlyGps = String(request.soloGps || request.SOLO_GPS || '') === 'SI';
  const vehicleFilter = filtroVehiculosTiempoReal_(request, session.user);
  const connectionFilter = filtroEstadoConexionTiempoReal_(request);
  const filtrosGps = filtrosGpsTiempoReal_(request);
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
  devices = devices.filter(function(row) { return coincideEstadoConexionTiempoReal_(row, connectionFilter) && coincideFiltrosGpsConexion_(row, filtrosGps); });
  const visibleVehicleIds = {};
  devices.forEach(function(row) { if (row.VEHICULO_ID) visibleVehicleIds[row.VEHICULO_ID] = true; });
  let visibleLocations = locations.rows || [];
  if (connectionFilter !== 'TODOS') visibleLocations = visibleLocations.filter(function(row) { return Boolean(visibleVehicleIds[row.VEHICULO_ID]); });
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
    locations: visibleLocations,
    trackingVehicles: locations.trackingVehicles || [],
    trackingDrivers: locations.trackingDrivers || [],
    devices: devices.slice(0, Math.min(100, filtrosGps.limitePuntos)),
    routes: routes,
    notifications: notifications.slice(-50).reverse(),
    totals: {
      locations: visibleLocations.length,
      onlineDevices: devices.filter(function(row) { return row.EN_LINEA; }).length,
      drivingSessions: devices.filter(function(row) { return row.EN_LINEA && row.ACTIVIDAD === 'Conduciendo'; }).length,
      sessionsWithoutGps: devices.filter(function(row) { return row.EN_LINEA && row.ACTIVIDAD === 'Operación activa sin GPS'; }).length,
      activeRoutes: routes.length,
      unreadNotifications: notifications.length,
    },
    serverTime: fechaIso_(),
  });
}

/** ============================================================
 * ARCHIVO: 22_Checkin_Vehicular.gs
 * ============================================================ */
/** Inspección preoperacional (check-in) de vehículos. */
function catalogoCheckinVehicular_() {
  return [
    { id:'documentacion', categoria:'Documentación', item:'Documentos obligatorios vigentes y disponibles', critico:true },
    { id:'luces', categoria:'Exterior', item:'Luces, intermitentes y señalización', critico:true },
    { id:'frenos', categoria:'Seguridad', item:'Frenos de servicio y estacionamiento', critico:true },
    { id:'direccion', categoria:'Seguridad', item:'Dirección sin juego, trabas ni ruidos anormales', critico:true },
    { id:'neumaticos', categoria:'Exterior', item:'Neumáticos, presión, desgaste y rueda de repuesto', critico:true },
    { id:'espejos_vidrios', categoria:'Exterior', item:'Espejos, parabrisas y vidrios con visibilidad segura', critico:true },
    { id:'cinturones', categoria:'Cabina', item:'Cinturones de seguridad y asientos', critico:true },
    { id:'bocina', categoria:'Cabina', item:'Bocina operativa', critico:false },
    { id:'limpiaparabrisas', categoria:'Cabina', item:'Limpiaparabrisas y líquido lavador', critico:false },
    { id:'aceite', categoria:'Motor y fluidos', item:'Nivel de aceite de motor', critico:true },
    { id:'refrigerante', categoria:'Motor y fluidos', item:'Nivel de refrigerante y temperatura normal', critico:true },
    { id:'fugas', categoria:'Motor y fluidos', item:'Ausencia de fugas de combustible, aceite o refrigerante', critico:true },
    { id:'extintor', categoria:'Emergencia', item:'Extintor vigente y accesible', critico:true },
    { id:'botiquin', categoria:'Emergencia', item:'Botiquín disponible', critico:false },
    { id:'herramientas', categoria:'Emergencia', item:'Gata, triángulos y herramientas básicas', critico:false },
    { id:'combustible', categoria:'Operación', item:'Combustible o carga suficiente para la ruta', critico:false },
  ];
}

function normalizarListaCheckin_(valor) {
  let recibidos = valor;
  if (typeof recibidos === 'string') {
    try { recibidos = JSON.parse(recibidos); }
    catch (error) { throw new Error('CHECKIN_LISTA_INVALIDA'); }
  }
  if (!Array.isArray(recibidos)) throw new Error('CHECKIN_LISTA_INVALIDA');

  const porId = {};
  recibidos.forEach(function(item) {
    if (item && item.id) porId[String(item.id)] = item;
  });

  return catalogoCheckinVehicular_().map(function(definicion) {
    const recibido = porId[definicion.id] || {};
    const respuesta = String(recibido.respuesta || '').toUpperCase();
    if (['OK','FALLA','NA'].indexOf(respuesta) < 0) {
      throw new Error('CHECKIN_ITEM_INCOMPLETO_' + definicion.id.toUpperCase());
    }
    const respuestaAjustada = definicion.critico && respuesta === 'NA' ? 'FALLA' : respuesta;
    return {
      id: definicion.id,
      categoria: definicion.categoria,
      item: definicion.item,
      critico: definicion.critico,
      respuesta: respuestaAjustada,
      observacion: String(recibido.observacion || '').trim().slice(0, 500),
    };
  });
}

function asegurarPersistenciaCheckin_() {
  ['CHECKINS','ALERTAS','BITACORA'].forEach(function(sheetName) {
    asegurarHoja_(sheetName);
  });
}

function buscarCheckinPorSolicitud_(solicitudClienteId, usuarioId) {
  if (!solicitudClienteId) return null;
  return listarRegistros_('CHECKINS', {}).find(function(row) {
    return String(row.SOLICITUD_CLIENTE_ID || '') === String(solicitudClienteId) &&
      String(row.CREADO_POR || '') === String(usuarioId || '');
  }) || null;
}

function repararModuloCheckin() {
  reiniciarCachesEjecucion_();
  asegurarPersistenciaCheckin_();
  SpreadsheetApp.flush();
  const sheet = obtenerHoja_('CHECKINS');
  return {
    ok:true,
    version:VERSION_APLICACION,
    hoja:sheet.getName(),
    filas:Math.max(0, sheet.getLastRow() - 1),
    columnas:sheet.getLastColumn(),
    message:'Módulo de check-in verificado y preparado para guardar registros.',
  };
}

function claveFechaOperativa_(valor) {
  const texto = typeof valor === 'string' ? valor.trim() : '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) return texto;
  const fecha = valor instanceof Date ? valor : new Date(valor || Date.now());
  if (isNaN(fecha.getTime())) return '';
  return Utilities.formatDate(fecha, CONFIGURACION_APLICACION.ZONA_HORARIA || Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function finVigenciaCheckinDia_(valor) {
  const fecha = valor instanceof Date ? valor : new Date(valor || Date.now());
  return new Date(fecha.getTime() + 26 * 60 * 60 * 1000);
}

function buscarCheckinDiarioVigente_(vehiculoId, conductorId, fechaReferencia) {
  const claveDia = claveFechaOperativa_(fechaReferencia || new Date());
  const rows = listarRegistros_('CHECKINS', {}).filter(function(row) {
    return String(row.VEHICULO_ID || '') === String(vehiculoId || '')
      && String(row.CONDUCTOR_ID || '') === String(conductorId || '')
      && String(row.ESTADO_REVISION || '') === 'Aprobado'
      && Number(row.FALLAS_CRITICAS || 0) <= 0
      && claveFechaOperativa_(row.FECHA_OPERATIVA || row.FECHA_HORA || row.CREADO_EN) === claveDia;
  });
  rows.sort(function(a,b) { return new Date(b.FECHA_HORA || b.CREADO_EN || 0) - new Date(a.FECHA_HORA || a.CREADO_EN || 0); });
  return rows[0] || null;
}

function exigirCheckinDiarioRuta_(vehiculoId, conductorId) {
  const checkin = buscarCheckinDiarioVigente_(vehiculoId, conductorId, new Date());
  if (!checkin) throw new Error('CHECKIN_DIARIO_REQUERIDO');
  return checkin;
}

function crearCheckinVehicular_(request, session) {
  exigirPermiso_(session.user, 'CHECKIN', 'CREAR');
  asegurarPersistenciaCheckin_();

  const data = Object.assign({}, request.datos || request || {});
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const propio = obtenerConductorDeUsuario_(session.user.ID);
    if (!propio) throw new Error('CONDUCTOR_NO_ASOCIADO');
    data.CONDUCTOR_ID = propio.ID;
  }
  validarRequeridos_(data, ['VEHICULO_ID','CONDUCTOR_ID','KILOMETRAJE','LISTA_CODIFICADA']);
  if (String(data.CONFIRMACION_CONDUCTOR || '') !== 'SI') throw new Error('CHECKIN_CONFIRMACION_REQUERIDA');

  const solicitudClienteId = String(data.SOLICITUD_CLIENTE_ID || '').trim().slice(0, 120);
  const existente = buscarCheckinPorSolicitud_(solicitudClienteId, session.user.ID);
  if (existente) {
    return ok_({
      row:limpiarSalidaRecurso_('CHECKINS', existente),
      catalogo:catalogoCheckinVehicular_(),
      persistenciaConfirmada:true,
      persistencia:'CENTRAL_CONFIRMADA',
      duplicadoEvitado:true,
      advertencias:[],
    });
  }

  const vehiculo = obtenerRegistro_('VEHICULOS', data.VEHICULO_ID);
  const conductor = obtenerRegistro_('CONDUCTORES', data.CONDUCTOR_ID);
  if (!vehiculo) throw new Error('VEHICULO_NO_ENCONTRADO');
  if (!conductor) throw new Error('CONDUCTOR_NO_ENCONTRADO');
  const validadoPorQr = consumirAutorizacionQr_(data.AUTORIZACION_QR, session, vehiculo.ID, 'checkin', false);
  if (vehiculo.ESTADO !== 'Disponible') throw new Error('VEHICULO_NO_DISPONIBLE');
  if (conductor.ESTADO !== 'Disponible') throw new Error('CONDUCTOR_NO_DISPONIBLE');

  const lista = normalizarListaCheckin_(data.LISTA_CODIFICADA);
  const fallasCriticas = lista.filter(function(item) { return item.respuesta === 'FALLA' && item.critico; }).length;
  const fallasLeves = lista.filter(function(item) { return item.respuesta === 'FALLA' && !item.critico; }).length;
  const itemsOk = lista.filter(function(item) { return item.respuesta === 'OK'; }).length;
  const ahora = new Date();
  const vigenteHasta = finVigenciaCheckinDia_(ahora);
  const estadoRevision = fallasCriticas > 0 ? 'Bloqueado' : (fallasLeves > 0 ? 'Pendiente' : 'Aprobado');
  const resultado = fallasCriticas > 0 ? 'Falla crítica' : (fallasLeves > 0 ? 'Con observaciones' : 'Conforme');

  const row = insertarRegistro_('CHECKINS', {
    VEHICULO_ID: vehiculo.ID,
    CONDUCTOR_ID: conductor.ID,
    OPERACION_ID: '',
    FECHA_HORA: ahora,
    KILOMETRAJE: Number(data.KILOMETRAJE || vehiculo.KILOMETRAJE || 0),
    NIVEL_COMBUSTIBLE: String(data.NIVEL_COMBUSTIBLE || 'No informado').slice(0, 40),
    LISTA_CODIFICADA: JSON.stringify(lista),
    TOTAL_ITEMS: lista.length,
    ITEMS_OK: itemsOk,
    FALLAS_LEVES: fallasLeves,
    FALLAS_CRITICAS: fallasCriticas,
    RESULTADO: resultado,
    ESTADO_REVISION: estadoRevision,
    OBSERVACIONES: String(data.OBSERVACIONES || '').slice(0, 1500),
    FIRMA_CONDUCTOR: String(data.FIRMA_CONDUCTOR || session.user.NOMBRE || conductor.NOMBRE).slice(0, 180),
    REVISADO_POR: estadoRevision === 'Aprobado' ? session.user.ID : '',
    FECHA_REVISION: estadoRevision === 'Aprobado' ? ahora : '',
    COMENTARIO_REVISION: estadoRevision === 'Aprobado' ? 'Aprobación automática sin fallas detectadas.' : '',
    VIGENTE_HASTA: vigenteHasta,
    UTILIZADO: 'NO',
    CREADO_POR: session.user.ID,
    ELIMINADO: 'NO',
    SOLICITUD_CLIENTE_ID: solicitudClienteId,
    FECHA_OPERATIVA: claveFechaOperativa_(ahora),
  }, 'CHK');

  SpreadsheetApp.flush();
  invalidarCacheHoja_('CHECKINS');
  const confirmado = obtenerRegistro_('CHECKINS', row.ID);
  if (!confirmado) throw new Error('CHECKIN_NO_CONFIRMADO_EN_BASE_CENTRAL');
  if (String(confirmado.VEHICULO_ID || '') !== String(vehiculo.ID) || String(confirmado.CONDUCTOR_ID || '') !== String(conductor.ID)) {
    throw new Error('CHECKIN_DATOS_NO_CONFIRMADOS_EN_BASE_CENTRAL');
  }

  const advertencias = [];
  if (fallasCriticas > 0 || fallasLeves > 0) {
    try {
      const critica = fallasCriticas > 0;
      crearAlertaUnica_({
        TIPO:'Check-in vehicular',
        NIVEL: critica ? 'Crítica' : 'Advertencia',
        TITULO: critica ? 'Vehículo bloqueado por inspección' : 'Check-in pendiente de revisión',
        MENSAJE: vehiculo.PATENTE + ': ' + fallasCriticas + ' falla(s) crítica(s) y ' + fallasLeves + ' observación(es) leve(s).',
        MODULO:'CHECKIN',
        REGISTRO_ID:confirmado.ID,
        CLAVE_UNICA:'CHECKIN-' + confirmado.ID + '-' + (critica ? 'CRITICA' : 'REVISION'),
        USUARIO_ID:''
      });
    } catch (errorAlerta) {
      advertencias.push('ALERTA_NO_GENERADA');
      console.error(errorAlerta && errorAlerta.stack ? errorAlerta.stack : errorAlerta);
    }
  }

  try {
    registrarBitacora_(session.user, 'CREAR', 'CHECKIN', confirmado.ID, vehiculo.PATENTE + ' · ' + resultado + (validadoPorQr ? ' · acceso mediante QR' : ''));
  } catch (errorBitacora) {
    advertencias.push('BITACORA_NO_GENERADA');
    console.error(errorBitacora && errorBitacora.stack ? errorBitacora.stack : errorBitacora);
  }

  return ok_({
    row:limpiarSalidaRecurso_('CHECKINS', confirmado),
    catalogo:catalogoCheckinVehicular_(),
    persistenciaConfirmada:true,
    persistencia:'CENTRAL_CONFIRMADA',
    duplicadoEvitado:false,
    advertencias:advertencias,
  });
}

function revisarCheckinVehicular_(request, session) {
  exigirPermiso_(session.user, 'CHECKIN_APROBACIONES', 'ACTUALIZAR');
  const id = request.identificador || request.CHECKIN_ID || (request.datos && request.datos.CHECKIN_ID);
  const data = request.datos || request || {};
  const decision = String(data.DECISION || '').toUpperCase();
  if (['APROBAR','RECHAZAR'].indexOf(decision) < 0) throw new Error('CHECKIN_DECISION_INVALIDA');
  const checkin = obtenerRegistro_('CHECKINS', id);
  if (!checkin) throw new Error('CHECKIN_NO_ENCONTRADO');
  if (decision === 'APROBAR' && Number(checkin.FALLAS_CRITICAS || 0) > 0) throw new Error('CHECKIN_CRITICO_NO_APROBABLE');

  const ahora = new Date();
  const nuevoEstado = decision === 'APROBAR' ? 'Aprobado' : 'Rechazado';
  const actualizado = actualizarRegistro_('CHECKINS', checkin.ID, {
    ESTADO_REVISION: nuevoEstado,
    REVISADO_POR: session.user.ID,
    FECHA_REVISION: ahora,
    COMENTARIO_REVISION: String(data.COMENTARIO_REVISION || '').slice(0, 1000),
    VIGENTE_HASTA: decision === 'APROBAR' ? finVigenciaCheckinDia_(ahora) : checkin.VIGENTE_HASTA,
    FECHA_OPERATIVA: checkin.FECHA_OPERATIVA || claveFechaOperativa_(checkin.FECHA_HORA || ahora),
  });

  const conductor = obtenerRegistro_('CONDUCTORES', checkin.CONDUCTOR_ID);
  if (conductor && conductor.USUARIO_ID) {
    crearNotificacionInterna_({
      DESTINATARIO_USUARIO_ID:conductor.USUARIO_ID,
      DESTINATARIO_CONDUCTOR_ID:conductor.ID,
      TITULO:'Check-in ' + nuevoEstado.toLowerCase(),
      MENSAJE:'La inspección ' + checkin.ID + ' fue ' + nuevoEstado.toLowerCase() + '. ' + String(data.COMENTARIO_REVISION || ''),
      TIPO:'Seguridad',
      PRIORIDAD: decision === 'APROBAR' ? 'Normal' : 'Alta',
      CREADO_POR:session.user.ID,
      CLAVE_UNICA:'CHECKIN-REVISION-' + checkin.ID + '-' + nuevoEstado
    });
  }

  registrarBitacora_(session.user, decision, 'CHECKIN_APROBACIONES', checkin.ID, String(data.COMENTARIO_REVISION || nuevoEstado));
  return ok_({ row: limpiarSalidaRecurso_('CHECKINS', actualizado) });
}

function checkinsDisponibles_(request, session) {
  exigirPermiso_(session.user, 'OPERACIONES', 'CREAR');
  const data = request.datos || request || {};
  let conductorId = String(data.CONDUCTOR_ID || '');
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const propio = obtenerConductorDeUsuario_(session.user.ID);
    if (!propio) throw new Error('CONDUCTOR_NO_ASOCIADO');
    conductorId = propio.ID;
  }
  const vehiculoId = String(data.VEHICULO_ID || '');
  const claveDia = claveFechaOperativa_(new Date());
  let rows = listarRegistros_('CHECKINS', {}).filter(function(row) {
    return row.ESTADO_REVISION === 'Aprobado'
      && Number(row.FALLAS_CRITICAS || 0) <= 0
      && claveFechaOperativa_(row.FECHA_OPERATIVA || row.FECHA_HORA || row.CREADO_EN) === claveDia
      && (!vehiculoId || row.VEHICULO_ID === vehiculoId)
      && (!conductorId || row.CONDUCTOR_ID === conductorId);
  });
  rows = filtrarPorUsuario_('CHECKINS', rows, session.user);
  rows.sort(function(a,b) { return new Date(b.FECHA_HORA || 0) - new Date(a.FECHA_HORA || 0); });
  return ok_({ rows:rows.slice(0, 50), total:rows.length, fechaOperativa:claveDia, reutilizableDuranteElDia:true });
}

function validarCheckinParaOperacion_(checkinId, vehiculoId, conductorId) {
  const checkin = checkinId ? obtenerRegistro_('CHECKINS', checkinId) : buscarCheckinDiarioVigente_(vehiculoId, conductorId, new Date());
  if (!checkin) throw new Error('CHECKIN_DIARIO_REQUERIDO');
  if (checkin.VEHICULO_ID !== vehiculoId || checkin.CONDUCTOR_ID !== conductorId) throw new Error('CHECKIN_NO_COINCIDE');
  if (checkin.ESTADO_REVISION !== 'Aprobado') throw new Error('CHECKIN_NO_APROBADO');
  if (Number(checkin.FALLAS_CRITICAS || 0) > 0) throw new Error('CHECKIN_CRITICO_NO_APROBABLE');
  if (claveFechaOperativa_(checkin.FECHA_OPERATIVA || checkin.FECHA_HORA || checkin.CREADO_EN) !== claveFechaOperativa_(new Date())) throw new Error('CHECKIN_EXPIRADO');
  return checkin;
}

function consumirCheckinOperacion_(checkinId, operacionId) {
  const checkin = obtenerRegistro_('CHECKINS', checkinId);
  if (!checkin) return null;
  return actualizarRegistro_('CHECKINS', checkinId, {
    OPERACION_ID:operacionId || checkin.OPERACION_ID || '',
    UTILIZADO:'SI',
    FECHA_OPERATIVA:checkin.FECHA_OPERATIVA || claveFechaOperativa_(checkin.FECHA_HORA || new Date())
  });
}

/** ============================================================
 * ARCHIVO: 23_Permisos_Usuario.gs
 * ============================================================ */
/** Permisos personalizados por usuario sin invalidar su sesión. */
function confirmarPermisosUsuarioGuardados_(usuarioId, modoEsperado, permisosEsperados) {
  SpreadsheetApp.flush();
  invalidarCacheHoja_('USUARIOS');
  const confirmado = obtenerRegistro_('USUARIOS', usuarioId);
  if (!confirmado) throw new Error('PERMISOS_USUARIO_NO_CONFIRMADOS');
  const modoReal = String(confirmado.MODO_PERMISOS || 'ROL').toUpperCase();
  const permisosReales = normalizarListaPermisos_(confirmado.PERMISOS_PERSONALIZADOS || []);
  const esperados = normalizarListaPermisos_(permisosEsperados || []);
  if (modoReal !== String(modoEsperado || 'ROL').toUpperCase()) throw new Error('MODO_PERMISOS_NO_CONFIRMADO');
  if (modoReal === 'PERSONALIZADO' && JSON.stringify(permisosReales) !== JSON.stringify(esperados)) {
    throw new Error('PERMISOS_PERSONALIZADOS_NO_CONFIRMADOS');
  }
  return confirmado;
}

function actualizarPermisosUsuario_(request, session) {
  if (!session || !session.user || !esAdministradorSistema_(session.user)) throw new Error('SOLO_ADMINISTRADOR');
  exigirPermiso_(session.user, 'USUARIOS', 'ACTUALIZAR');
  const data = request.datos || request;
  const userId = String(data.USUARIO_ID || request.identificador || '').trim();
  if (!userId) throw new Error('USUARIO_REQUERIDO');
  const user = obtenerRegistro_('USUARIOS', userId);
  if (!user) throw new Error('REGISTRO_NO_ENCONTRADO');
  if (esAdministradorSistema_(user)) {
    actualizarRegistro_('USUARIOS', user.ID, {
      MODO_PERMISOS:'ROL',
      PERMISOS_PERSONALIZADOS:'[]',
      VERSION_PERMISOS:Number(user.VERSION_PERMISOS || 0) + 1,
    });
    const updatedAdmin = confirmarPermisosUsuarioGuardados_(user.ID, 'ROL', []);
    registrarBitacora_(session.user, 'ACTUALIZAR_PERMISOS', 'USUARIOS', user.ID, 'Respaldo anterior: ' + respaldoAuditoria_(user) + '. Datos posteriores confirmados: ' + respaldoAuditoria_(updatedAdmin));
    return ok_({ row:usuarioPublico_(updatedAdmin), admin:true, persistenciaConfirmada:true });
  }
  const accesoConexionesAnterior = permisosEfectivosUsuario_(user).indexOf('CONEXIONES:LEER') >= 0;
  const accesoDocumentosAnterior = permisosEfectivosUsuario_(user).indexOf('DOCUMENTOS:CREAR') >= 0;
  const modo = String(data.MODO_PERMISOS || 'ROL').toUpperCase() === 'PERSONALIZADO' ? 'PERSONALIZADO' : 'ROL';
  const permisos = modo === 'PERSONALIZADO' ? normalizarListaPermisos_(data.PERMISOS || data.PERMISOS_PERSONALIZADOS || []) : [];
  actualizarRegistro_('USUARIOS', user.ID, {
    MODO_PERMISOS:modo,
    PERMISOS_PERSONALIZADOS:JSON.stringify(permisos),
    VERSION_PERMISOS:Number(user.VERSION_PERMISOS || 0) + 1,
  });
  const updated = confirmarPermisosUsuarioGuardados_(user.ID, modo, permisos);
  registrarBitacora_(session.user, 'ACTUALIZAR_PERMISOS', 'USUARIOS', user.ID,
    (modo === 'PERSONALIZADO' ? 'Permisos personalizados actualizados y confirmados en la base central. ' : 'Permisos restaurados al rol y confirmados. ') +
    'Respaldo anterior: ' + respaldoAuditoria_(user) + '. Datos posteriores confirmados: ' + respaldoAuditoria_(updated));
  const accesoConexionesNuevo = permisosEfectivosUsuario_(updated).indexOf('CONEXIONES:LEER') >= 0;
  const accesoDocumentosNuevo = permisosEfectivosUsuario_(updated).indexOf('DOCUMENTOS:CREAR') >= 0;
  if (accesoConexionesAnterior !== accesoConexionesNuevo) {
    registrarBitacora_(session.user,
      accesoConexionesNuevo ? 'OTORGAR_ACCESO_CONEXIONES' : 'RETIRAR_ACCESO_CONEXIONES',
      'CONEXIONES', user.ID,
      (accesoConexionesNuevo ? 'Acceso otorgado' : 'Acceso retirado') +
      ' al módulo Conexiones en línea para ' + (user.NOMBRE || user.CORREO || user.ID) +
      '. Ejecutado por ' + (session.user.NOMBRE || session.user.CORREO || session.user.ID) + '.');
  }
  if (user.ROL_ID === 'ROL-CONDUCTOR' && accesoDocumentosAnterior !== accesoDocumentosNuevo) {
    registrarBitacora_(session.user,
      accesoDocumentosNuevo ? 'HABILITAR_CARGA_DOCUMENTOS' : 'BLOQUEAR_CARGA_DOCUMENTOS',
      'DOCUMENTOS', user.ID,
      (accesoDocumentosNuevo ? 'Carga de documentos habilitada' : 'Carga de documentos bloqueada') +
      ' para ' + (user.NOMBRE || user.CORREO || user.ID) +
      '. Ejecutado por ' + (session.user.NOMBRE || session.user.CORREO || session.user.ID) + '.');
  }
  return ok_({ row:usuarioPublico_(updated), sessionPreserved:true, persistenciaConfirmada:true, accesoConexiones:accesoConexionesNuevo, cargaDocumentos:accesoDocumentosNuevo });
}

/** ============================================================
 * ARCHIVO: 24_Diagnostico_y_Reparacion.gs
 * ============================================================ */
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
    gps: estadoModuloDiagnostico_('Mapa en tiempo real', ['GPS','GPS_ACTUAL','CONEXIONES','CONEXIONES_ACTUAL'], true, listarRegistrosDiagnosticoSeguro_('GPS_ACTUAL').length + ' posiciones actuales'),
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
  try { instalarActivadorAlertasAutomaticas_(); } catch (error) { Logger.log('Activador de alertas: ' + error.message); }
  let duplicadosDepurados = { alertas:0, notificaciones:0 };
  try { duplicadosDepurados = depurarDuplicadosAvisos_(); } catch (error) { Logger.log('Depuración de avisos: ' + error.message); }
  registrarBitacora_(session.user, 'REPARAR_SISTEMA', 'CONFIGURACION', '', 'Hojas, columnas, catálogos, permisos, GPS actual y check-in verificados');
  reiniciarCachesEjecucion_();
  const diagnostic = diagnosticoSistema_({}, session).data;
  return ok_({ repaired:true, duplicadosDepurados:duplicadosDepurados, diagnostico:diagnostic });
}

/** ============================================================
 * ARCHIVO: 24_Oficina_Virtual.gs
 * ============================================================ */
/**
 * Asistente interno del Sistema de Gestión de Flotas.
 * No envía datos operativos a servicios externos: responde con conocimiento
 * incorporado, permisos vigentes y datos visibles para la sesión.
 */
function usuarioSistemaOficinaVirtual_() {
  return { ID:'SISTEMA', NOMBRE:'Oficina Virtual', CORREO:'', ROL_ID:'ROL-ADMIN' };
}

function modoAutomaticoOficinaVirtual_() {
  return PropertiesService.getScriptProperties().getProperty(OFICINA_VIRTUAL_MODO_AUTO_) === 'SI';
}

function normalizarConsultaOficinaVirtual_(valor) {
  return String(valor || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function leerUltimoResultadoOficinaVirtual_() {
  const properties = PropertiesService.getScriptProperties();
  let result = {};
  try { result = JSON.parse(properties.getProperty(OFICINA_VIRTUAL_ULTIMO_RESULTADO_) || '{}'); }
  catch (_) { result = {}; }
  return result && typeof result === 'object' ? result : {};
}

function guardarUltimoResultadoOficinaVirtual_(result) {
  const properties = PropertiesService.getScriptProperties();
  const reducido = {
    fecha:result.fecha || fechaIso_(),
    estado:result.estado || 'CORRECTO',
    modoAutomatico:Boolean(result.modoAutomatico),
    problemas:Number(result.problemas || 0),
    reparaciones:Number(result.reparaciones || 0),
    avisosCreados:Number(result.avisosCreados || 0)
  };
  properties.setProperty(OFICINA_VIRTUAL_ULTIMA_REVISION_, reducido.fecha);
  properties.setProperty(OFICINA_VIRTUAL_ULTIMO_RESULTADO_, JSON.stringify(reducido));
  return reducido;
}

function obtenerDestinatarioDocumentoOficinaVirtual_(documento, usuariosPorId, usuariosPorCorreo, conductoresPorId) {
  const userId = String(documento.USUARIO_ASOCIADO_ID || '').trim();
  if (userId && usuariosPorId[userId]) return usuariosPorId[userId];
  const conductorId = String(documento.CONDUCTOR_ASOCIADO_ID || (String(documento.ASOCIADO_TIPO || '').toUpperCase() === 'CONDUCTOR' ? documento.ASOCIADO_ID : '') || '').trim();
  const conductor = conductoresPorId[conductorId];
  if (conductor && conductor.USUARIO_ID && usuariosPorId[String(conductor.USUARIO_ID)]) return usuariosPorId[String(conductor.USUARIO_ID)];
  const asociadoUsuario = String(documento.ASOCIADO_TIPO || '').toUpperCase() === 'USUARIO' ? String(documento.ASOCIADO_ID || '') : '';
  if (asociadoUsuario && usuariosPorId[asociadoUsuario]) return usuariosPorId[asociadoUsuario];
  const correo = normalizarEmail_(documento.CORREO_ASOCIADO || '');
  return correo ? usuariosPorCorreo[correo] || null : null;
}

function crearTareaPersonalOficinaVirtual_(userId, conductorId, data, indiceNotificaciones) {
  const id = String(userId || '').trim();
  if (!id) return { created:false, row:null };
  const claveBase = String(data.CLAVE_UNICA || '').trim() || huellaEvento_('OV-TAREA', [
    id, data.MODULO || '', data.REGISTRO_ID || '', data.TITULO || ''
  ]);
  const clave = claveNotificacionUnica_({
    CLAVE_UNICA:claveBase,
    DESTINATARIO_USUARIO_ID:id,
    DESTINATARIO_CONDUCTOR_ID:conductorId || ''
  });
  const existing = indiceNotificaciones
    ? indiceNotificaciones[clave] || null
    : listarRegistros_('NOTIFICACIONES', {}).find(function(row) {
      return String(row.ELIMINADO || 'NO') !== 'SI'
        && String(row.CLAVE_UNICA || '') === clave
        && String(row.DESTINATARIO_USUARIO_ID || '') === id;
    });
  if (existing) {
    const changes = {};
    const fields = {
      TITULO:data.TITULO || 'Tarea pendiente',
      MENSAJE:data.MENSAJE || 'Tienes una tarea pendiente en el sistema.',
      TIPO:data.TIPO || 'Oficina Virtual',
      PRIORIDAD:data.PRIORIDAD || 'Normal',
      RUTA_ID:data.RUTA_ID || '',
      OPERACION_ID:data.OPERACION_ID || ''
    };
    Object.keys(fields).forEach(function(field) {
      if (String(existing[field] || '') !== String(fields[field] || '')) changes[field] = fields[field];
    });
    if (Object.keys(changes).length && String(existing.LEIDA || 'NO') === 'SI') {
      changes.LEIDA = 'NO';
      changes.FECHA_LECTURA = '';
      changes.LEIDA_POR = '';
    }
    const updated = Object.keys(changes).length ? actualizarRegistro_('NOTIFICACIONES', existing.ID, changes) : existing;
    if (indiceNotificaciones) indiceNotificaciones[clave] = updated;
    return { created:false, updated:Object.keys(changes).length > 0, row:updated };
  }
  const row = crearNotificacionInterna_({
    DESTINATARIO_USUARIO_ID:id,
    DESTINATARIO_CONDUCTOR_ID:conductorId || '',
    TITULO:data.TITULO || 'Tarea pendiente',
    MENSAJE:data.MENSAJE || 'Tienes una tarea pendiente en el sistema.',
    TIPO:data.TIPO || 'Oficina Virtual',
    PRIORIDAD:data.PRIORIDAD || 'Normal',
    RUTA_ID:data.RUTA_ID || '',
    OPERACION_ID:data.OPERACION_ID || '',
    CLAVE_UNICA:claveBase,
    CREADO_POR:'SISTEMA'
  });
  if (indiceNotificaciones && row) indiceNotificaciones[clave] = row;
  return { created:Boolean(row), row:row || null };
}

function invalidarCacheTareasOficinaVirtualSiAplica_(sheetName) {
  if (['DOCUMENTOS','VEHICULOS','CONDUCTORES','RUTAS','USUARIOS','CHECKINS'].indexOf(String(sheetName || '')) < 0) return false;
  try {
    PropertiesService.getScriptProperties().setProperty(OFICINA_VIRTUAL_CACHE_VERSION_, String(Date.now()));
    return true;
  } catch (_) {
    return false;
  }
}

function versionCacheTareasOficinaVirtual_() {
  const properties = PropertiesService.getScriptProperties();
  let version = properties.getProperty(OFICINA_VIRTUAL_CACHE_VERSION_);
  if (!version) {
    version = String(Date.now());
    properties.setProperty(OFICINA_VIRTUAL_CACHE_VERSION_, version);
  }
  return version;
}

function claveCacheTareasOficinaVirtual_(usuario) {
  return ('ovt_' + VERSION_APLICACION + '_' + versionCacheTareasOficinaVirtual_() + '_' + String(usuario && usuario.ID || 'sin_usuario'))
    .replace(/[^A-Za-z0-9_-]/g, '').slice(0, 220);
}

function leerCacheTareasOficinaVirtual_(usuario) {
  try {
    const raw = CacheService.getScriptCache().get(claveCacheTareasOficinaVirtual_(usuario));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (_) {
    return null;
  }
}

function guardarCacheTareasOficinaVirtual_(usuario, tareas) {
  const tasks = Array.isArray(tareas) ? tareas.slice(0, 100) : [];
  try {
    CacheService.getScriptCache().put(claveCacheTareasOficinaVirtual_(usuario), JSON.stringify(tasks), OFICINA_VIRTUAL_CACHE_SEGUNDOS_);
  } catch (_) {}
  return tasks;
}

function agregarIndiceOficinaVirtual_(indice, clave, fila) {
  const key = String(clave || '').trim();
  if (!key) return;
  if (!indice[key]) indice[key] = [];
  indice[key].push(fila);
}

function prepararContextoTareasOficinaVirtual_(contexto) {
  const context = contexto || {};
  if (context.indiceOficinaVirtual) return context;
  const documents = Array.isArray(context.documents) ? context.documents : listarRegistrosDiagnosticoSeguro_('DOCUMENTOS');
  const vehicles = Array.isArray(context.vehicles) ? context.vehicles : listarRegistrosDiagnosticoSeguro_('VEHICULOS');
  const drivers = Array.isArray(context.drivers) ? context.drivers : listarRegistrosDiagnosticoSeguro_('CONDUCTORES');
  const routes = Array.isArray(context.routes) ? context.routes : listarRegistrosDiagnosticoSeguro_('RUTAS');
  const clean = function(value) { return normalizarConsultaOficinaVirtual_(value).replace(/[^a-z0-9]/g, ''); };
  const index = {
    documentosPorUsuario:{},
    documentosPorConductor:{},
    documentosPorCorreo:{},
    tiposDocumentoPorVehiculo:{},
    licenciaPorConductor:{},
    rutasPorConductor:{},
    conductorPorUsuario:{}
  };
  const vehicleByPlate = {};
  const driverByRut = {};
  vehicles.forEach(function(vehicle) {
    const plate = clean(vehicle.PATENTE);
    if (plate) vehicleByPlate[plate] = String(vehicle.ID || '');
  });
  drivers.forEach(function(driver) {
    const driverId = String(driver.ID || '');
    const rut = clean(driver.RUT);
    if (rut) driverByRut[rut] = driverId;
    if (driver.USUARIO_ID && !index.conductorPorUsuario[String(driver.USUARIO_ID)]) {
      index.conductorPorUsuario[String(driver.USUARIO_ID)] = driver;
    }
  });
  routes.forEach(function(route) {
    agregarIndiceOficinaVirtual_(index.rutasPorConductor, route.CONDUCTOR_ID, route);
  });
  documents.forEach(function(document) {
    const associatedType = normalizarConsultaOficinaVirtual_(document.ASOCIADO_TIPO);
    const associatedId = String(document.ASOCIADO_ID || '');
    const userId = String(document.USUARIO_ASOCIADO_ID || (associatedType === 'usuario' ? associatedId : '') || '');
    const driverId = String(document.CONDUCTOR_ASOCIADO_ID || (associatedType === 'conductor' ? associatedId : '') || driverByRut[clean(document.IDENTIFICACION)] || '');
    const email = normalizarEmail_(document.CORREO_ASOCIADO || '');
    agregarIndiceOficinaVirtual_(index.documentosPorUsuario, userId, document);
    agregarIndiceOficinaVirtual_(index.documentosPorConductor, driverId, document);
    agregarIndiceOficinaVirtual_(index.documentosPorCorreo, email, document);
    const vehicleId = String((associatedType === 'vehiculo' ? associatedId : '') || vehicleByPlate[clean(document.IDENTIFICACION)] || '');
    if (vehicleId) {
      if (!index.tiposDocumentoPorVehiculo[vehicleId]) index.tiposDocumentoPorVehiculo[vehicleId] = {};
      const type = normalizarConsultaOficinaVirtual_(document.TIPO);
      if (type.indexOf('soap') >= 0) index.tiposDocumentoPorVehiculo[vehicleId].SOAP = true;
      if (type.indexOf('revision tecnica') >= 0) index.tiposDocumentoPorVehiculo[vehicleId]['REVISION-TECNICA'] = true;
      if (type.indexOf('permiso de circulacion') >= 0) index.tiposDocumentoPorVehiculo[vehicleId]['PERMISO-CIRCULACION'] = true;
    }
    if (driverId && normalizarConsultaOficinaVirtual_(document.TIPO).indexOf('licencia') >= 0) {
      index.licenciaPorConductor[driverId] = true;
    }
  });
  context.documents = documents;
  context.vehicles = vehicles;
  context.drivers = drivers;
  context.routes = routes;
  context.indiceOficinaVirtual = index;
  return context;
}

function documentosVisiblesTareasOficinaVirtual_(usuario, conductorId, contexto) {
  if (esAdministradorSistema_(usuario)) return contexto.documents;
  const index = contexto.indiceOficinaVirtual;
  const lists = [
    index.documentosPorUsuario[String(usuario.ID || '')] || [],
    index.documentosPorConductor[String(conductorId || '')] || [],
    index.documentosPorCorreo[normalizarEmail_(usuario.CORREO || '')] || []
  ];
  const unique = {};
  const result = [];
  lists.forEach(function(list) {
    list.forEach(function(row) {
      const key = String(row.ID || '');
      if (!key || unique[key]) return;
      unique[key] = true;
      result.push(row);
    });
  });
  return result;
}

function tareasPendientesOficinaVirtual_(usuario, contexto) {
  const user = usuario || {};
  const context = prepararContextoTareasOficinaVirtual_(contexto || {});
  const index = context.indiceOficinaVirtual;
  const esAdmin = esAdministradorSistema_(user);
  const driver = Object.prototype.hasOwnProperty.call(context, 'driver')
    ? context.driver
    : index.conductorPorUsuario[String(user.ID || '')] || null;
  const driverId = driver ? String(driver.ID || '') : '';
  const now = new Date();
  const documentDays = Number(CONFIGURACION_APLICACION.DIAS_AVISO_DOCUMENTO || 30);
  const tasks = [];
  documentosVisiblesTareasOficinaVirtual_(user, driverId, context).forEach(function(row) {
    const pendingReview = String(row.ESTADO || '') === 'Pendiente de revisión';
    const days = diasHasta_(row.FECHA_VENCIMIENTO, now);
    let task = null;
    if (pendingReview && esAdmin) {
      task = { id:'DOC-' + row.ID, tipo:'Documento', prioridad:'Alta', titulo:'Revisar documento pendiente', detalle:(row.TIPO || 'Documento') + ' ' + (row.IDENTIFICACION || row.ID) + ' requiere revisión.', modulo:'DOCUMENTOS', registroId:row.ID };
    } else if (!String(row.DIRECCION_ARCHIVO || '').trim()) {
      task = { id:'DOC-' + row.ID, tipo:'Documento', prioridad:'Alta', titulo:'Adjuntar archivo faltante', detalle:(row.TIPO || 'Documento') + ' no tiene un archivo cargado.', modulo:'DOCUMENTOS', registroId:row.ID };
    } else if (days !== null && days < 0) {
      task = { id:'DOC-' + row.ID, tipo:'Documento', prioridad:'Urgente', titulo:'Renovar documento vencido', detalle:(row.TIPO || 'Documento') + ' está vencido desde hace ' + Math.abs(days) + ' día(s).', modulo:'DOCUMENTOS', registroId:row.ID };
    } else if (days !== null && days <= documentDays) {
      task = { id:'DOC-' + row.ID, tipo:'Documento', prioridad:days <= 7 ? 'Alta' : 'Normal', titulo:'Renovar documento próximo a vencer', detalle:(row.TIPO || 'Documento') + ' vence en ' + days + ' día(s).', modulo:'DOCUMENTOS', registroId:row.ID };
    }
    if (task) tasks.push(task);
  });
  if (esAdmin) {
    const requiredTypes = ['SOAP','REVISION-TECNICA','PERMISO-CIRCULACION'];
    context.vehicles.filter(function(row) {
      return String(row.ESTADO || '') !== 'Inactivo' && String(row.ELIMINADO || 'NO') !== 'SI';
    }).forEach(function(vehicle) {
      const registered = index.tiposDocumentoPorVehiculo[String(vehicle.ID || '')] || {};
      requiredTypes.forEach(function(required) {
        if (registered[required]) return;
        tasks.push({
          id:'FALTA-' + required + '-' + vehicle.ID,
          tipo:'Documento',
          prioridad:'Alta',
          titulo:'Documento obligatorio faltante',
          detalle:(vehicle.PATENTE || vehicle.ID) + ' no tiene registrado ' + required.replace(/-/g, ' ').toLowerCase() + '.',
          modulo:'DOCUMENTOS',
          registroId:vehicle.ID
        });
      });
    });
    context.drivers.filter(function(row) {
      return String(row.ESTADO || '') !== 'Inactivo' && String(row.ELIMINADO || 'NO') !== 'SI';
    }).forEach(function(conductor) {
      if (index.licenciaPorConductor[String(conductor.ID || '')]) return;
      tasks.push({
        id:'FALTA-LICENCIA-' + conductor.ID,
        tipo:'Licencia',
        prioridad:'Alta',
        titulo:'Licencia de conducir no cargada',
        detalle:(conductor.NOMBRE || conductor.ID) + ' no tiene un documento de licencia asociado.',
        modulo:'DOCUMENTOS',
        registroId:conductor.ID
      });
    });
  }
  if (driver) {
    if (!index.licenciaPorConductor[driverId]) {
      const licenseDays = diasHasta_(driver.LICENCIA_VENCIMIENTO, now);
      const expired = licenseDays !== null && licenseDays < 0;
      tasks.push({
        id:'FALTA-LICENCIA-' + driver.ID,
        tipo:'Licencia',
        prioridad:expired ? 'Urgente' : 'Alta',
        titulo:expired ? 'Licencia vencida y documento no cargado' : 'Licencia de conducir no cargada',
        detalle:expired
          ? 'Tu licencia venció hace ' + Math.abs(licenseDays) + ' día(s) y falta cargar el documento renovado.'
          : (!driver.LICENCIA_VENCIMIENTO ? 'Falta cargar tu licencia y registrar su fecha de vencimiento.' : 'Falta cargar el documento de tu licencia de conducir.'),
        modulo:'DOCUMENTOS',
        registroId:driver.ID
      });
    }
    (index.rutasPorConductor[driverId] || []).filter(function(row) {
      return String(row.ESTADO || '') === 'Asignada';
    }).forEach(function(row) {
      tasks.push({ id:'RUTA-' + row.ID, tipo:'Ruta', prioridad:'Normal', titulo:'Ruta asignada pendiente', detalle:(row.NOMBRE || row.ID) + ': ' + (row.ORIGEN || 'Origen') + ' → ' + (row.DESTINO || 'Destino') + '.', modulo:'RUTAS', registroId:row.ID, rutaId:row.ID });
      if (!String(row.CHECKIN_ID || '').trim()) {
        tasks.push({ id:'CHECKIN-RUTA-' + row.ID, tipo:'Check-in', prioridad:'Alta', titulo:'Realizar check-in vehicular', detalle:'Debes completar la revisión del vehículo antes de iniciar la ruta ' + (row.NOMBRE || row.ID) + '.', modulo:'CHECKIN', registroId:row.ID, rutaId:row.ID });
      }
    });
  }
  const unique = {};
  return tasks.filter(function(task) {
    if (unique[task.id]) return false;
    unique[task.id] = true;
    return true;
  }).slice(0, 100);
}

function obtenerTareasOficinaVirtual_(usuario, opciones) {
  const opts = opciones || {};
  if (!opts.force) {
    const cached = leerCacheTareasOficinaVirtual_(usuario);
    if (cached) return cached;
  }
  const tasks = tareasPendientesOficinaVirtual_(usuario, opts.contexto || {});
  return guardarCacheTareasOficinaVirtual_(usuario, tasks);
}

function generarAvisosPersonalesOficinaVirtual_() {
  const users = listarRegistrosDiagnosticoSeguro_('USUARIOS').filter(function(row) {
    return usuarioTieneAccesoConfigurado_(row);
  });
  const shared = prepararContextoTareasOficinaVirtual_({
    documents:listarRegistrosDiagnosticoSeguro_('DOCUMENTOS'),
    vehicles:listarRegistrosDiagnosticoSeguro_('VEHICULOS'),
    drivers:listarRegistrosDiagnosticoSeguro_('CONDUCTORES'),
    routes:listarRegistrosDiagnosticoSeguro_('RUTAS')
  });
  const driverByUser = shared.indiceOficinaVirtual.conductorPorUsuario;
  let created = 0, updated = 0, closed = 0;
  const activeKeys = {};
  const existingNotifications = listarRegistrosDiagnosticoSeguro_('NOTIFICACIONES');
  const notificationByKey = {};
  existingNotifications.forEach(function(row) {
    if (String(row.ELIMINADO || 'NO') !== 'SI' && row.CLAVE_UNICA) notificationByKey[String(row.CLAVE_UNICA)] = row;
  });
  users.forEach(function(user) {
    const driver = driverByUser[String(user.ID)] || null;
    const userTasks = tareasPendientesOficinaVirtual_(user, shared);
    guardarCacheTareasOficinaVirtual_(user, userTasks);
    userTasks.forEach(function(task) {
      // La asignación de ruta ya crea su propia notificación dirigida.
      // Se muestra en el panel de pendientes, pero no se duplica en avisos.
      if (task.tipo === 'Ruta') return;
      const baseKey = 'OV-TAREA-' + task.id;
      const finalKey = claveNotificacionUnica_({
        CLAVE_UNICA:baseKey,
        DESTINATARIO_USUARIO_ID:user.ID,
        DESTINATARIO_CONDUCTOR_ID:driver ? driver.ID : ''
      });
      activeKeys[finalKey] = true;
      const result = crearTareaPersonalOficinaVirtual_(user.ID, driver ? driver.ID : '', {
        TITULO:task.titulo,
        MENSAJE:task.detalle + ' Abre ' + task.modulo + ' para resolverlo.',
        TIPO:'Oficina Virtual',
        PRIORIDAD:task.prioridad,
        MODULO:task.modulo,
        REGISTRO_ID:task.registroId,
        RUTA_ID:task.rutaId || '',
        CLAVE_UNICA:baseKey
      }, notificationByKey);
      if (result.created) created++;
      if (result.updated) updated++;
    });
  });
  existingNotifications.filter(function(row) {
    return String(row.ELIMINADO || 'NO') !== 'SI'
      && String(row.CREADO_POR || '') === 'SISTEMA'
      && String(row.TIPO || '') === 'Oficina Virtual'
      && !activeKeys[String(row.CLAVE_UNICA || '')]
      && String(row.LEIDA || 'NO') !== 'SI';
  }).forEach(function(row) {
    actualizarRegistro_('NOTIFICACIONES', row.ID, { LEIDA:'SI', FECHA_LECTURA:new Date(), LEIDA_POR:'SISTEMA' });
    closed++;
  });
  return { usuariosRevisados:users.length, creados:created, actualizados:updated, cerrados:closed };
}

function diagnosticoOficinaVirtualInterno_() {
  const issues = [];
  Object.keys(ESQUEMAS_APLICACION).forEach(function(sheetName) {
    const status = diagnosticarHojaSistema_(sheetName);
    if (!status.existe || !status.columnas) {
      issues.push({
        id:'ESTRUCTURA-' + sheetName,
        nivel:'CRITICO',
        titulo:'Estructura pendiente: ' + sheetName,
        detalle:status.detalle,
        modulo:'CONFIGURACION',
        reparable:true
      });
    }
  });
  const company = obtenerEmpresaPrincipal_() || {};
  const point = puntoOperacionDesdeEmpresa_(company) || obtenerRespaldoPuntoOperacion_();
  if (!point || !isFinite(Number(point.LATITUD)) || !isFinite(Number(point.LONGITUD))) {
    issues.push({ id:'PUNTO-OPERACIONAL', nivel:'ATENCION', titulo:'Falta configurar el punto operacional', detalle:'Las validaciones de inicio y término necesitan una base con coordenadas válidas.', modulo:'CONFIGURACION', reparable:false });
  }
  const now = Date.now();
  const gpsRows = listarRegistrosDiagnosticoSeguro_('GPS_ACTUAL');
  const latestGps = { operacion:{}, vehiculo:{}, conductor:{} };
  const saveLatest = function(index, key, row) {
    const id = String(key || '');
    if (!id) return;
    const current = index[id];
    const currentTime = current ? new Date(current.FECHA_HORA || current.ACTUALIZADO_EN || 0).getTime() : 0;
    const rowTime = new Date(row.FECHA_HORA || row.ACTUALIZADO_EN || 0).getTime();
    if (!current || (isFinite(rowTime) ? rowTime : 0) > currentTime) index[id] = row;
  };
  gpsRows.forEach(function(row) {
    saveLatest(latestGps.operacion, row.OPERACION_ID, row);
    saveLatest(latestGps.vehiculo, row.VEHICULO_ID, row);
    saveLatest(latestGps.conductor, row.CONDUCTOR_ID, row);
  });
  listarRegistrosDiagnosticoSeguro_('OPERACIONES').filter(function(row) {
    return String(row.ESTADO || '') === 'Activa';
  }).forEach(function(operation) {
    const candidates = [
      latestGps.operacion[String(operation.ID || '')],
      latestGps.vehiculo[String(operation.VEHICULO_ID || '')],
      latestGps.conductor[String(operation.CONDUCTOR_ID || '')]
    ].filter(Boolean).sort(function(a, b) {
      return new Date(b.FECHA_HORA || b.ACTUALIZADO_EN || 0) - new Date(a.FECHA_HORA || a.ACTUALIZADO_EN || 0);
    });
    const gps = candidates[0] || null;
    const age = gps ? (now - new Date(gps.FECHA_HORA || 0).getTime()) / 60000 : Infinity;
    if (!gps || !isFinite(age) || age >= Number(CONFIGURACION_APLICACION.MINUTOS_SIN_GPS_ALERTA || 5)) {
      issues.push({ id:'GPS-' + operation.ID, nivel:'CRITICO', titulo:'Operación activa sin GPS reciente', detalle:'La operación ' + operation.ID + ' no está informando una posición reciente.', modulo:'GPS', reparable:false });
    }
  });
  let hasTrigger = activadorOficinaVirtualInstalado_();
  if (!hasTrigger) {
    try {
      instalarActivadorOficinaVirtual_();
      hasTrigger = activadorOficinaVirtualInstalado_();
    } catch (_) {}
  }
  if (!hasTrigger) issues.push({ id:'ACTIVADOR-OFICINA', nivel:'ATENCION', titulo:'Revisión automática sin activador', detalle:'Falta el activador periódico de Oficina Virtual.', modulo:'OFICINA_VIRTUAL', reparable:true });
  const criticalUnread = listarRegistrosDiagnosticoSeguro_('ALERTAS').filter(function(row) {
    return String(row.LEIDA || 'NO') !== 'SI' && String(row.NIVEL || '').toUpperCase().indexOf('CR') === 0;
  }).length;
  const critical = issues.filter(function(item) { return item.nivel === 'CRITICO'; }).length;
  return {
    nombre:'Oficina Virtual',
    version:VERSION_APLICACION,
    fecha:fechaIso_(),
    modoAutomatico:modoAutomaticoOficinaVirtual_(),
    estado:critical ? 'CRITICO' : (issues.length ? 'ATENCION' : 'CORRECTO'),
    problemas:issues.length,
    reparables:issues.filter(function(item) { return item.reparable; }).length,
    alertasCriticasSinLeer:criticalUnread,
    problemasDetalle:issues.slice(0, 60)
  };
}

function aplicarReparacionesSegurasOficinaVirtual_() {
  reiniciarCachesEjecucion_();
  Object.keys(ESQUEMAS_APLICACION).forEach(function(sheetName) { asegurarHoja_(sheetName); });
  reiniciarCachesEjecucion_();
  asegurarCatalogos_();
  migrarGpsActualDesdeHistorial_();
  instalarActivadorAlertasAutomaticas_();
  instalarActivadorOficinaVirtual_();
  let duplicates = { alertas:0, notificaciones:0 };
  try { duplicates = depurarDuplicadosAvisos_(); } catch (_) {}
  reiniciarCachesEjecucion_();
  return { aplicada:true, duplicadosDepurados:duplicates };
}

function procesarOficinaVirtual_(options) {
  const opts = options || {};
  const cache = CacheService.getScriptCache();
  if (!opts.force && cache.get(OFICINA_VIRTUAL_EJECUTANDO_) === 'SI') {
    return Object.assign({ omitida:true }, leerUltimoResultadoOficinaVirtual_());
  }
  cache.put(OFICINA_VIRTUAL_EJECUTANDO_, 'SI', 90);
  let diagnostic = diagnosticoOficinaVirtualInterno_();
  let repairs = 0;
  diagnostic.problemasDetalle.filter(function(issue) {
    return String(issue.id || '').indexOf('GPS-') !== 0;
  }).forEach(function(issue) {
    crearAlertaUnica_({
      TIPO:'Oficina Virtual',
      NIVEL:issue.nivel === 'CRITICO' ? 'Crítica' : 'Advertencia',
      TITULO:'Oficina Virtual: ' + issue.titulo,
      MENSAJE:issue.detalle,
      MODULO:issue.modulo || 'OFICINA_VIRTUAL',
      REGISTRO_ID:issue.id,
      CLAVE_UNICA:'OV-DIAG-' + issue.id
    });
  });
  if (diagnostic.modoAutomatico && diagnostic.reparables > 0) {
    aplicarReparacionesSegurasOficinaVirtual_();
    repairs = diagnostic.reparables;
    diagnostic = diagnosticoOficinaVirtualInterno_();
  }
  const technicalAlertsClosed = cerrarAlertaTecnicaActivadorResueltaOficinaVirtual_(diagnostic);
  let alerts = { creadas:0 };
  let personal = { creados:0, usuariosRevisados:0 };
  try { alerts = ejecutarMotorAlertasAutomaticas_({ force:true }); } catch (_) {}
  try { personal = generarAvisosPersonalesOficinaVirtual_(); } catch (_) {}
  const result = Object.assign({}, diagnostic, {
    reparaciones:repairs,
    avisosCreados:Number(alerts.creadas || 0) + Number(personal.creados || 0),
    alertasTecnicasCerradas:technicalAlertsClosed,
    avisosPersonales:personal
  });
  guardarUltimoResultadoOficinaVirtual_(result);
  if (diagnostic.problemas || repairs || result.avisosCreados) {
    registrarBitacora_(opts.usuario || usuarioSistemaOficinaVirtual_(), 'REVISION_AUTOMATICA', 'OFICINA_VIRTUAL', '', 'Estado ' + diagnostic.estado + ' · problemas ' + diagnostic.problemas + ' · reparaciones seguras ' + repairs + ' · avisos ' + result.avisosCreados);
  }
  return result;
}

function activadorOficinaVirtualInstalado_() {
  try {
    return ScriptApp.getProjectTriggers().some(function(trigger) {
      return trigger.getHandlerFunction() === 'procesarOficinaVirtualProgramada_';
    });
  } catch (_) {
    return false;
  }
}

function cerrarAlertaTecnicaActivadorResueltaOficinaVirtual_(diagnostico) {
  const issues = diagnostico && Array.isArray(diagnostico.problemasDetalle) ? diagnostico.problemasDetalle : [];
  if (issues.some(function(issue) { return String(issue.id || '') === 'ACTIVADOR-OFICINA'; })) return 0;
  let closed = 0;
  listarRegistrosDiagnosticoSeguro_('ALERTAS').filter(function(row) {
    return String(row.ELIMINADO || 'NO') !== 'SI'
      && String(row.LEIDA || 'NO') !== 'SI'
      && String(row.TIPO || '') === 'Oficina Virtual'
      && String(row.MODULO || '') === 'OFICINA_VIRTUAL'
      && String(row.REGISTRO_ID || '') === 'ACTIVADOR-OFICINA';
  }).forEach(function(row) {
    actualizarRegistro_('ALERTAS', row.ID, {
      LEIDA:'SI',
      FECHA_LECTURA:new Date(),
      LEIDA_POR:'SISTEMA-VERIFICACION-TECNICA'
    });
    closed++;
  });
  return closed;
}

function instalarActivadorOficinaVirtual_() {
  const handler = 'procesarOficinaVirtualProgramada_';
  const triggers = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === handler;
  });
  triggers.slice(1).forEach(function(trigger) { try { ScriptApp.deleteTrigger(trigger); } catch (_) {} });
  if (!triggers.length) ScriptApp.newTrigger(handler).timeBased().everyMinutes(5).create();
  return true;
}

function procesarOficinaVirtualProgramada_() {
  return procesarOficinaVirtual_({ force:false, origen:'PROGRAMADA', usuario:usuarioSistemaOficinaVirtual_() });
}

function resumenRapidoOficinaVirtual_(usuario) {
  const ultimo = leerUltimoResultadoOficinaVirtual_();
  const cachedTasks = leerCacheTareasOficinaVirtual_(usuario);
  return {
    nombre:'Oficina Virtual',
    version:VERSION_APLICACION,
    modoAutomatico:modoAutomaticoOficinaVirtual_(),
    puedeConfigurar:esAdministradorSistema_(usuario) && tienePermiso_(usuario, 'OFICINA_VIRTUAL', 'ACTUALIZAR'),
    estado:ultimo.estado || 'PENDIENTE',
    ultimaRevision:ultimo.fecha || PropertiesService.getScriptProperties().getProperty(OFICINA_VIRTUAL_ULTIMA_REVISION_) || '',
    problemas:Number(ultimo.problemas || 0),
    reparaciones:Number(ultimo.reparaciones || 0),
    avisosCreados:Number(ultimo.avisosCreados || 0),
    pendientesEnCache:Boolean(cachedTasks),
    totalTareas:cachedTasks ? cachedTasks.length : 0,
    tareasUrgentes:cachedTasks ? cachedTasks.filter(function(item) { return item.prioridad === 'Urgente'; }).length : 0
  };
}

function estadoRapidoOficinaVirtual_(request, session) {
  exigirPermiso_(session.user, 'OFICINA_VIRTUAL', 'LEER');
  return ok_(resumenRapidoOficinaVirtual_(session.user));
}

function consultarPendientesOficinaVirtual_(request, session) {
  exigirPermiso_(session.user, 'OFICINA_VIRTUAL', 'LEER');
  const force = request && (request.forzar === true || request.force === true || ['SI','TRUE','1'].indexOf(String(request.forzar || request.force || '').toUpperCase()) >= 0);
  const tasks = obtenerTareasOficinaVirtual_(session.user, { force:force });
  return ok_({
    tareas:tasks,
    totalTareas:tasks.length,
    tareasUrgentes:tasks.filter(function(item) { return item.prioridad === 'Urgente'; }).length,
    actualizadoEn:fechaIso_()
  });
}

function estadoOficinaVirtual_(request, session) {
  exigirPermiso_(session.user, 'OFICINA_VIRTUAL', 'LEER');
  const tasks = obtenerTareasOficinaVirtual_(session.user, {});
  return ok_(Object.assign({}, resumenRapidoOficinaVirtual_(session.user), {
    tareas:tasks,
    totalTareas:tasks.length,
    tareasUrgentes:tasks.filter(function(item) { return item.prioridad === 'Urgente'; }).length
  }));
}

function ejecutarRevisionOficinaVirtual_(request, session) {
  exigirPermiso_(session.user, 'OFICINA_VIRTUAL', 'LEER');
  if (normalizarRolSistema_(session.user.ROL_ID) === 'ROL-CONDUCTOR') {
    const report = registrarReporteConductorOficinaVirtual_('Solicito una revisión general del sistema desde Oficina Virtual.', session);
    return ok_(Object.assign({}, resumenRapidoOficinaVirtual_(session.user), {
      solicitudAdministrador:true,
      reporteCreado:Boolean(report && report.creado),
      mensaje:'La solicitud quedó informada a los Administradores. No se ejecutó ningún cambio.'
    }));
  }
  const jobId = encolarTrabajoSegundoPlano_('OFICINA_VIRTUAL_REVISION', {
    motivo:'Revisión manual',
    solicitadoPor:session.user.ID,
    solicitadoEn:fechaIso_()
  });
  return ok_(Object.assign({}, resumenRapidoOficinaVirtual_(session.user), {
    revisionEnCola:true,
    trabajoId:jobId || '',
    mensaje:'La revisión completa se inició en segundo plano.'
  }));
}

function configurarModoOficinaVirtual_(request, session) {
  exigirPermiso_(session.user, 'OFICINA_VIRTUAL', 'ACTUALIZAR');
  if (!esAdministradorSistema_(session.user)) throw new Error('SOLO_ADMINISTRADOR');
  const data = request.datos || request;
  const active = data.ACTIVO === true || ['SI','TRUE','1','ACTIVO'].indexOf(String(data.ACTIVO || data.activo || '').toUpperCase()) >= 0;
  PropertiesService.getScriptProperties().setProperty(OFICINA_VIRTUAL_MODO_AUTO_, active ? 'SI' : 'NO');
  registrarBitacora_(session.user, active ? 'ACTIVAR_MODO_AUTO' : 'DESACTIVAR_MODO_AUTO', 'OFICINA_VIRTUAL', '', 'Modo automático ' + (active ? 'activado' : 'desactivado'));
  try { encolarTrabajoSegundoPlano_('OFICINA_VIRTUAL_REVISION', { motivo:'Cambio de modo', solicitadoPor:session.user.ID }); } catch (_) {}
  return ok_({ activo:active, modoAutomatico:active });
}

function repararOficinaVirtual_(request, session) {
  exigirPermiso_(session.user, 'OFICINA_VIRTUAL', 'ACTUALIZAR');
  if (!esAdministradorSistema_(session.user)) throw new Error('SOLO_ADMINISTRADOR');
  const repair = aplicarReparacionesSegurasOficinaVirtual_();
  const diagnostic = diagnosticoOficinaVirtualInterno_();
  registrarBitacora_(session.user, 'REPARAR_SEGURO', 'OFICINA_VIRTUAL', '', 'Reparación segura aplicada. Estado posterior: ' + diagnostic.estado);
  return ok_({ reparacion:repair, diagnostico:diagnostic });
}

function respuestaAyudaOficinaVirtual_(consulta, session) {
  const text = normalizarConsultaOficinaVirtual_(consulta);
  const role = normalizarRolSistema_(session.user.ROL_ID);
  const suggestions = ['¿Qué tengo pendiente?', '¿Cómo funciona el GPS?', '¿Cómo uso un QR?', 'Revisar estado del sistema'];
  if (!text) return { respuesta:'Hola, soy Oficina Virtual. Puedo explicarte el Sistema de Gestión de Flotas, revisar tus pendientes y orientarte paso a paso. ¿Qué necesitas hacer?', sugerencias:suggestions };
  if (/(pendiente|por hacer|tarea|falta|vencid|document)/.test(text)) {
    const tasks = obtenerTareasOficinaVirtual_(session.user, {});
    if (!tasks.length) return { respuesta:'No tienes tareas ni documentos pendientes detectados en este momento.', sugerencias:['¿Cómo cargar un documento?', '¿Cómo iniciar una ruta?', 'Revisar estado del sistema'] };
    const detail = tasks.slice(0, 8).map(function(task, index) { return (index + 1) + '. ' + task.titulo + ': ' + task.detalle; }).join('\n');
    return { respuesta:'Encontré ' + tasks.length + ' pendiente(s) para tu usuario:\n' + detail + (tasks.length > 8 ? '\nHay ' + (tasks.length - 8) + ' pendiente(s) adicional(es) en el panel.' : ''), sugerencias:['Abrir Documentos', 'Abrir Rutas', '¿Cómo resuelvo un pendiente?'] };
  }
  if (/(estado|falla|error|diagnost|problema|lento|rapido)/.test(text)) {
    const last = leerUltimoResultadoOficinaVirtual_();
    return { respuesta:'La última revisión registra estado ' + (last.estado || 'sin revisión previa') + ', ' + Number(last.problemas || 0) + ' problema(s) y ' + Number(last.reparaciones || 0) + ' reparación(es) segura(s). Usa “Revisar ahora” para actualizar el diagnóstico.', sugerencias:['Revisar ahora', '¿Qué repara el modo automático?', '¿Qué tengo pendiente?'], accionSugerida:'REVISAR' };
  }
  if (/(gps|mapa|ubicacion|seguimiento|tiempo real)/.test(text)) {
    return { respuesta:'El GPS registra la posición del conductor y actualiza el mapa. En Conexiones en línea puedes seleccionar un usuario con ubicación válida, activar “Seguir” y ver su rastro reciente. La velocidad real depende de la señal del teléfono, la red y el intervalo de envío; el sistema prioriza la posición actual para evitar retrasos.', sugerencias:['¿Cómo seguir a un usuario?', '¿Por qué aparece GPS impreciso?', '¿Cómo iniciar una operación?'] };
  }
  if (/(ruta|naveg|waze|maps|destino)/.test(text)) {
    return { respuesta:'En Rutas se asignan conductor, vehículo, origen, destino y paradas. El conductor puede abrir la navegación compatible, registrar evidencias y completar la ruta. Si la ruta exige revisión vehicular, debe realizar el check-in antes de iniciarla.', sugerencias:['¿Cómo hago el check-in?', '¿Cómo escaneo el QR?', '¿Qué tengo pendiente?'] };
  }
  if (/(operacion|iniciar|finalizar|base|geocerca)/.test(text)) {
    return { respuesta:'Una operación valida conductor, vehículo, check-in y ubicación. Para iniciar o finalizar, el teléfono debe entregar una coordenada reciente y suficientemente precisa. El cierre fuera de la base requiere justificación y autorización según los permisos.', sugerencias:['¿Cómo mejorar la precisión GPS?', '¿Cómo funciona el check-in?', '¿Qué es el punto operacional?'] };
  }
  if (/(check.?in|revision|inspeccion|vehicular)/.test(text)) {
    return { respuesta:'El Check-in vehicular abre una lista de revisión del vehículo. El conductor marca cada punto, informa fallas y envía el formulario. Una falla crítica puede bloquear el vehículo hasta que un usuario autorizado revise y apruebe el registro.', sugerencias:['¿Cómo abrir el check-in con QR?', '¿Qué pasa si hay una falla crítica?', '¿Qué tengo pendiente?'] };
  }
  if (/(combust|carga|litro|boleta|estacion)/.test(text)) {
    return { respuesta:'En Combustible se registra vehículo, conductor, litros, precio, kilometraje, estación y comprobante. También puedes abrir el formulario mediante el QR asociado y el sistema calcula consumo y distancia cuando existen lecturas anteriores válidas.', sugerencias:['¿Cómo usar el QR de combustible?', '¿Cómo adjunto la boleta?', '¿Cómo corregir una carga?'] };
  }
  if (/(qr|codigo|escan)/.test(text)) {
    return { respuesta:'Los códigos QR identifican vehículos y pueden abrir formularios asociados, como Combustible y Check-in. Desde Android usa el lector QR, acepta el enlace interno y confirma los datos antes de guardar.', sugerencias:['Abrir formulario de combustible', 'Abrir check-in vehicular', '¿Qué hago si el QR no lee?'] };
  }
  if (/(notificacion|alerta|aviso)/.test(text)) {
    return { respuesta:'Las notificaciones se dirigen a usuarios o conductores específicos. Oficina Virtual también crea avisos personales por documentos vencidos, próximos a vencer, archivos faltantes, licencias, rutas asignadas y check-ins pendientes. Cada aviso indica dónde resolverlo.', sugerencias:['¿Qué tengo pendiente?', '¿Cómo marco un aviso como leído?', 'Revisar estado del sistema'] };
  }
  if (/(permiso|usuario|rol|administrador|supervisor|conductor)/.test(text)) {
    return { respuesta:'Los permisos dependen del rol y de la configuración individual. Tu perfil actual es ' + (session.user.ROL_NOMBRE || role) + '. Solo un Administrador puede activar el modo automático o aplicar reparaciones; cada usuario solo ve los datos autorizados para su cuenta.', sugerencias:['¿Qué puede hacer mi rol?', '¿Cómo funciona el modo automático?', '¿Qué tengo pendiente?'] };
  }
  if (/(login|sesion|entrar|contrasena)/.test(text)) {
    return { respuesta:'Para iniciar sesión usa el correo y contraseña registrados. Android ya incluye la URL del sistema. Si el acceso falla, revisa conexión, URL terminada en /exec, estado del usuario y versión del despliegue; no compartas tu contraseña por mensajes.', sugerencias:['¿Cómo cambio mi contraseña?', 'Revisar estado del sistema', '¿Dónde veo la versión?'] };
  }
  if (/(modo automatic|automatico|auto)/.test(text)) {
    return { respuesta:'El modo automático revisa el sistema cada cinco minutos, crea alertas y aplica únicamente reparaciones técnicas seguras: estructura de hojas, catálogos, cachés y activadores. No elimina datos ni modifica operaciones. Solo un Administrador puede activarlo o desactivarlo.', sugerencias:['Revisar estado del sistema', '¿Qué tengo pendiente?', '¿Qué reparaciones son seguras?'] };
  }
  if (/(que puedes|ayuda|funciona|explica|oficina virtual|hola|buen)/.test(text)) {
    return { respuesta:'Soy Oficina Virtual, el asistente del Sistema de Gestión de Flotas. Puedo explicar módulos, mostrar tus pendientes, orientar el uso de GPS, rutas, operaciones, check-in, combustible, QR, documentos, alertas y permisos, además de revisar fallas técnicas.', sugerencias:suggestions };
  }
  return { respuesta:'Puedo ayudarte con el funcionamiento del sistema o con tus pendientes. Escribe el nombre del módulo o describe qué intentas hacer; por ejemplo: “¿Cómo inicio una ruta?”, “¿Qué documentos tengo vencidos?” o “Revisar estado del sistema”.', sugerencias:suggestions };
}

function registrarReporteConductorOficinaVirtual_(consulta, session) {
  if (normalizarRolSistema_(session && session.user && session.user.ROL_ID) !== 'ROL-CONDUCTOR') return null;
  const question = String(consulta || '').trim().slice(0, 1200);
  const text = normalizarConsultaOficinaVirtual_(question);
  const issue = /(falla|error|problema|no funciona|no puedo|se cae|lento|lentitud|trabado|bloqueado|riesgo|incidente)/.test(text);
  const instruction = /(cambia|cambiar|modifica|modificar|configura|configurar|activa|activar|desactiva|desactivar|repara|reparar|elimina|eliminar|instala|instalar|actualiza|actualizar).*(sistema|permiso|usuario|modo|configuracion|alerta|oficina)/.test(text);
  const explicitReview = /solicito una revision general del sistema/.test(text);
  if (!issue && !instruction && !explicitReview) return null;
  const day = Utilities.formatDate(new Date(), CONFIGURACION_APLICACION.ZONA_HORARIA, 'yyyyMMdd');
  const key = huellaEvento_('OV-REPORTE', [session.user.ID, text.slice(0, 400), day]);
  const result = crearAlertaUnica_({
    TIPO:'Reporte de conductor',
    NIVEL:issue ? 'Advertencia' : 'Info',
    TITULO:'Oficina Virtual: reporte de ' + (session.user.NOMBRE || session.user.ID),
    MENSAJE:'El Conductor informó: “' + question + '”. Oficina Virtual no ejecutó cambios. Un Administrador debe revisar y validar la situación.',
    MODULO:'OFICINA_VIRTUAL',
    REGISTRO_ID:session.user.ID,
    CLAVE_UNICA:key,
    USUARIO_ID:''
  });
  return { creado:Boolean(result && result.created), instruccion:instruction, alertaId:result && result.row ? result.row.ID : '' };
}

function consultarOficinaVirtual_(request, session) {
  exigirPermiso_(session.user, 'OFICINA_VIRTUAL', 'CREAR');
  const data = request.datos || request;
  const question = String(data.MENSAJE || data.mensaje || data.PREGUNTA || data.pregunta || '').trim().slice(0, 1200);
  if (!question) throw new Error('CONSULTA_REQUERIDA');
  const report = registrarReporteConductorOficinaVirtual_(question, session);
  const response = respuestaAyudaOficinaVirtual_(question, session);
  if (report && report.instruccion) {
    response.respuesta = 'Tu cuenta de Conductor no puede ordenar ni ejecutar cambios en el sistema. Registré tu solicitud como un reporte para los Administradores; Oficina Virtual solo sirve de puente y no modificó ninguna configuración.';
    response.sugerencias = ['Explicar la falla', '¿Qué tengo pendiente?', '¿Cómo funciona mi módulo?'];
  } else if (report) {
    response.respuesta += '\n\nTu reporte quedó informado a los Administradores y permanecerá pendiente hasta que uno de ellos lo valide. No se ejecutó ningún cambio.';
  }
  registrarBitacora_(session.user, 'CONSULTAR_ASISTENTE', 'OFICINA_VIRTUAL', '', 'Consulta atendida por Oficina Virtual: ' + question.slice(0, 180));
  return ok_({
    nombre:'Oficina Virtual',
    respuesta:response.respuesta,
    sugerencias:response.sugerencias || [],
    accionSugerida:response.accionSugerida || '',
    generadoEn:fechaIso_()
  });
}

/** ============================================================
 * ARCHIVO: 25_Importacion_Masiva_y_Seguridad.gs
 * ============================================================ */
/** Importación masiva, registro de IP y reglas de seguridad adicionales. */

function normalizarIpPublica_(value) {
  const ip = String(value || '').trim().slice(0, 80);
  if (!ip) return '';
  // Admite IPv4 e IPv6. Se limita a caracteres válidos para evitar almacenar texto arbitrario.
  return /^[0-9a-fA-F:.]+$/.test(ip) ? ip : '';
}

function versionIp_(value) {
  const ip = normalizarIpPublica_(value);
  if (!ip) return '';
  return ip.indexOf(':') >= 0 ? 'IPv6' : 'IPv4';
}

function registrarIpConexion_(request, session) {
  const data = request.datos || request || {};
  const ip = normalizarIpPublica_(data.IP_PUBLICA || data.ipPublica || '');
  if (!ip) return ok_({ registrada:false, motivo:'IP_NO_DISPONIBLE' });
  const now = new Date();
  actualizarRegistro_('SESIONES', session.session.ID, {
    IP_PUBLICA: ip,
    IP_VERSION: versionIp_(ip),
    IP_CAPTURADA_EN: now,
    ULTIMO_USO: now
  });
  const deviceId = String(data.DISPOSITIVO_ID || '').slice(0, 120);
  const clientSessionId = String(data.SESION_CLIENTE_ID || '').slice(0, 120);
  listarRegistros_('CONEXIONES', {}).filter(function(row) {
    return row.SESION_ID === session.session.ID
      && (!deviceId || row.DISPOSITIVO_ID === deviceId)
      && (!clientSessionId || String(row.SESION_CLIENTE_ID || '') === clientSessionId);
  }).forEach(function(row) {
    actualizarRegistro_('CONEXIONES', row.ID, {
      IP_PUBLICA: ip,
      IP_VERSION: versionIp_(ip),
      IP_CAPTURADA_EN: now
    });
  });
  session.session.IP_PUBLICA = ip;
  session.session.IP_VERSION = versionIp_(ip);
  session.session.IP_CAPTURADA_EN = now;
  registrarBitacora_(session.user, 'REGISTRAR_IP', 'SEGURIDAD', session.session.ID, 'Dirección IP pública registrada al conectar', ip);
  return ok_({ registrada:true, ipVersion:versionIp_(ip), fecha:fechaIso_() });
}

const DEFINICIONES_IMPORTACION_MASIVA_ = Object.freeze({
  vehiculos: {
    sheet:'VEHICULOS', module:'VEHICULOS', prefix:'VEH',
    required:['PATENTE','MARCA','MODELO'],
    fields:['PATENTE','MARCA','MODELO','ANIO','COLOR','COMBUSTIBLE','VIN','KILOMETRAJE','ESTADO','QR_CODIGO','PROXIMA_MANTENCION'],
    key:function(row) { return 'PATENTE:' + String(row.PATENTE || '').replace(/[^A-Z0-9]/gi,'').toUpperCase(); }
  },
  conductores: {
    sheet:'CONDUCTORES', module:'CONDUCTORES', prefix:'CON',
    required:['NOMBRE','RUT'],
    fields:['NOMBRE','RUT','TELEFONO','CORREO','LICENCIA_CLASE','LICENCIA_VENCIMIENTO','ESTADO','USUARIO_ID'],
    key:function(row) { return 'RUT:' + String(row.RUT || '').replace(/[^0-9Kk]/g,'').toUpperCase(); }
  },
  documentos: {
    sheet:'DOCUMENTOS', module:'DOCUMENTOS', prefix:'DOC',
    required:['TIPO','ASOCIADO_TIPO','IDENTIFICACION','FECHA_VENCIMIENTO'],
    fields:['TIPO','ASOCIADO_TIPO','ASOCIADO_ID','IDENTIFICACION','FECHA_EMISION','FECHA_VENCIMIENTO','ESTADO','DIRECCION_ARCHIVO','OBSERVACIONES'],
    key:function(row) {
      return ['DOC',row.TIPO,row.ASOCIADO_TIPO,row.IDENTIFICACION,row.FECHA_VENCIMIENTO]
        .map(function(value){ return String(value || '').trim().toUpperCase(); }).join(':');
    }
  }
});

function normalizarCabeceraImportacion_(key) {
  return String(key || '').trim().toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function normalizarFilaImportacion_(input) {
  const row = {};
  Object.keys(input || {}).forEach(function(key) {
    const normalized = normalizarCabeceraImportacion_(key);
    if (normalized) row[normalized] = input[key];
  });
  return row;
}

function textoImportacion_(value) {
  return String(value == null ? '' : value).trim();
}

function validarFilaImportacion_(definition, row, lineNumber) {
  definition.required.forEach(function(field) {
    if (!textoImportacion_(row[field])) throw new Error('FILA_' + lineNumber + '_CAMPO_REQUERIDO_' + field);
  });
  if (definition.sheet === 'VEHICULOS') {
    row.PATENTE = textoImportacion_(row.PATENTE).toUpperCase();
    row.ESTADO = textoImportacion_(row.ESTADO) || 'Disponible';
    row.KILOMETRAJE = row.KILOMETRAJE === '' || row.KILOMETRAJE == null ? 0 : Number(row.KILOMETRAJE);
    if (!isFinite(row.KILOMETRAJE) || row.KILOMETRAJE < 0) throw new Error('FILA_' + lineNumber + '_KILOMETRAJE_INVALIDO');
    if (row.ANIO !== '' && row.ANIO != null) {
      row.ANIO = Number(row.ANIO);
      if (!isFinite(row.ANIO) || row.ANIO < 1900 || row.ANIO > 2200) throw new Error('FILA_' + lineNumber + '_ANIO_INVALIDO');
    }
    if (!textoImportacion_(row.QR_CODIGO)) row.QR_CODIGO = 'VEH-' + row.PATENTE.replace(/[^A-Z0-9]/g,'');
  }
  if (definition.sheet === 'CONDUCTORES') {
    row.NOMBRE = textoImportacion_(row.NOMBRE);
    row.RUT = textoImportacion_(row.RUT).toUpperCase();
    row.CORREO = textoImportacion_(row.CORREO).toLowerCase();
    row.ESTADO = textoImportacion_(row.ESTADO) || 'Disponible';
  }
  if (definition.sheet === 'DOCUMENTOS') {
    row.TIPO = textoImportacion_(row.TIPO);
    row.ASOCIADO_TIPO = textoImportacion_(row.ASOCIADO_TIPO);
    row.IDENTIFICACION = textoImportacion_(row.IDENTIFICACION).toUpperCase();
    row.ESTADO = textoImportacion_(row.ESTADO) || 'Vigente';
    if (['Vehículo','Conductor','Empresa'].indexOf(row.ASOCIADO_TIPO) < 0) throw new Error('FILA_' + lineNumber + '_ASOCIADO_TIPO_INVALIDO');
  }
  return row;
}

function resolverAsociacionDocumentoImportado_(row, context) {
  if (textoImportacion_(row.ASOCIADO_ID)) return row;
  if (row.ASOCIADO_TIPO === 'Vehículo') {
    const normalized = String(row.IDENTIFICACION || '').replace(/[^A-Z0-9]/gi,'').toUpperCase();
    const vehicle = context && context.vehicles ? context.vehicles[normalized] : listarRegistros_('VEHICULOS', {}).find(function(item) {
      return String(item.PATENTE || '').replace(/[^A-Z0-9]/gi,'').toUpperCase() === normalized;
    });
    if (!vehicle) throw new Error('VEHICULO_ASOCIADO_NO_ENCONTRADO_' + row.IDENTIFICACION);
    row.ASOCIADO_ID = vehicle.ID;
  } else if (row.ASOCIADO_TIPO === 'Conductor') {
    const normalized = String(row.IDENTIFICACION || '').replace(/[^0-9Kk]/g,'').toUpperCase();
    const driver = context && context.drivers ? context.drivers[normalized] : listarRegistros_('CONDUCTORES', {}).find(function(item) {
      return String(item.RUT || '').replace(/[^0-9Kk]/g,'').toUpperCase() === normalized;
    });
    if (!driver) throw new Error('CONDUCTOR_ASOCIADO_NO_ENCONTRADO_' + row.IDENTIFICACION);
    row.ASOCIADO_ID = driver.ID;
  } else {
    const company = context && context.company ? context.company : obtenerEmpresaPrincipal_();
    if (!company) throw new Error('EMPRESA_ASOCIADA_NO_ENCONTRADA');
    row.ASOCIADO_ID = company.ID;
  }
  return row;
}

function importarMasivoServicio_(request, session) {
  const resourceName = String(request.recurso || request.resource || '').trim();
  const definition = DEFINICIONES_IMPORTACION_MASIVA_[resourceName];
  if (!definition) throw new Error('RECURSO_IMPORTACION_NO_PERMITIDO');
  exigirPermiso_(session.user, definition.module, 'CREAR');
  const data = request.datos || request || {};
  const inputRows = Array.isArray(data.filas) ? data.filas : Array.isArray(request.filas) ? request.filas : [];
  const maximum = Number(CONFIGURACION_APLICACION.MAXIMO_FILAS_IMPORTACION || 1500);
  if (!inputRows.length) throw new Error('IMPORTACION_SIN_FILAS');
  if (inputRows.length > maximum) throw new Error('IMPORTACION_DEMASIADAS_FILAS');
  const updateExisting = String(data.actualizarExistentes || request.actualizarExistentes || 'SI') !== 'NO';
  if (updateExisting) exigirPermiso_(session.user, definition.module, 'ACTUALIZAR');

  asegurarHoja_(definition.sheet);
  const sheet = obtenerHoja_(definition.sheet);
  const headers = ESQUEMAS_APLICACION[definition.sheet];
  const lastRow = sheet.getLastRow();
  const physicalRows = lastRow > 1 ? sheet.getRange(2,1,lastRow-1,headers.length).getValues() : [];
  const objects = physicalRows.map(function(values) {
    const object = {};
    headers.forEach(function(header,index){ object[header] = values[index]; });
    return object;
  });
  const indexes = {};
  objects.forEach(function(row,index) {
    if (String(row.ELIMINADO || 'NO') === 'SI') return;
    const key = definition.key(row);
    if (key && !Object.prototype.hasOwnProperty.call(indexes, key)) indexes[key] = index;
  });

  const now = new Date();

  const associationContext = definition.sheet === 'DOCUMENTOS' ? {
    vehicles: listarRegistros_('VEHICULOS', {}).reduce(function(map, item) {
      map[String(item.PATENTE || '').replace(/[^A-Z0-9]/gi,'').toUpperCase()] = item; return map;
    }, {}),
    drivers: listarRegistros_('CONDUCTORES', {}).reduce(function(map, item) {
      map[String(item.RUT || '').replace(/[^0-9Kk]/g,'').toUpperCase()] = item; return map;
    }, {}),
    company: obtenerEmpresaPrincipal_()
  } : null;
  const seenInput = {};
  const errors = [];
  let inserted = 0, updated = 0, skipped = 0;
  inputRows.forEach(function(rawRow,index) {
    const line = index + 2;
    try {
      let row = normalizarFilaImportacion_(rawRow);
      const filtered = {};
      definition.fields.forEach(function(field) {
        if (Object.prototype.hasOwnProperty.call(row, field)) filtered[field] = row[field];
      });
      row = validarFilaImportacion_(definition, filtered, line);
      if (definition.sheet === 'DOCUMENTOS') row = resolverAsociacionDocumentoImportado_(row, associationContext);
      row = normalizarEntradaRecurso_(definition.sheet, row, session.user);
      const key = definition.key(row);
      if (!key || /:$/.test(key)) throw new Error('FILA_' + line + '_CLAVE_INVALIDA');
      if (seenInput[key]) throw new Error('FILA_' + line + '_DUPLICADA_EN_ARCHIVO');
      seenInput[key] = true;
      const existingIndex = Object.prototype.hasOwnProperty.call(indexes, key) ? indexes[key] : -1;
      if (existingIndex >= 0) {
        if (!updateExisting) { skipped += 1; return; }
        const current = objects[existingIndex];
        Object.keys(row).forEach(function(field) {
          if (headers.indexOf(field) >= 0 && ['ID','CREADO_EN','ELIMINADO'].indexOf(field) < 0) current[field] = row[field];
        });
        current.ACTUALIZADO_EN = now;
        current.ELIMINADO = 'NO';
        updated += 1;
      } else {
        const created = Object.assign({}, row, {
          ID: generarId_(definition.prefix),
          CREADO_EN: now,
          ACTUALIZADO_EN: now,
          ELIMINADO: 'NO'
        });
        objects.push(created);
        indexes[key] = objects.length - 1;
        inserted += 1;
      }
    } catch (error) {
      errors.push({ fila:line, error:String(error && error.message ? error.message : error) });
    }
  });

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const matrix = objects.map(function(object) {
      return headers.map(function(header) {
        return deserializarFecha_(Object.prototype.hasOwnProperty.call(object, header) ? object[header] : '');
      });
    });
    if (matrix.length) sheet.getRange(2,1,matrix.length,headers.length).setValues(matrix);
    SpreadsheetApp.flush();
    invalidarCacheHoja_(definition.sheet);
  } finally {
    lock.releaseLock();
  }
  const ip = normalizarIpPublica_(data.IP_PUBLICA || session.session.IP_PUBLICA || '');
  registrarBitacora_(session.user, 'IMPORTAR_MASIVO', definition.module, '', 'Importación masiva: ' + inserted + ' creados, ' + updated + ' actualizados, ' + skipped + ' omitidos, ' + errors.length + ' con error', ip);
  return ok_({
    recurso:resourceName,
    totalRecibidas:inputRows.length,
    creadas:inserted,
    actualizadas:updated,
    omitidas:skipped,
    errores:errors,
    correcto:errors.length === 0,
    serverTime:fechaIso_()
  });
}

/** ============================================================
 * ARCHIVO: 26_Punto_Operacional_Dispositivo.gs
 * ============================================================ */
/** Sincronización del punto operacional confirmado con los dispositivos. */
function obtenerPuntoOperacionServicio_(request, session) {
  const company = obtenerEmpresaPrincipal_();
  const point = puntoOperacionDesdeEmpresa_(company) || obtenerRespaldoPuntoOperacion_();
  if (!point) {
    return ok_({
      configurado: false,
      confirmado: false,
      row: company ? limpiarSalidaRecurso_('EMPRESAS', company) : null,
      point: null
    });
  }
  return ok_({
    configurado: true,
    confirmado: true,
    row: company ? limpiarSalidaRecurso_('EMPRESAS', company) : null,
    point: point,
    sincronizadoEn: fechaIso_()
  });
}

/** ============================================================
 * ARCHIVO: 27_Combustible.gs
 * ============================================================ */
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
  const isAdmin = session && session.user && esAdministradorSistema_(session.user);
  let operationId = String(data.OPERACION_ID !== undefined ? data.OPERACION_ID : (existing && existing.OPERACION_ID) || '').trim();
  let routeId = String(data.RUTA_ID !== undefined ? data.RUTA_ID : (existing && existing.RUTA_ID) || '').trim();
  let vehicleId = String(data.VEHICULO_ID !== undefined ? data.VEHICULO_ID : (existing && existing.VEHICULO_ID) || '').trim();
  let driverId = String(data.CONDUCTOR_ID !== undefined ? data.CONDUCTOR_ID : (existing && existing.CONDUCTOR_ID) || '').trim();
  let operation = null;
  let route = null;
  const driverSession = session && session.user && session.user.ROL_ID === 'ROL-CONDUCTOR' ? conductorDeUsuario_(session.user.ID) : null;
  if (session && session.user && session.user.ROL_ID === 'ROL-CONDUCTOR' && !driverSession) throw new Error('CONDUCTOR_NO_ASOCIADO_USUARIO');

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

  if (driverSession) {
    driverId = driverSession.ID;
    if (operation && String(operation.CONDUCTOR_ID || '') !== String(driverSession.ID)) throw new Error('COMBUSTIBLE_OPERACION_NO_AUTORIZADA');
    if (route && String(route.CONDUCTOR_ID || '') !== String(driverSession.ID)) throw new Error('COMBUSTIBLE_RUTA_NO_AUTORIZADA');
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
  const data = request.datos || {};
  const validadoPorQr = consumirAutorizacionQr_(data.AUTORIZACION_QR, session, data.VEHICULO_ID, 'combustible', false);
  const clean = validarCargaCombustible_(data, null, session, true);
  clean.CREADO_POR = session.user.ID;
  clean.ACTUALIZADO_POR = session.user.ID;
  clean.ELIMINADO = 'NO';
  const row = insertarRegistro_('CARGAS_COMBUSTIBLE', clean, 'COM');
  recalcularConsumosVehiculo_(row.VEHICULO_ID);
  const updated = obtenerRegistro_('CARGAS_COMBUSTIBLE', row.ID);
  registrarBitacora_(session.user, 'CREAR_CARGA', 'COMBUSTIBLE', row.ID, 'Carga registrada' + (validadoPorQr ? ' mediante QR' : '') + '. Datos: ' + respaldoAuditoria_(updated), ipSolicitudCombustible_(request));
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const vehicle = obtenerRegistro_('VEHICULOS', clean.VEHICULO_ID) || {};
    const driver = obtenerRegistro_('CONDUCTORES', clean.CONDUCTOR_ID) || {};
    notificarRolesInterno_(['ROL-ADMIN'], {
      TITULO:'Combustible informado por conductor',
      MENSAJE:(driver.NOMBRE || session.user.NOMBRE || clean.CONDUCTOR_ID) + ' (' + (session.user.CORREO || 'sin correo') + ') informó ' + clean.LITROS + ' L para ' + (vehicle.PATENTE || clean.VEHICULO_ID) + ' · costo ' + clean.COSTO_TOTAL + ' · ' + fechaIso_() + '.',
      TIPO:'Combustible', PRIORIDAD:'Normal', OPERACION_ID:clean.OPERACION_ID, RUTA_ID:clean.RUTA_ID, CREADO_POR:session.user.ID, CLAVE_UNICA:'COMBUSTIBLE-CONDUCTOR-' + row.ID
    });
  } else if (session.user.ROL_ID === 'ROL-SUPERVISOR') {
    notificarRolesInterno_(['ROL-ADMIN'], { TITULO:'Nueva carga de combustible', MENSAJE:session.user.NOMBRE + ' registró ' + clean.LITROS + ' L para el vehículo ' + clean.VEHICULO_ID + '.', TIPO:'Combustible', PRIORIDAD:'Normal', OPERACION_ID:clean.OPERACION_ID, RUTA_ID:clean.RUTA_ID, CREADO_POR:session.user.ID, CLAVE_UNICA:'COMBUSTIBLE-SUPERVISOR-' + row.ID });
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
  notificarRolesInterno_(['ROL-ADMIN'], { TITULO:'Autorización de eliminación pendiente', MENSAJE:session.user.NOMBRE + ' solicita eliminar la carga ' + chargeId + '. Motivo: ' + reason, TIPO:'Combustible', PRIORIDAD:'Alta', CREADO_POR:session.user.ID, CLAVE_UNICA:'COMBUSTIBLE-SOLICITUD-' + row.ID });
  return ok_({ row:limpiarSalidaRecurso_('AUTORIZACIONES_ELIMINACION_COMBUSTIBLE', row) });
}

function resolverSolicitudEliminacionCombustible_(request, session) {
  if (!esAdministradorSistema_(session.user)) throw new Error('SOLO_ADMINISTRADOR');
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
  notificarUsuarioInterno_(authorization.SOLICITADO_POR, { TITULO:decision === 'APROBAR' ? 'Eliminación autorizada' : 'Eliminación rechazada', MENSAJE:'La solicitud ' + requestId + ' para la carga ' + authorization.CARGA_ID + ' fue ' + statusValue.toLowerCase() + ' por ' + session.user.NOMBRE + '.', TIPO:'Combustible', PRIORIDAD:decision === 'APROBAR' ? 'Alta' : 'Normal', CREADO_POR:session.user.ID, CLAVE_UNICA:'COMBUSTIBLE-SOLICITUD-RESULTADO-' + requestId + '-' + statusValue });
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
    notificarUsuarioInterno_(authorization.AUTORIZADO_POR, { TITULO:'Eliminación ejecutada', MENSAJE:session.user.NOMBRE + ' ejecutó la eliminación autorizada de la carga ' + chargeId + '.', TIPO:'Combustible', PRIORIDAD:'Normal', CREADO_POR:session.user.ID, CLAVE_UNICA:'COMBUSTIBLE-ELIMINADA-' + chargeId + '-' + authorization.ID });
  } else if (esAdministradorSistema_(session.user)) {
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

/** ============================================================
 * ARCHIVO: 28_Procesos_Segundo_Plano.gs
 * ============================================================ */
/**
 * COLA DE PROCESOS SECUNDARIOS
 * Libera la respuesta principal y ejecuta historial, auditoría, alertas y notificaciones mediante activador temporal.
 */
const COLA_SEGUNDO_PLANO_INDICE_ = 'FLOTAS_COLA_SEGUNDO_PLANO_INDICE_V1';
const COLA_SEGUNDO_PLANO_TRIGGER_ = 'FLOTAS_COLA_SEGUNDO_PLANO_TRIGGER_V1';
const COLA_SEGUNDO_PLANO_PREFIJO_ = 'FLOTAS_TRABAJO_SEGUNDO_PLANO_';

function resumenUsuarioSegundoPlano_(user) {
  return { ID:String(user && user.ID || ''), NOMBRE:String(user && user.NOMBRE || ''), CORREO:String(user && user.CORREO || ''), ROL_ID:String(user && user.ROL_ID || '') };
}

function encolarTrabajoSegundoPlano_(tipo, datos) {
  const properties = PropertiesService.getScriptProperties();
  const lock = LockService.getScriptLock();
  const jobId = Utilities.getUuid();
  const jobData = datos || {};
  const job = { id:jobId, tipo:String(tipo || ''), datos:jobData, intentos:Number(jobData.__intentos || 0), creadoEn:fechaIso_() };
  try {
    lock.waitLock(5000);
    let ids = [];
    try { ids = JSON.parse(properties.getProperty(COLA_SEGUNDO_PLANO_INDICE_) || '[]'); } catch (error) { ids = []; }
    properties.setProperty(COLA_SEGUNDO_PLANO_PREFIJO_ + jobId, JSON.stringify(job));
    ids.push(jobId);
    properties.setProperty(COLA_SEGUNDO_PLANO_INDICE_, JSON.stringify(ids.slice(-250)));
    if (properties.getProperty(COLA_SEGUNDO_PLANO_TRIGGER_) !== 'SI') {
      properties.setProperty(COLA_SEGUNDO_PLANO_TRIGGER_, 'SI');
      ScriptApp.newTrigger('procesarColaSegundoPlano_').timeBased().after(1000).create();
    }
    return jobId;
  } catch (error) {
    console.error('No se pudo encolar proceso secundario', error);
    try {
      properties.deleteProperty(COLA_SEGUNDO_PLANO_PREFIJO_ + jobId);
      let ids = JSON.parse(properties.getProperty(COLA_SEGUNDO_PLANO_INDICE_) || '[]');
      properties.setProperty(COLA_SEGUNDO_PLANO_INDICE_, JSON.stringify(ids.filter(function(id) { return id !== jobId; })));
      properties.deleteProperty(COLA_SEGUNDO_PLANO_TRIGGER_);
    } catch (_) {}
    try { procesarTrabajoSegundoPlano_(job); } catch (fallbackError) { console.error(fallbackError); }
    return '';
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function procesarColaSegundoPlano_() {
  const properties = PropertiesService.getScriptProperties();
  const lock = LockService.getScriptLock();
  let jobs = [];
  try {
    lock.waitLock(5000);
    let ids = [];
    try { ids = JSON.parse(properties.getProperty(COLA_SEGUNDO_PLANO_INDICE_) || '[]'); } catch (error) { ids = []; }
    const processing = ids.splice(0, 8);
    properties.setProperty(COLA_SEGUNDO_PLANO_INDICE_, JSON.stringify(ids));
    properties.deleteProperty(COLA_SEGUNDO_PLANO_TRIGGER_);
    jobs = processing.map(function(id) {
      const raw = properties.getProperty(COLA_SEGUNDO_PLANO_PREFIJO_ + id);
      properties.deleteProperty(COLA_SEGUNDO_PLANO_PREFIJO_ + id);
      try { return raw ? JSON.parse(raw) : null; } catch (error) { return null; }
    }).filter(Boolean);
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }

  jobs.forEach(function(job) {
    try { procesarTrabajoSegundoPlano_(job); }
    catch (error) {
      console.error('Error en proceso secundario ' + job.tipo, error);
      job.intentos = Number(job.intentos || 0) + 1;
      if (job.intentos < 3) { job.datos.__intentos = job.intentos; encolarTrabajoSegundoPlano_(job.tipo, job.datos); }
    }
  });

  let pending = [];
  try { pending = JSON.parse(properties.getProperty(COLA_SEGUNDO_PLANO_INDICE_) || '[]'); } catch (error) { pending = []; }
  if (pending.length && properties.getProperty(COLA_SEGUNDO_PLANO_TRIGGER_) !== 'SI') {
    properties.setProperty(COLA_SEGUNDO_PLANO_TRIGGER_, 'SI');
    ScriptApp.newTrigger('procesarColaSegundoPlano_').timeBased().after(1000).create();
  }
}

function procesarTrabajoSegundoPlano_(job) {
  if (!job || !job.tipo) return;
  const data = job.datos || {};
  if (job.tipo === 'MOTOR_ALERTAS') { ejecutarMotorAlertasAutomaticas_({ force:true }); generarAvisosPersonalesOficinaVirtual_(); return; }
  if (job.tipo === 'OFICINA_VIRTUAL_REVISION') { procesarOficinaVirtual_({ force:true, origen:'SEGUNDO_PLANO', usuario:usuarioSistemaOficinaVirtual_() }); return; }
  if (job.tipo === 'INICIO_OPERACION') {
    insertarRegistro_('HISTORIAL', { OPERACION_ID:data.operacionId, EVENTO:'INICIO', DETALLE:data.detalle, FECHA_HORA:new Date(), USUARIO_ID:data.usuario && data.usuario.ID || '', ELIMINADO:'NO' }, 'HIS');
    registrarBitacora_(data.usuario || {}, 'INICIAR', 'OPERACIONES', data.operacionId, (data.patente || '') + ' / ' + (data.conductor || '') + ' / ubicación validada', data.ip || '');
    return;
  }
  if (job.tipo === 'CIERRE_RUTA') {
    const senderRoute = data.usuario || {};
    const senderIdentityRoute = (senderRoute.NOMBRE || senderRoute.ID || 'Usuario') + ' (' + (senderRoute.CORREO || 'sin correo') + ') · usuario ' + (senderRoute.ID || 'sin ID');
    const routeMessage = [
      'Enviado por: ' + senderIdentityRoute + '.',
      'Conductor: ' + ((data.conductor && (data.conductor.nombre || data.conductor.id)) || 'Sin conductor') + '.',
      'Vehículo: ' + ((data.vehiculo && (data.vehiculo.patente || data.vehiculo.id)) || 'Sin vehículo') + '.',
      'Ruta: ' + (data.nombreRuta || data.rutaId || 'Sin nombre') + ' (' + (data.rutaId || 'sin ID') + ').',
      'Recorrido: ' + (data.origen || 'Sin origen') + ' → ' + (data.destino || 'Sin destino') + '.',
      'Fecha y hora: ' + (data.fechaHora || fechaIso_()) + '.',
      data.finalizadaPorConductor ? 'La finalización fue ejecutada por una cuenta de Conductor.' : 'La finalización fue ejecutada por una cuenta administrativa.'
    ].join(' ');
    registrarBitacora_(senderRoute, 'FINALIZAR', 'RUTAS', data.rutaId || '', routeMessage, data.ip || '');
    notificarRolesInterno_(['ROL-ADMIN'], { TITULO:'Ruta finalizada: ' + (data.nombreRuta || data.rutaId || ''), MENSAJE:routeMessage, TIPO:'Ruta finalizada', PRIORIDAD:'Alta', RUTA_ID:data.rutaId || '', OPERACION_ID:data.operacionId || '', CREADO_POR:senderRoute.ID || '', CLAVE_UNICA:'RUTA-FINALIZADA-' + (data.rutaId || data.operacionId || '') });
    return;
  }
  if (job.tipo === 'CIERRE_SESION') {
    listarRegistros_('CONEXIONES', {}).filter(function(row) { return String(row.SESION_ID || '') === String(data.sesionId || ''); }).forEach(function(row) {
      actualizarRegistro_('CONEXIONES', row.ID, { ESTADO:'Desconectado', ACTIVIDAD:'Inactivo', PAGINA_VISIBLE:'NO', ULTIMA_CONEXION:new Date(data.fechaHora || Date.now()) });
    });
    try {
      listarRegistros_('CONEXIONES_ACTUAL', {}).filter(function(row) { return String(row.SESION_ID || '') === String(data.sesionId || ''); }).forEach(function(row) {
        actualizarRegistro_('CONEXIONES_ACTUAL', row.ID, { ESTADO:'Desconectado', ACTIVIDAD:'Inactivo', PAGINA_VISIBLE:'NO', ULTIMA_CONEXION:new Date(data.fechaHora || Date.now()) });
      });
      invalidarCacheTiempoReal_('CONEXIONES_ACTUAL');
    } catch (_) {}
    registrarBitacora_(data.usuario || {}, 'CIERRE_SESION', 'SEGURIDAD', data.usuario && data.usuario.ID || '', 'Cierre de sesión');
    return;
  }
  if (job.tipo !== 'CIERRE_OPERACION') return;

  insertarRegistro_('HISTORIAL', { OPERACION_ID:data.operacionId, EVENTO:data.evento || 'FIN', DETALLE:data.detalle || '', FECHA_HORA:new Date(data.fechaHora || Date.now()), USUARIO_ID:data.usuario && data.usuario.ID || '', ELIMINADO:'NO' }, 'HIS');
  registrarBitacora_(data.usuario || {}, data.accionAuditoria || 'FINALIZAR', 'OPERACIONES', data.operacionId, data.detalle || '', data.ip || '');

  if (data.excepcional) {
    crearAlertaUnica_({ TIPO:'Cierre excepcional', NIVEL:'Advertencia', TITULO:'Operación finalizada fuera de la base', MENSAJE:data.operacionId + ' fue cerrada por ' + (data.usuario && data.usuario.NOMBRE || data.usuario && data.usuario.ID || 'usuario') + ' a ' + data.distanciaMetros + ' m de la base. Motivo: ' + (data.motivo || ''), MODULO:'OPERACIONES', REGISTRO_ID:data.operacionId, CLAVE_UNICA:'CIERRE-EXCEPCIONAL-' + data.operacionId, USUARIO_ID:'' });
  } else if (data.precisionBaja) {
    crearAlertaUnica_({ TIPO:'GPS impreciso', NIVEL:'Advertencia', TITULO:'Cierre aceptado con baja precisión GPS', MENSAJE:data.operacionId + ' finalizó con precisión ±' + data.precisionMetros + ' m y distancia calculada ' + data.distanciaMetros + ' m.', MODULO:'OPERACIONES', REGISTRO_ID:data.operacionId, CLAVE_UNICA:'CIERRE-GPS-IMPRECISO-' + data.operacionId, USUARIO_ID:'' });
  }

  const sender = data.usuario || {};
  const senderIdentity = (sender.NOMBRE || sender.ID || 'Usuario') + ' (' + (sender.CORREO || 'sin correo') + ') · usuario ' + (sender.ID || 'sin ID');
  const message = [
    'Enviado por: ' + senderIdentity + '.',
    'Conductor: ' + ((data.conductor && data.conductor.nombre) || (data.conductor && data.conductor.id) || 'Sin conductor') + '.',
    'Vehículo: ' + ((data.vehiculo && data.vehiculo.patente) || (data.vehiculo && data.vehiculo.id) || 'Sin vehículo') + '.',
    'Ruta: ' + ((data.ruta && (data.ruta.nombre || data.ruta.id)) || 'Sin ruta asignada') + '.',
    'Fecha y hora: ' + (data.fechaHora || fechaIso_()) + '.',
    'Cierre: ' + (data.cierreTipo || 'Finalizada') + '.',
    'Base: ' + ((data.base && data.base.nombre) || 'Base operacional') + ' · ' + ((data.base && data.base.direccion) || 'sin dirección') + '.',
    'Distancia: ' + Number(data.distanciaMetros || 0) + ' m.',
    'Validación: ' + (data.validacion || 'VALIDADA') + '.',
    'Observaciones: ' + (data.observaciones || 'Sin observaciones') + '.'
  ].join(' ');
  notificarRolesInterno_(['ROL-ADMIN'], { TITULO:'Ruta/operación finalizada: ' + data.operacionId, MENSAJE:message, TIPO:'Operación finalizada', PRIORIDAD:data.excepcional || data.precisionBaja ? 'Alta' : 'Normal', RUTA_ID:data.rutaId || '', OPERACION_ID:data.operacionId, CREADO_POR:sender.ID || '', CLAVE_UNICA:'OPERACION-FINALIZADA-' + data.operacionId });
}

/** ============================================================
 * ARCHIVO: 29_Conexiones_En_Linea.gs
 * ============================================================ */
/** Módulo de conexiones en línea con acceso delegado exclusivamente por un Administrador. */
function exigirAdministradorConexiones_(session) {
  if (!session || !session.user) throw new Error('AUTENTICACION_REQUERIDA');
  if (esAdministradorSistema_(session.user)) return true;
  if (!tienePermiso_(session.user, 'CONEXIONES', 'LEER')) {
    throw new Error('ACCESO_CONEXIONES_NO_AUTORIZADO');
  }
}

function fechaFiltroConexion_(valor, finDia) {
  const texto = String(valor || '').trim();
  if (!texto) return null;
  const fecha = new Date(/^\d{4}-\d{2}-\d{2}$/.test(texto) ? texto + (finDia ? 'T23:59:59.999' : 'T00:00:00.000') : texto);
  return isNaN(fecha.getTime()) ? null : fecha;
}

function normalizarFiltroConexion_(valor) {
  return String(valor || '').trim().toLowerCase();
}

function buscarUltimaUbicacionConexion_(conexion, mapas) {
  if (ubicacionGpsMostrable_({
    LATITUD:conexion.LATITUD,
    LONGITUD:conexion.LONGITUD,
    PRECISION_METROS:conexion.PRECISION_METROS,
    ES_SIMULADA:'NO',
    FECHA_HORA:conexion.FECHA_GPS
  })) {
    return {
      LATITUD:conexion.LATITUD,
      LONGITUD:conexion.LONGITUD,
      PRECISION_METROS:conexion.PRECISION_METROS,
      FECHA_HORA:conexion.FECHA_GPS,
      FUENTE:conexion.FUENTE_GPS,
      PROVEEDOR:conexion.PROVEEDOR_GPS,
      CALIDAD_GPS:conexion.CALIDAD_GPS,
      DIRECCION:'',
      BATERIA_PORCENTAJE:conexion.BATERIA_PORCENTAJE
    };
  }
  const dispositivo = String(conexion.DISPOSITIVO_ID || '');
  const vehiculo = String(conexion.VEHICULO_ID || '');
  const conductor = String(conexion.CONDUCTOR_ID || '');
  const porDispositivo = dispositivo && mapas.dispositivo[dispositivo];
  if (porDispositivo && ubicacionGpsMostrable_(porDispositivo)) return porDispositivo;
  const porVehiculo = vehiculo && mapas.vehiculo[vehiculo];
  if (porVehiculo
    && ubicacionGpsMostrable_(porVehiculo)
    && (!conductor || !porVehiculo.CONDUCTOR_ID || String(porVehiculo.CONDUCTOR_ID) === conductor)) return porVehiculo;
  const porConductor = conductor && mapas.conductor[conductor];
  if (porConductor
    && ubicacionGpsMostrable_(porConductor)
    && (!vehiculo || !porConductor.VEHICULO_ID || String(porConductor.VEHICULO_ID) === vehiculo)) return porConductor;
  return null;
}

function clavePreferenciaSeguimientoConexion_(usuarioSolicitanteId) {
  return 'CONEXIONES_SEGUIMIENTO_USUARIO_' + String(usuarioSolicitanteId || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 90);
}

function obtenerPreferenciaSeguimientoConexion_(session) {
  if (!session || !session.user || !session.user.ID) return '';
  return String(PropertiesService.getScriptProperties().getProperty(clavePreferenciaSeguimientoConexion_(session.user.ID)) || '').trim();
}

function guardarSeguimientoConexionUsuario_(request, session) {
  exigirAdministradorConexiones_(session);
  const data = request.datos || request || {};
  const usuarioSeguidoId = String(data.USUARIO_ID || data.usuarioId || '').trim();
  let usuarioSeguido = null;
  if (usuarioSeguidoId) {
    usuarioSeguido = obtenerRegistro_('USUARIOS', usuarioSeguidoId);
    if (!usuarioSeguido || String(usuarioSeguido.ELIMINADO || 'NO') === 'SI') throw new Error('USUARIO_SEGUIMIENTO_NO_ENCONTRADO');
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const properties = PropertiesService.getScriptProperties();
    const key = clavePreferenciaSeguimientoConexion_(session.user.ID);
    if (usuarioSeguidoId) properties.setProperty(key, usuarioSeguidoId);
    else properties.deleteProperty(key);
  } finally {
    lock.releaseLock();
  }
  registrarBitacora_(session.user,
    usuarioSeguidoId ? 'INICIAR_SEGUIMIENTO_USUARIO' : 'DETENER_SEGUIMIENTO_USUARIO',
    'CONEXIONES',
    usuarioSeguidoId,
    usuarioSeguidoId
      ? 'Seguimiento individual activado para ' + (usuarioSeguido.NOMBRE || usuarioSeguido.CORREO || usuarioSeguidoId) + '.'
      : 'Seguimiento individual detenido desde Conexiones en línea.');
  return ok_({
    seguimiento:{
      USUARIO_ID:usuarioSeguidoId,
      USUARIO_NOMBRE:usuarioSeguido ? usuarioSeguido.NOMBRE || usuarioSeguidoId : '',
      USUARIO_CORREO:usuarioSeguido ? usuarioSeguido.CORREO || '' : '',
      VISIBLE:false,
      RASTRO:[]
    },
    persistenciaConfirmada:true
  });
}

function construirEquipoConexionTiempoReal_(row, usuario, conductor, vehiculo, gpsMapas) {
  const ubicacion = buscarUltimaUbicacionConexion_(row, gpsMapas) || {};
  const limiteActivo = Date.now() - Number(CONFIGURACION_APLICACION.SEGUNDOS_CONEXION_ACTIVA || 90) * 1000;
  const limiteGpsActivo = Date.now() - 2 * 60 * 1000;
  const ultimaConexionMs = new Date(row.ULTIMA_CONEXION || row.ACTUALIZADO_EN || 0).getTime();
  const fechaGpsMs = new Date(ubicacion.FECHA_HORA || ubicacion.ACTUALIZADO_EN || 0).getTime();
  const enLinea = Number.isFinite(ultimaConexionMs) && ultimaConexionMs >= limiteActivo && String(row.ESTADO || '') !== 'Desconectado';
  const gpsReciente = Number.isFinite(fechaGpsMs) && fechaGpsMs >= limiteGpsActivo;
  const latitud = Number(ubicacion.LATITUD);
  const longitud = Number(ubicacion.LONGITUD);
  const precision = Number(ubicacion.PRECISION_METROS || 0);
  return Object.assign({}, limpiarSalidaRecurso_('CONEXIONES', row), {
    USUARIO_NOMBRE:usuario.NOMBRE || row.USUARIO_ID || 'Usuario',
    USUARIO_CORREO:usuario.CORREO || '',
    ROL_ID:usuario.ROL_ID || '',
    CONDUCTOR_NOMBRE:conductor.NOMBRE || '',
    VEHICULO_PATENTE:vehiculo.PATENTE || '',
    VEHICULO_NOMBRE:[vehiculo.MARCA, vehiculo.MODELO].filter(Boolean).join(' '),
    EN_LINEA:enLinea,
    COLOR_ESTADO:enLinea ? 'VERDE' : 'ROJO',
    ESTADO_CONEXION:enLinea ? 'Activo' : 'Desconectado',
    GPS_RECIENTE:gpsReciente,
    LATITUD:Number.isFinite(latitud) ? latitud : '',
    LONGITUD:Number.isFinite(longitud) ? longitud : '',
    PRECISION_METROS:Number.isFinite(precision) ? precision : '',
    VELOCIDAD_KMH:Number(ubicacion.VELOCIDAD_KMH || 0),
    RUMBO:Number(ubicacion.RUMBO || 0),
    DIRECCION:ubicacion.DIRECCION || '',
    FECHA_GPS:ubicacion.FECHA_HORA || ubicacion.ACTUALIZADO_EN || '',
    FUENTE_GPS:ubicacion.FUENTE || '',
    PROVEEDOR_GPS:ubicacion.PROVEEDOR || row.PROVEEDOR_GPS || '',
    CALIDAD_GPS:ubicacion.CALIDAD_GPS || row.CALIDAD_GPS || calidadGps_(precision, ubicacion.PROVEEDOR || ''),
    BATERIA_GPS:ubicacion.BATERIA_PORCENTAJE || row.BATERIA_PORCENTAJE || ''
  });
}

function seguimientoConexionTiempoReal_(request, session) {
  exigirAdministradorConexiones_(session);
  const data = request.datos || request || {};
  const usuarioSeguidoId = String(data.USUARIO_ID || data.usuarioId || obtenerPreferenciaSeguimientoConexion_(session) || '').trim();
  if (!usuarioSeguidoId) {
    return ok_({
      row:null,
      sinConexion:true,
      seguimiento:{ USUARIO_ID:'', VISIBLE:false, RASTRO:[] },
      serverTime:fechaIso_()
    });
  }

  const usuarios = listarRegistrosCacheadosTiempoReal_('USUARIOS', 30);
  const conductores = listarRegistrosCacheadosTiempoReal_('CONDUCTORES', 30);
  const vehiculos = listarRegistrosCacheadosTiempoReal_('VEHICULOS', 30);
  const usuario = usuarios.filter(function(row) { return String(row.ID || '') === usuarioSeguidoId; })[0] || { ID:usuarioSeguidoId };
  const conductoresPorId = {};
  const vehiculosPorId = {};
  conductores.forEach(function(row) { if (row.ID) conductoresPorId[String(row.ID)] = row; });
  vehiculos.forEach(function(row) { if (row.ID) vehiculosPorId[String(row.ID)] = row; });

  let conexiones = [];
  let gpsActual = [];
  try { conexiones = listarRegistrosCacheadosTiempoReal_('CONEXIONES_ACTUAL', 1); } catch (_) { conexiones = []; }
  try { gpsActual = listarRegistrosCacheadosTiempoReal_('GPS_ACTUAL', 1); } catch (_) { gpsActual = []; }
  const gpsMapas = { dispositivo:{}, vehiculo:{}, conductor:{} };
  const conservarGps = function(mapa, clave, row) {
    if (!clave) return;
    const actual = mapa[clave];
    const fecha = new Date(row.FECHA_HORA || row.ACTUALIZADO_EN || 0).getTime() || 0;
    const fechaActual = actual ? new Date(actual.FECHA_HORA || actual.ACTUALIZADO_EN || 0).getTime() || 0 : -1;
    if (!actual || fecha > fechaActual) mapa[clave] = row;
  };
  gpsActual.filter(ubicacionGpsMostrable_).forEach(function(row) {
    conservarGps(gpsMapas.dispositivo, String(row.DISPOSITIVO_ID || ''), row);
    conservarGps(gpsMapas.vehiculo, String(row.VEHICULO_ID || ''), row);
    conservarGps(gpsMapas.conductor, String(row.CONDUCTOR_ID || ''), row);
  });

  const ultimas = {};
  conexiones.filter(function(row) {
    return String(row.USUARIO_ID || '') === usuarioSeguidoId;
  }).forEach(function(row) {
    const clave = String(row.DISPOSITIVO_ID || row.SESION_CLIENTE_ID || row.SESION_ID || row.ID || '');
    if (!clave) return;
    const actual = ultimas[clave];
    const fecha = new Date(row.ULTIMA_CONEXION || row.ACTUALIZADO_EN || 0).getTime() || 0;
    const fechaActual = actual ? new Date(actual.ULTIMA_CONEXION || actual.ACTUALIZADO_EN || 0).getTime() || 0 : -1;
    if (!actual || fecha > fechaActual) ultimas[clave] = row;
  });
  const equipos = Object.keys(ultimas).map(function(clave) {
    const row = ultimas[clave];
    return construirEquipoConexionTiempoReal_(
      row,
      usuario,
      conductoresPorId[String(row.CONDUCTOR_ID || '')] || {},
      vehiculosPorId[String(row.VEHICULO_ID || '')] || {},
      gpsMapas
    );
  });
  const ordenarReciente = function(a, b) {
    return new Date(b.FECHA_GPS || b.ULTIMA_CONEXION || 0).getTime() - new Date(a.FECHA_GPS || a.ULTIMA_CONEXION || 0).getTime();
  };
  const filaGps = equipos.filter(function(row) {
    return row.LATITUD !== '' && row.LONGITUD !== '';
  }).sort(ordenarReciente)[0] || null;
  const filaReciente = equipos.slice().sort(ordenarReciente)[0] || null;
  if (filaGps && direccionSoloCoordenadas_(filaGps.DIRECCION)) {
    try {
      const direccionCacheada = CacheService.getScriptCache().get(claveCacheDireccion_(filaGps.LATITUD, filaGps.LONGITUD));
      if (direccionCacheada) filaGps.DIRECCION = direccionCacheada;
    } catch (_) {}
  }
  const rastro = construirRastroSeguimientoConexion_(usuarioSeguidoId, equipos, filaGps);
  return ok_({
    row:filaGps || filaReciente,
    sinConexion:!filaReciente,
    seguimiento:{
      USUARIO_ID:usuarioSeguidoId,
      USUARIO_NOMBRE:usuario.NOMBRE || (filaReciente && filaReciente.USUARIO_NOMBRE) || usuarioSeguidoId,
      USUARIO_CORREO:usuario.CORREO || (filaReciente && filaReciente.USUARIO_CORREO) || '',
      VISIBLE:Boolean(filaGps),
      DIRECCION:filaGps ? filaGps.DIRECCION || '' : '',
      DISPOSITIVO_ID:filaGps ? filaGps.DISPOSITIVO_ID || '' : '',
      FECHA_GPS:filaGps ? filaGps.FECHA_GPS || '' : '',
      RASTRO:rastro
    },
    serverTime:fechaIso_()
  });
}

function enviarAvisoConexiones_(request, session) {
  exigirAdministradorConexiones_(session);
  const data = request.datos || request || {};
  const tipoAviso = String(data.TIPO_AVISO || 'NOTIFICACION').trim().toUpperCase();
  const alcance = String(data.ALCANCE || 'USUARIO').trim().toUpperCase();
  const titulo = String(data.TITULO || '').trim().slice(0, 160);
  const mensaje = String(data.MENSAJE || '').trim().slice(0, 2000);
  if (!titulo || !mensaje) throw new Error('TITULO_Y_MENSAJE_REQUERIDOS');
  if (['NOTIFICACION','ALERTA'].indexOf(tipoAviso) < 0) throw new Error('TIPO_AVISO_INVALIDO');
  if (['USUARIO','CONDUCTORES','CONECTADOS','TODOS'].indexOf(alcance) < 0) throw new Error('ALCANCE_AVISO_INVALIDO');
  exigirPermiso_(session.user, tipoAviso === 'ALERTA' ? 'ALERTAS' : 'NOTIFICACIONES', 'CREAR');

  const usuarios = listarRegistros_('USUARIOS', {}).filter(function(row) {
    return String(row.ESTADO || '') === 'Activo' && String(row.ELIMINADO || 'NO') !== 'SI';
  });
  const usuariosPorId = {};
  usuarios.forEach(function(row) { usuariosPorId[String(row.ID)] = row; });
  const conductores = listarRegistros_('CONDUCTORES', {}).filter(function(row) {
    return String(row.ESTADO || '') !== 'Inactivo' && String(row.ELIMINADO || 'NO') !== 'SI';
  });
  const conductorPorUsuario = {};
  conductores.forEach(function(row) {
    if (row.USUARIO_ID && !conductorPorUsuario[String(row.USUARIO_ID)]) conductorPorUsuario[String(row.USUARIO_ID)] = row;
  });

  let destinatarios = [];
  if (alcance === 'USUARIO') {
    const usuarioId = String(data.USUARIO_ID || data.DESTINATARIO_USUARIO_ID || '').trim();
    if (!usuarioId) throw new Error('DESTINATARIO_REQUERIDO');
    if (!usuariosPorId[usuarioId]) throw new Error('USUARIO_DESTINATARIO_NO_ENCONTRADO');
    destinatarios = [usuariosPorId[usuarioId]];
  } else if (alcance === 'CONDUCTORES') {
    destinatarios = usuarios.filter(function(row) {
      return String(row.ROL_ID || '') === 'ROL-CONDUCTOR' || Boolean(conductorPorUsuario[String(row.ID)]);
    });
  } else if (alcance === 'CONECTADOS') {
    let conexiones = [];
    try { conexiones = listarRegistrosCacheadosTiempoReal_('CONEXIONES_ACTUAL', 2); } catch (_) { conexiones = []; }
    const limiteActivo = Date.now() - Number(CONFIGURACION_APLICACION.SEGUNDOS_CONEXION_ACTIVA || 90) * 1000;
    const idsConectados = {};
    conexiones.forEach(function(row) {
      const fecha = new Date(row.ULTIMA_CONEXION || row.ACTUALIZADO_EN || 0).getTime();
      if (Number.isFinite(fecha) && fecha >= limiteActivo && String(row.ESTADO || '') !== 'Desconectado' && row.USUARIO_ID) {
        idsConectados[String(row.USUARIO_ID)] = true;
      }
    });
    destinatarios = usuarios.filter(function(row) { return Boolean(idsConectados[String(row.ID)]); });
  } else {
    destinatarios = usuarios.slice();
  }
  const unicos = {};
  destinatarios = destinatarios.filter(function(row) {
    const id = String(row.ID || '');
    if (!id || unicos[id]) return false;
    unicos[id] = true;
    return true;
  }).slice(0, 500);
  if (!destinatarios.length) throw new Error('SIN_DESTINATARIOS_PARA_EL_ALCANCE');

  const solicitudId = String(data.SOLICITUD_CLIENTE_ID || generarId_('AVC')).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 120);
  const categoria = String(data.CATEGORIA || (tipoAviso === 'ALERTA' ? 'Operación' : 'Información')).trim().slice(0, 80);
  let insertados = [];
  let omitidos = 0;
  if (tipoAviso === 'NOTIFICACION') {
    const existentes = {};
    listarRegistros_('NOTIFICACIONES', {}).forEach(function(row) {
      if (row.CLAVE_UNICA) existentes[String(row.CLAVE_UNICA)] = true;
    });
    const prioridadEntrada = String(data.PRIORIDAD || 'Normal');
    const prioridad = ['Baja','Normal','Alta','Urgente'].indexOf(prioridadEntrada) >= 0 ? prioridadEntrada : 'Normal';
    const registros = destinatarios.map(function(usuario) {
      const conductor = conductorPorUsuario[String(usuario.ID)] || {};
      const clave = claveNotificacionUnica_({
        CLAVE_UNICA:'AVISO-CONEXIONES-' + solicitudId,
        DESTINATARIO_USUARIO_ID:usuario.ID,
        DESTINATARIO_CONDUCTOR_ID:conductor.ID || ''
      });
      if (existentes[clave]) { omitidos += 1; return null; }
      existentes[clave] = true;
      return {
        DESTINATARIO_USUARIO_ID:usuario.ID,
        DESTINATARIO_CONDUCTOR_ID:conductor.ID || '',
        TITULO:titulo,
        MENSAJE:mensaje,
        TIPO:categoria,
        PRIORIDAD:prioridad,
        CLAVE_UNICA:clave,
        LEIDA:'NO',
        FECHA_ENVIO:new Date(),
        CREADO_POR:session.user.ID,
        ELIMINADO:'NO'
      };
    }).filter(Boolean);
    insertados = insertarRegistrosMasivos_('NOTIFICACIONES', registros, 'NOT');
  } else {
    const existentes = {};
    listarRegistros_('ALERTAS', {}).forEach(function(row) {
      if (row.CLAVE_UNICA) existentes[String(row.CLAVE_UNICA)] = true;
    });
    const nivelEntrada = String(data.NIVEL || 'Advertencia');
    const nivel = ['Info','Advertencia','Crítica'].indexOf(nivelEntrada) >= 0 ? nivelEntrada : 'Advertencia';
    const registros = destinatarios.map(function(usuario) {
      const clave = 'AVISO-CONEXIONES-' + solicitudId + '-' + String(usuario.ID);
      if (existentes[clave]) { omitidos += 1; return null; }
      existentes[clave] = true;
      return {
        TIPO:categoria,
        NIVEL:nivel,
        TITULO:titulo,
        MENSAJE:mensaje,
        MODULO:'CONEXIONES',
        REGISTRO_ID:usuario.ID,
        CLAVE_UNICA:clave,
        LEIDA:'NO',
        USUARIO_ID:usuario.ID,
        FECHA_HORA:new Date(),
        ELIMINADO:'NO'
      };
    }).filter(Boolean);
    insertados = insertarRegistrosMasivos_('ALERTAS', registros, 'ALT');
  }
  registrarBitacora_(
    session.user,
    tipoAviso === 'ALERTA' ? 'ENVIAR_ALERTA_CONEXIONES' : 'ENVIAR_NOTIFICACION_CONEXIONES',
    'CONEXIONES',
    solicitudId,
    'Alcance: ' + alcance + '. Destinatarios: ' + destinatarios.length + '. Enviados: ' + insertados.length + '. Título: ' + titulo + '.'
  );
  return ok_({
    tipoAviso:tipoAviso,
    alcance:alcance,
    destinatarios:destinatarios.length,
    enviados:insertados.length,
    omitidos:omitidos,
    solicitudId:solicitudId,
    registros:insertados.slice(0, 25)
  });
}

function construirRastroSeguimientoConexion_(usuarioSeguidoId, equiposBase, filaVisible) {
  if (!usuarioSeguidoId || !filaVisible) return [];
  const equiposUsuario = (equiposBase || []).filter(function(row) { return String(row.USUARIO_ID || '') === String(usuarioSeguidoId); });
  const dispositivos = {};
  const conductores = {};
  const vehiculos = {};
  equiposUsuario.forEach(function(row) {
    if (row.DISPOSITIVO_ID) dispositivos[String(row.DISPOSITIVO_ID)] = true;
    if (row.CONDUCTOR_ID) conductores[String(row.CONDUCTOR_ID)] = true;
    if (row.VEHICULO_ID) vehiculos[String(row.VEHICULO_ID)] = true;
  });
  const identidad = [
    Object.keys(dispositivos).sort().join(','),
    Object.keys(conductores).sort().join(','),
    Object.keys(vehiculos).sort().join(',')
  ].join('|');
  const claveCache = ('rastro_cnx_' + VERSION_APLICACION + '_' + usuarioSeguidoId).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 220);
  const cache = CacheService.getScriptCache();
  const agregarPosicionVisible = function(puntos) {
    const fechaVisible = String(filaVisible.FECHA_GPS || '');
    const latitudVisible = Number(filaVisible.LATITUD);
    const longitudVisible = Number(filaVisible.LONGITUD);
    const repetida = puntos.some(function(row) {
      if (fechaVisible && String(row.FECHA_HORA || '') === fechaVisible) return true;
      return Number(row.LATITUD) === latitudVisible && Number(row.LONGITUD) === longitudVisible;
    });
    if (!repetida) puntos.push({
      LATITUD:latitudVisible,
      LONGITUD:longitudVisible,
      FECHA_HORA:fechaVisible,
      PRECISION_METROS:Number(filaVisible.PRECISION_METROS || 0),
      VELOCIDAD_KMH:Number(filaVisible.VELOCIDAD_KMH || 0)
    });
    return puntos.slice(-40);
  };
  try {
    const guardado = JSON.parse(cache.get(claveCache) || 'null');
    if (guardado && guardado.identidad === identidad && Array.isArray(guardado.puntos)) {
      const puntosCacheados = agregarPosicionVisible(guardado.puntos.filter(function(row) {
        return row && coordenadasGpsValidas_(row.LATITUD, row.LONGITUD);
      }));
      cache.put(claveCache, JSON.stringify({ identidad:identidad, puntos:puntosCacheados }), Number(CONFIGURACION_APLICACION.SEGUNDOS_CACHE_RASTRO_CONEXIONES || 21600));
      return puntosCacheados;
    }
  } catch (_) {}
  let historial = [];
  try { historial = listarRegistrosCacheadosTiempoReal_('GPS', 10); } catch (_) { historial = []; }
  const tieneDispositivos = Object.keys(dispositivos).length > 0;
  const puntos = historial.filter(function(row) {
    if (!coordenadasGpsValidas_(row.LATITUD, row.LONGITUD)) return false;
    if (String(row.ES_SIMULADA || '').toUpperCase() === 'SI') return false;
    const precision = Number(row.PRECISION_METROS || 0);
    if (!Number.isFinite(precision) || precision <= 0 || precision > Number(CONFIGURACION_APLICACION.PRECISION_MAPA_CONFIABLE_METROS || 250)) return false;
    if (tieneDispositivos) return Boolean(dispositivos[String(row.DISPOSITIVO_ID || '')]);
    return Boolean(conductores[String(row.CONDUCTOR_ID || '')] || vehiculos[String(row.VEHICULO_ID || '')]);
  }).sort(function(a,b) {
    return fechaGpsMs_(a.FECHA_HORA || a.CREADO_EN) - fechaGpsMs_(b.FECHA_HORA || b.CREADO_EN);
  }).slice(-40).map(function(row) {
    return {
      LATITUD:Number(row.LATITUD),
      LONGITUD:Number(row.LONGITUD),
      FECHA_HORA:row.FECHA_HORA || row.CREADO_EN || '',
      PRECISION_METROS:Number(row.PRECISION_METROS || 0),
      VELOCIDAD_KMH:Number(row.VELOCIDAD_KMH || 0)
    };
  });
  const puntosFinales = agregarPosicionVisible(puntos);
  try {
    cache.put(claveCache, JSON.stringify({ identidad:identidad, puntos:puntosFinales }), Number(CONFIGURACION_APLICACION.SEGUNDOS_CACHE_RASTRO_CONEXIONES || 21600));
  } catch (_) {}
  return puntosFinales;
}

function resumenConexionesAdministrador_(request, session) {
  exigirAdministradorConexiones_(session);
  const data = request.datos || request || {};
  const fechaDesde = fechaFiltroConexion_(data.FECHA_DESDE || data.fechaDesde, false);
  const fechaHasta = fechaFiltroConexion_(data.FECHA_HASTA || data.fechaHasta, true);
  const usuarioId = String(data.USUARIO_ID || data.usuarioId || '').trim();
  const conductorId = String(data.CONDUCTOR_ID || data.conductorId || '').trim();
  const vehiculoId = String(data.VEHICULO_ID || data.vehiculoId || '').trim();
  const dispositivoId = String(data.DISPOSITIVO_ID || data.dispositivoId || '').trim();
  const estadoFiltro = String(data.ESTADO || data.estado || 'TODOS').trim().toUpperCase();
  const gpsFiltro = String(data.GPS || data.gps || 'TODOS').trim().toUpperCase();
  const redFiltro = normalizarFiltroConexion_(data.TIPO_RED || data.tipoRed);
  const plataformaFiltro = normalizarFiltroConexion_(data.PLATAFORMA || data.plataforma);
  const buscar = normalizarFiltroConexion_(data.BUSCAR || data.buscar);
  const precisionMaxima = Number(data.PRECISION_MAXIMA || data.precisionMaxima || 0);
  const incluirDirecciones = String(data.INCLUIR_DIRECCIONES || data.incluirDirecciones || 'SI').toUpperCase() !== 'NO';
  const limiteRespuesta = Math.max(20, Math.min(250, Number(data.LIMITE || data.limite || CONFIGURACION_APLICACION.MAXIMO_CONEXIONES_EN_LINEA_RESPUESTA || 120)));
  const limiteActivo = Date.now() - Number(CONFIGURACION_APLICACION.SEGUNDOS_CONEXION_ACTIVA || 90) * 1000;
  const limiteGpsActivo = Date.now() - 2 * 60 * 1000;
  const usuarioSeguidoId = obtenerPreferenciaSeguimientoConexion_(session);

  const usuarios = listarRegistrosCacheadosTiempoReal_('USUARIOS', 10);
  const conductores = listarRegistrosCacheadosTiempoReal_('CONDUCTORES', 10);
  const vehiculos = listarRegistrosCacheadosTiempoReal_('VEHICULOS', 10);
  const gpsActual = listarRegistrosCacheadosTiempoReal_('GPS_ACTUAL', 5);
  let conexiones = [];
  try { conexiones = listarRegistrosCacheadosTiempoReal_('CONEXIONES_ACTUAL', 5); } catch (_) { conexiones = []; }
  // Respaldo de migración: mientras llegan nuevos latidos se toman las filas
  // históricas más recientes, sin bloquear permanentemente el módulo.
  if (!conexiones.length) {
    const historicas = listarRegistrosCacheadosTiempoReal_('CONEXIONES', 10);
    historicas.sort(function(a,b) { return new Date(b.ULTIMA_CONEXION || 0).getTime() - new Date(a.ULTIMA_CONEXION || 0).getTime(); });
    conexiones = historicas.slice(0, 300);
  }

  function indexarPorId_(rows) {
    const mapa = {};
    (rows || []).forEach(function(row) { if (row && row.ID) mapa[String(row.ID)] = row; });
    return mapa;
  }
  function fechaRegistroConexionMs_(row, campoPrincipal) {
    const valor = row && (row[campoPrincipal] || row.ACTUALIZADO_EN || row.CREADO_EN || 0);
    const tiempo = new Date(valor).getTime();
    return isNaN(tiempo) ? 0 : tiempo;
  }
  function conservarMasReciente_(mapa, clave, row, campoFecha) {
    if (!clave) return;
    const actual = mapa[clave];
    if (!actual || fechaRegistroConexionMs_(row, campoFecha) > fechaRegistroConexionMs_(actual, campoFecha)) mapa[clave] = row;
  }

  const usuariosPorId = indexarPorId_(usuarios);
  const conductoresPorId = indexarPorId_(conductores);
  const vehiculosPorId = indexarPorId_(vehiculos);
  const gpsMapas = { dispositivo:{}, vehiculo:{}, conductor:{} };
  gpsActual.filter(ubicacionGpsMostrable_).forEach(function(row) {
    conservarMasReciente_(gpsMapas.dispositivo, String(row.DISPOSITIVO_ID || ''), row, 'FECHA_HORA');
    conservarMasReciente_(gpsMapas.vehiculo, String(row.VEHICULO_ID || ''), row, 'FECHA_HORA');
    conservarMasReciente_(gpsMapas.conductor, String(row.CONDUCTOR_ID || ''), row, 'FECHA_HORA');
  });

  const ultimasPorEquipo = {};
  conexiones.forEach(function(row) {
    const key = String(row.DISPOSITIVO_ID || row.SESION_CLIENTE_ID || row.SESION_ID || row.ID);
    conservarMasReciente_(ultimasPorEquipo, key, row, 'ULTIMA_CONEXION');
  });

  let equipos = Object.keys(ultimasPorEquipo).map(function(key) {
    const row = ultimasPorEquipo[key];
    const usuario = usuariosPorId[String(row.USUARIO_ID || '')] || {};
    const conductor = conductoresPorId[String(row.CONDUCTOR_ID || '')] || {};
    const vehiculo = vehiculosPorId[String(row.VEHICULO_ID || '')] || {};
    const ubicacion = buscarUltimaUbicacionConexion_(row, gpsMapas) || {};
    const ultimaConexionMs = new Date(row.ULTIMA_CONEXION || row.ACTUALIZADO_EN || 0).getTime();
    const fechaGpsMs = new Date(ubicacion.FECHA_HORA || ubicacion.ACTUALIZADO_EN || 0).getTime();
    const enLinea = Number.isFinite(ultimaConexionMs) && ultimaConexionMs >= limiteActivo && String(row.ESTADO || '') !== 'Desconectado';
    const gpsReciente = Number.isFinite(fechaGpsMs) && fechaGpsMs >= limiteGpsActivo;
    const latitud = Number(ubicacion.LATITUD);
    const longitud = Number(ubicacion.LONGITUD);
    const precision = Number(ubicacion.PRECISION_METROS || 0);
    return Object.assign({}, limpiarSalidaRecurso_('CONEXIONES', row), {
      USUARIO_NOMBRE: usuario.NOMBRE || row.USUARIO_ID || 'Usuario',
      USUARIO_CORREO: usuario.CORREO || '',
      ROL_ID: usuario.ROL_ID || '',
      CONDUCTOR_NOMBRE: conductor.NOMBRE || '',
      VEHICULO_PATENTE: vehiculo.PATENTE || '',
      VEHICULO_NOMBRE: [vehiculo.MARCA, vehiculo.MODELO].filter(Boolean).join(' '),
      EN_LINEA: enLinea,
      COLOR_ESTADO: enLinea ? 'VERDE' : 'ROJO',
      ESTADO_CONEXION: enLinea ? 'Activo' : 'Desconectado',
      GPS_RECIENTE: gpsReciente,
      LATITUD: Number.isFinite(latitud) ? latitud : '',
      LONGITUD: Number.isFinite(longitud) ? longitud : '',
      PRECISION_METROS: Number.isFinite(precision) ? precision : '',
      VELOCIDAD_KMH: Number(ubicacion.VELOCIDAD_KMH || 0),
      RUMBO: Number(ubicacion.RUMBO || 0),
      DIRECCION: ubicacion.DIRECCION || '',
      FECHA_GPS: ubicacion.FECHA_HORA || ubicacion.ACTUALIZADO_EN || '',
      FUENTE_GPS: ubicacion.FUENTE || '',
      PROVEEDOR_GPS: ubicacion.PROVEEDOR || row.PROVEEDOR_GPS || '',
      CALIDAD_GPS: ubicacion.CALIDAD_GPS || row.CALIDAD_GPS || calidadGps_(precision, ubicacion.PROVEEDOR || ''),
      BATERIA_GPS: ubicacion.BATERIA_PORCENTAJE || row.BATERIA_PORCENTAJE || '',
    });
  });
  const equiposBaseSeguimiento = equipos.slice();

  equipos = equipos.filter(function(row) {
    const fecha = new Date(row.ULTIMA_CONEXION || row.ACTUALIZADO_EN || 0);
    if (fechaDesde && (!fecha || fecha < fechaDesde)) return false;
    if (fechaHasta && (!fecha || fecha > fechaHasta)) return false;
    if (usuarioId && row.USUARIO_ID !== usuarioId) return false;
    if (conductorId && row.CONDUCTOR_ID !== conductorId) return false;
    if (vehiculoId && row.VEHICULO_ID !== vehiculoId) return false;
    if (dispositivoId && row.DISPOSITIVO_ID !== dispositivoId) return false;
    if (estadoFiltro === 'ACTIVOS' && !row.EN_LINEA) return false;
    if (estadoFiltro === 'DESCONECTADOS' && row.EN_LINEA) return false;
    if (estadoFiltro === 'SEGUNDO_PLANO' && row.PAGINA_VISIBLE !== 'NO') return false;
    if (gpsFiltro === 'ACTIVO' && !(row.GPS_ACTIVO === 'SI' && row.GPS_RECIENTE)) return false;
    if (gpsFiltro === 'INACTIVO' && row.GPS_ACTIVO === 'SI' && row.GPS_RECIENTE) return false;
    if (gpsFiltro === 'SIN_UBICACION' && row.LATITUD !== '') return false;
    if (redFiltro && normalizarFiltroConexion_(row.TIPO_RED) !== redFiltro) return false;
    if (plataformaFiltro && normalizarFiltroConexion_(row.PLATAFORMA).indexOf(plataformaFiltro) < 0) return false;
    if (precisionMaxima > 0 && Number(row.PRECISION_METROS || Number.MAX_SAFE_INTEGER) > precisionMaxima) return false;
    if (buscar) {
      const texto = [row.USUARIO_NOMBRE,row.USUARIO_CORREO,row.CONDUCTOR_NOMBRE,row.VEHICULO_PATENTE,row.VEHICULO_NOMBRE,row.DISPOSITIVO_ID,row.PLATAFORMA,row.NAVEGADOR,row.IP_PUBLICA,row.SECCION_ACTUAL,row.ACTIVIDAD,row.DIRECCION].join(' ').toLowerCase();
      if (texto.indexOf(buscar) < 0) return false;
    }
    return true;
  });

  equipos.sort(function(a,b) {
    const aSeguido = usuarioSeguidoId && String(a.USUARIO_ID || '') === usuarioSeguidoId;
    const bSeguido = usuarioSeguidoId && String(b.USUARIO_ID || '') === usuarioSeguidoId;
    if (aSeguido !== bSeguido) return aSeguido ? -1 : 1;
    if (a.EN_LINEA !== b.EN_LINEA) return a.EN_LINEA ? -1 : 1;
    return new Date(b.ULTIMA_CONEXION || 0).getTime() - new Date(a.ULTIMA_CONEXION || 0).getTime();
  });

  // Primero se aprovecha toda dirección ya guardada o cacheada. Las consultas
  // nuevas quedan limitadas a un presupuesto muy pequeño y priorizan al usuario
  // seguido y a los equipos activos para mantener la respuesta rápida.
  const filasRespuesta = equipos.slice(0, limiteRespuesta);
  const pendientesDireccion = [];
  const clavesDireccion = filasRespuesta.filter(function(row) {
    return row.LATITUD !== '' && row.LONGITUD !== '' && direccionSoloCoordenadas_(row.DIRECCION);
  }).map(function(row) {
    return claveCacheDireccion_(row.LATITUD, row.LONGITUD);
  });
  let direccionesCacheadas = {};
  try {
    direccionesCacheadas = clavesDireccion.length ? CacheService.getScriptCache().getAll(clavesDireccion) : {};
  } catch (_) { direccionesCacheadas = {}; }
  filasRespuesta.forEach(function(row) {
    if (row.LATITUD === '' || row.LONGITUD === '') return;
    if (!direccionSoloCoordenadas_(row.DIRECCION)) return;
    const cached = direccionesCacheadas[claveCacheDireccion_(row.LATITUD, row.LONGITUD)] || '';
    if (cached) { row.DIRECCION = cached; return; }
    pendientesDireccion.push(row);
  });
  pendientesDireccion.sort(function(a,b) {
    const aSeguido = usuarioSeguidoId && String(a.USUARIO_ID || '') === usuarioSeguidoId;
    const bSeguido = usuarioSeguidoId && String(b.USUARIO_ID || '') === usuarioSeguidoId;
    if (aSeguido !== bSeguido) return aSeguido ? -1 : 1;
    if (a.EN_LINEA !== b.EN_LINEA) return a.EN_LINEA ? -1 : 1;
    return new Date(b.FECHA_GPS || b.ULTIMA_CONEXION || 0).getTime() - new Date(a.FECHA_GPS || a.ULTIMA_CONEXION || 0).getTime();
  });
  const presupuestoDirecciones = incluirDirecciones ? Math.max(0, Number(CONFIGURACION_APLICACION.MAXIMO_GEOCODIFICACIONES_CONEXIONES_POR_CONSULTA || 2)) : 0;
  pendientesDireccion.slice(0, presupuestoDirecciones).forEach(function(row) {
    row.DIRECCION = obtenerDireccionCoordenadas_(row.LATITUD, row.LONGITUD);
  });
  const filaSeguidaVisible = equipos.filter(function(row) {
    return usuarioSeguidoId
      && String(row.USUARIO_ID || '') === usuarioSeguidoId
      && row.LATITUD !== '' && row.LONGITUD !== '';
  }).sort(function(a,b) {
    return new Date(b.FECHA_GPS || b.ULTIMA_CONEXION || 0).getTime() - new Date(a.FECHA_GPS || a.ULTIMA_CONEXION || 0).getTime();
  })[0] || null;
  const cuentaSeguida = usuariosPorId[usuarioSeguidoId] || {};
  const rastroSeguimiento = construirRastroSeguimientoConexion_(usuarioSeguidoId, equiposBaseSeguimiento, filaSeguidaVisible);

  const ubicaciones = equipos.filter(function(row) {
    return row.LATITUD !== '' && row.LONGITUD !== '';
  }).map(function(row) {
    return {
      ID: row.ID,
      DISPOSITIVO_ID: row.DISPOSITIVO_ID,
      USUARIO_ID: row.USUARIO_ID,
      USUARIO_NOMBRE: row.USUARIO_NOMBRE,
      CONDUCTOR_NOMBRE: row.CONDUCTOR_NOMBRE,
      VEHICULO_ID: row.VEHICULO_ID,
      VEHICULO_PATENTE: row.VEHICULO_PATENTE,
      LATITUD: row.LATITUD,
      LONGITUD: row.LONGITUD,
      PRECISION_METROS: row.PRECISION_METROS,
      VELOCIDAD_KMH: row.VELOCIDAD_KMH,
      DIRECCION: row.DIRECCION,
      FECHA_GPS: row.FECHA_GPS,
      EN_LINEA: row.EN_LINEA,
      GPS_RECIENTE: row.GPS_RECIENTE,
      GPS_ACTIVO: row.GPS_ACTIVO,
      ESTADO_CONEXION: row.ESTADO_CONEXION,
    };
  });

  function opcionesUnicas(campo) {
    const mapa = {};
    equipos.forEach(function(row) { const valor = String(row[campo] || '').trim(); if (valor) mapa[valor] = true; });
    return Object.keys(mapa).sort();
  }

  return ok_({
    equipos: equipos.slice(0, limiteRespuesta),
    ubicaciones: ubicaciones.slice(0, Math.min(limiteRespuesta, 200)),
    totales: {
      equipos: equipos.length,
      activos: equipos.filter(function(row) { return row.EN_LINEA; }).length,
      desconectados: equipos.filter(function(row) { return !row.EN_LINEA; }).length,
      gpsActivos: equipos.filter(function(row) { return row.GPS_ACTIVO === 'SI' && row.GPS_RECIENTE; }).length,
      sinGps: equipos.filter(function(row) { return !(row.GPS_ACTIVO === 'SI' && row.GPS_RECIENTE); }).length,
      segundoPlano: equipos.filter(function(row) { return row.PAGINA_VISIBLE === 'NO'; }).length,
    },
    opciones: {
      usuarios: usuarios.filter(function(row) { return row.ESTADO === 'Activo'; }).map(function(row) { return { ID:row.ID, NOMBRE:row.NOMBRE, CORREO:row.CORREO }; }),
      conductores: conductores.filter(function(row) { return row.ESTADO !== 'Inactivo'; }).map(function(row) { return { ID:row.ID, NOMBRE:row.NOMBRE || row.ID }; }),
      vehiculos: vehiculos.filter(function(row) { return row.ESTADO !== 'Inactivo'; }).map(function(row) { return { ID:row.ID, PATENTE:row.PATENTE, NOMBRE:[row.MARCA,row.MODELO].filter(Boolean).join(' ') }; }),
      dispositivos: opcionesUnicas('DISPOSITIVO_ID'),
      redes: opcionesUnicas('TIPO_RED'),
      plataformas: opcionesUnicas('PLATAFORMA'),
    },
    seguimiento: {
      USUARIO_ID:usuarioSeguidoId,
      USUARIO_NOMBRE:cuentaSeguida.NOMBRE || (filaSeguidaVisible && filaSeguidaVisible.USUARIO_NOMBRE) || usuarioSeguidoId,
      USUARIO_CORREO:cuentaSeguida.CORREO || (filaSeguidaVisible && filaSeguidaVisible.USUARIO_CORREO) || '',
      VISIBLE:Boolean(filaSeguidaVisible),
      DIRECCION:filaSeguidaVisible ? filaSeguidaVisible.DIRECCION || '' : '',
      DISPOSITIVO_ID:filaSeguidaVisible ? filaSeguidaVisible.DISPOSITIVO_ID || '' : '',
      FECHA_GPS:filaSeguidaVisible ? filaSeguidaVisible.FECHA_GPS || '' : '',
      RASTRO:rastroSeguimiento,
    },
    filtros: {
      FECHA_DESDE: data.FECHA_DESDE || data.fechaDesde || '',
      FECHA_HASTA: data.FECHA_HASTA || data.fechaHasta || '',
      USUARIO_ID: usuarioId,
      CONDUCTOR_ID: conductorId,
      VEHICULO_ID: vehiculoId,
      DISPOSITIVO_ID: dispositivoId,
      ESTADO: estadoFiltro,
      GPS: gpsFiltro,
      TIPO_RED: data.TIPO_RED || data.tipoRed || '',
      PLATAFORMA: data.PLATAFORMA || data.plataforma || '',
      PRECISION_MAXIMA: precisionMaxima || '',
      BUSCAR: data.BUSCAR || data.buscar || '',
    },
    serverTime: fechaIso_(),
    intervaloActivoSegundos: Number(CONFIGURACION_APLICACION.SEGUNDOS_CONEXION_ACTIVA || 90),
  });
}

/** ============================================================
 * ARCHIVO: 99_Utilidades.gs
 * ============================================================ */
/** Utilidades compartidas. */
function parsearSolicitud_(e) {
  if (!e) return {};
  const raw = e.postData && e.postData.contents ? e.postData.contents : '';
  let request = {};
  if (raw) {
    try { request = JSON.parse(raw) || {}; }
    catch (error) { request = Object.assign({}, e.parameter || {}); }
  } else request = Object.assign({}, e.parameter || {});
  if (!request.accion && request.action) request.accion = request.action;
  if (!request.accion && request.ACCION) request.accion = request.ACCION;
  return request;
}

function respuestaJson_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function ok_(data) {
  return { ok: true, data: data || {}, version: VERSION_APLICACION };
}

function respuestaError_(error) {
  const message = error && error.message ? error.message : String(error);
  console.error(error && error.stack ? error.stack : error);
  return { ok: false, error: message, version: VERSION_APLICACION };
}

function validarRequeridos_(object, fields) {
  fields.forEach(function(field) {
    if (object[field] === '' || object[field] === null || typeof object[field] === 'undefined') {
      throw new Error('CAMPO_REQUERIDO_' + field);
    }
  });
}

function generarId_(prefix) {
  return String(prefix || 'ID').toUpperCase() + '-' + Utilities.getUuid().split('-')[0].toUpperCase();
}

function fechaIso_() {
  return new Date().toISOString();
}

function serializarValor_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') return value.toISOString();
  return value;
}

function deserializarFecha_(value) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  return value;
}

function normalizarEmail_(email) {
  return String(email || '').trim().toLowerCase();
}
