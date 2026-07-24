> Nota: la versión 3.1.1 reemplaza la regla que bloqueaba la asignación de rutas sin punto operacional. La geocerca queda reservada al inicio y cierre de operaciones.

# Mejoras versión 3.1.1 — Reparación integral de módulos

- Se crearon las funciones faltantes `renderRoutes()` y `renderNotifications()`.
- Se corrigió la referencia inexistente del selector de rutas en Operaciones, que detenía el formulario al elegir vehículo o conductor.
- Nuevo panel moderno de asignación de rutas con estados, búsqueda, navegación y vínculo con la base operacional.
- Notificaciones funcionales con envío, bandeja, lectura, lectura masiva, voz y dictado.
- Alertas con marcado individual o masivo y exportación.
- Historial unificado de operaciones, rutas, check-ins, alertas y notificaciones.
- Diagnóstico y reparación desde Configuración.
- Migración segura de columnas por nombre para conservar los datos al actualizar esquemas.
- El servidor exige el punto operacional al asignar rutas.
- El mapa muestra la base operacional junto a los vehículos.
- Se mantienen geocerca de inicio y cierre, check-in obligatorio y retorno a base.
- Diseño adaptable a escritorio, tabletas y teléfonos.

- `actualizarSistema()` ahora verifica también la persistencia del check-in.
