# Sistema de Gestión de Flotas 3.8.0

## Optimización del módulo Operaciones

Esta versión reduce el tiempo de apertura y actualización del módulo sin alterar permisos, validaciones geográficas, check-in, rutas ni auditoría.

### Cambios aplicados

- Se reemplazaron cinco listados completos por una sola consulta especializada: `resumenOperaciones`.
- El punto operacional se entrega dentro de la misma respuesta y ya no genera una espera adicional.
- Se eliminó la carga anticipada de todos los check-ins; ahora se consultan únicamente al abrir el formulario y seleccionar vehículo/conductor.
- Siempre se muestran todas las operaciones activas.
- El historial inicial queda limitado a los 250 registros más recientes, configurable hasta 500.
- Vehículos y conductores enviados al navegador se limitan a los disponibles o ya vinculados; las rutas se limitan a las activas o vinculadas.
- La respuesta queda almacenada en memoria local y se invalida automáticamente después de iniciar, finalizar, editar o eliminar una operación.
- Se agregó búsqueda inmediata en el historial visible.
- El historial completo continúa conservado en Google Sheets, historial y auditoría.

## Compatibilidad

Se mantienen sin cambios:

- permisos por rol;
- cierre obligatorio en la base;
- cierre excepcional de Administrador o Supervisor;
- validación GPS;
- asociación de rutas y check-in;
- respaldo y auditoría;
- módulo de combustible y notificaciones.
