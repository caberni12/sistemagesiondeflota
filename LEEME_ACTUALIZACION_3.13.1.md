# Actualización 3.13.1

1. En Google Apps Script, conserve `appsscript.json` y reemplace todo el código del servidor por el contenido de `Codigo_Completo.gs`.
2. No copie además los archivos modulares `.gs`, porque `Codigo_Completo.gs` ya contiene todo y duplicaría constantes y funciones.
3. Guarde el proyecto y ejecute una vez `actualizarSistema()`.
4. Cree una nueva versión del despliegue web y use la URL terminada en `/exec`.
5. Sustituya los archivos web y recargue con `Ctrl + F5`.

`Codigo_Completo.gs` es el archivo maestro autosuficiente del sistema.
