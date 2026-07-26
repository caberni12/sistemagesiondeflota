# Pruebas versión 3.13.1

## Acceso predeterminado

1. Iniciar sesión como Administrador: debe aparecer `Conexiones en línea`.
2. Iniciar sesión como Supervisor sin permiso personalizado: el módulo no debe aparecer.
3. Iniciar sesión como Conductor sin permiso personalizado: el módulo no debe aparecer.
4. Intentar consultar la acción `connectionsOnline` sin `CONEXIONES:LEER`: el servidor debe responder `ACCESO_CONEXIONES_NO_AUTORIZADO`.

## Acceso delegado

1. Como Administrador, abrir Usuarios → Permisos.
2. Elegir un Supervisor o Conductor.
3. Seleccionar permisos personalizados.
4. Marcar `Ver` en `Conexiones en línea · acceso delegado`.
5. Guardar.
6. Confirmar que el módulo aparece en el entorno del usuario sin cerrar sesión, después del siguiente latido de conexión.
7. Retirar el permiso y confirmar que el módulo desaparece y que una vista abierta vuelve al Panel principal.
8. Revisar Auditoría: deben existir `OTORGAR_ACCESO_CONEXIONES` y `RETIRAR_ACCESO_CONEXIONES`.

## Mapa y filtros

- Validar colores verde y rojo por estado de señal.
- Probar fechas desde/hasta.
- Probar usuario, estado, GPS, vehículo, dispositivo, red, plataforma y precisión.
- Probar búsqueda general.
- Abrir pantalla completa y restaurar el mapa.
- Confirmar actualización automática sin recargar la página.

## GPS web

- Al iniciar sesión, el sistema debe solicitar ubicación cuando el navegador todavía no tiene permiso.
- Con permiso concedido, debe iniciar el seguimiento obligatorio automáticamente.
- El navegador debe registrar conexión y ubicación mientras la aplicación web permanezca abierta y autorizada.
- El seguimiento con la aplicación cerrada corresponde al servicio nativo de Android.
