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
