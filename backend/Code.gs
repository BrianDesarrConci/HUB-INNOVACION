// EL CEREBRO DE NOVA MULTIVAL - API REST
// Compatible con las hojas actuales y con las funciones de grupos y tablón.

const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const APPS_HEADERS = ['Nombre', 'URL', 'Descripcion', 'Icono_URL', 'Grupo'];
const BOARD_HEADERS = ['ID', 'Tipo', 'Titulo', 'Mensaje', 'Imagen_URL', 'Link_URL', 'Fecha', 'Autor'];

function doPost(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'login') return output.setContent(JSON.stringify(handleLogin(data)));
    if (action === 'getApps') return output.setContent(JSON.stringify(getApps()));
    if (action === 'addApp') return output.setContent(JSON.stringify(addApp(data.appData)));
    if (action === 'updateApp') return output.setContent(JSON.stringify(updateApp(data.appData)));
    if (action === 'deleteApp') return output.setContent(JSON.stringify(deleteApp(data.id)));
    if (action === 'checkAccess') return output.setContent(JSON.stringify(checkAccess(data)));
    if (action === 'getUsers') return output.setContent(JSON.stringify(getUsers()));

    if (action === 'getBoardPosts') return output.setContent(JSON.stringify(getBoardPosts()));
    if (action === 'addBoardPost') return output.setContent(JSON.stringify(addBoardPost(data.postData)));
    if (action === 'deleteBoardPost') return output.setContent(JSON.stringify(deleteBoardPost(data.id)));

    throw new Error('Acción no permitida.');
  } catch (error) {
    return output.setContent(JSON.stringify({ status: 'error', message: error.toString() }));
  }
}

function handleLogin(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Usuarios');
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();

  const idIndex = headers.indexOf('ID_Red');
  const passIndex = headers.indexOf('Password');
  const userExists = rows.find(row => String(row[idIndex]).toUpperCase() === String(data.usuario).toUpperCase());

  if (!userExists) return { status: 'error', message: 'Identidad no reconocida' };
  if (String(userExists[passIndex]) !== String(data.password)) return { status: 'error', message: 'Contraseña incorrecta' };

  return {
    status: 'success',
    usuario: userExists[idIndex],
    correo: userExists[headers.indexOf('Correo')],
    rolGlobal: userExists[headers.indexOf('Rol_Global')],
    roles: { generico: 'Lider' }
  };
}

function getApps() {
  const sheet = getAppsSheet_();
  const headers = ensureHeaders_(sheet, APPS_HEADERS);
  if (sheet.getLastRow() < 2) return { status: 'success', data: [] };

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  const apps = rows.map((row, index) => ({
    id: index + 1,
    nombre: row[headers.indexOf('Nombre')],
    url: row[headers.indexOf('URL')],
    desc: row[headers.indexOf('Descripcion')],
    icono: row[headers.indexOf('Icono_URL')] || '',
    grupo: row[headers.indexOf('Grupo')] || 'Sin grupo'
  })).filter(app => app.nombre);

  return { status: 'success', data: apps };
}

function addApp(appData) {
  if (!appData || !clean_(appData.nombre) || !clean_(appData.url) || !clean_(appData.grupo)) {
    throw new Error('Nombre, URL y grupo son obligatorios.');
  }

  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    const sheet = getAppsSheet_();
    const headers = ensureHeaders_(sheet, APPS_HEADERS);
    const values = buildRow_(headers, {
      Nombre: clean_(appData.nombre),
      URL: clean_(appData.url),
      Descripcion: clean_(appData.desc),
      Icono_URL: clean_(appData.icono),
      Grupo: clean_(appData.grupo)
    });
    sheet.appendRow(values);
    return { status: 'success' };
  } finally {
    lock.releaseLock();
  }
}

function updateApp(appData) {
  if (!appData || !appData.id || !clean_(appData.grupo)) throw new Error('Aplicativo o grupo no válido.');

  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    const sheet = getAppsSheet_();
    const headers = ensureHeaders_(sheet, APPS_HEADERS);
    const rowNumber = Number(appData.id) + 1;
    if (rowNumber < 2 || rowNumber > sheet.getLastRow()) throw new Error('El aplicativo ya no existe.');

    const row = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
    row[headers.indexOf('Nombre')] = clean_(appData.nombre);
    row[headers.indexOf('URL')] = clean_(appData.url);
    row[headers.indexOf('Descripcion')] = clean_(appData.desc);
    row[headers.indexOf('Icono_URL')] = clean_(appData.icono);
    row[headers.indexOf('Grupo')] = clean_(appData.grupo);
    sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
    return { status: 'success' };
  } finally {
    lock.releaseLock();
  }
}

function deleteApp(appId) {
  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    const sheet = getAppsSheet_();
    const rowNumber = Number(appId) + 1;
    if (rowNumber < 2 || rowNumber > sheet.getLastRow()) throw new Error('El aplicativo ya no existe.');
    sheet.deleteRow(rowNumber);
    return { status: 'success' };
  } finally {
    lock.releaseLock();
  }
}

