# Actualización del Sistema de Gestión de Flotas 3.12.0

## Instalación en Google Apps Script

1. Abra el proyecto de Google Apps Script del sistema.
2. Puede conservar la estructura modular y copiar los archivos `.gs`, o reemplazar el código por `Codigo_Completo.gs`.
3. Copie los archivos web actualizados: HTML, CSS y JavaScript.
4. Guarde el proyecto.
5. Ejecute manualmente una vez la función `actualizarSistema()` y autorice los permisos solicitados.
6. Publique una nueva versión del despliegue web.
7. En Android, abra el botón de configuración del login y guarde la nueva URL terminada en `/exec`.

## Evidencias fotográficas de rutas

- El Conductor, Supervisor o Administrador con permiso de actualización de rutas puede usar `📷 Cargar respaldo`.
- Se aceptan hasta seis fotografías por envío.
- Cada fotografía se reduce antes de enviarse para acelerar la carga.
- El archivo se guarda en la carpeta de fotos configurada en Drive.
- La ruta conserva enlace, fecha, usuario y observación.
- Cuando el Conductor carga evidencia, el sistema notifica a Administradores y Supervisores.

## Alertas automáticas

El motor revisa:

- Operaciones activas sin ubicación reciente.
- Precisión GPS superior al límite configurado.
- Check-ins bloqueados o con fallas críticas.
- Documentos vencidos o próximos a vencer.
- Mantenciones atrasadas o próximas.
- Fecha de próxima mantención registrada directamente en el vehículo.

La revisión se ejecuta en una cola silenciosa después de eventos relevantes y mediante un activador de respaldo cada cinco minutos. El mapa no espera el resultado del motor de alertas.

## Mapa en pantalla completa

En `Ubicación en tiempo real`, pulse `⛶ Pantalla completa`. El mismo botón cambia a `↙ Volver al tamaño normal`. También puede utilizar Escape en computador o el botón Atrás cuando la aplicación lo permita.
