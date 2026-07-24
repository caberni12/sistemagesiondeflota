# Pruebas de la versión 3.2.0

- Sintaxis validada en todos los JavaScript.
- Sintaxis validada en todos los archivos Google Apps Script.
- Verificada la presencia de las plantillas XLSX y CSV.
- Verificados encabezados obligatorios de Vehículos, Conductores y Documentos.
- Verificado el límite de 1.500 filas y el procesamiento masivo.
- Verificada la protección del punto operacional por rol en interfaz y servidor.
- Verificada la regla: Conductor dentro de base = cierre permitido.
- Verificada la regla: Conductor fuera de base = cierre bloqueado.
- Verificado el cierre excepcional de Administrador/Supervisor con motivo y auditoría.
- Verificado el registro asíncrono de IP en sesiones, conexiones y bitácora.
- Verificadas rutas de archivos con estructura de carpeta única.

Nota: la conexión final con el Google Sheets del usuario debe confirmarse tras publicar una nueva versión `/exec`, ya que este entorno no puede acceder a ese despliegue privado.
