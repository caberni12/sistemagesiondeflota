# Mejoras de la versión 2.4.0

## Arquitectura modular

- Menú principal independiente.
- Un único iframe activo para evitar consumo acumulado.
- Dieciséis archivos HTML de módulos independientes.
- Comunicación segura entre el menú y el módulo mediante `postMessage`.
- Cierre de sesión, cambio de tema, navegación y sincronización coordinados.
- El módulo anterior libera mapa, temporizadores, cámara y bloqueo de pantalla al salir.

## Ubicación en tiempo real

- `mapa.js` se carga únicamente en el módulo GPS.
- El mapa no se descarga en Panel, Vehículos, Conductores, Documentos ni otros módulos.
- Filtro para toda la flota o vehículos específicos.
- Búsqueda por patente, marca, modelo o conductor.
- Selección persistente para Administrador y Supervisor.
- Actualización de marcadores sin reconstruir el mapa.
- Las listas HTML solo se regeneran cuando cambian posiciones o conexiones.
- Intervalo equilibrado de 4 segundos y pausa ampliada en segundo plano.

## Google Apps Script

- Caché corta de `GPS_ACTUAL` durante 2 segundos.
- Caché corta de `CONEXIONES` durante 3 segundos.
- Invalidación inmediata de la caché después de guardar una posición o conexión.
- Metadatos de usuarios, conductores y vehículos almacenados temporalmente.
- Posición actual separada del historial GPS.

## Compatibilidad

- Conserva la base de datos existente.
- Conserva las claves de almacenamiento local de la versión anterior.
- Incluye archivos `.gs` separados y alternativa en un solo archivo.
- Diseño adaptable para computador, tableta y teléfono.
