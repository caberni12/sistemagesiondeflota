# Cambios versión 3.16.0

## Seguimiento casi inmediato

- El usuario seguido utiliza una consulta liviana e independiente cada segundo.
- El envío web de nuevas posiciones puede realizarse cada 1,5 segundos o al detectar un desplazamiento de 2 metros.
- La tabla completa se actualiza cada 5 segundos sin bloquear el movimiento del mapa.
- El rastro conserva hasta 40 posiciones y aprovecha la caché incremental del servidor.
- Las consultas rápidas de `GPS_ACTUAL` y `CONEXIONES_ACTUAL` usan una caché independiente de un segundo.

## Mapa de alto rendimiento

- Los marcadores se crean una sola vez y después se mueven o actualizan individualmente.
- El mapa ya no elimina y reconstruye todos los marcadores ante cada coordenada.
- Se conservan la reutilización de baldosas, el dibujo coordinado con el navegador y los filtros actuales.

## Notificaciones y alertas

- Desde Conexiones en línea puede enviarse una notificación o alerta a:
  - un usuario seleccionado;
  - todos los conductores;
  - los usuarios conectados;
  - todas las cuentas activas.
- Cada aviso respeta los permisos de creación de Notificaciones o Alertas.
- Los envíos generales se insertan en un solo lote para reducir el tiempo de escritura.
- Cada destinatario recibe su propio registro, puede marcarlo como leído y conserva su trazabilidad.
- Los reintentos con la misma solicitud no duplican avisos.
- El envío queda registrado en Auditoría.

## Compatibilidad

- Se mantienen filtros, direcciones, roles, permisos, operaciones, rutas, check-in, combustible, documentos, historial y lector QR.
- `Codigo_Completo.gs` continúa siendo el servidor maestro autosuficiente.
