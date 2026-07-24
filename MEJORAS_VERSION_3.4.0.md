# Mejoras versión 3.4.0

- El Administrador puede editar operaciones con trazabilidad completa.
- El Administrador puede eliminar lógicamente operaciones sin aprobación adicional.
- Toda edición y eliminación registra valores anteriores, valores nuevos, usuario, fecha, IP, motivo e historial.
- La eliminación de una operación activa libera vehículo y conductor y devuelve la ruta a estado Asignada.
- Kilometraje inicial y final son opcionales y nunca bloquean el cierre.
- Si el kilometraje final es menor que el inicial, el cierre se permite y el dato queda marcado para revisión.
- El Conductor puede finalizar su propia operación dentro de la base aun con permisos personalizados, siempre que cumpla la validación geográfica.
- Fuera de la base, el Conductor continúa bloqueado.
