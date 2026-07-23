# Mejoras de la versión 2.5.0

- `index.html` quedó dedicado exclusivamente al inicio de sesión.
- Se creó `main.html` como panel principal protegido.
- La sesión se valida antes de cargar cualquier módulo.
- El menú lateral permanece cerrado y se abre desde el botón hamburguesa tanto en escritorio como en móvil.
- Las vistas se cargan individualmente dentro de un solo iframe.
- Los módulos incrustados ya no muestran un segundo formulario de acceso.
- Al expirar la sesión, el sistema vuelve automáticamente a `index.html`.
- El cierre de sesión se ejecuta directamente desde `main.html`.
- Se conservan los permisos por rol y la última vista autorizada.
- Ubicación en tiempo real continúa aislada del resto de los módulos.
