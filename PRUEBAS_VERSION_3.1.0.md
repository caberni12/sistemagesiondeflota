> Nota: la versión 3.1.1 reemplaza la regla que bloqueaba la asignación de rutas sin punto operacional. La geocerca queda reservada al inicio y cierre de operaciones.

# Pruebas versión 3.1.1

## Validaciones automáticas

- Sintaxis de todos los archivos JavaScript.
- Sintaxis de todos los archivos Google Apps Script.
- Existencia de los renderizadores de rutas, notificaciones y alertas.
- Acciones de diagnóstico y reparación en frontend, backend central y modo local.
- Rutas de los módulos y recursos HTML.
- Validación de los 19 módulos del menú contra su archivo HTML y renderizador.
- Flujo local: configuración, vehículo, usuario, conductor, check-in, ruta, notificación, GPS, operación, alertas e historiales.
- Proyecto comprimido sin subcarpetas.

## Validaciones de seguridad

- La ruta no puede asignarse sin punto operacional.
- La operación no inicia sin check-in aprobado ni geocerca válida.
- La operación no finaliza fuera del punto de retorno.
- La reparación de estructura no borra registros.

- Resultado del flujo integral local: ruta Completada, 2 notificaciones, 2 eventos históricos, 1 posición GPS, 1 alerta y 1 operación.
