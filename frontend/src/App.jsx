import { useState, useEffect, useRef, useMemo } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Rnd } from "react-rnd";

/* ==========================================================================
   ÍCONOS (trazo fino, estilo SF Symbols)
   ========================================================================== */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' };

const IcoUser = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const IcoLock = ({ s = 18 }) => <svg width={s} height={s} {...S}><rect x="3" y="11" width="18" height="11" rx="2.5" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const IcoGrid = ({ s = 18 }) => <svg width={s} height={s} {...S}><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>;
const IcoDesktopIco = ({ s = 18 }) => <svg width={s} height={s} {...S}><rect x="2" y="3.5" width="20" height="14" rx="2.5" /><path d="M9 21h6M12 17.5V21" /></svg>;
const IcoPlus = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M12 5v14M5 12h14" /></svg>;
const IcoLogout = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>;
const IcoX = ({ s = 10 }) => <svg width={s} height={s} {...S} strokeWidth="2.4"><path d="M18 6 6 18M6 6l12 12" /></svg>;
const IcoMinus = ({ s = 10 }) => <svg width={s} height={s} {...S} strokeWidth="2.4"><path d="M5 12h14" /></svg>;
const IcoExpand = ({ s = 10 }) => <svg width={s} height={s} {...S} strokeWidth="2.2"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>;
const IcoEdit = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>;
const IcoTrash = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>;
const IcoSun = ({ s = 17 }) => <svg width={s} height={s} {...S}><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2M12 20v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M2 12h2M20 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5" /></svg>;
const IcoMoon = ({ s = 17 }) => <svg width={s} height={s} {...S}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;
const IcoWindows = ({ s = 17 }) => <svg width={s} height={s} {...S}><rect x="2.5" y="4" width="13" height="10" rx="2" /><rect x="8.5" y="10" width="13" height="10" rx="2" /></svg>;
const IcoFocus = ({ s = 17 }) => <svg width={s} height={s} {...S}><rect x="3" y="4" width="18" height="16" rx="2.5" /></svg>;
const IcoNotes = ({ s = 20 }) => <svg width={s} height={s} {...S}><path d="M14 2.5H6.5A2 2 0 0 0 4.5 4.5v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z" /><path d="M14 2.5V8h5.5M8.5 13h7M8.5 17h5" /></svg>;
const IcoCalc = ({ s = 20 }) => <svg width={s} height={s} {...S}><rect x="4.5" y="2.5" width="15" height="19" rx="3" /><path d="M8 6.5h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3.5M8 18.5h.01M12 18.5h.01" /></svg>;
const IcoSticky = ({ s = 20 }) => <svg width={s} height={s} {...S}><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9l-6 6H6a2 2 0 0 1-2-2z" /><path d="M20 14h-4a2 2 0 0 0-2 2v4" /></svg>;
const IcoSearch = ({ s = 18 }) => <svg width={s} height={s} {...S}><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.6-4.6" /></svg>;
const IcoClock = ({ s = 16 }) => <svg width={s} height={s} {...S}><circle cx="12" cy="12" r="9" /><path d="M12 7v5.2l3.4 2" /></svg>;
const IcoCal = ({ s = 16 }) => <svg width={s} height={s} {...S}><rect x="3" y="4.5" width="18" height="17" rx="2.5" /><path d="M8 2.5v4M16 2.5v4M3 10h18" /></svg>;
const IcoBell = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>;
const IcoCheck = ({ s = 11 }) => <svg width={s} height={s} {...S} strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>;
const IcoHistory = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 8v4.5l3.2 1.9" /></svg>;
const IcoChevron = ({ s = 14 }) => <svg width={s} height={s} {...S} strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>;
const IcoShield = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M12 2.5 4.5 6v6c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" /><path d="M9.2 12.2l2 2 3.6-3.8" /></svg>;
const IcoSliders = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>;
const IcoWidgets = ({ s = 16 }) => <svg width={s} height={s} {...S}><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="14" y="3" width="7" height="5" rx="1.6" /><rect x="14" y="11" width="7" height="10" rx="2" /><rect x="3" y="14" width="8" height="7" rx="2" /></svg>;
const IcoPlay = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="m8 5 11 7-11 7z" /></svg>;
const IcoPause = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M9 5v14M15 5v14" /></svg>;
const IcoRefresh = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M20 7v5h-5M4 17v-5h5" /><path d="M18.2 9A7 7 0 0 0 6.1 6.1L4 8M5.8 15A7 7 0 0 0 17.9 17.9L20 16" /></svg>;
const IcoChart = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /><path d="m3 7 6-4 6 7 6-5" /></svg>;
const IcoUsers = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IcoFolder = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h4l2 2H19a2 2 0 0 1 2 2v9.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" /><path d="M3 9h18" /></svg>;
const IcoKey = ({ s = 18 }) => <svg width={s} height={s} {...S}><circle cx="7.5" cy="15.5" r="4.5" /><path d="m11 12 9-9M15 8l3 3M17 6l2 2" /></svg>;
const IcoSwap = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M7 7h13l-3-3M17 17H4l3 3" /></svg>;
const IcoPulse = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M3 12h4l2.5-7 5 14 2.5-7h4" /></svg>;
const IcoLoginArrow = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="m10 17 5-5-5-5M15 12H3" /></svg>;
const IcoDownload = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14a2 2 0 0 0 2-2v-2M3 17v2a2 2 0 0 0 2 2" /></svg>;
const IcoRocket = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M14 5c2.8-2.8 5.4-2.2 6.7-1.7.5 1.3 1.1 3.9-1.7 6.7l-5.5 5.5-5-5z" /><path d="m13 6-5.5-.5L3 10l5.5.5M18 11l.5 5.5L14 21l-.5-5.5" /><circle cx="16.5" cy="7.5" r="1.5" /><path d="M7 14c-2.5.6-3.4 1.7-4 4 2.3-.6 3.4-1.5 4-4z" /></svg>;

/* ==========================================================================
   UTILIDADES
   ========================================================================== */
const getValidImageUrl = (url) => {
  if (!url) return '';
  const m = String(url).match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return m ? `https://drive.google.com/uc?export=view&id=${m[1]}` : url;
};

const normalizeExternalUrl = (value) => {
  if (!value) return '';
  try {
    const url = new URL(String(value).trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
};

const canonicalGroupName = (value, groups = []) => {
  const cleaned = String(value || '').trim();
  return groups.find(group => group.toLowerCase() === cleaned.toLowerCase()) || cleaned;
};

// Paleta desaturada estilo iconos macOS
const ICON_GRADIENTS = [
  'linear-gradient(150deg,#4F7CAC,#31527A)',
  'linear-gradient(150deg,#5C8D62,#33623C)',
  'linear-gradient(150deg,#8A7CB0,#574B80)',
  'linear-gradient(150deg,#C0904F,#8A5F2C)',
  'linear-gradient(150deg,#5F7E8C,#3A535E)',
  'linear-gradient(150deg,#A66E72,#75434A)',
  'linear-gradient(150deg,#6E7A93,#454E63)',
  'linear-gradient(150deg,#4E8F8B,#2C605E)',
];

const hashOf = (str = '') => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
};
const gradientFor = (name) => ICON_GRADIENTS[hashOf(name) % ICON_GRADIENTS.length];
const initialsOf = (name = '') => name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'A';
const dateKey = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatUsageTime = (seconds = 0) => {
  const totalSeconds = Math.max(0, Number(seconds) || 0);
  if (totalSeconds < 60) return `${Math.round(totalSeconds)} s`;
  if (totalSeconds < 3600) return `${Math.round(totalSeconds / 60)} min`;
  const hours = totalSeconds / 3600;
  return `${hours.toLocaleString('es-CO', { minimumFractionDigits: hours < 10 ? 1 : 0, maximumFractionDigits: 1 })} h`;
};

const isAppEnabled = app => String(app?.estado || 'Activo').trim().toLowerCase() !== 'inactivo';

const pdfSafeText = value => String(value ?? '')
  .normalize('NFC')
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201C\u201D]/g, '"')
  .replace(/[\u2013\u2014]/g, '-')
  .replace(/[^\x20-\xFF]/g, '?')
  .replace(/([\\()])/g, '\\$1');

const pdfWrap = (value, maxChars) => {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  words.forEach(word => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars) line = candidate;
    else { if (line) lines.push(line); line = word; }
  });
  if (line) lines.push(line);
  return lines.length ? lines : [''];
};

const buildPdfBlob = pageStreams => {
  const pageObjectIds = pageStreams.map((_, index) => 5 + index * 2);
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pageObjectIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageStreams.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  ];
  pageStreams.forEach((stream, index) => {
    const pageId = pageObjectIds[index];
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageId + 1} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([Uint8Array.from(pdf, character => character.charCodeAt(0) & 255)], { type: 'application/pdf' });
};

