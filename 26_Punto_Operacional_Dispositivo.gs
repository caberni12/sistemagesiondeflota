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
