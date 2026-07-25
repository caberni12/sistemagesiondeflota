# Sistema de Gestión de Flotas 3.12.0

## Rutas y asignaciones

- Evidencias fotográficas rápidas vinculadas a cada ruta.
- Hasta seis fotografías por envío.
- Optimización aproximada a 1280 px y calidad JPEG reducida para acelerar la subida.
- Registro de enlace de Drive, usuario, fecha y observación.
- Notificación a Administradores y Supervisores cuando el respaldo lo carga un Conductor.

## Alertas automáticas

- Motor para GPS ausente o impreciso, documentos, check-ins y mantenciones.
- Prevención de duplicados dentro del período de repetición configurado.
- Notificación interna al generar una alerta nueva.
- Cola silenciosa después de ubicaciones GPS y cambios en vehículos, documentos o mantenciones.
- Activador de respaldo cada cinco minutos.
- Botón manual `⚡ Revisar anomalías` en el módulo Alertas.

## Mapa en tiempo real

- Expansión a pantalla completa.
- Botón para restaurar el tamaño normal.
- Redibujado automático al cambiar de tamaño.
- Carga visual inmediata; los datos GPS se reciben después sin dejar la pantalla en blanco.

## Activación

Ejecute `actualizarSistema()` una vez después de instalar la actualización. Esto agrega las columnas de evidencia, actualiza permisos e instala el activador automático.
