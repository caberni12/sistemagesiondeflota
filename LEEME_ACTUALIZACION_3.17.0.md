# Actualización web 3.17.0

1. Sustituya completamente los archivos web anteriores.
2. Reemplace el proyecto de Apps Script por el nuevo `Codigo_Completo.gs`.
3. Ejecute:

   `actualizarSistema();`

4. Publique una nueva versión del despliegue.
5. Use exclusivamente la dirección terminada en `/exec`.
6. Recargue la web con `Ctrl + F5`.
7. En Android, instale la versión 1.10.0 y configure la misma dirección `/exec`.

## Uso de los nuevos accesos QR

- En Combustible, pulse `Escanear QR para carga`.
- En Check-in vehicular, pulse `Escanear QR para revisión`.
- En Operaciones, continúe usando `Escanear QR` o `Validar QR e iniciar`.

El sistema funciona en línea contra Google Apps Script. Los permisos, asignaciones, inspecciones, cargas, tokens QR y eventos de auditoría se confirman en la base central.

