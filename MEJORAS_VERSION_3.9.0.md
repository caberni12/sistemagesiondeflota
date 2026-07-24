# Sistema de Gestión de Flotas 3.9.0

## Carga manual ultrarrápida

- Todos los módulos, excepto **GPS en tiempo real**, abren inicialmente en blanco y sin consultar Google Sheets.
- Cada módulo carga sus datos únicamente al pulsar **Sincronizar**.
- La sesión, los permisos, el menú y la estructura visual sí se mantienen al iniciar.
- La caché persistente de módulos fue desactivada para evitar mostrar información anterior antes de sincronizar.
- La información sincronizada se conserva solamente durante la sesión abierta.

## Operaciones sin bloqueo

- Al iniciar, finalizar, editar o eliminar una operación, la interfaz se libera después de confirmar la acción principal.
- La actualización visual posterior se ejecuta silenciosamente en segundo plano.
- El resumen de Operaciones limita el historial rápido a 120 cierres recientes y ya no descarga catálogos completos de vehículos, conductores y rutas.
- El historial completo continúa almacenado en Google Sheets.

## Procesos secundarios en segundo plano

- Se agregó una cola mediante activadores temporales de Google Apps Script.
- Historial, auditoría, alertas y notificaciones de cierre se procesan después de responder al navegador.
- Si no es posible crear el activador, el sistema usa una ejecución de respaldo para no perder el registro.

## Notificación automática de finalización

Al finalizar una ruta u operación, todos los Administradores reciben automáticamente un mensaje que incluye:

- nombre, correo e ID del usuario autenticado que envió la información;
- conductor y vehículo;
- ruta u operación;
- fecha y hora;
- base y dirección de cierre;
- distancia a la base y validación de geocerca;
- tipo de cierre, precisión GPS y observaciones.

## GPS y mapa

- Se añadieron filtros por estado: **Todos**, **En línea**, **Conduciendo**, **Sin GPS** e **Inactivos**.
- Los filtros por vehículos específicos se mantienen disponibles para Administradores y Supervisores.
- El mapa ahora intenta tres proveedores de baldosas: OpenStreetMap, CARTO y Esri.
- Se agregó redibujado automático al mostrar el módulo y una pantalla de error recuperable.
- Se corrigieron las capas de círculos de geocerca y su orden visual.

## Compatibilidad

Se mantienen los permisos por rol, validación QR, check-in, geocercas, cierre excepcional, auditoría, combustible y navegación por Google Maps o Waze.
