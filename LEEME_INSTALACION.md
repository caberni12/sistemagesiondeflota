# Sistema de Gestión de Flotas 2.6.2 — carpeta única

Todos los archivos de esta entrega están en el mismo nivel. No existen subcarpetas.

Flujo principal:

1. `index.html`: inicio de sesión.
2. `main.html`: panel principal.
3. El botón hamburguesa carga cada vista HTML en el único iframe activo.
4. Las vistas, estilos, scripts, logotipo y archivos de Google Apps Script se encuentran en esta misma carpeta.

Para GitHub Pages, suba todos los archivos conservando sus nombres. Configure la publicación desde la raíz del repositorio.

> Importante: `Codigo_Completo.gs` es una alternativa al conjunto de archivos `.gs` numerados. No copie ambas modalidades al mismo proyecto de Google Apps Script. La opción recomendada es utilizar los archivos numerados.

---

## Flujo de uso

- Abra `index.html` para iniciar sesión.
- Después del acceso correcto, el sistema abre `main.html`.
- En `main.html`, pulse el botón `☰` para abrir el menú.
- Seleccione el módulo que desea utilizar.
- Solo se mantiene una vista activa dentro del iframe.

## Archivos del frontend

```text
index.html                 Inicio de sesión solamente
acceso.css                 Diseño del inicio de sesión
acceso.js                  Autenticación y redirección
main.html                  Panel principal protegido
menu-principal.css         Diseño del menú hamburguesa
menu-principal.js          Carga modular y control de sesión
configuracion.js           Dirección del servicio y parámetros
conexion.js                Comunicación con Google Apps Script
aplicacion.js              Lógica de las vistas
mapa.js                    Mapa del módulo de ubicación
estilos.css                Diseño de los módulos
                    Vistas independientes
```

## Instalación del backend

1. Cree o abra el proyecto de Google Apps Script.
2. Copie los archivos `.gs` del proyecto, conservando sus nombres.
3. Copie `appsscript.json` en el manifiesto del proyecto.
4. Ejecute `instalarSistema()` si es una instalación nueva.
5. Ejecute `prepararAccesoAdministrador()` para preparar o recuperar el acceso administrativo.
6. Implemente el proyecto como aplicación web.
7. Copie la dirección terminada en `/exec`.
8. Pegue esa dirección en `DIRECCION_APLICACION` dentro de `configuracion.js`.

## Publicación del frontend

La carpeta debe conservar su estructura completa. `main.html`, `index.html`, los archivos JavaScript y la carpeta `modulos` deben permanecer en el mismo nivel indicado en el proyecto.

## Actualización desde una versión anterior

1. Haga una copia de seguridad.
2. Reemplace el frontend completo por la versión 2.5.0.
3. Actualice los archivos `.gs`.
4. Ejecute `actualizarSistema()`.
5. Publique una nueva versión de la aplicación web.
6. No elimine las hojas existentes de Google Sheets.


## Corrección de recarga del login (2.6.2)

Esta versión centraliza la validación en `main.html`. Reemplace también `conexion.js`, `menu-principal.js`, `acceso.js`, `aplicacion.js`, `00_Configuracion.gs` y `03_Seguridad.gs`; luego publique una **nueva versión** del despliegue de Google Apps Script. No basta con guardar el proyecto: debe actualizar el despliegue `/exec`.
