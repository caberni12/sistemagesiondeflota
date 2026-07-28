# Actualización web 3.16.0

1. Sustituya completamente los archivos web anteriores.
2. Reemplace el proyecto de Apps Script por el nuevo `Codigo_Completo.gs`.
3. Ejecute:

   `actualizarSistema();`

4. Publique una nueva versión del despliegue.
5. Use exclusivamente la dirección terminada en `/exec`.
6. Recargue la web con `Ctrl + F5`.

El funcionamiento principal es en línea. Las posiciones, notificaciones, alertas, permisos y auditoría se almacenan en la base central.

Para obtener el menor retraso posible:

- el conductor debe mantener Internet y GPS de alta precisión activos;
- Android debe permitir ubicación todo el tiempo;
- debe instalarse Android 1.9.0;
- la web y Android deben usar la misma dirección `/exec`.
