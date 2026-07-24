# Mejoras de la versión 3.3.0

## Geocerca visible
- El mapa de ubicación en tiempo real dibuja el círculo del radio autorizado alrededor del punto base.
- Si los radios de inicio y finalización son diferentes, se muestran ambos con estilos y etiquetas independientes.
- El ajuste automático del mapa considera también el tamaño completo de la geocerca.

## KPIs avanzados
- Nuevo panel analítico dentro de Reportes.
- Filtros por fecha inicial, fecha final, conductor y vehículo.
- Indicadores de operaciones, finalizadas, kilómetros, duración promedio, cierres excepcionales, cierres con GPS impreciso, check-ins bloqueados y rutas.
- Ranking de conductores y vehículos.
- Exportación CSV del resultado filtrado.

## WhatsApp
- Botón de WhatsApp en Conductores, Operaciones activas y Asignación de rutas.
- Mensaje editable antes de abrir la conversación.
- Normalización automática del número telefónico.

## Finalización con GPS impreciso
- El inicio de operación sigue exigiendo precisión GPS suficiente.
- La finalización puede aceptarse con baja precisión cuando el círculo de incertidumbre alcanza la geocerca.
- La tolerancia máxima está limitada a 500 metros.
- El Conductor continúa obligado a finalizar en la base; fuera de la tolerancia queda bloqueado.
- Administrador y Supervisor conservan el cierre excepcional fuera de base con motivo obligatorio.
- Los cierres con baja precisión quedan registrados en Operaciones, Historial, Alertas y Auditoría.
