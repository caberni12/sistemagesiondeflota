/** Permisos personalizados por usuario sin invalidar su sesión. */
function actualizarPermisosUsuario_(request, session) {
  exigirPermiso_(session.user, 'USUARIOS', 'ACTUALIZAR');
  const data = request.datos || request;
  const userId = String(data.USUARIO_ID || request.identificador || '').trim();
  if (!userId) throw new Error('USUARIO_REQUERIDO');
  const user = obtenerRegistro_('USUARIOS', userId);
  if (!user) throw new Error('REGISTRO_NO_ENCONTRADO');
  if (user.ROL_ID === 'ROL-ADMIN') {
    const updatedAdmin = actualizarRegistro_('USUARIOS', user.ID, {
      MODO_PERMISOS:'ROL',
      PERMISOS_PERSONALIZADOS:'[]',
      VERSION_PERMISOS:Number(user.VERSION_PERMISOS || 0) + 1,
    });
    registrarBitacora_(session.user, 'ACTUALIZAR_PERMISOS', 'USUARIOS', user.ID, 'Respaldo anterior: ' + respaldoAuditoria_(user) + '. Datos posteriores: ' + respaldoAuditoria_(updatedAdmin));
    return ok_({ row:usuarioPublico_(updatedAdmin), admin:true });
  }
  const modo = String(data.MODO_PERMISOS || 'ROL').toUpperCase() === 'PERSONALIZADO' ? 'PERSONALIZADO' : 'ROL';
  const permisos = modo === 'PERSONALIZADO' ? normalizarListaPermisos_(data.PERMISOS || data.PERMISOS_PERSONALIZADOS || []) : [];
  const updated = actualizarRegistro_('USUARIOS', user.ID, {
    MODO_PERMISOS:modo,
    PERMISOS_PERSONALIZADOS:JSON.stringify(permisos),
    VERSION_PERMISOS:Number(user.VERSION_PERMISOS || 0) + 1,
  });
  registrarBitacora_(session.user, 'ACTUALIZAR_PERMISOS', 'USUARIOS', user.ID,
    (modo === 'PERSONALIZADO' ? 'Permisos personalizados actualizados sin cerrar sesiones. ' : 'Permisos restaurados al rol. ') +
    'Respaldo anterior: ' + respaldoAuditoria_(user) + '. Datos posteriores: ' + respaldoAuditoria_(updated));
  return ok_({ row:usuarioPublico_(updated), sessionPreserved:true });
}