const downloadTeamManagementPdf = team => {
  const tasks = team.tasks || [];
  const members = team.members || [];
  const completed = tasks.filter(task => task.status === 'completada').length;
  const inProgress = tasks.filter(task => task.status === 'en_progreso').length;
  const pending = tasks.filter(task => task.status === 'pendiente').length;
  const today = dateKey();
  const overdue = tasks.filter(task => task.status !== 'completada' && task.dueDate && task.dueDate < today).length;
  const completion = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const generatedAt = new Date();
  const pages = [];
  const text = (commands, value, x, y, size = 10, bold = false, color = [0.12, 0.12, 0.14]) => {
    commands.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${color.join(' ')} rg ${x} ${y} Td (${pdfSafeText(value)}) Tj ET`);
  };
  const rect = (commands, x, y, width, height, color) => commands.push(`${color.join(' ')} rg ${x} ${y} ${width} ${height} re f`);
  const line = (commands, x1, y1, x2, y2, color = [0.88, 0.88, 0.9], width = 0.6) => commands.push(`${color.join(' ')} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
  const addHeader = (commands, pageNumber, section) => {
    rect(commands, 0, 826, 595, 16, [0.02, 0.55, 0.22]);
    text(commands, 'ÁGORA OS', 42, 791, 11, true, [0.15, 0.17, 0.33]);
    text(commands, section, 42, 768, 22, true, [0.08, 0.09, 0.14]);
    text(commands, `Informe de gestión · ${team.name}`, 42, 749, 9, false, [0.38, 0.39, 0.43]);
    line(commands, 42, 731, 553, 731);
    text(commands, `Generado ${generatedAt.toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })}`, 42, 24, 7.5, false, [0.48, 0.49, 0.53]);
    text(commands, `Documento ejecutivo · Página ${pageNumber}`, 431, 24, 7.5, false, [0.48, 0.49, 0.53]);
  };

  const overview = [];
  addHeader(overview, 1, 'Informe ejecutivo de equipo');
  text(overview, 'Líder responsable', 42, 700, 8, true, [0.38, 0.39, 0.43]);
  text(overview, `${team.leaderName || team.leaderId} · ${team.leaderId}`, 42, 684, 12, true);
  text(overview, 'Periodo del informe', 365, 700, 8, true, [0.38, 0.39, 0.43]);
  text(overview, 'Corte a la fecha', 365, 684, 12, true);

  const metrics = [
    ['CUMPLIMIENTO', `${completion}%`, `${completed} de ${tasks.length} finalizadas`, [0.91, 0.97, 0.92]],
    ['EN EJECUCIÓN', String(inProgress), `${pending} aún pendientes`, [0.92, 0.94, 0.98]],
    ['VENCIDAS', String(overdue), overdue ? 'Requieren seguimiento' : 'Cronograma al día', overdue ? [0.99, 0.92, 0.91] : [0.94, 0.96, 0.94]],
    ['PERSONAS', String(members.length), 'Capacidad registrada', [0.99, 0.97, 0.89]],
  ];
  metrics.forEach((metric, index) => {
    const x = 42 + index * 128;
    rect(overview, x, 594, 116, 67, metric[3]);
    text(overview, metric[0], x + 11, 642, 7, true, [0.38, 0.39, 0.43]);
    text(overview, metric[1], x + 11, 617, 20, true, [0.08, 0.09, 0.14]);
    text(overview, metric[2], x + 11, 602, 7.2, false, [0.38, 0.39, 0.43]);
  });

  text(overview, 'DISTRIBUCIÓN DEL TRABAJO', 42, 557, 8, true, [0.38, 0.39, 0.43]);
  const barTotal = Math.max(1, tasks.length);
  const barWidth = 511;
  let barX = 42;
  [[pending, [0.88, 0.64, 0.18]], [inProgress, [0.24, 0.34, 0.62]], [completed, [0.02, 0.55, 0.22]]].forEach(([count, color]) => {
    const width = barWidth * count / barTotal;
    if (width > 0) rect(overview, barX, 536, width, 12, color);
    barX += width;
  });
  text(overview, `Pendientes ${pending}`, 42, 518, 8.5);
  text(overview, `En progreso ${inProgress}`, 181, 518, 8.5);
  text(overview, `Completadas ${completed}`, 342, 518, 8.5);

  text(overview, 'CAPACIDAD Y CARGA ABIERTA', 42, 478, 8, true, [0.38, 0.39, 0.43]);
  const workload = members.map(member => {
    const assigned = tasks.filter(task => String(task.assignedTo).toUpperCase() === String(member.userId).toUpperCase());
    return { ...member, open: assigned.filter(task => task.status !== 'completada').length, done: assigned.filter(task => task.status === 'completada').length };
  }).sort((a, b) => b.open - a.open);
  const maxOpen = Math.max(1, ...workload.map(member => member.open));
  workload.slice(0, 7).forEach((member, index) => {
    const y = 449 - index * 35;
    text(overview, member.name || member.userId, 42, y, 9.5, true);
    text(overview, `${member.open} abiertas · ${member.done} completadas`, 250, y, 8, false, [0.38, 0.39, 0.43]);
    rect(overview, 410, y - 1, 120, 6, [0.91, 0.91, 0.93]);
    if (member.open) rect(overview, 410, y - 1, Math.max(7, 120 * member.open / maxOpen), 6, [0.02, 0.55, 0.22]);
    line(overview, 42, y - 12, 553, y - 12, [0.93, 0.93, 0.94], 0.4);
  });

  const heaviest = workload[0];
  text(overview, 'LECTURA PARA LA TOMA DE DECISIONES', 42, 190, 8, true, [0.38, 0.39, 0.43]);
  const insights = [
    overdue ? `${overdue} compromiso${overdue === 1 ? '' : 's'} vencido${overdue === 1 ? '' : 's'} requiere${overdue === 1 ? '' : 'n'} un acuerdo de recuperación.` : 'El cronograma no presenta compromisos vencidos.',
    heaviest?.open ? `${heaviest.name || heaviest.userId} concentra la mayor carga abierta con ${heaviest.open} tareas.` : 'No se registra concentración de carga abierta.',
    completion >= 80 ? 'El nivel de cumplimiento se encuentra en rango sobresaliente.' : completion >= 60 ? 'El cumplimiento es estable, con oportunidad de acelerar cierres.' : 'El cumplimiento requiere seguimiento prioritario del líder.',
  ];
  insights.forEach((insight, index) => {
    rect(overview, 42, 142 - index * 32, 8, 8, index === 0 && overdue ? [0.82, 0.24, 0.22] : [0.02, 0.55, 0.22]);
    text(overview, insight, 60, 141 - index * 32, 9);
  });
  pages.push(overview.join('\n'));

  const taskChunks = [];
  for (let index = 0; index < tasks.length; index += 10) taskChunks.push(tasks.slice(index, index + 10));
  if (!taskChunks.length) taskChunks.push([]);
  taskChunks.forEach((chunk, pageIndex) => {
    const commands = [];
    addHeader(commands, pageIndex + 2, 'Detalle de compromisos');
    text(commands, 'ESTADO', 42, 702, 7.5, true, [0.38, 0.39, 0.43]);
    text(commands, 'COMPROMISO Y RESPONSABLE', 126, 702, 7.5, true, [0.38, 0.39, 0.43]);
    text(commands, 'FECHA LÍMITE', 455, 702, 7.5, true, [0.38, 0.39, 0.43]);
    line(commands, 42, 692, 553, 692);
    if (!chunk.length) text(commands, 'El equipo aún no tiene tareas registradas.', 42, 650, 11, false, [0.38, 0.39, 0.43]);
    chunk.forEach((task, index) => {
      const y = 655 - index * 61;
      const statusLabel = TEAM_STATUS_LABELS[task.status] || task.status || 'Pendiente';
      const statusColor = task.status === 'completada' ? [0.02, 0.55, 0.22] : task.status === 'en_progreso' ? [0.24, 0.34, 0.62] : [0.74, 0.49, 0.08];
      rect(commands, 42, y - 5, 68, 19, [0.95, 0.95, 0.96]);
      text(commands, statusLabel.toUpperCase(), 49, y + 1, 6.8, true, statusColor);
      text(commands, task.title, 126, y + 7, 9.5, true);
      text(commands, `${task.assignedTo || 'Sin responsable'} · Prioridad ${task.priority || 'media'}`, 126, y - 9, 7.5, false, [0.38, 0.39, 0.43]);
      const description = pdfWrap(task.description || 'Sin descripción adicional.', 64)[0];
      text(commands, description, 126, y - 23, 7, false, [0.48, 0.49, 0.53]);
      text(commands, task.dueDate ? new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('es-CO') : 'Sin fecha', 455, y + 1, 8.5, true, task.dueDate && task.dueDate < today && task.status !== 'completada' ? [0.82, 0.24, 0.22] : [0.12, 0.12, 0.14]);
      line(commands, 42, y - 38, 553, y - 38, [0.92, 0.92, 0.93], 0.4);
    });
    pages.push(commands.join('\n'));
  });

  const blob = buildPdfBlob(pages);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `Informe_Gestion_${String(team.name || 'Equipo').replace(/[^a-zA-Z0-9À-ÿ_-]+/g, '_')}_${today}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
};

const DAILY_CORPORATE_MESSAGES = [
  'Cada avance de hoy fortalece los resultados de mañana.',
  'Las grandes transformaciones comienzan con decisiones claras.',
  'Innovar es convertir las ideas en valor para todos.',
  'El trabajo en equipo convierte los retos en oportunidades.',
  'La excelencia se construye con constancia, enfoque y propósito.',
  'Cada proceso que mejoramos impulsa a toda la organización.',
  'Las mejores soluciones nacen de escuchar, colaborar y actuar.',
  'Hoy es una nueva oportunidad para generar impacto.',
  'El compromiso de cada persona fortalece nuestro futuro.',
  'Avanzamos cuando compartimos conocimiento y construimos juntos.',
  'La innovación cobra valor cuando mejora la experiencia de las personas.',
  'Las metas importantes se alcanzan un paso a la vez.',
  'Una organización que aprende es una organización que evoluciona.',
  'Nuestro talento transforma desafíos en resultados.',
  'Cada idea puede abrir una nueva forma de avanzar.',
  'La disciplina convierte la visión en resultados sostenibles.',
  'Crecer juntos es la mejor manera de llegar más lejos.',
  'Los resultados extraordinarios nacen de acciones consistentes.',
  'Mejorar cada día también es una forma de innovar.',
  'La colaboración multiplica el valor de nuestras capacidades.',
  'El futuro se construye con las decisiones que tomamos hoy.',
  'Cuando el propósito es claro, cada esfuerzo suma.',
  'La confianza y el compromiso hacen posibles grandes resultados.',
  'Cada reto es una oportunidad para fortalecer lo que somos.',
  'Pensar diferente nos permite avanzar de manera inteligente.',
  'La calidad empieza en cada detalle y se refleja en cada resultado.',
  'El conocimiento compartido impulsa el crecimiento colectivo.',
  'Nuestra mejor ventaja es la capacidad de aprender y adaptarnos.',
  'Las ideas se convierten en progreso cuando las llevamos a la acción.',
  'Trabajar con propósito transforma tareas en resultados.',
  'Juntos hacemos que la innovación suceda.',
];

const dailyCorporateMessage = (date) => {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return DAILY_CORPORATE_MESSAGES[dayNumber % DAILY_CORPORATE_MESSAGES.length];
};

const TASK_COLORS = [
  { id: 'navy', label: 'Azul', hex: '#25294F' },
  { id: 'green', label: 'Verde', hex: '#3D8A44' },
  { id: 'amber', label: 'Amarillo', hex: '#E0A32E' },
  { id: 'red', label: 'Rojo', hex: '#D9534F' },
];

const ACCENT_COLORS = [
  { id: 'green', label: 'Verde', hex: '#3D8A44' },
  { id: 'navy', label: 'Azul', hex: '#3F4A8A' },
  { id: 'gold', label: 'Dorado', hex: '#C18D20' },
  { id: 'violet', label: 'Violeta', hex: '#7554A6' },
  { id: 'teal', label: 'Turquesa', hex: '#267F83' },
  { id: 'coral', label: 'Coral', hex: '#B65F56' },
  { id: 'sky', label: 'Cielo', hex: '#427AA1' },
];

const WALLPAPER_OPTIONS = [
  { id: 'aurora', label: 'Aurora', detail: 'Orgánico y suave' },
  { id: 'neural', label: 'Red neuronal', detail: 'IA e innovación' },
  { id: 'minimal', label: 'Minimal', detail: 'Enfoque limpio' },
  { id: 'depth', label: 'Profundidad', detail: 'Color inmersivo' },
  { id: 'horizon', label: 'Horizonte', detail: 'Calma ejecutiva' },
  { id: 'prism', label: 'Prisma', detail: 'Innovación luminosa' },
  { id: 'graphite', label: 'Grafito', detail: 'Precisión sobria' },
];

const APPEARANCE_SCENES = [
  { id: 'executive', label: 'Junta ejecutiva', detail: 'Sobrio, nítido y estratégico', theme: 'light', settings: { wallpaper: 'graphite', accent: 'navy', contrast: 'high', transparency: 'solid', density: 'balanced', shape: 'soft', motion: 'full', dockScale: 'normal' } },
  { id: 'innovation', label: 'Innovación', detail: 'Color, profundidad y energía', theme: 'light', settings: { wallpaper: 'prism', accent: 'teal', contrast: 'balanced', transparency: 'glass', density: 'comfortable', shape: 'rounded', motion: 'full', dockScale: 'large' } },
  { id: 'focus', label: 'Enfoque', detail: 'Mínimo ruido, máxima claridad', theme: 'light', settings: { wallpaper: 'minimal', accent: 'green', contrast: 'balanced', transparency: 'solid', density: 'compact', shape: 'soft', motion: 'reduced', dockScale: 'compact' } },
  { id: 'night', label: 'Dirección nocturna', detail: 'Grafito inmersivo y elegante', theme: 'dark', settings: { wallpaper: 'depth', accent: 'gold', contrast: 'high', transparency: 'glass', density: 'balanced', shape: 'rounded', motion: 'full', dockScale: 'normal' } },
];

const DEFAULT_APPEARANCE = {
  wallpaper: 'aurora',
  accent: 'green',
  contrast: 'balanced',
  transparency: 'glass',
  clockStyle: 'minimal',
  clockFormat: '24',
  density: 'balanced',
  shape: 'soft',
  motion: 'full',
  dockScale: 'normal',
};

const WIDGET_CATALOG = [
  { id: 'pomodoro', label: 'Tiempo de enfoque', detail: 'Temporizador con duración ajustable', icon: IcoClock },
  { id: 'quick-note', label: 'Nota rápida', detail: 'Un espacio para guardar ideas al instante', icon: IcoNotes },
  { id: 'productivity', label: 'Productividad', detail: 'Resumen visual de tus tareas completadas', icon: IcoCheck },
  { id: 'upcoming', label: 'Próxima agenda', detail: 'Tareas programadas para los siguientes días', icon: IcoCal },
  { id: 'shortcuts', label: 'Herramientas rápidas', detail: 'Acceso directo a las utilidades del sistema', icon: IcoGrid },
  { id: 'activity', label: 'Mi actividad', detail: 'Aplicaciones abiertas y accesos recientes', icon: IcoHistory },
];

const BOARD_TYPES = [
  { id: 'comunicado', label: 'Comunicado', detail: 'Novedades y anuncios internos', icon: IcoBell },
  { id: 'banner', label: 'Banner gráfico', detail: 'Imagen completa de ancho total', icon: IcoGrid },
  { id: 'incidencia', label: 'Incidencia', detail: 'Alertas operativas importantes', icon: IcoShield },
];

const TEAM_TASK_COLUMNS = [
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'en_progreso', label: 'En progreso' },
  { id: 'completada', label: 'Completadas' },
];

const TEAM_STATUS_LABELS = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
};

const DEFAULT_BOARD_POSTS = [{
  id: 'welcome-board',
  type: 'comunicado',
  title: 'Actualización de políticas de teletrabajo',
  body: 'Los nuevos lineamientos ya están publicados en el portal de Gestión de Personas.',
  imageUrl: '',
  linkUrl: '',
  createdAt: Date.now(),
  author: 'Gestión Administrativa',
}];

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxYszzacLW5AbwolurkZFX2_lq_m2qk3JDWokDpo_DitmquPojP-KGmllamG0xayGlabA/exec';

const SYSTEM_APPS = [
  { sys: 'notes', nombre: 'Notas', grad: 'linear-gradient(150deg,#E8C766,#C9A23B)', icon: IcoNotes, w: 720, h: 520 },
  { sys: 'calculator', nombre: 'Calculadora', grad: 'linear-gradient(150deg,#7C7C86,#4A4A52)', icon: IcoCalc, w: 340, h: 560 },
  { sys: 'todo', nombre: 'Post-its', grad: 'linear-gradient(150deg,#6E9BD1,#3E6BA0)', icon: IcoSticky, w: 440, h: 620 },
  { sys: 'converter', nombre: 'Conversor', grad: 'linear-gradient(150deg,#5F8F91,#315E63)', icon: IcoSwap, w: 520, h: 480 },
  { sys: 'passwords', nombre: 'Clave segura', grad: 'linear-gradient(150deg,#6271A7,#343F73)', icon: IcoKey, w: 520, h: 470 },
  { sys: 'stopwatch', nombre: 'Cronómetro', grad: 'linear-gradient(150deg,#C17B5E,#7C4937)', icon: IcoClock, w: 500, h: 520 },
];
const COMPACT_SYSTEM_TOOLS = new Set(['calculator', 'converter', 'passwords', 'stopwatch']);

/* ==========================================================================
   ÍCONO DE APLICACIÓN (squircle)
   ========================================================================== */
const AppIcon = ({ app, size = 58 }) => {
  const iconUrl = app.icono ? getValidImageUrl(app.icono) : '';
  const SysIcon = app.sysIcon;
  return (
    <div
      className="app-icon"
      style={{
        width: size, height: size,
        background: iconUrl ? '#fff' : (app.grad || gradientFor(app.nombre || 'App')),
      }}
    >
      {iconUrl
        ? <img src={iconUrl} alt={app.nombre} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        : SysIcon
          ? <SysIcon s={Math.round(size * 0.46)} />
          : <span className="app-icon-letter" style={{ fontSize: Math.round(size * 0.36) }}>{initialsOf(app.nombre)}</span>}
    </div>
  );
};

const AppGroupPicker = ({ value, onChange, groups, compact = false }) => {
  const [open, setOpen] = useState(false);
  const query = String(value || '').trim();
  const filteredGroups = groups.filter(group => group.toLowerCase().includes(query.toLowerCase()));
  const exactMatch = groups.some(group => group.toLowerCase() === query.toLowerCase());

  return (
    <div className={`app-group-picker ${compact ? 'compact' : ''}`} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <div className="app-group-input">
        <IcoGrid s={14} />
        <input value={value || ''} onChange={e => { onChange(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          placeholder="Ej. Gestión Administrativa" aria-label="Grupo del aplicativo" required />
        <IcoChevron s={12} />
      </div>
      {open && (
        <div className="app-group-options">
          {filteredGroups.map(group => (
            <button key={group} type="button" onClick={() => { onChange(group); setOpen(false); }}>
              <span className="group-option-icon"><IcoGrid s={13} /></span><span>{group}</span>
              {group.toLowerCase() === query.toLowerCase() && <IcoCheck s={11} />}
            </button>
          ))}
          {query && !exactMatch && (
            <button className="create-group-option" type="button" onClick={() => { onChange(query); setOpen(false); }}>
              <span className="group-option-icon"><IcoPlus s={13} /></span><span><strong>Crear grupo</strong> “{query}”</span>
            </button>
          )}
          {!query && groups.length === 0 && <p>Escribe el nombre del primer grupo.</p>}
        </div>
      )}
      {!compact && <small>Selecciona un grupo existente o escribe uno nuevo para crearlo.</small>}
    </div>
  );
};

/* ==========================================================================
   CALCULADORA NATIVA
   ========================================================================== */
const formatCalculatorValue = (raw) => {
  if (raw === 'Error') return raw;
  const sign = raw.startsWith('-') ? '-' : '';
  const unsigned = sign ? raw.slice(1) : raw;
  const [integer = '0', decimals] = unsigned.split('.');
  const grouped = Number(integer || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 });
  if (decimals !== undefined) return `${sign}${grouped},${decimals}`;
  return `${sign}${grouped}`;
};

const NativeCalculator = ({ isActive }) => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('agora_calculator_history') || '[]'); }
    catch { return []; }
  });

  const compute = (a, b, o) => {
    if (o === '+') return a + b;
    if (o === '−') return a - b;
    if (o === '×') return a * b;
    if (o === '÷') return b === 0 ? NaN : a / b;
    return b;
  };

  const commitResult = (left, right, operator) => {
    const res = compute(parseFloat(left), parseFloat(right), operator);
    const result = Number.isFinite(res) ? String(parseFloat(res.toFixed(8))) : 'Error';
    const statement = `${formatCalculatorValue(left)} ${operator} ${formatCalculatorValue(right)}`;
    setDisplay(result);
    setExpression(`${statement} =`);
    setHistory(items => [{ id: Date.now(), expression: statement, result }, ...items].slice(0, 8));
    setPrev(null);
    setOp(null);
    setWaitingForOperand(true);
    return result;
  };

  const press = (k) => {
    if (k === 'AC') {
      setDisplay('0'); setPrev(null); setOp(null); setExpression(''); setWaitingForOperand(false); return;
    }
    if (k === '⌫') {
      if (waitingForOperand || display === 'Error') return;
      setDisplay(d => d.length <= 1 || (d.length === 2 && d.startsWith('-')) ? '0' : d.slice(0, -1));
      return;
    }
    if (k === '±') {
      setDisplay(d => (d.startsWith('-') ? d.slice(1) : d === '0' || d === 'Error' ? d : '-' + d)); return;
    }
    if (k === '%') {
      if (display === 'Error') return;
      setDisplay(d => String(parseFloat(d) / 100)); return;
    }
    if (['+', '−', '×', '÷'].includes(k)) {
      if (display === 'Error') return;
      if (op && prev !== null && !waitingForOperand) {
        const result = compute(parseFloat(prev), parseFloat(display), op);
        const next = Number.isFinite(result) ? String(parseFloat(result.toFixed(8))) : 'Error';
        setDisplay(next); setPrev(next);
        setExpression(`${formatCalculatorValue(next)} ${k}`);
      } else {
        setPrev(display);
        setExpression(`${formatCalculatorValue(display)} ${k}`);
      }
      setOp(k); setWaitingForOperand(true); return;
    }
    if (k === '=') {
      if (op === null || prev === null) return;
      commitResult(prev, display, op); return;
    }
    if (k === ',') {
      if (waitingForOperand || display === 'Error') {
        setDisplay('0.'); setWaitingForOperand(false);
      } else if (!display.includes('.')) setDisplay(display + '.');
      return;
    }
    if (waitingForOperand || display === '0' || display === 'Error') {
      setDisplay(k); setWaitingForOperand(false);
    } else if (display.replace(/[-.]/g, '').length < 14) setDisplay(display + k);
  };

  useEffect(() => {
    localStorage.setItem('agora_calculator_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (!isActive) return undefined;
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
      const mapped = {
        '/': '÷', '*': '×', '-': '−', '+': '+',
        Enter: '=', '=': '=', ',': ',', '.': ',',
        Backspace: '⌫', Delete: 'AC', Escape: 'AC',
      }[e.key] || (/^\d$/.test(e.key) ? e.key : null);
      if (!mapped) return;
      e.preventDefault();
      press(mapped);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const keys = [
    ['AC', 'fn'], ['±', 'fn'], ['%', 'fn'], ['÷', 'op'],
    ['7', ''], ['8', ''], ['9', ''], ['×', 'op'],
    ['4', ''], ['5', ''], ['6', ''], ['−', 'op'],
    ['1', ''], ['2', ''], ['3', ''], ['+', 'op'],
    ['0', '', { gridColumn: 'span 2' }], [',', ''], ['=', 'op'],
  ];

  return (
    <div className="calc-shell">
      <div className="calc-history">
        <div className="calc-history-head">
          <span><IcoHistory s={12} /> Historial</span>
          {history.length > 0 && <button onClick={() => setHistory([])}>Limpiar</button>}
        </div>
        <div className="calc-history-list">
          {history.length === 0
            ? <span className="calc-history-empty">Las operaciones aparecerán aquí.</span>
            : history.slice(0, 3).map(item => (
              <button key={item.id} className="calc-history-row" onClick={() => { setDisplay(item.result); setWaitingForOperand(true); }}>
                <span>{item.expression}</span><strong>{formatCalculatorValue(item.result)}</strong>
              </button>
            ))}
        </div>
      </div>
      <div className="calc-expression">{expression || ' '}</div>
      <div className="calc-screen" title={formatCalculatorValue(display)}>{formatCalculatorValue(display)}</div>
      <div className="calc-pad">
        {keys.map(([k, cls, st], i) => (
          <button key={i} className={`calc-key ${cls}`} style={st || {}} onClick={() => press(k)}>{k}</button>
        ))}
      </div>
    </div>
  );
};

const UNIT_GROUPS = {
  longitud: {
    label: 'Longitud', units: { m: ['Metros', 1], km: ['Kilómetros', 1000], cm: ['Centímetros', .01], mi: ['Millas', 1609.344] },
  },
  peso: {
    label: 'Peso', units: { kg: ['Kilogramos', 1], g: ['Gramos', .001], lb: ['Libras', .45359237], oz: ['Onzas', .0283495] },
  },
  temperatura: {
    label: 'Temperatura', units: { c: ['Celsius', 1], f: ['Fahrenheit', 1], k: ['Kelvin', 1] },
  },
};

const UnitConverter = () => {
  const [group, setGroup] = useState('longitud');
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('km');

  const changeGroup = (next) => {
    const keys = Object.keys(UNIT_GROUPS[next].units);
    setGroup(next); setFrom(keys[0]); setTo(keys[1]);
  };

  const result = useMemo(() => {
    const number = Number(String(amount).replace(',', '.'));
    if (!Number.isFinite(number)) return '—';
    if (group === 'temperatura') {
      const celsius = from === 'c' ? number : from === 'f' ? (number - 32) * 5 / 9 : number - 273.15;
      const converted = to === 'c' ? celsius : to === 'f' ? celsius * 9 / 5 + 32 : celsius + 273.15;
      return converted.toLocaleString('es-CO', { maximumFractionDigits: 4 });
    }
    const units = UNIT_GROUPS[group].units;
    const converted = number * units[from][1] / units[to][1];
    return converted.toLocaleString('es-CO', { maximumFractionDigits: 6 });
  }, [amount, from, group, to]);

  const units = UNIT_GROUPS[group].units;
  return (
    <div className="utility-tool converter-tool">
      <div className="utility-intro"><span className="utility-icon"><IcoSwap s={20} /></span><div><strong>Conversor rápido</strong><p>Longitud, peso y temperatura sin salir del Hub.</p></div></div>
      <div className="utility-segments">
        {Object.entries(UNIT_GROUPS).map(([id, item]) => <button key={id} className={group === id ? 'active' : ''} onClick={() => changeGroup(id)}>{item.label}</button>)}
      </div>
      <div className="converter-grid">
        <label><span>Valor</span><input className="field" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} /></label>
        <label><span>Desde</span><select className="field" value={from} onChange={e => setFrom(e.target.value)}>{Object.entries(units).map(([id, item]) => <option key={id} value={id}>{item[0]}</option>)}</select></label>
        <button className="converter-swap" onClick={() => { setFrom(to); setTo(from); }} aria-label="Intercambiar unidades"><IcoSwap s={16} /></button>
        <label><span>Hacia</span><select className="field" value={to} onChange={e => setTo(e.target.value)}>{Object.entries(units).map(([id, item]) => <option key={id} value={id}>{item[0]}</option>)}</select></label>
      </div>
      <div className="converter-result"><span>Resultado</span><strong>{result}</strong><small>{units[to][0]}</small></div>
    </div>
  );
};

const createSecurePassword = (length, symbols) => {
  const alphabet = `ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789${symbols ? '!@#$%&*+-=?' : ''}`;
  const bytes = new Uint32Array(length);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, value => alphabet[value % alphabet.length]).join('');
};

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [symbols, setSymbols] = useState(true);
  const [passwordValue, setPasswordValue] = useState(() => createSecurePassword(16, true));
  const [copied, setCopied] = useState(false);
  const generate = (nextLength = length, nextSymbols = symbols) => {
    setPasswordValue(createSecurePassword(nextLength, nextSymbols)); setCopied(false);
  };
  const copyPassword = async () => {
    await navigator.clipboard.writeText(passwordValue); setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="utility-tool password-tool">
      <div className="utility-intro"><span className="utility-icon"><IcoKey s={20} /></span><div><strong>Generador de claves</strong><p>Crea contraseñas robustas directamente en tu equipo.</p></div></div>
      <div className="password-output"><code>{passwordValue}</code><button onClick={copyPassword}>{copied ? 'Copiada' : 'Copiar'}</button></div>
      <label className="range-field"><span>Longitud <strong>{length}</strong></span><input type="range" min="10" max="32" value={length} onChange={e => { const next = Number(e.target.value); setLength(next); generate(next, symbols); }} /></label>
      <label className="utility-toggle"><span><strong>Incluir símbolos</strong><small>Mejora la complejidad de la contraseña</small></span><input type="checkbox" checked={symbols} onChange={e => { setSymbols(e.target.checked); generate(length, e.target.checked); }} /></label>
      <button className="utility-primary" onClick={() => generate()}><IcoRefresh s={15} /> Generar otra clave</button>
      <p className="utility-privacy"><IcoShield s={13} /> La contraseña se genera localmente y no se envía al servidor.</p>
    </div>
  );
};

const stopwatchLabel = (milliseconds) => {
  const totalCentiseconds = Math.floor(milliseconds / 10);
  const minutes = Math.floor(totalCentiseconds / 6000);
  const seconds = Math.floor((totalCentiseconds % 6000) / 100);
  const centiseconds = totalCentiseconds % 100;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
};

const StopwatchTool = () => {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setElapsed(Date.now() - startedAt.current), 40);
    return () => window.clearInterval(timer);
  }, [running]);

  const toggle = () => {
    if (!running) startedAt.current = Date.now() - elapsed;
    setRunning(value => !value);
  };
  const reset = () => { setRunning(false); setElapsed(0); setLaps([]); };
  return (
    <div className="utility-tool stopwatch-tool">
      <div className="utility-intro"><span className="utility-icon"><IcoClock s={20} /></span><div><strong>Cronómetro</strong><p>Mide actividades y registra vueltas durante tu jornada.</p></div></div>
      <div className={`stopwatch-display ${running ? 'running' : ''}`}><span>{stopwatchLabel(elapsed)}</span><small>{running ? 'EN CURSO' : elapsed ? 'EN PAUSA' : 'LISTO'}</small></div>
      <div className="stopwatch-actions">
        <button className="secondary" onClick={() => setLaps(items => elapsed ? [elapsed, ...items].slice(0, 5) : items)} disabled={!elapsed}><IcoPlus s={14} /> Vuelta</button>
        <button className="primary" onClick={toggle}>{running ? <IcoPause s={14} /> : <IcoPlay s={14} />}{running ? 'Pausar' : 'Iniciar'}</button>
        <button className="secondary" onClick={reset} disabled={!elapsed}><IcoRefresh s={14} /> Reiniciar</button>
      </div>
      <div className="stopwatch-laps">
        {laps.length === 0 ? <p>Aquí aparecerán tus últimas vueltas.</p> : laps.map((lap, index) => <div key={`${lap}-${index}`}><span>Vuelta {laps.length - index}</span><strong>{stopwatchLabel(lap)}</strong></div>)}
      </div>
    </div>
  );
};

/* ========================================================================== 
   APP
   ========================================================================== */
export default function App() {
  /* --- Autenticación --- */
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);

  /* --- Sistema --- */
  const [theme, setTheme] = useState('light');
  const [workspaceMode, setWorkspaceMode] = useState('focus');
  const [currentView, setCurrentView] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAppearancePanel, setShowAppearancePanel] = useState(false);
  const [showWidgetGallery, setShowWidgetGallery] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [workspaceAppearance, setWorkspaceAppearance] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('agora_workspace_appearance') || 'null');
      return saved ? { ...DEFAULT_APPEARANCE, ...saved } : DEFAULT_APPEARANCE;
    } catch { return DEFAULT_APPEARANCE; }
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  /* --- Launchpad / Spotlight --- */
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isLaunchpadClosing, setIsLaunchpadClosing] = useState(false);
  const [lpQuery, setLpQuery] = useState('');
  const [launchpadPage, setLaunchpadPage] = useState(0);
  const [launchpadPageSize, setLaunchpadPageSize] = useState(() => typeof window === 'undefined' ? 18 : (window.innerWidth >= 1180 ? 18 : window.innerWidth >= 760 ? 12 : 8));
  const [showUtilitiesFolder, setShowUtilitiesFolder] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const lpInputRef = useRef(null);
  const launchpadCloseTimerRef = useRef(null);

  /* --- Ventanas --- */
  const [openApps, setOpenApps] = useState([]);
  const [activeAppId, setActiveAppId] = useState(null);
  const [minimizedApps, setMinimizedApps] = useState({});
  const [windowMotion, setWindowMotion] = useState({});
  const [minimizeVectors, setMinimizeVectors] = useState({});
  const [maximizedApps, setMaximizedApps] = useState({});
  const [loadingApps, setLoadingApps] = useState({});
  const [windowLayers, setWindowLayers] = useState({});
  const windowLayerCounter = useRef(100);
  const sessionIdRef = useRef('');

  /* --- Datos --- */
  const [appsList, setAppsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskColor, setNewTaskColor] = useState('navy');
  const [recents, setRecents] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dateKey());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [calendarTaskText, setCalendarTaskText] = useState('');
  const [calendarTaskColor, setCalendarTaskColor] = useState('navy');
  const [boardPosts, setBoardPosts] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('agora_corporate_board') || 'null');
      return Array.isArray(saved) ? saved : DEFAULT_BOARD_POSTS;
    } catch { return DEFAULT_BOARD_POSTS; }
  });
  const [showBoardManager, setShowBoardManager] = useState(false);
  const [newBoardPost, setNewBoardPost] = useState({ type: 'comunicado', title: '', body: '', imageUrl: '', linkUrl: '' });
  const [publicationTypeOpen, setPublicationTypeOpen] = useState(false);
  const [boardSlide, setBoardSlide] = useState(0);
  const [boardCarouselPaused, setBoardCarouselPaused] = useState(false);
  const [enabledWidgets, setEnabledWidgets] = useState([]);
  const [profilePreferences, setProfilePreferences] = useState({ displayName: '', roleLabel: '', welcomeMessage: '' });
  const [quickNote, setQuickNote] = useState('');
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [userPreferencesReady, setUserPreferencesReady] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [analyticsRange, setAnalyticsRange] = useState(30);
  const [analyticsActivityPage, setAnalyticsActivityPage] = useState(0);
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsError, setTeamsError] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [showTeamEditor, setShowTeamEditor] = useState(false);
  const [teamDraft, setTeamDraft] = useState({ id: '', name: '', leaderId: '', memberIds: [] });
  const [teamTaskDraft, setTeamTaskDraft] = useState({ title: '', description: '', assignedTo: '', dueDate: dateKey(), priority: 'media' });
  const [teamSection, setTeamSection] = useState('overview');
  const [teamTaskFilter, setTeamTaskFilter] = useState('all');
  const [teamCalendarMonth, setTeamCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [teamCalendarDate, setTeamCalendarDate] = useState(dateKey());

  /* --- CRUD --- */
  const [newApp, setNewApp] = useState({ nombre: '', url: '', desc: '', icono: '', grupo: '', estado: 'Activo' });
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [editingAppId, setEditingAppId] = useState(null);
  const [showAppDeployModal, setShowAppDeployModal] = useState(false);
  const [appCatalogError, setAppCatalogError] = useState('');

  /* ---------------- Efectos ---------------- */
  useEffect(() => { document.body.setAttribute('data-theme', isLoggedIn ? theme : 'light'); }, [isLoggedIn, theme]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* --- Overlays: abrir / cerrar --- */
  const openSpotlight = () => { setSearchQuery(''); setIsLaunchpadOpen(false); setShowUtilitiesFolder(false); setIsSpotlightOpen(true); };
  const closeSpotlight = () => { setIsSpotlightOpen(false); setSearchQuery(''); };
  const openLaunchpad = () => {
    window.clearTimeout(launchpadCloseTimerRef.current);
    setLpQuery(''); setLaunchpadPage(0); setShowUtilitiesFolder(false); setIsSpotlightOpen(false);
    setIsLaunchpadClosing(false); setIsLaunchpadOpen(true);
  };
  const closeLaunchpad = () => {
    if (!isLaunchpadOpen || isLaunchpadClosing) return;
    setIsLaunchpadClosing(true);
    window.clearTimeout(launchpadCloseTimerRef.current);
    launchpadCloseTimerRef.current = window.setTimeout(() => {
      setIsLaunchpadOpen(false); setIsLaunchpadClosing(false); setLpQuery(''); setLaunchpadPage(0);
    }, 260);
  };
  const closeOverlays = () => { closeSpotlight(); closeLaunchpad(); setShowUtilitiesFolder(false); };

  useEffect(() => () => window.clearTimeout(launchpadCloseTimerRef.current), []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchQuery(''); setIsLaunchpadOpen(false); setIsSpotlightOpen(v => !v);
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false); setIsLaunchpadOpen(false); setShowUserMenu(false);
        setShowAppearancePanel(false); setShowWidgetGallery(false); setShowProfileEditor(false);
        setPublicationTypeOpen(false); setShowUtilitiesFolder(false); setShowTeamEditor(false); setShowAppDeployModal(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => { if (isSpotlightOpen) searchInputRef.current?.focus(); }, [isSpotlightOpen]);
  useEffect(() => { if (isLaunchpadOpen) lpInputRef.current?.focus(); }, [isLaunchpadOpen]);

  useEffect(() => {
    const updateLaunchpadCapacity = () => setLaunchpadPageSize(window.innerWidth >= 1180 ? 18 : window.innerWidth >= 760 ? 12 : 8);
    window.addEventListener('resize', updateLaunchpadCapacity);
    return () => window.removeEventListener('resize', updateLaunchpadCapacity);
  }, []);

  useEffect(() => {
    if (!showUtilitiesFolder) return undefined;
    const closeFolderFromBackground = event => {
      if (!(event.target instanceof Element) || !event.target.closest('.dock-folder')) {
        setShowUtilitiesFolder(false);
      }
    };
    document.addEventListener('pointerdown', closeFolderFromBackground);
    return () => document.removeEventListener('pointerdown', closeFolderFromBackground);
  }, [showUtilitiesFolder]);

  useEffect(() => {
    if (!isLoggedIn || !userData) return;
    try {
      const t = localStorage.getItem(`agora_tasks_${userData.usuario}`);
      setTasks(t ? JSON.parse(t).map(task => ({ color: 'navy', dueDate: '', ...task })) : []);
      const r = localStorage.getItem(`agora_recent_${userData.usuario}`);
      setRecents(r ? JSON.parse(r) : []);
    } catch { /* ignorar almacenamiento corrupto */ }
  }, [isLoggedIn, userData]);

  useEffect(() => {
    if (!isLoggedIn || !userData) { setUserPreferencesReady(false); return; }
    setUserPreferencesReady(false);
    try {
      const key = userData.usuario;
      const savedWidgets = JSON.parse(localStorage.getItem(`agora_widgets_${key}`) || '[]');
      const savedProfile = JSON.parse(localStorage.getItem(`agora_profile_${key}`) || 'null');
      const savedAppearance = JSON.parse(localStorage.getItem(`agora_appearance_${key}`) || localStorage.getItem('agora_workspace_appearance') || 'null');
      const savedTheme = localStorage.getItem(`agora_theme_${key}`) || 'light';
      const savedFocus = Number(localStorage.getItem(`agora_focus_minutes_${key}`) || 25);
      const validFocus = Number.isFinite(savedFocus) ? Math.min(120, Math.max(5, Math.round(savedFocus / 5) * 5)) : 25;
      setEnabledWidgets(Array.isArray(savedWidgets) ? savedWidgets.filter(id => WIDGET_CATALOG.some(widget => widget.id === id)) : []);
      setProfilePreferences(savedProfile ? { displayName: '', roleLabel: '', welcomeMessage: '', ...savedProfile } : { displayName: '', roleLabel: '', welcomeMessage: '' });
      setWorkspaceAppearance(savedAppearance ? { ...DEFAULT_APPEARANCE, ...savedAppearance } : DEFAULT_APPEARANCE);
      setTheme(savedTheme === 'dark' ? 'dark' : 'light');
      setQuickNote(localStorage.getItem(`agora_quick_note_${key}`) || '');
      setFocusMinutes(validFocus);
      setPomodoroSeconds(validFocus * 60);
    } catch {
      setEnabledWidgets([]);
      setProfilePreferences({ displayName: '', roleLabel: '', welcomeMessage: '' });
      setWorkspaceAppearance(DEFAULT_APPEARANCE);
      setTheme('light');
      setQuickNote('');
      setFocusMinutes(25);
      setPomodoroSeconds(25 * 60);
    }
    setUserPreferencesReady(true);
  }, [isLoggedIn, userData]);

  useEffect(() => {
    if (isLoggedIn && userData) localStorage.setItem(`agora_tasks_${userData.usuario}`, JSON.stringify(tasks));
  }, [tasks, isLoggedIn, userData]);

  useEffect(() => {
    if (isLoggedIn && userData) localStorage.setItem(`agora_recent_${userData.usuario}`, JSON.stringify(recents));
  }, [recents, isLoggedIn, userData]);

  useEffect(() => {
    if (!userPreferencesReady || !userData) return;
    const key = userData.usuario;
    localStorage.setItem(`agora_widgets_${key}`, JSON.stringify(enabledWidgets));
    localStorage.setItem(`agora_profile_${key}`, JSON.stringify(profilePreferences));
    localStorage.setItem(`agora_appearance_${key}`, JSON.stringify(workspaceAppearance));
    localStorage.setItem(`agora_theme_${key}`, theme);
    localStorage.setItem(`agora_quick_note_${key}`, quickNote);
    localStorage.setItem(`agora_focus_minutes_${key}`, String(focusMinutes));
  }, [enabledWidgets, profilePreferences, workspaceAppearance, theme, quickNote, focusMinutes, userPreferencesReady, userData]);

  useEffect(() => {
    if (!pomodoroRunning) return undefined;
    const timer = setInterval(() => {
      setPomodoroSeconds(seconds => {
        if (seconds <= 1) { setPomodoroRunning(false); return 0; }
        return seconds - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pomodoroRunning]);

  useEffect(() => {
    localStorage.setItem('agora_corporate_board', JSON.stringify(boardPosts));
  }, [boardPosts]);

  useEffect(() => {
    setBoardSlide(index => boardPosts.length ? Math.min(index, boardPosts.length - 1) : 0);
  }, [boardPosts.length]);

  useEffect(() => {
    if (boardPosts.length < 2 || boardCarouselPaused) return undefined;
    const timer = setInterval(() => {
      setBoardSlide(index => (index + 1) % boardPosts.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [boardPosts.length, boardCarouselPaused, boardSlide]);

  /* ---------------- API ---------------- */
  const post = async (payload) => {
    let res;
    try {
      res = await fetch(GAS_API_URL, {
        method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      });
    } catch {
      throw new Error('No fue posible conectar con el backend. Revisa tu conexión y que el Web App de Apps Script siga publicado.');
    }
    const responseText = await res.text();
    if (!responseText.trim()) throw new Error('El backend respondió sin contenido. Verifica el despliegue de Apps Script.');
    try {
      const parsed = JSON.parse(responseText);
      if (!res.ok) throw new Error(parsed.message || `El backend respondió con estado ${res.status}.`);
      return parsed;
    } catch (parseError) {
      if (parseError instanceof SyntaxError) {
        const isHtml = /<!doctype|<html|<body/i.test(responseText);
        throw new Error(isHtml
          ? 'Apps Script devolvió una página HTML en lugar de la API. Publica una nueva versión del Web App y revisa que el acceso permita a todos los usuarios autorizados.'
          : 'La respuesta del backend no tiene un formato JSON válido.');
      }
      throw parseError;
    }
  };

  const emitAnalytics = (event, details = {}) => {
    const actor = details.usuario || userData?.usuario;
    if (!actor) return;
    const eventData = {
      event,
      usuario: actor,
      appId: details.appId || '',
      appName: details.appName || '',
      group: details.group || '',
      durationSeconds: Math.max(0, Math.round(Number(details.durationSeconds) || 0)),
      view: details.view || '',
      sessionId: details.sessionId || sessionIdRef.current || '',
      authToken: details.authToken || userData?.sessionToken || '',
    };
    fetch(GAS_API_URL, {
      method: 'POST', body: JSON.stringify({ action: 'trackEvent', eventData }),
      headers: { 'Content-Type': 'text/plain' }, keepalive: true,
    }).catch(() => {});
  };

  const fetchApps = async () => {
    try {
      const r = await post({ action: 'getApps' });
      if (r.status === 'success') setAppsList((r.data || []).map(app => ({ ...app, grupo: app.grupo?.trim() || 'Sin grupo', estado: isAppEnabled(app) ? 'Activo' : 'Inactivo' })));
    }
    catch { /* offline */ }
  };
  const fetchUsers = async () => {
    try { const r = await post({ action: 'getUsers' }); if (r.status === 'success') setUsersList(r.data || []); }
    catch { /* offline */ }
  };
  const fetchBoardPosts = async () => {
    try {
      const r = await post({ action: 'getBoardPosts' });
      if (r.status === 'success' && Array.isArray(r.data)) setBoardPosts(r.data.map(item => ({ linkUrl: '', ...item })));
    } catch { /* respaldo local */ }
  };

  const fetchTeams = async (session = userData) => {
    if (!session?.usuario || !session?.sessionToken) return;
    setTeamsLoading(true); setTeamsError('');
    try {
      const response = await post({ action: 'getTeams', usuario: session.usuario, authToken: session.sessionToken });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible consultar los equipos.');
      const nextTeams = response.data || [];
      setTeams(nextTeams);
      setSelectedTeamId(current => nextTeams.some(team => team.id === current) ? current : (nextTeams[0]?.id || ''));
    } catch (teamRequestError) {
      setTeamsError(teamRequestError.message || 'No fue posible consultar los equipos.');
    } finally { setTeamsLoading(false); }
  };

  const fetchAnalytics = async () => {
    if (userData?.rolGlobal !== 'Administrador') return;
    setAnalyticsLoading(true); setAnalyticsError('');
    try {
      const response = await post({ action: 'getAnalytics', usuario: userData.usuario, authToken: userData.sessionToken, days: analyticsRange });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible consultar la analítica.');
      setAnalyticsData(response.data);
      setAnalyticsActivityPage(0);
    } catch (analyticsRequestError) {
      setAnalyticsError(analyticsRequestError.message || 'No fue posible conectar con la analítica.');
    } finally { setAnalyticsLoading(false); }
  };

  useEffect(() => {
    if (!isLoggedIn || !userData || currentView !== 'analytics' || userData.rolGlobal !== 'Administrador') return;
    fetchAnalytics();
  }, [analyticsRange, currentView, isLoggedIn, userData]);

  useEffect(() => {
    if (!isLoggedIn || !userData || currentView !== 'teams') return;
    fetchTeams(userData);
  }, [currentView, isLoggedIn, userData]);

  useEffect(() => {
    if (!isLoggedIn || !userData) return;
    emitAnalytics('view_open', { view: currentView });
  }, [currentView, isLoggedIn, userData]);

  useEffect(() => {
    if (!isLoggedIn || !userData || !activeAppId) return undefined;
    const app = openApps.find(item => item.id === activeAppId);
    if (!app) return undefined;
    let lastStartedAt = Date.now();
    let visible = !document.hidden;

    const flushUsage = () => {
      if (!visible) return;
      const now = Date.now();
      const seconds = Math.floor((now - lastStartedAt) / 1000);
      if (seconds >= 5) emitAnalytics('app_usage', {
        appId: app.sys ? `sys-${app.sys}` : app.id, appName: app.nombre, group: app.grupo || (app.sys ? 'Utilidades del sistema' : 'Sin grupo'), durationSeconds: seconds,
      });
      lastStartedAt = now;
    };
    const handleVisibility = () => {
      if (document.hidden) { flushUsage(); visible = false; }
      else { visible = true; lastStartedAt = Date.now(); }
    };
    const heartbeat = window.setInterval(flushUsage, 300000);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', handleVisibility);
      flushUsage();
    };
  }, [activeAppId, isLoggedIn, userData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaVerified) { setError('Resuelve la verificación de seguridad para continuar.'); return; }
    setLoading(true); setError('');
    try {
      const r = await post({ action: 'login', usuario, password });
      if (r.status === 'success') {
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        sessionIdRef.current = sessionId;
        setIsLoggedIn(true); setUserData(r); fetchApps(); fetchUsers(); fetchBoardPosts(); fetchTeams(r);
        emitAnalytics('session_start', { usuario: r.usuario, authToken: r.sessionToken, sessionId });
      }
      else setError(r.message || 'Credenciales no válidas.');
    } catch { setError('Servidor no disponible en este momento.'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    document.body.setAttribute('data-theme', 'light');
    setIsLoggedIn(false); setUserData(null); setOpenApps([]); setActiveAppId(null);
    setShowUserMenu(false); setShowAppearancePanel(false); setShowWidgetGallery(false); setShowProfileEditor(false);
    setShowBoardManager(false); setPublicationTypeOpen(false); setBoardCarouselPaused(false);
    setShowUtilitiesFolder(false); setTeams([]); setTeamsError(''); setSelectedTeamId(''); setShowTeamEditor(false);
    setCurrentView('dashboard'); setPassword(''); setCaptchaVerified(false); setPomodoroRunning(false);
    setTheme('light'); setWorkspaceAppearance(DEFAULT_APPEARANCE); setAnalyticsData(null); setAnalyticsError('');
    sessionIdRef.current = '';
  };

  /* ---------------- Tareas ---------------- */
  const addTask = (e) => {
    if (e.key === 'Enter' && newTask.trim()) {
      setTasks(t => [...t, {
        id: Date.now(), text: newTask.trim(), done: false, color: newTaskColor, dueDate: dateKey(),
      }]);
      setNewTask('');
    }
  };
  const toggleTask = (id) => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const deleteTask = (id) => setTasks(t => t.filter(x => x.id !== id));
  const clearDone = () => setTasks(t => t.filter(x => !x.done));
  const cycleTaskColor = (id) => setTasks(list => list.map(task => {
    if (task.id !== id) return task;
    const index = TASK_COLORS.findIndex(color => color.id === task.color);
    return { ...task, color: TASK_COLORS[(index + 1) % TASK_COLORS.length].id };
  }));

  const openCalendar = (date = new Date()) => {
    setSelectedDate(dateKey(date));
    setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setIsCalendarOpen(true);
  };

  const addScheduledTask = (e) => {
    e.preventDefault();
    if (!calendarTaskText.trim()) return;
    const task = {
      id: Date.now(), text: calendarTaskText.trim(), done: false,
      color: calendarTaskColor, dueDate: selectedDate,
    };
    setTasks(list => [...list, task]);
    setCalendarTaskText('');
  };

  const addBoardPost = async (e) => {
    e.preventDefault();
    const isBanner = newBoardPost.type === 'banner';
    if (isBanner ? !newBoardPost.imageUrl.trim() : (!newBoardPost.title.trim() || !newBoardPost.body.trim())) return;
    const postItem = {
      ...newBoardPost,
      id: `board-${Date.now()}`,
      title: isBanner ? '' : newBoardPost.title.trim(),
      body: isBanner ? '' : newBoardPost.body.trim(),
      imageUrl: newBoardPost.imageUrl.trim(),
      linkUrl: normalizeExternalUrl(newBoardPost.linkUrl),
      createdAt: Date.now(),
      author: userData?.usuario || 'Administración',
    };
    setBoardPosts(posts => [postItem, ...posts]);
    setNewBoardPost({ type: 'comunicado', title: '', body: '', imageUrl: '', linkUrl: '' });
    setBoardSlide(0);
    setPublicationTypeOpen(false);
    try {
      const r = await post({ action: 'addBoardPost', postData: postItem });
      if (r.status === 'success') await fetchBoardPosts();
    } catch { /* la publicación permanece en el respaldo local */ }
  };

  const deleteBoardPost = async (id) => {
    setBoardPosts(posts => posts.filter(post => post.id !== id));
    try {
      const r = await post({ action: 'deleteBoardPost', id });
      if (r.status === 'success') await fetchBoardPosts();
    } catch { /* conservar eliminación local */ }
  };

  const openNewTeamEditor = () => {
    const firstUser = usersList[0]?.idRed || userData?.usuario || '';
    setTeamDraft({ id: '', name: '', leaderId: firstUser, memberIds: firstUser ? [firstUser] : [] });
    setShowTeamEditor(true);
  };

  const openExistingTeamEditor = (team) => {
    setTeamDraft({ id: team.id, name: team.name, leaderId: team.leaderId, memberIds: team.members.map(member => member.userId) });
    setShowTeamEditor(true);
  };

  const toggleTeamDraftMember = (idRed) => {
    setTeamDraft(current => {
      const exists = current.memberIds.some(id => id.toUpperCase() === idRed.toUpperCase());
      const memberIds = exists ? current.memberIds.filter(id => id.toUpperCase() !== idRed.toUpperCase()) : [...current.memberIds, idRed];
      return { ...current, memberIds };
    });
  };

  const saveTeam = async (e) => {
    e.preventDefault();
    if (!teamDraft.name.trim() || !teamDraft.leaderId) return;
    setTeamsLoading(true); setTeamsError('');
    try {
      const memberIds = [...new Set([...teamDraft.memberIds, teamDraft.leaderId])];
      const response = await post({
        action: 'saveTeam', usuario: userData.usuario, authToken: userData.sessionToken,
        teamData: { ...teamDraft, memberIds },
      });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible guardar el equipo.');
      setShowTeamEditor(false);
      await fetchTeams();
      setSelectedTeamId(response.id || teamDraft.id);
    } catch (teamError) {
      setTeamsError(teamError.message || 'No fue posible guardar el equipo.');
    } finally { setTeamsLoading(false); }
  };

  const removeTeam = async (team) => {
    if (!window.confirm(`¿Eliminar el equipo “${team.name}” y todas sus tareas?`)) return;
    setTeamsLoading(true); setTeamsError('');
    try {
      const response = await post({ action: 'deleteTeam', usuario: userData.usuario, authToken: userData.sessionToken, id: team.id });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible eliminar el equipo.');
      await fetchTeams();
    } catch (teamError) { setTeamsError(teamError.message); }
    finally { setTeamsLoading(false); }
  };

  const addTeamTask = async (e) => {
    e.preventDefault();
    if (!selectedTeam || !teamTaskDraft.title.trim() || !teamTaskDraft.assignedTo) return;
    setTeamsLoading(true); setTeamsError('');
    try {
      const response = await post({
        action: 'addTeamTask', usuario: userData.usuario, authToken: userData.sessionToken,
        taskData: { ...teamTaskDraft, teamId: selectedTeam.id },
      });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible asignar la tarea.');
      setTeamTaskDraft(current => ({ ...current, title: '', description: '' }));
      await fetchTeams();
    } catch (teamError) { setTeamsError(teamError.message); }
    finally { setTeamsLoading(false); }
  };

  const updateTeamTaskStatus = async (task, status) => {
    setTeamsError('');
    try {
      const response = await post({
        action: 'updateTeamTask', usuario: userData.usuario, authToken: userData.sessionToken,
        taskData: { id: task.id, status },
      });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible actualizar la tarea.');
      await fetchTeams();
    } catch (teamError) { setTeamsError(teamError.message); }
  };

  /* ---------------- CRUD ---------------- */
  const handleAddApp = async (e) => {
    e.preventDefault();
    if (!newApp.grupo.trim()) return;
    setIsAddingApp(true); setAppCatalogError('');
    try {
      const appData = { ...newApp, grupo: canonicalGroupName(newApp.grupo, appGroups) };
      const r = await post({ action: 'addApp', usuario: userData.usuario, authToken: userData.sessionToken, appData });
      if (r.status !== 'success') throw new Error(r.message || 'No fue posible desplegar el aplicativo.');
      await fetchApps();
      setNewApp({ nombre: '', url: '', desc: '', icono: '', grupo: '', estado: 'Activo' });
      setShowAppDeployModal(false);
    } catch (appError) { setAppCatalogError(appError.message || 'No fue posible desplegar el aplicativo.'); }
    finally { setIsAddingApp(false); }
  };
  const handleDeleteApp = async (id) => {
    if (!window.confirm('¿Eliminar este aplicativo del catálogo?')) return;
    setAppCatalogError('');
    try {
      const r = await post({ action: 'deleteApp', usuario: userData.usuario, authToken: userData.sessionToken, id });
      if (r.status !== 'success') throw new Error(r.message || 'No fue posible eliminar el aplicativo.');
      await fetchApps();
    } catch (appError) { setAppCatalogError(appError.message || 'No fue posible eliminar el aplicativo.'); }
  };
  const handleUpdateApp = async (e, id) => {
    e.preventDefault();
    setAppCatalogError('');
    try {
      const appToUpdate = appsList.find(a => a.id === id);
      if (!appToUpdate?.grupo?.trim()) return;
      const r = await post({ action: 'updateApp', usuario: userData.usuario, authToken: userData.sessionToken, appData: { ...appToUpdate, grupo: canonicalGroupName(appToUpdate.grupo, appGroups) } });
      if (r.status !== 'success') throw new Error(r.message || 'No fue posible actualizar el aplicativo.');
      setEditingAppId(null); await fetchApps();
    } catch (appError) { setAppCatalogError(appError.message || 'No fue posible actualizar el aplicativo.'); }
  };
  const toggleAppStatus = async (app) => {
    const nextStatus = isAppEnabled(app) ? 'Inactivo' : 'Activo';
    setAppCatalogError('');
    try {
      const r = await post({ action: 'setAppStatus', usuario: userData.usuario, authToken: userData.sessionToken, id: app.id, estado: nextStatus });
      if (r.status !== 'success') throw new Error(r.message || 'No fue posible cambiar la disponibilidad.');
      await fetchApps();
    } catch (appError) { setAppCatalogError(appError.message || 'No fue posible cambiar la disponibilidad.'); }
  };
  const handleEditChange = (id, field, value) =>
    setAppsList(list => list.map(a => a.id === id ? { ...a, [field]: value } : a));

  /* ---------------- Ventanas ---------------- */
  const pushRecent = (app) => {
    setRecents(prev => [
      { id: app.id, nombre: app.nombre, icono: app.icono || '', ts: Date.now() },
      ...prev.filter(r => r.id !== app.id),
    ].slice(0, 5));
  };

  const prioritizeWindow = (appId) => {
    windowLayerCounter.current += 1;
    setWindowLayers(layers => ({ ...layers, [appId]: windowLayerCounter.current }));
    setActiveAppId(appId);
  };

  const topVisibleWindow = (apps, excludedId = null) => apps
    .filter(app => app.id !== excludedId && !minimizedApps[app.id])
    .sort((a, b) => (windowLayers[b.id] || 0) - (windowLayers[a.id] || 0))[0];

  const launchApp = (app) => {
    closeOverlays();
    pushRecent(app);
    emitAnalytics('app_open', { appId: app.id, appName: app.nombre, group: app.grupo || 'Sin grupo' });
    const existing = openApps.find(a => a.id === app.id);
    if (existing) { setMinimizedApps(p => ({ ...p, [app.id]: false })); prioritizeWindow(app.id); return; }
    const toOpen = { ...app, isAuthorized: true, sys: false, defaultWidth: 1040, defaultHeight: 660 };
    setOpenApps(prev => [...prev, toOpen]);
    prioritizeWindow(toOpen.id);
    setLoadingApps(p => ({ ...p, [toOpen.id]: true }));
  };

  const launchSystemApp = (type) => {
    closeOverlays();
    const def = SYSTEM_APPS.find(s => s.sys === type);
    emitAnalytics('app_open', { appId: `sys-${type}`, appName: def?.nombre || type, group: 'Utilidades del sistema' });
    const existing = openApps.find(a => a.sys === type);
    if (existing) { setMinimizedApps(p => ({ ...p, [existing.id]: false })); prioritizeWindow(existing.id); return; }
    const win = {
      id: `sys-${type}-${Date.now()}`, nombre: def.nombre, sys: type, isAuthorized: true,
      icono: '', grad: def.grad, sysIcon: def.icon, defaultWidth: def.w, defaultHeight: def.h,
    };
    setOpenApps(prev => [...prev, win]);
    prioritizeWindow(win.id);
  };

  const closeApp = (e, appId) => {
    if (e) e.stopPropagation();
    const rest = openApps.filter(a => a.id !== appId);
    const next = topVisibleWindow(rest);
    setOpenApps(rest);
    setWindowLayers(layers => {
      const updated = { ...layers };
      delete updated[appId];
      if (next) {
        windowLayerCounter.current += 1;
        updated[next.id] = windowLayerCounter.current;
      }
      return updated;
    });
    if (activeAppId === appId) {
      setActiveAppId(next?.id || null);
    }
  };

  const toggleMinimize = (e, appId) => {
    e.stopPropagation();
    if (windowMotion[appId]) return;
    const winEl = document.getElementById(`window-${appId}`);
    const targetApp = openApps.find(app => app.id === appId);
    const dockEl = document.getElementById(targetApp?.sys ? 'dock-utilities-folder' : `dock-${appId}`);
    let vector = { x: 0, y: window.innerHeight, scaleX: .06, scaleY: .04 };
    if (winEl && dockEl) {
      const w = winEl.getBoundingClientRect();
      const d = dockEl.getBoundingClientRect();
      vector = {
        x: d.left + d.width / 2 - (w.left + w.width / 2),
        y: d.top + d.height / 2 - (w.top + w.height / 2),
        scaleX: Math.max(.045, d.width / Math.max(w.width, 1)),
        scaleY: Math.max(.025, d.height / Math.max(w.height, 1)),
      };
    }
    setMinimizeVectors(vectors => ({ ...vectors, [appId]: vector }));
    setWindowMotion(motion => ({ ...motion, [appId]: { phase: 'minimizing', ...vector } }));
    if (activeAppId === appId) {
      const next = topVisibleWindow(openApps, appId);
      if (next) prioritizeWindow(next.id);
      else setActiveAppId(null);
    }
  };

  const finishWindowMotion = (appId) => {
    const motion = windowMotion[appId];
    if (!motion) return;
    if (motion.phase === 'minimizing') setMinimizedApps(items => ({ ...items, [appId]: true }));
    setWindowMotion(items => {
      const next = { ...items };
      delete next[appId];
      return next;
    });
  };

  const toggleMaximize = (e, appId) => {
    e.stopPropagation();
    if (openApps.find(app => app.id === appId)?.sys === 'calculator') return;
    setMaximizedApps(p => ({ ...p, [appId]: !p[appId] }));
  };

  const handleDockClick = (appId) => {
    if (windowMotion[appId]) return;
    if (minimizedApps[appId]) {
      const vector = minimizeVectors[appId] || { x: 0, y: window.innerHeight, scaleX: .06, scaleY: .04 };
      setMinimizedApps(p => ({ ...p, [appId]: false }));
      prioritizeWindow(appId);
      setWindowMotion(motion => ({ ...motion, [appId]: { phase: 'restoring', ...vector } }));
      return;
    }
    if (activeAppId === appId && workspaceMode === 'desktop') { toggleMinimize({ stopPropagation() {} }, appId); return; }
    prioritizeWindow(appId);
  };

  const goDesktop = () => { setActiveAppId(null); setCurrentView('dashboard'); };
  const handleWorkspaceBackground = () => {
    if (workspaceMode !== 'desktop') return;
    goDesktop();
  };

  /* ---------------- Derivados ---------------- */
  const isAdmin = userData?.rolGlobal === 'Administrador';
  const todayKey = dateKey(currentTime);
  const todayCorporateMessage = dailyCorporateMessage(currentTime);
  const dashboardTasks = tasks.filter(task => !task.dueDate || task.dueDate <= todayKey);
  const teamDashboardTasks = teams.flatMap(team => (team.tasks || []).filter(task => (
    task.status !== 'completada' && String(task.assignedTo).toUpperCase() === String(userData?.usuario || '').toUpperCase()
  )).map(task => ({ ...task, teamName: team.name })));
  const pendingTasks = dashboardTasks.filter(t => !t.done).length + teamDashboardTasks.length;
  const scheduledTasks = tasks.filter(task => !task.done && task.dueDate && task.dueDate > todayKey).length;

  const greeting = useMemo(() => {
    const h = currentTime.getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, [currentTime]);

  const weekDays = useMemo(() => {
    const base = new Date(currentTime);
    const dow = (base.getDay() + 6) % 7; // lunes = 0
    const monday = new Date(base); monday.setDate(base.getDate() - dow);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      return d;
    });
  }, [currentTime]);

  const calendarDays = useMemo(() => {
    const first = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - offset);
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(gridStart);
      day.setDate(gridStart.getDate() + index);
      return day;
    });
  }, [calendarMonth]);

  const tasksForSelectedDate = tasks.filter(task => task.dueDate === selectedDate);
  const activeAppsList = useMemo(() => appsList.filter(isAppEnabled), [appsList]);

  const appGroups = useMemo(() => [...new Set(appsList.map(app => app.grupo?.trim() || 'Sin grupo'))]
    .sort((a, b) => {
      if (a === 'Sin grupo') return 1;
      if (b === 'Sin grupo') return -1;
      return a.localeCompare(b, 'es', { sensitivity: 'base' });
    }), [appsList]);

  const groupedApps = useMemo(() => appGroups.map(group => ({
    group,
    apps: activeAppsList.filter(app => (app.grupo?.trim() || 'Sin grupo') === group),
  })).filter(group => group.apps.length > 0), [appGroups, activeAppsList]);
  const dashboardAppGroups = groupedApps.slice(0, 2);

  const launchpadEntries = useMemo(() => {
    const sys = SYSTEM_APPS.map(s => ({
      id: `lp-${s.sys}`, nombre: s.nombre, grad: s.grad, sysIcon: s.icon, sysType: s.sys, desc: 'Utilidad del sistema', grupo: 'Utilidades del sistema',
    }));
    return [...activeAppsList.map(a => ({ ...a })), ...sys];
  }, [activeAppsList]);

  const lpFiltered = useMemo(() => {
    const q = lpQuery.trim().toLowerCase();
    if (!q) return launchpadEntries;
    return launchpadEntries.filter(a => (a.nombre || '').toLowerCase().includes(q) || (a.grupo || '').toLowerCase().includes(q));
  }, [launchpadEntries, lpQuery]);

  const launchpadPages = useMemo(() => {
    const pages = [];
    for (let index = 0; index < lpFiltered.length; index += launchpadPageSize) pages.push(lpFiltered.slice(index, index + launchpadPageSize));
    return pages.length ? pages : [[]];
  }, [lpFiltered, launchpadPageSize]);

  useEffect(() => {
    setLaunchpadPage(page => Math.min(page, Math.max(0, launchpadPages.length - 1)));
  }, [launchpadPages.length]);

  const selectedTeam = teams.find(team => team.id === selectedTeamId) || teams[0] || null;
  const canManageSelectedTeam = Boolean(selectedTeam?.canManage || isAdmin);

  const openEntry = (entry) => entry.sysType ? launchSystemApp(entry.sysType) : launchApp(entry);
  const welcomeName = profilePreferences.displayName.trim() || userData?.usuario || '';
  const completedTasks = tasks.filter(task => task.done).length;
  const productivityPercent = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const upcomingTasks = tasks
    .filter(task => !task.done && task.dueDate && task.dueDate > todayKey)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);
  const pomodoroLabel = `${String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0')}:${String(pomodoroSeconds % 60).padStart(2, '0')}`;
  const clockUses24Hours = workspaceAppearance.clockFormat !== '12';
  const clockHour = clockUses24Hours ? currentTime.getHours() : (currentTime.getHours() % 12 || 12);
  const clockMainLabel = `${String(clockHour).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
  const clockSecondsLabel = String(currentTime.getSeconds()).padStart(2, '0');
  const clockPeriodLabel = clockUses24Hours ? '' : (currentTime.getHours() < 12 ? 'AM' : 'PM');
  const menuClockLabel = `${clockMainLabel}${clockPeriodLabel ? ` ${clockPeriodLabel}` : ''}`;
  const activeBoardPost = boardPosts[boardSlide] || null;
  const selectedBoardType = BOARD_TYPES.find(type => type.id === newBoardPost.type) || BOARD_TYPES[0];

  const changeBoardSlide = (direction) => {
    if (boardPosts.length < 2) return;
    setBoardSlide(index => (index + direction + boardPosts.length) % boardPosts.length);
  };

  const setFocusDuration = (minutes) => {
    if (pomodoroRunning) return;
    const next = Math.min(120, Math.max(5, Math.round(minutes / 5) * 5));
    setFocusMinutes(next);
    setPomodoroSeconds(next * 60);
  };

  const toggleWidget = (widgetId) => setEnabledWidgets(items => (
    items.includes(widgetId) ? items.filter(id => id !== widgetId) : [...items, widgetId]
  ));

  const renderOptionalWidget = (widgetId) => {
    const widget = WIDGET_CATALOG.find(item => item.id === widgetId);
    if (!widget) return null;
    const WidgetIcon = widget.icon;
    let content = null;

    if (widgetId === 'pomodoro') content = (
      <div className="pomodoro-widget">
        <div className={`pomodoro-ring ${pomodoroRunning ? 'running' : ''}`}><strong>{pomodoroLabel}</strong><span>ENFOQUE</span></div>
        <div className="focus-widget-controls">
          <div className="focus-duration">
            <span>Duración</span>
            <div>
              <button disabled={pomodoroRunning || focusMinutes <= 5} onClick={() => setFocusDuration(focusMinutes - 5)} aria-label="Reducir cinco minutos"><IcoMinus s={11} /></button>
              <strong>{focusMinutes} min</strong>
              <button disabled={pomodoroRunning || focusMinutes >= 120} onClick={() => setFocusDuration(focusMinutes + 5)} aria-label="Aumentar cinco minutos"><IcoPlus s={11} /></button>
            </div>
          </div>
          <div className="widget-actions">
          <button className="widget-action primary" onClick={() => { if (pomodoroSeconds === 0) setPomodoroSeconds(focusMinutes * 60); setPomodoroRunning(value => !value); }}>
            {pomodoroRunning ? <IcoPause s={14} /> : <IcoPlay s={14} />} {pomodoroRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button className="widget-action" onClick={() => { setPomodoroRunning(false); setPomodoroSeconds(focusMinutes * 60); }}><IcoRefresh s={14} /> Reiniciar</button>
          </div>
        </div>
      </div>
    );

    if (widgetId === 'quick-note') content = (
      <textarea className="quick-note-widget" value={quickNote} onChange={e => setQuickNote(e.target.value)} placeholder="Escribe una idea, recordatorio o dato importante…" />
    );

    if (widgetId === 'productivity') content = (
      <div className="productivity-widget">
        <div className="productivity-score" style={{ '--progress': `${productivityPercent * 3.6}deg` }}><strong>{productivityPercent}%</strong></div>
        <div><strong>{completedTasks} de {tasks.length}</strong><span>Tareas completadas</span><small>{pendingTasks ? `${pendingTasks} pendientes para hoy` : 'Tu agenda de hoy está al día'}</small></div>
      </div>
    );

    if (widgetId === 'upcoming') content = (
      <div className="upcoming-widget">
        {upcomingTasks.length === 0
          ? <p className="empty-note">No tienes tareas próximas.</p>
          : upcomingTasks.map(task => (
            <button key={task.id} onClick={() => openCalendar(new Date(`${task.dueDate}T12:00:00`))}>
              <i className={`color-${task.color || 'navy'}`} /><span><strong>{task.text}</strong><small>{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}</small></span><IcoChevron s={12} />
            </button>
          ))}
      </div>
    );

    if (widgetId === 'shortcuts') content = (
      <div className="shortcut-widget">
        {SYSTEM_APPS.map(app => (
          <button key={app.sys} onClick={() => launchSystemApp(app.sys)}><AppIcon app={{ nombre: app.nombre, grad: app.grad, sysIcon: app.icon }} size={42} /><span>{app.nombre}</span></button>
        ))}
      </div>
    );

    if (widgetId === 'activity') content = (
      <div className="activity-widget">
        <div><strong>{recents.length}</strong><span>Accesos recientes</span></div>
        <div><strong>{openApps.length}</strong><span>Apps en sesión</span></div>
        <div><strong>{activeAppsList.length + SYSTEM_APPS.length}</strong><span>Herramientas</span></div>
      </div>
    );

    return (
      <section key={widgetId} className="card b4 optional-widget flat">
        <div className="card-head widget-head">
          <div className="card-label"><WidgetIcon s={13} /> {widget.label}</div>
          <button className="widget-remove" onClick={() => toggleWidget(widgetId)} title="Quitar del escritorio"><IcoX s={11} /></button>
        </div>
        {content}
      </section>
    );
  };

  const handleLoginPointerMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / bounds.width;
    const y = (e.clientY - bounds.top) / bounds.height;
    e.currentTarget.style.setProperty('--pointer-x', `${x * 100}%`);
    e.currentTarget.style.setProperty('--pointer-y', `${y * 100}%`);
    e.currentTarget.style.setProperty('--login-shift-x', `${(x - 0.5) * 22}px`);
    e.currentTarget.style.setProperty('--login-shift-y', `${(y - 0.5) * 16}px`);
  };

  /* ======================================================================
     LOGIN
     ====================================================================== */
  if (!isLoggedIn) {
    return (
      <div className="login-root" onPointerMove={handleLoginPointerMove}>
        <div className="login-grid" />
        <div className="login-intelligence" aria-hidden="true">
          <svg className="ai-network" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <g className="ai-network-lines">
              <path d="M-30 650 C180 520 210 290 430 330 S730 610 930 430 1190 120 1480 260" />
              <path d="M40 180 C250 260 330 90 520 190 S770 410 1010 280 1250 510 1490 390" />
              <path d="M130 820 C360 650 510 760 650 580 S920 610 1110 720 1340 620 1500 690" />
              <path d="M270 -40 C240 210 480 300 600 470 S690 830 850 950" />
              <path d="M1110 -50 C980 160 1080 330 930 470 S720 640 760 930" />
            </g>
            <g className="ai-network-nodes">
              {[[130,180],[310,265],[430,330],[520,190],[650,580],[760,410],[930,430],[1010,280],[1110,720],[1225,510],[1340,260],[360,650]].map(([cx, cy], index) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index % 3 === 0 ? 7 : 4} />
              ))}
            </g>
          </svg>
          <div className="ai-orbit ai-orbit-main"><span>AI</span></div>
          <span className="ai-signal ai-signal-data">DATOS</span>
          <span className="ai-signal ai-signal-ideas">IDEAS</span>
          <span className="ai-signal ai-signal-growth">CRECIMIENTO</span>
        </div>
        <span className="login-motion login-motion-a" />
        <span className="login-motion login-motion-b" />
        <span className="login-motion login-motion-c" />
        <div className="login-card">
          <div className="login-aside">
            <div className="login-aside-sheen" />
            <div className="login-brand">
              <img src="/logo_compañias.png" alt="Multival" className="login-logo" />
              <span className="login-secure"><IcoShield s={13} /> Entorno protegido</span>
            </div>
            <div className="login-copy">
              <span className="login-eyebrow">Un acceso. Todas tus herramientas.</span>
              <h1 className="login-title">Ágora <span>OS</span></h1>
              <p className="login-text">
                Tu espacio de trabajo corporativo, diseñado para acceder a las aplicaciones
                que necesitas de forma simple, segura y personalizada.
              </p>
            </div>
            <div className="login-benefits">
              <div className="login-benefit"><IcoUser s={16} /><span><strong>Una sola identidad</strong><small>Tu perfil conecta todas las herramientas.</small></span></div>
              <div className="login-benefit"><IcoGrid s={16} /><span><strong>Accesos por perfil</strong><small>Solo ves lo que necesitas para trabajar.</small></span></div>
              <div className="login-benefit"><IcoShield s={16} /><span><strong>Sesión protegida</strong><small>Seguridad corporativa en todo momento.</small></span></div>
            </div>
          </div>

          <div className="login-form-side">
            <div className="login-form">
              <span className="login-kicker">Acceso corporativo seguro</span>
              <h2 className="login-heading">Bienvenido de nuevo</h2>
              <p className="login-helper">Ingresa con tus credenciales de red.</p>

              <form onSubmit={handleLogin}>
                <div className="input-wrap">
                  <span className="input-icon"><IcoUser s={17} /></span>
                  <input className="login-input" type="text" placeholder="Usuario de red"
                    value={usuario} onChange={e => setUsuario(e.target.value.toUpperCase())} required />
                </div>
                <div className="input-wrap">
                  <span className="input-icon"><IcoLock s={17} /></span>
                  <input className="login-input" type="password" placeholder="Contraseña"
                    value={password} onChange={e => setPassword(e.target.value)} required />
                </div>

                {error && <div className="error-badge"><IcoShield s={14} /> {error}</div>}

                <div className="captcha-wrap">
                  <div className="captcha-inner">
                    <ReCAPTCHA sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={v => setCaptchaVerified(!!v)} />
                  </div>
                </div>

                <button type="submit" className="login-submit" disabled={loading}>
                  {loading ? 'Validando acceso…' : 'Ingresar a Ágora'}
                </button>
              </form>
              <p className="login-foot"><IcoShield s={12} /> Conexión cifrada · Acceso exclusivo para personal autorizado</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================================
     DASHBOARD · BENTO GRID
     ====================================================================== */
  const renderBoardSlide = (post) => {
    if (!post) return <p className="empty-note">No hay publicaciones activas.</p>;
    const hasLink = Boolean(normalizeExternalUrl(post.linkUrl));
    const article = post.type === 'banner' ? (
      <article className={`board-post banner ${hasLink ? '' : 'board-slide-enter'}`} aria-label="Banner corporativo">
        {post.imageUrl
          ? <img className="board-banner-image" src={getValidImageUrl(post.imageUrl)} alt="Banner corporativo" />
          : <div className="board-banner-empty">Banner sin imagen</div>}
      </article>
    ) : (
      <article className={`board-post ${post.type} ${hasLink ? '' : 'board-slide-enter'}`}>
        {post.imageUrl && <div className="board-post-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(14,17,37,.80), rgba(14,17,37,.18)), url(${getValidImageUrl(post.imageUrl)})` }} />}
        <div className="board-post-content">
          <span className="board-type">{post.type}</span>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <small>{post.author} · {new Date(post.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}</small>
        </div>
      </article>
    );

    if (!hasLink) return article;
    return (
      <a className="board-slide-link board-slide-enter" href={normalizeExternalUrl(post.linkUrl)} target="_blank" rel="noopener noreferrer" aria-label="Abrir comunicación enlazada"
        onClick={() => emitAnalytics('board_click', { appId: post.id, appName: post.title || `Publicación ${post.type}` })}>
        {article}
        <span className="board-link-hint">Abrir comunicación <IcoChevron s={12} /></span>
      </a>
    );
  };

  const renderDashboard = () => (
    <div className="bento enter">

      {/* ---- Hero ---- */}
      <section className="card b6 flat">
        <h1 className="hero-greet">{greeting}, <span>{welcomeName}</span></h1>
        <p className="hero-sub">
          {`Tienes ${activeAppsList.length} aplicativo${activeAppsList.length === 1 ? '' : 's'} disponible${activeAppsList.length === 1 ? '' : 's'}${pendingTasks > 0 ? ` y ${pendingTasks} tarea${pendingTasks === 1 ? '' : 's'} pendiente${pendingTasks === 1 ? '' : 's'}` : ' y ninguna tarea pendiente'}.`}
        </p>
        <p className="hero-daily-message">{todayCorporateMessage}</p>
        {profilePreferences.welcomeMessage.trim() && <p className="hero-personal-note">{profilePreferences.welcomeMessage.trim()}</p>}
        <button className="search-trigger" onClick={openSpotlight}>
          <IcoSearch s={15} /> Buscar en Ágora <span className="kbd">⌘K</span>
        </button>
      </section>

      {/* ---- Reloj ---- */}
      <section className="card b3">
        <div className="card-label"><IcoClock s={13} /> Hora local</div>
        <div className="clock-time">
          {clockMainLabel}
          <span className="clock-suffix"><b>{clockSecondsLabel}</b>{clockPeriodLabel && <small>{clockPeriodLabel}</small>}</span>
        </div>
        <p className="clock-place">Bogotá, Colombia</p>
        <p className="clock-meta">GMT−5 · Semana {Math.ceil(((currentTime - new Date(currentTime.getFullYear(), 0, 1)) / 86400000 + 1) / 7)}</p>
      </section>

      {/* ---- Calendario monocromático ---- */}
      <section className="card b3">
        <div className="card-head" style={{ marginBottom: 10 }}>
          <div className="card-label"><IcoCal s={13} /> Calendario</div>
          <button className="ghost-btn" onClick={() => openCalendar(currentTime)}>Expandir</button>
        </div>
        <span className="cal-month">{currentTime.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
          <span className="cal-day">{currentTime.getDate()}</span>
          <span className="cal-weekday">{currentTime.toLocaleDateString('es-ES', { weekday: 'long' })}</span>
        </div>
        <div className="cal-week">
          {weekDays.map(d => {
            const isToday = d.toDateString() === currentTime.toDateString();
            return (
              <button key={d.toISOString()} className={`cal-cell ${isToday ? 'today' : ''}`} onClick={() => openCalendar(d)}>
                <span className="cal-cell-dow">{d.toLocaleDateString('es-ES', { weekday: 'narrow' })}</span>
                <span className="cal-cell-num">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
        {scheduledTasks > 0 && <button className="calendar-scheduled" onClick={() => openCalendar(currentTime)}>{scheduledTasks} programada{scheduledTasks === 1 ? '' : 's'}</button>}
      </section>

      {/* ---- Tablero corporativo: segunda fila del escritorio ---- */}
      <section className="card b12 corporate-board flat">
        <div className="card-head">
          <div className="board-title-group">
            <div className="card-label"><IcoBell s={13} /> Tablero corporativo</div>
            <p className="board-subtitle">Novedades, banners e incidencias internas en un solo lugar.</p>
          </div>
          {isAdmin && <button className="btn btn-primary board-manage" onClick={() => setShowBoardManager(true)}><IcoPlus s={14} /> Administrar</button>}
        </div>
        <div className="board-carousel" onMouseEnter={() => setBoardCarouselPaused(true)} onMouseLeave={() => setBoardCarouselPaused(false)} onFocusCapture={() => setBoardCarouselPaused(true)} onBlurCapture={() => setBoardCarouselPaused(false)}>
          <div className="board-feed" aria-live="polite">
            <div key={activeBoardPost?.id || 'empty'} className="board-slide-frame">{renderBoardSlide(activeBoardPost)}</div>
          </div>
          {boardPosts.length > 1 && (
            <div className="board-carousel-controls">
              <button className="board-arrow previous" onClick={() => changeBoardSlide(-1)} aria-label="Publicación anterior"><IcoChevron s={14} /></button>
              <div className="board-dots" role="tablist" aria-label="Publicaciones del tablero">
                {boardPosts.map((post, index) => (
                  <button key={post.id} className={index === boardSlide ? 'active' : ''} onClick={() => setBoardSlide(index)} aria-label={`Ver publicación ${index + 1}`} aria-selected={index === boardSlide} role="tab" />
                ))}
              </div>
              <span className="board-counter">{boardSlide + 1} / {boardPosts.length}</span>
              <button className="board-arrow next" onClick={() => changeBoardSlide(1)} aria-label="Siguiente publicación"><IcoChevron s={14} /></button>
            </div>
          )}
        </div>
      </section>

      {/* ---- Aplicaciones (Launchpad embebido) ---- */}
      <section className="card b8 r2 dashboard-app-card">
        <div className="card-head">
          <div className="card-label"><IcoGrid s={13} /> Aplicaciones</div>
          <button className="ghost-btn" onClick={openLaunchpad}>Abrir Launchpad</button>
        </div>
        <div className="dashboard-app-preview">
          <div className="desktop-app-groups">
            {activeAppsList.length === 0 && <p className="empty-note">No hay aplicativos activos disponibles.</p>}
            {dashboardAppGroups.map(({ group, apps }) => (
              <section key={group} className="desktop-app-group">
                <div className="app-group-heading"><span>{group}</span><small>{apps.length}</small></div>
                <div className="lp-grid">
                  {apps.slice(0, 6).map(app => (
                    <button key={app.id} className="lp-item" onClick={() => launchApp(app)} title={app.desc || app.nombre}>
                      <AppIcon app={app} size={58} />
                      <span className="lp-name">{app.nombre}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        {activeAppsList.length > 0 && (
          <button className="dashboard-app-more" onClick={openLaunchpad}>
            <span>Mostrando {Math.min(2, groupedApps.length)} de {groupedApps.length} grupos</span>
            <strong>Ver {activeAppsList.length + SYSTEM_APPS.length} herramientas <IcoChevron s={12} /></strong>
          </button>
        )}
      </section>

      {/* ---- Tareas ---- */}
      <section className="card b4 flat pending-card">
        <div className="card-head">
          <div className="card-label"><IcoCheck s={12} /> Pendientes</div>
          {tasks.some(t => t.done) && <button className="ghost-btn" onClick={clearDone}>Limpiar</button>}
        </div>
        <div className="task-list pending-task-list">
          {dashboardTasks.length === 0 && teamDashboardTasks.length === 0
            ? <p className="empty-note" style={{ padding: '28px 0' }}>{scheduledTasks > 0 ? 'No hay pendientes para hoy.' : 'Todo en orden. No hay pendientes.'}</p>
            : <>
            {dashboardTasks.map(t => (
              <div key={t.id} className={`task-row color-${t.color || 'navy'} ${t.done ? 'done' : ''}`}>
                <button className="task-color" onClick={() => cycleTaskColor(t.id)} title="Cambiar clasificación" aria-label="Cambiar color de la tarea" />
                <button className="task-box" onClick={() => toggleTask(t.id)}>{t.done && <IcoCheck s={11} />}</button>
                <span className="task-text">{t.text}{t.dueDate && <small>{t.dueDate < todayKey ? 'Vencida' : 'Hoy'}</small>}</span>
                <button className="task-del" onClick={() => deleteTask(t.id)}><IcoX s={11} /></button>
              </div>
            ))}
            {teamDashboardTasks.map(task => (
              <div key={`team-${task.id}`} className={`task-row team-pending priority-${task.priority || 'media'}`}>
                <span className="task-color" />
                <button className="task-box" onClick={() => updateTeamTaskStatus(task, 'completada')} title="Marcar como completada" />
                <span className="task-text">{task.title}<small>{task.teamName}{task.dueDate ? ` · ${task.dueDate < todayKey ? 'Vencida' : new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}` : ' · Sin fecha'}</small></span>
                <button className="task-del" onClick={() => { setSelectedTeamId(task.teamId); setCurrentView('teams'); }} title="Abrir equipo"><IcoChevron s={11} /></button>
              </div>
            ))}
            </>}
        </div>
        <div className="task-composer">
          <div className="task-palette" aria-label="Color de la nueva tarea">
            {TASK_COLORS.map(color => <button key={color.id} className={`task-swatch ${newTaskColor === color.id ? 'active' : ''}`} style={{ '--swatch': color.hex }} onClick={() => setNewTaskColor(color.id)} title={color.label} />)}
          </div>
          <input className="field" placeholder="Nueva tarea para hoy…" value={newTask}
            onChange={e => setNewTask(e.target.value)} onKeyDown={addTask} />
        </div>
      </section>

      {/* ---- Recientes ---- */}
      <section className="card b4 flat recent-card">
        <div className="card-label"><IcoHistory s={13} /> Recientes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'auto' }}>
          {recents.filter(recent => activeAppsList.some(app => app.id === recent.id)).length === 0
            ? <p className="empty-note" style={{ padding: '18px 0', textAlign: 'left' }}>Aún no has abierto aplicativos.</p>
            : recents.filter(recent => activeAppsList.some(app => app.id === recent.id)).slice(0, 4).map(r => {
              const full = activeAppsList.find(a => a.id === r.id) || r;
              return (
                <button key={r.id} className="recent-row" onClick={() => launchApp(full)}>
                  <AppIcon app={full} size={32} />
                  <span style={{ flex: 1, textAlign: 'left' }}>
                    <span className="recent-name" style={{ display: 'block' }}>{r.nombre}</span>
                    <span className="recent-time">
                      {new Date(r.ts).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })} ·{' '}
                      {new Date(r.ts).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </span>
                  <IcoChevron s={13} />
                </button>
              );
            })}
        </div>
      </section>

      {enabledWidgets.map(renderOptionalWidget)}
    </div>
  );

  /* ======================================================================
     LAUNCHPAD
     ====================================================================== */
  const renderLaunchpad = () => {
    if (!isLaunchpadOpen) return null;
    const handleLaunchpadBackground = event => {
      const target = event.target;
      if (target instanceof Element && target.closest('.lp-item, .lp-search, .lp-page-arrow, .lp-page-dots button')) return;
      closeLaunchpad();
    };
    return (
      <div className={`launchpad ${isLaunchpadClosing ? 'closing' : ''}`} onMouseDown={handleLaunchpadBackground}>
        <div className="lp-search">
          <IcoSearch s={16} />
          <input ref={lpInputRef} value={lpQuery} onChange={e => { setLpQuery(e.target.value); setLaunchpadPage(0); }} placeholder="Buscar" />
        </div>
        <div className="lp-stage">
          <button className="lp-page-arrow previous" disabled={launchpadPage === 0} onClick={() => setLaunchpadPage(page => Math.max(0, page - 1))} aria-label="Hoja anterior"><IcoChevron s={24} /></button>
          <div className="lp-pages-viewport">
            <div className="lp-pages-track" style={{ transform: `translateX(-${launchpadPage * 100}%)` }}>
              {launchpadPages.map((entries, pageIndex) => (
                <section className="lp-page" key={`launchpad-page-${pageIndex}`} aria-hidden={pageIndex !== launchpadPage}>
                  {entries.length === 0 ? <p className="empty-note">Sin resultados para “{lpQuery}”.</p> : (
                    <div className="lp-page-grid">
                      {entries.map((entry, index) => (
                        <button key={entry.id} className="lp-item" style={{ animationDelay: `${Math.min(index * 28, 360)}ms` }} onClick={() => openEntry(entry)} title={entry.desc || entry.grupo || entry.nombre}>
                          <AppIcon app={entry} size={76} />
                          <span className="lp-name">{entry.nombre}</span>
                          <small className="lp-app-group">{entry.grupo || 'Sin grupo'}</small>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
          <button className="lp-page-arrow next" disabled={launchpadPage >= launchpadPages.length - 1} onClick={() => setLaunchpadPage(page => Math.min(launchpadPages.length - 1, page + 1))} aria-label="Siguiente hoja"><IcoChevron s={24} /></button>
        </div>
        <div className="lp-page-dots" role="tablist" aria-label="Hojas del Launchpad">
          {launchpadPages.map((_, index) => <button key={index} className={index === launchpadPage ? 'active' : ''} onClick={() => setLaunchpadPage(index)} aria-label={`Ir a la hoja ${index + 1}`} aria-selected={index === launchpadPage} role="tab" />)}
        </div>
      </div>
    );
  };

  /* ======================================================================
     SPOTLIGHT
     ====================================================================== */
  const renderSpotlight = () => {
    if (!isSpotlightOpen) return null;
    const q = searchQuery.trim().toLowerCase();
    const appRes = q ? activeAppsList.filter(a => (a.nombre || '').toLowerCase().includes(q) || (a.desc || '').toLowerCase().includes(q) || (a.grupo || '').toLowerCase().includes(q)) : [];
    const sysRes = q ? SYSTEM_APPS.filter(s => s.nombre.toLowerCase().includes(q)) : [];
    const taskRes = q ? tasks.filter(t => t.text.toLowerCase().includes(q)) : [];
    const nothing = q && !appRes.length && !sysRes.length && !taskRes.length;

    return (
      <div className="spot-overlay" onClick={closeSpotlight}>
        <div className="spot-modal" onClick={e => e.stopPropagation()}>
          <div className="spot-bar">
            <IcoSearch s={22} />
            <input ref={searchInputRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar aplicativos, utilidades o tareas" />
            <span className="kbd">esc</span>
          </div>
          <div className="spot-results">
            {!q && <p className="empty-note" style={{ padding: '34px 0' }}>Escribe para buscar en Ágora.</p>}

            {appRes.length > 0 && <div className="spot-group">Aplicativos</div>}
            {appRes.map(a => (
              <button key={a.id} className="spot-row" onClick={() => launchApp(a)}>
                <AppIcon app={a} size={34} />
                <span>
                  <span className="spot-row-title" style={{ display: 'block' }}>{a.nombre}</span>
                  <span className="spot-row-sub">{a.grupo || 'Sin grupo'}{a.desc ? ` · ${String(a.desc).slice(0, 54)}` : ''}</span>
                </span>
              </button>
            ))}

            {sysRes.length > 0 && <div className="spot-group">Utilidades</div>}
            {sysRes.map(s => (
              <button key={s.sys} className="spot-row" onClick={() => launchSystemApp(s.sys)}>
                <AppIcon app={{ nombre: s.nombre, grad: s.grad, sysIcon: s.icon }} size={34} />
                <span className="spot-row-title">{s.nombre}</span>
              </button>
            ))}

            {taskRes.length > 0 && <div className="spot-group">Tareas</div>}
            {taskRes.map(t => (
              <div key={t.id} className="spot-row">
                <span className="task-box" style={{ width: 22, height: 22 }}>{t.done && <IcoCheck s={11} />}</span>
                <span className="spot-row-title" style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
              </div>
            ))}

            {nothing && <p className="empty-note" style={{ padding: '34px 0' }}>Sin resultados para “{searchQuery}”.</p>}
          </div>
        </div>
      </div>
    );
  };

  /* ======================================================================
     CALENDARIO EXPANDIDO
     ====================================================================== */
  const renderCalendarModal = () => {
    if (!isCalendarOpen) return null;
    const selected = new Date(`${selectedDate}T12:00:00`);
    return (
      <div className="modal-overlay" onMouseDown={() => setIsCalendarOpen(false)}>
        <section className="calendar-modal" onMouseDown={e => e.stopPropagation()}>
          <div className="modal-head">
            <div>
              <span className="login-kicker">Planificación personal</span>
              <h2>Calendario y tareas</h2>
            </div>
            <button className="modal-close" onClick={() => setIsCalendarOpen(false)}><IcoX s={14} /></button>
          </div>
          <div className="calendar-layout">
            <div className="calendar-main">
              <div className="calendar-nav">
                <button onClick={() => setCalendarMonth(month => new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
                <strong>{calendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</strong>
                <button onClick={() => setCalendarMonth(month => new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
              </div>
              <div className="calendar-dow">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
              <div className="calendar-grid">
                {calendarDays.map(day => {
                  const key = dateKey(day);
                  const inMonth = day.getMonth() === calendarMonth.getMonth();
                  const dayTasks = tasks.filter(task => task.dueDate === key);
                  return (
                    <button key={key} className={`${inMonth ? '' : 'outside'} ${key === selectedDate ? 'selected' : ''} ${key === todayKey ? 'today' : ''}`}
                      onClick={() => setSelectedDate(key)}>
                      <span>{day.getDate()}</span>
                      {dayTasks.length > 0 && <i style={{ '--day-color': TASK_COLORS.find(color => color.id === dayTasks[0]?.color)?.hex || '#25294F' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
            <aside className="calendar-agenda">
              <div className="agenda-date">
                <span>{selected.toLocaleDateString('es-ES', { weekday: 'long' })}</span>
                <strong>{selected.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</strong>
              </div>
              <div className="agenda-list">
                {tasksForSelectedDate.length === 0
                  ? <p className="empty-note">No hay tareas programadas.</p>
                  : tasksForSelectedDate.map(task => (
                    <div key={task.id} className={`agenda-task color-${task.color || 'navy'} ${task.done ? 'done' : ''}`}>
                      <button className="task-box" onClick={() => toggleTask(task.id)}>{task.done && <IcoCheck s={10} />}</button>
                      <span>{task.text}</span>
                      <button onClick={() => deleteTask(task.id)}><IcoX s={10} /></button>
                    </div>
                  ))}
              </div>
              <form className="agenda-form" onSubmit={addScheduledTask}>
                <label>Nueva tarea para esta fecha</label>
                <input className="field" value={calendarTaskText} onChange={e => setCalendarTaskText(e.target.value)} placeholder="Escribe la tarea…" autoFocus />
                <div className="agenda-form-row">
                  <div className="task-palette">
                    {TASK_COLORS.map(color => <button type="button" key={color.id} className={`task-swatch ${calendarTaskColor === color.id ? 'active' : ''}`} style={{ '--swatch': color.hex }} onClick={() => setCalendarTaskColor(color.id)} title={color.label} />)}
                  </div>
                  <button className="btn btn-primary" type="submit">Programar</button>
                </div>
              </form>
            </aside>
          </div>
        </section>
      </div>
    );
  };

  /* ======================================================================
     ADMINISTRACIÓN DEL TABLÓN
     ====================================================================== */
  const renderBoardManager = () => {
    if (!showBoardManager || !isAdmin) return null;
    const SelectedTypeIcon = selectedBoardType.icon;
    return (
      <div className="modal-overlay" onMouseDown={() => { setPublicationTypeOpen(false); setShowBoardManager(false); }}>
        <section className="board-modal" onMouseDown={e => e.stopPropagation()}>
          <div className="modal-head">
            <div>
              <span className="login-kicker">Administración</span>
              <h2>Tablero corporativo</h2>
            </div>
            <button className="modal-close" onClick={() => { setPublicationTypeOpen(false); setShowBoardManager(false); }}><IcoX s={14} /></button>
          </div>
          <div className="board-admin-layout">
            <form className="board-form" onSubmit={addBoardPost} onMouseDown={e => { if (!e.target.closest('.publication-select')) setPublicationTypeOpen(false); }}>
              <label className="form-label">Tipo de publicación</label>
              <div className={`publication-select ${publicationTypeOpen ? 'open' : ''}`}>
                <button className="publication-select-trigger" type="button" onClick={() => setPublicationTypeOpen(open => !open)} aria-haspopup="listbox" aria-expanded={publicationTypeOpen}>
                  <span className={`publication-type-icon ${selectedBoardType.id}`}><SelectedTypeIcon s={17} /></span>
                  <span><strong>{selectedBoardType.label}</strong><small>{selectedBoardType.detail}</small></span>
                  <IcoChevron s={14} />
                </button>
                {publicationTypeOpen && (
                  <div className="publication-options" role="listbox" aria-label="Tipo de publicación">
                    {BOARD_TYPES.map(type => {
                      const TypeIcon = type.icon;
                      const selected = newBoardPost.type === type.id;
                      return (
                        <button key={type.id} type="button" role="option" aria-selected={selected} className={selected ? 'selected' : ''}
                          onClick={() => { setNewBoardPost(post => ({ ...post, type: type.id })); setPublicationTypeOpen(false); }}>
                          <span className={`publication-type-icon ${type.id}`}><TypeIcon s={17} /></span>
                          <span><strong>{type.label}</strong><small>{type.detail}</small></span>
                          {selected && <IcoCheck s={13} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {newBoardPost.type === 'banner' ? (
                <div className="banner-form-note"><IcoGrid s={16} /><span><strong>Banner gráfico</strong>Se mostrará completo, sin título, texto ni filtros de color.</span></div>
              ) : (
                <>
                  <label className="form-label">Título</label>
                  <input className="field" value={newBoardPost.title} onChange={e => setNewBoardPost({ ...newBoardPost, title: e.target.value })} placeholder="Título de la publicación" required />
                  <label className="form-label">Mensaje</label>
                  <textarea className="field" value={newBoardPost.body} onChange={e => setNewBoardPost({ ...newBoardPost, body: e.target.value })} placeholder="Información para los colaboradores" required />
                </>
              )}
              <label className="form-label">{newBoardPost.type === 'banner' ? 'Imagen del banner (URL obligatoria)' : 'Imagen (URL opcional)'}</label>
              <input className="field" type="url" value={newBoardPost.imageUrl} onChange={e => setNewBoardPost({ ...newBoardPost, imageUrl: e.target.value })} placeholder="https://…" required={newBoardPost.type === 'banner'} />
              <label className="form-label">LINK URL <span className="optional-label">Opcional</span></label>
              <div className="link-url-field">
                <IcoChevron s={14} />
                <input className="field mono" type="url" value={newBoardPost.linkUrl} onChange={e => setNewBoardPost({ ...newBoardPost, linkUrl: e.target.value })} placeholder="https://portal.multival.com/comunicado" />
              </div>
              <p className="field-help">Si agregas un enlace, toda la publicación será interactiva y abrirá la comunicación en una pestaña nueva.</p>
              <button className="btn btn-primary" type="submit"><IcoPlus s={14} /> Publicar</button>
            </form>
            <div className="board-admin-list">
              <h3>Publicaciones activas</h3>
              {boardPosts.map(post => (
                <article key={post.id}>
                  <span className={`board-type ${post.type}`}>{post.type}</span>
                  <strong>{post.type === 'banner' ? 'Banner gráfico' : post.title}</strong>
                  <p>{post.type === 'banner' ? 'La imagen se presenta completa en el escritorio.' : post.body}</p>
                  {normalizeExternalUrl(post.linkUrl) && <a className="board-admin-link" href={normalizeExternalUrl(post.linkUrl)} target="_blank" rel="noopener noreferrer">Enlace configurado <IcoChevron s={10} /></a>}
                  <button className="icon-btn danger" onClick={() => deleteBoardPost(post.id)} title="Retirar publicación"><IcoTrash s={15} /></button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  };

  /* ======================================================================
     PERSONALIZACIÓN DEL ESCRITORIO
     ====================================================================== */
  const renderAppearancePanel = () => {
    if (!showAppearancePanel) return null;
    return (
      <div className="modal-overlay appearance-overlay" onMouseDown={() => setShowAppearancePanel(false)}>
        <section className="appearance-modal" onMouseDown={e => e.stopPropagation()}>
          <div className="modal-head">
            <div>
              <span className="login-kicker">Tu espacio de trabajo</span>
              <h2>Personalizar escritorio</h2>
            </div>
            <button className="modal-close" onClick={() => setShowAppearancePanel(false)}><IcoX s={14} /></button>
          </div>

          <div className="appearance-content">
            <div className={`appearance-live-preview wallpaper-${workspaceAppearance.wallpaper}`}>
              <div className="appearance-preview-bar" />
              <div className="appearance-preview-grid"><i /><i /><i /></div>
              <span>Vista previa en tiempo real</span>
            </div>

            <div className="appearance-section appearance-scenes-section">
              <div className="appearance-section-head"><strong>Escenas inteligentes</strong><span>Transforma todo el espacio con una sola decisión</span></div>
              <div className="appearance-scenes">
                {APPEARANCE_SCENES.map(scene => (
                  <button key={scene.id} className={`appearance-scene scene-${scene.id}`} onClick={() => { setTheme(scene.theme); setWorkspaceAppearance(current => ({ ...current, ...scene.settings })); }}>
                    <span className="scene-visual"><i /><i /><i /></span>
                    <span><strong>{scene.label}</strong><small>{scene.detail}</small></span>
                    <IcoChevron s={13} />
                  </button>
                ))}
              </div>
            </div>

            <div className="appearance-section">
              <div className="appearance-section-head"><strong>Fondo</strong><span>Elige la atmósfera del escritorio</span></div>
              <div className="wallpaper-options">
                {WALLPAPER_OPTIONS.map(option => (
                  <button key={option.id} className={`wallpaper-option ${workspaceAppearance.wallpaper === option.id ? 'selected' : ''}`}
                    onClick={() => setWorkspaceAppearance(current => ({ ...current, wallpaper: option.id }))}>
                    <span className={`wallpaper-thumb wallpaper-${option.id}`} />
                    <strong>{option.label}</strong><small>{option.detail}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="appearance-columns">
              <div className="appearance-section compact">
                <div className="appearance-section-head"><strong>Color de acento</strong><span>Botones y elementos activos</span></div>
                <div className="accent-options">
                  {ACCENT_COLORS.map(color => (
                    <button key={color.id} title={color.label} aria-label={color.label}
                      className={workspaceAppearance.accent === color.id ? 'selected' : ''}
                      style={{ '--accent-choice': color.hex }}
                      onClick={() => setWorkspaceAppearance(current => ({ ...current, accent: color.id }))} />
                  ))}
                </div>
              </div>
              <div className="appearance-section compact">
                <div className="appearance-section-head"><strong>Tema</strong><span>Claridad general</span></div>
                <div className="segmented-control">
                  <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}><IcoSun s={14} /> Claro</button>
                  <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}><IcoMoon s={14} /> Oscuro</button>
                </div>
              </div>
            </div>

            <div className="appearance-columns">
              <div className="appearance-section compact">
                <div className="appearance-section-head"><strong>Densidad del espacio</strong><span>Controla cuánto contenido ves</span></div>
                <div className="segmented-control three">
                  {[['compact', 'Compacta'], ['balanced', 'Equilibrada'], ['comfortable', 'Amplia']].map(([id, label]) => (
                    <button key={id} className={workspaceAppearance.density === id ? 'active' : ''} onClick={() => setWorkspaceAppearance(current => ({ ...current, density: id }))}>{label}</button>
                  ))}
                </div>
              </div>
              <div className="appearance-section compact">
                <div className="appearance-section-head"><strong>Forma de superficies</strong><span>Personalidad de tarjetas y ventanas</span></div>
                <div className="segmented-control three">
                  {[['precise', 'Precisa'], ['soft', 'Suave'], ['rounded', 'Redonda']].map(([id, label]) => (
                    <button key={id} className={workspaceAppearance.shape === id ? 'active' : ''} onClick={() => setWorkspaceAppearance(current => ({ ...current, shape: id }))}>{label}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="appearance-columns">
              <div className="appearance-section compact">
                <div className="appearance-section-head"><strong>Movimiento</strong><span>Animaciones del sistema</span></div>
                <div className="segmented-control">
                  <button className={workspaceAppearance.motion !== 'reduced' ? 'active' : ''} onClick={() => setWorkspaceAppearance(current => ({ ...current, motion: 'full' }))}>Dinámico</button>
                  <button className={workspaceAppearance.motion === 'reduced' ? 'active' : ''} onClick={() => setWorkspaceAppearance(current => ({ ...current, motion: 'reduced' }))}>Sereno</button>
                </div>
              </div>
              <div className="appearance-section compact">
                <div className="appearance-section-head"><strong>Escala del dock</strong><span>Presencia de los accesos</span></div>
                <div className="segmented-control three">
                  {[['compact', 'Pequeño'], ['normal', 'Medio'], ['large', 'Grande']].map(([id, label]) => (
                    <button key={id} className={workspaceAppearance.dockScale === id ? 'active' : ''} onClick={() => setWorkspaceAppearance(current => ({ ...current, dockScale: id }))}>{label}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="appearance-columns">
              <div className="appearance-section compact">
                <div className="appearance-section-head"><strong>Contraste</strong><span>Legibilidad de superficies</span></div>
                <div className="segmented-control three">
                  {[['soft', 'Suave'], ['balanced', 'Medio'], ['high', 'Alto']].map(([id, label]) => (
                    <button key={id} className={workspaceAppearance.contrast === id ? 'active' : ''}
                      onClick={() => setWorkspaceAppearance(current => ({ ...current, contrast: id }))}>{label}</button>
                  ))}
                </div>
              </div>
              <div className="appearance-section compact">
                <div className="appearance-section-head"><strong>Transparencia</strong><span>Profundidad del cristal</span></div>
                <div className="segmented-control">
                  <button className={workspaceAppearance.transparency === 'glass' ? 'active' : ''}
                    onClick={() => setWorkspaceAppearance(current => ({ ...current, transparency: 'glass' }))}>Cristal</button>
                  <button className={workspaceAppearance.transparency === 'solid' ? 'active' : ''}
                    onClick={() => setWorkspaceAppearance(current => ({ ...current, transparency: 'solid' }))}>Sólido</button>
                </div>
              </div>
            </div>

            <div className="appearance-section clock-style-section">
              <div className="appearance-section-head"><strong>Estilo del reloj</strong><span>Personalízalo como en la pantalla del iPhone</span></div>
              <div className="clock-style-options">
                {[
                  ['minimal', 'Minimal', '09:41'],
                  ['rounded', 'Redondo', '09:41'],
                  ['mono', 'Digital', '09:41'],
                  ['outline', 'Contorno', '09:41'],
                ].map(([id, label, sample]) => (
                  <button key={id} className={`${id} ${workspaceAppearance.clockStyle === id ? 'selected' : ''}`}
                    onClick={() => setWorkspaceAppearance(current => ({ ...current, clockStyle: id }))}>
                    <strong>{sample}</strong><span>{label}</span>
                  </button>
                ))}
              </div>
              <div className="clock-format-row">
                <div><strong>Formato horario</strong><span>Elige entre reloj de 12 o 24 horas</span></div>
                <div className="segmented-control">
                  <button className={workspaceAppearance.clockFormat === '12' ? 'active' : ''}
                    onClick={() => setWorkspaceAppearance(current => ({ ...current, clockFormat: '12' }))}>12 horas</button>
                  <button className={workspaceAppearance.clockFormat !== '12' ? 'active' : ''}
                    onClick={() => setWorkspaceAppearance(current => ({ ...current, clockFormat: '24' }))}>24 horas</button>
                </div>
              </div>
            </div>
          </div>

          <div className="appearance-footer">
            <button className="btn btn-secondary" onClick={() => { setWorkspaceAppearance(DEFAULT_APPEARANCE); setTheme('light'); }}>Restaurar</button>
            <button className="btn btn-primary" onClick={() => setShowAppearancePanel(false)}>Listo</button>
          </div>
        </section>
      </div>
    );
  };

  const renderWidgetGallery = () => {
    if (!showWidgetGallery) return null;
    return (
      <div className="modal-overlay widget-overlay" onMouseDown={() => setShowWidgetGallery(false)}>
        <section className="widget-gallery-modal" onMouseDown={e => e.stopPropagation()}>
          <div className="modal-head">
            <div><span className="login-kicker">Tu escritorio</span><h2>Galería de widgets</h2></div>
            <button className="modal-close" onClick={() => setShowWidgetGallery(false)}><IcoX s={14} /></button>
          </div>
          <div className="widget-gallery-intro">
            <strong>Haz que el escritorio trabaje para ti.</strong>
            <span>Añade o retira widgets cuando quieras. La selección queda guardada en tu perfil.</span>
          </div>
          <div className="widget-gallery-grid">
            {WIDGET_CATALOG.map(widget => {
              const WidgetIcon = widget.icon;
              const added = enabledWidgets.includes(widget.id);
              return (
                <article key={widget.id} className={added ? 'added' : ''}>
                  <div className="widget-gallery-icon"><WidgetIcon s={22} /></div>
                  <div><strong>{widget.label}</strong><p>{widget.detail}</p></div>
                  <button className={added ? 'remove' : ''} onClick={() => toggleWidget(widget.id)}>{added ? 'Quitar' : 'Añadir'}</button>
                </article>
              );
            })}
          </div>
          <div className="widget-gallery-footer"><span>{enabledWidgets.length} widget{enabledWidgets.length === 1 ? '' : 's'} en tu escritorio</span><button className="btn btn-primary" onClick={() => setShowWidgetGallery(false)}>Listo</button></div>
        </section>
      </div>
    );
  };

  const renderProfileEditor = () => {
    if (!showProfileEditor) return null;
    return (
      <div className="modal-overlay profile-overlay" onMouseDown={() => setShowProfileEditor(false)}>
        <section className="profile-modal" onMouseDown={e => e.stopPropagation()}>
          <div className="profile-cover"><span className="profile-avatar-large">{initialsOf(welcomeName)}</span></div>
          <div className="modal-head profile-modal-head">
            <div><span className="login-kicker">Perfil personal</span><h2>Personaliza tu bienvenida</h2></div>
            <button className="modal-close" onClick={() => setShowProfileEditor(false)}><IcoX s={14} /></button>
          </div>
          <div className="profile-form">
            <label><span>Nombre que quieres ver</span><input className="field" value={profilePreferences.displayName} maxLength={40} onChange={e => setProfilePreferences(current => ({ ...current, displayName: e.target.value }))} placeholder={userData.usuario} /></label>
            <label><span>Cargo o área</span><input className="field" value={profilePreferences.roleLabel} maxLength={60} onChange={e => setProfilePreferences(current => ({ ...current, roleLabel: e.target.value }))} placeholder={userData.rolGlobal} /></label>
            <label><span>Mensaje personal del escritorio</span><textarea className="field" value={profilePreferences.welcomeMessage} maxLength={150} onChange={e => setProfilePreferences(current => ({ ...current, welcomeMessage: e.target.value }))} placeholder="Ejemplo: Hoy es un buen día para convertir ideas en resultados." /></label>
            <p>Tu usuario de red y tus permisos no cambian. Esta información solo personaliza tu experiencia.</p>
          </div>
          <div className="appearance-footer">
            <button className="btn btn-secondary" onClick={() => setProfilePreferences({ displayName: '', roleLabel: '', welcomeMessage: '' })}>Restaurar</button>
            <button className="btn btn-primary" onClick={() => setShowProfileEditor(false)}>Guardar perfil</button>
          </div>
        </section>
      </div>
    );
  };

  const renderTeamEditor = () => {
    if (!showTeamEditor) return null;
    const availableUsers = usersList.filter(user => !['inactivo', 'bloqueado', 'suspendido'].includes(String(user.estado || '').toLowerCase()));
    return (
      <div className="modal-overlay team-editor-overlay" onMouseDown={() => setShowTeamEditor(false)}>
        <section className="team-editor-modal" onMouseDown={e => e.stopPropagation()}>
          <div className="modal-head">
            <div><span className="login-kicker">Organización</span><h2>{teamDraft.id ? 'Gestionar equipo' : 'Crear equipo de trabajo'}</h2></div>
            <button className="modal-close" onClick={() => setShowTeamEditor(false)}><IcoX s={14} /></button>
          </div>
          <form className="team-editor-form" onSubmit={saveTeam}>
            <label><span>Nombre del equipo</span><input className="field" value={teamDraft.name} onChange={e => setTeamDraft(current => ({ ...current, name: e.target.value }))} placeholder="Ej. Analítica Comercial" required /></label>
            <label><span>Líder responsable</span>
              <select className="field" value={teamDraft.leaderId} onChange={e => setTeamDraft(current => ({ ...current, leaderId: e.target.value, memberIds: [...new Set([...current.memberIds, e.target.value])] }))} required>
                <option value="">Selecciona un líder</option>
                {availableUsers.map(user => <option key={user.idRed} value={user.idRed}>{user.nombre || user.idRed} ({user.idRed})</option>)}
              </select>
            </label>
            <div className="team-member-picker">
              <div className="team-field-title"><span>Integrantes</span><small>{new Set([...teamDraft.memberIds, teamDraft.leaderId].filter(Boolean)).size} seleccionados</small></div>
              <div className="team-member-options">
                {availableUsers.map(user => {
                  const checked = teamDraft.memberIds.some(id => id.toUpperCase() === String(user.idRed).toUpperCase()) || String(teamDraft.leaderId).toUpperCase() === String(user.idRed).toUpperCase();
                  const leader = String(teamDraft.leaderId).toUpperCase() === String(user.idRed).toUpperCase();
                  return (
                    <label key={user.idRed} className={checked ? 'selected' : ''}>
                      <input type="checkbox" checked={checked} disabled={leader} onChange={() => toggleTeamDraftMember(user.idRed)} />
                      <span className="team-person-avatar">{initialsOf(user.nombre || user.idRed)}</span>
                      <span><strong>{user.nombre || user.idRed}</strong><small>{user.idRed} · {user.correo || 'Sin correo'}</small></span>
                      {leader && <b>Líder</b>}
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="team-editor-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowTeamEditor(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={teamsLoading}>{teamsLoading ? 'Guardando…' : 'Guardar equipo'}</button>
            </div>
          </form>
        </section>
      </div>
    );
  };

  const renderTeams = () => {
    const teamTasks = selectedTeam?.tasks || [];
    const totalTasks = teamTasks.length;
    const completed = teamTasks.filter(task => task.status === 'completada').length;
    const inProgress = teamTasks.filter(task => task.status === 'en_progreso').length;
    const openTasks = teamTasks.filter(task => task.status !== 'completada');
    const overdueTasks = openTasks.filter(task => task.dueDate && task.dueDate < todayKey);
    const highPriorityTasks = openTasks.filter(task => task.priority === 'alta');
    const completion = totalTasks ? Math.round(completed / totalTasks * 100) : 0;
    const userId = String(userData?.usuario || '').toUpperCase();
    const memberName = id => selectedTeam?.members.find(member => member.userId.toUpperCase() === String(id).toUpperCase())?.name || id;
    const filteredTeamTasks = teamTaskFilter === 'all' ? teamTasks : teamTasks.filter(task => task.status === teamTaskFilter);
    const upcomingDeadlines = openTasks.filter(task => task.dueDate).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);
    const workload = (selectedTeam?.members || []).map(member => {
      const assigned = teamTasks.filter(task => String(task.assignedTo).toUpperCase() === member.userId.toUpperCase());
      return { ...member, total: assigned.length, open: assigned.filter(task => task.status !== 'completada').length, completed: assigned.filter(task => task.status === 'completada').length };
    }).sort((a, b) => b.open - a.open || b.total - a.total);
    const maxWorkload = Math.max(1, ...workload.map(member => member.open));
    const calendarFirst = new Date(teamCalendarMonth.getFullYear(), teamCalendarMonth.getMonth(), 1);
    const calendarOffset = (calendarFirst.getDay() + 6) % 7;
    const calendarStart = new Date(calendarFirst);
    calendarStart.setDate(calendarFirst.getDate() - calendarOffset);
    const teamCalendarDays = Array.from({ length: 42 }, (_, index) => {
      const day = new Date(calendarStart);
      day.setDate(calendarStart.getDate() + index);
      return day;
    });
    const selectedDayTasks = teamTasks.filter(task => task.dueDate === teamCalendarDate);
    const selectedCalendarDate = new Date(`${teamCalendarDate}T12:00:00`);

    return (
      <div className="teams-page enter">
        <section className="teams-header">
          <div>
            <span className="analytics-eyebrow"><IcoUsers s={15} /> Dirección y seguimiento</span>
            <h2>Equipos de trabajo</h2>
            <p>Una vista ejecutiva de responsabilidades, capacidad, fechas críticas y avance real.</p>
          </div>
          <div className="teams-header-actions">
            <button className="btn btn-secondary" onClick={() => fetchTeams()} disabled={teamsLoading}><IcoRefresh s={15} /> Actualizar</button>
            {isAdmin && <button className="btn btn-primary" onClick={openNewTeamEditor}><IcoPlus s={15} /> Crear equipo</button>}
          </div>
        </section>

        {teamsError && <div className="teams-alert"><IcoShield s={17} /><span><strong>No fue posible completar la operación.</strong>{teamsError}</span><button onClick={() => setTeamsError('')}><IcoX s={11} /></button></div>}
        {teamsLoading && teams.length === 0 && <div className="teams-loading"><span className="spinner" /> Sincronizando equipos…</div>}
        {!teamsLoading && teams.length === 0 ? (
          <section className="teams-empty"><span><IcoUsers s={32} /></span><h3>Aún no tienes equipos asignados</h3><p>{isAdmin ? 'Crea el primer equipo, elige su líder y agrega integrantes desde el directorio.' : 'Cuando te asignen a un equipo aparecerá aquí junto con tus tareas.'}</p>{isAdmin && <button className="btn btn-primary" onClick={openNewTeamEditor}>Crear primer equipo</button>}</section>
        ) : (
          <div className="teams-layout executive">
            <aside className="team-list-panel">
              <div className="team-list-heading"><div><span>Portafolio de equipos</span><strong>{teams.length} activos</strong></div><small>{teams.length}</small></div>
              <div className="team-list">
                {teams.map(team => {
                  const teamCompleted = team.tasks.filter(task => task.status === 'completada').length;
                  const teamOpen = team.tasks.length - teamCompleted;
                  const percent = team.tasks.length ? Math.round(teamCompleted / team.tasks.length * 100) : 0;
                  return (
                    <button key={team.id} className={selectedTeam?.id === team.id ? 'active' : ''} onClick={() => {
                      setSelectedTeamId(team.id);
                      setTeamSection('overview');
                      setTeamTaskDraft(current => ({ ...current, assignedTo: team.members[0]?.userId || '' }));
                    }}>
                      <span className="team-list-avatar">{initialsOf(team.name)}</span>
                      <span className="team-list-copy"><strong>{team.name}</strong><small>{team.leaderName || team.leaderId}</small><i><b style={{ width: `${percent}%` }} /></i><em>{teamOpen} abiertas · {percent}% completado</em></span>
                      <IcoChevron s={14} />
                    </button>
                  );
                })}
              </div>
            </aside>

            {selectedTeam && <section className="team-workspace-panel">
              <div className="team-executive-hero">
                <div className="team-overview-copy"><span className="team-status-dot" /><small>Equipo activo</small><h3>{selectedTeam.name}</h3><p>Líder: <strong>{selectedTeam.leaderName}</strong> · {selectedTeam.leaderId}</p></div>
                <div className="team-hero-progress"><div className="team-progress-ring" style={{ '--team-progress': `${completion * 3.6}deg` }}><span><strong>{completion}%</strong><small>avance</small></span></div><div><strong>{completed} de {totalTasks}</strong><span>tareas completadas</span></div></div>
                {canManageSelectedTeam && <div className="team-overview-actions"><button className="btn btn-primary team-report-button" onClick={() => downloadTeamManagementPdf(selectedTeam)}><IcoDownload s={15} /> Informe PDF</button><button className="btn btn-secondary" onClick={() => openExistingTeamEditor(selectedTeam)}><IcoEdit s={15} /> Gestionar equipo</button>{isAdmin && <button className="icon-btn danger" onClick={() => removeTeam(selectedTeam)} title="Eliminar equipo"><IcoTrash s={16} /></button>}</div>}
              </div>

              <nav className="team-section-tabs" aria-label="Secciones del equipo">
                <button className={teamSection === 'overview' ? 'active' : ''} onClick={() => setTeamSection('overview')}><IcoChart s={15} /> Resumen ejecutivo</button>
                <button className={teamSection === 'tasks' ? 'active' : ''} onClick={() => setTeamSection('tasks')}><IcoCheck s={15} /> Tareas <span>{openTasks.length}</span></button>
                <button className={teamSection === 'calendar' ? 'active' : ''} onClick={() => setTeamSection('calendar')}><IcoCal s={15} /> Calendario</button>
                <button className={teamSection === 'people' ? 'active' : ''} onClick={() => setTeamSection('people')}><IcoUsers s={15} /> Personas <span>{selectedTeam.members.length}</span></button>
              </nav>

              {teamSection === 'overview' && <div className="team-executive-content">
                <section className="team-kpi-grid">
                  <article><span className="team-kpi-icon green"><IcoCheck s={18} /></span><div><small>Cumplimiento</small><strong>{completion}%</strong><p>{completed} tareas finalizadas</p></div></article>
                  <article><span className="team-kpi-icon navy"><IcoPulse s={18} /></span><div><small>En ejecución</small><strong>{inProgress}</strong><p>{openTasks.length} compromisos abiertos</p></div></article>
                  <article className={overdueTasks.length ? 'risk' : ''}><span className="team-kpi-icon red"><IcoClock s={18} /></span><div><small>Vencidas</small><strong>{overdueTasks.length}</strong><p>{overdueTasks.length ? 'Requieren atención' : 'Sin retrasos activos'}</p></div></article>
                  <article><span className="team-kpi-icon amber"><IcoBell s={18} /></span><div><small>Prioridad alta</small><strong>{highPriorityTasks.length}</strong><p>Dentro de la carga abierta</p></div></article>
                </section>

                <section className="team-insight-grid">
                  <article className="team-insight-card status-chart-card">
                    <header><div><span>Distribución del trabajo</span><h4>Estado de las tareas</h4></div><small>{totalTasks} totales</small></header>
                    <div className="team-status-chart">
                      <div className="team-donut" style={{ '--done': `${completion * 3.6}deg`, '--progress': `${(completion + (totalTasks ? inProgress / totalTasks * 100 : 0)) * 3.6}deg` }}><span><strong>{openTasks.length}</strong><small>abiertas</small></span></div>
                      <div className="team-chart-legend"><span><i className="pending" /> Pendientes <b>{teamTasks.filter(task => task.status === 'pendiente').length}</b></span><span><i className="progress" /> En progreso <b>{inProgress}</b></span><span><i className="done" /> Completadas <b>{completed}</b></span></div>
                    </div>
                  </article>

                  <article className="team-insight-card workload-card">
                    <header><div><span>Capacidad del equipo</span><h4>Carga abierta por persona</h4></div><small>{selectedTeam.members.length} personas</small></header>
                    <div className="team-workload-list">
                      {workload.length === 0 ? <p className="team-empty-copy">Sin integrantes disponibles.</p> : workload.slice(0, 6).map(member => <div key={member.userId}><span className="team-person-avatar">{initialsOf(member.name || member.userId)}</span><span><strong>{member.name}</strong><small>{member.open} abiertas · {member.completed} completadas</small><i><b style={{ width: `${member.open ? Math.max(8, member.open / maxWorkload * 100) : 0}%` }} /></i></span><em>{member.open}</em></div>)}
                    </div>
                  </article>
                </section>

                <section className="team-insight-grid lower">
                  <article className="team-insight-card deadline-card">
                    <header><div><span>Agenda crítica</span><h4>Próximos vencimientos</h4></div><button onClick={() => setTeamSection('calendar')}>Ver calendario <IcoChevron s={12} /></button></header>
                    <div className="team-deadline-list">
                      {upcomingDeadlines.length === 0 ? <p className="team-empty-copy">No hay fechas límite registradas.</p> : upcomingDeadlines.map(task => <button key={task.id} onClick={() => { setTeamCalendarDate(task.dueDate); setTeamCalendarMonth(new Date(`${task.dueDate}T12:00:00`)); setTeamSection('calendar'); }}><time className={task.dueDate < todayKey ? 'overdue' : ''}><strong>{new Date(`${task.dueDate}T12:00:00`).getDate()}</strong><small>{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('es-CO', { month: 'short' })}</small></time><span><strong>{task.title}</strong><small>{memberName(task.assignedTo)} · {TEAM_STATUS_LABELS[task.status]}</small></span><span className={`team-priority-pill ${task.priority}`}>{task.priority}</span></button>)}
                    </div>
                  </article>
                  <article className="team-insight-card leader-brief-card">
                    <header><div><span>Lectura ejecutiva</span><h4>Señales para el líder</h4></div><IcoPulse s={19} /></header>
                    <div className="leader-brief">
                      <p className={overdueTasks.length ? 'warning' : 'positive'}><IcoClock s={15} /><span><strong>{overdueTasks.length ? `${overdueTasks.length} tarea${overdueTasks.length === 1 ? '' : 's'} vencida${overdueTasks.length === 1 ? '' : 's'}` : 'Cronograma bajo control'}</strong><small>{overdueTasks.length ? 'Prioriza desbloqueos y acuerdos de recuperación.' : 'No se identifican retrasos activos.'}</small></span></p>
                      <p className={highPriorityTasks.length > 2 ? 'warning' : 'neutral'}><IcoBell s={15} /><span><strong>{highPriorityTasks.length} compromisos de prioridad alta</strong><small>Revisa que la capacidad esté distribuida de forma sostenible.</small></span></p>
                      <p className="neutral"><IcoUsers s={15} /><span><strong>{workload[0]?.name || 'Sin carga registrada'}</strong><small>{workload[0]?.open ? `Concentra la mayor carga abierta: ${workload[0].open} tareas.` : 'Aún no hay información suficiente de carga.'}</small></span></p>
                    </div>
                  </article>
                </section>
              </div>}

              {teamSection === 'tasks' && <div className="team-tasks-section">
                {canManageSelectedTeam && <form className="team-task-composer executive" onSubmit={addTeamTask}>
                  <div className="team-task-composer-head"><span><IcoPlus s={16} /></span><div><strong>Asignar una tarea</strong><small>La persona responsable será la única autorizada para cambiar su estado.</small></div></div>
                  <label><span>Tarea</span><input className="field" value={teamTaskDraft.title} onChange={e => setTeamTaskDraft(current => ({ ...current, title: e.target.value }))} placeholder="Resultado esperado" required /></label>
                  <label><span>Detalle</span><input className="field" value={teamTaskDraft.description} onChange={e => setTeamTaskDraft(current => ({ ...current, description: e.target.value }))} placeholder="Contexto o entregable" /></label>
                  <label><span>Responsable</span><select className="field" value={teamTaskDraft.assignedTo} onChange={e => setTeamTaskDraft(current => ({ ...current, assignedTo: e.target.value }))} required><option value="">Seleccionar</option>{selectedTeam.members.map(member => <option key={member.userId} value={member.userId}>{member.name} ({member.userId})</option>)}</select></label>
                  <label><span>Fecha límite</span><input className="field" type="date" value={teamTaskDraft.dueDate} onChange={e => setTeamTaskDraft(current => ({ ...current, dueDate: e.target.value }))} /></label>
                  <label><span>Prioridad</span><select className="field" value={teamTaskDraft.priority} onChange={e => setTeamTaskDraft(current => ({ ...current, priority: e.target.value }))}><option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option></select></label>
                  <button className="btn btn-primary" type="submit" disabled={teamsLoading}>Asignar tarea</button>
                </form>}

                <div className="team-task-list-head"><div><span>Control operativo</span><h4>Listado de tareas</h4></div><div className="team-task-filters">{[{ id: 'all', label: 'Todas' }, ...TEAM_TASK_COLUMNS].map(filter => <button key={filter.id} className={teamTaskFilter === filter.id ? 'active' : ''} onClick={() => setTeamTaskFilter(filter.id)}>{filter.label}<span>{filter.id === 'all' ? totalTasks : teamTasks.filter(task => task.status === filter.id).length}</span></button>)}</div></div>
                <div className="team-executive-task-list">
                  {filteredTeamTasks.length === 0 ? <div className="team-task-list-empty"><IcoCheck s={24} /><strong>Sin tareas en esta vista</strong><span>Cambia el filtro o asigna una nueva responsabilidad.</span></div> : filteredTeamTasks.map(task => {
                    const isAssignee = String(task.assignedTo).toUpperCase() === userId;
                    const isOverdue = task.status !== 'completada' && task.dueDate && task.dueDate < todayKey;
                    return <article key={task.id} className={`team-executive-task priority-${task.priority} ${isOverdue ? 'overdue' : ''}`}><span className="team-task-priority-line" /><div className="team-task-main"><div><span className={`team-priority-pill ${task.priority}`}>{task.priority}</span><span className={`team-status-pill ${task.status}`}>{TEAM_STATUS_LABELS[task.status]}</span>{isOverdue && <span className="team-overdue-pill">Vencida</span>}</div><h4>{task.title}</h4><p>{task.description || 'Sin descripción adicional.'}</p></div><div className="team-task-assignee"><span className="team-person-avatar">{initialsOf(memberName(task.assignedTo))}</span><div><small>Responsable</small><strong>{memberName(task.assignedTo)}</strong><span>{task.assignedTo}</span></div></div><div className="team-task-date"><IcoCal s={16} /><div><small>Fecha límite</small><strong>{task.dueDate ? new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sin fecha'}</strong></div></div><div className="team-task-status-control">{isAssignee ? <><small>Actualizar mi estado</small><div>{TEAM_TASK_COLUMNS.map(status => <button key={status.id} className={task.status === status.id ? 'active' : ''} disabled={task.status === status.id} onClick={() => updateTeamTaskStatus(task, status.id)} title={status.label}>{status.id === 'pendiente' ? 'Por hacer' : status.id === 'en_progreso' ? 'En curso' : 'Finalizar'}</button>)}</div></> : <><small>Estado gestionado por</small><strong>{memberName(task.assignedTo)}</strong><span>Solo el responsable puede actualizarlo.</span></>}</div></article>;
                  })}
                </div>
              </div>}

              {teamSection === 'calendar' && <div className="team-calendar-section">
                <section className="team-calendar-card">
                  <header><div><span>Planeación del equipo</span><h4>{teamCalendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h4></div><div><button onClick={() => setTeamCalendarMonth(month => new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Mes anterior">‹</button><button className="today" onClick={() => { const now = new Date(); setTeamCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1)); setTeamCalendarDate(dateKey(now)); }}>Hoy</button><button onClick={() => setTeamCalendarMonth(month => new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Mes siguiente">›</button></div></header>
                  <div className="team-calendar-weekdays">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => <span key={day}>{day}</span>)}</div>
                  <div className="team-calendar-grid">{teamCalendarDays.map(day => {
                    const key = dateKey(day);
                    const dayTasks = teamTasks.filter(task => task.dueDate === key);
                    const isOutside = day.getMonth() !== teamCalendarMonth.getMonth();
                    return <button key={key} className={`${isOutside ? 'outside' : ''} ${key === teamCalendarDate ? 'selected' : ''} ${key === todayKey ? 'today' : ''}`} onClick={() => setTeamCalendarDate(key)}><span>{day.getDate()}</span>{dayTasks.length > 0 && <div>{dayTasks.slice(0, 3).map(task => <i key={task.id} className={`${task.priority} ${task.status}`} />)}{dayTasks.length > 3 && <small>+{dayTasks.length - 3}</small>}</div>}</button>;
                  })}</div>
                </section>
                <aside className="team-day-agenda">
                  <span className="team-agenda-eyebrow">Agenda seleccionada</span><h4>{selectedCalendarDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h4><p>{selectedDayTasks.length} compromiso{selectedDayTasks.length === 1 ? '' : 's'} programado{selectedDayTasks.length === 1 ? '' : 's'}</p>
                  <div className="team-day-task-list">{selectedDayTasks.length === 0 ? <div className="team-calendar-empty"><IcoCal s={25} /><strong>Día disponible</strong><span>No hay tareas con vencimiento en esta fecha.</span></div> : selectedDayTasks.map(task => <article key={task.id} className={`priority-${task.priority}`}><div><span className={`team-priority-pill ${task.priority}`}>{task.priority}</span><span className={`team-status-pill ${task.status}`}>{TEAM_STATUS_LABELS[task.status]}</span></div><h5>{task.title}</h5><p>{memberName(task.assignedTo)}</p></article>)}</div>
                  {canManageSelectedTeam && <button className="btn btn-primary team-calendar-assign" onClick={() => { setTeamTaskDraft(current => ({ ...current, dueDate: teamCalendarDate })); setTeamSection('tasks'); }}>Asignar tarea para esta fecha</button>}
                </aside>
              </div>}

              {teamSection === 'people' && <div className="team-people-section">
                <div className="team-people-heading"><div><span>Estructura del equipo</span><h4>Personas y capacidad</h4></div>{canManageSelectedTeam && <button className="btn btn-secondary" onClick={() => openExistingTeamEditor(selectedTeam)}><IcoEdit s={15} /> Gestionar integrantes</button>}</div>
                <div className="team-people-grid">{workload.map(member => <article key={member.userId} className={member.role === 'Lider' ? 'leader' : ''}><span className="team-person-avatar large">{initialsOf(member.name || member.userId)}</span><div><span>{member.role === 'Lider' ? 'Líder del equipo' : 'Integrante'}</span><h4>{member.name}</h4><p>{member.email || member.userId}</p></div><div className="team-person-stats"><span><strong>{member.open}</strong><small>Abiertas</small></span><span><strong>{member.completed}</strong><small>Completadas</small></span><span><strong>{member.total ? Math.round(member.completed / member.total * 100) : 0}%</strong><small>Cumplimiento</small></span></div></article>)}</div>
              </div>}
            </section>}
          </div>
        )}
      </div>
    );
  };

  /* ======================================================================
     VISTAS ADMIN
     ====================================================================== */
  const renderAnalytics = () => {
    const summary = analyticsData?.summary || {};
    const daily = analyticsData?.daily || [];
    const topApps = analyticsData?.topApps || [];
    const views = analyticsData?.views || [];
    const recentEvents = analyticsData?.recent || [];
    const leadingApp = topApps[0];
    const leadingCatalogApp = leadingApp ? appsList.find(app => String(app.id) === String(leadingApp.id)) : null;
    const leadingSystemApp = leadingApp ? SYSTEM_APPS.find(app => `sys-${app.sys}` === String(leadingApp.id)) : null;
    const leadingIconApp = leadingCatalogApp || (leadingSystemApp ? { nombre: leadingSystemApp.nombre, grad: leadingSystemApp.grad, sysIcon: leadingSystemApp.icon } : { nombre: leadingApp?.name || 'App' });
    const maxDaily = Math.max(1, ...daily.map(day => Math.max(day.totalSeconds || 0, (day.appOpens || 0) * 60)));
    const maxAppUsage = Math.max(1, ...topApps.map(app => app.totalSeconds || 0));
    const maxViewCount = Math.max(1, ...views.map(view => view.count || 0));
    const activityPageSize = 10;
    const activityPageCount = Math.max(1, Math.ceil(recentEvents.length / activityPageSize));
    const activityPage = Math.min(analyticsActivityPage, activityPageCount - 1);
    const activityStart = activityPage * activityPageSize;
    const visibleRecentEvents = recentEvents.slice(activityStart, activityStart + activityPageSize);
    const eventLabels = {
      session_start: 'Inició sesión', app_open: 'Abrió una aplicación', app_usage: 'Usó una aplicación',
      view_open: 'Visitó una sección', board_click: 'Abrió una publicación',
    };

    return (
      <div className="analytics-page enter">
        <section className="analytics-header">
          <div>
            <span className="analytics-eyebrow"><IcoPulse s={14} /> Inteligencia del ecosistema</span>
            <h2>Dashboard administrativo</h2>
            <p>Adopción, actividad y tiempo efectivo de uso de todo el Hub en una sola vista.</p>
          </div>
          <div className="analytics-actions">
            <div className="analytics-range" aria-label="Periodo de análisis">
              {[7, 30, 90].map(days => <button key={days} className={analyticsRange === days ? 'active' : ''} onClick={() => setAnalyticsRange(days)}>{days} días</button>)}
            </div>
            <button className="analytics-refresh" onClick={fetchAnalytics} disabled={analyticsLoading}><IcoRefresh s={15} /> {analyticsLoading ? 'Actualizando…' : 'Actualizar'}</button>
          </div>
        </section>

        {analyticsError && <div className="analytics-alert"><IcoShield s={16} /><span><strong>La analítica aún no está disponible.</strong>{analyticsError} Verifica que el nuevo <code>Code.gs</code> esté desplegado.</span></div>}
        {analyticsLoading && !analyticsData && <div className="analytics-loading"><span className="spinner" /><div><strong>Preparando la inteligencia del ecosistema</strong><small>Consolidando sesiones, aplicaciones y tiempos de uso…</small></div></div>}

        <section className="analytics-metrics">
          <article><span className="metric-icon green"><IcoUsers s={19} /></span><div><small>Usuarios únicos</small><strong>{summary.uniqueUsers || 0}</strong><p>{summary.activeToday || 0} activos hoy</p></div></article>
          <article><span className="metric-icon navy"><IcoLoginArrow /></span><div><small>Sesiones iniciadas</small><strong>{summary.sessions || 0}</strong><p>En los últimos {analyticsRange} días</p></div></article>
          <article><span className="metric-icon violet"><IcoGrid s={19} /></span><div><small>Aperturas de apps</small><strong>{summary.appOpens || 0}</strong><p>{topApps.length} herramientas utilizadas</p></div></article>
          <article><span className="metric-icon gold"><IcoClock s={19} /></span><div><small>Tiempo efectivo</small><strong>{formatUsageTime(summary.totalSeconds || 0)}</strong><p>Solo ventanas activas y visibles</p></div></article>
          <article><span className="metric-icon coral"><IcoBell s={19} /></span><div><small>Comunicaciones abiertas</small><strong>{summary.boardClicks || 0}</strong><p>Interacciones con el tablero</p></div></article>
        </section>

        <section className="analytics-main-grid">
          <article className="analytics-card usage-leader">
            <div className="analytics-card-head"><div><span>Mayor uso acumulado</span><h3>Aplicativo líder</h3></div><IcoChart s={20} /></div>
            {leadingApp ? (
              <>
                <div className="leader-app"><AppIcon app={leadingIconApp} size={58} /><div><small>{leadingApp.group || 'Sin grupo'}</small><strong>{leadingApp.name}</strong><span>{leadingApp.users || 0} usuarios · {leadingApp.opens || 0} aperturas</span></div></div>
                <div className="leader-time"><strong>{formatUsageTime(leadingApp.totalSeconds)}</strong><span>de uso efectivo</span></div>
                <div className="leader-progress"><i style={{ width: `${Math.max(6, (leadingApp.totalSeconds / maxAppUsage) * 100)}%` }} /></div>
              </>
            ) : <div className="analytics-empty"><IcoChart s={28} /><span>Aún no hay tiempo de uso registrado.</span></div>}
          </article>

          <article className="analytics-card activity-chart-card">
            <div className="analytics-card-head"><div><span>Comportamiento diario</span><h3>Actividad del ecosistema</h3></div><small>Tiempo y aperturas</small></div>
            <div className="activity-chart">
              {daily.length === 0 ? <div className="analytics-empty"><IcoPulse s={28} /><span>Los datos diarios aparecerán aquí.</span></div> : daily.map(day => {
                const chartValue = Math.max(day.totalSeconds || 0, (day.appOpens || 0) * 60);
                return <div key={day.date} className="activity-bar" title={`${day.appOpens || 0} aperturas · ${formatUsageTime(day.totalSeconds || 0)}`}><span><i style={{ height: `${Math.max(5, chartValue / maxDaily * 100)}%` }} /></span><small>{new Date(`${day.date}T12:00:00`).toLocaleDateString('es-CO', { weekday: 'narrow', day: 'numeric' })}</small></div>;
              })}
            </div>
            <div className="chart-legend"><span><i /> Tiempo efectivo / actividad</span><strong>{formatUsageTime(summary.totalSeconds || 0)} acumuladas</strong></div>
          </article>
        </section>

        <section className="analytics-detail-grid">
          <article className="analytics-card top-apps-card">
            <div className="analytics-card-head"><div><span>Portafolio digital</span><h3>Uso por aplicativo</h3></div><small>Top {Math.min(topApps.length, 8)}</small></div>
            <div className="top-app-list">
              {topApps.length === 0 ? <div className="analytics-empty"><IcoGrid s={25} /><span>Sin aplicativos utilizados en este periodo.</span></div> : topApps.slice(0, 8).map((app, index) => (
                <div className="top-app-row" key={`${app.id}-${app.name}`}>
                  <span className="top-position">{String(index + 1).padStart(2, '0')}</span>
                  <div className="top-app-copy"><strong>{app.name}</strong><small>{app.group || 'Sin grupo'} · {app.opens || 0} aperturas · {app.users || 0} usuarios</small><span><i style={{ width: `${Math.max(4, (app.totalSeconds || 0) / maxAppUsage * 100)}%` }} /></span></div>
                  <b>{formatUsageTime(app.totalSeconds || 0)}</b>
                </div>
              ))}
            </div>
          </article>

          <article className="analytics-card view-card">
            <div className="analytics-card-head"><div><span>Navegación interna</span><h3>Secciones más visitadas</h3></div><IcoDesktopIco s={19} /></div>
            <div className="view-list">
              {views.length === 0 ? <div className="analytics-empty"><IcoDesktopIco s={25} /><span>Sin navegación registrada.</span></div> : views.slice(0, 6).map(view => (
                <div key={view.name}><span><strong>{view.label || view.name}</strong><small>{view.count} visitas</small></span><i><b style={{ width: `${Math.max(5, view.count / maxViewCount * 100)}%` }} /></i></div>
              ))}
            </div>
          </article>
        </section>

        <section className="analytics-card recent-activity-card">
          <div className="analytics-card-head">
            <div><span>Trazabilidad</span><h3>Actividad reciente</h3></div>
            <div className="analytics-table-toolbar">
              <small>{recentEvents.length ? `${activityStart + 1}–${Math.min(activityStart + activityPageSize, recentEvents.length)} de ${recentEvents.length}` : 'Sin movimientos'}</small>
              {activityPageCount > 1 && <div className="analytics-table-nav" aria-label="Páginas de actividad reciente">
                <button type="button" onClick={() => setAnalyticsActivityPage(page => Math.max(0, page - 1))} disabled={activityPage === 0} aria-label="Registros anteriores"><IcoChevron s={13} /></button>
                <span>{activityPage + 1} / {activityPageCount}</span>
                <button type="button" onClick={() => setAnalyticsActivityPage(page => Math.min(activityPageCount - 1, page + 1))} disabled={activityPage === activityPageCount - 1} aria-label="Registros siguientes"><IcoChevron s={13} /></button>
              </div>}
            </div>
          </div>
          <div className="analytics-table-wrap">
            <table className="analytics-table"><thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Actividad</th><th>Recurso</th><th>Duración</th></tr></thead><tbody>
              {visibleRecentEvents.length === 0 ? <tr><td colSpan="5"><div className="analytics-empty"><IcoHistory s={24} /><span>No hay movimientos registrados.</span></div></td></tr> : visibleRecentEvents.map((event, index) => (
                <tr key={`${event.timestamp}-${event.event}-${event.appId || event.view}-${index}`}><td>{new Date(event.timestamp).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td><td><span className="analytics-user"><i>{initialsOf(event.user)}</i>{event.user}</span></td><td>{eventLabels[event.event] || event.event}</td><td>{event.appName || event.view || 'Ecosistema'}</td><td>{event.durationSeconds ? formatUsageTime(event.durationSeconds) : '—'}</td></tr>
              ))}
            </tbody></table>
          </div>
        </section>
      </div>
    );
  };

  const renderCatalog = () => (
    <div className="panel catalog-panel enter">
      <div className="panel-head">
        <div>
          <span className="analytics-eyebrow"><IcoGrid s={14} /> Gobierno del portafolio</span>
          <h2 className="panel-title">Catálogo de aplicativos</h2>
          <p className="panel-sub">{appsList.length} sistemas registrados · {activeAppsList.length} habilitados</p>
        </div>
        <button className="btn btn-primary catalog-deploy-button" onClick={() => { setAppCatalogError(''); setShowAppDeployModal(true); }}><IcoRocket s={16} /> Desplegar aplicativo</button>
      </div>
      {appCatalogError && <div className="catalog-alert"><IcoShield s={16} /><span>{appCatalogError}</span><button onClick={() => setAppCatalogError('')}><IcoX s={11} /></button></div>}
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead><tr><th>App</th><th>Grupo</th><th>Endpoint</th><th>Disponibilidad</th><th style={{ width: 176 }}>Acciones</th></tr></thead>
          <tbody>
            {appsList.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--ink-3)', padding: 40 }}>Sin aplicativos registrados.</td></tr>
            ) : appsList.map(app => (
              <tr key={app.id} className={!isAppEnabled(app) ? 'app-disabled-row' : ''}>
                {editingAppId === app.id ? (
                  <>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input className="field" value={app.nombre} onChange={e => handleEditChange(app.id, 'nombre', e.target.value)} placeholder="Nombre" />
                        <input className="field" value={app.icono || ''} onChange={e => handleEditChange(app.id, 'icono', e.target.value)} placeholder="URL ícono" />
                      </div>
                    </td>
                    <td style={{ minWidth: 230 }}><AppGroupPicker compact value={app.grupo || ''} groups={appGroups.filter(group => group !== 'Sin grupo')} onChange={value => handleEditChange(app.id, 'grupo', value)} /></td>
                    <td><input className="field mono" value={app.url} onChange={e => handleEditChange(app.id, 'url', e.target.value)} /></td>
                    <td><span className={`app-status-pill ${isAppEnabled(app) ? 'enabled' : 'disabled'}`}><i /> {isAppEnabled(app) ? 'Habilitada' : 'Deshabilitada'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-primary" style={{ padding: '7px 14px' }} disabled={!app.grupo?.trim()} onClick={e => handleUpdateApp(e, app.id)}>Guardar</button>
                        <button className="btn btn-secondary" style={{ padding: '7px 14px' }} onClick={() => { setEditingAppId(null); fetchApps(); }}>Cancelar</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                        <AppIcon app={app} size={34} />
                        <div>
                          <div style={{ fontWeight: 550 }}>{app.nombre}</div>
                          {app.desc && <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{String(app.desc).slice(0, 54)}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span className="app-group-tag"><IcoGrid s={11} /> {app.grupo || 'Sin grupo'}</span></td>
                    <td className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{String(app.url || '').slice(0, 46)}…</td>
                    <td><span className={`app-status-pill ${isAppEnabled(app) ? 'enabled' : 'disabled'}`}><i /> {isAppEnabled(app) ? 'Habilitada' : 'Deshabilitada'}</span></td>
                    <td>
                      <div className="catalog-row-actions">
                        <button className={`app-power-button ${isAppEnabled(app) ? 'disable' : 'enable'}`} onClick={() => toggleAppStatus(app)} title={isAppEnabled(app) ? 'Deshabilitar aplicativo' : 'Habilitar aplicativo'}>{isAppEnabled(app) ? 'Deshabilitar' : 'Habilitar'}</button>
                        <button className="icon-btn" onClick={() => setEditingAppId(app.id)} title="Editar"><IcoEdit /></button>
                        <button className="icon-btn danger" onClick={() => handleDeleteApp(app.id)} title="Eliminar"><IcoTrash /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAppDeployModal = () => {
    if (!showAppDeployModal) return null;
    return (
      <div className="modal-overlay app-deploy-overlay" onMouseDown={() => !isAddingApp && setShowAppDeployModal(false)}>
        <section className="app-deploy-modal" onMouseDown={e => e.stopPropagation()}>
          <div className="modal-head app-deploy-head">
            <div><span className="login-kicker">Catálogo unificado</span><h2>Desplegar aplicativo</h2><p>Completa la ficha para publicarlo en el ecosistema.</p></div>
            <button className="modal-close" onClick={() => setShowAppDeployModal(false)} disabled={isAddingApp}><IcoX s={14} /></button>
          </div>
          <form onSubmit={handleAddApp} className="app-deploy-form">
            {appCatalogError && <div className="catalog-alert form-alert"><IcoShield s={16} /><span>{appCatalogError}</span></div>}
            <div>
              <label className="form-label">Nombre oficial</label>
              <input className="field" required value={newApp.nombre} onChange={e => setNewApp({ ...newApp, nombre: e.target.value })} placeholder="Ej. Gestión de viáticos" />
            </div>
            <div>
              <label className="form-label">Grupo del aplicativo</label>
              <AppGroupPicker value={newApp.grupo} groups={appGroups.filter(group => group !== 'Sin grupo')} onChange={value => setNewApp({ ...newApp, grupo: value })} />
            </div>
            <div>
              <label className="form-label">URL del endpoint</label>
              <input className="field mono" type="url" required value={newApp.url} onChange={e => setNewApp({ ...newApp, url: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="form-label">URL del ícono <span className="optional-label">Opcional</span></label>
              <input className="field mono" type="url" value={newApp.icono} onChange={e => setNewApp({ ...newApp, icono: e.target.value })} placeholder="https://..." />
            </div>
            <div className="app-deploy-description">
              <label className="form-label">Descripción</label>
              <textarea className="field" required value={newApp.desc} onChange={e => setNewApp({ ...newApp, desc: e.target.value })} placeholder="Explica su propósito en una frase clara." />
            </div>
            <label className="app-initial-status">
              <span><strong>Publicar inmediatamente</strong><small>Si la desactivas, quedará guardada en el catálogo sin aparecer a los usuarios.</small></span>
              <input type="checkbox" checked={newApp.estado !== 'Inactivo'} onChange={e => setNewApp({ ...newApp, estado: e.target.checked ? 'Activo' : 'Inactivo' })} />
            </label>
            <div className="app-deploy-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAppDeployModal(false)} disabled={isAddingApp}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={isAddingApp || !newApp.grupo.trim()}><IcoRocket s={15} /> {isAddingApp ? 'Desplegando…' : 'Guardar y desplegar'}</button>
            </div>
          </form>
        </section>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="panel enter">
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Directorio de identidades</h2>
          <p className="panel-sub">{usersList.length} usuarios sincronizados</p>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead><tr><th>ID de red</th><th>Correo</th><th>Rol</th><th>Estado</th></tr></thead>
          <tbody>
            {usersList.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--ink-3)', padding: 40 }}>Sincronizando identidades…</td></tr>
            ) : usersList.map(u => (
              <tr key={u.id}>
                <td className="mono" style={{ fontWeight: 550 }}>{u.idRed}</td>
                <td style={{ color: 'var(--ink-2)' }}>{u.correo}</td>
                <td><span className={`tag ${u.rol === 'Administrador' ? 'admin' : ''}`}>{u.rol}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-2)', fontSize: 12.5 }}>
                    <span className="dot" /> Autorizado
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ======================================================================
     SHELL DEL SISTEMA
     ====================================================================== */
  const menuItems = [
    { id: 'dashboard', label: 'Escritorio', admin: false },
    { id: 'teams', label: 'Equipos', admin: false },
    { id: 'analytics', label: 'Dashboard', admin: true },
    { id: 'catalog', label: 'Catálogo', admin: true },
    { id: 'users', label: 'Identidades', admin: true },
  ];
  const activeAccent = ACCENT_COLORS.find(color => color.id === workspaceAppearance.accent) || ACCENT_COLORS[0];

  const renderWindowBody = (app) => {
    if (app.sys === 'notes') return <textarea className="notes-pad" placeholder="Escribe algo…" />;
    if (app.sys === 'calculator') return <NativeCalculator isActive={activeAppId === app.id && !minimizedApps[app.id]} />;
    if (app.sys === 'converter') return <UnitConverter />;
    if (app.sys === 'passwords') return <PasswordGenerator />;
    if (app.sys === 'stopwatch') return <StopwatchTool />;
    if (app.sys === 'todo') return (
      <div className="sticky-wrap">
        <textarea className="sticky warm" placeholder="Urgente…" />
        <textarea className="sticky cool" placeholder="En progreso…" />
      </div>
    );
    if (!app.isAuthorized) return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-2)' }}>
        <IcoShield s={26} />
        <h3 style={{ marginTop: 12, fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>Acceso restringido</h3>
        <p style={{ fontSize: 13, marginTop: 6 }}>Tu perfil no tiene permisos sobre este aplicativo.</p>
      </div>
    );
    return (
      <iframe
        className="app-frame"
        src={`${app.url}?usuario=${userData.usuario}`}
        title={app.nombre}
        onLoad={() => setLoadingApps(p => ({ ...p, [app.id]: false }))}
        style={{ opacity: loadingApps[app.id] ? 0 : 1, transition: 'opacity 0.35s ease' }}
      />
    );
  };

  return (
    <div className="os-root"
      data-wallpaper={workspaceAppearance.wallpaper}
      data-contrast={workspaceAppearance.contrast}
      data-transparency={workspaceAppearance.transparency}
      data-clock-style={workspaceAppearance.clockStyle}
      data-density={workspaceAppearance.density}
      data-shape={workspaceAppearance.shape}
      data-motion={workspaceAppearance.motion}
      data-dock-scale={workspaceAppearance.dockScale}
      style={{ '--brand-green': activeAccent.hex }}>
      {renderSpotlight()}
      {renderLaunchpad()}
      {renderCalendarModal()}
      {renderBoardManager()}
      {renderAppearancePanel()}
      {renderWidgetGallery()}
      {renderProfileEditor()}
      {renderTeamEditor()}
      {renderAppDeployModal()}

      {/* ================= MENU BAR ================= */}
      <header className="menubar">
        <div className="menubar-left">
          <div className="menu-logo-spacer" aria-hidden="true" />
          {menuItems.filter(m => !m.admin || isAdmin).map(m => (
            <button key={m.id}
              className={`menu-item ${currentView === m.id && activeAppId === null ? 'active' : ''}`}
              onClick={() => { setActiveAppId(null); setCurrentView(m.id); }}>
              {m.label}
            </button>
          ))}
        </div>

        <div className="menubar-right">
          <button className="menu-icon-btn" title="Buscar (⌘K)" onClick={openSpotlight}><IcoSearch s={16} /></button>
          <button className={`menu-icon-btn ${workspaceMode === 'desktop' ? 'on' : ''}`}
            title={workspaceMode === 'desktop' ? 'Ventanas libres' : 'Modo enfoque'}
            onClick={() => setWorkspaceMode(m => m === 'focus' ? 'desktop' : 'focus')}>
            {workspaceMode === 'focus' ? <IcoWindows s={16} /> : <IcoFocus s={16} />}
          </button>
          <button className="menu-icon-btn" title="Personalizar escritorio" onClick={() => { setShowUserMenu(false); setShowAppearancePanel(true); }}>
            <IcoSliders s={16} />
          </button>
          <button className="menu-icon-btn" title="Añadir widgets" onClick={() => { setShowUserMenu(false); setShowWidgetGallery(true); }}>
            <IcoWidgets s={16} />
          </button>
          <span className="menu-clock">
            {currentTime.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}{'  '}
            {menuClockLabel}
          </span>
          <button className="menu-user" onClick={() => setShowUserMenu(v => !v)}>
            <span className="menu-avatar">{initialsOf(welcomeName)}</span>
            <span className="menu-user-name">{welcomeName}</span>
          </button>
        </div>
      </header>

      {showUserMenu && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 550 }} onClick={() => setShowUserMenu(false)} />
          <div className="popover">
            <div className="popover-head">
              <div style={{ fontSize: 14, fontWeight: 600 }}>{welcomeName}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{profilePreferences.roleLabel.trim() || userData.rolGlobal}</div>
            </div>
            <button className="popover-item" onClick={() => { setShowUserMenu(false); setShowProfileEditor(true); }}>
              <IcoUser s={15} /> Editar mi perfil
            </button>
            <button className="popover-item" onClick={() => { setShowUserMenu(false); setShowAppearancePanel(true); }}>
              <IcoSliders s={15} /> Personalizar escritorio
            </button>
            <button className="popover-item" onClick={() => { setShowUserMenu(false); setShowWidgetGallery(true); }}>
              <IcoWidgets s={15} /> Gestionar widgets
            </button>
            <button className="popover-item" onClick={() => { setShowUserMenu(false); openLaunchpad(); }}>
              <IcoGrid s={15} /> Abrir Launchpad
            </button>
            <button className="popover-item danger" onClick={handleLogout}>
              <IcoLogout s={15} /> Cerrar sesión
            </button>
          </div>
        </>
      )}

      {/* ================= WORKSPACE ================= */}
      <main className="workspace">
        <div className="workspace-scroll" onMouseDown={handleWorkspaceBackground} style={{
          opacity: activeAppId === null || workspaceMode === 'desktop' ? 1 : 0,
          pointerEvents: activeAppId === null || workspaceMode === 'desktop' ? 'auto' : 'none',
        }}>
          <div className="workspace-inner">
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'teams' && renderTeams()}
            {currentView === 'analytics' && renderAnalytics()}
            {currentView === 'catalog' && renderCatalog()}
            {currentView === 'users' && renderUsers()}
          </div>
        </div>

        {/* ---- Motor de ventanas ---- */}
        {openApps.map(app => (
          workspaceMode === 'desktop' ? (
            <Rnd key={app.id} id={`window-${app.id}`}
              default={{ x: 48 + (hashOf(app.id) % 60), y: 28 + (hashOf(app.id) % 40), width: app.defaultWidth, height: app.defaultHeight }}
              minWidth={app.sys === 'calculator' ? 340 : 330} minHeight={app.sys === 'calculator' ? 560 : 280}
              maxWidth={app.sys === 'calculator' ? 340 : undefined} maxHeight={app.sys === 'calculator' ? 560 : undefined}
              bounds="parent"
              dragHandleClassName={maximizedApps[app.id] ? 'no-drag' : 'titlebar'}
              enableResizing={app.sys !== 'calculator' && !maximizedApps[app.id]}
              style={{
                zIndex: windowMotion[app.id] ? 10000 : (windowLayers[app.id] || 100),
                display: ((activeAppId === null && !windowMotion[app.id]) || (minimizedApps[app.id] && windowMotion[app.id]?.phase !== 'restoring')) ? 'none' : 'block',
              }}
              onPointerDownCapture={() => { if (!minimizedApps[app.id] && !windowMotion[app.id]) prioritizeWindow(app.id); }}
            >
              <div
                className={`win ${maximizedApps[app.id] ? 'maxed' : ''} ${windowMotion[app.id]?.phase === 'minimizing' ? 'genie-minimizing' : ''} ${windowMotion[app.id]?.phase === 'restoring' ? 'genie-restoring' : ''}`}
                style={{
                  '--genie-x': `${windowMotion[app.id]?.x || minimizeVectors[app.id]?.x || 0}px`,
                  '--genie-y': `${windowMotion[app.id]?.y || minimizeVectors[app.id]?.y || 0}px`,
                  '--genie-mid-x': `${(windowMotion[app.id]?.x || minimizeVectors[app.id]?.x || 0) * .42}px`,
                  '--genie-mid-y': `${(windowMotion[app.id]?.y || minimizeVectors[app.id]?.y || 0) * .68}px`,
                  '--genie-scale-x': windowMotion[app.id]?.scaleX || minimizeVectors[app.id]?.scaleX || .06,
                  '--genie-scale-y': windowMotion[app.id]?.scaleY || minimizeVectors[app.id]?.scaleY || .04,
                  ...(maximizedApps[app.id] && {
                    position: 'fixed', top: 'var(--menubar-h)', left: 0,
                    width: '100vw', height: 'calc(100vh - var(--menubar-h))', zIndex: 90, transform: 'none',
                  }),
                }}
                onAnimationEnd={e => { if (e.target === e.currentTarget) finishWindowMotion(app.id); }}
              >
                <div className={`titlebar ${maximizedApps[app.id] ? 'no-drag' : 'grab'}`}>
                  <div className="traffic">
                    <button className="tl close" onClick={e => closeApp(e, app.id)} title="Cerrar"><IcoX s={8} /></button>
                    <button className="tl min" onClick={e => toggleMinimize(e, app.id)} title="Minimizar"><IcoMinus s={8} /></button>
                    {app.sys !== 'calculator' && <button className="tl max" onClick={e => toggleMaximize(e, app.id)} title="Pantalla completa"><IcoExpand s={7} /></button>}
                  </div>
                  <span className="title-text">{app.nombre}</span>
                </div>
                <div className="win-body">
                  {loadingApps[app.id] && !app.sys && <div className="loader-veil"><div className="spinner" /></div>}
                  {renderWindowBody(app)}
                </div>
              </div>
            </Rnd>
          ) : (
            <div key={app.id} className={`focus-app-layer ${COMPACT_SYSTEM_TOOLS.has(app.sys) ? 'compact-utility' : ''}`} style={{
              opacity: activeAppId === app.id ? 1 : 0,
              pointerEvents: activeAppId === app.id ? 'auto' : 'none',
            }}>
              {COMPACT_SYSTEM_TOOLS.has(app.sys) ? (
                <div className="focus-compact-window" style={{ width: `min(${app.defaultWidth}px, calc(100vw - 40px))`, height: `min(${app.defaultHeight}px, calc(100vh - 136px))` }}>
                  <div className="titlebar no-drag">
                    <div className="traffic"><button className="tl close" onClick={e => closeApp(e, app.id)} title="Cerrar"><IcoX s={8} /></button></div>
                    <span className="title-text">{app.nombre}</span>
                  </div>
                  <div className="win-body">{renderWindowBody(app)}</div>
                </div>
              ) : (
                <>
                  {loadingApps[app.id] && !app.sys && <div className="loader-veil"><div className="spinner" /></div>}
                  <div className="focus-app-content">{renderWindowBody(app)}</div>
                </>
              )}
            </div>
          )
        ))}
      </main>

      {/* ================= DOCK FLOTANTE ================= */}
      <div className="dock-wrap">
        <div className="dock">
          <button className="dock-item" data-label="Launchpad" onClick={openLaunchpad}>
            <div className="dock-sys" style={{ background: 'linear-gradient(150deg,#8E8E96,#5B5B63)', color: '#fff', boxShadow: '0 6px 16px -8px rgba(29,29,31,0.45), inset 0 0.5px 0 rgba(255,255,255,0.35)' }}>
              <IcoGrid s={22} />
            </div>
          </button>

          <button className={`dock-item ${activeAppId === null ? 'active-win running' : ''}`} data-label="Escritorio" onClick={goDesktop}>
            <div className="dock-sys"><IcoDesktopIco s={22} /></div>
            <span className="dock-dot" />
          </button>

          <span className="dock-sep" />

          <div className="dock-folder">
            {showUtilitiesFolder && (
              <div className="dock-folder-popover" onClick={e => e.stopPropagation()}>
                <div className="dock-folder-head"><span><IcoFolder s={15} /> Utilidades del sistema</span><small>{SYSTEM_APPS.length}</small></div>
                <div className="dock-folder-grid">
                  {SYSTEM_APPS.map(s => {
                    const win = openApps.find(app => app.sys === s.sys);
                    return <button key={s.sys} className={win ? 'running' : ''} onClick={() => { setShowUtilitiesFolder(false); if (win) handleDockClick(win.id); else launchSystemApp(s.sys); }}><AppIcon app={{ nombre: s.nombre, grad: s.grad, sysIcon: s.icon }} size={43} /><span>{s.nombre}</span>{win && <i />}</button>;
                  })}
                </div>
              </div>
            )}
            <button id="dock-utilities-folder" className={`dock-item ${openApps.some(app => app.sys) ? 'running' : ''} ${openApps.some(app => app.sys && app.id === activeAppId) ? 'active-win' : ''}`} data-label="Utilidades" onClick={e => { e.stopPropagation(); closeSpotlight(); closeLaunchpad(); setShowUtilitiesFolder(value => !value); }}>
              <div className="dock-sys utility-folder-icon"><IcoFolder s={27} /></div>
              <span className="dock-dot" />
            </button>
          </div>

          {openApps.filter(a => !a.sys).length > 0 && <span className="dock-sep" />}

          {openApps.filter(a => !a.sys).map(app => (
            <button key={app.id} id={`dock-${app.id}`}
              className={`dock-item running ${activeAppId === app.id ? 'active-win' : ''} ${loadingApps[app.id] ? 'dock-bounce' : ''}`}
              data-label={app.nombre}
              onClick={() => handleDockClick(app.id)}>
              <AppIcon app={app} size={46} />
              <span className="dock-dot" />
              <span className="dock-close" onClick={e => closeApp(e, app.id)}><IcoX s={9} /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
