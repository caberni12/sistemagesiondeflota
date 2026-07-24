# Pruebas recomendadas — versión 3.9.0

## 1. Inicio rápido y carga manual

1. Inicie sesión.
2. Abra Panel principal, Vehículos, Conductores, Operaciones y otros módulos.
3. Confirme que muestran “Módulo listo para sincronizar” y no datos.
4. Pulse **Sincronizar** en cada módulo y confirme que solo entonces aparecen sus datos.
5. Cambie entre módulos ya sincronizados y confirme que se abren inmediatamente durante esa sesión.
6. Cierre sesión, vuelva a entrar y confirme que vuelven a iniciar vacíos.

## 2. Operaciones

1. Sincronice Operaciones.
2. Inicie una operación válida.
3. Confirme que el modal se cierra y el sistema queda utilizable sin esperar una segunda carga completa.
4. Finalice la operación dentro de la base.
5. Confirme que el mensaje de éxito aparece de inmediato y la tabla se actualiza silenciosamente después.
6. Repita con GPS impreciso permitido y con cierre excepcional de Administrador o Supervisor.

## 3. Notificación a Administradores

1. Finalice una operación como Conductor.
2. Espere la ejecución del activador temporal y abra la cuenta de un Administrador.
3. Confirme que la notificación incluye usuario remitente, correo, conductor, vehículo, ruta, hora, base, distancia, validación y observaciones.
4. Confirme que todos los Administradores activos reciben una notificación individual.

## 4. GPS y filtros

1. Abra GPS en tiempo real; este módulo debe cargar automáticamente.
2. Pruebe los filtros Todos, En línea, Conduciendo, Sin GPS e Inactivos.
3. Combine cada estado con vehículos específicos.
4. Confirme que mapa, posiciones, sesiones y contadores usan el mismo filtro.
5. Recargue la página y confirme que la preferencia del filtro queda guardada.

## 5. Mapa

1. Confirme que aparecen las baldosas y la geocerca de la base.
2. Bloquee temporalmente un proveedor de mapas y confirme que se usa otro proveedor.
3. Cambie el tamaño de la ventana y vuelva al módulo; el mapa debe redibujarse.
4. Use acercar, alejar, centrar y seleccionar una ubicación.

## 6. Validación técnica

- Ejecutar `node --check` sobre los archivos JavaScript.
- Validar sintaxis de todos los módulos `.gs` y de `Codigo_Completo.gs`.
- Confirmar que `Codigo_Completo.gs` incluye `28_Procesos_Segundo_Plano.gs`.
- Probar el ZIP con `unzip -t`.
