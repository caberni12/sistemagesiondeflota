# Sistema de Gestión de Flotas 3.12.0

## Carga rápida a Google Drive

- El módulo **Documentos** permite seleccionar una foto o un PDF dentro del formulario.
- Las fotos se envían automáticamente a la carpeta **FOTOS**.
- Los archivos PDF se envían automáticamente a la carpeta **PDF**.
- El módulo **Combustible** permite tomar o seleccionar una foto de la boleta.
- Las boletas se envían automáticamente a la carpeta configurada para comprobantes de combustible.
- La carga comienza apenas se selecciona el archivo; no espera a que se guarde el formulario.
- Las fotos mayores a 850 KB se optimizan en el navegador, con un máximo aproximado de 1600 píxeles, para acelerar el envío.
- El enlace de Google Drive queda guardado automáticamente en el registro.
- Cada subida registra usuario, fecha, archivo, módulo y tamaño en Auditoría.
- Se agregaron accesos directos para abrir las tres carpetas desde sus módulos.

## Carpetas integradas

- Fotos de documentos: `1lWKDp7E28XU2D45ihvZctIq29Ji_aoq9`
- PDF de documentos: `1_2TgmSkzhRzcOQvw0_-ZiHfLTdUuQD2M`
- Boletas de combustible: `1JE9_yNAo0gpCZ1CnAnXMN8bhNh6fZTPj`

## Requisito de publicación

La cuenta que publica y ejecuta Google Apps Script debe tener permiso de **Editor** en las tres carpetas. Después de reemplazar `Codigo_Completo.gs`, se debe crear una nueva versión del despliegue web para que la acción `subirArchivoDrive` quede disponible.
