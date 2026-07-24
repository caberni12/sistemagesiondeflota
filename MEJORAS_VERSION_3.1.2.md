# Mejoras versión 3.1.2

- Acción independiente `guardarPuntoOperacion` para guardar la geocerca sin depender del formulario general de Empresa.
- Confirmación real en Google Sheets después de `SpreadsheetApp.flush()`.
- Respaldo del punto operacional en las propiedades del proyecto.
- Selección consistente de la empresa principal cuando existen registros duplicados.
- Asistente de un paso desde Operaciones: captura la ubicación actual, guarda la base y vuelve a abrir el inicio de operación.
- Diagnóstico y Operaciones leen la misma fuente de configuración.
- La asignación de rutas continúa independiente de la geocerca.
