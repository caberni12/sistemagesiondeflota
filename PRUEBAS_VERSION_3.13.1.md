# Pruebas 3.13.1

- Verificar que `Codigo_Completo.gs` contenga `case 'resumenConexionesAdministrador'`.
- Verificar que contenga `function resumenConexionesAdministrador_`.
- Iniciar sesión como Administrador y confirmar `PERMISOS = ["*:*"]`.
- Abrir Conexiones en línea sin permiso personalizado adicional.
- Confirmar filtros por fecha, usuario, estado, GPS, vehículo, dispositivo, red, plataforma y precisión.
- Confirmar que un usuario no administrador sin `CONEXIONES:LEER` recibe acceso denegado.
- Otorgar `CONEXIONES:LEER` desde Administrador y comprobar que la vista aparece sin cerrar sesión.
