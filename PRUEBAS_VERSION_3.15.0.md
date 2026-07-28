# Pruebas versión 3.15.0

## Rendimiento

- Consultas simultáneas idénticas: una sola solicitud remota.
- Error o tiempo agotado: sin tormenta de consultas de respaldo.
- Filtro de texto: respuesta local inmediata y consulta remota agrupada.
- Tabla sin cambios: conserva el contenido existente.
- Marcadores sin cambios: no reconstruye el mapa.
- Arrastre dentro de las mismas baldosas: reposiciona imágenes existentes sin descargarlas nuevamente.
- Direcciones: lectura de caché por lote y máximo de dos resoluciones nuevas por respuesta.
- Rastro: reutilización de caché y agregado incremental hasta 40 posiciones.

## Regresión funcional

- Seguimiento individual, resaltado y botón Detener seguimiento.
- Filtros reflejados en contadores, tabla, lista rápida y mapa.
- Dirección en tabla, lista rápida y marcador.
- GPS, operaciones, rutas, check-in, combustible, permisos, notificaciones, auditoría y QR conservados.
- Respuesta inicial sin seguimiento: carga segura.

## Integridad

- JavaScript y Apps Script comprobados sintácticamente.
- XML Android comprobado en el paquete correspondiente.
- Copias de `Codigo_Completo.gs` comparadas por SHA-256.
- ZIP comprobados mediante prueba de integridad.
