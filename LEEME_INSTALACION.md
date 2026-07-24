# Corrección obligatoria 3.1.2 — Punto operacional

1. Reemplace los archivos de la versión anterior.
2. En Google Apps Script use todos los `.gs` numerados **o** solamente `Codigo_Completo.gs`. No combine ambas alternativas.
3. Ejecute `actualizarSistema()`. La actualización intentará restaurar automáticamente cualquier punto operacional guardado anteriormente.
4. Publique una nueva versión del despliegue web y copie la dirección terminada en `/exec` a `configuracion.js`.
5. Recargue con `Ctrl + F5`.
6. Ingrese como Administrador y abra **Operaciones**. Si la base sigue pendiente, estando físicamente en ella pulse **Configurar con mi ubicación**.
7. El mensaje de éxito debe indicar que el punto fue confirmado en la base central.

---

# Sistema de Gestión de Flotas 2.8.0 — carpeta única

## Flujo de la aplicación

1. `index.html` se utiliza para la preconfiguración automática inicial y, después, únicamente para iniciar sesión.
2. El acceso correcto abre `main.html`.
3. El botón hamburguesa muestra el menú.
4. Cada vista se carga desde la misma carpeta dentro de un solo iframe.

## Instalación del frontend en GitHub

1. Descomprima el ZIP.
2. Suba todos los archivos directamente a la raíz del repositorio.
3. No cree una carpeta `modulos` ni mueva las vistas.
4. Revise `configuracion.js` y confirme que `DIRECCION_APLICACION` contiene la dirección `/exec` del despliegue de Google Apps Script.
5. Active GitHub Pages desde la rama y carpeta raíz correspondientes.
6. Abra `index.html` desde la dirección publicada.

## Actualización de Google Apps Script

Puede utilizar una de estas alternativas:

### Alternativa A — archivos separados

Copie los archivos `.gs` numerados, incluidos `22_Checkin_Vehicular.gs` y `23_Permisos_Usuario.gs`, junto con `appsscript.json`.

### Alternativa B — archivo único

Copie únicamente `Codigo_Completo.gs` y `appsscript.json`.

No utilice `Codigo_Completo.gs` junto con los archivos `.gs` numerados, porque las funciones quedarían duplicadas.

## Pasos de actualización

1. Reemplace el código anterior.
2. Guarde el proyecto.
3. Ejecute `actualizarSistema()`.
4. Autorice los permisos solicitados.
5. Confirme que se creó la hoja `CHECKINS` y que `OPERACIONES` incluye `CHECKIN_ID` al final.
6. Publique una nueva versión del despliegue web.
7. Copie la nueva dirección `/exec` en `configuracion.js` cuando corresponda.
8. Realice una recarga completa del navegador con `Ctrl + F5`.


## Primera apertura y preconfiguración automática

- Cuando no existe ningún usuario con acceso, `index.html` muestra automáticamente el formulario de preconfiguración.
- El formulario crea la empresa y el primer Administrador.
- Al terminar, inicia la sesión y abre `main.html`.
- Complete esta configuración inmediatamente después de publicar el sistema.
- Cuando ya existe un usuario activo con contraseña, el formulario inicial deja de aparecer.

## Permisos personalizados sin bloquear usuarios

- Los permisos se cambian desde el módulo Usuarios.
- Puede mantener los permisos del rol o asignar permisos personalizados.
- El sistema conserva los permisos técnicos mínimos del panel y la conexión de sesión.
- Cambiar permisos no elimina la contraseña ni cierra las sesiones existentes.
- El último Administrador activo no puede ser degradado, desactivado ni eliminado.

## Comandos de voz en notificaciones

Desde Notificaciones puede usar los comandos: `leer notificaciones`, `marcar todas como leídas`, `crear notificación` y `detener lectura`. También puede dictar el título y el mensaje usando los botones de micrófono. El navegador solicitará permiso para usar el micrófono.

## Nuevos permisos

- `CHECKIN`: lectura y creación de inspecciones.
- `CHECKIN_APROBACIONES`: revisión por Administrador y Supervisor.

El perfil Conductor puede crear y consultar únicamente sus propias inspecciones. No puede aprobarlas.

## Regla para iniciar una operación

La operación exige un check-in que cumpla todas estas condiciones:

- Aprobado.
- Vigente.
- Sin utilizar.
- Correspondiente al mismo vehículo.
- Correspondiente al mismo conductor.

Una falla crítica no puede ser aprobada. Debe corregirse y registrarse una inspección nueva.


## Reparación del check-in 3.0.0

Después de copiar el backend, ejecute `actualizarSistema()`. Opcionalmente ejecute `repararModuloCheckin()` para comprobar la hoja `CHECKINS`.


## Colores personalizados 3.0.0

1. Ingrese con un Administrador.
2. Abra Configuración desde el menú hamburguesa.
3. Seleccione una paleta o configure cada color.
4. Revise la vista previa y el contraste.
5. Pulse Guardar colores del sistema.
6. Los cambios se aplican al acceso, main.html y todos los módulos.


## Punto operacional obligatorio 3.0.0

1. Ingrese como Administrador.
2. Abra Configuración desde el menú hamburguesa.
3. En Punto de inicio y finalización, seleccione la dirección o use su ubicación actual.
4. Defina los radios permitidos y la precisión máxima.
5. Guarde la configuración.
6. Los usuarios deberán permitir el GPS del navegador para iniciar y finalizar operaciones.
7. Las operaciones sin ruta regresan al mismo punto base; las rutas asignadas mantienen su destino y también deben retornar a la base para cerrar.


## Reparación integral 3.1.1

Después de reemplazar el frontend y Google Apps Script:

1. Ejecute `actualizarSistema()` en el editor de Apps Script.
2. Publique una versión nueva del despliegue web.
3. Ingrese como Administrador a **Configuración → Diagnóstico y reparación**.
4. Pulse **Reparar estructura** y luego **Revisar sistema**.
5. Puede asignar rutas inmediatamente. Configure el punto operacional antes de iniciar o finalizar operaciones, porque la geocerca no se aplica a la planificación de rutas.

La reparación reordena columnas por nombre, crea hojas faltantes, actualiza permisos y catálogos, reconstruye `GPS_ACTUAL` y verifica `CHECKINS`. No elimina registros.
