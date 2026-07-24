# Sistema de Gestión de Flotas 3.9.1

## Corrección del módulo Combustible

- Se corrigió la lectura de las respuestas por lote utilizadas al sincronizar Combustible.
- Los catálogos de vehículos, conductores, operaciones y rutas ahora extraen correctamente la propiedad `rows` devuelta por Google Apps Script.
- Al pulsar **Registrar carga**, el formulario verifica que esos cuatro catálogos estén disponibles y consulta únicamente los que falten.
- Los selectores administrativos vuelven a mostrar la patente, marca y modelo de los vehículos, además del nombre de los conductores.
- Las operaciones activas y rutas asignadas o en curso vuelven a completar automáticamente el vehículo y el conductor enlazados.
- Se mantiene la regla de carga manual: el módulo abre vacío y consulta Google Sheets solamente al pulsar **Sincronizar**. La verificación adicional ocurre únicamente al abrir el formulario de combustible cuando falta algún catálogo.

## Caché del navegador

- La versión visible y los parámetros de los archivos estáticos se actualizaron a `3.9.1` para impedir que el navegador conserve el JavaScript defectuoso de la versión anterior.
- Después de publicar la actualización se recomienda recargar una vez con `Ctrl + F5`.
