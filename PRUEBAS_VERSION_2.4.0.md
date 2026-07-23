# Pruebas realizadas — versión 2.4.0

## Validaciones completadas

- Sintaxis de todos los archivos JavaScript: correcta.
- Sintaxis de todos los archivos Google Apps Script: correcta.
- Sintaxis del archivo alternativo único: correcta.
- Un solo iframe en el menú principal: correcto.
- Dieciséis módulos HTML independientes: correctos.
- Rutas relativas de scripts, estilos e imágenes: correctas.
- Identificadores HTML duplicados: no encontrados.
- `mapa.js` presente únicamente en `ubicacion-tiempo-real.html`: correcto.
- Precarga general desactivada: correcto.
- Comunicación menú/módulo incluida: correcta.
- Liberación de recursos al cerrar un módulo: incluida.
- Caché e invalidación de GPS y conexiones: incluidas.
- Filtro GPS para Administrador y Supervisor: conservado.
- Archivos para vista móvil: incluidos.

## Limitación de la validación automática

El entorno de prueba bloqueó por política administrativa la apertura automatizada de direcciones locales en Chromium. Por esa razón, la validación automática se concentró en sintaxis, integridad de rutas, estructura HTML, separación de recursos y lógica de carga. Se recomienda realizar la prueba final en la dirección donde se publique el proyecto.
