# Pruebas versión 3.16.0

## Seguimiento y rendimiento

- Consulta exclusiva `seguimientoConexionTiempoReal`.
- Ciclo liviano de un segundo sin solapamiento de solicitudes.
- Envío GPS web cada 1,5 segundos o desde 2 metros de desplazamiento.
- Respaldo exponencial si el servidor no responde.
- Tabla completa separada del movimiento del mapa.
- Marcadores actualizados por identificador sin reconstrucción total.
- Rastro incremental limitado a 40 posiciones.
- Direcciones obtenidas desde caché en el canal rápido, sin geocodificación bloqueante.

## Comunicaciones

- Notificación individual.
- Notificación a conductores.
- Notificación a conectados.
- Notificación general.
- Alerta individual y por grupos.
- Inserción por lote.
- Prevención de duplicados por identificador de solicitud.
- Validación de permisos y auditoría.

## Regresión

- Filtros reflejados en contadores, tabla, lista rápida y mapa.
- Pausa y reanudación del seguimiento al cambiar filtros.
- GPS, operaciones, rutas, check-in, combustible, documentos, permisos y QR conservados.
- Respuesta sin usuario seguido segura.
