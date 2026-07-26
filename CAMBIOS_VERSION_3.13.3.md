# Cambios versión web 3.13.3

## Flujo coordinado de rutas, operaciones, check-in y GPS

- **Iniciar ruta** exige un check-in aprobado del día para la combinación exacta **fecha + vehículo + conductor**.
- El mismo conductor puede reutilizar durante ese día su check-in para nuevas salidas con el mismo vehículo.
- Si cambia el conductor o cambia el vehículo, se exige un check-in nuevo.
- Al iniciar la ruta, el sistema activa el contexto de seguimiento GPS y guarda `RUTA_ID`, `OPERACION_ID`, `VEHICULO_ID`, `CONDUCTOR_ID` y `CHECKIN_ID`.
- Si existe una operación activa del mismo conductor y vehículo, la ruta se vincula automáticamente con ella.
- Si se inicia una operación con una ruta seleccionada, la operación activa también el seguimiento de esa ruta.
- Al completar o cancelar la ruta se elimina su contexto de seguimiento.
- Al finalizar una operación vinculada, la ruta se completa y su seguimiento queda desactivado.
- La última señal GPS actualiza la fecha `ULTIMA_UBICACION_EN` de la ruta.

## Corrección de fecha operativa

Se corrigió la interpretación de fechas `AAAA-MM-DD` para evitar que la zona horaria de Chile las desplazara al día anterior.

## Base de datos

`actualizarSistema()` agrega o verifica estas columnas:

- RUTAS: `CHECKIN_ID`, `GPS_SEGUIMIENTO_ACTIVO`, `SEGUIMIENTO_INICIADO_POR`, `ULTIMA_UBICACION_EN`.
- CHECKINS: `FECHA_OPERATIVA`.
- GPS y GPS_ACTUAL: `RUTA_ID`.
