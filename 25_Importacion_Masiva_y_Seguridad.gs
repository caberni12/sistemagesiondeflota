/** Importación masiva, registro de IP y reglas de seguridad adicionales. */

function normalizarIpPublica_(value) {
  const ip = String(value || '').trim().slice(0, 80);
  if (!ip) return '';
  // Admite IPv4 e IPv6. Se limita a caracteres válidos para evitar almacenar texto arbitrario.
  return /^[0-9a-fA-F:.]+$/.test(ip) ? ip : '';
}

function versionIp_(value) {
  const ip = normalizarIpPublica_(value);
  if (!ip) return '';
  return ip.indexOf(':') >= 0 ? 'IPv6' : 'IPv4';
}

function registrarIpConexion_(request, session) {
  const data = request.datos || request || {};
  const ip = normalizarIpPublica_(data.IP_PUBLICA || data.ipPublica || '');
  if (!ip) return ok_({ registrada:false, motivo:'IP_NO_DISPONIBLE' });
  const now = new Date();
  actualizarRegistro_('SESIONES', session.session.ID, {
    IP_PUBLICA: ip,
    IP_VERSION: versionIp_(ip),
    IP_CAPTURADA_EN: now,
    ULTIMO_USO: now
  });
  const deviceId = String(data.DISPOSITIVO_ID || '').slice(0, 120);
  const clientSessionId = String(data.SESION_CLIENTE_ID || '').slice(0, 120);
  listarRegistros_('CONEXIONES', {}).filter(function(row) {
    return row.SESION_ID === session.session.ID
      && (!deviceId || row.DISPOSITIVO_ID === deviceId)
      && (!clientSessionId || String(row.SESION_CLIENTE_ID || '') === clientSessionId);
  }).forEach(function(row) {
    actualizarRegistro_('CONEXIONES', row.ID, {
      IP_PUBLICA: ip,
      IP_VERSION: versionIp_(ip),
      IP_CAPTURADA_EN: now
    });
  });
  session.session.IP_PUBLICA = ip;
  session.session.IP_VERSION = versionIp_(ip);
  session.session.IP_CAPTURADA_EN = now;
  registrarBitacora_(session.user, 'REGISTRAR_IP', 'SEGURIDAD', session.session.ID, 'Dirección IP pública registrada al conectar', ip);
  return ok_({ registrada:true, ipVersion:versionIp_(ip), fecha:fechaIso_() });
}

const DEFINICIONES_IMPORTACION_MASIVA_ = Object.freeze({
  vehiculos: {
    sheet:'VEHICULOS', module:'VEHICULOS', prefix:'VEH',
    required:['PATENTE','MARCA','MODELO'],
    fields:['PATENTE','MARCA','MODELO','ANIO','COLOR','COMBUSTIBLE','VIN','KILOMETRAJE','ESTADO','QR_CODIGO','PROXIMA_MANTENCION'],
    key:function(row) { return 'PATENTE:' + String(row.PATENTE || '').replace(/[^A-Z0-9]/gi,'').toUpperCase(); }
  },
  conductores: {
    sheet:'CONDUCTORES', module:'CONDUCTORES', prefix:'CON',
    required:['NOMBRE','RUT'],
    fields:['NOMBRE','RUT','TELEFONO','CORREO','LICENCIA_CLASE','LICENCIA_VENCIMIENTO','ESTADO','USUARIO_ID'],
    key:function(row) { return 'RUT:' + String(row.RUT || '').replace(/[^0-9Kk]/g,'').toUpperCase(); }
  },
  documentos: {
    sheet:'DOCUMENTOS', module:'DOCUMENTOS', prefix:'DOC',
    required:['TIPO','ASOCIADO_TIPO','IDENTIFICACION','FECHA_VENCIMIENTO'],
    fields:['TIPO','ASOCIADO_TIPO','ASOCIADO_ID','IDENTIFICACION','FECHA_EMISION','FECHA_VENCIMIENTO','ESTADO','DIRECCION_ARCHIVO','OBSERVACIONES'],
    key:function(row) {
      return ['DOC',row.TIPO,row.ASOCIADO_TIPO,row.IDENTIFICACION,row.FECHA_VENCIMIENTO]
        .map(function(value){ return String(value || '').trim().toUpperCase(); }).join(':');
    }
  }
});

