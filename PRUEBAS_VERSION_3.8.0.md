# Pruebas — Sistema de Gestión de Flotas 3.8.0

## Validaciones realizadas

1. Sintaxis de `aplicacion.js`, `conexion.js`, `menu-principal.js` y `configuracion.js`.
2. Sintaxis del código consolidado de Google Apps Script.
3. Presencia del nuevo enrutamiento `resumenOperaciones`.
4. Compatibilidad del modo remoto y del modo local.
5. Inclusión de todas las operaciones activas aunque superen o queden fuera del historial reciente.
6. Límite del historial rápido entre 50 y 500 registros.
7. Eliminación de la consulta de check-ins durante la apertura del módulo.
8. Entrega del punto operacional dentro de la misma consulta.
9. Invalidación del resumen después de iniciar, finalizar, editar, eliminar o cambiar el punto operacional.
10. Búsqueda del historial por operación, patente, conductor, ruta y estado.
11. Conservación de permisos, GPS, geocerca y auditoría.

## Resultado

Las comprobaciones estáticas y funcionales locales finalizaron correctamente.

## Prueba de volumen de referencia

Se generó un conjunto sintético con:

- 2.000 operaciones;
- 500 vehículos;
- 500 conductores;
- 500 rutas;
- 2.000 check-ins.

La estructura anterior produjo aproximadamente **2.742.000 bytes**.  
La respuesta compacta produjo aproximadamente **455.000 bytes**.

Reducción de transferencia del escenario sintético: **83,4 %**.

Esta prueba mide estructura y volumen de respuesta; el tiempo real dependerá de la cantidad de filas, conexión y rendimiento de Google Apps Script.
