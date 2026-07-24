# Mejoras versión 3.0.0 — Punto operacional y geocercas

- El Administrador configura un punto base oficial desde Configuración.
- Se guardan nombre, dirección, latitud, longitud, radio de inicio, radio de finalización y precisión GPS máxima.
- Ningún usuario puede iniciar una operación fuera del radio autorizado.
- Ningún usuario puede finalizar una operación fuera del punto de retorno.
- La validación se repite en el servidor; no depende únicamente de la interfaz.
- Sin ruta asignada, origen y destino corresponden al mismo punto base.
- Con ruta asignada, la ruta define el destino, pero la operación conserva el retorno obligatorio a la base.
- Al iniciar una operación con ruta, la ruta pasa a En curso y queda vinculada a la operación.
- Al finalizar correctamente en la base, la ruta vinculada pasa a Completada.
- Se guardan coordenadas, precisión y distancia al punto base tanto al iniciar como al finalizar.
- Se conserva la personalización completa de colores de la versión 2.9.0.
- Estructura de carpeta única, sin subcarpetas.
- Las operaciones activas creadas en versiones anteriores pueden finalizar usando el punto base configurado en la nueva versión.
