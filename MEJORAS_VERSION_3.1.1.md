# Mejoras versión 3.1.1 — Rutas independientes y GPS reparado

- Se restauró el bloque completo del filtro GPS perdido en la versión 3.1.0.
- Se corrigió `gpsFilterPayload is not defined` y las funciones asociadas del selector de vehículos.
- Asignar una ruta ya no exige geocerca, GPS ni punto operacional configurado.
- El origen de la ruta puede definirse manualmente; si existe una base operacional se usa como sugerencia editable.
- La geocerca continúa siendo obligatoria exclusivamente al iniciar y finalizar operaciones.
- El backend central y el modo local aplican la misma regla.
- La pantalla de Configuración aclara que la validación GPS no bloquea la planificación.
