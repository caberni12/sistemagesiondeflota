# MEJORAS — Versión 3.2.1

## Punto operacional reconocido por el dispositivo

- El punto base confirmado se guarda en el almacenamiento local del dispositivo.
- Al iniciar sesión, el sistema consulta directamente el punto operacional antes de cargar Operaciones.
- Si Google Sheets responde con demora, la interfaz utiliza la última copia confirmada del dispositivo y evita alertas falsas.
- Cada dispositivo actualiza su copia local al conectarse.
- El servidor continúa siendo la autoridad para validar el inicio y la finalización.
- Conductores no pueden crear ni modificar el punto base.
- Administradores y Supervisores mantienen la autorización exclusiva para cambiarlo.
- El punto local no permite alterar coordenadas ni omitir la geocerca.
