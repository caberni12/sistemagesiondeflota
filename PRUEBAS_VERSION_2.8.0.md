# Pruebas versión 2.8.0

## Pruebas ejecutadas

- Validación de sintaxis de todos los archivos JavaScript.
- Validación de sintaxis de todos los archivos Google Apps Script numerados y del archivo único `Codigo_Completo.gs`.
- Simulación local de una instalación vacía y activación de la preconfiguración.
- Creación de empresa y primer Administrador.
- Comprobación de que la preconfiguración deja de aparecer después de crear el primer usuario.
- Inicio de sesión del Administrador.
- Creación de un Supervisor y asignación de permisos personalizados.
- Inicio de sesión del Supervisor después del cambio de permisos.
- Confirmación de que conserva el panel y su conexión de sesión.
- Confirmación de que los módulos no autorizados continúan bloqueados.
- Confirmación de que no obtiene lectura global de conexiones ni notificaciones por permisos técnicos.
- Protección del último Administrador activo.
- Verificación estática de controles, comandos permitidos, lectura en voz alta y dictado en Notificaciones.
- Verificación de rutas y recursos con todos los archivos en la raíz del proyecto.

## Resultado

Las pruebas de datos, permisos, sesión, sintaxis y estructura fueron satisfactorias. La apertura automatizada en Chromium fue bloqueada por la política del entorno, por lo que la autorización real del micrófono y el reconocimiento de voz deben comprobarse desde la dirección HTTPS publicada.
