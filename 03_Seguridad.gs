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
    MODO_PERMISOS: data.MODO_PERMISOS || 'ROL',
    PERMISOS_PERSONALIZADOS: JSON.stringify(normalizarListaPermisos_(data.PERMISOS_PERSONALIZADOS || [])),
    VERSION_PERMISOS: 1,
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
  const row = actualizarRegistro_('USUARIOS', id, clean);
  registrarBitacora_(session.user, 'ACTUALIZAR', 'USUARIOS', id, 'Usuario actualizado');
  return ok_({ row: usuarioPublico_(row) });
}

function protegerUltimoAdministrador_(usuarioActual, cambios) {
  if (!usuarioActual || usuarioActual.ROL_ID !== 'ROL-ADMIN' || usuarioActual.ESTADO !== 'Activo') return;
  const nuevoRol = Object.prototype.hasOwnProperty.call(cambios, 'ROL_ID') ? String(cambios.ROL_ID) : usuarioActual.ROL_ID;
  const nuevoEstado = Object.prototype.hasOwnProperty.call(cambios, 'ESTADO') ? String(cambios.ESTADO) : usuarioActual.ESTADO;
  const eliminado = String(cambios.ELIMINADO || usuarioActual.ELIMINADO || 'NO');
  if (nuevoRol === 'ROL-ADMIN' && nuevoEstado === 'Activo' && eliminado !== 'SI') return;
  const otros = listarRegistros_('USUARIOS', {}).filter(function(row) {
    return row.ID !== usuarioActual.ID && row.ROL_ID === 'ROL-ADMIN' && usuarioTieneAccesoConfigurado_(row);
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

function permisosBaseRol_(user) {
  if (!user) return [];
  if (user.ROL_ID === 'ROL-ADMIN') return ['*:*'];
  return listarRegistros_('PERMISOS', {}).filter(function(row) {
    return row.ROL_ID === user.ROL_ID && row.PERMITIDO === 'SI';
  }).map(function(row) { return row.MODULO + ':' + row.ACCION; });
}

function permisosEfectivosUsuario_(user) {
  if (!user) return [];
  if (user.ROL_ID === 'ROL-ADMIN') return ['*:*'];
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
  const role = obtenerRegistro_('ROLES', user.ROL_ID);
  const driver = listarRegistros_('CONDUCTORES', {}).find(function(row) { return row.USUARIO_ID === user.ID; });
  const personalizados = normalizarListaPermisos_(user.PERMISOS_PERSONALIZADOS);
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
    MODO_PERMISOS: String(user.MODO_PERMISOS || 'ROL').toUpperCase(),
    PERMISOS_PERSONALIZADOS: personalizados,
    VERSION_PERMISOS: Number(user.VERSION_PERMISOS || 0),
    PERMISOS: permisosEfectivosUsuario_(user),
  };
}

function exigirPermiso_(user, moduleName, action) {
  if (!tienePermiso_(user, moduleName, action)) throw new Error('PERMISO_DENEGADO');
  return true;
}

function tienePermiso_(user, moduleName, action) {
  if (!user) return false;
  if (user.ROL_ID === 'ROL-ADMIN') return true;
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
