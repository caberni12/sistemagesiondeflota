# Pruebas versión 2.7.0 — Check-in vehicular

## Validaciones automáticas realizadas

### Flujo funcional en modo local

- Creación de administrador: correcta.
- Creación de vehículo y conductor: correcta.
- Check-in con los 16 puntos conformes: estado `Aprobado`.
- Consulta de check-ins disponibles: devuelve 1 inspección válida.
- Inicio sin `CHECKIN_ID`: rechazado con `CHECKIN_REQUERIDO`.
- Inicio con check-in aprobado: correcto.
- Consumo del check-in al iniciar: correcto; deja de aparecer como disponible.
- Check-in con falla leve: estado `Pendiente`.
- Check-in pendiente antes de revisión: no disponible para iniciar.
- Aprobación por supervisor/administrador: estado `Aprobado`.
- Check-in con falla crítica: estado `Bloqueado`.
- Intento de aprobar una falla crítica: rechazado con `CHECKIN_CRITICO_NO_APROBABLE`.

### Permisos por rol

- El Conductor visualiza el vehículo asociado a su ruta: correcto.
- Al crear, el sistema fuerza automáticamente el conductor asociado al usuario: correcto.
- El Conductor solo consulta sus propios check-ins: correcto.
- El Conductor no puede aprobar inspecciones: rechazado con `PERMISO_DENEGADO`.
- El Supervisor puede aprobar observaciones leves: correcto.

### Interfaz adaptable

Prueba realizada con viewport de teléfono de 390 × 844 píxeles:

- El módulo abre correctamente.
- Se muestran 16 controles de inspección.
- Se muestran 7 grupos de verificación.
- Desbordamiento horizontal de la página: 0 píxeles.
- Desbordamiento horizontal del modal: 0 píxeles.
- Errores JavaScript durante la prueba: ninguno.

### Validaciones estructurales

- Sintaxis de `aplicacion.js`: correcta.
- Sintaxis de `conexion.js`: correcta.
- Sintaxis de los archivos Google Apps Script: correcta.
- Los tres archivos HTML nuevos están en la raíz.
- El menú carga las tres nuevas vistas sin subcarpetas.
- La hoja `CHECKINS` está incluida en instalación, permisos y limpieza de datos.

## Limitación de la prueba

La ejecución real contra un despliegue publicado de Google Apps Script requiere publicar la nueva versión y autorizarla desde la cuenta propietaria. La lógica equivalente fue validada íntegramente con el backend local incluido.
