/** ARCHIVO ÚNICO - Sistema de Gestión de Flotas 2.6.1 */
/** Generado a partir de los módulos .gs incluidos en esta entrega. */

// ===== 00_Configuracion.gs =====
/**
 * Sistema de Gestión de Flotas - Configuración central.
 * Si el proyecto Apps Script está vinculado a la hoja, instalarSistema() guardará
 * automáticamente el ID. Para un proyecto independiente, pegue el ID aquí.
 */
const VERSION_APLICACION = '2.6.1';

const CONFIGURACION_APLICACION = Object.freeze({
  ID_HOJA_CALCULO: '1onJJEN1rgz0N9GXOiUqV7ong4-nlbdAjzMyW_rumXCM',
  CLAVE_INSTALACION: 'GENERAR_AUTOMATICAMENTE',
  HORAS_SESION: 72,
  ZONA_HORARIA: 'America/Santiago',
  MAXIMO_FILAS_LISTADO: 2000,
  MAXIMO_FILAS_GPS_RESPUESTA: 500,
  SEGUNDOS_CONEXION_ACTIVA: 90,
  SEGUNDOS_ACTUALIZAR_SESION: 120,
  MAXIMO_CONSULTAS_CARGA_RAPIDA: 18,
  SEGUNDOS_MINIMOS_GEOCODIFICACION: 30,
  SEGUNDOS_HISTORIAL_GPS: 60,
  SEGUNDOS_ACTUALIZAR_CONEXION_DESDE_GPS: 20,
  SEGUNDOS_CACHE_METADATOS_TIEMPO_REAL: 10,
});

