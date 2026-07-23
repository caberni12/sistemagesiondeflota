# Estructura modular 2.5.0

## Flujo principal

1. `index.html` contiene exclusivamente la pantalla de inicio de sesión.
2. Después de validar las credenciales, el navegador redirige a `main.html`.
3. `main.html` valida nuevamente la sesión antes de mostrar el panel.
4. El botón hamburguesa abre el menú lateral.
5. Cada opción carga una sola vista desde `` dentro del iframe `marcoModulo`.
6. Al cambiar de opción, el iframe descarga el módulo anterior y libera sus procesos.
7. Si la sesión expira o se cierra, el sistema regresa a `index.html`.

## Archivos principales

- `index.html`: acceso únicamente.
- `acceso.css`: diseño del acceso.
- `acceso.js`: validación, autenticación y redirección.
- `main.html`: panel principal y contenedor de módulos.
- `menu-principal.css`: barra superior y menú hamburguesa.
- `menu-principal.js`: permisos, sesión y carga de vistas.
- `*.html`: vistas independientes.
- `aplicacion.js`: funcionamiento interno de cada vista.
- `mapa.js`: cargado solamente por Ubicación en tiempo real.

## Regla de rendimiento

Nunca se abren varios iframes simultáneamente. Solo existe un contenedor activo y cada módulo ejecuta únicamente sus propios procesos.
