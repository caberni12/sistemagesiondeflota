(function(){
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const api=window.ConexionFlotas;
  const form=$('#formularioAcceso');
  const boton=$('#botonAcceso');
  const estado=$('#estadoConexion');
  const mensaje=$('#mensajeFormulario');

  const errores={
    CREDENCIALES_INVALIDAS:'Correo o contraseña incorrectos.',
    AUTENTICACION_REQUERIDA:'Debe iniciar sesión para continuar.',
    SESION_INVALIDA:'La sesión dejó de ser válida. Ingrese nuevamente.',
    SESION_EXPIRADA:'La sesión expiró. Ingrese nuevamente.',
    USUARIO_DESHABILITADO:'El usuario fue deshabilitado.',
    DIRECCION_APLICACION_NO_CONFIGURADA:'Configure la dirección /exec en configuracion.js.',
    TIEMPO_DE_ESPERA_AGOTADO:'El servicio tardó demasiado en responder.',
    SISTEMA_NO_INICIALIZADO:'El sistema aún no tiene un administrador configurado.'
  };

  function textoError(error){
    const clave=api.authErrorCode?.(error)||String(error?.message||error||'ERROR');
    return errores[clave]||clave.replaceAll('_',' ').toLowerCase().replace(/^./,letra=>letra.toUpperCase());
  }
  function mostrarMensaje(texto,tipo='error'){
    mensaje.textContent=texto;
    mensaje.className=`mensaje-formulario ${tipo==='exito'?'exito':''}`;
  }
  function ocultarMensaje(){mensaje.className='mensaje-formulario oculto';mensaje.textContent='';}
  function cambiarEstado(texto,tipo=''){
    estado.className=`estado-conexion ${tipo}`;
    $('span',estado).textContent=texto;
  }
  function bloquear(activo,texto='Verificando…'){
    boton.disabled=activo;
    boton.textContent=activo?texto:'Ingresar al sistema';
  }
  function aplicarEmpresa(empresa){
    if(!empresa)return;
    const nombre=empresa.NOMBRE_FANTASIA||empresa.RAZON_SOCIAL||empresa.NOMBRE||'';
    const logo=empresa.DIRECCION_LOGOTIPO||'';
    if(nombre)$('#nombreEmpresaAcceso').textContent=nombre;
    if(logo)$('#logoEmpresaAcceso').src=logo;
  }
  function entrar(){location.replace('main.html');}

  async function comprobar({redirigir=true}={}){
    ocultarMensaje();
    const auth=api.getAuth();

    // La sesión guardada permite abrir el panel sin esperar otra llamada de red.
    // main.html es el único responsable de confirmarla con el servidor.
    if(redirigir&&auth.token&&auth.user){
      cambiarEstado('Sesión guardada','conectado');
      entrar();
      return true;
    }

    cambiarEstado(`Conectando con ${api.backendLabel()}…`);
    try{
      const meResult=auth.token
        ? await api.request('me',{cache:false}).then(value=>({value})).catch(error=>({error}))
        : null;
      if(meResult?.value?.user){
        api.setAuth({...auth,user:meResult.value.user});
        if(redirigir){entrar();return true;}
      }else if(meResult?.error&&api.isAuthError?.(meResult.error)){
        api.setAuth({});
      }

      const status=await api.request('status',{cache:false});
      aplicarEmpresa(status.company);
      $('#detalleServicio').textContent=`${api.backendLabel()} disponible`;
      if(status.needsSetup){
        cambiarEstado('Sistema pendiente de instalación','error');
        mostrarMensaje('Ejecute instalarSistema() y prepararAccesoAdministrador() en Google Apps Script antes de iniciar sesión.');
        return false;
      }
      cambiarEstado('Servicio conectado','conectado');
      return true;
    }catch(error){
      // Una demora o corte de Internet nunca elimina una sesión guardada.
      cambiarEstado('Conexión temporalmente inestable','error');
      $('#detalleServicio').textContent=api.backendLabel();
      mostrarMensaje(api.isAuthError?.(error)?textoError(error):'No fue posible comprobar el servicio. Puede reintentar sin perder su sesión.');
      return false;
    }
  }

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    ocultarMensaje();
    if(!form.reportValidity())return;
    bloquear(true);
    try{
      const datos=Object.fromEntries(new FormData(form).entries());
      const resultado=await api.request('login',datos);
      api.setAuth({token:resultado.token,sessionId:resultado.sessionId||'',user:resultado.user,expiresAt:resultado.expiresAt||''});
      cambiarEstado('Acceso correcto','conectado');
      mostrarMensaje('Sesión iniciada. Abriendo el panel principal…','exito');
      entrar();
    }catch(error){
      mostrarMensaje(textoError(error));
      cambiarEstado('Acceso no autorizado','error');
      $('#contrasenaAcceso').select();
    }finally{bloquear(false);}
  });
  $('#mostrarContrasena').addEventListener('click',()=>{
    const input=$('#contrasenaAcceso');
    input.type=input.type==='password'?'text':'password';
    $('#mostrarContrasena').setAttribute('aria-label',input.type==='password'?'Mostrar contraseña':'Ocultar contraseña');
  });
  $('#reintentarConexion').addEventListener('click',()=>comprobar({redirigir:false}));

  const parametros=new URLSearchParams(location.search);
  const avisoSesion=parametros.get('sesion');
  comprobar().then(()=>{
    if(avisoSesion==='cerrada')mostrarMensaje('La sesión fue cerrada correctamente.','exito');
    if(avisoSesion==='expirada')mostrarMensaje('La sesión realmente expiró o fue invalidada. Ingrese nuevamente.');
  });
})();
