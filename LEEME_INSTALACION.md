# INSTALACIÓN — Sistema de Gestión de Flotas 3.2.0

## Estructura
Todos los archivos están en la raíz. No hay subcarpetas. Es compatible con GitHub Pages.

## Google Apps Script
Use solo una alternativa:
1. Copiar todos los archivos `.gs` numerados; o
2. Copiar únicamente `Codigo_Completo.gs`.

No combine ambas alternativas porque duplicará funciones.

## Actualización
1. Respalde el Google Sheets actual.
2. Reemplace los archivos web por esta versión.
3. Actualice Google Apps Script.
4. Ejecute `actualizarSistema()`.
5. Publique una nueva versión de la aplicación web.
6. Copie la dirección terminada en `/exec` en `configuracion.js`.
7. Recargue el navegador con `Ctrl + F5`.

## Punto operacional
Solo Administrador o Supervisor pueden configurarlo. Un Conductor no puede modificarlo. Todo cambio se registra en auditoría.

## Cierre de operación
- Conductor: solo dentro de la base asignada.
- Administrador/Supervisor: cierre normal en base o cierre excepcional fuera de base con motivo obligatorio.

## Importación masiva
En Vehículos, Conductores y Documentos use `Plantilla` o `Importación masiva`. Las plantillas XLSX y CSV están incluidas en esta misma carpeta.

## IP de conexión
La IP pública se registra en segundo plano. Si el navegador o la red bloquea el servicio externo, el sistema continúa funcionando y el campo queda vacío.
