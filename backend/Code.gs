// EL CEREBRO DE NOVA MULTIVAL - API REST
// Compatible con las hojas actuales y con las funciones de grupos y tablón.

const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const APPS_HEADERS = ['Nombre', 'URL', 'Descripcion', 'Icono_URL', 'Grupo'];
const BOARD_HEADERS = ['ID', 'Tipo', 'Titulo', 'Mensaje', 'Imagen_URL', 'Link_URL', 'Fecha', 'Autor'];
const ANALYTICS_HEADERS = ['Fecha', 'Usuario', 'Evento', 'Aplicativo_ID', 'Aplicativo', 'Grupo', 'Duracion_Segundos', 'Vista', 'Sesion_ID', 'Detalle'];

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

    if (action === 'trackEvent') return output.setContent(JSON.stringify(trackEvent(data.eventData)));
    if (action === 'getAnalytics') return output.setContent(JSON.stringify(getAnalytics(data)));

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

  const role = userExists[headers.indexOf('Rol_Global')];
  const sessionToken = Utilities.getUuid();
  CacheService.getScriptCache().put('nova_session_' + sessionToken, JSON.stringify({
    usuario: clean_(userExists[idIndex]),
    rol: clean_(role)
  }), 21600);

  return {
    status: 'success',
    usuario: userExists[idIndex],
    correo: userExists[headers.indexOf('Correo')],
    rolGlobal: role,
    sessionToken: sessionToken,
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

function trackEvent(eventData) {
  const allowedEvents = ['session_start', 'session_end', 'view_open', 'app_open', 'app_close', 'app_usage', 'board_click'];
  const eventName = clean_(eventData && eventData.event);
  const user = clean_(eventData && eventData.usuario);
  if (!user || allowedEvents.indexOf(eventName) === -1) throw new Error('Evento de analítica no válido.');
  if (!isSessionAuthorized_(user, eventData && eventData.authToken)) throw new Error('La sesión de analítica no es válida.');

  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    const sheet = getAnalyticsSheet_();
    const headers = ensureHeaders_(sheet, ANALYTICS_HEADERS);
    const duration = Math.min(86400, Math.max(0, Math.round(Number(eventData.durationSeconds) || 0)));
    sheet.appendRow(buildRow_(headers, {
      Fecha: new Date(),
      Usuario: user,
      Evento: eventName,
      Aplicativo_ID: clean_(eventData.appId),
      Aplicativo: clean_(eventData.appName),
      Grupo: clean_(eventData.group),
      Duracion_Segundos: duration,
      Vista: clean_(eventData.view),
      Sesion_ID: clean_(eventData.sessionId),
      Detalle: clean_(eventData.detail)
    }));
    return { status: 'success' };
  } finally {
    lock.releaseLock();
  }
}

