# Pruebas realizadas — versión 2.3.0

## Validaciones automáticas

- Sintaxis correcta en `configuracion.js`.
- Sintaxis correcta en `mapa.js`.
- Sintaxis correcta en `conexion.js`.
- Sintaxis correcta en `aplicacion.js`.
- Sintaxis correcta en `Codigo_Completo.gs`.

## Prueba funcional de seguimiento GPS

Se probó el módulo con datos simulados de dos vehículos:

- El modo **Todos los vehículos** muestra ambos vehículos.
- El modo **Vehículos específicos** permite seleccionar solo uno.
- El resumen muestra correctamente `1 seleccionado`.
- La selección queda guardada localmente para la siguiente apertura.
- La actualización automática modifica marcadores sin reconstruir el mapa completo.
- No se detectaron errores de JavaScript durante la prueba.

## Prueba responsive móvil

- El selector de vehículos funciona en pantalla móvil.
- No existe desbordamiento horizontal.
- Los controles se reorganizan correctamente.
- No se detectaron errores de JavaScript.

## Validación pendiente en el entorno real

La comunicación final con Google Sheets, Google Apps Script, permisos de ubicación, GPS en segundo plano y publicación del Web App debe probarse después de desplegar esta versión en la cuenta de Google del propietario, porque esos servicios externos no están disponibles dentro del entorno local de validación.
