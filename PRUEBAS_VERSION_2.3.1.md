# Pruebas realizadas — versión 2.3.1

## Sintaxis

- `aplicacion.js`: correcta.
- `conexion.js`: correcta.
- `mapa.js`: correcta.
- `configuracion.js`: correcta.
- `14_GPS.gs`: correcta.
- `21_Tiempo_Real_Rutas_y_Notificaciones.gs`: correcta.
- `Codigo_Completo.gs`: correcta.
- Llaves de `estilos.css`: balanceadas.

## Filtro de seguimiento

- Administrador: panel visible.
- Supervisor: panel visible.
- Conductor: panel global oculto.
- Cambio de toda la flota a vehículos seleccionados: correcto.
- Selección múltiple: correcta.
- Las posiciones permanecen sin cambios hasta presionar **Aplicar seguimiento**.
- Al aplicar dos vehículos, el mapa, las posiciones y las sesiones quedan limitados a esos dos vehículos.
- Búsqueda por nombre del conductor: correcta.
- Botón para deshacer cambios: habilitado únicamente cuando existen cambios pendientes.

## Seguridad y base local

- El Supervisor puede aplicar el filtro solicitado.
- El Conductor no puede forzar mediante parámetros la visualización de vehículos ajenos.
- La lista de selección incluye el último conductor conocido por vehículo.

## Diseño adaptable

- Prueba en escritorio: 1366 × 900.
- Prueba móvil: 390 × 844.
- Sin desbordamiento horizontal en móvil.
- Sin errores de JavaScript durante las pruebas.
