(function () {
  'use strict';

  const config = window.CONFIGURACION_FLOTAS;
  const accionesAplicacion = Object.freeze({
    health:'salud', status:'estadoSistema', bootstrap:'instalacionInicial', login:'iniciarSesion',
    logout:'cerrarSesion', me:'miSesion', dashboard:'panelPrincipal', list:'listar', get:'obtener',
    quickLoad:'cargaRapida',
    create:'crear', update:'actualizar', delete:'eliminar', startOperation:'iniciarOperacion',
    finishOperation:'finalizarOperacion', editOperationAdmin:'editarOperacionAdministrativa', deleteOperationAdmin:'eliminarOperacionAdministrativa', saveLocation:'guardarUbicacion', latestLocations:'ultimasUbicaciones',
    changePassword:'cambiarContrasena', saveUserPermissions:'actualizarPermisosUsuario', saveCompany:'guardarEmpresa', saveOperationalPoint:'guardarPuntoOperacion', getOperationalPoint:'obtenerPuntoOperacion', clearOperationalData:'limpiarDatosOperativos',
    assignRoute:'asignarRuta', updateRouteStatus:'actualizarEstadoRuta', sendNotification:'enviarNotificacion',
    readNotification:'marcarNotificacionLeida', heartbeat:'actualizarConexion', realtimeSummary:'resumenTiempoReal',
    diagnoseSystem:'diagnosticoSistema', repairSystem:'repararSistema',
    validateVehicleQr:'validarQrVehiculo', createVehicleCheckin:'crearCheckinVehicular',
    reviewVehicleCheckin:'revisarCheckinVehicular', availableCheckins:'checkinsDisponibles',
    bulkImport:'importarMasivo', registerConnectionIp:'registrarIpConexion'
  });
  const recursosAplicacion = Object.freeze({
    users:'usuarios', roles:'roles', permissions:'permisos', vehicles:'vehiculos', drivers:'conductores',
    operations:'operaciones', gps:'gps', history:'historial', maintenance:'mantenciones', documents:'documentos',
    alerts:'alertas', reports:'reportes', audit:'bitacora', parameters:'parametros', companies:'empresas', qr:'qr',
    routes:'rutas', notifications:'notificaciones', connections:'conexiones', checkins:'checkins'
  });

  const resourceMap = {
    users: 'users', roles: 'roles', permissions: 'permissions', vehicles: 'vehicles',
    drivers: 'drivers', operations: 'operations', gps: 'gps', history: 'history',
    maintenance: 'maintenance', documents: 'documents', alerts: 'alerts', reports: 'reports',
    audit: 'audit', parameters: 'parameters', companies: 'companies', qr: 'qr',
    routes: 'routes', notifications: 'notifications', connections: 'connections', checkins:'checkins'
  };

  const emptyState = () => ({
    version: 2,
    users: [], roles: [], permissions: [], vehicles: [], drivers: [], operations: [], gps: [], gpsCurrent: [],
    history: [], maintenance: [], documents: [], alerts: [], reports: [], audit: [], parameters: [],
    companies: [], qr: [], routes: [], notifications: [], connections: [], checkins: [], sessions: []
  });

  function loadLocal() {
    try {
      const saved = JSON.parse(localStorage.getItem(config.CLAVE_ALMACENAMIENTO_LOCAL));
      return saved && Array.isArray(saved.users) ? { ...emptyState(), ...saved } : emptyState();
    } catch (_) {
      return emptyState();
    }
  }

  let localDb = loadLocal();
  let auth = loadAuth();
  const qrAuthorizations = new Map();
  const cacheRespuestas = new Map();
  const solicitudesPendientes = new Map();
  const accionesLectura = new Set(['status','me','dashboard','list','realtimeSummary','diagnoseSystem','getOperationalPoint']);
  const clientIpCacheKey = 'flotas_ip_publica_v1';
  const claveCachePersistente = config.CLAVE_CACHE_MODULOS_LOCAL || 'sistema_gestion_flotas_cache_modulos_v1';
  const accionesCachePersistente = new Set(['dashboard','list','diagnoseSystem','getOperationalPoint']);
  let temporizadorPersistenciaCache = null;

  function entradaCachePersistible(entry) {
    return Boolean(entry && accionesCachePersistente.has(entry.action));
  }

  function cargarCachePersistente() {
    try {
      const saved = JSON.parse(localStorage.getItem(claveCachePersistente) || '{}');
      const maxAge = Number(config.CACHE_MAXIMA_ANTIGUEDAD_MILISEGUNDOS || 86400000);
      const now = Date.now();
      const entries = Array.isArray(saved.entries) ? saved.entries : [];
      entries.forEach(item => {
        if (!Array.isArray(item) || item.length !== 2) return;
        const [key, entry] = item;
        if (!entradaCachePersistible(entry)) return;
        if (!entry.time || now - Number(entry.time) > maxAge) return;
        cacheRespuestas.set(String(key), { ...entry, origin:'DISPOSITIVO' });
      });
    } catch (_) {
      try { localStorage.removeItem(claveCachePersistente); } catch (_) {}
    }
  }

  function persistirCacheAhora() {
    temporizadorPersistenciaCache = null;
    try {
      const maxEntries = Math.max(8, Number(config.CACHE_LOCAL_MAXIMO_ENTRADAS || 42));
      const maxBytes = Math.max(250000, Number(config.CACHE_LOCAL_MAXIMO_BYTES || 3500000));
      const candidates = [...cacheRespuestas.entries()]
        .filter(([, entry]) => entradaCachePersistible(entry))
        .sort((a,b) => Number(b[1].time || 0) - Number(a[1].time || 0))
        .slice(0, maxEntries);
      const selected = [];
      for (const candidate of candidates) {
        const attempt = { version:1, savedAt:Date.now(), entries:[...selected, candidate] };
        if (JSON.stringify(attempt).length > maxBytes) break;
        selected.push(candidate);
      }
      localStorage.setItem(claveCachePersistente, JSON.stringify({ version:1, savedAt:Date.now(), entries:selected }));
    } catch (_) {
      try { localStorage.removeItem(claveCachePersistente); } catch (_) {}
    }
  }

  function programarPersistenciaCache() {
    if (temporizadorPersistenciaCache) clearTimeout(temporizadorPersistenciaCache);
    temporizadorPersistenciaCache = setTimeout(persistirCacheAhora, 120);
  }

  cargarCachePersistente();

  function loadAuth() {
    try { return JSON.parse(localStorage.getItem(config.CLAVE_SESION_LOCAL)) || {}; }
    catch (_) { return {}; }
  }

  function saveLocal() {
    localStorage.setItem(config.CLAVE_ALMACENAMIENTO_LOCAL, JSON.stringify(localDb));
    window.dispatchEvent(new CustomEvent('flotas:guardado-local'));
  }

  function setAuth(data) {
    const fichaAnterior = auth.token || '';
    auth = data || {};
    if (fichaAnterior !== (auth.token || '')) limpiarCache();
    if (auth.token) localStorage.setItem(config.CLAVE_SESION_LOCAL, JSON.stringify(auth));
    else localStorage.removeItem(config.CLAVE_SESION_LOCAL);
    window.dispatchEvent(new CustomEvent('flotas:sesion-cambiada', { detail: auth }));
  }

  function isRemote() {
    if (sessionStorage.getItem('flotas_forzar_local') === '1') return false;
    if (config.MODO === 'local') return false;
    if (config.MODO === 'aplicacion_google') return true;
    return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:\?|$)/.test(String(config.DIRECCION_APLICACION || '').trim());
  }

  function backendLabel() {
    return isRemote() ? 'Base de datos central' : 'Base de datos local';
  }

  async function getClientIp({force=false}={}) {
    if (!force) {
      const cached=sessionStorage.getItem(clientIpCacheKey);
      if(cached)return cached;
    }
    const endpoints=['https://api64.ipify.org?format=json','https://api.ipify.org?format=json'];
    for(const endpoint of endpoints){
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4500);
      try{
        const response=await fetch(endpoint,{cache:'no-store',signal:controller.signal,headers:{Accept:'application/json'}});
        if(!response.ok)continue;
        const data=await response.json();const ip=String(data.ip||'').trim();
        if(ip&&/^[0-9a-fA-F:.]+$/.test(ip)){sessionStorage.setItem(clientIpCacheKey,ip);return ip;}
      }catch(_){ }finally{clearTimeout(timer);}
    }
    return '';
  }

  async function registerConnectionIp(extra={}) {
    const ip=extra.IP_PUBLICA||await getClientIp();
    if(!ip||!auth.token)return {registrada:false};
    try{return await request('registerConnectionIp',{data:{...extra,IP_PUBLICA:ip}});}
    catch(_){return {registrada:false};}
  }

  const CODIGOS_ERROR_SESION = new Set(['SESION_INVALIDA','SESION_EXPIRADA','AUTENTICACION_REQUERIDA','USUARIO_DESHABILITADO']);
  function authErrorCode(error) {
    return String(error?.message || error || '').split(':')[0].trim();
  }
  function isAuthError(error) {
    return CODIGOS_ERROR_SESION.has(authErrorCode(error));
  }
  function notificarSesionInvalida(codigo) {
    window.dispatchEvent(new CustomEvent('flotas:sesion-invalida', { detail:{ codigo:codigo || 'SESION_INVALIDA' } }));
  }

  async function request(action, payload = {}) {
    if (isRemote()) {
      if (accionesLectura.has(action) && payload.cache !== false) return solicitarLecturaRemota(action, payload);
      const result = await remoteRequest(action, payload);
      invalidarDespuesDeEscritura(action, payload);
      return result;
    }
    return localRequest(action, payload);
  }

  function limpiarCache() {
    cacheRespuestas.clear();
    solicitudesPendientes.clear();
    if (temporizadorPersistenciaCache) clearTimeout(temporizadorPersistenciaCache);
    temporizadorPersistenciaCache = null;
    try { localStorage.removeItem(claveCachePersistente); } catch (_) {}
  }

  function normalizarParaClave(value) {
    if (Array.isArray(value)) return value.map(normalizarParaClave);
    if (!value || typeof value !== 'object') return value;
    return Object.keys(value).sort().reduce((output, key) => {
      if (['force','cache','marcaTiempo'].includes(key)) return output;
      output[key] = normalizarParaClave(value[key]);
      return output;
    }, {});
  }

  function claveCache(action, payload = {}) {
    const usuario = auth.user?.ID || auth.sessionId || (auth.token ? 'sesion' : 'publico');
    return `${usuario}|${action}|${JSON.stringify(normalizarParaClave(payload))}`;
  }

  function politicaCache(action) {
    if (action === 'realtimeSummary') {
      return {
        vigente: Number(config.CACHE_TIEMPO_REAL_MILISEGUNDOS || 4000),
        maxima: Math.max(15000, Number(config.CACHE_MAXIMA_ANTIGUEDAD_MILISEGUNDOS || 300000)),
      };
    }
    if (action === 'me') return { vigente: 600000, maxima: 1800000 };
    return {
      vigente: Number(config.CACHE_MODULOS_MILISEGUNDOS || 60000),
      maxima: Number(config.CACHE_MAXIMA_ANTIGUEDAD_MILISEGUNDOS || 300000),
    };
  }

  function guardarEnCache(action, payload, data) {
    const key = claveCache(action, payload);
    const entry = {
      action,
      resource: payload.resource || '',
      payload: normalizarParaClave(payload),
      data,
      time: Date.now(),
      origin:'SERVIDOR',
    };
    cacheRespuestas.set(key, entry);
    if (cacheRespuestas.size > 80) cacheRespuestas.delete(cacheRespuestas.keys().next().value);
    if (entradaCachePersistible(entry)) programarPersistenciaCache();
    window.dispatchEvent(new CustomEvent('flotas:cache-actualizada', { detail:{ action, resource:entry.resource, time:entry.time } }));
    return data;
  }

  function invalidarCache(criteria = {}) {
    const actions = new Set(criteria.actions || []);
    const resources = new Set(criteria.resources || []);
    if (!actions.size && !resources.size) {
      limpiarCache();
      return;
    }
    let changed = false;
    cacheRespuestas.forEach((entry, key) => {
      if (actions.has(entry.action) || (entry.resource && resources.has(entry.resource))) {
        cacheRespuestas.delete(key);
        changed = true;
      }
    });
    if (changed) programarPersistenciaCache();
  }

  function invalidarDespuesDeEscritura(action, payload = {}) {
    if (accionesLectura.has(action) || ['health','login'].includes(action)) return;
    if (action === 'heartbeat') {
      invalidarCache({ actions:['realtimeSummary'] });
      return;
    }
    if (action === 'saveLocation') {
      invalidarCache({ actions:['realtimeSummary'], resources:['gps'] });
      return;
    }
    const impacts = {
      create: { actions:['dashboard'], resources:[payload.resource,'audit'] },
      update: { actions:['dashboard'], resources:[payload.resource,'audit'] },
      delete: { actions:['dashboard'], resources:[payload.resource,'audit'] },
      startOperation: { actions:['dashboard','realtimeSummary'], resources:['operations','vehicles','drivers','history','audit'] },
      finishOperation: { actions:['dashboard','realtimeSummary'], resources:['operations','vehicles','drivers','history','audit'] },
      editOperationAdmin: { actions:['dashboard','realtimeSummary'], resources:['operations','vehicles','drivers','routes','history','audit'] },
      deleteOperationAdmin: { actions:['dashboard','realtimeSummary'], resources:['operations','vehicles','drivers','routes','history','audit'] },
      createVehicleCheckin: { actions:['dashboard'], resources:['checkins','alerts','audit'] },
      reviewVehicleCheckin: { actions:['dashboard'], resources:['checkins','notifications','audit'] },
      assignRoute: { actions:['dashboard','realtimeSummary'], resources:['routes','notifications','audit'] },
      updateRouteStatus: { actions:['dashboard','realtimeSummary'], resources:['routes','notifications','audit'] },
      sendNotification: { actions:['dashboard','realtimeSummary'], resources:['notifications','audit'] },
      readNotification: { actions:['dashboard','realtimeSummary'], resources:['notifications'] },
      saveCompany: { actions:['status','getOperationalPoint'], resources:['companies','audit'] },
      saveOperationalPoint: { actions:['status','dashboard','diagnoseSystem','getOperationalPoint'], resources:['companies','operations','routes','audit'] },
      changePassword: { actions:['me'], resources:['users','audit'] },
      saveUserPermissions: { actions:['me','dashboard'], resources:['users','audit'] },
      repairSystem: { actions:['status','dashboard','realtimeSummary','diagnoseSystem','getOperationalPoint'], resources:['companies','users','vehicles','drivers','routes','operations','gps','notifications','alerts','history','checkins','audit'] },
      bulkImport: { actions:['dashboard'], resources:[payload.resource,'audit'] },
      registerConnectionIp: { actions:['realtimeSummary'], resources:['connections','audit'] },
    };
    if (action === 'logout' || action === 'clearOperationalData') return limpiarCache();
    const impact = impacts[action];
    if (impact) invalidarCache(impact);
  }

  function iniciarActualizacionLectura(action, payload, key) {
    if (solicitudesPendientes.has(key)) return solicitudesPendientes.get(key);
    const cleanPayload = { ...payload };
    delete cleanPayload.force;
    delete cleanPayload.cache;
    const pending = remoteRequest(action, cleanPayload)
      .then(data => guardarEnCache(action, cleanPayload, data))
      .finally(() => {
        if (solicitudesPendientes.get(key) === pending) solicitudesPendientes.delete(key);
      });
    solicitudesPendientes.set(key, pending);
    return pending;
  }

  async function solicitarLecturaRemota(action, payload = {}) {
    const key = claveCache(action, payload);
    const cached = cacheRespuestas.get(key);
    const policy = politicaCache(action);
    const age = cached ? Date.now() - cached.time : Infinity;
    if (!payload.force && cached && age <= policy.vigente) return cached.data;
    if (!payload.force && cached && age <= policy.maxima) {
      iniciarActualizacionLectura(action, payload, key).catch(() => {});
      return cached.data;
    }
    try {
      return await iniciarActualizacionLectura(action, payload, key);
    } catch (error) {
      if (cached) return cached.data;
      throw error;
    }
  }

  function informacionCache(action, payload = {}) {
    const entry = cacheRespuestas.get(claveCache(action, payload));
    if (!entry) return null;
    return { action:entry.action, resource:entry.resource, time:Number(entry.time || 0), age:Date.now()-Number(entry.time || 0), origin:entry.origin || 'MEMORIA' };
  }

  function ultimaActualizacionCache(resource = '') {
    let latest = null;
    cacheRespuestas.forEach(entry => {
      if (resource && entry.resource !== resource) return;
      if (!latest || Number(entry.time || 0) > Number(latest.time || 0)) latest = entry;
    });
    return latest ? { time:Number(latest.time || 0), origin:latest.origin || 'MEMORIA', resource:latest.resource || '', action:latest.action } : null;
  }

  function descriptorConsulta(query, index) {
    const action = query.action;
    const payload = query.payload || {};
    if (!accionesLectura.has(action)) throw new Error('CONSULTA_RAPIDA_NO_PERMITIDA');
    return {
      outputKey: query.key || query.clave || String(index),
      action,
      payload,
      cacheKey: claveCache(action, payload),
    };
  }

  async function ejecutarLoteRemoto(descriptors) {
    if (!descriptors.length) return [];
    const batchPromise = (async () => {
      const consultas = descriptors.map((descriptor, index) => ({
        clave: String(index),
        accion: accionesAplicacion[descriptor.action] || descriptor.action,
        recurso: descriptor.payload.resource ? (recursosAplicacion[descriptor.payload.resource] || descriptor.payload.resource) : undefined,
        filtros: descriptor.payload.filters,
        limite: descriptor.payload.limit,
        marcaTiempo: descriptor.payload.marcaTiempo,
      }));
      let values;
      try {
        const response = await remoteRequest('quickLoad', { data:{ consultas } });
        values = descriptors.map((_, index) => response.resultados?.[String(index)] || {});
      } catch (error) {
        if (error.message !== 'ACCION_NO_ENCONTRADA') throw error;
        values = await Promise.all(descriptors.map(descriptor => remoteRequest(descriptor.action, descriptor.payload)));
      }
      values.forEach((data, index) => guardarEnCache(descriptors[index].action, descriptors[index].payload, data));
      return values;
    })();
    const itemPromises = descriptors.map((descriptor, index) => batchPromise.then(values => values[index]));
    descriptors.forEach((descriptor, index) => solicitudesPendientes.set(descriptor.cacheKey, itemPromises[index]));
    try {
      return await batchPromise;
    } finally {
      descriptors.forEach((descriptor, index) => {
        if (solicitudesPendientes.get(descriptor.cacheKey) === itemPromises[index]) solicitudesPendientes.delete(descriptor.cacheKey);
      });
    }
  }

  async function requestBatch(queries, options = {}) {
    if (!Array.isArray(queries) || !queries.length) return {};
    if (!isRemote()) {
      const values = await Promise.all(queries.map(query => request(query.action, query.payload || {})));
      return queries.reduce((output, query, index) => {
        output[query.key || query.clave || String(index)] = values[index];
        return output;
      }, {});
    }
    const maximo = Number(config.PRECARGA_MAXIMA_CONSULTAS || 16);
    const descriptors = queries.slice(0, maximo).map(descriptorConsulta);
    const output = {};
    const needed = [];
    const stale = [];
    const pending = [];
    descriptors.forEach(descriptor => {
      const cached = cacheRespuestas.get(descriptor.cacheKey);
      const policy = politicaCache(descriptor.action);
      const age = cached ? Date.now() - cached.time : Infinity;
      if (!options.force && cached && age <= policy.vigente) {
        output[descriptor.outputKey] = cached.data;
      } else if (!options.force && cached && age <= policy.maxima) {
        output[descriptor.outputKey] = cached.data;
        stale.push(descriptor);
      } else if (solicitudesPendientes.has(descriptor.cacheKey)) {
        pending.push(solicitudesPendientes.get(descriptor.cacheKey).then(data => {
          output[descriptor.outputKey] = data;
        }));
      } else {
        needed.push(descriptor);
      }
    });

    if (needed.length) {
      const batch = [...needed, ...stale.filter(item => !solicitudesPendientes.has(item.cacheKey))];
      const values = await ejecutarLoteRemoto(batch);
      batch.forEach((descriptor, index) => { output[descriptor.outputKey] = values[index]; });
    } else if (stale.length) {
      ejecutarLoteRemoto(stale.filter(item => !solicitudesPendientes.has(item.cacheKey))).catch(() => {});
    }
    if (pending.length) await Promise.all(pending);
    return output;
  }

  function prefetch(queries) {
    return requestBatch(queries).catch(() => ({}));
  }


  function prepararSolicitudRemota(accion, carga) {
    const solicitud = { ...carga };
    solicitud.accion = accionesAplicacion[accion] || accion;
    solicitud.recurso = carga.resource ? (recursosAplicacion[carga.resource] || carga.resource) : undefined;
    solicitud.datos = carga.data;
    solicitud.filtros = carga.filters;
    solicitud.limite = carga.limit;
    solicitud.identificador = carga.id;
    solicitud.confirmacion = carga.confirmacion || carga.confirmation;
    solicitud.fichaSesion = auth.token || '';
    solicitud.agenteNavegador = navigator.userAgent;
    delete solicitud.action; delete solicitud.resource; delete solicitud.data; delete solicitud.filters;
    delete solicitud.limit; delete solicitud.id; delete solicitud.token; delete solicitud.userAgent; delete solicitud.confirmation;
    delete solicitud.force; delete solicitud.cache;
    return solicitud;
  }

  async function remoteRequest(action, payload) {
    if (!config.DIRECCION_APLICACION) throw new Error('DIRECCION_APLICACION_NO_CONFIGURADA');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.TIEMPO_ESPERA_MILISEGUNDOS);
    try {
      const response = await fetch(config.DIRECCION_APLICACION, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(prepararSolicitudRemota(action, payload)),
        signal: controller.signal,
        redirect: 'follow'
      });
      const text = await response.text();
      let result;
      try { result = JSON.parse(text); }
      catch (_) { throw new Error('RESPUESTA_NO_VALIDA: ' + text.slice(0, 180)); }
      if (!result.ok) {
        const codigo = result.error || 'ERROR_SERVICIO';
        if (isAuthError(codigo)) notificarSesionInvalida(codigo);
        throw new Error(codigo);
      }
      return result.data || {};
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('TIEMPO_DE_ESPERA_AGOTADO');
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  async function digest(value) {
    if (window.crypto && crypto.subtle) {
      const bytes = new TextEncoder().encode(String(value));
      const hash = await crypto.subtle.digest('SHA-256', bytes);
      return [...new Uint8Array(hash)].map(v => v.toString(16).padStart(2, '0')).join('');
    }
    return btoa(unescape(encodeURIComponent(String(value))));
  }

  function id(prefix) {
    return `${prefix}-${crypto.randomUUID ? crypto.randomUUID().split('-')[0].toUpperCase() : Date.now().toString(36).toUpperCase()}`;
  }
  const iso = () => new Date().toISOString();
  const activeRows = rows => rows.filter(row => row.ELIMINADO !== 'SI');
  const find = (resource, recordId) => activeRows(localDb[resource] || []).find(row => row.ID === recordId);

  function seedCatalogs() {
    const now = iso();
    const roles = [
      { ID:'ROL-ADMIN', NOMBRE:'Administrador', DESCRIPCION:'Acceso completo', ESTADO:'Activo', CREADO_EN:now, ACTUALIZADO_EN:now, ELIMINADO:'NO' },
      { ID:'ROL-SUPERVISOR', NOMBRE:'Supervisor', DESCRIPCION:'Gestión operacional', ESTADO:'Activo', CREADO_EN:now, ACTUALIZADO_EN:now, ELIMINADO:'NO' },
      { ID:'ROL-CONDUCTOR', NOMBRE:'Conductor', DESCRIPCION:'Operaciones, rutas, GPS y notificaciones propias', ESTADO:'Activo', CREADO_EN:now, ACTUALIZADO_EN:now, ELIMINADO:'NO' }
    ];
    roles.forEach(role => { if (!activeRows(localDb.roles).some(row => row.ID === role.ID)) localDb.roles.push(role); });
    const allModules=['PANEL_PRINCIPAL','USUARIOS','VEHICULOS','CONDUCTORES','OPERACIONES','CHECKIN','CHECKIN_APROBACIONES','GPS','HISTORIAL','MANTENCIONES','DOCUMENTOS','ALERTAS','REPORTES','BITACORA','CONFIGURACION','QR','RUTAS','NOTIFICACIONES','CONEXIONES'];
    const actions=['LEER','CREAR','ACTUALIZAR','ELIMINAR'];
    const supervisorModules=new Set(['PANEL_PRINCIPAL','VEHICULOS','CONDUCTORES','OPERACIONES','CHECKIN','CHECKIN_APROBACIONES','GPS','HISTORIAL','MANTENCIONES','DOCUMENTOS','ALERTAS','REPORTES','QR','RUTAS','NOTIFICACIONES','CONEXIONES']);
    const driverRules={
      PANEL_PRINCIPAL:['LEER'],VEHICULOS:['LEER'],CONDUCTORES:['LEER'],OPERACIONES:['LEER','CREAR','ACTUALIZAR'],CHECKIN:['LEER','CREAR'],
      GPS:['LEER','CREAR'],HISTORIAL:['LEER'],DOCUMENTOS:['LEER'],ALERTAS:['LEER','ACTUALIZAR'],QR:['LEER','ACTUALIZAR'],
      RUTAS:['LEER','ACTUALIZAR'],NOTIFICACIONES:['LEER','ACTUALIZAR'],CONEXIONES:['LEER','CREAR','ACTUALIZAR']
    };
    const ensure=(role,module,action,allowed)=>{
      if(!activeRows(localDb.permissions).some(row=>row.ROL_ID===role&&row.MODULO===module&&row.ACCION===action)){
        localDb.permissions.push({ID:id('PER'),ROL_ID:role,MODULO:module,ACCION:action,PERMITIDO:allowed?'SI':'NO',CREADO_EN:now,ACTUALIZADO_EN:now,ELIMINADO:'NO'});
      }
    };
    allModules.forEach(module=>actions.forEach(action=>ensure('ROL-ADMIN',module,action,true)));
    allModules.forEach(module=>actions.forEach(action=>ensure('ROL-SUPERVISOR',module,action,supervisorModules.has(module)&&action!=='ELIMINAR')));
    allModules.forEach(module=>actions.forEach(action=>ensure('ROL-CONDUCTOR',module,action,(driverRules[module]||[]).includes(action))));
  }

  function audit(user, action, module, detail, recordId = '') {
    localDb.audit.unshift({
      ID:id('BIT'), USUARIO_ID:user?.ID || '', USUARIO_NOMBRE:user?.NOMBRE || 'Sistema', ACCION:action,
      MODULO:module, REGISTRO_ID:recordId, DETALLE:detail, IP_CLIENTE:'', FECHA_HORA:iso(), CREADO_EN:iso(), ELIMINADO:'NO'
    });
  }

  async function localRequest(action, payload) {
    await Promise.resolve();
    switch (action) {
      case 'health': return { service:'Base de datos local del Sistema de Gestión de Flotas', version:'3.5.0', now:iso() };
      case 'status': return {
        connected:true, needsSetup:activeRows(localDb.users).length === 0, spreadsheetName:'Base local del navegador',
        rows:{ users:activeRows(localDb.users).length, vehicles:activeRows(localDb.vehicles).length,
          drivers:activeRows(localDb.drivers).length, operations:activeRows(localDb.operations).length },
        company: cleanRow(localPrimaryCompany() || null)
      };
      case 'bootstrap': {
        if (activeRows(localDb.users).length) throw new Error('SISTEMA_YA_INICIALIZADO');
        if (!payload.nombre || !payload.correo || String(payload.contrasena ?? '').length === 0) throw new Error('DATOS_DE_ADMINISTRADOR_INVALIDOS');
        if (String(payload.contrasenaConfirmacion || payload.contrasena) !== String(payload.contrasena)) throw new Error('CONTRASENAS_NO_COINCIDEN');
        seedCatalogs();
        const salt = id('SALT');
        const user = {
          ID:id('USR'), NOMBRE:payload.nombre.trim(), CORREO:payload.correo.trim().toLowerCase(),
          SAL_CONTRASENA:salt, CONTRASENA_CIFRADA:await digest(payload.contrasena + ':' + salt), ROL_ID:'ROL-ADMIN',
          ESTADO:'Activo', TELEFONO:payload.telefono || '', ULTIMO_ACCESO:'', CREADO_EN:iso(), ACTUALIZADO_EN:iso(), ELIMINADO:'NO'
        };
        localDb.users.push(user);
        if(payload.nombreEmpresa){localDb.companies.push({ID:id('EMP'),RUT:payload.rutEmpresa||'',RAZON_SOCIAL:payload.nombreEmpresa,NOMBRE_FANTASIA:payload.nombreEmpresa,TELEFONO_PRINCIPAL:payload.telefonoEmpresa||payload.telefono||'',CORREO:payload.correo,PAIS:'Chile',ZONA_HORARIA:'America/Santiago',MONEDA:'CLP',UNIDAD_DISTANCIA:'km',COLOR_PRINCIPAL:'#0E9F91',COLOR_SECUNDARIO:'#08746B',COLOR_ACENTO:'#3578E5',COLOR_FONDO:'#F3F7FA',COLOR_SUPERFICIE:'#FFFFFF',COLOR_TEXTO:'#173047',COLOR_TEXTO_SECUNDARIO:'#65798B',COLOR_BORDE:'#DCE6EC',COLOR_MENU:'#071725',COLOR_MENU_SECUNDARIO:'#0D2638',COLOR_EXITO:'#0E9F91',COLOR_ADVERTENCIA:'#D89216',COLOR_PELIGRO:'#DC4D60',COLOR_FONDO_OSCURO:'#071725',COLOR_SUPERFICIE_OSCURO:'#0D2638',COLOR_TEXTO_OSCURO:'#E9F1F7',COLOR_TEXTO_SECUNDARIO_OSCURO:'#9EB0BF',COLOR_BORDE_OSCURO:'#214359',TEMA_PREDETERMINADO:'Sistema',ESTADO:'Activo',CREADO_EN:iso(),ACTUALIZADO_EN:iso(),ELIMINADO:'NO'});}
        audit(user,'INSTALACION_INICIAL','SEGURIDAD','Preconfiguración automática y administrador inicial creados',user.ID); saveLocal();
        return { initialized:true, user:publicUser(user), companyConfigured:Boolean(payload.nombreEmpresa) };
      }
      case 'login': {
        seedCatalogs();
        const email = String(payload.correo || '').trim().toLowerCase();
        const user = activeRows(localDb.users).find(row => row.CORREO === email && row.ESTADO === 'Activo');
        if (!user || user.CONTRASENA_CIFRADA !== await digest(String(payload.contrasena || '') + ':' + user.SAL_CONTRASENA)) throw new Error('CREDENCIALES_INVALIDAS');
        const token = id('TOKEN') + id('TOKEN');
        user.ULTIMO_ACCESO = iso(); user.ACTUALIZADO_EN = iso();
        const loginIp=String(payload.IP_PUBLICA||payload.ipPublica||'').trim();const sessionRow={ ID:id('SES'), USUARIO_ID:user.ID, FICHA_SESION_CIFRADA:await digest(token), FECHA_INICIO:iso(), FECHA_EXPIRACION:new Date(Date.now()+72*3600000).toISOString(), ACTIVA:'SI', IP_PUBLICA:loginIp, IP_VERSION:loginIp.includes(':')?'IPv6':loginIp?'IPv4':'', IP_CAPTURADA_EN:loginIp?iso():'' };
        localDb.sessions.push(sessionRow);
        audit(user,'INICIO_SESION','SEGURIDAD','Inicio de sesión correcto',user.ID); saveLocal();
        setAuth({ token, sessionId:sessionRow.ID, user:publicUser(user) });
        return { token, sessionId:sessionRow.ID, user:publicUser(user), expiresAt:new Date(Date.now()+72*3600000).toISOString() };
      }
      case 'logout': {
        const user=currentLocalUser(),sessionId=auth.sessionId||'';if(user){audit(user,'CIERRE_SESION','SEGURIDAD','Cierre de sesión',user.ID);const session=find('sessions',sessionId);if(session){session.ACTIVA='NO';session.ULTIMO_USO=iso();}activeRows(localDb.connections).filter(row=>row.SESION_ID===sessionId).forEach(row=>{row.ESTADO='Desconectado';row.ACTIVIDAD='Inactivo';row.PAGINA_VISIBLE='NO';row.ULTIMA_CONEXION=iso();row.ACTUALIZADO_EN=iso();});}
        setAuth({}); saveLocal(); return { loggedOut:true };
      }
      case 'me': seedCatalogs(); return { user:publicUser(requireLocalUser()) };
      case 'dashboard': return panelPrincipalLocal();
      case 'list': return localList(payload);
      case 'get': {
        const user=requireLocalUser(),key=resourceMap[payload.resource];requireLocalPermission(user,moduleByResource[key],'LEER');const row = find(key, payload.id);
        if (!row) throw new Error('REGISTRO_NO_ENCONTRADO'); if(!localFilterRows(key,[row],user).length)throw new Error('PERMISO_DENEGADO');return { row:cleanRow(row), total:1 };
      }
      case 'create': return localCreate(payload);
      case 'update': return localUpdate(payload);
      case 'delete': return localDelete(payload);
      case 'startOperation': return localStartOperation(payload);
      case 'finishOperation': return localFinishOperation(payload);
      case 'editOperationAdmin': return localEditOperationAdmin(payload);
      case 'deleteOperationAdmin': return localDeleteOperationAdmin(payload);
      case 'createVehicleCheckin': return localCreateVehicleCheckin(payload);
      case 'reviewVehicleCheckin': return localReviewVehicleCheckin(payload);
      case 'availableCheckins': return localAvailableCheckins(payload);
      case 'validateVehicleQr': return localValidateVehicleQr(payload);
      case 'saveLocation': return localSaveLocation(payload);
      case 'latestLocations': return localLatestLocations(payload);
      case 'assignRoute': return localAssignRoute(payload);
      case 'updateRouteStatus': return localUpdateRouteStatus(payload);
      case 'sendNotification': return localSendNotification(payload);
      case 'readNotification': return localReadNotification(payload);
      case 'heartbeat': return localHeartbeat(payload);
      case 'realtimeSummary': return localRealtimeSummary(payload);
      case 'diagnoseSystem': return localDiagnoseSystem();
      case 'repairSystem': return localRepairSystem();
      case 'changePassword': return localChangePassword(payload);
      case 'saveUserPermissions': return localSaveUserPermissions(payload);
      case 'saveCompany': return localSaveCompany(payload);
      case 'saveOperationalPoint': return localSaveOperationalPoint(payload);
      case 'getOperationalPoint': return localGetOperationalPoint();
      case 'bulkImport': return localBulkImport(payload);
      case 'registerConnectionIp': return localRegisterConnectionIp(payload);
      case 'clearOperationalData': return localClear(payload);
      default: throw new Error('ACCION_NO_ENCONTRADA');
    }
  }

  function currentLocalUser() {
    return auth.user?.ID ? activeRows(localDb.users).find(row => row.ID === auth.user.ID) : null;
  }
  function requireLocalUser() {
    const user = currentLocalUser(); if (!user) throw new Error('AUTENTICACION_REQUERIDA'); return user;
  }
  const moduleByResource={
    users:'USUARIOS',roles:'USUARIOS',permissions:'USUARIOS',vehicles:'VEHICULOS',drivers:'CONDUCTORES',
    operations:'OPERACIONES',gps:'GPS',history:'HISTORIAL',maintenance:'MANTENCIONES',documents:'DOCUMENTOS',
    alerts:'ALERTAS',reports:'REPORTES',audit:'BITACORA',parameters:'CONFIGURACION',companies:'CONFIGURACION',
    qr:'QR',routes:'RUTAS',notifications:'NOTIFICACIONES',connections:'CONEXIONES',checkins:'CHECKIN'
  };
  const mandatoryLocalPermissions=['PANEL_PRINCIPAL:LEER','CONEXIONES:CREAR','CONEXIONES:ACTUALIZAR'];
  function normalizeLocalPermissions(value){let list=value;if(typeof list==='string'){try{list=JSON.parse(list||'[]');}catch(_){list=[];}}if(!Array.isArray(list))list=[];return [...new Set(list.map(item=>String(item||'').trim().toUpperCase()).filter(item=>/^[A-Z_]+:(LEER|CREAR|ACTUALIZAR|ELIMINAR)$/.test(item)))].sort();}
  function effectiveLocalPermissions(user){if(!user)return[];if(user.ROL_ID==='ROL-ADMIN')return['*:*'];const base=String(user.MODO_PERMISOS||'ROL').toUpperCase()==='PERSONALIZADO'?normalizeLocalPermissions(user.PERMISOS_PERSONALIZADOS):activeRows(localDb.permissions).filter(row=>row.ROL_ID===user.ROL_ID&&row.PERMITIDO==='SI').map(row=>`${row.MODULO}:${row.ACCION}`);return[...new Set([...base,...mandatoryLocalPermissions])].sort();}
  function hasLocalPermission(user,module,action) {
    if(user?.ROL_ID==='ROL-ADMIN')return true;
    return effectiveLocalPermissions(user).includes(`${module}:${action}`);
  }
  function requireLocalPermission(user,module,action){if(!hasLocalPermission(user,module,action))throw new Error('PERMISO_DENEGADO');}
  function localDriver(user){return activeRows(localDb.drivers).find(row=>row.USUARIO_ID===user?.ID)||null;}
  function localFilterRows(key,rows,user) {
    if(user.ROL_ID!=='ROL-CONDUCTOR')return rows;
    const driver=localDriver(user);
    if(key==='checkins')return rows.filter(row=>driver&&row.CONDUCTOR_ID===driver.ID);
    if(key==='notifications')return rows.filter(row=>row.DESTINATARIO_USUARIO_ID===user.ID||(driver&&row.DESTINATARIO_CONDUCTOR_ID===driver.ID));
    if(key==='connections')return rows.filter(row=>row.USUARIO_ID===user.ID);
    if(!driver&&['drivers','vehicles','operations','gps','routes','history','documents','maintenance','checkins'].includes(key))return[];
    if(key==='drivers')return rows.filter(row=>row.ID===driver.ID);
    if(['operations','gps','routes'].includes(key))return rows.filter(row=>row.CONDUCTOR_ID===driver.ID);
    const ownOperations=activeRows(localDb.operations).filter(row=>row.CONDUCTOR_ID===driver.ID);
    const ownRoutes=activeRows(localDb.routes).filter(row=>row.CONDUCTOR_ID===driver.ID);
    const vehicleIds=new Set([...ownOperations,...ownRoutes].map(row=>row.VEHICULO_ID).filter(Boolean));
    if(key==='vehicles')return rows.filter(row=>vehicleIds.has(row.ID));
    if(key==='maintenance')return rows.filter(row=>vehicleIds.has(row.VEHICULO_ID));
    if(key==='history'){const operationIds=new Set(ownOperations.map(row=>row.ID));return rows.filter(row=>operationIds.has(row.OPERACION_ID));}
    if(key==='documents')return rows.filter(row=>(row.ASOCIADO_TIPO==='Conductor'&&row.ASOCIADO_ID===driver.ID)||(row.ASOCIADO_TIPO==='Vehículo'&&vehicleIds.has(row.ASOCIADO_ID)));
    if(key==='alerts')return rows.filter(row=>!row.USUARIO_ID||row.USUARIO_ID===user.ID);
    return rows;
  }
  function publicUser(user) {
    const role = localDb.roles.find(row => row.ID === user.ROL_ID);
    const permissions=effectiveLocalPermissions(user);
    return { ID:user.ID,NOMBRE:user.NOMBRE,CORREO:user.CORREO,ROL_ID:user.ROL_ID,ROL_NOMBRE:role?.NOMBRE || user.ROL_ID,ESTADO:user.ESTADO,
      TELEFONO:user.TELEFONO || '',ULTIMO_ACCESO:user.ULTIMO_ACCESO || '',CONDUCTOR_ID:localDriver(user)?.ID||'',MODO_PERMISOS:String(user.MODO_PERMISOS||'ROL').toUpperCase(),PERMISOS_PERSONALIZADOS:normalizeLocalPermissions(user.PERMISOS_PERSONALIZADOS),VERSION_PERMISOS:Number(user.VERSION_PERMISOS||0),PERMISOS:permissions };
  }
  function cleanRow(row) {
    const out = { ...row }; delete out.CONTRASENA_CIFRADA; delete out.SAL_CONTRASENA; delete out.FICHA_SESION_CIFRADA; return out;
  }
  function localList(payload) {
    const user=requireLocalUser(); const key = resourceMap[payload.resource]; if (!key) throw new Error('RECURSO_NO_ENCONTRADO');
    requireLocalPermission(user,moduleByResource[key],'LEER');
    let rows = localFilterRows(key,activeRows(localDb[key] || []),user).map(cleanRow);
    if(key==='companies')rows=rows.slice().sort((a,b)=>{const activeA=String(a.ESTADO||'Activo')==='Activo'?1:0,activeB=String(b.ESTADO||'Activo')==='Activo'?1:0;if(activeA!==activeB)return activeB-activeA;return new Date(b.ACTUALIZADO_EN||b.CREADO_EN||0)-new Date(a.ACTUALIZADO_EN||a.CREADO_EN||0);});
    const filters = payload.filters || {};
    rows = rows.filter(row => Object.entries(filters).every(([k,v]) => !v || String(row[k] || '').toLowerCase() === String(v).toLowerCase()));
    return { rows, total:rows.length };
  }
  async function localCreate(payload) {
    const user = requireLocalUser(); const key = resourceMap[payload.resource]; if (!key) throw new Error('RECURSO_NO_ENCONTRADO');
    requireLocalPermission(user,moduleByResource[key],'CREAR');
    if(key==='checkins')return localCreateVehicleCheckin(payload);
    if(user.ROL_ID==='ROL-CONDUCTOR'){if(key==='operations')return localStartOperation(payload);if(key==='gps')return localSaveLocation(payload);if(key==='connections')throw new Error('ACCION_ESPECIAL_REQUERIDA');}
    const data = { ...(payload.data || {}) }, now = iso();
    const prefixes = {users:'USR',vehicles:'VEH',drivers:'CON',operations:'OPE',checkins:'CHK',gps:'GPS',history:'HIS',maintenance:'MAN',documents:'DOC',alerts:'ALT',reports:'REP',audit:'BIT',parameters:'PAR',companies:'EMP',qr:'QR',roles:'ROL',permissions:'PER',routes:'RUT',notifications:'NOT',connections:'CNX'};
    if (key === 'users') {
      if (String(data.CONTRASENA ?? '').length === 0) throw new Error('CONTRASENA_REQUERIDA');
      if (activeRows(localDb.users).some(row => row.CORREO === String(data.CORREO || '').toLowerCase())) throw new Error('CORREO_YA_EXISTE');
      const salt=id('SALT'); data.SAL_CONTRASENA=salt; data.CONTRASENA_CIFRADA=await digest(data.CONTRASENA+':'+salt); delete data.CONTRASENA;
      data.CORREO=String(data.CORREO || '').toLowerCase(); data.ESTADO=data.ESTADO || 'Activo'; data.ROL_ID=data.ROL_ID || 'ROL-CONDUCTOR'; data.MODO_PERMISOS=data.MODO_PERMISOS||'ROL';data.PERMISOS_PERSONALIZADOS=JSON.stringify(normalizeLocalPermissions(data.PERMISOS_PERSONALIZADOS));data.VERSION_PERMISOS=1;
    }
    if (key === 'vehicles') {
      data.PATENTE=String(data.PATENTE || '').toUpperCase(); data.ESTADO=data.ESTADO || 'Disponible';
      data.QR_CODIGO=data.QR_CODIGO || ('VEH-'+data.PATENTE.replace(/[^A-Z0-9]/g,''));
    }
    if (key === 'drivers') data.ESTADO=data.ESTADO || 'Disponible';
    if (key === 'documents') data.ESTADO=data.ESTADO || 'Vigente';
    const row={ ID:data.ID || id(prefixes[key] || 'ID'), ...data, CREADO_EN:now, ACTUALIZADO_EN:now, ELIMINADO:'NO' };
    localDb[key].push(row); audit(user,'CREAR',key.toUpperCase(),'Registro creado',row.ID); saveLocal(); return { row:cleanRow(row) };
  }
  async function localUpdate(payload) {
    const user=requireLocalUser(), key=resourceMap[payload.resource]; const row=find(key,payload.id); if(!row) throw new Error('REGISTRO_NO_ENCONTRADO');
    requireLocalPermission(user,moduleByResource[key],'ACTUALIZAR');if(!localFilterRows(key,[row],user).length)throw new Error('PERMISO_DENEGADO');
    const data={...(payload.data||{})};
    if(key==='checkins')throw new Error('ACCION_ESPECIAL_REQUERIDA');
    if(user.ROL_ID==='ROL-CONDUCTOR'){if(key==='routes')return localUpdateRouteStatus({id:payload.id,ESTADO:data.ESTADO});if(key==='notifications'){if(data.LEIDA!=='SI')throw new Error('PERMISO_DENEGADO');return localReadNotification({id:payload.id});}if(key==='alerts'&&Object.keys(data).some(field=>field!=='LEIDA'))throw new Error('PERMISO_DENEGADO');if(['operations','connections'].includes(key))throw new Error('ACCION_ESPECIAL_REQUERIDA');}
    if(key==='users'){
      const newRole=Object.prototype.hasOwnProperty.call(data,'ROL_ID')?data.ROL_ID:row.ROL_ID,newState=Object.prototype.hasOwnProperty.call(data,'ESTADO')?data.ESTADO:row.ESTADO;
      if(row.ROL_ID==='ROL-ADMIN'&&row.ESTADO==='Activo'&&(newRole!=='ROL-ADMIN'||newState!=='Activo')){const other=activeRows(localDb.users).some(item=>item.ID!==row.ID&&item.ROL_ID==='ROL-ADMIN'&&item.ESTADO==='Activo');if(!other)throw new Error('ULTIMO_ADMINISTRADOR_PROTEGIDO');}
      if(data.CONTRASENA){const salt=id('SALT');row.SAL_CONTRASENA=salt;row.CONTRASENA_CIFRADA=await digest(data.CONTRASENA+':'+salt);delete data.CONTRASENA;}
    }
    Object.assign(row,data,{ACTUALIZADO_EN:iso()}); audit(user,'ACTUALIZAR',key.toUpperCase(),'Registro actualizado sin cerrar sesiones',row.ID);saveLocal();return{row:cleanRow(row)};
  }
  function localDelete(payload) {
    const user=requireLocalUser(), key=resourceMap[payload.resource], row=find(key,payload.id); if(!row) throw new Error('REGISTRO_NO_ENCONTRADO');
    requireLocalPermission(user,moduleByResource[key],'ELIMINAR');if(!localFilterRows(key,[row],user).length)throw new Error('PERMISO_DENEGADO');
    row.ELIMINADO='SI';row.ACTUALIZADO_EN=iso();audit(user,'ELIMINAR',key.toUpperCase(),'Registro eliminado',row.ID);saveLocal();return{id:row.ID};
  }
  function localSaveUserPermissions(payload){
    const actor=requireLocalUser();requireLocalPermission(actor,'USUARIOS','ACTUALIZAR');const data=payload.data||payload,row=find('users',data.USUARIO_ID||payload.id);if(!row)throw new Error('REGISTRO_NO_ENCONTRADO');
    if(row.ROL_ID==='ROL-ADMIN'){row.MODO_PERMISOS='ROL';row.PERMISOS_PERSONALIZADOS='[]';}
    else{row.MODO_PERMISOS=String(data.MODO_PERMISOS||'ROL').toUpperCase()==='PERSONALIZADO'?'PERSONALIZADO':'ROL';row.PERMISOS_PERSONALIZADOS=JSON.stringify(row.MODO_PERMISOS==='PERSONALIZADO'?normalizeLocalPermissions(data.PERMISOS||data.PERMISOS_PERSONALIZADOS):[]);}
    row.VERSION_PERMISOS=Number(row.VERSION_PERMISOS||0)+1;row.ACTUALIZADO_EN=iso();audit(actor,'ACTUALIZAR_PERMISOS','USUARIOS','Permisos actualizados sin cerrar sesiones',row.ID);saveLocal();return{row:publicUser(row),sessionPreserved:true};
  }
  function panelPrincipalLocal() {
    const user=requireLocalUser();requireLocalPermission(user,'PANEL_PRINCIPAL','LEER');const rows = key => hasLocalPermission(user,moduleByResource[key],'LEER')?localFilterRows(key,activeRows(localDb[key]),user):[];
    const onlineLimit=Date.now()-(config.ANTIGUEDAD_CONEXION_ACTIVA_MILISEGUNDOS||90000);
    const operations=rows('operations'),vehicles=rows('vehicles'),operationCounts={};
    operations.forEach(row=>{const date=new Date(row.FECHA_INICIO||row.CREADO_EN);if(!Number.isNaN(date.getTime())){const key=date.toISOString().slice(0,10);operationCounts[key]=(operationCounts[key]||0)+1;}});
    const operationsByDay=Array.from({length:7},(_,index)=>{const date=new Date();date.setDate(date.getDate()-(6-index));const key=date.toISOString().slice(0,10);return{FECHA:key,ETIQUETA:new Intl.DateTimeFormat('es-CL',{weekday:'short'}).format(date).replace('.',''),TOTAL:operationCounts[key]||0};});
    const countStates=list=>Object.entries(list.reduce((acc,row)=>{const state=row.ESTADO||'Sin estado';acc[state]=(acc[state]||0)+1;return acc;},{})).map(([ESTADO,TOTAL])=>({ESTADO,TOTAL})).sort((a,b)=>b.TOTAL-a.TOTAL);
    return { metrics:{ vehicles:rows('vehicles').length,availableVehicles:rows('vehicles').filter(x=>x.ESTADO==='Disponible').length,drivers:rows('drivers').length,
      availableDrivers:rows('drivers').filter(x=>x.ESTADO==='Disponible').length,activeOperations:rows('operations').filter(x=>x.ESTADO==='Activa').length,
      openMaintenance:rows('maintenance').filter(x=>['Programada','En proceso','Atrasada'].includes(x.ESTADO)).length,
      expiredDocuments:rows('documents').filter(x=>x.ESTADO==='Vencido').length,unreadAlerts:rows('alerts').filter(x=>x.LEIDA!=='SI').length,
      assignedRoutes:rows('routes').filter(x=>['Asignada','En curso'].includes(x.ESTADO)).length,
      unreadNotifications:rows('notifications').filter(x=>x.LEIDA!=='SI').length,
      onlineDevices:rows('connections').filter(x=>x.ESTADO!=='Desconectado'&&new Date(x.ULTIMA_CONEXION).getTime()>=onlineLimit).length,
      pendingCheckins:rows('checkins').filter(x=>x.ESTADO_REVISION==='Pendiente'&&x.UTILIZADO!=='SI').length,
      blockedCheckins:rows('checkins').filter(x=>x.ESTADO_REVISION==='Bloqueado'&&x.UTILIZADO!=='SI').length,
      approvedCheckins:rows('checkins').filter(x=>x.ESTADO_REVISION==='Aprobado'&&x.UTILIZADO!=='SI'&&new Date(x.VIGENTE_HASTA||0).getTime()>Date.now()).length },
      recentOperations:rows('operations').slice(-10).reverse(), alerts:rows('alerts').filter(x=>x.LEIDA!=='SI').slice(-10).reverse(),
      notifications:rows('notifications').filter(x=>x.LEIDA!=='SI').slice(-10).reverse(),routes:rows('routes').slice(-10).reverse(),
      charts:{operationsByDay,vehicleStates:countStates(vehicles),routeStates:countStates(rows('routes'))} };
  }
  function localCheckinCatalog() {
    return [
      {id:'documentacion',categoria:'Documentación',item:'Documentos obligatorios vigentes y disponibles',critico:true},
      {id:'luces',categoria:'Exterior',item:'Luces, intermitentes y señalización',critico:true},
      {id:'frenos',categoria:'Seguridad',item:'Frenos de servicio y estacionamiento',critico:true},
      {id:'direccion',categoria:'Seguridad',item:'Dirección sin juego, trabas ni ruidos anormales',critico:true},
      {id:'neumaticos',categoria:'Exterior',item:'Neumáticos, presión, desgaste y rueda de repuesto',critico:true},
      {id:'espejos_vidrios',categoria:'Exterior',item:'Espejos, parabrisas y vidrios con visibilidad segura',critico:true},
      {id:'cinturones',categoria:'Cabina',item:'Cinturones de seguridad y asientos',critico:true},
      {id:'bocina',categoria:'Cabina',item:'Bocina operativa',critico:false},
      {id:'limpiaparabrisas',categoria:'Cabina',item:'Limpiaparabrisas y líquido lavador',critico:false},
      {id:'aceite',categoria:'Motor y fluidos',item:'Nivel de aceite de motor',critico:true},
      {id:'refrigerante',categoria:'Motor y fluidos',item:'Nivel de refrigerante y temperatura normal',critico:true},
      {id:'fugas',categoria:'Motor y fluidos',item:'Ausencia de fugas de combustible, aceite o refrigerante',critico:true},
      {id:'extintor',categoria:'Emergencia',item:'Extintor vigente y accesible',critico:true},
      {id:'botiquin',categoria:'Emergencia',item:'Botiquín disponible',critico:false},
      {id:'herramientas',categoria:'Emergencia',item:'Gata, triángulos y herramientas básicas',critico:false},
      {id:'combustible',categoria:'Operación',item:'Combustible o carga suficiente para la ruta',critico:false},
    ];
  }
  function localNormalizeCheckinList(value){
    let received=value;
    if(typeof received==='string'){try{received=JSON.parse(received);}catch(_){throw new Error('CHECKIN_LISTA_INVALIDA');}}
    if(!Array.isArray(received))throw new Error('CHECKIN_LISTA_INVALIDA');
    const byId=Object.fromEntries(received.filter(Boolean).map(item=>[String(item.id||''),item]));
    return localCheckinCatalog().map(def=>{
      const input=byId[def.id]||{},answer=String(input.respuesta||'').toUpperCase();
      if(!['OK','FALLA','NA'].includes(answer))throw new Error(`CHECKIN_ITEM_INCOMPLETO_${def.id.toUpperCase()}`);
      return {...def,respuesta:def.critico&&answer==='NA'?'FALLA':answer,observacion:String(input.observacion||'').slice(0,500)};
    });
  }
  function localCreateVehicleCheckin(payload){
    const user=requireLocalUser(),data={...(payload.data||payload)};requireLocalPermission(user,'CHECKIN','CREAR');
    if(user.ROL_ID==='ROL-CONDUCTOR'){const own=localDriver(user);if(!own)throw new Error('CONDUCTOR_NO_ASOCIADO');data.CONDUCTOR_ID=own.ID;}
    if(!data.VEHICULO_ID||!data.CONDUCTOR_ID||data.KILOMETRAJE===''||!data.LISTA_CODIFICADA)throw new Error('CHECKIN_DATOS_REQUERIDOS');
    if(String(data.CONFIRMACION_CONDUCTOR||'')!=='SI')throw new Error('CHECKIN_CONFIRMACION_REQUERIDA');
    const vehicle=find('vehicles',data.VEHICULO_ID),driver=find('drivers',data.CONDUCTOR_ID);
    if(!vehicle)throw new Error('VEHICULO_NO_ENCONTRADO');if(!driver)throw new Error('CONDUCTOR_NO_ENCONTRADO');
    if(vehicle.ESTADO!=='Disponible')throw new Error('VEHICULO_NO_DISPONIBLE');if(driver.ESTADO!=='Disponible')throw new Error('CONDUCTOR_NO_DISPONIBLE');
    const list=localNormalizeCheckinList(data.LISTA_CODIFICADA),critical=list.filter(i=>i.respuesta==='FALLA'&&i.critico).length,minor=list.filter(i=>i.respuesta==='FALLA'&&!i.critico).length,now=iso();
    const state=critical?'Bloqueado':minor?'Pendiente':'Aprobado',result=critical?'Falla crítica':minor?'Con observaciones':'Conforme';
    const requestId=String(data.SOLICITUD_CLIENTE_ID||'').slice(0,120);const duplicate=requestId&&activeRows(localDb.checkins).find(item=>item.SOLICITUD_CLIENTE_ID===requestId&&item.CREADO_POR===user.ID);if(duplicate)return{row:cleanRow(duplicate),persistenciaConfirmada:true,persistencia:'LOCAL',duplicadoEvitado:true,advertencias:[]};
    const row={ID:id('CHK'),VEHICULO_ID:vehicle.ID,CONDUCTOR_ID:driver.ID,OPERACION_ID:'',FECHA_HORA:now,KILOMETRAJE:Number(data.KILOMETRAJE||vehicle.KILOMETRAJE||0),NIVEL_COMBUSTIBLE:data.NIVEL_COMBUSTIBLE||'No informado',LISTA_CODIFICADA:JSON.stringify(list),TOTAL_ITEMS:list.length,ITEMS_OK:list.filter(i=>i.respuesta==='OK').length,FALLAS_LEVES:minor,FALLAS_CRITICAS:critical,RESULTADO:result,ESTADO_REVISION:state,OBSERVACIONES:String(data.OBSERVACIONES||'').slice(0,1500),FIRMA_CONDUCTOR:String(data.FIRMA_CONDUCTOR||user.NOMBRE||driver.NOMBRE).slice(0,180),REVISADO_POR:state==='Aprobado'?user.ID:'',FECHA_REVISION:state==='Aprobado'?now:'',COMENTARIO_REVISION:state==='Aprobado'?'Aprobación automática sin fallas detectadas.':'',VIGENTE_HASTA:new Date(Date.now()+12*3600000).toISOString(),UTILIZADO:'NO',CREADO_POR:user.ID,CREADO_EN:now,ACTUALIZADO_EN:now,ELIMINADO:'NO',SOLICITUD_CLIENTE_ID:requestId};
    localDb.checkins.push(row);
    if(critical||minor)localDb.alerts.push({ID:id('ALT'),TIPO:'Check-in vehicular',NIVEL:critical?'Crítica':'Advertencia',TITULO:critical?'Vehículo bloqueado por inspección':'Check-in pendiente de revisión',MENSAJE:`${vehicle.PATENTE}: ${critical} falla(s) crítica(s) y ${minor} observación(es) leve(s).`,MODULO:'CHECKIN',REGISTRO_ID:row.ID,LEIDA:'NO',USUARIO_ID:'',FECHA_HORA:now,CREADO_EN:now,ACTUALIZADO_EN:now,ELIMINADO:'NO'});
    audit(user,'CREAR','CHECKIN',`${vehicle.PATENTE} · ${result}`,row.ID);saveLocal();return{row:cleanRow(row),catalogo:localCheckinCatalog()};
  }
  function localReviewVehicleCheckin(payload){
    const user=requireLocalUser(),data=payload.data||payload,idValue=payload.id||data.CHECKIN_ID,row=find('checkins',idValue);requireLocalPermission(user,'CHECKIN_APROBACIONES','ACTUALIZAR');
    if(!row)throw new Error('CHECKIN_NO_ENCONTRADO');if(row.UTILIZADO==='SI')throw new Error('CHECKIN_YA_UTILIZADO');
    const decision=String(data.DECISION||'').toUpperCase();if(!['APROBAR','RECHAZAR'].includes(decision))throw new Error('CHECKIN_DECISION_INVALIDA');
    if(decision==='APROBAR'&&Number(row.FALLAS_CRITICAS||0)>0)throw new Error('CHECKIN_CRITICO_NO_APROBABLE');
    const state=decision==='APROBAR'?'Aprobado':'Rechazado',now=iso();Object.assign(row,{ESTADO_REVISION:state,REVISADO_POR:user.ID,FECHA_REVISION:now,COMENTARIO_REVISION:String(data.COMENTARIO_REVISION||'').slice(0,1000),ACTUALIZADO_EN:now});
    if(decision==='APROBAR')row.VIGENTE_HASTA=new Date(Date.now()+12*3600000).toISOString();
    const driver=find('drivers',row.CONDUCTOR_ID);if(driver?.USUARIO_ID)localCreateNotification({DESTINATARIO_USUARIO_ID:driver.USUARIO_ID,DESTINATARIO_CONDUCTOR_ID:driver.ID,TITULO:`Check-in ${state.toLowerCase()}`,MENSAJE:`La inspección ${row.ID} fue ${state.toLowerCase()}. ${data.COMENTARIO_REVISION||''}`,TIPO:'Seguridad',PRIORIDAD:decision==='APROBAR'?'Normal':'Alta',CREADO_POR:user.ID});
    audit(user,decision,'CHECKIN_APROBACIONES',data.COMENTARIO_REVISION||state,row.ID);saveLocal();return{row:cleanRow(row)};
  }
  function localAvailableCheckins(payload){
    const user=requireLocalUser(),data=payload.data||payload;requireLocalPermission(user,'OPERACIONES','CREAR');let driverId=String(data.CONDUCTOR_ID||'');
    if(user.ROL_ID==='ROL-CONDUCTOR'){const own=localDriver(user);if(!own)throw new Error('CONDUCTOR_NO_ASOCIADO');driverId=own.ID;}
    const vehicleId=String(data.VEHICULO_ID||''),now=Date.now();let rows=activeRows(localDb.checkins).filter(row=>row.ESTADO_REVISION==='Aprobado'&&row.UTILIZADO!=='SI'&&new Date(row.VIGENTE_HASTA||0).getTime()>now&&(!vehicleId||row.VEHICULO_ID===vehicleId)&&(!driverId||row.CONDUCTOR_ID===driverId));
    rows=localFilterRows('checkins',rows,user).sort((a,b)=>new Date(b.FECHA_HORA)-new Date(a.FECHA_HORA));return{rows:rows.slice(0,50).map(cleanRow),total:rows.length};
  }
  function localValidateCheckinForOperation(checkinId,vehicleId,driverId){
    if(!checkinId)throw new Error('CHECKIN_REQUERIDO');const row=find('checkins',checkinId);if(!row)throw new Error('CHECKIN_NO_ENCONTRADO');
    if(row.VEHICULO_ID!==vehicleId||row.CONDUCTOR_ID!==driverId)throw new Error('CHECKIN_NO_COINCIDE');if(row.ESTADO_REVISION!=='Aprobado')throw new Error('CHECKIN_NO_APROBADO');if(row.UTILIZADO==='SI')throw new Error('CHECKIN_YA_UTILIZADO');if(new Date(row.VIGENTE_HASTA||0).getTime()<=Date.now())throw new Error('CHECKIN_EXPIRADO');return row;
  }
  function localPrimaryCompany(){
    return activeRows(localDb.companies).slice().sort((a,b)=>{
      const activeA=String(a.ESTADO||'Activo')==='Activo'?1:0,activeB=String(b.ESTADO||'Activo')==='Activo'?1:0;
      if(activeA!==activeB)return activeB-activeA;
      return new Date(b.ACTUALIZADO_EN||b.CREADO_EN||0)-new Date(a.ACTUALIZADO_EN||a.CREADO_EN||0);
    })[0]||null;
  }
  function localOperationalBase(){
    const company=localPrimaryCompany()||{};
    if(String(company.VALIDAR_UBICACION_OPERACION||'SI')==='NO')throw new Error('VALIDACION_UBICACION_DESACTIVADA');
    const latitudeText=String(company.PUNTO_OPERACION_LATITUD??'').trim(),longitudeText=String(company.PUNTO_OPERACION_LONGITUD??'').trim(),latitude=Number(latitudeText),longitude=Number(longitudeText);
    if(!latitudeText||!longitudeText||!Number.isFinite(latitude)||!Number.isFinite(longitude))throw new Error('PUNTO_OPERACION_NO_CONFIGURADO');
    return{NOMBRE:company.PUNTO_OPERACION_NOMBRE||'Base operacional',DIRECCION:company.PUNTO_OPERACION_DIRECCION||company.DIRECCION||'Base operacional',LATITUD:latitude,LONGITUD:longitude,RADIO_INICIO_METROS:Math.max(10,Number(company.RADIO_INICIO_METROS||150)),RADIO_FIN_METROS:Math.max(10,Number(company.RADIO_FIN_METROS||150)),PRECISION_GPS_MAXIMA_METROS:Math.max(10,Number(company.PRECISION_GPS_MAXIMA_METROS||120))};
  }
  function localDistanceMeters(lat1,lng1,lat2,lng2){const r=6371000,toRad=value=>Number(value)*Math.PI/180,dLat=toRad(lat2-lat1),dLng=toRad(lng2-lng1),a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;return 2*r*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
  function localEvaluateOperationLocation(data,base,phase){const prefix=phase==='FIN'?'FIN_':'INICIO_',lat=Number(data[prefix+'LATITUD']??data.LATITUD),lng=Number(data[prefix+'LONGITUD']??data.LONGITUD),accuracy=Number(data[prefix+'PRECISION']??data.PRECISION);if(!Number.isFinite(lat)||!Number.isFinite(lng))throw new Error('UBICACION_OPERACION_REQUERIDA');if(!Number.isFinite(accuracy)||accuracy<=0)throw new Error('PRECISION_GPS_REQUERIDA');const precisionValid=accuracy<=base.PRECISION_GPS_MAXIMA_METROS;if(phase!=='FIN'&&!precisionValid)throw new Error('UBICACION_GPS_IMPRECISA');const distance=localDistanceMeters(lat,lng,base.LATITUD,base.LONGITUD),radius=phase==='FIN'?base.RADIO_FIN_METROS:base.RADIO_INICIO_METROS,tolerance=phase==='FIN'&&!precisionValid?Math.min(accuracy,Number(config.TOLERANCIA_GPS_IMPRECISA_FIN_METROS||500)):0,inside=distance<=radius+tolerance;return{LATITUD:lat,LONGITUD:lng,PRECISION:Math.round(accuracy*10)/10,PRECISION_VALIDA:precisionValid,PRECISION_BAJA:inside&&!precisionValid,TOLERANCIA_PRECISION_METROS:Math.round(tolerance*10)/10,DISTANCIA_METROS:Math.round(distance*10)/10,RADIO_PERMITIDO:radius,DENTRO_PERIMETRO:inside,ESTADO:inside?(precisionValid?'VALIDADA':'VALIDADA_PRECISION_BAJA'):'FUERA_PERIMETRO'};}
  function localValidateOperationLocation(data,base,phase){const result=localEvaluateOperationLocation(data,base,phase);if(!result.DENTRO_PERIMETRO)throw new Error(phase==='FIN'?'FUERA_DEL_PUNTO_DE_FINALIZACION':'FUERA_DEL_PUNTO_DE_INICIO');return result;}
  function localRouteForOperation(data,vehicle,driver,user){if(!data.RUTA_ID)return null;const route=find('routes',data.RUTA_ID);if(!route)throw new Error('RUTA_NO_ENCONTRADA');if(!localFilterRows('routes',[route],user).length)throw new Error('PERMISO_DENEGADO');if(!['Asignada','En curso'].includes(route.ESTADO))throw new Error('RUTA_NO_DISPONIBLE');if(route.CONDUCTOR_ID!==driver.ID)throw new Error('RUTA_NO_COINCIDE_CONDUCTOR');if(route.VEHICULO_ID&&route.VEHICULO_ID!==vehicle.ID)throw new Error('RUTA_NO_COINCIDE_VEHICULO');if(route.OPERACION_ID){const linked=find('operations',route.OPERACION_ID);if(linked?.ESTADO==='Activa')throw new Error('RUTA_YA_VINCULADA');}return route;}
  function localOptionalKm(value){const text=String(value??'').trim().replace(',','.');if(!text)return'';const number=Number(text);return Number.isFinite(number)&&number>=0?Math.round(number*10)/10:'';}
  function localOperationSnapshot(row){return Object.fromEntries(['ID','VEHICULO_ID','CONDUCTOR_ID','RUTA_ID','ORIGEN','DESTINO','FECHA_INICIO','FECHA_FIN','ESTADO','KM_INICIO','KM_FIN','DISTANCIA_KM','OBSERVACIONES'].map(field=>[field,row?.[field]??'']));}
  function localRequireOperationAdmin(user){if(user?.ROL_ID!=='ROL-ADMIN')throw new Error('SOLO_ADMINISTRADOR');}

  function localStartOperation(payload) {
    const user=requireLocalUser(), data={...(payload.data||payload)};requireLocalPermission(user,'OPERACIONES','CREAR');
    if(user.ROL_ID==='ROL-CONDUCTOR'){const own=localDriver(user);if(!own)throw new Error('CONDUCTOR_NO_ASOCIADO');data.CONDUCTOR_ID=own.ID;const authorization=qrAuthorizations.get(data.AUTORIZACION_QR);if(!authorization||authorization.USUARIO_ID!==user.ID||authorization.VEHICULO_ID!==data.VEHICULO_ID||authorization.EXPIRA<Date.now())throw new Error('AUTORIZACION_QR_INVALIDA');qrAuthorizations.delete(data.AUTORIZACION_QR);}
    const vehicle=find('vehicles',data.VEHICULO_ID), driver=find('drivers',data.CONDUCTOR_ID);
    if(!vehicle||vehicle.ESTADO!=='Disponible')throw new Error('VEHICULO_NO_DISPONIBLE');if(!driver||driver.ESTADO!=='Disponible')throw new Error('CONDUCTOR_NO_DISPONIBLE');
    const checkin=localValidateCheckinForOperation(data.CHECKIN_ID,vehicle.ID,driver.ID),base=localOperationalBase(),start=localValidateOperationLocation(data,base,'INICIO'),route=localRouteForOperation(data,vehicle,driver,user),now=iso();
    const row={ID:id('OPE'),VEHICULO_ID:vehicle.ID,CONDUCTOR_ID:driver.ID,ORIGEN:base.DIRECCION,DESTINO:route?.DESTINO||base.DIRECCION,FECHA_INICIO:now,FECHA_FIN:'',ESTADO:'Activa',KM_INICIO:localOptionalKm(data.KM_INICIO)===''?localOptionalKm(vehicle.KILOMETRAJE):localOptionalKm(data.KM_INICIO),KM_FIN:'',DISTANCIA_KM:0,OBSERVACIONES:data.OBSERVACIONES||'',CREADO_POR:user.ID,CHECKIN_ID:checkin.ID,RUTA_ID:route?.ID||'',TIPO_OPERACION:route?'Ruta asignada con retorno a base':'Salida y regreso a base',PUNTO_RETORNO:base.DIRECCION,BASE_NOMBRE:base.NOMBRE,BASE_DIRECCION:base.DIRECCION,BASE_LATITUD:base.LATITUD,BASE_LONGITUD:base.LONGITUD,RADIO_INICIO_METROS:base.RADIO_INICIO_METROS,RADIO_FIN_METROS:base.RADIO_FIN_METROS,PRECISION_GPS_MAXIMA_METROS:base.PRECISION_GPS_MAXIMA_METROS,INICIO_LATITUD:start.LATITUD,INICIO_LONGITUD:start.LONGITUD,INICIO_PRECISION:start.PRECISION,DISTANCIA_INICIO_BASE_METROS:start.DISTANCIA_METROS,VALIDACION_INICIO:'VALIDADA',CREADO_EN:now,ACTUALIZADO_EN:now,ELIMINADO:'NO'};
    localDb.operations.push(row);checkin.OPERACION_ID=row.ID;checkin.UTILIZADO='SI';checkin.ACTUALIZADO_EN=now;vehicle.ESTADO='En ruta';driver.ESTADO='En viaje';if(route)Object.assign(route,{OPERACION_ID:row.ID,VEHICULO_ID:vehicle.ID,ORIGEN:base.DIRECCION,ORIGEN_LATITUD:base.LATITUD,ORIGEN_LONGITUD:base.LONGITUD,ESTADO:'En curso',FECHA_INICIO:route.FECHA_INICIO||now,ACTUALIZADO_EN:now});localDb.history.push({ID:id('HIS'),OPERACION_ID:row.ID,EVENTO:'INICIO',DETALLE:`Operación iniciada en punto autorizado a ${start.DISTANCIA_METROS} m de la base`,FECHA_HORA:now,USUARIO_ID:user.ID,CREADO_EN:now,ELIMINADO:'NO'});audit(user,'INICIAR','OPERACIONES','Operación iniciada con ubicación validada',row.ID);saveLocal();return{row,locationValidation:start,base};
  }
  function localFinishOperation(payload) {
    const user=requireLocalUser(),data=payload.data||payload,row=find('operations',payload.id||payload.OPERACION_ID||data.OPERACION_ID);
    if(!row||row.ESTADO!=='Activa')throw new Error('OPERACION_NO_ACTIVA');if(!localFilterRows('operations',[row],user).length)throw new Error('PERMISO_DENEGADO');
    if(!['ROL-ADMIN','ROL-SUPERVISOR','ROL-CONDUCTOR'].includes(user.ROL_ID))throw new Error('PERMISO_DENEGADO');
    if(user.ROL_ID==='ROL-CONDUCTOR'&&localDriver(user)?.ID!==row.CONDUCTOR_ID)throw new Error('PERMISO_DENEGADO');
    const currentBase=localOperationalBase(),hasSnapshot=String(row.BASE_LATITUD??'').trim()&&String(row.BASE_LONGITUD??'').trim(),base=hasSnapshot?{...currentBase,NOMBRE:row.BASE_NOMBRE||currentBase.NOMBRE,DIRECCION:row.BASE_DIRECCION||row.PUNTO_RETORNO||row.ORIGEN||currentBase.DIRECCION,LATITUD:Number(row.BASE_LATITUD),LONGITUD:Number(row.BASE_LONGITUD),RADIO_FIN_METROS:Number(row.RADIO_FIN_METROS||currentBase.RADIO_FIN_METROS),PRECISION_GPS_MAXIMA_METROS:Number(row.PRECISION_GPS_MAXIMA_METROS||currentBase.PRECISION_GPS_MAXIMA_METROS)}:currentBase;
    let finish,exceptional=false;const reason=String(data.CIERRE_MOTIVO||data.MOTIVO_CIERRE_EXCEPCIONAL||'').trim();
    try{finish=localValidateOperationLocation(data,base,'FIN');}
    catch(error){if(String(error.message)!=='FUERA_DEL_PUNTO_DE_FINALIZACION')throw error;if(user.ROL_ID==='ROL-CONDUCTOR')throw error;if(!['ROL-ADMIN','ROL-SUPERVISOR'].includes(user.ROL_ID))throw new Error('CIERRE_EXCEPCIONAL_NO_AUTORIZADO');if(data.CIERRE_EXCEPCIONAL!=='SI')throw new Error('CIERRE_EXCEPCIONAL_CONFIRMACION_REQUERIDA');if(reason.length<10)throw new Error('CIERRE_EXCEPCIONAL_MOTIVO_REQUERIDO');finish=localEvaluateOperationLocation(data,base,'FIN');exceptional=true;}
    const kmEnd=localOptionalKm(data.KM_FIN),kmStart=localOptionalKm(row.KM_INICIO),kmConsistente=kmStart!==''&&kmEnd!==''&&kmEnd>=kmStart,kilometrajeAdvertencia=kmEnd===''?'Kilometraje final no informado.':(kmStart!==''&&kmEnd<kmStart?'Kilometraje final menor que el inicial; cierre permitido y dato marcado para revisión.':'');const now=iso(),ip=String(data.IP_PUBLICA||find('sessions',auth.sessionId)?.IP_PUBLICA||'');
    Object.assign(row,{FECHA_FIN:now,ESTADO:'Finalizada',KM_FIN:kmEnd,DISTANCIA_KM:kmConsistente?Math.round((kmEnd-kmStart)*10)/10:'',FIN_LATITUD:finish.LATITUD,FIN_LONGITUD:finish.LONGITUD,FIN_PRECISION:finish.PRECISION,DISTANCIA_FIN_BASE_METROS:finish.DISTANCIA_METROS,VALIDACION_FIN:exceptional?'EXCEPCIONAL_AUTORIZADA':(finish.PRECISION_BAJA?'VALIDADA_PRECISION_BAJA':'VALIDADA'),OBSERVACIONES:data.OBSERVACIONES||row.OBSERVACIONES||'',CIERRE_TIPO:exceptional?'Excepcional fuera de base':(finish.PRECISION_BAJA?'Normal en base con GPS impreciso':'Normal en base'),CIERRE_FUERA_BASE:exceptional?'SI':'NO',CIERRE_MOTIVO:exceptional?reason:'',CIERRE_AUTORIZADO_POR:user.ID,CIERRE_AUTORIZADO_ROL:user.ROL_ID,CIERRE_IP_PUBLICA:ip,CIERRE_FECHA_AUTORIZACION:now,ACTUALIZADO_EN:now});
    const vehicle=find('vehicles',row.VEHICULO_ID),driver=find('drivers',row.CONDUCTOR_ID);if(vehicle){vehicle.ESTADO='Disponible';if(kmEnd!==''&&(localOptionalKm(vehicle.KILOMETRAJE)===''||kmEnd>=Number(vehicle.KILOMETRAJE||0)))vehicle.KILOMETRAJE=kmEnd;}if(driver)driver.ESTADO='Disponible';if(row.RUTA_ID){const route=find('routes',row.RUTA_ID);if(route&&['Asignada','En curso'].includes(route.ESTADO))Object.assign(route,{ESTADO:'Completada',FECHA_FIN:now,OPERACION_ID:row.ID,ACTUALIZADO_EN:now});}
    const detail=exceptional?`Cierre excepcional autorizado fuera de base a ${finish.DISTANCIA_METROS} m. Motivo: ${reason}`:(finish.PRECISION_BAJA?`Operación finalizada en base con señal GPS imprecisa. Distancia ${finish.DISTANCIA_METROS} m · precisión ±${finish.PRECISION} m · tolerancia ${finish.TOLERANCIA_PRECISION_METROS} m.`:`Operación finalizada en punto autorizado a ${finish.DISTANCIA_METROS} m de la base`)+(kilometrajeAdvertencia?` ${kilometrajeAdvertencia}`:'');
    localDb.history.push({ID:id('HIS'),OPERACION_ID:row.ID,EVENTO:exceptional?'FIN_EXCEPCIONAL':(finish.PRECISION_BAJA?'FIN_GPS_IMPRECISO':'FIN'),DETALLE:detail,FECHA_HORA:now,USUARIO_ID:user.ID,CREADO_EN:now,ELIMINADO:'NO'});if(exceptional)localDb.alerts.push({ID:id('ALT'),TIPO:'Cierre excepcional',NIVEL:'Advertencia',TITULO:'Operación finalizada fuera de la base',MENSAJE:`${row.ID} fue cerrada por ${user.NOMBRE} a ${finish.DISTANCIA_METROS} m de la base. Motivo: ${reason}`,MODULO:'OPERACIONES',REGISTRO_ID:row.ID,LEIDA:'NO',USUARIO_ID:'',FECHA_HORA:now,CREADO_EN:now,ACTUALIZADO_EN:now,ELIMINADO:'NO'});else if(finish.PRECISION_BAJA)localDb.alerts.push({ID:id('ALT'),TIPO:'GPS impreciso',NIVEL:'Advertencia',TITULO:'Cierre aceptado con baja precisión GPS',MENSAJE:`${row.ID} finalizó con precisión ±${finish.PRECISION} m y distancia calculada ${finish.DISTANCIA_METROS} m.`,MODULO:'OPERACIONES',REGISTRO_ID:row.ID,LEIDA:'NO',USUARIO_ID:'',FECHA_HORA:now,CREADO_EN:now,ACTUALIZADO_EN:now,ELIMINADO:'NO'});audit(user,exceptional?'FINALIZAR_EXCEPCIONAL':(finish.PRECISION_BAJA?'FINALIZAR_GPS_IMPRECISO':'FINALIZAR'),'OPERACIONES',detail,row.ID);saveLocal();return{row,locationValidation:finish,base,cierreExcepcional:exceptional,autorizadoPor:{ID:user.ID,NOMBRE:user.NOMBRE,ROL_ID:user.ROL_ID}};
  }
  function localEditOperationAdmin(payload){
    const user=requireLocalUser();localRequireOperationAdmin(user);const data=payload.data||payload,row=find('operations',payload.id||payload.OPERACION_ID||data.OPERACION_ID);if(!row)throw new Error('REGISTRO_NO_ENCONTRADO');const reason=String(data.MOTIVO_EDICION||'').trim();if(reason.length<5)throw new Error('MOTIVO_EDICION_REQUERIDO');
    const before=localOperationSnapshot(row),vehicleId=String(data.VEHICULO_ID||row.VEHICULO_ID||''),driverId=String(data.CONDUCTOR_ID||row.CONDUCTOR_ID||''),routeId=String(data.RUTA_ID??row.RUTA_ID??''),vehicle=find('vehicles',vehicleId),driver=find('drivers',driverId),active=row.ESTADO==='Activa';if(!vehicle)throw new Error('VEHICULO_NO_ENCONTRADO');if(!driver)throw new Error('CONDUCTOR_NO_ENCONTRADO');
    if(active&&vehicleId!==row.VEHICULO_ID&&vehicle.ESTADO!=='Disponible')throw new Error('VEHICULO_NO_DISPONIBLE');if(active&&driverId!==row.CONDUCTOR_ID&&driver.ESTADO!=='Disponible')throw new Error('CONDUCTOR_NO_DISPONIBLE');let route=null;if(routeId){route=find('routes',routeId);if(!route)throw new Error('RUTA_NO_ENCONTRADA');if(route.OPERACION_ID&&route.OPERACION_ID!==row.ID&&find('operations',route.OPERACION_ID)?.ESTADO==='Activa')throw new Error('RUTA_YA_VINCULADA');if(route.VEHICULO_ID&&route.VEHICULO_ID!==vehicleId)throw new Error('RUTA_NO_COINCIDE_VEHICULO');if(route.CONDUCTOR_ID&&route.CONDUCTOR_ID!==driverId)throw new Error('RUTA_NO_COINCIDE_CONDUCTOR');}
    if(active&&vehicleId!==row.VEHICULO_ID){const old=find('vehicles',row.VEHICULO_ID);if(old)old.ESTADO='Disponible';vehicle.ESTADO='En ruta';}if(active&&driverId!==row.CONDUCTOR_ID){const old=find('drivers',row.CONDUCTOR_ID);if(old)old.ESTADO='Disponible';driver.ESTADO='En viaje';}
    if(routeId!==String(row.RUTA_ID||'')&&row.RUTA_ID){const old=find('routes',row.RUTA_ID);if(old&&old.OPERACION_ID===row.ID)Object.assign(old,active?{OPERACION_ID:'',ESTADO:'Asignada',FECHA_INICIO:'',ACTUALIZADO_EN:iso()}:{OPERACION_ID:'',ACTUALIZADO_EN:iso()});}if(route)Object.assign(route,{OPERACION_ID:row.ID,VEHICULO_ID:vehicleId,CONDUCTOR_ID:driverId,ESTADO:active?'En curso':route.ESTADO,ACTUALIZADO_EN:iso()});
    const kmStart=localOptionalKm(data.KM_INICIO),kmEnd=localOptionalKm(data.KM_FIN);Object.assign(row,{VEHICULO_ID:vehicleId,CONDUCTOR_ID:driverId,RUTA_ID:routeId,ORIGEN:String(data.ORIGEN??row.ORIGEN??'').trim(),DESTINO:String(data.DESTINO??row.DESTINO??'').trim(),FECHA_INICIO:data.FECHA_INICIO?new Date(data.FECHA_INICIO).toISOString():row.FECHA_INICIO,FECHA_FIN:data.FECHA_FIN?new Date(data.FECHA_FIN).toISOString():row.FECHA_FIN,KM_INICIO:kmStart,KM_FIN:kmEnd,DISTANCIA_KM:kmStart!==''&&kmEnd!==''&&kmEnd>=kmStart?Math.round((kmEnd-kmStart)*10)/10:'',OBSERVACIONES:String(data.OBSERVACIONES??row.OBSERVACIONES??'').slice(0,3000),ACTUALIZADO_EN:iso()});
    const detail=`Edición administrativa. Motivo: ${reason}. Antes: ${JSON.stringify(before)}. Después: ${JSON.stringify(localOperationSnapshot(row))}`;localDb.history.push({ID:id('HIS'),OPERACION_ID:row.ID,EVENTO:'EDICION_ADMIN',DETALLE:detail,FECHA_HORA:iso(),USUARIO_ID:user.ID,CREADO_EN:iso(),ELIMINADO:'NO'});audit(user,'EDITAR_ADMIN','OPERACIONES',detail,row.ID);saveLocal();return{row:cleanRow(row),auditoriaRegistrada:true};
  }
  function localDeleteOperationAdmin(payload){
    const user=requireLocalUser();localRequireOperationAdmin(user);const data=payload.data||payload,row=find('operations',payload.id||payload.OPERACION_ID||data.OPERACION_ID);if(!row)throw new Error('REGISTRO_NO_ENCONTRADO');const reason=String(data.MOTIVO_ELIMINACION||'').trim()||'Eliminación administrativa solicitada por el Administrador.',snapshot=localOperationSnapshot(row),active=row.ESTADO==='Activa';if(active){const vehicle=find('vehicles',row.VEHICULO_ID),driver=find('drivers',row.CONDUCTOR_ID);if(vehicle)vehicle.ESTADO='Disponible';if(driver)driver.ESTADO='Disponible';}if(row.RUTA_ID){const route=find('routes',row.RUTA_ID);if(route&&route.OPERACION_ID===row.ID)Object.assign(route,active?{OPERACION_ID:'',ESTADO:'Asignada',FECHA_INICIO:'',ACTUALIZADO_EN:iso()}:{OPERACION_ID:'',ACTUALIZADO_EN:iso()});}const detail=`Operación eliminada lógicamente por Administrador. Motivo: ${reason}. Datos: ${JSON.stringify(snapshot)}`;localDb.history.push({ID:id('HIS'),OPERACION_ID:row.ID,EVENTO:'ELIMINACION_ADMIN',DETALLE:detail,FECHA_HORA:iso(),USUARIO_ID:user.ID,CREADO_EN:iso(),ELIMINADO:'NO'});row.ELIMINADO='SI';row.ACTUALIZADO_EN=iso();audit(user,'ELIMINAR_ADMIN','OPERACIONES',detail,row.ID);saveLocal();return{id:row.ID,eliminacionLogica:true,auditoriaRegistrada:true};
  }
  function localValidateVehicleQr(payload){
    const user=requireLocalUser();requireLocalPermission(user,'QR','LEER');const normalized=String(payload.codigo||payload.CODIGO||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
    const vehicle=activeRows(localDb.vehicles).find(row=>String(row.QR_CODIGO||'').toUpperCase().replace(/[^A-Z0-9]/g,'')===normalized||String(row.PATENTE||'').toUpperCase().replace(/[^A-Z0-9]/g,'')===normalized);
    if(!vehicle)throw new Error('QR_NO_RECONOCIDO');if(vehicle.ESTADO!=='Disponible')throw new Error('VEHICULO_NO_DISPONIBLE');const authorization=id('QR-AUT');qrAuthorizations.set(authorization,{USUARIO_ID:user.ID,VEHICULO_ID:vehicle.ID,EXPIRA:Date.now()+300000});audit(user,'VALIDAR','QR',`Vehículo validado: ${vehicle.PATENTE}`,vehicle.ID);saveLocal();return{row:cleanRow(vehicle),autorizacionQr:authorization,validaPorSegundos:300};
  }
  function localVehicleFilter(payload={},user=null){if(user&&!['ROL-ADMIN','ROL-SUPERVISOR'].includes(user.ROL_ID))return{activo:false,ids:new Set()};const raw=String(payload.vehiculos||payload.VEHICULOS||'').trim();if(!raw)return{activo:false,ids:new Set()};if(raw==='__NINGUNO__')return{activo:true,ids:new Set()};return{activo:true,ids:new Set(raw.split(',').map(value=>value.trim()).filter(Boolean))};}
  function localSaveLocation(payload) {
    const user=requireLocalUser(),data=payload.data||payload;requireLocalPermission(user,'GPS','CREAR');let driverId=data.CONDUCTOR_ID||'';if(user.ROL_ID==='ROL-CONDUCTOR')driverId=localDriver(user)?.ID||'';if(!driverId){const driver=activeRows(localDb.drivers).find(x=>x.USUARIO_ID===user.ID);if(driver)driverId=driver.ID;}
    let operationId=data.OPERACION_ID||'',vehicleId=data.VEHICULO_ID||'';const active=activeRows(localDb.operations).find(x=>x.CONDUCTOR_ID===driverId&&x.ESTADO==='Activa');if(active){operationId=operationId||active.ID;vehicleId=vehicleId||active.VEHICULO_ID;}
    const key=vehicleId||driverId||data.DISPOSITIVO_ID||id('GPS-KEY'),now=data.FECHA_HORA||iso();
    const values={OPERACION_ID:operationId,CONDUCTOR_ID:driverId,VEHICULO_ID:vehicleId,LATITUD:Number(data.LATITUD),LONGITUD:Number(data.LONGITUD),
      DIRECCION:data.DIRECCION||`${Number(data.LATITUD).toFixed(6)}, ${Number(data.LONGITUD).toFixed(6)}`,PRECISION_METROS:Number(data.PRECISION_METROS||0),
      VELOCIDAD_KMH:Number(data.VELOCIDAD_KMH||0),RUMBO:Number(data.RUMBO||0),BATERIA_PORCENTAJE:data.BATERIA_PORCENTAJE??'',DISPOSITIVO_ID:data.DISPOSITIVO_ID||'',
      FECHA_HORA:now,FUENTE:data.FUENTE||'GPS real',ACTUALIZADO_EN:iso(),ELIMINADO:'NO'};
    let current=activeRows(localDb.gpsCurrent||[]).find(row=>row.CLAVE_SEGUIMIENTO===key);
    if(current)Object.assign(current,values);else{current={ID:id('GPA'),CLAVE_SEGUIMIENTO:key,CREADO_EN:iso(),...values};localDb.gpsCurrent.push(current);}
    const previous=[...activeRows(localDb.gps)].reverse().find(row=>(row.VEHICULO_ID||row.CONDUCTOR_ID||row.DISPOSITIVO_ID)===key);
    if(!previous||new Date(now).getTime()-new Date(previous.FECHA_HORA).getTime()>=60000)localDb.gps.push({ID:id('GPS'),CREADO_EN:iso(),...values});
    if(localDb.gps.length>5000)localDb.gps=localDb.gps.slice(-5000);saveLocal();return{row:current};
  }
  function localLatestLocations(payload={}) {
    const user=requireLocalUser();requireLocalPermission(user,'GPS','LEER');let base=activeRows(localDb.gpsCurrent||[]);if(!base.length){const latest={};activeRows(localDb.gps).sort((a,b)=>new Date(b.FECHA_HORA)-new Date(a.FECHA_HORA)).forEach(row=>{const key=row.VEHICULO_ID||row.CONDUCTOR_ID||row.DISPOSITIVO_ID||row.ID;if(!latest[key])latest[key]=row;});base=Object.values(latest);}
    const filter=localVehicleFilter(payload,user);const enriched=localFilterRows('gps',base,user).map(row=>({...row,CONDUCTOR_NOMBRE:find('drivers',row.CONDUCTOR_ID)?.NOMBRE||'',VEHICULO_PATENTE:find('vehicles',row.VEHICULO_ID)?.PATENTE||''}));const latestByVehicle=new Map(enriched.filter(row=>row.VEHICULO_ID).map(row=>[row.VEHICULO_ID,row]));const rows=enriched.filter(row=>!filter.activo||filter.ids.has(row.VEHICULO_ID));
    const trackingVehicles=localFilterRows('vehicles',activeRows(localDb.vehicles),user).map(vehicle=>{const latest=latestByVehicle.get(vehicle.ID)||{};return{ID:vehicle.ID,PATENTE:vehicle.PATENTE||vehicle.ID,MARCA:vehicle.MARCA||'',MODELO:vehicle.MODELO||'',ESTADO:vehicle.ESTADO||'',CONDUCTOR_ID:latest.CONDUCTOR_ID||'',CONDUCTOR_NOMBRE:latest.CONDUCTOR_NOMBRE||'',ULTIMA_POSICION:latest.FECHA_HORA||''};});
    return{rows,total:rows.length,trackingVehicles};
  }
  function localAssignRoute(payload){
    const user=requireLocalUser(),data=payload.data||payload;requireLocalPermission(user,'RUTAS','CREAR');
    const driver=find('drivers',data.CONDUCTOR_ID),vehicle=data.VEHICULO_ID?find('vehicles',data.VEHICULO_ID):null,company=localPrimaryCompany()||{};
    if(!driver)throw new Error('CONDUCTOR_NO_ENCONTRADO');if(data.VEHICULO_ID&&!vehicle)throw new Error('VEHICULO_NO_ENCONTRADO');if(!data.ORIGEN)throw new Error('CAMPO_REQUERIDO_ORIGEN');if(!data.DESTINO)throw new Error('CAMPO_REQUERIDO_DESTINO');
    const baseLatText=String(company.PUNTO_OPERACION_LATITUD??'').trim(),baseLngText=String(company.PUNTO_OPERACION_LONGITUD??'').trim(),baseLat=Number(baseLatText),baseLng=Number(baseLngText),hasBase=Boolean(baseLatText&&baseLngText)&&Number.isFinite(baseLat)&&Number.isFinite(baseLng)&&baseLat>=-90&&baseLat<=90&&baseLng>=-180&&baseLng<=180,now=iso(),route={ID:id('RUT'),NOMBRE:data.NOMBRE||`Ruta a ${data.DESTINO}`,CONDUCTOR_ID:driver.ID,VEHICULO_ID:vehicle?.ID||'',OPERACION_ID:data.OPERACION_ID||'',
      ORIGEN:String(data.ORIGEN).trim(),ORIGEN_LATITUD:data.ORIGEN_LATITUD|| (hasBase?baseLat:''),ORIGEN_LONGITUD:data.ORIGEN_LONGITUD||(hasBase?baseLng:''),DESTINO:data.DESTINO,
      DESTINO_LATITUD:data.DESTINO_LATITUD||'',DESTINO_LONGITUD:data.DESTINO_LONGITUD||'',PARADAS_CODIFICADAS:data.PARADAS_CODIFICADAS||'',
      PROVEEDOR_NAVEGACION:['Google Maps','Waze'].includes(data.PROVEEDOR_NAVEGACION)?data.PROVEEDOR_NAVEGACION:'Google Maps',ESTADO:'Asignada',
      INSTRUCCIONES:data.INSTRUCCIONES||'',FECHA_ASIGNACION:now,FECHA_INICIO:'',FECHA_FIN:'',CREADO_POR:user.ID,CREADO_EN:now,ACTUALIZADO_EN:now,ELIMINADO:'NO'};
    localDb.routes.push(route);const notification=localCreateNotification({DESTINATARIO_USUARIO_ID:driver.USUARIO_ID||'',DESTINATARIO_CONDUCTOR_ID:driver.ID,
      TITULO:'Nueva ruta asignada',MENSAJE:`${route.NOMBRE}: ${route.ORIGEN} → ${route.DESTINO}`,TIPO:'Ruta',PRIORIDAD:data.PRIORIDAD||'Alta',RUTA_ID:route.ID,OPERACION_ID:route.OPERACION_ID,CREADO_POR:user.ID});
    audit(user,'ASIGNAR','RUTAS',`Ruta asignada a ${driver.NOMBRE}`,route.ID);saveLocal();return{row:route,notification};
  }
  function localUpdateRouteStatus(payload){
    const user=requireLocalUser(),route=find('routes',payload.id||payload.RUTA_ID);requireLocalPermission(user,'RUTAS','ACTUALIZAR');
    if(!route)throw new Error('RUTA_NO_ENCONTRADA');if(!localFilterRows('routes',[route],user).length)throw new Error('PERMISO_DENEGADO');
    const state=payload.ESTADO||payload.data?.ESTADO;if(!['Asignada','En curso','Completada','Cancelada'].includes(state))throw new Error('ESTADO_RUTA_INVALIDO');
    if(user.ROL_ID==='ROL-CONDUCTOR'&&!['En curso','Completada'].includes(state))throw new Error('PERMISO_DENEGADO');
    route.ESTADO=state;if(state==='En curso'&&!route.FECHA_INICIO)route.FECHA_INICIO=iso();if(['Completada','Cancelada'].includes(state))route.FECHA_FIN=iso();route.ACTUALIZADO_EN=iso();
    audit(user,'CAMBIAR_ESTADO','RUTAS',`Estado: ${state}`,route.ID);saveLocal();return{row:route};
  }
  function localCreateNotification(data){
    const now=iso(),row={ID:id('NOT'),DESTINATARIO_USUARIO_ID:data.DESTINATARIO_USUARIO_ID||'',DESTINATARIO_CONDUCTOR_ID:data.DESTINATARIO_CONDUCTOR_ID||'',
      TITULO:data.TITULO,MENSAJE:data.MENSAJE,TIPO:data.TIPO||'Información',PRIORIDAD:data.PRIORIDAD||'Normal',RUTA_ID:data.RUTA_ID||'',OPERACION_ID:data.OPERACION_ID||'',
      LEIDA:'NO',FECHA_ENVIO:now,FECHA_LECTURA:'',CREADO_POR:data.CREADO_POR||'',CREADO_EN:now,ACTUALIZADO_EN:now,ELIMINADO:'NO'};localDb.notifications.push(row);return row;
  }
  function localSendNotification(payload){
    const user=requireLocalUser(),data=payload.data||payload;requireLocalPermission(user,'NOTIFICACIONES','CREAR');if(!data.TITULO||!data.MENSAJE)throw new Error('DATOS_NOTIFICACION_REQUERIDOS');
    let driverId=data.DESTINATARIO_CONDUCTOR_ID||'',userId=data.DESTINATARIO_USUARIO_ID||'';if(driverId){const driver=find('drivers',driverId);if(!driver)throw new Error('CONDUCTOR_NO_ENCONTRADO');userId=userId||driver.USUARIO_ID||'';}
    if(!driverId&&!userId)throw new Error('DESTINATARIO_REQUERIDO');const row=localCreateNotification({...data,DESTINATARIO_CONDUCTOR_ID:driverId,DESTINATARIO_USUARIO_ID:userId,CREADO_POR:user.ID});
    audit(user,'ENVIAR','NOTIFICACIONES',row.TITULO,row.ID);saveLocal();return{row};
  }
  function localReadNotification(payload){
    const user=requireLocalUser(),row=find('notifications',payload.id||payload.NOTIFICACION_ID);requireLocalPermission(user,'NOTIFICACIONES','ACTUALIZAR');
    if(!row)throw new Error('NOTIFICACION_NO_ENCONTRADA');if(!localFilterRows('notifications',[row],user).length)throw new Error('PERMISO_DENEGADO');
    row.LEIDA='SI';row.FECHA_LECTURA=iso();row.ACTUALIZADO_EN=iso();saveLocal();return{row};
  }
  function localHeartbeat(payload){
    const user=requireLocalUser(),data=payload.data||payload,deviceId=String(data.DISPOSITIVO_ID||'').slice(0,120);if(!deviceId)throw new Error('CAMPO_REQUERIDO_DISPOSITIVO_ID');
    const driver=localDriver(user),sessionId=auth.sessionId||String(data.SESION_CLIENTE_ID||''),clientSessionId=String(data.SESION_CLIENTE_ID||'').slice(0,120);
    const operation=driver?activeRows(localDb.operations).find(row=>row.CONDUCTOR_ID===driver.ID&&row.ESTADO==='Activa'):null;
    const route=driver?(activeRows(localDb.routes).find(row=>row.CONDUCTOR_ID===driver.ID&&row.ESTADO==='En curso')||activeRows(localDb.routes).find(row=>row.CONDUCTOR_ID===driver.ID&&row.ESTADO==='Asignada')):null;
    const gpsActive=data.GPS_ACTIVO==='SI',drivingAssignment=Boolean(operation||(route&&route.ESTADO==='En curso'));
    const activity=!driver?'Sesión administrativa':drivingAssignment&&gpsActive?'Conduciendo':drivingAssignment?'Operación activa sin GPS':'Conectado';
    const existing=activeRows(localDb.connections).find(row=>row.USUARIO_ID===user.ID&&row.DISPOSITIVO_ID===deviceId&&row.SESION_ID===sessionId&&String(row.SESION_CLIENTE_ID||'')===clientSessionId);
    requireLocalPermission(user,'CONEXIONES',existing?'ACTUALIZAR':'CREAR');const now=iso(),values={USUARIO_ID:user.ID,CONDUCTOR_ID:driver?.ID||'',DISPOSITIVO_ID:deviceId,
      SESION_ID:sessionId,SESION_CLIENTE_ID:clientSessionId,SECCION_ACTUAL:String(data.SECCION_ACTUAL||'dashboard').slice(0,80),ACTIVIDAD:activity,
      VEHICULO_ID:operation?.VEHICULO_ID||route?.VEHICULO_ID||'',OPERACION_ID:operation?.ID||'',RUTA_ID:route?.ID||'',GPS_ACTIVO:gpsActive?'SI':'NO',PAGINA_VISIBLE:data.PAGINA_VISIBLE==='NO'?'NO':'SI',
      ESTADO:data.ESTADO||'En línea',ULTIMA_CONEXION:now,PLATAFORMA:data.PLATAFORMA||navigator.platform||'',NAVEGADOR:data.NAVEGADOR||navigator.userAgent,
      TIPO_RED:data.TIPO_RED||'',BATERIA_PORCENTAJE:data.BATERIA_PORCENTAJE??'',IP_PUBLICA:data.IP_PUBLICA||find('sessions',auth.sessionId)?.IP_PUBLICA||'',IP_VERSION:String(data.IP_PUBLICA||find('sessions',auth.sessionId)?.IP_PUBLICA||'').includes(':')?'IPv6':(data.IP_PUBLICA||find('sessions',auth.sessionId)?.IP_PUBLICA)?'IPv4':'',IP_CAPTURADA_EN:(data.IP_PUBLICA||find('sessions',auth.sessionId)?.IP_PUBLICA)?now:'',ACTUALIZADO_EN:now,ELIMINADO:'NO'};
    const row=existing?Object.assign(existing,values):{ID:id('CNX'),...values,CREADO_EN:now};if(!existing)localDb.connections.push(row);saveLocal();return{row,serverTime:now};
  }
  function localRealtimeSummary(payload={}){
    const user=requireLocalUser();requireLocalPermission(user,'PANEL_PRINCIPAL','LEER');const locations=hasLocalPermission(user,'GPS','LEER')?localLatestLocations(payload):{rows:[],total:0,trackingVehicles:[]};const vehicleFilter=localVehicleFilter(payload,user);const onlyGps=String(payload.soloGps||payload.SOLO_GPS||'')==='SI';
    const connections=hasLocalPermission(user,'CONEXIONES','LEER')?localFilterRows('connections',activeRows(localDb.connections),user):[],latest={};connections.sort((a,b)=>new Date(b.ULTIMA_CONEXION)-new Date(a.ULTIMA_CONEXION)).forEach(row=>{const key=`${row.SESION_ID||row.USUARIO_ID}:${row.SESION_CLIENTE_ID||row.DISPOSITIVO_ID}`;if(!latest[key])latest[key]=row;});
    const limit=Date.now()-(config.ANTIGUEDAD_CONEXION_ACTIVA_MILISEGUNDOS||90000);const devices=Object.values(latest).map(row=>{const driver=find('drivers',row.CONDUCTOR_ID),operation=driver?activeRows(localDb.operations).find(item=>item.CONDUCTOR_ID===driver.ID&&item.ESTADO==='Activa'):null,route=driver?(activeRows(localDb.routes).find(item=>item.CONDUCTOR_ID===driver.ID&&item.ESTADO==='En curso')||activeRows(localDb.routes).find(item=>item.CONDUCTOR_ID===driver.ID&&item.ESTADO==='Asignada')):null,vehicleId=operation?.VEHICULO_ID||route?.VEHICULO_ID||row.VEHICULO_ID||'',vehicle=find('vehicles',vehicleId),online=new Date(row.ULTIMA_CONEXION).getTime()>=limit&&row.ESTADO!=='Desconectado',drivingAssignment=Boolean(operation||(route&&route.ESTADO==='En curso')),activity=!online?'Inactivo':!driver?'Sesión administrativa':drivingAssignment&&row.GPS_ACTIVO==='SI'?'Conduciendo':drivingAssignment?'Operación activa sin GPS':'Conectado';return{...row,USUARIO_NOMBRE:find('users',row.USUARIO_ID)?.NOMBRE||'',CONDUCTOR_NOMBRE:driver?.NOMBRE||'',VEHICULO_ID:vehicleId,VEHICULO_PATENTE:vehicle?.PATENTE||'',OPERACION_ID:operation?.ID||'',RUTA_ID:route?.ID||'',ACTIVIDAD:activity,EN_LINEA:online};});
    const filteredDevices=vehicleFilter.activo?devices.filter(row=>vehicleFilter.ids.has(row.VEHICULO_ID)):devices;
    filteredDevices.sort((a,b)=>a.EN_LINEA!==b.EN_LINEA?(a.EN_LINEA?-1:1):new Date(b.ULTIMA_CONEXION)-new Date(a.ULTIMA_CONEXION));
    const routes=onlyGps?[]:(hasLocalPermission(user,'RUTAS','LEER')?localFilterRows('routes',activeRows(localDb.routes),user):[]).filter(row=>['Asignada','En curso'].includes(row.ESTADO));
    const notifications=onlyGps?[]:(hasLocalPermission(user,'NOTIFICACIONES','LEER')?localFilterRows('notifications',activeRows(localDb.notifications),user):[]).filter(row=>row.LEIDA!=='SI').slice(-50).reverse();
    return{locations:locations.rows,trackingVehicles:locations.trackingVehicles||[],devices:filteredDevices.slice(0,100),routes,notifications,totals:{locations:locations.total,onlineDevices:filteredDevices.filter(row=>row.EN_LINEA).length,drivingSessions:filteredDevices.filter(row=>row.EN_LINEA&&row.ACTIVIDAD==='Conduciendo').length,sessionsWithoutGps:filteredDevices.filter(row=>row.EN_LINEA&&row.ACTIVIDAD==='Operación activa sin GPS').length,activeRoutes:routes.length,unreadNotifications:notifications.length},serverTime:iso()};
  }
  function localSaveCompany(payload){
    const user=requireLocalUser();
    if(user.ROL_ID!=='ROL-ADMIN')throw new Error('PERMISO_DENEGADO');
    const data={...(payload.data||{})};
    ['PUNTO_OPERACION_LATITUD','PUNTO_OPERACION_LONGITUD'].forEach(field=>{if(field in data&&data[field]!==''&&!Number.isFinite(Number(data[field])))throw new Error('COORDENADAS_INVALIDAS');if(field in data&&data[field]!=='')data[field]=Number(data[field]);});
    ['RADIO_INICIO_METROS','RADIO_FIN_METROS','PRECISION_GPS_MAXIMA_METROS'].forEach(field=>{if(!(field in data)||data[field]==='')return;const value=Math.round(Number(data[field]));if(!Number.isFinite(value)||value<10||value>5000)throw new Error('RADIO_OPERACION_INVALIDO');data[field]=value;});
    if('VALIDAR_UBICACION_OPERACION' in data)data.VALIDAR_UBICACION_OPERACION=String(data.VALIDAR_UBICACION_OPERACION)==='NO'?'NO':'SI';
    if('RETORNO_BASE_OBLIGATORIO' in data)data.RETORNO_BASE_OBLIGATORIO=String(data.RETORNO_BASE_OBLIGATORIO)==='NO'?'NO':'SI';
    const colorFields=['COLOR_PRINCIPAL','COLOR_SECUNDARIO','COLOR_ACENTO','COLOR_FONDO','COLOR_SUPERFICIE','COLOR_TEXTO','COLOR_TEXTO_SECUNDARIO','COLOR_BORDE','COLOR_MENU','COLOR_MENU_SECUNDARIO','COLOR_EXITO','COLOR_ADVERTENCIA','COLOR_PELIGRO','COLOR_FONDO_OSCURO','COLOR_SUPERFICIE_OSCURO','COLOR_TEXTO_OSCURO','COLOR_TEXTO_SECUNDARIO_OSCURO','COLOR_BORDE_OSCURO'];
    colorFields.forEach(field=>{if(field in data&&data[field]!==''&&!/^#[0-9A-F]{6}$/i.test(String(data[field])))throw new Error('COLOR_TEMA_INVALIDO');if(field in data)data[field]=String(data[field]).toUpperCase();});
    if('TEMA_PREDETERMINADO' in data&&!['Claro','Oscuro','Sistema'].includes(String(data.TEMA_PREDETERMINADO)))throw new Error('TEMA_PREDETERMINADO_INVALIDO');
    let row=localPrimaryCompany();
    if(!row){
      row={ID:id('EMP'),CREADO_EN:iso(),ELIMINADO:'NO'};
      localDb.companies.push(row);
    }
    if(payload.logotipoBase64){
      data.DIRECCION_LOGOTIPO=String(payload.logotipoBase64);
      data.NOMBRE_ARCHIVO_LOGOTIPO=String(payload.nombreLogotipo||'logotipo');
      data.TIPO_ARCHIVO_LOGOTIPO=String(payload.tipoLogotipo||'image/png');
    }
    if(payload.eliminarLogotipo==='SI'){
      data.DIRECCION_LOGOTIPO='';data.NOMBRE_ARCHIVO_LOGOTIPO='';data.TIPO_ARCHIVO_LOGOTIPO='';data.ID_ARCHIVO_LOGOTIPO='';
    }
    Object.assign(row,data,{ESTADO:data.ESTADO||row.ESTADO||'Activo',ACTUALIZADO_EN:iso()});
    audit(user,'ACTUALIZAR','EMPRESA','Configuración de empresa guardada',row.ID);
    saveLocal();
    return {row:cleanRow(row),confirmado:true};
  }

  function localGetOperationalPoint(){
    const user=requireLocalUser();
    if(!user)throw new Error('AUTENTICACION_REQUERIDA');
    const row=localPrimaryCompany();
    try{
      const point=localOperationalBase();
      return{configurado:true,confirmado:true,row:cleanRow(row||{}),point};
    }catch(error){
      if(String(error?.message||error)==='PUNTO_OPERACION_NO_CONFIGURADO')return{configurado:false,confirmado:false,row:cleanRow(row||{}),point:null};
      throw error;
    }
  }

  function localSaveOperationalPoint(payload){
    const user=requireLocalUser();if(!['ROL-ADMIN','ROL-SUPERVISOR'].includes(user.ROL_ID))throw new Error('PUNTO_OPERACION_ROL_NO_AUTORIZADO');
    const data={...(payload.data||payload)};data.VALIDAR_UBICACION_OPERACION='SI';data.RETORNO_BASE_OBLIGATORIO='SI';
    const lat=Number(data.PUNTO_OPERACION_LATITUD),lng=Number(data.PUNTO_OPERACION_LONGITUD);
    if(!Number.isFinite(lat)||lat<-90||lat>90||!Number.isFinite(lng)||lng<-180||lng>180)throw new Error('COORDENADAS_INVALIDAS');
    data.PUNTO_OPERACION_LATITUD=lat;data.PUNTO_OPERACION_LONGITUD=lng;
    ['RADIO_INICIO_METROS','RADIO_FIN_METROS','PRECISION_GPS_MAXIMA_METROS'].forEach(field=>{const value=Math.round(Number(data[field]||({RADIO_INICIO_METROS:150,RADIO_FIN_METROS:150,PRECISION_GPS_MAXIMA_METROS:120}[field])));if(!Number.isFinite(value)||value<10||value>5000)throw new Error('RADIO_OPERACION_INVALIDO');data[field]=value;});
    if(!String(data.PUNTO_OPERACION_NOMBRE||'').trim())data.PUNTO_OPERACION_NOMBRE='Base operacional';
    if(!String(data.PUNTO_OPERACION_DIRECCION||'').trim())data.PUNTO_OPERACION_DIRECCION=localPrimaryCompany()?.DIRECCION||data.PUNTO_OPERACION_NOMBRE;
    let row=localPrimaryCompany();if(!row){row={ID:id('EMP'),NOMBRE_FANTASIA:data.PUNTO_OPERACION_NOMBRE,RAZON_SOCIAL:data.PUNTO_OPERACION_NOMBRE,ESTADO:'Activo',CREADO_EN:iso(),ELIMINADO:'NO'};localDb.companies.push(row);}
    const previous={lat:row.PUNTO_OPERACION_LATITUD,lng:row.PUNTO_OPERACION_LONGITUD};const changedAt=iso(),ip=String(data.IP_PUBLICA||find('sessions',auth.sessionId)?.IP_PUBLICA||'');Object.assign(row,data,{PUNTO_OPERACION_MODIFICADO_POR:user.ID,PUNTO_OPERACION_MODIFICADO_ROL:user.ROL_ID,PUNTO_OPERACION_MODIFICADO_IP:ip,PUNTO_OPERACION_MODIFICADO_EN:changedAt,ACTUALIZADO_EN:changedAt,ESTADO:row.ESTADO||'Activo'});audit(user,'CONFIGURAR_PUNTO','CONFIGURACION',`Punto operacional actualizado de ${previous.lat||'sin latitud'},${previous.lng||'sin longitud'} a ${lat},${lng}`,row.ID);saveLocal();
    const point=localOperationalBase();return{row:cleanRow(row),point,confirmado:true};
  }

  function localImportKey(resource,row){if(resource==='vehicles')return `PATENTE:${String(row.PATENTE||'').replace(/[^A-Z0-9]/gi,'').toUpperCase()}`;if(resource==='drivers')return `RUT:${String(row.RUT||'').replace(/[^0-9Kk]/g,'').toUpperCase()}`;return ['DOC',row.TIPO,row.ASOCIADO_TIPO,row.IDENTIFICACION,row.FECHA_VENCIMIENTO].map(value=>String(value||'').trim().toUpperCase()).join(':');}
  function localBulkImport(payload){const user=requireLocalUser(),resource=String(payload.resource||payload.recurso||''),key=resourceMap[resource],data=payload.data||payload,rows=Array.isArray(data.rows)?data.rows:Array.isArray(data.filas)?data.filas:[];if(!['vehicles','drivers','documents'].includes(resource)||!key)throw new Error('RECURSO_IMPORTACION_NO_PERMITIDO');requireLocalPermission(user,moduleByResource[key],'CREAR');const update=String(data.actualizarExistentes??'SI')!=='NO';if(update)requireLocalPermission(user,moduleByResource[key],'ACTUALIZAR');if(!rows.length)throw new Error('IMPORTACION_SIN_FILAS');if(rows.length>1500)throw new Error('IMPORTACION_DEMASIADAS_FILAS');const required={vehicles:['PATENTE','MARCA','MODELO'],drivers:['NOMBRE','RUT'],documents:['TIPO','ASOCIADO_TIPO','IDENTIFICACION','FECHA_VENCIMIENTO']}[resource],errors=[],seen=new Set(),indexMap=new Map(activeRows(localDb[key]).map(row=>[localImportKey(resource,row),row]));let created=0,updated=0,skipped=0;rows.forEach((raw,i)=>{try{const row={};Object.entries(raw||{}).forEach(([field,value])=>{const normalized=String(field).trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_+|_+$/g,'');if(normalized)row[normalized]=value;});required.forEach(field=>{if(String(row[field]??'').trim()==='')throw new Error(`CAMPO_REQUERIDO_${field}`);});if(resource==='vehicles'){row.PATENTE=String(row.PATENTE).trim().toUpperCase();row.ESTADO=row.ESTADO||'Disponible';row.KILOMETRAJE=Number(row.KILOMETRAJE||0);row.QR_CODIGO=row.QR_CODIGO||`VEH-${row.PATENTE.replace(/[^A-Z0-9]/g,'')}`;}if(resource==='drivers'){row.RUT=String(row.RUT).trim().toUpperCase();row.CORREO=String(row.CORREO||'').trim().toLowerCase();row.ESTADO=row.ESTADO||'Disponible';}if(resource==='documents'){row.ASOCIADO_TIPO=String(row.ASOCIADO_TIPO).trim();row.IDENTIFICACION=String(row.IDENTIFICACION).trim().toUpperCase();row.ESTADO=row.ESTADO||'Vigente';if(!row.ASOCIADO_ID){if(row.ASOCIADO_TIPO==='Vehículo')row.ASOCIADO_ID=activeRows(localDb.vehicles).find(item=>String(item.PATENTE||'').replace(/[^A-Z0-9]/gi,'').toUpperCase()===row.IDENTIFICACION.replace(/[^A-Z0-9]/gi,''))?.ID||'';else if(row.ASOCIADO_TIPO==='Conductor')row.ASOCIADO_ID=activeRows(localDb.drivers).find(item=>String(item.RUT||'').replace(/[^0-9Kk]/g,'').toUpperCase()===row.IDENTIFICACION.replace(/[^0-9Kk]/g,''))?.ID||'';else row.ASOCIADO_ID=localPrimaryCompany()?.ID||'';}if(!row.ASOCIADO_ID)throw new Error('ASOCIADO_NO_ENCONTRADO');}const importKey=localImportKey(resource,row);if(seen.has(importKey))throw new Error('DUPLICADA_EN_ARCHIVO');seen.add(importKey);const existing=indexMap.get(importKey),now=iso();if(existing){if(!update){skipped++;return;}Object.assign(existing,row,{ACTUALIZADO_EN:now,ELIMINADO:'NO'});updated++;}else{const prefixes={vehicles:'VEH',drivers:'CON',documents:'DOC'},createdRow={ID:id(prefixes[resource]),...row,CREADO_EN:now,ACTUALIZADO_EN:now,ELIMINADO:'NO'};localDb[key].push(createdRow);indexMap.set(importKey,createdRow);created++;}}catch(error){errors.push({fila:i+2,error:String(error.message||error)});}});audit(user,'IMPORTAR_MASIVO',moduleByResource[key],`Importación masiva: ${created} creados, ${updated} actualizados, ${skipped} omitidos, ${errors.length} errores`);saveLocal();return{resource,totalRecibidas:rows.length,creadas:created,actualizadas:updated,omitidas:skipped,errores:errors,correcto:errors.length===0};}
  function localRegisterConnectionIp(payload){const user=requireLocalUser(),data=payload.data||payload,ip=String(data.IP_PUBLICA||'').trim();if(!ip)return{registrada:false};const session=find('sessions',auth.sessionId),now=iso();if(session)Object.assign(session,{IP_PUBLICA:ip,IP_VERSION:ip.includes(':')?'IPv6':'IPv4',IP_CAPTURADA_EN:now,ULTIMO_USO:now});activeRows(localDb.connections).filter(row=>row.SESION_ID===auth.sessionId).forEach(row=>Object.assign(row,{IP_PUBLICA:ip,IP_VERSION:ip.includes(':')?'IPv6':'IPv4',IP_CAPTURADA_EN:now,ACTUALIZADO_EN:now}));audit(user,'REGISTRAR_IP','SEGURIDAD','Dirección IP pública registrada al conectar',auth.sessionId);saveLocal();return{registrada:true,ipVersion:ip.includes(':')?'IPv6':'IPv4',fecha:now};}
  function localDiagnoseSystem(){
    const user=requireLocalUser();requireLocalPermission(user,'CONFIGURACION','LEER');
    const company=localPrimaryCompany()||{};
    const lat=Number(company.PUNTO_OPERACION_LATITUD),lng=Number(company.PUNTO_OPERACION_LONGITUD);
    const pointOk=Number.isFinite(lat)&&Number.isFinite(lng)&&String(company.VALIDAR_UBICACION_OPERACION||'SI')!=='NO';
    const modules={
      structure:{nombre:'Estructura local',estado:'OK',detalle:'Todas las colecciones internas están disponibles.'},
      routes:{nombre:'Asignación de rutas',estado:activeRows(localDb.drivers).length?'OK':'REVISAR',detalle:`${activeRows(localDb.routes).length} rutas · ${activeRows(localDb.drivers).length} conductores · ${activeRows(localDb.vehicles).length} vehículos`},
      operations:{nombre:'Operaciones',estado:pointOk?'OK':'REVISAR',detalle:pointOk?`Punto base ${lat.toFixed(6)}, ${lng.toFixed(6)}`:'Falta configurar el punto operacional.'},
      gps:{nombre:'Mapa en tiempo real',estado:'OK',detalle:`${activeRows(localDb.gpsCurrent).length} posiciones actuales · ${activeRows(localDb.connections).length} conexiones`},
      notifications:{nombre:'Notificaciones',estado:'OK',detalle:`${activeRows(localDb.notifications).length} registros`},
      alerts:{nombre:'Alertas',estado:'OK',detalle:`${activeRows(localDb.alerts).length} registros`},
      history:{nombre:'Historiales',estado:'OK',detalle:`${activeRows(localDb.history).length} eventos operativos · ${activeRows(localDb.checkins).length} check-ins`}
    };
    return{version:'3.5.0',fecha:iso(),correcto:Object.values(modules).every(item=>item.estado==='OK'),modules};
  }
  function localRepairSystem(){
    const user=requireLocalUser();requireLocalPermission(user,'CONFIGURACION','ACTUALIZAR');
    const defaults=emptyState();Object.keys(defaults).forEach(key=>{if(!Array.isArray(localDb[key]))localDb[key]=[];});
    seedCatalogs();audit(user,'REPARAR_SISTEMA','CONFIGURACION','Estructura local, catálogos y permisos verificados');saveLocal();
    return{repaired:true,diagnostico:localDiagnoseSystem()};
  }

  async function localChangePassword(payload){const user=requireLocalUser();if(user.CONTRASENA_CIFRADA!==await digest(payload.contrasenaActual+':'+user.SAL_CONTRASENA))throw new Error('CONTRASENA_ACTUAL_INVALIDA');if(String(payload.nuevaContrasena??'').length===0)throw new Error('CONTRASENA_REQUERIDA');const salt=id('SALT');user.SAL_CONTRASENA=salt;user.CONTRASENA_CIFRADA=await digest(String(payload.nuevaContrasena)+':'+salt);user.ACTUALIZADO_EN=iso();saveLocal();return{changed:true};}
  function localClear(payload){const user=requireLocalUser();if(user.ROL_ID!=='ROL-ADMIN')throw new Error('PERMISO_DENEGADO');if(payload.confirmacion!=='LIMPIAR DATOS')throw new Error('CONFIRMACION_REQUERIDA');['vehicles','drivers','operations','gps','gpsCurrent','history','maintenance','documents','alerts','reports','audit','qr','routes','notifications','connections','checkins'].forEach(key=>localDb[key]=[]);audit(user,'LIMPIAR','CONFIGURACION','Datos operativos eliminados; empresa y usuarios conservados');saveLocal();return{cleared:true};}

  window.ConexionFlotas = {
    request,
    requestBatch,
    prefetch,
    invalidate: invalidarCache,
    isRemote,
    backendLabel,
    authErrorCode,
    isAuthError,
    getAuth: () => ({ ...auth }),
    setAuth,
    getClientIp,
    registerConnectionIp,
    cacheInfo: informacionCache,
    latestCacheUpdate: ultimaActualizacionCache,
    persistCache: persistirCacheAhora,
    reloadLocal: () => { localDb = loadLocal(); },
  };
  })();
