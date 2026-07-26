# Actualización a Sistema de Gestión de Flotas web 3.13.3

1. Reemplace los archivos web por los de esta entrega.
2. Reemplace completamente el contenido de Google Apps Script por `Codigo_Completo.gs`.
3. Ejecute una vez `actualizarSistema()` y autorice los permisos.
4. Publique una nueva versión del despliegue web.
5. Abra la URL terminada en `/exec` y realice una recarga completa con `Ctrl + F5`.

## Regla de check-in diario

La vigencia se determina con la combinación exacta:

`FECHA_OPERATIVA + VEHICULO_ID + CONDUCTOR_ID`

Por lo tanto:

- Mismo conductor + mismo vehículo + mismo día: el check-in aprobado se reutiliza.
- Otro conductor en el mismo vehículo: debe realizar un check-in nuevo.
- Mismo conductor en otro vehículo: debe realizar un check-in nuevo.
- Día siguiente: debe realizar un check-in nuevo.

## Seguimiento

Al iniciar una ruta, el navegador solicitará ubicación. En la web, el envío funciona mientras el navegador mantenga activa la sesión y permita la geolocalización. Para seguimiento con pantalla apagada o aplicación cerrada debe utilizarse Android 1.5.6.