function getAnalytics(data) {
  const requestingUser = clean_(data && data.usuario);
  if (!isSessionAuthorized_(requestingUser, data && data.authToken) || !isAdministrator_(requestingUser)) throw new Error('No tienes permisos para consultar la analítica.');

  const days = Math.min(365, Math.max(7, Math.round(Number(data.days) || 30)));
  const now = new Date();
  const since = now.getTime() - (days * 86400000);
  const today = dateKey_(now);
  const sheet = getAnalyticsSheet_();
  const headers = ensureHeaders_(sheet, ANALYTICS_HEADERS);
  const rows = sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  const events = rows.map(function(row) {
    return {
      timestamp: normalizeDate_(row[headers.indexOf('Fecha')]),
      user: clean_(row[headers.indexOf('Usuario')]),
      event: clean_(row[headers.indexOf('Evento')]),
      appId: clean_(row[headers.indexOf('Aplicativo_ID')]),
      appName: clean_(row[headers.indexOf('Aplicativo')]),
      group: clean_(row[headers.indexOf('Grupo')]),
      durationSeconds: Math.max(0, Number(row[headers.indexOf('Duracion_Segundos')]) || 0),
      view: clean_(row[headers.indexOf('Vista')]),
      sessionId: clean_(row[headers.indexOf('Sesion_ID')]),
      detail: clean_(row[headers.indexOf('Detalle')])
    };
  }).filter(function(event) { return event.timestamp >= since && event.user && event.event; });

  const users = {};
  const activeToday = {};
  const applications = {};
  const viewTotals = {};
  const dailyMap = {};
  const chartDays = Math.min(days, 30);
  for (let offset = chartDays - 1; offset >= 0; offset--) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    const key = dateKey_(day);
    dailyMap[key] = { date: key, sessions: 0, usersMap: {}, uniqueUsers: 0, appOpens: 0, totalSeconds: 0 };
  }

  const summary = { sessions: 0, uniqueUsers: 0, activeToday: 0, appOpens: 0, totalSeconds: 0, boardClicks: 0 };
  events.forEach(function(event) {
    users[event.user] = true;
    const eventDay = dateKey_(new Date(event.timestamp));
    if (eventDay === today) activeToday[event.user] = true;
    const daily = dailyMap[eventDay];
    if (daily) daily.usersMap[event.user] = true;

    if (event.event === 'session_start') {
      summary.sessions++;
      if (daily) daily.sessions++;
    }
    if (event.event === 'app_open') {
      summary.appOpens++;
      if (daily) daily.appOpens++;
    }
    if (event.event === 'app_usage') {
      summary.totalSeconds += event.durationSeconds;
      if (daily) daily.totalSeconds += event.durationSeconds;
    }
    if (event.event === 'board_click') summary.boardClicks++;
    if (event.event === 'view_open' && event.view) viewTotals[event.view] = (viewTotals[event.view] || 0) + 1;

    if ((event.event === 'app_open' || event.event === 'app_usage') && event.appName) {
      const appKey = event.appId || event.appName;
      if (!applications[appKey]) applications[appKey] = { id: appKey, name: event.appName, group: event.group || 'Sin grupo', opens: 0, totalSeconds: 0, usersMap: {} };
      const app = applications[appKey];
      app.name = event.appName || app.name;
      app.group = event.group || app.group;
      app.usersMap[event.user] = true;
      if (event.event === 'app_open') app.opens++;
      if (event.event === 'app_usage') app.totalSeconds += event.durationSeconds;
    }
  });

  summary.uniqueUsers = Object.keys(users).length;
  summary.activeToday = Object.keys(activeToday).length;
  const daily = Object.keys(dailyMap).sort().map(function(key) {
    const item = dailyMap[key];
    item.uniqueUsers = Object.keys(item.usersMap).length;
    delete item.usersMap;
    return item;
  });
  const topApps = Object.keys(applications).map(function(key) {
    const app = applications[key];
    app.users = Object.keys(app.usersMap).length;
    delete app.usersMap;
    return app;
  }).sort(function(a, b) { return b.totalSeconds - a.totalSeconds || b.opens - a.opens; }).slice(0, 12);

  const viewLabels = { dashboard: 'Escritorio', analytics: 'Dashboard', catalog: 'Catálogo', addApp: 'Desplegar', users: 'Identidades' };
  const views = Object.keys(viewTotals).map(function(name) {
    return { name: name, label: viewLabels[name] || name, count: viewTotals[name] };
  }).sort(function(a, b) { return b.count - a.count; });

  const recent = events.sort(function(a, b) { return b.timestamp - a.timestamp; }).slice(0, 40);
  return { status: 'success', data: { generatedAt: Date.now(), periodDays: days, summary: summary, daily: daily, topApps: topApps, views: views, recent: recent } };
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

function getAnalyticsSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName('Analitica');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Analitica');
    sheet.getRange(1, 1, 1, ANALYTICS_HEADERS.length).setValues([ANALYTICS_HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm:ss');
  }
  return sheet;
}

function isAdministrator_(userId) {
  if (!userId) return false;
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Usuarios');
  if (!sheet || sheet.getLastRow() < 2) return false;
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();
  const idIndex = headers.indexOf('ID_Red');
  const roleIndex = headers.indexOf('Rol_Global');
  return rows.some(function(row) {
    return clean_(row[idIndex]).toUpperCase() === userId.toUpperCase() && clean_(row[roleIndex]).toLowerCase() === 'administrador';
  });
}

function isSessionAuthorized_(userId, sessionToken) {
  const token = clean_(sessionToken);
  if (!userId || !token) return false;
  const cached = CacheService.getScriptCache().get('nova_session_' + token);
  if (!cached) return false;
  try {
    const session = JSON.parse(cached);
    return clean_(session.usuario).toUpperCase() === clean_(userId).toUpperCase();
  } catch (error) {
    return false;
  }
}

// Puede ejecutarse manualmente una vez desde Apps Script antes de desplegar.
// También se ejecuta de manera implícita cuando llegan las primeras solicitudes.
function setupNovaSchema() {
  ensureHeaders_(getAppsSheet_(), APPS_HEADERS);
  ensureHeaders_(getBoardSheet_(), BOARD_HEADERS);
  ensureHeaders_(getAnalyticsSheet_(), ANALYTICS_HEADERS);
  return 'Esquema actualizado: Grupo, Tablero y Analitica disponibles.';
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

function dateKey_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone() || 'America/Bogota', 'yyyy-MM-dd');
}
