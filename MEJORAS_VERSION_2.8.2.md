# Mejoras versión 2.8.2

## Guardado de check-in corregido

- La hoja `CHECKINS` se crea o repara automáticamente antes de guardar.
- El servidor confirma que el registro existe físicamente en Google Sheets antes de responder éxito.
- Cada envío incluye un identificador de solicitud para evitar duplicados cuando se reintenta.
- Un fallo secundario al crear alertas o bitácora ya no cancela un check-in que sí fue guardado.
- La pantalla muestra un comprobante con el ID real del registro y diferencia base central de almacenamiento local.
- Se incluye la función `repararModuloCheckin()` para diagnóstico manual.
