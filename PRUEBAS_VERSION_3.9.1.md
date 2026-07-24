# Pruebas recomendadas — versión 3.9.1

## 1. Sincronización de Combustible

1. Inicie sesión como Administrador o Supervisor.
2. Abra el módulo **Combustible**.
3. Confirme que inicialmente aparece vacío, de acuerdo con la carga manual.
4. Pulse **Sincronizar**.
5. Confirme que aparece el historial de cargas y se habilita **Registrar carga**.

## 2. Formulario de registro

1. Pulse **Registrar carga**.
2. Como Administrador, seleccione **Registro administrativo manual**.
3. Confirme que el selector de vehículos muestra patentes, marcas y modelos.
4. Confirme que el selector de conductores muestra sus nombres.
5. Seleccione una operación activa o una ruta asignada/en curso.
6. Confirme que vehículo y conductor se completan automáticamente como una combinación.
7. Registre una carga y verifique que se guarde correctamente.

## 3. Recuperación de catálogos

1. Sincronice Combustible.
2. Navegue por otros módulos y vuelva a Combustible.
3. Abra nuevamente **Registrar carga**.
4. Confirme que el formulario conserva o recupera silenciosamente los catálogos necesarios sin cargar los demás módulos.

## 4. Validación técnica

- Ejecutar `node --check` sobre todos los archivos JavaScript.
- Confirmar que `aplicacion.js` no utiliza directamente `batch.vehicles`, `batch.drivers`, `batch.operations`, `batch.routes` o `batch.loads` como arreglos sin extraer `rows`.
- Validar que todos los HTML referencien archivos con `v=3.9.1`.
- Probar la integridad del ZIP con `unzip -t`.
