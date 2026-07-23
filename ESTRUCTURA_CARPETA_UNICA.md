# Estructura de carpeta única

Esta versión no utiliza subcarpetas. Todos los archivos se encuentran en la raíz.

- `index.html`: acceso al sistema.
- `main.html`: panel contenedor.
- `panel-principal.html`, `rutas.html`, `ubicacion-tiempo-real.html` y las demás vistas: módulos independientes.
- `menu-principal.js`: abre las vistas directamente por nombre, sin el prefijo `modulos/`.
- `estilos.css`, `responsive.css`, `acceso.css` y `menu-principal.css`: estilos globales.
- `configuracion.js`, `conexion.js`, `aplicacion.js`, `mapa.js`, `acceso.js` y `menu-principal.js`: lógica del cliente.
- Archivos `.gs` numerados: backend recomendado para Google Apps Script.
- `Codigo_Completo.gs`: alternativa opcional; no debe usarse junto con los `.gs` numerados.

Todas las referencias relativas fueron adaptadas para funcionar desde la misma carpeta.
