# Sistema de Gestión de Flotas 3.12.1

## Fotografías de respaldo de rutas

- Se separó la acción **Tomar fotografía** de **Elegir desde galería**.
- El conductor puede tomar imágenes nuevas y añadir más desde la galería en el mismo respaldo.
- Se admiten hasta 6 fotografías por registro.
- La subida empieza inmediatamente y las imágenes se optimizan antes del envío.
- El contador muestra cuántas fotografías quedaron realmente cargadas.
- Todas las evidencias se visualizan mediante una galería numerada.
- Cada fotografía puede abrirse individualmente sin abandonar el módulo de rutas.
- Se mantiene la relación con ruta, conductor, usuario, fecha, observación y enlace de Drive.

## Compatibilidad

- En teléfonos, **Tomar fotografía** solicita la cámara trasera mediante `capture=environment`.
- En computador, esa misma acción abre el selector de archivos cuando no existe cámara compatible.
- La selección múltiple depende de las capacidades del navegador y funciona con navegadores modernos.
