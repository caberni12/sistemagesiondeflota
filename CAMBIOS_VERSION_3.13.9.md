# Cambios versión 3.13.9

## Persistencia visible de check-in y permisos

- La lista de usuarios devuelve permisos personalizados como una matriz real, no como texto JSON.
- Al reabrir los permisos se visualizan exactamente las opciones guardadas.
- El servidor confirma la escritura de permisos leyendo nuevamente la fila de USUARIOS.
- El check-in se confirma mediante lectura directa y se vuelve visible inmediatamente en la tabla.
- La recarga de Check-in y Usuarios ahora se espera antes de mostrar el mensaje de éxito.
- Se conservan permisos universales del Administrador y restricciones por rol.
- Se corrigió una declaración duplicada en la validación de credenciales del archivo maestro.
