# Mejoras versión 2.8.0

## Preconfiguración automática
- `index.html` detecta automáticamente cuando no hay usuarios.
- Se muestra un formulario de empresa y administrador inicial sin ejecutar funciones manuales.
- El sistema crea hojas, catálogos, empresa y administrador de forma idempotente.

## Permisos sin bloqueo
- Permisos personalizados por usuario, además de los permisos del rol.
- Permisos técnicos mínimos para mantener abierto el panel y la sesión.
- Protección del último administrador activo.
- Los cambios de permisos no cierran sesiones ni modifican contraseñas.

## Notificaciones por voz
- Lectura de notificaciones pendientes.
- Comandos permitidos: leer notificaciones, marcar todas como leídas, crear notificación y detener lectura.
- Dictado de título y mensaje en el formulario de envío.
- Ejecución limitada a comandos predefinidos.
