# Mejoras versión 2.6.2

## Sesión estable

- `main.html` es el único punto que valida la sesión al entrar.
- Los módulos del iframe reutilizan la sesión ya aprobada y no repiten `status` + `me` al cargarse.
- Un tiempo de espera, una caída de Internet o una respuesta lenta ya no devuelve al usuario al login.
- La sesión solo se elimina cuando el servidor confirma `SESION_INVALIDA`, `SESION_EXPIRADA`, `AUTENTICACION_REQUERIDA` o `USUARIO_DESHABILITADO`.
- Antes de cerrar por una respuesta de autenticación, `main.html` realiza una segunda comprobación.
- La sesión activa se renueva automáticamente y vence después de 72 horas sin actividad.

## Adaptación móvil

- Se conserva la hoja `responsive.css` global para acceso, panel, menú, módulos, tablas, formularios, mapas y modales.
- El menú hamburguesa funciona como panel lateral en teléfonos y tabletas.
- Solo se mantiene un iframe activo para reducir memoria y procesos.