function normalizarCabeceraImportacion_(key) {
  return String(key || '').trim().toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function normalizarFilaImportacion_(input) {
  const row = {};
  Object.keys(input || {}).forEach(function(key) {
    const normalized = normalizarCabeceraImportacion_(key);
    if (normalized) row[normalized] = input[key];
  });
  return row;
}

function textoImportacion_(value) {
  return String(value == null ? '' : value).trim();
}

function validarFilaImportacion_(definition, row, lineNumber) {
  definition.required.forEach(function(field) {
    if (!textoImportacion_(row[field])) throw new Error('FILA_' + lineNumber + '_CAMPO_REQUERIDO_' + field);
  });
  if (definition.sheet === 'VEHICULOS') {
    row.PATENTE = textoImportacion_(row.PATENTE).toUpperCase();
    row.ESTADO = textoImportacion_(row.ESTADO) || 'Disponible';
    row.KILOMETRAJE = row.KILOMETRAJE === '' || row.KILOMETRAJE == null ? 0 : Number(row.KILOMETRAJE);
    if (!isFinite(row.KILOMETRAJE) || row.KILOMETRAJE < 0) throw new Error('FILA_' + lineNumber + '_KILOMETRAJE_INVALIDO');
    if (row.ANIO !== '' && row.ANIO != null) {
      row.ANIO = Number(row.ANIO);
      if (!isFinite(row.ANIO) || row.ANIO < 1900 || row.ANIO > 2200) throw new Error('FILA_' + lineNumber + '_ANIO_INVALIDO');
    }
    if (!textoImportacion_(row.QR_CODIGO)) row.QR_CODIGO = 'VEH-' + row.PATENTE.replace(/[^A-Z0-9]/g,'');
  }
  if (definition.sheet === 'CONDUCTORES') {
    row.NOMBRE = textoImportacion_(row.NOMBRE);
    row.RUT = textoImportacion_(row.RUT).toUpperCase();
    row.CORREO = textoImportacion_(row.CORREO).toLowerCase();
    row.ESTADO = textoImportacion_(row.ESTADO) || 'Disponible';
  }
  if (definition.sheet === 'DOCUMENTOS') {
    row.TIPO = textoImportacion_(row.TIPO);
    row.ASOCIADO_TIPO = textoImportacion_(row.ASOCIADO_TIPO);
    row.IDENTIFICACION = textoImportacion_(row.IDENTIFICACION).toUpperCase();
    row.ESTADO = textoImportacion_(row.ESTADO) || 'Vigente';
    if (['Vehículo','Conductor','Empresa'].indexOf(row.ASOCIADO_TIPO) < 0) throw new Error('FILA_' + lineNumber + '_ASOCIADO_TIPO_INVALIDO');
  }
  return row;
}

function resolverAsociacionDocumentoImportado_(row, context) {
  if (textoImportacion_(row.ASOCIADO_ID)) return row;
  if (row.ASOCIADO_TIPO === 'Vehículo') {
    const normalized = String(row.IDENTIFICACION || '').replace(/[^A-Z0-9]/gi,'').toUpperCase();
    const vehicle = context && context.vehicles ? context.vehicles[normalized] : listarRegistros_('VEHICULOS', {}).find(function(item) {
      return String(item.PATENTE || '').replace(/[^A-Z0-9]/gi,'').toUpperCase() === normalized;
    });
    if (!vehicle) throw new Error('VEHICULO_ASOCIADO_NO_ENCONTRADO_' + row.IDENTIFICACION);
    row.ASOCIADO_ID = vehicle.ID;
  } else if (row.ASOCIADO_TIPO === 'Conductor') {
    const normalized = String(row.IDENTIFICACION || '').replace(/[^0-9Kk]/g,'').toUpperCase();
    const driver = context && context.drivers ? context.drivers[normalized] : listarRegistros_('CONDUCTORES', {}).find(function(item) {
      return String(item.RUT || '').replace(/[^0-9Kk]/g,'').toUpperCase() === normalized;
    });
    if (!driver) throw new Error('CONDUCTOR_ASOCIADO_NO_ENCONTRADO_' + row.IDENTIFICACION);
    row.ASOCIADO_ID = driver.ID;
  } else {
    const company = context && context.company ? context.company : obtenerEmpresaPrincipal_();
    if (!company) throw new Error('EMPRESA_ASOCIADA_NO_ENCONTRADA');
    row.ASOCIADO_ID = company.ID;
  }
  return row;
}

function importarMasivoServicio_(request, session) {
  const resourceName = String(request.recurso || request.resource || '').trim();
  const definition = DEFINICIONES_IMPORTACION_MASIVA_[resourceName];
  if (!definition) throw new Error('RECURSO_IMPORTACION_NO_PERMITIDO');
  exigirPermiso_(session.user, definition.module, 'CREAR');
  const data = request.datos || request || {};
  const inputRows = Array.isArray(data.filas) ? data.filas : Array.isArray(request.filas) ? request.filas : [];
  const maximum = Number(CONFIGURACION_APLICACION.MAXIMO_FILAS_IMPORTACION || 1500);
  if (!inputRows.length) throw new Error('IMPORTACION_SIN_FILAS');
  if (inputRows.length > maximum) throw new Error('IMPORTACION_DEMASIADAS_FILAS');
  const updateExisting = String(data.actualizarExistentes || request.actualizarExistentes || 'SI') !== 'NO';
  if (updateExisting) exigirPermiso_(session.user, definition.module, 'ACTUALIZAR');

  asegurarHoja_(definition.sheet);
  const sheet = obtenerHoja_(definition.sheet);
  const headers = ESQUEMAS_APLICACION[definition.sheet];
  const lastRow = sheet.getLastRow();
  const physicalRows = lastRow > 1 ? sheet.getRange(2,1,lastRow-1,headers.length).getValues() : [];
  const objects = physicalRows.map(function(values) {
    const object = {};
    headers.forEach(function(header,index){ object[header] = values[index]; });
    return object;
  });
  const indexes = {};
  objects.forEach(function(row,index) {
    if (String(row.ELIMINADO || 'NO') === 'SI') return;
    const key = definition.key(row);
    if (key && !Object.prototype.hasOwnProperty.call(indexes, key)) indexes[key] = index;
  });

  const now = new Date();

  const associationContext = definition.sheet === 'DOCUMENTOS' ? {
    vehicles: listarRegistros_('VEHICULOS', {}).reduce(function(map, item) {
      map[String(item.PATENTE || '').replace(/[^A-Z0-9]/gi,'').toUpperCase()] = item; return map;
    }, {}),
    drivers: listarRegistros_('CONDUCTORES', {}).reduce(function(map, item) {
      map[String(item.RUT || '').replace(/[^0-9Kk]/g,'').toUpperCase()] = item; return map;
    }, {}),
    company: obtenerEmpresaPrincipal_()
  } : null;
  const seenInput = {};
  const errors = [];
  let inserted = 0, updated = 0, skipped = 0;
  inputRows.forEach(function(rawRow,index) {
    const line = index + 2;
    try {
      let row = normalizarFilaImportacion_(rawRow);
      const filtered = {};
      definition.fields.forEach(function(field) {
        if (Object.prototype.hasOwnProperty.call(row, field)) filtered[field] = row[field];
      });
      row = validarFilaImportacion_(definition, filtered, line);
      if (definition.sheet === 'DOCUMENTOS') row = resolverAsociacionDocumentoImportado_(row, associationContext);
      row = normalizarEntradaRecurso_(definition.sheet, row, session.user);
      const key = definition.key(row);
      if (!key || /:$/.test(key)) throw new Error('FILA_' + line + '_CLAVE_INVALIDA');
      if (seenInput[key]) throw new Error('FILA_' + line + '_DUPLICADA_EN_ARCHIVO');
      seenInput[key] = true;
      const existingIndex = Object.prototype.hasOwnProperty.call(indexes, key) ? indexes[key] : -1;
      if (existingIndex >= 0) {
        if (!updateExisting) { skipped += 1; return; }
        const current = objects[existingIndex];
        Object.keys(row).forEach(function(field) {
          if (headers.indexOf(field) >= 0 && ['ID','CREADO_EN','ELIMINADO'].indexOf(field) < 0) current[field] = row[field];
        });
        current.ACTUALIZADO_EN = now;
        current.ELIMINADO = 'NO';
        updated += 1;
      } else {
        const created = Object.assign({}, row, {
          ID: generarId_(definition.prefix),
          CREADO_EN: now,
          ACTUALIZADO_EN: now,
          ELIMINADO: 'NO'
        });
        objects.push(created);
        indexes[key] = objects.length - 1;
        inserted += 1;
      }
    } catch (error) {
      errors.push({ fila:line, error:String(error && error.message ? error.message : error) });
    }
  });

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const matrix = objects.map(function(object) {
      return headers.map(function(header) {
        return deserializarFecha_(Object.prototype.hasOwnProperty.call(object, header) ? object[header] : '');
      });
    });
    if (matrix.length) sheet.getRange(2,1,matrix.length,headers.length).setValues(matrix);
    SpreadsheetApp.flush();
    invalidarCacheHoja_(definition.sheet);
  } finally {
    lock.releaseLock();
  }
  const ip = normalizarIpPublica_(data.IP_PUBLICA || session.session.IP_PUBLICA || '');
  registrarBitacora_(session.user, 'IMPORTAR_MASIVO', definition.module, '', 'Importación masiva: ' + inserted + ' creados, ' + updated + ' actualizados, ' + skipped + ' omitidos, ' + errors.length + ' con error', ip);
  return ok_({
    recurso:resourceName,
    totalRecibidas:inputRows.length,
    creadas:inserted,
    actualizadas:updated,
    omitidas:skipped,
    errores:errors,
    correcto:errors.length === 0,
    serverTime:fechaIso_()
  });
}