function checkAccess(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Usuarios');
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();
  const idIndex = headers.indexOf('ID_Red');
  const stateIndex = headers.indexOf('Estado');
  const user = rows.find(row => String(row[idIndex]).toUpperCase() === String(data.usuario || '').toUpperCase());
  const state = user && stateIndex >= 0 ? String(user[stateIndex]).toLowerCase() : 'activo';
  const authorized = Boolean(user) && !['inactivo', 'bloqueado', 'suspendido'].includes(state);
  return { status: 'success', authorized: authorized };
}

function getUsers() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Usuarios');
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();

  const users = rows.map((row, index) => ({
    id: index + 1,
    idRed: row[headers.indexOf('ID_Red')],
    correo: row[headers.indexOf('Correo')],
    rol: row[headers.indexOf('Rol_Global')],
    estado: row[headers.indexOf('Estado')] || 'Activo'
  })).filter(user => user.idRed);

  return { status: 'success', data: users };
}

function getBoardPosts() {
  const sheet = getBoardSheet_();
  const headers = ensureHeaders_(sheet, BOARD_HEADERS);
  if (sheet.getLastRow() < 2) return { status: 'success', data: [] };

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  const posts = rows.map(row => ({
    id: row[headers.indexOf('ID')],
    type: row[headers.indexOf('Tipo')],
    title: row[headers.indexOf('Titulo')] || '',
    body: row[headers.indexOf('Mensaje')] || '',
    imageUrl: row[headers.indexOf('Imagen_URL')] || '',
    linkUrl: row[headers.indexOf('Link_URL')] || '',
    createdAt: normalizeDate_(row[headers.indexOf('Fecha')]),
    author: row[headers.indexOf('Autor')] || 'Administración'
  })).filter(post => post.id && post.type);

  posts.sort((a, b) => b.createdAt - a.createdAt);
  return { status: 'success', data: posts };
}

function addBoardPost(postData) {
  if (!postData || !postData.id || !postData.type) throw new Error('Publicación no válida.');

  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    const sheet = getBoardSheet_();
    const headers = ensureHeaders_(sheet, BOARD_HEADERS);
    const values = buildRow_(headers, {
      ID: clean_(postData.id),
      Tipo: clean_(postData.type),
      Titulo: clean_(postData.title),
      Mensaje: clean_(postData.body),
      Imagen_URL: clean_(postData.imageUrl),
      Link_URL: clean_(postData.linkUrl),
      Fecha: Number(postData.createdAt) || Date.now(),
      Autor: clean_(postData.author) || 'Administración'
    });
    sheet.appendRow(values);
    return { status: 'success' };
  } finally {
    lock.releaseLock();
  }
}

function deleteBoardPost(postId) {
  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    const sheet = getBoardSheet_();
    const headers = ensureHeaders_(sheet, BOARD_HEADERS);
    if (sheet.getLastRow() < 2) return { status: 'success' };

    const idColumn = headers.indexOf('ID') + 1;
    const ids = sheet.getRange(2, idColumn, sheet.getLastRow() - 1, 1).getDisplayValues();
    const index = ids.findIndex(row => String(row[0]) === String(postId));
    if (index >= 0) sheet.deleteRow(index + 2);
    return { status: 'success' };
  } finally {
    lock.releaseLock();
  }
}

function getAppsSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName('Aplicativos');
  if (!sheet) throw new Error('No existe la hoja Aplicativos.');
  return sheet;
}

function getBoardSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName('Tablon');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Tablon');
    sheet.getRange(1, 1, 1, BOARD_HEADERS.length).setValues([BOARD_HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Puede ejecutarse manualmente una vez desde Apps Script antes de desplegar.
// También se ejecuta de manera implícita cuando llegan las primeras solicitudes.
function setupNovaSchema() {
  ensureHeaders_(getAppsSheet_(), APPS_HEADERS);
  ensureHeaders_(getBoardSheet_(), BOARD_HEADERS);
  return 'Esquema actualizado: Grupo y Tablon disponibles.';
}

function ensureHeaders_(sheet, requiredHeaders) {
  const currentColumns = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, currentColumns).getDisplayValues()[0].map(String);

  requiredHeaders.forEach(header => {
    if (headers.indexOf(header) === -1) {
      const emptyIndex = headers.findIndex(currentHeader => !currentHeader);
      if (emptyIndex >= 0) {
        headers[emptyIndex] = header;
        sheet.getRange(1, emptyIndex + 1).setValue(header);
      } else {
        headers.push(header);
        sheet.getRange(1, headers.length).setValue(header);
      }
    }
  });
  return headers;
}

function buildRow_(headers, valuesByHeader) {
  return headers.map(header => Object.prototype.hasOwnProperty.call(valuesByHeader, header) ? valuesByHeader[header] : '');
}

function clean_(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

function normalizeDate_(value) {
  if (value instanceof Date) return value.getTime();
  const numericValue = Number(value);
  if (Number.isFinite(numericValue) && numericValue > 0) return numericValue;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : Date.now();
}
