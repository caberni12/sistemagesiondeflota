# Cambios versión 3.14.0

## Permisos de usuario con checkbox persistente

- Cada vez que se abre la ventana de permisos se consulta nuevamente el usuario en el servidor.
- El servidor entrega una matriz booleana completa para todos los módulos y acciones.
- `true` se representa con el checkbox marcado.
- `false` se representa con el checkbox vacío.
- Se incluyen matrices separadas para permisos del rol, permisos personalizados y permisos efectivos.
- Después de guardar se vuelve a consultar la fila y se redibuja la matriz confirmada.
- El Administrador conserva todos los checkbox marcados y bloqueados contra reducción.
