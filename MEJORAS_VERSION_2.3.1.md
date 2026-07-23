# Mejoras del filtro de seguimiento — versión 2.3.1

## Panel Administrador y Supervisor

- El filtro de seguimiento se muestra únicamente a los perfiles **Administrador** y **Supervisor**.
- Permite cambiar entre **Todos los vehículos** y **Solo vehículos seleccionados**.
- Selección múltiple por casillas.
- Búsqueda por patente, marca, modelo o nombre del conductor.
- Botones para seleccionar toda la flota, limpiar, deshacer cambios y aplicar el seguimiento.
- El filtro se aplica al mapa, a la lista de últimas posiciones y a las sesiones visibles.
- La selección queda guardada en el navegador.

## Rendimiento

- Marcar varias casillas no dispara una consulta por cada clic.
- La actualización se realiza una sola vez al presionar **Aplicar seguimiento**.
- La sincronización automática continúa utilizando únicamente el filtro ya aplicado.

## Seguridad por rol

- El servidor acepta filtros globales únicamente para Administrador o Supervisor.
- El perfil Conductor mantiene la visualización limitada a sus propios datos autorizados.

## Actualización

1. Reemplace los archivos actualizados en Google Apps Script y en la interfaz web.
2. Ejecute `actualizarSistema()` una vez.
3. Publique una nueva versión de la aplicación web.
