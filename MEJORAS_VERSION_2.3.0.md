# Mejoras de velocidad y seguimiento — versión 2.3.0

## Sincronización GPS

- Consulta visible cada 3 segundos y consulta reducida cuando la pestaña queda en segundo plano.
- Cola de envío: si el teléfono entrega varias coordenadas mientras una solicitud sigue activa, se conserva únicamente la más reciente.
- La posición se envía primero; la conversión de coordenadas a dirección se prepara sin bloquear el guardado.
- La señal de conexión ya no se escribe con cada coordenada; se limita a intervalos controlados.
- Reintento progresivo cuando existe una falla temporal, evitando solicitudes superpuestas.

## Posición actual e historial

- Nueva hoja `GPS_ACTUAL`, con una sola fila vigente por vehículo, conductor o dispositivo.
- La hoja `GPS` continúa como historial, pero guarda puntos espaciados para reducir escrituras y crecimiento innecesario.
- Migración automática de las últimas posiciones existentes al ejecutar `actualizarSistema()`.

## Seguimiento selectivo

- Modo **Todos los vehículos**.
- Modo **Vehículos específicos**, con buscador, selección múltiple, selección total y limpieza.
- La preferencia queda guardada en el navegador.
- El servidor devuelve solo las ubicaciones y sesiones del alcance solicitado.

## Mapa

- Las baldosas del mapa permanecen cargadas durante las actualizaciones automáticas.
- Solo se redibujan los marcadores y sus datos, evitando parpadeos y recargas visuales.

## Actualización

1. Copie los archivos `.gs` actualizados al proyecto de Google Apps Script.
2. Ejecute `actualizarSistema()` una vez.
3. Publique una versión nueva de la aplicación web.
4. Publique juntos los archivos de la interfaz incluidos en este paquete.
