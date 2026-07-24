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
