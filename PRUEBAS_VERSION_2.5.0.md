# Pruebas realizadas — versión 2.5.0

- Verificación de sintaxis de todos los archivos JavaScript.
- Verificación de sintaxis de todos los archivos Google Apps Script como JavaScript compatible.
- Confirmación de que `index.html` no contiene menú, iframe ni vistas operacionales.
- Confirmación de que `main.html` contiene un solo iframe.
- Confirmación de que el botón hamburguesa abre y cierra el menú.
- Confirmación de rutas válidas para todas las vistas de ``.
- Confirmación de redirección de acceso a `main.html` después del inicio de sesión.
- Confirmación de redirección a `index.html` cuando no existe sesión o esta expira.
- Confirmación de que `mapa.js` se carga únicamente en `ubicacion-tiempo-real.html`.

## Observación del entorno de validación

La apertura automatizada con Chromium fue bloqueada por la política administrativa del entorno de ejecución. Por ello, la comprobación visual final debe realizarse al publicar el frontend, aunque las validaciones estáticas y de sintaxis sí fueron completadas.
