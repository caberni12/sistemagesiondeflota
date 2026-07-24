# Mejoras versión 2.7.0 — Check-in vehicular

## Objetivo

Incorporar una inspección preoperacional obligatoria antes de iniciar una operación, con trazabilidad por vehículo y conductor.

## Nuevos módulos

1. **Check-in vehicular** (`checkin-vehicular.html`)
   - Selección de vehículo y conductor.
   - Registro de kilometraje y nivel de combustible o carga.
   - Lista de 16 verificaciones obligatorias.
   - Firma o nombre del conductor.
   - Evaluación automática al guardar.

2. **Aprobación de check-ins** (`checkin-aprobaciones.html`)
   - Disponible para Administrador y Supervisor.
   - Permite revisar observaciones leves.
   - Exige comentario para aprobar o rechazar.
   - No permite aprobar fallas críticas.

3. **Historial de check-in** (`checkin-historial.html`)
   - Consulta de inspecciones, resultados, vigencia y uso.
   - Búsqueda y exportación CSV.
   - Detalle completo de cada punto revisado.

## Reglas de seguridad

- Una inspección sin fallas queda **Aprobada** automáticamente.
- Una falla no crítica queda **Pendiente** de revisión.
- Una falla crítica queda **Bloqueada** y genera una alerta.
- El check-in aprobado tiene una vigencia de 12 horas.
- Solo puede utilizarse una vez.
- Debe corresponder al mismo vehículo y conductor de la operación.
- Una operación no puede iniciarse sin un check-in aprobado y vigente.

## Controles incluidos

- Documentación obligatoria.
- Luces e intermitentes.
- Frenos.
- Dirección.
- Neumáticos y rueda de repuesto.
- Espejos, parabrisas y vidrios.
- Cinturones y asientos.
- Bocina.
- Limpiaparabrisas.
- Aceite.
- Refrigerante.
- Fugas.
- Extintor.
- Botiquín.
- Herramientas y triángulos.
- Combustible o carga suficiente.

## Integración

- Nueva hoja `CHECKINS` en Google Sheets.
- Nuevo archivo backend `22_Checkin_Vehicular.gs`.
- Campo `CHECKIN_ID` agregado al final de la hoja `OPERACIONES` para conservar la compatibilidad con datos anteriores.
- Nuevos permisos `CHECKIN` y `CHECKIN_APROBACIONES`.
- Indicadores de check-ins aprobados y pendientes en el panel principal.
- Diseño adaptable para teléfonos, tabletas y escritorio.
