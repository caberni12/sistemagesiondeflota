# Pruebas versión 2.6.2

## Resultados

- Sintaxis validada en todos los archivos JavaScript.
- Sintaxis validada en todos los módulos Google Apps Script y en `Codigo_Completo.gs`.
- Verificadas las referencias locales de `index.html`, `main.html` y las 16 vistas.
- Confirmado que todas las vistas incluyen `responsive.css` versión 2.6.2.
- Prueba aislada de sesión: un error `TIEMPO_DE_ESPERA_AGOTADO` conserva `main.html` y carga el módulo.
- Prueba aislada de sesión: dos confirmaciones `SESION_INVALIDA` consecutivas eliminan la sesión y regresan a `index.html`.
- Confirmado que el iframe no ejecuta nuevamente `status` y `me` durante su arranque; usa la sesión central aprobada por `main.html`.
- Confirmada renovación móvil de sesión por actividad durante 72 horas.

## Limitación de la validación

La apertura automatizada de Chromium fue bloqueada por la política del entorno (`ERR_BLOCKED_BY_ADMINISTRATOR`). Por ese motivo, la validación visual final debe realizarse en la URL publicada del proyecto.