const ESQUEMAS_APLICACION = Object.freeze({
  CONFIGURACION: ['CLAVE','VALOR','DESCRIPCION','ACTUALIZADO_EN'],
  USUARIOS: ['ID','NOMBRE','CORREO','CONTRASENA_CIFRADA','SAL_CONTRASENA','ROL_ID','ESTADO','TELEFONO','ULTIMO_ACCESO','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  ROLES: ['ID','NOMBRE','DESCRIPCION','ESTADO','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  PERMISOS: ['ID','ROL_ID','MODULO','ACCION','PERMITIDO','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  VEHICULOS: ['ID','PATENTE','MARCA','MODELO','ANIO','COLOR','COMBUSTIBLE','VIN','KILOMETRAJE','ESTADO','QR_CODIGO','PROXIMA_MANTENCION','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  CONDUCTORES: ['ID','NOMBRE','RUT','TELEFONO','CORREO','LICENCIA_CLASE','LICENCIA_VENCIMIENTO','ESTADO','USUARIO_ID','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  OPERACIONES: ['ID','VEHICULO_ID','CONDUCTOR_ID','ORIGEN','DESTINO','FECHA_INICIO','FECHA_FIN','ESTADO','KM_INICIO','KM_FIN','DISTANCIA_KM','OBSERVACIONES','CREADO_POR','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  GPS: ['ID','OPERACION_ID','CONDUCTOR_ID','VEHICULO_ID','LATITUD','LONGITUD','PRECISION_METROS','VELOCIDAD_KMH','RUMBO','FECHA_HORA','FUENTE','CREADO_EN','ELIMINADO','DIRECCION','BATERIA_PORCENTAJE','DISPOSITIVO_ID'],
  GPS_ACTUAL: ['ID','CLAVE_SEGUIMIENTO','OPERACION_ID','CONDUCTOR_ID','VEHICULO_ID','LATITUD','LONGITUD','PRECISION_METROS','VELOCIDAD_KMH','RUMBO','FECHA_HORA','FUENTE','CREADO_EN','ACTUALIZADO_EN','ELIMINADO','DIRECCION','BATERIA_PORCENTAJE','DISPOSITIVO_ID'],
  HISTORIAL: ['ID','OPERACION_ID','EVENTO','DETALLE','FECHA_HORA','USUARIO_ID','CREADO_EN','ELIMINADO'],
  MANTENCIONES: ['ID','VEHICULO_ID','TIPO','TITULO','DESCRIPCION','FECHA_PROGRAMADA','FECHA_REALIZADA','KILOMETRAJE','COSTO','ESTADO','TALLER','OBSERVACIONES','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  DOCUMENTOS: ['ID','TIPO','ASOCIADO_TIPO','ASOCIADO_ID','IDENTIFICACION','FECHA_EMISION','FECHA_VENCIMIENTO','ESTADO','DIRECCION_ARCHIVO','OBSERVACIONES','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  ALERTAS: ['ID','TIPO','NIVEL','TITULO','MENSAJE','MODULO','REGISTRO_ID','LEIDA','USUARIO_ID','FECHA_HORA','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  REPORTES: ['ID','TIPO','PARAMETROS_CODIFICADOS','DIRECCION_ARCHIVO','GENERADO_POR','FECHA_HORA','ESTADO','CREADO_EN','ELIMINADO'],
  BITACORA: ['ID','USUARIO_ID','USUARIO_NOMBRE','ACCION','MODULO','REGISTRO_ID','DETALLE','IP_CLIENTE','FECHA_HORA','CREADO_EN','ELIMINADO'],
  PARAMETROS: ['ID','GRUPO','CLAVE','VALOR','TIPO','DESCRIPCION','ACTIVO','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  EMPRESAS: ['ID','RUT','RAZON_SOCIAL','NOMBRE_FANTASIA','GIRO','DIRECCION','COMUNA','CIUDAD','REGION','PAIS','TELEFONO_PRINCIPAL','TELEFONO_SECUNDARIO','CORREO','SITIO_WEB','REPRESENTANTE_LEGAL','RUT_REPRESENTANTE','DIRECCION_LOGOTIPO','ID_ARCHIVO_LOGOTIPO','NOMBRE_ARCHIVO_LOGOTIPO','TIPO_ARCHIVO_LOGOTIPO','COLOR_PRINCIPAL','COLOR_SECUNDARIO','ZONA_HORARIA','MONEDA','UNIDAD_DISTANCIA','FORMATO_FECHA','TEXTO_PIE','ESTADO','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  QR: ['ID','CODIGO','TIPO','REGISTRO_ID','ESTADO','FECHA_GENERACION','FECHA_ULTIMO_USO','USOS','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  RUTAS: ['ID','NOMBRE','CONDUCTOR_ID','VEHICULO_ID','OPERACION_ID','ORIGEN','ORIGEN_LATITUD','ORIGEN_LONGITUD','DESTINO','DESTINO_LATITUD','DESTINO_LONGITUD','PARADAS_CODIFICADAS','PROVEEDOR_NAVEGACION','ESTADO','INSTRUCCIONES','FECHA_ASIGNACION','FECHA_INICIO','FECHA_FIN','CREADO_POR','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  NOTIFICACIONES: ['ID','DESTINATARIO_USUARIO_ID','DESTINATARIO_CONDUCTOR_ID','TITULO','MENSAJE','TIPO','PRIORIDAD','RUTA_ID','OPERACION_ID','LEIDA','FECHA_ENVIO','FECHA_LECTURA','CREADO_POR','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  CONEXIONES: ['ID','USUARIO_ID','CONDUCTOR_ID','DISPOSITIVO_ID','SESION_ID','SESION_CLIENTE_ID','SECCION_ACTUAL','ACTIVIDAD','VEHICULO_ID','OPERACION_ID','RUTA_ID','GPS_ACTIVO','PAGINA_VISIBLE','ESTADO','ULTIMA_CONEXION','PLATAFORMA','NAVEGADOR','TIPO_RED','BATERIA_PORCENTAJE','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
  SESIONES: ['ID','USUARIO_ID','FICHA_SESION_CIFRADA','FECHA_INICIO','FECHA_EXPIRACION','ULTIMO_USO','ACTIVA','AGENTE_NAVEGADOR','CREADO_EN','ACTUALIZADO_EN','ELIMINADO'],
});

const RECURSOS_APLICACION = Object.freeze({
  usuarios: { sheet: 'USUARIOS', prefix: 'USR', module: 'USUARIOS' },
  roles: { sheet: 'ROLES', prefix: 'ROL', module: 'USUARIOS' },
  permisos: { sheet: 'PERMISOS', prefix: 'PER', module: 'USUARIOS' },
  vehiculos: { sheet: 'VEHICULOS', prefix: 'VEH', module: 'VEHICULOS' },
  conductores: { sheet: 'CONDUCTORES', prefix: 'CON', module: 'CONDUCTORES' },
  operaciones: { sheet: 'OPERACIONES', prefix: 'OPE', module: 'OPERACIONES' },
  gps: { sheet: 'GPS', prefix: 'GPS', module: 'GPS' },
  historial: { sheet: 'HISTORIAL', prefix: 'HIS', module: 'HISTORIAL' },
  mantenciones: { sheet: 'MANTENCIONES', prefix: 'MAN', module: 'MANTENCIONES' },
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

// ===== 01_Principal.gs =====
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

// ===== 02_Rutas.gs =====
/** Enrutador único del servicio de datos. */
function enrutarSolicitud_(request, event) {
  reiniciarCachesEjecucion_();
  const accion = String(request.accion || '').trim();
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
    case 'listar': return servicioListar_(request, session);
    case 'obtener': return servicioObtener_(request, session);
    case 'crear': return servicioCrear_(request, session);
    case 'actualizar': return servicioActualizar_(request, session);
    case 'eliminar': return servicioEliminar_(request, session);
    case 'iniciarOperacion': return iniciarOperacion_(request, session);
    case 'finalizarOperacion': return finalizarOperacion_(request, session);
    case 'validarQrVehiculo': return validarQrVehiculo_(request, session);
    case 'guardarUbicacion': return guardarUbicacion_(request, session);
    case 'ultimasUbicaciones': return ultimasUbicaciones_(request, session);
    case 'asignarRuta': return asignarRuta_(request, session);
    case 'actualizarEstadoRuta': return actualizarEstadoRuta_(request, session);
    case 'enviarNotificacion': return enviarNotificacion_(request, session);
    case 'marcarNotificacionLeida': return marcarNotificacionLeida_(request, session);
    case 'actualizarConexion': return actualizarConexion_(request, session);
    case 'resumenTiempoReal': return resumenTiempoReal_(request, session);
    case 'cambiarContrasena': return cambiarPassword_(request, session);
    case 'guardarEmpresa': return guardarEmpresaServicio_(request, session);
    case 'limpiarDatosOperativos': return limpiarDatosOperativosServicio_(request, session);
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
  rows = filtrarPorUsuario_(resource.sheet, rows, session.user);
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
  return ok_({ row: visible[0] });
}

function servicioCrear_(request, session) {
  const resource = obtenerRecurso_(request.recurso);
  exigirPermiso_(session.user, resource.module, 'CREAR');
  if (resource.sheet === 'USUARIOS') return crearUsuarioServicio_(request.datos || {}, session);
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    if (resource.sheet === 'OPERACIONES') return iniciarOperacion_({ datos:request.datos || {} }, session);
    if (resource.sheet === 'GPS') return guardarUbicacion_({ datos:request.datos || {} }, session);
    if (resource.sheet === 'CONEXIONES') throw new Error('ACCION_ESPECIAL_REQUERIDA');
  }
  const data = normalizarEntradaRecurso_(resource.sheet, request.datos || {}, session.user);
  const row = insertarRegistro_(resource.sheet, data, resource.prefix);
  registrarBitacora_(session.user, 'CREAR', resource.module, row.ID, 'Registro creado');
  return ok_({ row: limpiarSalidaRecurso_(resource.sheet, row) });
}

function servicioActualizar_(request, session) {
  const resource = obtenerRecurso_(request.recurso);
  exigirPermiso_(session.user, resource.module, 'ACTUALIZAR');
  const existing = obtenerRegistro_(resource.sheet, request.identificador);
  if (!existing) throw new Error('REGISTRO_NO_ENCONTRADO');
  if (!filtrarPorUsuario_(resource.sheet, [existing], session.user).length) throw new Error('PERMISO_DENEGADO');
  if (session.user.ROL_ID === 'ROL-CONDUCTOR') {
    const driverData = request.datos || {};
    if (resource.sheet === 'RUTAS') {
      return actualizarEstadoRuta_({ RUTA_ID:request.identificador, ESTADO:driverData.ESTADO }, session);
    }
    if (resource.sheet === 'NOTIFICACIONES') {
      if (driverData.LEIDA !== 'SI') throw new Error('PERMISO_DENEGADO');
      return marcarNotificacionLeida_({ NOTIFICACION_ID:request.identificador }, session);
    }
    if (resource.sheet === 'ALERTAS') {
      const alertKeys = Object.keys(driverData);
      if (alertKeys.some(function(key) { return key !== 'LEIDA'; })) throw new Error('PERMISO_DENEGADO');
    }
    if (resource.sheet === 'OPERACIONES' || resource.sheet === 'CONEXIONES') throw new Error('ACCION_ESPECIAL_REQUERIDA');
  }
  if (resource.sheet === 'USUARIOS') return actualizarUsuarioServicio_(request.identificador, request.datos || {}, session);
  const data = normalizarEntradaRecurso_(resource.sheet, request.datos || {}, session.user);
  const row = actualizarRegistro_(resource.sheet, request.identificador, data);
  registrarBitacora_(session.user, 'ACTUALIZAR', resource.module, request.identificador, 'Registro actualizado');
  return ok_({ row: limpiarSalidaRecurso_(resource.sheet, row) });
}

function servicioEliminar_(request, session) {
  const resource = obtenerRecurso_(request.recurso);
  exigirPermiso_(session.user, resource.module, 'ELIMINAR');
  const existing = obtenerRegistro_(resource.sheet, request.identificador);
  if (!existing) throw new Error('REGISTRO_NO_ENCONTRADO');
  if (!filtrarPorUsuario_(resource.sheet, [existing], session.user).length) throw new Error('PERMISO_DENEGADO');
  eliminarRegistro_(resource.sheet, request.identificador);
  registrarBitacora_(session.user, 'ELIMINAR', resource.module, request.identificador, 'Registro eliminado lógicamente');
  return ok_({ id: request.identificador });
}

// ===== 03_Seguridad.gs =====
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
  const users = listarRegistros_('USUARIOS', {});
  if (users.some(usuarioTieneAccesoConfigurado_)) throw new Error('SISTEMA_YA_INICIALIZADO');
  const claveEsperada = obtenerOCrearClaveInstalacion_();
  if (String(request.claveInstalacion || '') !== claveEsperada) throw new Error('CLAVE_INSTALACION_INVALIDA');
  validarRequeridos_(request, ['nombre','correo']);
  const contrasena = validarContrasenaElegida_(request.contrasena);

  asegurarCatalogos_();
  users.forEach(function(usuario) {
    actualizarRegistro_('USUARIOS', usuario.ID, {
      ESTADO: 'Inactivo',
      ELIMINADO: 'SI',
    });
  });
  const user = crearUsuarioInterno_({
    NOMBRE: request.nombre,
    CORREO: request.correo,
    CONTRASENA: contrasena,
    ROL_ID: 'ROL-ADMIN',
    ESTADO: 'Activo',
    TELEFONO: request.telefono || '',
  });
  PropertiesService.getScriptProperties().setProperty('INSTALACION_COMPLETADA', 'SI');
  registrarBitacora_(user, 'INSTALACION_INICIAL', 'SEGURIDAD', user.ID, 'Administrador inicial creado');
  return ok_({ initialized: true, user: usuarioPublico_(user) });
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
    ELIMINADO: 'NO',
  }, 'SES');
  actualizarRegistro_('USUARIOS', user.ID, { ULTIMO_ACCESO: now });
  registrarBitacora_(user, 'INICIO_SESION', 'SEGURIDAD', user.ID, 'Inicio de sesión correcto');
  return ok_({ token: rawToken, sessionId:sessionRow.ID, expiresAt: expires.toISOString(), user: usuarioPublico_(user) });
}

function cerrarSesion_(token, session) {
  actualizarRegistro_('SESIONES', session.session.ID, { ACTIVA: 'NO', ULTIMO_USO: new Date() });
  listarRegistros_('CONEXIONES', {}).filter(function(row) {
    return row.SESION_ID === session.session.ID;
  }).forEach(function(row) {
    actualizarRegistro_('CONEXIONES', row.ID, {
      ESTADO:'Desconectado',
      ACTIVIDAD:'Inactivo',
      PAGINA_VISIBLE:'NO',
      ULTIMA_CONEXION:new Date(),
    });
  });
  registrarBitacora_(session.user, 'CIERRE_SESION', 'SEGURIDAD', session.user.ID, 'Cierre de sesión');
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
    ROL_ID: data.ROL_ID || 'ROL-CONDUCTOR',
    ESTADO: data.ESTADO || 'Activo',
    TELEFONO: data.TELEFONO || '',
    ELIMINADO: 'NO',
  }, 'USR');
}

function crearUsuarioServicio_(data, session) {
  validarRequeridos_(data, ['NOMBRE','CORREO']);
  const row = crearUsuarioInterno_(data);
  registrarBitacora_(session.user, 'CREAR', 'USUARIOS', row.ID, 'Usuario creado: ' + row.CORREO);
  return ok_({ row: usuarioPublico_(row) });
}

function actualizarUsuarioServicio_(id, data, session) {
  const clean = Object.assign({}, data);
  delete clean.CONTRASENA_CIFRADA;
  delete clean.SAL_CONTRASENA;
  if (Object.prototype.hasOwnProperty.call(clean, 'CONTRASENA')) {
    const contrasena = validarContrasenaElegida_(clean.CONTRASENA);
    const salt = crearToken_();
    clean.SAL_CONTRASENA = salt;
    clean.CONTRASENA_CIFRADA = cifrarContrasena_(contrasena, salt);
    delete clean.CONTRASENA;
  }
  if (clean.CORREO) clean.CORREO = normalizarEmail_(clean.CORREO);
  const row = actualizarRegistro_('USUARIOS', id, clean);
  registrarBitacora_(session.user, 'ACTUALIZAR', 'USUARIOS', id, 'Usuario actualizado');
  return ok_({ row: usuarioPublico_(row) });
}

function usuarioPublico_(user) {
  if (!user) return null;
  const role = obtenerRegistro_('ROLES', user.ROL_ID);
  const driver = listarRegistros_('CONDUCTORES', {}).find(function(row) { return row.USUARIO_ID === user.ID; });
  const permissions = user.ROL_ID === 'ROL-ADMIN'
    ? ['*:*']
    : listarRegistros_('PERMISOS', {}).filter(function(row) {
        return row.ROL_ID === user.ROL_ID && row.PERMITIDO === 'SI';
      }).map(function(row) { return row.MODULO + ':' + row.ACCION; });
  return {
    ID: user.ID,
    NOMBRE: user.NOMBRE,
    CORREO: user.CORREO,
    ROL_ID: user.ROL_ID,
    ROL_NOMBRE: role ? role.NOMBRE : user.ROL_ID,
    ESTADO: user.ESTADO,
    TELEFONO: user.TELEFONO || '',
    ULTIMO_ACCESO: serializarValor_(user.ULTIMO_ACCESO),
    CONDUCTOR_ID: driver ? driver.ID : '',
    PERMISOS: permissions,
  };
}

function exigirPermiso_(user, moduleName, action) {
  if (!tienePermiso_(user, moduleName, action)) throw new Error('PERMISO_DENEGADO');
  return true;
}

function tienePermiso_(user, moduleName, action) {
  if (user.ROL_ID === 'ROL-ADMIN') return true;
  return listarRegistros_('PERMISOS', {}).some(function(row) {
    return row.ROL_ID === user.ROL_ID && row.MODULO === moduleName && row.ACCION === action && row.PERMITIDO === 'SI';
  });
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

// ===== 04_Base_de_Datos.gs =====
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
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (current.join('|') !== headers.join('|')) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
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
  lock.waitLock(20000);
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
    return limpiarSalidaRecurso_(sheetName, object);
  } finally {
    lock.releaseLock();
  }
}

function actualizarRegistro_(sheetName, id, data) {
  if (!id) throw new Error('ID_REQUERIDO');
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
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
    return limpiarSalidaRecurso_(sheetName, current);
  } finally {
    lock.releaseLock();
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
}

function obtenerRecurso_(resourceName) {
  const resource = RECURSOS_APLICACION[String(resourceName || '')];
  if (!resource) throw new Error('RECURSO_NO_ENCONTRADO');
  return resource;
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
  if (user.ROL_ID !== 'ROL-CONDUCTOR') return rows.map(function(row) { return limpiarSalidaRecurso_(sheetName, row); });
  const driver = listarRegistros_('CONDUCTORES', {}).find(function(row) { return row.USUARIO_ID === user.ID; });
  if (sheetName === 'NOTIFICACIONES') {
    rows = rows.filter(function(row) {
      return row.DESTINATARIO_USUARIO_ID === user.ID || (driver && row.DESTINATARIO_CONDUCTOR_ID === driver.ID);
    });
  } else if (sheetName === 'CONEXIONES') {
    rows = rows.filter(function(row) { return row.USUARIO_ID === user.ID; });
  } else if (!driver && ['CONDUCTORES','VEHICULOS','OPERACIONES','GPS','GPS_ACTUAL','RUTAS','HISTORIAL','DOCUMENTOS','MANTENCIONES'].indexOf(sheetName) >= 0) {
    rows = [];
  } else if (sheetName === 'CONDUCTORES') {
    rows = rows.filter(function(row) { return row.ID === driver.ID; });
  } else if (sheetName === 'OPERACIONES' || sheetName === 'GPS' || sheetName === 'GPS_ACTUAL' || sheetName === 'RUTAS') {
    rows = rows.filter(function(row) { return row.CONDUCTOR_ID === driver.ID; });
  } else if (sheetName === 'VEHICULOS') {
    const vehicleIds = {};
    listarRegistros_('OPERACIONES', {}).forEach(function(row) {
      if (row.CONDUCTOR_ID === driver.ID) vehicleIds[row.VEHICULO_ID] = true;
    });
    listarRegistros_('RUTAS', {}).forEach(function(row) {
      if (row.CONDUCTOR_ID === driver.ID) vehicleIds[row.VEHICULO_ID] = true;
    });
    rows = rows.filter(function(row) { return vehicleIds[row.ID]; });
  } else if (sheetName === 'HISTORIAL') {
    const operationIds = {};
    listarRegistros_('OPERACIONES', {}).forEach(function(row) {
      if (row.CONDUCTOR_ID === driver.ID) operationIds[row.ID] = true;
    });
    rows = rows.filter(function(row) { return operationIds[row.OPERACION_ID]; });
  } else if (sheetName === 'DOCUMENTOS') {
    const associatedVehicles = {};
    listarRegistros_('OPERACIONES', {}).forEach(function(row) {
      if (row.CONDUCTOR_ID === driver.ID) associatedVehicles[row.VEHICULO_ID] = true;
    });
    listarRegistros_('RUTAS', {}).forEach(function(row) {
      if (row.CONDUCTOR_ID === driver.ID) associatedVehicles[row.VEHICULO_ID] = true;
    });
    rows = rows.filter(function(row) {
      return (row.ASOCIADO_TIPO === 'Conductor' && row.ASOCIADO_ID === driver.ID) ||
        (row.ASOCIADO_TIPO === 'Vehículo' && associatedVehicles[row.ASOCIADO_ID]);
    });
  } else if (sheetName === 'MANTENCIONES') {
    const maintenanceVehicles = {};
    listarRegistros_('OPERACIONES', {}).forEach(function(row) {
      if (row.CONDUCTOR_ID === driver.ID) maintenanceVehicles[row.VEHICULO_ID] = true;
    });
    listarRegistros_('RUTAS', {}).forEach(function(row) {
      if (row.CONDUCTOR_ID === driver.ID) maintenanceVehicles[row.VEHICULO_ID] = true;
    });
    rows = rows.filter(function(row) { return maintenanceVehicles[row.VEHICULO_ID]; });
  } else if (sheetName === 'ALERTAS') {
    rows = rows.filter(function(row) { return !row.USUARIO_ID || row.USUARIO_ID === user.ID; });
  }
  return rows.map(function(row) { return limpiarSalidaRecurso_(sheetName, row); });
}

// ===== 05_Instalacion_Inicial.gs =====
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
    let user = users.find(function(row) { return row.ROL_ID === 'ROL-ADMIN'; }) || users[0] || null;
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
  const claveInstalacion = obtenerOCrearClaveInstalacion_();
  Logger.log('CLAVE DE INSTALACIÓN: ' + claveInstalacion);
  return {
    ok: true,
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl(),
    sheets: Object.keys(ESQUEMAS_APLICACION),
    claveInstalacion: claveInstalacion,
    message: 'Estructura instalada. Copie la clave mostrada en el registro de ejecución para crear el administrador inicial.',
  };
}

function actualizarSistema() {
  return instalarSistema();
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

  const modules = ['PANEL_PRINCIPAL','USUARIOS','VEHICULOS','CONDUCTORES','OPERACIONES','GPS','HISTORIAL','MANTENCIONES','DOCUMENTOS','ALERTAS','REPORTES','BITACORA','CONFIGURACION','QR','RUTAS','NOTIFICACIONES','CONEXIONES'];
  const actions = ['LEER','CREAR','ACTUALIZAR','ELIMINAR'];
  modules.forEach(function(moduleName) {
    actions.forEach(function(action) {
      asegurarPermisoCatalogo_('ROL-ADMIN', moduleName, action, 'SI');
    });
  });
  const supervisorModules = ['PANEL_PRINCIPAL','VEHICULOS','CONDUCTORES','OPERACIONES','GPS','HISTORIAL','MANTENCIONES','DOCUMENTOS','ALERTAS','REPORTES','QR','RUTAS','NOTIFICACIONES','CONEXIONES'];
  supervisorModules.forEach(function(moduleName) {
    actions.forEach(function(action) {
      asegurarPermisoCatalogo_('ROL-SUPERVISOR', moduleName, action, action === 'ELIMINAR' ? 'NO' : 'SI');
    });
  });
  const driverRules = {
    PANEL_PRINCIPAL:['LEER'], VEHICULOS:['LEER'], CONDUCTORES:['LEER'], OPERACIONES:['LEER','CREAR','ACTUALIZAR'],
    GPS:['LEER','CREAR'], HISTORIAL:['LEER'], DOCUMENTOS:['LEER'], ALERTAS:['LEER','ACTUALIZAR'],
    QR:['LEER','ACTUALIZAR'], RUTAS:['LEER','ACTUALIZAR'], NOTIFICACIONES:['LEER','ACTUALIZAR'],
    CONEXIONES:['LEER','CREAR','ACTUALIZAR']
  };
  Object.keys(driverRules).forEach(function(moduleName) {
    driverRules[moduleName].forEach(function(action) {
      asegurarPermisoCatalogo_('ROL-CONDUCTOR', moduleName, action, 'SI');
    });
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
  }
}

function limpiarDatosOperativosServicio_(request, session) {
  exigirPermiso_(session.user, 'CONFIGURACION', 'ELIMINAR');
  if (String(request.confirmacion || '') !== 'LIMPIAR DATOS') throw new Error('CONFIRMACION_REQUERIDA');
  PropertiesService.getScriptProperties().deleteProperty('GPS_ACTUAL_MIGRADO_' + VERSION_APLICACION);
  ['VEHICULOS','CONDUCTORES','OPERACIONES','GPS','GPS_ACTUAL','HISTORIAL','MANTENCIONES','DOCUMENTOS','ALERTAS','REPORTES','BITACORA','QR','RUTAS','NOTIFICACIONES','CONEXIONES'].forEach(limpiarHojaDatos_);
  registrarBitacora_(session.user, 'LIMPIAR', 'CONFIGURACION', '', 'Datos operativos eliminados; usuarios y empresa conservados');
  return ok_({ cleared: true });
}

// ===== 10_Usuarios.gs =====
/** Módulo Usuarios. Las operaciones CRUD se enrutan mediante create/update/list/delete. */
function listarUsuarios_(session) {
  exigirPermiso_(session.user, 'USUARIOS', 'LEER');
  return listarRegistros_('USUARIOS', {}).map(usuarioPublico_);
}

// ===== 11_Vehiculos.gs =====
/** Módulo Vehículos. */
function obtenerVehiculoPorQr_(code) {
  const normalized = String(code || '').trim().toUpperCase();
  return listarRegistros_('VEHICULOS', {}).find(function(row) {
    return String(row.QR_CODIGO || '').toUpperCase() === normalized ||
      String(row.PATENTE || '').replace(/[^A-Z0-9]/g, '') === normalized.replace(/[^A-Z0-9]/g, '');
  }) || null;
}

function validarQrVehiculo_(request, session) {
  exigirPermiso_(session.user, 'QR', 'LEER');
  const code = request.codigo || request.CODIGO || '';
  if (!code) throw new Error('CODIGO_QR_REQUERIDO');
  const vehicle = obtenerVehiculoPorQr_(code);
  if (!vehicle) throw new Error('QR_NO_RECONOCIDO');
  if (vehicle.ESTADO !== 'Disponible') throw new Error('VEHICULO_NO_DISPONIBLE');
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
    JSON.stringify({ USUARIO_ID:session.user.ID, VEHICULO_ID:vehicle.ID }),
    300
  );
  registrarBitacora_(session.user, 'VALIDAR', 'QR', vehicle.ID, 'Vehículo validado: ' + vehicle.PATENTE);
  return ok_({ row: limpiarSalidaRecurso_('VEHICULOS', vehicle), autorizacionQr:authorization, validaPorSegundos:300 });
}

// ===== 12_Conductores.gs =====
/** Módulo Conductores. */
function obtenerConductorDeUsuario_(userId) {
  return listarRegistros_('CONDUCTORES', {}).find(function(row) { return row.USUARIO_ID === userId; }) || null;
}

// ===== 13_Operaciones.gs =====
/** Inicio y finalización de operaciones. */
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
  validarRequeridos_(data, ['VEHICULO_ID','CONDUCTOR_ID','DESTINO']);
  const vehicle = obtenerRegistro_('VEHICULOS', data.VEHICULO_ID);
  const driver = obtenerRegistro_('CONDUCTORES', data.CONDUCTOR_ID);
  if (!vehicle || vehicle.ESTADO !== 'Disponible') throw new Error('VEHICULO_NO_DISPONIBLE');
  if (!driver || driver.ESTADO !== 'Disponible') throw new Error('CONDUCTOR_NO_DISPONIBLE');

  const operation = insertarRegistro_('OPERACIONES', {
    VEHICULO_ID: vehicle.ID,
    CONDUCTOR_ID: driver.ID,
    ORIGEN: data.ORIGEN || 'Ubicación actual',
    DESTINO: data.DESTINO,
    FECHA_INICIO: new Date(),
    ESTADO: 'Activa',
    KM_INICIO: Number(data.KM_INICIO || vehicle.KILOMETRAJE || 0),
    OBSERVACIONES: data.OBSERVACIONES || '',
    CREADO_POR: session.user.ID,
    ELIMINADO: 'NO',
  }, 'OPE');
  actualizarRegistro_('VEHICULOS', vehicle.ID, { ESTADO:'En ruta' });
  actualizarRegistro_('CONDUCTORES', driver.ID, { ESTADO:'En viaje' });
  insertarRegistro_('HISTORIAL', {
    OPERACION_ID: operation.ID, EVENTO:'INICIO', DETALLE:'Operación iniciada', FECHA_HORA:new Date(), USUARIO_ID:session.user.ID, ELIMINADO:'NO'
  }, 'HIS');
  registrarBitacora_(session.user, 'INICIAR', 'OPERACIONES', operation.ID, vehicle.PATENTE + ' / ' + driver.NOMBRE);
  return ok_({ row: operation });
}

function finalizarOperacion_(request, session) {
  exigirPermiso_(session.user, 'OPERACIONES', 'ACTUALIZAR');
  const operation = obtenerRegistro_('OPERACIONES', request.identificador || request.OPERACION_ID);
  if (!operation || operation.ESTADO !== 'Activa') throw new Error('OPERACION_NO_ACTIVA');
  if (!filtrarPorUsuario_('OPERACIONES', [operation], session.user).length) throw new Error('PERMISO_DENEGADO');
  const kmEnd = Number(request.KM_FIN || operation.KM_INICIO || 0);
  const kmStart = Number(operation.KM_INICIO || 0);
  const updated = actualizarRegistro_('OPERACIONES', operation.ID, {
    FECHA_FIN: new Date(),
    ESTADO: 'Finalizada',
    KM_FIN: kmEnd,
    DISTANCIA_KM: Math.max(0, kmEnd - kmStart),
    OBSERVACIONES: request.OBSERVACIONES || operation.OBSERVACIONES || '',
  });
  actualizarRegistro_('VEHICULOS', operation.VEHICULO_ID, { ESTADO:'Disponible', KILOMETRAJE:kmEnd });
  actualizarRegistro_('CONDUCTORES', operation.CONDUCTOR_ID, { ESTADO:'Disponible' });
  insertarRegistro_('HISTORIAL', {
    OPERACION_ID: operation.ID, EVENTO:'FIN', DETALLE:'Operación finalizada', FECHA_HORA:new Date(), USUARIO_ID:session.user.ID, ELIMINADO:'NO'
  }, 'HIS');
  registrarBitacora_(session.user, 'FINALIZAR', 'OPERACIONES', operation.ID, 'Operación finalizada');
  return ok_({ row: updated });
}

// ===== 14_GPS.gs =====
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

// ===== 15_Mantenciones.gs =====
/** Módulo de mantenciones. */
function mantencionesAbiertas_() {
  return listarRegistros_('MANTENCIONES', {}).filter(function(row) {
    return ['Programada','En proceso','Atrasada'].indexOf(row.ESTADO) >= 0;
  });
}

// ===== 16_Documentos.gs =====
/** Módulo de documentos y vencimientos. */
function actualizarEstadosDocumentos_() {
  const today = new Date();
  const warning = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  listarRegistros_('DOCUMENTOS', {}).forEach(function(row) {
    if (!row.FECHA_VENCIMIENTO) return;
    const expiry = new Date(row.FECHA_VENCIMIENTO);
    const status = expiry < today ? 'Vencido' : expiry <= warning ? 'Por vencer' : 'Vigente';
    if (row.ESTADO !== status) actualizarRegistro_('DOCUMENTOS', row.ID, { ESTADO:status });
  });
}

// ===== 17_Alertas.gs =====
/** Módulo de alertas. */
function crearAlerta_(data) {
  return insertarRegistro_('ALERTAS', {
    TIPO: data.TIPO || 'Sistema', NIVEL: data.NIVEL || 'Info', TITULO:data.TITULO || 'Alerta',
    MENSAJE:data.MENSAJE || '', MODULO:data.MODULO || '', REGISTRO_ID:data.REGISTRO_ID || '',
    LEIDA:'NO', USUARIO_ID:data.USUARIO_ID || '', FECHA_HORA:new Date(), ELIMINADO:'NO'
  }, 'ALT');
}

// ===== 18_Reportes.gs =====
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
  const documents = visibleRows('DOCUMENTOS', 'DOCUMENTOS');
  const alerts = visibleRows('ALERTAS', 'ALERTAS').filter(function(row) { return row.LEIDA !== 'SI'; });
  const routes = visibleRows('RUTAS', 'RUTAS');
  const notifications = visibleRows('NOTIFICACIONES', 'NOTIFICACIONES')
    .filter(function(row) { return row.LEIDA !== 'SI'; });
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
      expiredDocuments: documents.filter(function(row) { return row.ESTADO === 'Vencido'; }).length,
      unreadAlerts: alerts.length,
      assignedRoutes: routes.filter(function(row) { return row.ESTADO === 'Asignada' || row.ESTADO === 'En curso'; }).length,
      unreadNotifications: notifications.length,
      onlineDevices: connections.length,
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

// ===== 19_Auditoria.gs =====
/** Bitácora de auditoría. */
function registrarBitacora_(user, action, moduleName, recordId, detail) {
  try {
    insertarRegistro_('BITACORA', {
      USUARIO_ID: user && user.ID ? user.ID : '',
      USUARIO_NOMBRE: user && user.NOMBRE ? user.NOMBRE : 'Sistema',
      ACCION: action,
      MODULO: moduleName,
      REGISTRO_ID: recordId || '',
      DETALLE: detail || '',
      IP_CLIENTE: '',
      FECHA_HORA: new Date(),
      ELIMINADO: 'NO',
    }, 'BIT');
  } catch (error) {
    console.error('No fue posible registrar la bitácora', error);
  }
}

// ===== 20_Empresa_y_Configuracion.gs =====
/** Configuración y parámetros. */
function estadoSistema_() {
  const ss = obtenerSpreadsheet_();
  const users = listarRegistros_('USUARIOS', {});
  const usersWithAccess = users.filter(usuarioTieneAccesoConfigurado_);
  const companies = listarRegistros_('EMPRESAS', {});
  return ok_({
    connected: true,
    version: VERSION_APLICACION,
    spreadsheetName: ss.getName(),
    needsSetup: usersWithAccess.length === 0,
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
  const data = normalizarEntradaRecurso_('EMPRESAS', request.datos || {}, session.user);

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

// ===== 21_Tiempo_Real_Rutas_y_Notificaciones.gs =====
/**
 * Asignación de rutas, mensajería dirigida y presencia de dispositivos.
 * Google Apps Script no mantiene conexiones WebSocket; la interfaz consulta
 * estos servicios en intervalos breves y registra latidos de presencia.
 */
function asignarRuta_(request, session) {
  exigirPermiso_(session.user, 'RUTAS', 'CREAR');
  const data = request.datos || request;
  validarRequeridos_(data, ['CONDUCTOR_ID','DESTINO']);
  const driver = obtenerRegistro_('CONDUCTORES', data.CONDUCTOR_ID);
  if (!driver || driver.ESTADO === 'Inactivo') throw new Error('CONDUCTOR_NO_DISPONIBLE');
  const vehicle = data.VEHICULO_ID ? obtenerRegistro_('VEHICULOS', data.VEHICULO_ID) : null;
  if (data.VEHICULO_ID && !vehicle) throw new Error('VEHICULO_NO_ENCONTRADO');
  const provider = ['Google Maps','Waze'].indexOf(data.PROVEEDOR_NAVEGACION) >= 0
    ? data.PROVEEDOR_NAVEGACION : 'Google Maps';

  const route = insertarRegistro_('RUTAS', {
    NOMBRE: data.NOMBRE || ('Ruta a ' + data.DESTINO),
    CONDUCTOR_ID: driver.ID,
    VEHICULO_ID: vehicle ? vehicle.ID : '',
    OPERACION_ID: data.OPERACION_ID || '',
    ORIGEN: data.ORIGEN || 'Ubicación actual',
    ORIGEN_LATITUD: data.ORIGEN_LATITUD || '',
    ORIGEN_LONGITUD: data.ORIGEN_LONGITUD || '',
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

// ===== 99_Utilidades.gs =====
/** Utilidades compartidas. */
function parsearSolicitud_(e) {
  if (!e) return {};
  const raw = e.postData && e.postData.contents ? e.postData.contents : '';
  if (raw) {
    try { return JSON.parse(raw); } catch (error) { /* continúa con parámetros */ }
  }
  return Object.assign({}, e.parameter || {});
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
