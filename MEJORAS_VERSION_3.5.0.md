# Mejoras versión 3.5.0 — Carga rápida por memoria local

## Objetivo
Reducir el tiempo de apertura de los módulos y evitar recargar completamente el iframe al cambiar de opción.

## Cambios
- Un único iframe permanece activo durante toda la sesión.
- El menú cambia de módulo mediante navegación interna, sin volver a descargar `aplicacion.js`, `conexion.js`, estilos ni componentes comunes.
- Las respuestas de lectura se conservan en memoria y en `localStorage` por usuario/dispositivo.
- Los módulos pueden abrir con la última información disponible mientras la conexión central responde.
- Cada módulo incluye un botón **Sincronizar** y un indicador de última actualización.
- La sincronización invalida únicamente los datos relacionados con el módulo actual.
- Las escrituras invalidan automáticamente los recursos afectados.
- El GPS en tiempo real conserva su actualización especial y no utiliza posiciones antiguas como fuente oficial.
- Si falla la red, se mantiene la vista local en lugar de dejar el módulo vacío.

## Seguridad
La memoria local es solo una copia de lectura. Todas las creaciones, modificaciones, eliminaciones, inicios y cierres de operación continúan confirmándose en el servidor.
