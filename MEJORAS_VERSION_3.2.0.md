# Sistema de Gestión de Flotas 3.2.0

## Seguridad del punto operacional
- El Conductor no puede crear, editar ni reemplazar el punto base.
- Solo Administrador y Supervisor pueden guardar el punto operacional.
- Cada cambio registra usuario, rol, fecha, IP y coordenadas anteriores/nuevas en auditoría.

## Finalización de operaciones
- El Conductor únicamente puede finalizar dentro del radio de la base asignada a la operación.
- Fuera de la base, el servidor rechaza al Conductor aunque manipule el navegador.
- Administrador o Supervisor pueden realizar un cierre excepcional fuera de la base.
- El cierre excepcional exige motivo de al menos 10 caracteres y registra GPS, precisión, distancia, usuario, rol, fecha e IP.
- Se crea historial `FIN_EXCEPCIONAL`, alerta y bitácora.

## Importación masiva
- Vehículos, Conductores y Documentos admiten XLSX o CSV.
- Hasta 1.500 filas en una sola solicitud y una sola escritura principal en Google Sheets.
- Vista previa, actualización de coincidencias y reporte de errores por fila.
- Plantillas oficiales con ejemplos, formato e instrucciones.

## Registro de IP
- La IP pública se consulta después del acceso, en segundo plano.
- Se guarda en SESIONES y CONEXIONES y se agrega a la bitácora.
- La falta de IP no bloquea el acceso ni las operaciones.
