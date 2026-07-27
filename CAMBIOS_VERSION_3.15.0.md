# Cambios versión 3.15.0

## Motor rápido

- Las consultas de lectura idénticas se agrupan para evitar solicitudes duplicadas.
- Un tiempo de espera agotado en Conexiones en línea ya no inicia cinco consultas de respaldo adicionales.
- La actualización continúa en segundo plano sin bloquear filtros, botones ni navegación.
- Conexiones en línea se actualiza cada 10 segundos cuando está visible y reduce actividad cuando la pestaña está oculta.

## Interfaz y filtros

- Los filtros se aplican inmediatamente sobre la colección disponible mientras el servidor se actualiza silenciosamente.
- La búsqueda por texto responde mientras se escribe y agrupa la consulta remota con una espera corta.
- Tabla, lista rápida y panel de seguimiento solo se reconstruyen cuando sus datos realmente cambian.
- Se evitan manejadores de eventos repetidos al actualizar el módulo.

## Mapa optimizado

- Las baldosas visibles se reutilizan durante el desplazamiento y ya no vuelven a descargarse en cada movimiento.
- El arrastre se procesa como máximo una vez por cuadro de animación.
- Marcadores, círculos y rastros no se reconstruyen si sus datos no cambiaron.
- Se mantiene el seguimiento individual, el centrado automático y el rastro de 40 posiciones.

## Servidor

- Las direcciones cacheadas se consultan en un solo lote.
- Se permiten como máximo dos geocodificaciones nuevas por respuesta, priorizando al usuario seguido y los equipos activos.
- El rastro del usuario seguido se conserva en caché y agrega cada nueva posición sin recorrer todo el historial GPS en cada actualización.
- `Codigo_Completo.gs` sigue siendo el servidor maestro autosuficiente.
