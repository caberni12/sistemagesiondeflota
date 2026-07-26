(function(){
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const api=window.ConexionFlotas;
  const VERSION='3.13.2';
  const grupos=[
    ['GENERAL',[
      ['dashboard','⌂','Panel principal','panel-principal.html','PANEL_PRINCIPAL'],
      ['routes','➜','Rutas asignadas','rutas.html','RUTAS'],
      ['checkin','✓','Check-in vehicular','checkin-vehicular.html','CHECKIN'],
      ['operations','⇄','Operaciones','operaciones.html','OPERACIONES'],
      ['gps','⌖','Ubicación en tiempo real','ubicacion-tiempo-real.html','GPS'],
      ['notifications','🔔','Notificaciones','notificaciones.html','NOTIFICACIONES']
    ]],
    ['GESTIÓN',[
      ['vehicles','▣','Vehículos','vehiculos.html','VEHICULOS'],
      ['drivers','♙','Conductores','conductores.html','CONDUCTORES'],
      ['checkinApprovals','☑','Aprobar check-ins','checkin-aprobaciones.html','CHECKIN_APROBACIONES'],
      ['checkinHistory','▤','Historial de check-in','checkin-historial.html','CHECKIN'],
      ['maintenance','⚙','Mantenciones','mantenciones.html','MANTENCIONES'],
      ['fuel','⛽','Combustible','combustible.html','COMBUSTIBLE'],
      ['documents','▤','Documentos','documentos.html','DOCUMENTOS'],
      ['history','↻','Historial','historial.html','HISTORIAL'],
      ['alerts','!','Alertas','alertas.html','ALERTAS']
    ]],
    ['ADMINISTRACIÓN',[
      ['connections','◎','Conexiones en línea','conexiones-en-linea.html','CONEXIONES'],
      ['users','♚','Usuarios','usuarios.html','USUARIOS'],
      ['company','🏢','Empresa','empresa.html','CONFIGURACION'],
      ['reports','▥','Reportes','reportes.html','REPORTES'],
      ['audit','☷','Auditoría','auditoria.html','BITACORA'],
      ['settings','⚒','Configuración','configuracion.html','CONFIGURACION']
    ]]
  ];
  const modulos=new Map(grupos.flatMap(([,items])=>items.map(item=>[item[0],item])));
  const marco=$('#marcoModulo');
  let usuario=null;
  let panelInicializado=false;
  let validacionPendiente=null;
  let seccionActual=localStorage.getItem('flotas_modulo_actual_v1')||'dashboard';
  let oscuro=window.TemaFlotas?.modoOscuroInicial?.()??localStorage.getItem('flotas_tema')==='dark';
  let cerrandoSesion=false;
  let redireccionando=false;
  let marcoListo=false;
  let moduloIframeActual='';
  let secuenciaCambioModulo=0;
  let temporizadorAvisos=null;
  let avisosInicializados=false;
  let idsNotificacionesConocidas=new Set();
  let idsAlertasConocidas=new Set();
  let estadoAvisos={notifications:[],alerts:[]};

  function iniciales(nombre='Usuario'){
    return String(nombre).trim().split(/\s+/).slice(0,2).map(parte=>parte[0]||'').join('').toUpperCase()||'US';
  }
  function esperar(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
  function irAcceso(motivo='expirada'){
    if(redireccionando)return;
    redireccionando=true;
    try{marco.src='about:blank';}catch(_){ }
    location.replace(`index.html?sesion=${encodeURIComponent(motivo)}`);
  }
  function permitido(modulo){
    if(!usuario)return false;
    const permisos=Array.isArray(usuario.PERMISOS)?usuario.PERMISOS:[];
    const rol=String(usuario.ROL_ID||usuario.ROL_NOMBRE||'').trim().toUpperCase();return rol==='ROL-ADMIN'||rol==='ADMINISTRADOR'||permisos.includes('*:*')||permisos.includes(`${modulo}:LEER`);
  }
  function construirMenu(){
    let html='';
    grupos.forEach(([grupo,items])=>{
      const visibles=items.filter(item=>permitido(item[4])&&(!item[5]||usuario.ROL_ID===item[5]));
      if(!visibles.length)return;
      html+=`<p class="etiqueta-menu">${grupo}</p>`+visibles.map(([id,icono,etiqueta])=>`<button class="boton-modulo ${id===seccionActual?'activo':''}" type="button" data-modulo="${id}"><i>${icono}</i><span>${etiqueta}</span></button>`).join('');
    });
    $('#navegacionModular').innerHTML=html;
    document.querySelectorAll('[data-modulo]').forEach(boton=>boton.addEventListener('click',()=>abrirModulo(boton.dataset.modulo)));
  }
  function cambiarEstado(texto,modo=''){
    const estado=$('#estadoModulo');
    estado.className=`estado-modular ${modo}`;
    $('span',estado).textContent=texto;
  }
  function abrirMenu(){
    $('#menuLateral').classList.add('abierto');
    $('#menuLateral').setAttribute('aria-hidden','false');
    $('#capaMenu').classList.add('abierta');
    document.body.classList.add('menu-abierto');
  }
  function cerrarMenu(){
    $('#menuLateral').classList.remove('abierto');
    $('#menuLateral').setAttribute('aria-hidden','true');
    $('#capaMenu').classList.remove('abierta');
    document.body.classList.remove('menu-abierto');
  }
  function abrirModulo(id,{forzar=false}={}){
    const modulo=modulos.get(id)||modulos.get('dashboard');
    if(!usuario||!permitido(modulo[4]))return;
    if(modulo[0]===seccionActual&&!forzar&&marcoListo){cerrarMenu();return;}
    seccionActual=modulo[0];
    localStorage.setItem('flotas_modulo_actual_v1',seccionActual);
    $('#tituloModulo').textContent=modulo[2];
    construirMenu();
    cerrarMenu();
    $('#cargandoModulo').classList.remove('oculto');
    cambiarEstado(marcoListo?'Cargando desde memoria local':'Abriendo módulo');
    const cambio=++secuenciaCambioModulo;

    if(marcoListo&&marco.contentWindow&&!forzar){
      enviar({tipo:'flotas:navegar',seccion:modulo[0]});
      setTimeout(()=>{
        if(cambio!==secuenciaCambioModulo||marcoListo===false)return;
        const titulo=$('#tituloModulo')?.textContent||'';
        if(titulo===modulo[2]&&!$('#cargandoModulo').classList.contains('oculto')){
          marcoListo=false;
          moduloIframeActual=modulo[0];
          marco.src=`${modulo[3]}?v=${VERSION}&recuperar=${Date.now()}`;
        }
      },7000);
      return;
    }

    marcoListo=false;
    moduloIframeActual=modulo[0];
    const recarga=forzar?`&actualizar=${Date.now()}`:'';
    marco.src=`${modulo[3]}?v=${VERSION}${recarga}`;
  }

  function aplicarUsuario(nuevoUsuario){
    usuario=nuevoUsuario||null;
    if(!usuario)return;
    $('#nombreUsuarioMenu').textContent=usuario.NOMBRE||'Usuario';
    $('#rolUsuarioMenu').textContent=usuario.ROL_NOMBRE||usuario.ROL_ID||'Usuario';
    $('#avatarMenu').textContent=iniciales(usuario.NOMBRE);
    construirMenu();
  }
  function escapar(texto){return String(texto??'').replace(/[&<>'"]/g,caracter=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[caracter]));}
  function fechaAviso(item){const fecha=new Date(item.FECHA_ENVIO||item.FECHA_HORA||item.CREADO_EN||0);return Number.isNaN(fecha.getTime())?'Sin fecha':new Intl.DateTimeFormat('es-CL',{dateStyle:'short',timeStyle:'short'}).format(fecha);}
  function puedeAvisos(modulo){if(!usuario)return false;const permisos=Array.isArray(usuario.PERMISOS)?usuario.PERMISOS:[];const rol=String(usuario.ROL_ID||usuario.ROL_NOMBRE||'').trim().toUpperCase();return rol==='ROL-ADMIN'||rol==='ADMINISTRADOR'||permisos.includes('*:*')||permisos.includes(`${modulo}:LEER`);}
  function fechaOrdenAviso(item){return new Date(item.FECHA_ENVIO||item.FECHA_HORA||item.CREADO_EN||0).getTime();}
  function mostrarToastAviso(item,tipo){const contenedor=$('#toastAvisosMenu'),nodo=document.createElement('article');nodo.className=`toast-aviso-menu ${tipo}`;nodo.innerHTML=`<i>${tipo==='alerta'?'!':'🔔'}</i><div><b>${escapar(tipo==='alerta'?'Nueva alerta':'Nueva notificación')}</b><small>${escapar(item.TITULO||item.MENSAJE||'Existe un nuevo aviso pendiente.')}</small></div><button type="button" aria-label="Cerrar">×</button>`;contenedor.append(nodo);nodo.querySelector('button').addEventListener('click',()=>nodo.remove());setTimeout(()=>nodo.remove(),5200);}
  function renderizarAvisos(){const notifications=estadoAvisos.notifications||[],alerts=estadoAvisos.alerts||[],mezclados=[...alerts.map(item=>({item,tipo:'alerta'})),...notifications.map(item=>({item,tipo:'notificacion'}))].sort((a,b)=>fechaOrdenAviso(b.item)-fechaOrdenAviso(a.item)).slice(0,14);$('#totalNotificacionesMenu').textContent=notifications.length;$('#totalAlertasMenu').textContent=alerts.length;$('#listaAvisosMenu').innerHTML=mezclados.length?mezclados.map(({item,tipo})=>`<article class="aviso-menu-item ${tipo}" data-modulo-aviso="${tipo==='alerta'?'alerts':'notifications'}"><i>${tipo==='alerta'?'!':'🔔'}</i><div><b>${escapar(item.TITULO|| (tipo==='alerta'?'Alerta':'Notificación'))}</b><span>${escapar(item.MENSAJE||'')}</span><small>${escapar(fechaAviso(item))}</small></div></article>`).join(''):'<p class="sin-avisos-menu">No existen avisos pendientes.</p>';document.querySelectorAll('[data-modulo-aviso]').forEach(item=>item.addEventListener('click',()=>{cerrarPanelAvisos();abrirModulo(item.dataset.moduloAviso);}));}
  async function actualizarAvisos(){if(!usuario)return;try{const [notificaciones,alertas]=await Promise.all([puedeAvisos('NOTIFICACIONES')?api.request('list',{resource:'notifications',cache:false}):Promise.resolve({rows:[]}),puedeAvisos('ALERTAS')?api.request('list',{resource:'alerts',cache:false}):Promise.resolve({rows:[]})]);const notifications=(notificaciones.rows||[]).filter(item=>item.LEIDA!=='SI'),alerts=(alertas.rows||[]).filter(item=>item.LEIDA!=='SI');const nuevasNotificaciones=notifications.filter(item=>!idsNotificacionesConocidas.has(String(item.ID))),nuevasAlertas=alerts.filter(item=>!idsAlertasConocidas.has(String(item.ID)));if(avisosInicializados){[...nuevasAlertas.map(item=>({item,tipo:'alerta'})),...nuevasNotificaciones.map(item=>({item,tipo:'notificacion'}))].sort((a,b)=>fechaOrdenAviso(a.item)-fechaOrdenAviso(b.item)).slice(-3).forEach(({item,tipo})=>mostrarToastAviso(item,tipo));}idsNotificacionesConocidas=new Set(notifications.map(item=>String(item.ID)));idsAlertasConocidas=new Set(alerts.map(item=>String(item.ID)));estadoAvisos={notifications,alerts};avisosInicializados=true;const total=notifications.length+alerts.length,contador=$('#contadorAvisosMenu');contador.textContent=total>99?'99+':String(total);contador.hidden=total===0;$('#notificacionesMenu').setAttribute('aria-label',total?`Abrir ${total} avisos pendientes`:'Abrir centro de notificaciones');renderizarAvisos();}catch(_){}}
  function iniciarAvisos(){if(temporizadorAvisos)return;actualizarAvisos();temporizadorAvisos=setInterval(actualizarAvisos,window.CONFIGURACION_FLOTAS.INTERVALO_NOTIFICACIONES_MILISEGUNDOS||10000);}
  function abrirPanelAvisos(){$('#panelAvisosMenu').classList.add('abierto');$('#panelAvisosMenu').setAttribute('aria-hidden','false');actualizarAvisos();}
  function cerrarPanelAvisos(){$('#panelAvisosMenu').classList.remove('abierto');$('#panelAvisosMenu').setAttribute('aria-hidden','true');}
  function alternarPanelAvisos(){if($('#panelAvisosMenu').classList.contains('abierto'))cerrarPanelAvisos();else abrirPanelAvisos();}
  function iniciarPanel(nuevoUsuario){
    aplicarUsuario(nuevoUsuario);
    document.body.classList.remove('verificando-sesion');
    $('#verificadorSesion').classList.add('oculto');
    aplicarTema();
    if(panelInicializado)return;
    panelInicializado=true;
    const modulo=modulos.get(seccionActual);
    if(!modulo||!permitido(modulo[4]))seccionActual='dashboard';
    abrirModulo(seccionActual,{forzar:true});
    iniciarAvisos();
  }
  function enviar(mensaje){
    try{marco.contentWindow?.postMessage(mensaje,'*');}catch(_){ }
  }
  function aplicarTema(){
    window.TemaFlotas?.aplicarGuardado?.();
    document.body.classList.toggle('oscuro',oscuro);
    $('#cambiarTemaMenu').textContent=oscuro?'☀':'☾';
    enviar({tipo:'flotas:tema',oscuro});
  }
  async function cerrarSesion(){
    if(cerrandoSesion)return;
    cerrandoSesion=true;
    if(temporizadorAvisos)clearInterval(temporizadorAvisos);
    const boton=$('#cerrarSesionMenu');
    boton.disabled=true;
    boton.textContent='Cerrando sesión…';
    try{await api.request('logout',{data:{}});}catch(_){ }
    api.setAuth({});
    irAcceso('cerrada');
  }
  async function confirmarInvalidezSesion(){
    await esperar(800);
    try{
      const resultado=await api.request('me',{cache:false});
      if(resultado?.user){
        const auth=api.getAuth();
        api.setAuth({...auth,user:resultado.user});
        iniciarPanel(resultado.user);
        cambiarEstado('Sesión activa','listo');
        return false;
      }
      return true;
    }catch(error){
      if(api.isAuthError?.(error))return true;
      cambiarEstado('Conexión inestable · sesión conservada','advertencia');
      return false;
    }
  }
  async function validarSesion({desdeModulo=false}={}){
    if(validacionPendiente)return validacionPendiente;
    validacionPendiente=(async()=>{
      const auth=api?.getAuth?.()||{};
      if(!auth.token){irAcceso('expirada');return false;}

      // Se muestra el panel inmediatamente con el usuario guardado.
      // Una caída temporal del servicio nunca devuelve al login.
      if(auth.user)iniciarPanel(auth.user);
      if(desdeModulo)cambiarEstado('Comprobando sesión');

      try{
        const resultado=await api.request('me',{cache:false});
        if(!resultado?.user)throw new Error('SESION_INVALIDA');
        api.setAuth({...auth,user:resultado.user});
        iniciarPanel(resultado.user);
        cambiarEstado('Módulo activo','listo');
        return true;
      }catch(error){
        if(api.isAuthError?.(error)){
          const invalida=await confirmarInvalidezSesion();
          if(invalida){api.setAuth({});irAcceso('expirada');return false;}
          return true;
        }
        if(auth.user){
          iniciarPanel(auth.user);
          cambiarEstado('Conexión lenta · sesión conservada','advertencia');
          return true;
        }
        cambiarEstado('No fue posible validar · reintentando','advertencia');
        setTimeout(()=>validarSesion(),5000);
        return false;
      }
    })().finally(()=>{validacionPendiente=null;});
    return validacionPendiente;
  }

  window.addEventListener('message',event=>{
    if(event.origin!==location.origin&&event.origin!=='null')return;
    const data=event.data||{};
    if(data.tipo==='flotas:modulo-listo'){
      marcoListo=true;
      moduloIframeActual=data.seccion||seccionActual;
      if(data.usuario)aplicarUsuario(data.usuario);
      $('#cargandoModulo').classList.add('oculto');
      cambiarEstado(data.actualizadoEn?'Módulo activo · memoria local':'Módulo activo','listo');
      aplicarTema();
    }
    if(data.tipo==='flotas:usuario-actualizado'&&data.usuario){
      aplicarUsuario(data.usuario);
      const moduloActual=modulos.get(seccionActual);
      if(!moduloActual||!permitido(moduloActual[4])){
        seccionActual='dashboard';
        localStorage.setItem('flotas_modulo_actual_v1',seccionActual);
        abrirModulo('dashboard',{forzar:true});
      }
    }
    if(data.tipo==='flotas:navegar'&&modulos.has(data.seccion))abrirModulo(data.seccion);
    if(data.tipo==='flotas:sesion-cerrada'){api.setAuth({});irAcceso('cerrada');}
    if(data.tipo==='flotas:autenticacion-requerida')validarSesion({desdeModulo:true});
    if(data.tipo==='flotas:error-modulo')cambiarEstado(data.mensaje||'Error del módulo','error');
    if(data.tipo==='flotas:empresa'){
      if(data.nombre)$('#nombreEmpresaMenu').textContent=data.nombre;
      if(data.logo){
        const logo=String(data.logo).startsWith('../')?String(data.logo).slice(3):data.logo;
        $('#logoEmpresaMenu').src=logo;
      }
      if(data.tema)window.TemaFlotas?.aplicar?.(data.tema,{guardar:true});
    }
    if(data.tipo==='flotas:tema-colores'&&data.tema)window.TemaFlotas?.aplicar?.(data.tema,{guardar:false});
  });
  window.addEventListener('flotas:sesion-invalida',()=>validarSesion({desdeModulo:true}));
  marco.addEventListener('load',()=>{marcoListo=false;setTimeout(()=>{if(!marcoListo)cambiarEstado('Preparando módulo…');},350);});
  marco.addEventListener('error',()=>cambiarEstado('No se pudo abrir el módulo','error'));
  $('#abrirMenu').addEventListener('click',abrirMenu);
  $('#cerrarMenu').addEventListener('click',cerrarMenu);
  $('#capaMenu').addEventListener('click',cerrarMenu);
  $('#sincronizarModulo').addEventListener('click',()=>{cambiarEstado('Sincronizando');enviar({tipo:'flotas:sincronizar'});});
  $('#cerrarSesionMenu').addEventListener('click',cerrarSesion);
  $('#notificacionesMenu').addEventListener('click',alternarPanelAvisos);
  $('#cerrarAvisosMenu').addEventListener('click',cerrarPanelAvisos);
  document.querySelectorAll('[data-abrir-avisos]').forEach(button=>button.addEventListener('click',()=>{cerrarPanelAvisos();abrirModulo(button.dataset.abrirAvisos);}));
  $('#cambiarTemaMenu').addEventListener('click',()=>{oscuro=!oscuro;localStorage.setItem('flotas_tema',oscuro?'dark':'light');aplicarTema();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){cerrarMenu();cerrarPanelAvisos();}});
  document.addEventListener('click',event=>{if(!$('#panelAvisosMenu').contains(event.target)&&!$('#notificacionesMenu').contains(event.target))cerrarPanelAvisos();});
  window.addEventListener('storage',event=>{
    if(event.key===window.CONFIGURACION_FLOTAS.CLAVE_SESION_LOCAL&&!event.newValue)irAcceso('cerrada');
  });

  validarSesion();
})();
