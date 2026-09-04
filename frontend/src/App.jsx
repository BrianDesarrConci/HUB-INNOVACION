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
const IcoMore = ({ s = 18 }) => <svg width={s} height={s} {...S} strokeWidth="2.2"><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></svg>;
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
const IcoSparkles = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="m12 2 1.7 4.3L18 8l-4.3 1.7L12 14l-1.7-4.3L6 8l4.3-1.7zM19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9zM5 13l1.2 2.8L9 17l-2.8 1.2L5 21l-1.2-2.8L1 17l2.8-1.2z" /></svg>;
const IcoDocument = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M14 2.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5z" /><path d="M14 2.5v6h6M8 13h8M8 17h6" /></svg>;
const IcoPresentation = ({ s = 18 }) => <svg width={s} height={s} {...S}><path d="M3 4h18v12H3zM8 21l4-5 4 5M12 2v2" /><path d="m7 12 3-3 2 2 4-4" /></svg>;

const NexoActionLoader = ({ s = 15 }) => (
  <span className="nexo-action-loader" style={{ '--nexo-loader-size': `${s}px` }} aria-hidden="true">
    <i />
    <IcoSparkles s={Math.max(9, s - 4)} />
  </span>
);

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

const toLocalDateTimeInput = (date = new Date()) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const formatUsageTime = (seconds = 0) => {
  const totalSeconds = Math.max(0, Number(seconds) || 0);
  if (totalSeconds < 60) return `${Math.round(totalSeconds)} s`;
  if (totalSeconds < 3600) return `${Math.round(totalSeconds / 60)} min`;
  const hours = totalSeconds / 3600;
  return `${hours.toLocaleString('es-CO', { minimumFractionDigits: hours < 10 ? 1 : 0, maximumFractionDigits: 1 })} h`;
};

const isAppEnabled = app => String(app?.estado || 'Activo').trim().toLowerCase() !== 'inactivo';

const REPORT_COLORS = {
  navy: '#242A54', green: '#048C38', gold: '#FFCD04', ink: '#202124', muted: '#737780',
  light: '#F1F3F6', white: '#FFFFFF', line: '#E3E6EB', red: '#D9534F', amber: '#D69A22', blue: '#4C579D',
};

const svgEscape = value => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
  .replace(/[\u2013\u2014]/g, '-');

const reportWrap = (value, maxChars, maxLines = 2) => {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  words.forEach(word => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars) line = candidate;
    else if (lines.length < maxLines) { if (line) lines.push(line); line = word; }
  });
  if (line && lines.length < maxLines) lines.push(line);
  if (!lines.length) return [''];
  if (words.join(' ').length > lines.join(' ').length) lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[. ]+$/, '')}...`;
  return lines;
};

const reportTextLines = (lines, x, y, options = {}) => {
  const { size = 24, weight = 500, color = REPORT_COLORS.ink, lineHeight = Math.round(size * 1.28), anchor = 'start' } = options;
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${color}">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? lineHeight : 0}">${svgEscape(line)}</tspan>`).join('')}</text>`;
};

const reportPageShell = ({ body, pageNumber, pageCount, section, team, generatedAt }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="1754" viewBox="0 0 1240 1754">
  <defs>
    <linearGradient id="pageBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F8FA"/><stop offset="1" stop-color="#E9EDF2"/></linearGradient>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#242A54"/><stop offset="0.67" stop-color="#171C3D"/><stop offset="1" stop-color="#0E1229"/></linearGradient>
    <radialGradient id="heroGlow" cx="82%" cy="8%" r="78%"><stop offset="0" stop-color="#048C38" stop-opacity=".68"/><stop offset=".62" stop-color="#048C38" stop-opacity="0"/></radialGradient>
    <linearGradient id="greenSoft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2F3E7"/><stop offset="1" stop-color="#F8FCF9"/></linearGradient>
    <linearGradient id="navySoft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8EBF7"/><stop offset="1" stop-color="#F8F9FC"/></linearGradient>
    <linearGradient id="redSoft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBE8E7"/><stop offset="1" stop-color="#FFF9F8"/></linearGradient>
    <linearGradient id="goldSoft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4C8"/><stop offset="1" stop-color="#FFFDF4"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#1E2342" flood-opacity=".12"/></filter>
    <filter id="shadowSoft" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="7" stdDeviation="10" flood-color="#1E2342" flood-opacity=".08"/></filter>
  </defs>
  <rect width="1240" height="1754" fill="url(#pageBg)"/>
  <rect width="1240" height="16" fill="${REPORT_COLORS.green}"/>
  <g font-family="Inter, Arial, sans-serif">
    <text x="60" y="58" font-size="20" font-weight="800" fill="${REPORT_COLORS.navy}" letter-spacing="2">ÁGORA OS</text>
    <text x="1180" y="58" text-anchor="end" font-size="15" font-weight="700" fill="${REPORT_COLORS.green}" letter-spacing="1.4">${svgEscape(section.toUpperCase())}</text>
    ${body}
    <line x1="60" y1="1688" x2="1180" y2="1688" stroke="${REPORT_COLORS.line}" stroke-width="2"/>
    <text x="60" y="1720" font-size="13" fill="${REPORT_COLORS.muted}">${svgEscape(team.name)} | ${svgEscape(generatedAt.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }))}</text>
    <text x="1180" y="1720" text-anchor="end" font-size="13" font-weight="700" fill="${REPORT_COLORS.navy}">Informe ejecutivo | ${pageNumber} de ${pageCount}</text>
  </g>
</svg>`;

const reportCard = (x, y, width, height, content, options = {}) => `<g filter="url(#${options.soft ? 'shadowSoft' : 'shadow'})"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${options.radius || 28}" fill="${options.fill || REPORT_COLORS.white}" ${options.stroke ? `stroke="${options.stroke}" stroke-width="2"` : ''}/></g><g>${content}</g>`;

const buildTeamReportSvgs = team => {
  const tasks = team.tasks || [];
  const members = team.members || [];
  const today = dateKey();
  const generatedAt = new Date();
  const completed = tasks.filter(task => task.status === 'completada').length;
  const inProgress = tasks.filter(task => task.status === 'en_progreso').length;
  const pending = tasks.filter(task => task.status === 'pendiente').length;
  const openTasks = tasks.filter(task => task.status !== 'completada');
  const overdueTasks = openTasks.filter(task => task.dueDate && task.dueDate < today);
  const highPriority = openTasks.filter(task => task.priority === 'alta').length;
  const completion = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const memberName = id => members.find(member => String(member.userId).toUpperCase() === String(id).toUpperCase())?.name || id || 'Sin responsable';
  const workload = members.map(member => {
    const assigned = tasks.filter(task => String(task.assignedTo).toUpperCase() === String(member.userId).toUpperCase());
    return { ...member, total: assigned.length, open: assigned.filter(task => task.status !== 'completada').length, done: assigned.filter(task => task.status === 'completada').length };
  }).sort((a, b) => b.open - a.open || b.total - a.total);
  const taskChunks = [];
  for (let index = 0; index < tasks.length; index += 6) taskChunks.push(tasks.slice(index, index + 6));
  if (!taskChunks.length) taskChunks.push([]);
  const pageCount = 2 + taskChunks.length;
  const pages = [];

  const hero = `
    <g filter="url(#shadow)"><rect x="60" y="88" width="1120" height="246" rx="34" fill="url(#hero)"/></g>
    <rect x="60" y="88" width="1120" height="246" rx="34" fill="url(#heroGlow)"/>
    <rect x="96" y="122" width="128" height="30" rx="15" fill="#FFFFFF" fill-opacity=".11"/>
    <circle cx="113" cy="137" r="5" fill="#5DE179"/><text x="128" y="143" font-size="13" font-weight="700" fill="#FFFFFF">EQUIPO ACTIVO</text>
    ${reportTextLines(reportWrap(team.name, 32, 2), 96, 207, { size: 43, weight: 800, color: '#FFFFFF', lineHeight: 48 })}
    <text x="96" y="290" font-size="17" fill="#FFFFFF" fill-opacity=".68">Líder: <tspan font-weight="700" fill="#FFFFFF">${svgEscape(team.leaderName || team.leaderId)}</tspan> | ${svgEscape(team.leaderId || '')}</text>
    <circle cx="1041" cy="211" r="73" fill="none" stroke="#FFFFFF" stroke-opacity=".14" stroke-width="18"/>
    <circle cx="1041" cy="211" r="73" fill="none" stroke="#5DE179" stroke-width="18" stroke-linecap="round" stroke-dasharray="${Math.max(0.01, completion / 100) * 459} 459" transform="rotate(-90 1041 211)"/>
    <text x="1041" y="207" text-anchor="middle" font-size="36" font-weight="800" fill="#FFFFFF">${completion}%</text><text x="1041" y="235" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF" fill-opacity=".58">AVANCE</text>`;

  const metrics = [
    { label: 'CUMPLIMIENTO', value: `${completion}%`, detail: `${completed} tareas finalizadas`, fill: 'url(#greenSoft)', color: REPORT_COLORS.green, icon: '✓' },
    { label: 'EN EJECUCIÓN', value: inProgress, detail: `${openTasks.length} compromisos abiertos`, fill: 'url(#navySoft)', color: REPORT_COLORS.blue, icon: '↗' },
    { label: 'VENCIDAS', value: overdueTasks.length, detail: overdueTasks.length ? 'Requieren atención' : 'Sin retrasos activos', fill: overdueTasks.length ? 'url(#redSoft)' : 'url(#greenSoft)', color: overdueTasks.length ? REPORT_COLORS.red : REPORT_COLORS.green, icon: '!' },
    { label: 'PRIORIDAD ALTA', value: highPriority, detail: 'Dentro de la carga abierta', fill: 'url(#goldSoft)', color: REPORT_COLORS.amber, icon: '◆' },
  ];
  const metricCards = metrics.map((metric, index) => {
    const x = 60 + index * 285;
    const content = `<circle cx="${x + 50}" cy="407" r="26" fill="${metric.color}" fill-opacity=".13"/><text x="${x + 50}" y="417" text-anchor="middle" font-size="25" font-weight="800" fill="${metric.color}">${metric.icon}</text><text x="${x + 88}" y="389" font-size="13" font-weight="800" fill="${REPORT_COLORS.muted}" letter-spacing="1">${metric.label}</text><text x="${x + 88}" y="428" font-size="34" font-weight="800" fill="${REPORT_COLORS.ink}">${metric.value}</text><text x="${x + 88}" y="454" font-size="14" fill="${REPORT_COLORS.muted}">${svgEscape(metric.detail)}</text>`;
    return reportCard(x, 362, 265, 132, content, { fill: metric.fill, radius: 24, soft: true });
  }).join('');

  const statusTotal = Math.max(1, tasks.length);
  const statusWidth = 455;
  const pendingWidth = statusWidth * pending / statusTotal;
  const progressWidth = statusWidth * inProgress / statusTotal;
  const doneWidth = statusWidth * completed / statusTotal;
  const statusContent = `
    <text x="91" y="558" font-size="13" font-weight="800" fill="${REPORT_COLORS.muted}" letter-spacing="1.2">DISTRIBUCIÓN DEL TRABAJO</text><text x="91" y="591" font-size="24" font-weight="800" fill="${REPORT_COLORS.ink}">Estado de las tareas</text>
    <circle cx="221" cy="743" r="91" fill="none" stroke="#E7E9ED" stroke-width="28"/><circle cx="221" cy="743" r="91" fill="none" stroke="${REPORT_COLORS.green}" stroke-width="28" stroke-linecap="round" stroke-dasharray="${Math.max(0.01, completion / 100) * 572} 572" transform="rotate(-90 221 743)"/>
    <text x="221" y="738" text-anchor="middle" font-size="38" font-weight="800" fill="${REPORT_COLORS.ink}">${openTasks.length}</text><text x="221" y="770" text-anchor="middle" font-size="14" font-weight="700" fill="${REPORT_COLORS.muted}">ABIERTAS</text>
    <circle cx="374" cy="684" r="7" fill="${REPORT_COLORS.amber}"/><text x="393" y="690" font-size="16" fill="${REPORT_COLORS.muted}">Pendientes</text><text x="527" y="690" text-anchor="end" font-size="18" font-weight="800" fill="${REPORT_COLORS.ink}">${pending}</text>
    <circle cx="374" cy="742" r="7" fill="${REPORT_COLORS.blue}"/><text x="393" y="748" font-size="16" fill="${REPORT_COLORS.muted}">En progreso</text><text x="527" y="748" text-anchor="end" font-size="18" font-weight="800" fill="${REPORT_COLORS.ink}">${inProgress}</text>
    <circle cx="374" cy="800" r="7" fill="${REPORT_COLORS.green}"/><text x="393" y="806" font-size="16" fill="${REPORT_COLORS.muted}">Completadas</text><text x="527" y="806" text-anchor="end" font-size="18" font-weight="800" fill="${REPORT_COLORS.ink}">${completed}</text>
    <rect x="91" y="874" width="${statusWidth}" height="18" rx="9" fill="#E7E9ED"/><rect x="91" y="874" width="${pendingWidth}" height="18" rx="9" fill="${REPORT_COLORS.amber}"/><rect x="${91 + pendingWidth}" y="874" width="${progressWidth}" height="18" fill="${REPORT_COLORS.blue}"/><rect x="${91 + pendingWidth + progressWidth}" y="874" width="${doneWidth}" height="18" rx="9" fill="${REPORT_COLORS.green}"/>`;
  const statusCard = reportCard(60, 526, 545, 404, statusContent);

  const maxOpen = Math.max(1, ...workload.map(member => member.open));
  const workloadRows = workload.slice(0, 6).map((member, index) => {
    const y = 656 + index * 43;
    const width = member.open ? Math.max(10, 188 * member.open / maxOpen) : 0;
    return `<circle cx="670" cy="${y - 5}" r="18" fill="${REPORT_COLORS.navy}"/><text x="670" y="${y + 1}" text-anchor="middle" font-size="11" font-weight="800" fill="#FFFFFF">${svgEscape(initialsOf(member.name || member.userId))}</text><text x="702" y="${y - 7}" font-size="15" font-weight="700" fill="${REPORT_COLORS.ink}">${svgEscape(reportWrap(member.name || member.userId, 22, 1)[0])}</text><text x="702" y="${y + 13}" font-size="12" fill="${REPORT_COLORS.muted}">${member.open} abiertas | ${member.done} completadas</text><rect x="930" y="${y - 12}" width="188" height="11" rx="6" fill="#E7E9ED"/><rect x="930" y="${y - 12}" width="${width}" height="11" rx="6" fill="${REPORT_COLORS.green}"/><text x="1136" y="${y}" text-anchor="end" font-size="15" font-weight="800" fill="${REPORT_COLORS.ink}">${member.open}</text>`;
  }).join('');
  const workloadContent = `<text x="656" y="558" font-size="13" font-weight="800" fill="${REPORT_COLORS.muted}" letter-spacing="1.2">CAPACIDAD DEL EQUIPO</text><text x="656" y="591" font-size="24" font-weight="800" fill="${REPORT_COLORS.ink}">Carga abierta por persona</text><text x="1135" y="591" text-anchor="end" font-size="14" font-weight="700" fill="${REPORT_COLORS.green}">${members.length} PERSONAS</text>${workloadRows || `<text x="656" y="716" font-size="17" fill="${REPORT_COLORS.muted}">Sin integrantes disponibles.</text>`}`;
  const workloadCard = reportCard(625, 526, 555, 404, workloadContent);

  const deadlines = openTasks.filter(task => task.dueDate).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);
  const deadlineRows = deadlines.map((task, index) => {
    const taskDate = new Date(`${task.dueDate}T12:00:00`);
    const y = 1078 + index * 82;
    const late = task.dueDate < today;
    return `<rect x="91" y="${y - 31}" width="58" height="58" rx="16" fill="${late ? '#FCE9E8' : '#EEF0F7'}"/><text x="120" y="${y - 4}" text-anchor="middle" font-size="22" font-weight="800" fill="${late ? REPORT_COLORS.red : REPORT_COLORS.navy}">${taskDate.getDate()}</text><text x="120" y="${y + 15}" text-anchor="middle" font-size="11" font-weight="800" fill="${late ? REPORT_COLORS.red : REPORT_COLORS.muted}">${svgEscape(taskDate.toLocaleDateString('es-CO', { month: 'short' }).toUpperCase())}</text><text x="168" y="${y - 8}" font-size="16" font-weight="750" fill="${REPORT_COLORS.ink}">${svgEscape(reportWrap(task.title, 34, 1)[0])}</text><text x="168" y="${y + 18}" font-size="13" fill="${REPORT_COLORS.muted}">${svgEscape(memberName(task.assignedTo))} | ${svgEscape(TEAM_STATUS_LABELS[task.status] || task.status)}</text><rect x="463" y="${y - 17}" width="100" height="30" rx="15" fill="${task.priority === 'alta' ? '#FBE8E7' : task.priority === 'media' ? '#FFF3CE' : '#E5F3E9'}"/><text x="513" y="${y + 3}" text-anchor="middle" font-size="11" font-weight="800" fill="${task.priority === 'alta' ? REPORT_COLORS.red : task.priority === 'media' ? REPORT_COLORS.amber : REPORT_COLORS.green}">${svgEscape(String(task.priority || 'media').toUpperCase())}</text>`;
  }).join('');
  const deadlinesContent = `<text x="91" y="995" font-size="13" font-weight="800" fill="${REPORT_COLORS.muted}" letter-spacing="1.2">AGENDA CRÍTICA</text><text x="91" y="1028" font-size="24" font-weight="800" fill="${REPORT_COLORS.ink}">Próximos vencimientos</text>${deadlineRows || `<text x="91" y="1130" font-size="17" fill="${REPORT_COLORS.muted}">No hay fechas límite registradas.</text>`}`;
  const deadlinesCard = reportCard(60, 963, 545, 625, deadlinesContent);

  const heaviest = workload[0];
  const signals = [
    { color: overdueTasks.length ? REPORT_COLORS.red : REPORT_COLORS.green, title: overdueTasks.length ? `${overdueTasks.length} tareas vencidas` : 'Cronograma bajo control', detail: overdueTasks.length ? 'Prioriza desbloqueos y acuerdos de recuperación.' : 'No se identifican retrasos activos.' },
    { color: highPriority > 2 ? REPORT_COLORS.amber : REPORT_COLORS.blue, title: `${highPriority} compromisos de prioridad alta`, detail: 'Revisa que la capacidad esté distribuida de forma sostenible.' },
    { color: REPORT_COLORS.green, title: heaviest?.name || 'Sin carga registrada', detail: heaviest?.open ? `Concentra la mayor carga abierta: ${heaviest.open} tareas.` : 'Aún no hay información suficiente de carga.' },
  ];
  const signalRows = signals.map((signal, index) => {
    const y = 1085 + index * 142;
    return `<rect x="656" y="${y - 44}" width="493" height="116" rx="22" fill="#F7F8FA" stroke="#ECEEF2" stroke-width="2"/><circle cx="691" cy="${y + 14}" r="16" fill="${signal.color}" fill-opacity=".14"/><circle cx="691" cy="${y + 14}" r="6" fill="${signal.color}"/><text x="723" y="${y + 3}" font-size="17" font-weight="800" fill="${REPORT_COLORS.ink}">${svgEscape(reportWrap(signal.title, 38, 1)[0])}</text>${reportTextLines(reportWrap(signal.detail, 52, 2), 723, y + 31, { size: 13, weight: 500, color: REPORT_COLORS.muted, lineHeight: 18 })}`;
  }).join('');
  const signalsContent = `<text x="656" y="995" font-size="13" font-weight="800" fill="${REPORT_COLORS.muted}" letter-spacing="1.2">LECTURA EJECUTIVA</text><text x="656" y="1028" font-size="24" font-weight="800" fill="${REPORT_COLORS.ink}">Señales para el líder</text>${signalRows}`;
  const signalsCard = reportCard(625, 963, 555, 625, signalsContent);
  pages.push({ section: 'Resumen ejecutivo', body: `${hero}${metricCards}${statusCard}${workloadCard}${deadlinesCard}${signalsCard}` });

  taskChunks.forEach((chunk, chunkIndex) => {
    const pageNumber = chunkIndex + 2;
    const stats = `<rect x="60" y="170" width="1120" height="72" rx="24" fill="#FFFFFF" filter="url(#shadowSoft)"/><text x="91" y="203" font-size="13" font-weight="800" fill="${REPORT_COLORS.muted}" letter-spacing="1.2">CONTROL OPERATIVO</text><text x="91" y="228" font-size="17" font-weight="800" fill="${REPORT_COLORS.ink}">${tasks.length} TAREAS</text><text x="414" y="214" text-anchor="middle" font-size="15" font-weight="700" fill="${REPORT_COLORS.amber}">${pending} pendientes</text><text x="664" y="214" text-anchor="middle" font-size="15" font-weight="700" fill="${REPORT_COLORS.blue}">${inProgress} en progreso</text><text x="914" y="214" text-anchor="middle" font-size="15" font-weight="700" fill="${REPORT_COLORS.green}">${completed} completadas</text>`;
    const title = `<text x="60" y="116" font-size="34" font-weight="800" fill="${REPORT_COLORS.ink}">Listado de tareas</text><text x="60" y="147" font-size="15" fill="${REPORT_COLORS.muted}">Responsables, prioridades, fechas y estado actual del equipo.</text>`;
    const cards = chunk.map((task, index) => {
      const y = 274 + index * 215;
      const priorityColor = task.priority === 'alta' ? REPORT_COLORS.red : task.priority === 'media' ? REPORT_COLORS.amber : REPORT_COLORS.green;
      const priorityFill = task.priority === 'alta' ? '#FBE8E7' : task.priority === 'media' ? '#FFF3CE' : '#E5F3E9';
      const statusColor = task.status === 'completada' ? REPORT_COLORS.green : task.status === 'en_progreso' ? REPORT_COLORS.blue : REPORT_COLORS.amber;
      const statusFill = task.status === 'completada' ? '#E5F3E9' : task.status === 'en_progreso' ? '#E9ECF8' : '#FFF3CE';
      const late = task.status !== 'completada' && task.dueDate && task.dueDate < today;
      const assignee = memberName(task.assignedTo);
      const cardContent = `<rect x="60" y="${y}" width="7" height="184" rx="4" fill="${priorityColor}"/><rect x="88" y="${y + 25}" width="102" height="29" rx="15" fill="${priorityFill}"/><text x="139" y="${y + 45}" text-anchor="middle" font-size="11" font-weight="800" fill="${priorityColor}">${svgEscape(String(task.priority || 'media').toUpperCase())}</text><rect x="200" y="${y + 25}" width="128" height="29" rx="15" fill="${statusFill}"/><text x="264" y="${y + 45}" text-anchor="middle" font-size="11" font-weight="800" fill="${statusColor}">${svgEscape(String(TEAM_STATUS_LABELS[task.status] || task.status || 'Pendiente').toUpperCase())}</text>${late ? `<rect x="338" y="${y + 25}" width="88" height="29" rx="15" fill="#FBE8E7"/><text x="382" y="${y + 45}" text-anchor="middle" font-size="11" font-weight="800" fill="${REPORT_COLORS.red}">VENCIDA</text>` : ''}${reportTextLines(reportWrap(task.title, 54, 2), 88, y + 88, { size: 22, weight: 800, color: REPORT_COLORS.ink, lineHeight: 26 })}${reportTextLines(reportWrap(task.description || 'Sin descripción adicional.', 67, 2), 88, y + 143, { size: 14, weight: 500, color: REPORT_COLORS.muted, lineHeight: 19 })}<circle cx="720" cy="${y + 84}" r="28" fill="${REPORT_COLORS.navy}"/><text x="720" y="${y + 91}" text-anchor="middle" font-size="15" font-weight="800" fill="#FFFFFF">${svgEscape(initialsOf(assignee))}</text><text x="760" y="${y + 77}" font-size="12" font-weight="800" fill="${REPORT_COLORS.muted}" letter-spacing="1">RESPONSABLE</text><text x="760" y="${y + 103}" font-size="16" font-weight="800" fill="${REPORT_COLORS.ink}">${svgEscape(reportWrap(assignee, 24, 1)[0])}</text><rect x="951" y="${y + 38}" width="191" height="106" rx="22" fill="${late ? '#FDF0EF' : '#F4F5F8'}"/><text x="975" y="${y + 69}" font-size="11" font-weight="800" fill="${REPORT_COLORS.muted}" letter-spacing="1">FECHA LÍMITE</text><text x="975" y="${y + 104}" font-size="17" font-weight="800" fill="${late ? REPORT_COLORS.red : REPORT_COLORS.ink}">${svgEscape(task.dueDate ? new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Sin fecha')}</text>`;
      return reportCard(60, y, 1120, 184, cardContent, { radius: 27, soft: true, stroke: late ? '#F3C9C6' : null });
    }).join('');
    const empty = chunk.length ? '' : reportCard(60, 300, 1120, 280, `<circle cx="620" cy="383" r="42" fill="#E5F3E9"/><text x="620" y="397" text-anchor="middle" font-size="38" font-weight="800" fill="${REPORT_COLORS.green}">✓</text><text x="620" y="463" text-anchor="middle" font-size="23" font-weight="800" fill="${REPORT_COLORS.ink}">Sin tareas registradas</text><text x="620" y="497" text-anchor="middle" font-size="15" fill="${REPORT_COLORS.muted}">Cuando el líder asigne compromisos aparecerán en este informe.</text>`, { soft: true });
    pages.push({ section: `Tareas ${chunkIndex + 1}/${taskChunks.length}`, body: `${title}${stats}${cards}${empty}`, pageNumber });
  });

  const now = generatedAt;
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const gridStart = new Date(first); gridStart.setDate(first.getDate() - offset);
  const calendarDays = Array.from({ length: 42 }, (_, index) => { const day = new Date(gridStart); day.setDate(gridStart.getDate() + index); return day; });
  const peopleCards = workload.slice(0, 6).map((member, index) => {
    const column = index % 3; const row = Math.floor(index / 3); const x = 60 + column * 380; const y = 205 + row * 160;
    const percent = member.total ? Math.round(member.done / member.total * 100) : 0;
    const content = `<circle cx="${x + 55}" cy="${y + 63}" r="32" fill="${member.role === 'Lider' ? REPORT_COLORS.green : REPORT_COLORS.navy}"/><text x="${x + 55}" y="${y + 71}" text-anchor="middle" font-size="17" font-weight="800" fill="#FFFFFF">${svgEscape(initialsOf(member.name || member.userId))}</text><text x="${x + 103}" y="${y + 42}" font-size="11" font-weight="800" fill="${member.role === 'Lider' ? REPORT_COLORS.green : REPORT_COLORS.muted}" letter-spacing="1">${member.role === 'Lider' ? 'LÍDER DEL EQUIPO' : 'INTEGRANTE'}</text><text x="${x + 103}" y="${y + 69}" font-size="17" font-weight="800" fill="${REPORT_COLORS.ink}">${svgEscape(reportWrap(member.name || member.userId, 22, 1)[0])}</text><text x="${x + 103}" y="${y + 94}" font-size="12" fill="${REPORT_COLORS.muted}">${member.open} abiertas | ${percent}% cumplimiento</text><rect x="${x + 103}" y="${y + 111}" width="205" height="9" rx="5" fill="#E6E8ED"/><rect x="${x + 103}" y="${y + 111}" width="${Math.max(percent ? 8 : 0, 205 * percent / 100)}" height="9" rx="5" fill="${REPORT_COLORS.green}"/>`;
    return reportCard(x, y, 350, 138, content, { radius: 23, soft: true });
  }).join('');
  const calendarX = 60; const calendarY = 635; const cellW = 160; const cellH = 138;
  const weekdays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map((day, index) => `<text x="${calendarX + index * cellW + cellW / 2}" y="${calendarY + 55}" text-anchor="middle" font-size="12" font-weight="800" fill="${REPORT_COLORS.muted}" letter-spacing="1">${day}</text>`).join('');
  const dayCells = calendarDays.map((day, index) => {
    const x = calendarX + (index % 7) * cellW; const y = calendarY + 78 + Math.floor(index / 7) * cellH; const key = dateKey(day);
    const dayTasks = tasks.filter(task => task.dueDate === key); const outside = day.getMonth() !== now.getMonth(); const isToday = key === today;
    const dots = dayTasks.slice(0, 4).map((task, dotIndex) => `<circle cx="${x + 25 + dotIndex * 18}" cy="${y + 102}" r="6" fill="${task.priority === 'alta' ? REPORT_COLORS.red : task.priority === 'media' ? REPORT_COLORS.amber : REPORT_COLORS.green}" opacity="${task.status === 'completada' ? '.35' : '1'}"/>`).join('');
    return `<rect x="${x + 5}" y="${y + 5}" width="150" height="128" rx="18" fill="${isToday ? REPORT_COLORS.navy : '#FFFFFF'}" opacity="${outside ? '.38' : '1'}" ${isToday ? '' : `stroke="${REPORT_COLORS.line}" stroke-width="2"`}/><text x="${x + 25}" y="${y + 40}" font-size="17" font-weight="800" fill="${isToday ? '#FFFFFF' : REPORT_COLORS.ink}" opacity="${outside ? '.55' : '1'}">${day.getDate()}</text>${dots}${dayTasks.length > 4 ? `<text x="${x + 133}" y="${y + 108}" text-anchor="end" font-size="11" font-weight="800" fill="${isToday ? '#FFFFFF' : REPORT_COLORS.muted}">+${dayTasks.length - 4}</text>` : ''}`;
  }).join('');
  const peopleCalendarBody = `<text x="60" y="116" font-size="34" font-weight="800" fill="${REPORT_COLORS.ink}">Personas y capacidad</text><text x="60" y="147" font-size="15" fill="${REPORT_COLORS.muted}">Estructura del equipo y planeación mensual en una sola vista.</text><text x="1180" y="116" text-anchor="end" font-size="16" font-weight="800" fill="${REPORT_COLORS.green}">${members.length} PERSONAS</text>${peopleCards}${members.length > 6 ? `<text x="1180" y="535" text-anchor="end" font-size="14" font-weight="700" fill="${REPORT_COLORS.muted}">+${members.length - 6} integrantes adicionales</text>` : ''}<text x="60" y="591" font-size="13" font-weight="800" fill="${REPORT_COLORS.green}" letter-spacing="1.2">PLANEACIÓN DEL EQUIPO</text><text x="60" y="624" font-size="25" font-weight="800" fill="${REPORT_COLORS.ink}">${svgEscape(now.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }).toUpperCase())}</text>${weekdays}${dayCells}`;
  pages.push({ section: 'Personas y calendario', body: peopleCalendarBody });
  return pages.map((page, index) => reportPageShell({ body: page.body, pageNumber: index + 1, pageCount, section: page.section, team, generatedAt }));
};

const svgToJpegPage = svg => new Promise((resolve, reject) => {
  const source = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const sourceUrl = URL.createObjectURL(source);
  const image = new Image();
  image.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1240; canvas.height = 1754;
      const context = canvas.getContext('2d');
      context.fillStyle = REPORT_COLORS.light; context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async blob => {
        URL.revokeObjectURL(sourceUrl);
        if (!blob) { reject(new Error('No fue posible renderizar una página del informe.')); return; }
        resolve({ bytes: new Uint8Array(await blob.arrayBuffer()), width: canvas.width, height: canvas.height });
      }, 'image/jpeg', 0.94);
    } catch (error) { URL.revokeObjectURL(sourceUrl); reject(error); }
  };
  image.onerror = () => { URL.revokeObjectURL(sourceUrl); reject(new Error('No fue posible preparar el diseño del informe.')); };
  image.src = sourceUrl;
});

const bytesToBinary = bytes => {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 32768) binary += String.fromCharCode(...bytes.subarray(index, index + 32768));
  return binary;
};

const buildImagePdfBlob = pages => {
  const pageIds = pages.map((_, index) => 3 + index * 3);
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`];
  pages.forEach((page, index) => {
    const pageId = pageIds[index]; const contentId = pageId + 1; const imageId = pageId + 2;
    const content = 'q 595 0 0 842 0 0 cm /Im0 Do Q';
    const imageBinary = bytesToBinary(page.bytes);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    objects.push(`<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBinary.length} >>\nstream\n${imageBinary}\nendstream`);
  });
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets[index + 1] = pdf.length; pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([Uint8Array.from(pdf, character => character.charCodeAt(0) & 255)], { type: 'application/pdf' });
};

const downloadTeamManagementPdf = async team => {
  if (document.fonts?.ready) await document.fonts.ready;
  const svgPages = buildTeamReportSvgs(team);
  const imagePages = [];
  for (const svg of svgPages) imagePages.push(await svgToJpegPage(svg));
  const blob = buildImagePdfBlob(imagePages);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `Informe_Gestion_${String(team.name || 'Equipo').replace(/[^a-zA-Z0-9À-ÿ_-]+/g, '_')}_${dateKey()}.pdf`;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
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

const EMPTY_APP_DRAFT = {
  nombre: '', url: '', desc: '', icono: '', grupo: '', estado: 'Activo',
  propietario: '', responsableTecnico: '', criticidad: 'Media', estadoOperativo: 'Disponible',
  slaHoras: 8, version: '1.0', etapa: 'Producción', empresa: 'Multival', fechaLanzamiento: dateKey(), dependencias: '',
};

const OPERATIONAL_STATUS_META = {
  Disponible: { label: 'Disponible', tone: 'healthy' },
  Degradado: { label: 'Degradado', tone: 'warning' },
  Mantenimiento: { label: 'Mantenimiento', tone: 'maintenance' },
  Interrumpido: { label: 'Interrumpido', tone: 'critical' },
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(() => typeof window !== 'undefined' && (
    window.innerWidth <= 860 || (window.innerWidth <= 1180 && window.innerHeight > window.innerWidth && window.matchMedia?.('(pointer: coarse)').matches)
  ));
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
  const launchpadTouchRef = useRef(null);
  const workspaceScrollRef = useRef(null);
  const workspaceScrollTopRef = useRef(0);
  const workspaceWasSuspendedRef = useRef(false);
  const workspaceRestoreFrameRef = useRef(null);

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
  const [teamsPendingAction, setTeamsPendingAction] = useState('');
  const [teamsError, setTeamsError] = useState('');
  const [teamReportGenerating, setTeamReportGenerating] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [showTeamEditor, setShowTeamEditor] = useState(false);
  const [teamDraft, setTeamDraft] = useState({ id: '', name: '', leaderId: '', memberIds: [] });
  const [teamTaskDraft, setTeamTaskDraft] = useState({ title: '', description: '', assignedTo: '', dueDate: dateKey(), priority: 'media' });
  const [teamSection, setTeamSection] = useState('overview');
  const [teamTaskFilter, setTeamTaskFilter] = useState('all');
  const [teamCalendarMonth, setTeamCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [teamCalendarDate, setTeamCalendarDate] = useState(dateKey());
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showNotificationComposer, setShowNotificationComposer] = useState(false);
  const [notificationDraft, setNotificationDraft] = useState({ title: '', message: '', type: 'informativa', priority: 'Media', audienceType: 'Todos', audienceValue: '', linkType: '', link: '', appId: '', expiresAt: '' });
  const [ecosystemData, setEcosystemData] = useState(null);
  const [ecosystemLoading, setEcosystemLoading] = useState(false);
  const [ecosystemError, setEcosystemError] = useState('');
  const [showIncidentEditor, setShowIncidentEditor] = useState(false);
  const [incidentDraft, setIncidentDraft] = useState({ id: '', appId: '', title: '', description: '', severity: 'Media', status: 'Identificado', owner: '', affectedUsers: 0, resolution: '' });
  const [showMaintenanceEditor, setShowMaintenanceEditor] = useState(false);
  const [maintenanceDraft, setMaintenanceDraft] = useState(() => ({ id: '', appId: '', type: 'Programado', description: '', startsAt: toLocalDateTimeInput(new Date(Date.now() + 3600000)), endsAt: toLocalDateTimeInput(new Date(Date.now() + 7200000)), owner: '', status: 'Programado', audience: 'Todos' }));
  const [selectedPortfolioAppId, setSelectedPortfolioAppId] = useState('');
  const [portfolioDraft, setPortfolioDraft] = useState(null);
  const [documentDraft, setDocumentDraft] = useState({ name: '', type: 'Manual', url: '', version: '', description: '' });
  const [versionDraft, setVersionDraft] = useState({ version: '', changes: '', publishedAt: dateKey(), status: 'Publicada' });
  const [lifecycleSaving, setLifecycleSaving] = useState(false);
  const [lifecyclePendingAction, setLifecyclePendingAction] = useState('');
  const [showAgoraNexo, setShowAgoraNexo] = useState(false);
  const [showExecutiveRoom, setShowExecutiveRoom] = useState(false);
  const [executiveSlide, setExecutiveSlide] = useState(0);

  /* --- CRUD --- */
  const [newApp, setNewApp] = useState({ ...EMPTY_APP_DRAFT });
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [editingAppId, setEditingAppId] = useState(null);
  const [showAppDeployModal, setShowAppDeployModal] = useState(false);
  const [appCatalogError, setAppCatalogError] = useState('');
  const [catalogPendingAction, setCatalogPendingAction] = useState('');

  /* ---------------- Efectos ---------------- */
  useEffect(() => { document.body.setAttribute('data-theme', isLoggedIn ? theme : 'light'); }, [isLoggedIn, theme]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* --- Overlays: abrir / cerrar --- */
  const openSpotlight = () => { setSearchQuery(''); setIsLaunchpadOpen(false); setShowUtilitiesFolder(false); setShowMobileMenu(false); setIsSpotlightOpen(true); };
  const closeSpotlight = () => { setIsSpotlightOpen(false); setSearchQuery(''); };
  const openLaunchpad = () => {
    window.clearTimeout(launchpadCloseTimerRef.current);
    setLpQuery(''); setLaunchpadPage(0); setShowUtilitiesFolder(false); setShowMobileMenu(false); setIsSpotlightOpen(false);
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
        setShowMobileMenu(false);
        setShowAppearancePanel(false); setShowWidgetGallery(false); setShowProfileEditor(false);
        setPublicationTypeOpen(false); setShowUtilitiesFolder(false); setShowTeamEditor(false); setShowAppDeployModal(false);
        setShowNotificationCenter(false); setShowNotificationComposer(false); setShowIncidentEditor(false); setShowMaintenanceEditor(false);
        setSelectedPortfolioAppId(''); setShowAgoraNexo(false); setShowExecutiveRoom(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => { if (isSpotlightOpen) searchInputRef.current?.focus(); }, [isSpotlightOpen]);
  useEffect(() => { if (isLaunchpadOpen) lpInputRef.current?.focus(); }, [isLaunchpadOpen]);

  useEffect(() => {
    const updateResponsiveLayout = () => {
      const compact = window.innerWidth <= 860 || (
        window.innerWidth <= 1180 && window.innerHeight > window.innerWidth && window.matchMedia?.('(pointer: coarse)').matches
      );
      setIsCompactLayout(compact);
      setLaunchpadPageSize(window.innerWidth >= 1180 ? 18 : window.innerWidth >= 760 ? 12 : 8);
      if (compact) setWorkspaceMode('focus');
      else setShowMobileMenu(false);
    };
    updateResponsiveLayout();
    window.addEventListener('resize', updateResponsiveLayout);
    return () => window.removeEventListener('resize', updateResponsiveLayout);
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    const syncVisibleViewport = () => {
      const visibleHeight = Math.round(viewport?.height || window.innerHeight);
      document.documentElement.style.setProperty('--agora-visible-height', `${visibleHeight}px`);
    };

    syncVisibleViewport();
    window.addEventListener('resize', syncVisibleViewport);
    viewport?.addEventListener('resize', syncVisibleViewport);
    viewport?.addEventListener('scroll', syncVisibleViewport);
    return () => {
      window.removeEventListener('resize', syncVisibleViewport);
      viewport?.removeEventListener('resize', syncVisibleViewport);
      viewport?.removeEventListener('scroll', syncVisibleViewport);
      document.documentElement.style.removeProperty('--agora-visible-height');
    };
  }, []);

  useEffect(() => {
    const scroller = workspaceScrollRef.current;
    if (!scroller) return undefined;

    const shouldSuspendWorkspace = workspaceMode === 'focus' && activeAppId !== null;
    if (shouldSuspendWorkspace) {
      if (!workspaceWasSuspendedRef.current) workspaceScrollTopRef.current = scroller.scrollTop;
      workspaceWasSuspendedRef.current = true;
      return undefined;
    }

    const wasSuspended = workspaceWasSuspendedRef.current;
    workspaceWasSuspendedRef.current = false;
    if (!wasSuspended) return undefined;

    window.cancelAnimationFrame(workspaceRestoreFrameRef.current);
    scroller.style.overflowY = 'hidden';
    workspaceRestoreFrameRef.current = window.requestAnimationFrame(() => {
      scroller.style.overflowY = '';
      scroller.scrollTop = workspaceScrollTopRef.current;
    });

    return () => window.cancelAnimationFrame(workspaceRestoreFrameRef.current);
  }, [activeAppId, currentView, workspaceMode]);

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

  const fetchApps = async (session = userData) => {
    try {
      const r = await post({ action: 'getApps', usuario: session?.usuario || '', authToken: session?.sessionToken || '' });
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

  const fetchNotifications = async (session = userData, silent = false) => {
    if (!session?.usuario || !session?.sessionToken) return;
    if (!silent) setNotificationsLoading(true);
    try {
      const response = await post({ action: 'getNotifications', usuario: session.usuario, authToken: session.sessionToken });
      if (response.status === 'success') setNotifications(response.data || []);
    } catch { /* conservar el centro disponible aunque el backend esté temporalmente fuera de línea */ }
    finally { if (!silent) setNotificationsLoading(false); }
  };

  const fetchEcosystemControl = async (session = userData) => {
    if (!session?.usuario || !session?.sessionToken) return;
    setEcosystemLoading(true); setEcosystemError('');
    try {
      const response = await post({ action: 'getEcosystemControl', usuario: session.usuario, authToken: session.sessionToken });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible consultar el estado del ecosistema.');
      setEcosystemData(response.data);
      if (Array.isArray(response.data?.apps)) setAppsList(response.data.apps.map(app => ({ ...app, grupo: app.grupo?.trim() || 'Sin grupo', estado: isAppEnabled(app) ? 'Activo' : 'Inactivo' })));
    } catch (controlError) {
      setEcosystemError(controlError.message || 'No fue posible consultar el estado del ecosistema.');
    } finally { setEcosystemLoading(false); }
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
    if (!isLoggedIn || !userData || currentView !== 'control') return;
    fetchEcosystemControl(userData);
  }, [currentView, isLoggedIn, userData]);

  useEffect(() => {
    if (!isLoggedIn || !userData) return undefined;
    fetchNotifications(userData);
    const timer = window.setInterval(() => fetchNotifications(userData, true), 60000);
    return () => window.clearInterval(timer);
  }, [isLoggedIn, userData]);

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
        setIsLoggedIn(true); setUserData(r); fetchApps(r); fetchUsers(); fetchBoardPosts(); fetchTeams(r); fetchNotifications(r);
        emitAnalytics('session_start', { usuario: r.usuario, authToken: r.sessionToken, sessionId });
      }
      else setError(r.message || 'Credenciales no válidas.');
    } catch { setError('Servidor no disponible en este momento.'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    document.body.setAttribute('data-theme', 'light');
    setIsLoggedIn(false); setUserData(null); setOpenApps([]); setActiveAppId(null);
    setShowUserMenu(false); setShowMobileMenu(false); setShowAppearancePanel(false); setShowWidgetGallery(false); setShowProfileEditor(false);
    setShowBoardManager(false); setPublicationTypeOpen(false); setBoardCarouselPaused(false);
    setShowUtilitiesFolder(false); setTeams([]); setTeamsError(''); setSelectedTeamId(''); setShowTeamEditor(false);
    setCurrentView('dashboard'); setPassword(''); setCaptchaVerified(false); setPomodoroRunning(false);
    setTheme('light'); setWorkspaceAppearance(DEFAULT_APPEARANCE); setAnalyticsData(null); setAnalyticsError('');
    setNotifications([]); setShowNotificationCenter(false); setShowNotificationComposer(false);
    setEcosystemData(null); setEcosystemError(''); setSelectedPortfolioAppId(''); setPortfolioDraft(null);
    setShowAgoraNexo(false); setShowExecutiveRoom(false); setExecutiveSlide(0);
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
    setTeamsPendingAction('team-save');
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
    } finally { setTeamsLoading(false); setTeamsPendingAction(''); }
  };

  const removeTeam = async (team) => {
    if (!window.confirm(`¿Eliminar el equipo “${team.name}” y todas sus tareas?`)) return;
    setTeamsPendingAction(`team-remove-${team.id}`);
    setTeamsLoading(true); setTeamsError('');
    try {
      const response = await post({ action: 'deleteTeam', usuario: userData.usuario, authToken: userData.sessionToken, id: team.id });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible eliminar el equipo.');
      await fetchTeams();
    } catch (teamError) { setTeamsError(teamError.message); }
    finally { setTeamsLoading(false); setTeamsPendingAction(''); }
  };

  const addTeamTask = async (e) => {
    e.preventDefault();
    if (!selectedTeam || !teamTaskDraft.title.trim() || !teamTaskDraft.assignedTo) return;
    setTeamsPendingAction('task-add');
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
    finally { setTeamsLoading(false); setTeamsPendingAction(''); }
  };

  const updateTeamTaskStatus = async (task, status) => {
    setTeamsPendingAction(`task-status-${task.id}-${status}`);
    setTeamsLoading(true);
    setTeamsError('');
    try {
      const response = await post({
        action: 'updateTeamTask', usuario: userData.usuario, authToken: userData.sessionToken,
        taskData: { id: task.id, status },
      });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible actualizar la tarea.');
      await fetchTeams();
    } catch (teamError) { setTeamsError(teamError.message); }
    finally { setTeamsLoading(false); setTeamsPendingAction(''); }
  };

  const handleDownloadTeamReport = async (team) => {
    if (!team || teamReportGenerating) return;
    setTeamReportGenerating(true);
    setTeamsError('');
    try {
      await downloadTeamManagementPdf(team);
    } catch (reportError) {
      setTeamsError(reportError.message || 'No fue posible generar el informe ejecutivo.');
    } finally {
      setTeamReportGenerating(false);
    }
  };

  const navigateToView = (view) => {
    const isChangingModule = currentView !== view;
    if (isChangingModule) workspaceScrollTopRef.current = 0;
    setActiveAppId(null);
    setCurrentView(view);
    closeSpotlight();
    setShowNotificationCenter(false);
    setShowMobileMenu(false);
    if (isChangingModule) {
      window.requestAnimationFrame(() => {
        const scroller = workspaceScrollRef.current;
        if (!scroller) return;
        scroller.style.overflowY = '';
        scroller.scrollTop = 0;
      });
    }
  };

  const saveNotificationDraft = async (e) => {
    e.preventDefault();
    setNotificationsLoading(true);
    try {
      const response = await post({
        action: 'saveNotification', usuario: userData.usuario, authToken: userData.sessionToken,
        notificationData: {
          ...notificationDraft,
          expiresAt: notificationDraft.expiresAt ? new Date(notificationDraft.expiresAt).getTime() : '',
        },
      });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible publicar la notificación.');
      setNotificationDraft({ title: '', message: '', type: 'informativa', priority: 'Media', audienceType: 'Todos', audienceValue: '', linkType: '', link: '', appId: '', expiresAt: '' });
      setShowNotificationComposer(false);
      await fetchNotifications();
    } catch (notificationError) {
      setEcosystemError(notificationError.message || 'No fue posible publicar la notificación.');
    } finally { setNotificationsLoading(false); }
  };

  const openNotification = async (notification) => {
    setNotifications(items => items.map(item => item.id === notification.id ? { ...item, read: true, readAt: Date.now() } : item));
    post({ action: 'markNotificationRead', usuario: userData.usuario, authToken: userData.sessionToken, id: notification.id }).catch(() => {});
    const link = String(notification.link || '');
    if (link.startsWith('agora://control')) navigateToView('control');
    else if (link.startsWith('agora://teams')) navigateToView('teams');
    else if (link.startsWith('agora://catalog')) {
      const appId = link.split('/').pop();
      const app = appsList.find(item => String(item.id) === String(appId));
      if (isAdmin) {
        navigateToView('catalog');
        if (app) { setSelectedPortfolioAppId(app.id); setPortfolioDraft({ ...app }); }
      } else if (app) launchApp(app);
      else setShowNotificationCenter(false);
    } else {
      const safeLink = normalizeExternalUrl(link);
      if (safeLink) window.open(safeLink, '_blank', 'noopener,noreferrer');
      setShowNotificationCenter(false);
    }
  };

  const saveIncidentDraft = async (e) => {
    e.preventDefault();
    setEcosystemLoading(true); setEcosystemError('');
    try {
      const response = await post({ action: 'saveIncident', usuario: userData.usuario, authToken: userData.sessionToken, incidentData: incidentDraft });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible registrar el incidente.');
      setShowIncidentEditor(false);
      setIncidentDraft({ id: '', appId: '', title: '', description: '', severity: 'Media', status: 'Identificado', owner: '', affectedUsers: 0, resolution: '' });
      await Promise.all([fetchEcosystemControl(), fetchNotifications()]);
    } catch (controlError) { setEcosystemError(controlError.message || 'No fue posible registrar el incidente.'); }
    finally { setEcosystemLoading(false); }
  };

  const resolveIncident = async (incident) => {
    setIncidentDraft({ ...incident, status: 'Resuelto', resolution: incident.resolution || 'Servicio restablecido y monitoreado.' });
    setShowIncidentEditor(true);
  };

  const saveMaintenanceDraft = async (e) => {
    e.preventDefault();
    setEcosystemLoading(true); setEcosystemError('');
    try {
      const response = await post({
        action: 'saveMaintenance', usuario: userData.usuario, authToken: userData.sessionToken,
        maintenanceData: { ...maintenanceDraft, startsAt: new Date(maintenanceDraft.startsAt).getTime(), endsAt: new Date(maintenanceDraft.endsAt).getTime() },
      });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible programar el mantenimiento.');
      setShowMaintenanceEditor(false);
      setMaintenanceDraft({ id: '', appId: '', type: 'Programado', description: '', startsAt: toLocalDateTimeInput(new Date(Date.now() + 3600000)), endsAt: toLocalDateTimeInput(new Date(Date.now() + 7200000)), owner: '', status: 'Programado', audience: 'Todos' });
      await Promise.all([fetchEcosystemControl(), fetchNotifications()]);
    } catch (controlError) { setEcosystemError(controlError.message || 'No fue posible programar el mantenimiento.'); }
    finally { setEcosystemLoading(false); }
  };

  const openPortfolioApp = (app) => {
    setAppCatalogError('');
    setSelectedPortfolioAppId(app.id);
    setPortfolioDraft({ ...app });
    setDocumentDraft({ name: '', type: 'Manual', url: '', version: app.version || '', description: '' });
    setVersionDraft({ version: '', changes: '', publishedAt: dateKey(), status: 'Publicada' });
  };

  const savePortfolioProfile = async (e) => {
    e.preventDefault();
    if (!portfolioDraft) return;
    setLifecyclePendingAction('profile');
    setLifecycleSaving(true); setAppCatalogError('');
    try {
      const response = await post({ action: 'updateApp', usuario: userData.usuario, authToken: userData.sessionToken, appData: portfolioDraft });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible actualizar la ficha de gobierno.');
      await fetchApps();
    } catch (portfolioError) { setAppCatalogError(portfolioError.message || 'No fue posible actualizar la ficha de gobierno.'); }
    finally { setLifecycleSaving(false); setLifecyclePendingAction(''); }
  };

  const addAppDocument = async (e) => {
    e.preventDefault();
    if (!selectedPortfolioAppId) return;
    setLifecyclePendingAction('document-add');
    setLifecycleSaving(true); setAppCatalogError('');
    try {
      const response = await post({ action: 'saveAppDocument', usuario: userData.usuario, authToken: userData.sessionToken, documentData: { ...documentDraft, appId: selectedPortfolioAppId } });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible adjuntar la documentación.');
      setDocumentDraft(current => ({ name: '', type: 'Manual', url: '', version: current.version, description: '' }));
      await fetchApps();
    } catch (documentError) { setAppCatalogError(documentError.message || 'No fue posible adjuntar la documentación.'); }
    finally { setLifecycleSaving(false); setLifecyclePendingAction(''); }
  };

  const removeAppDocument = async (documentId) => {
    if (!window.confirm('¿Retirar este documento de la ficha del aplicativo?')) return;
    setLifecyclePendingAction(`document-remove-${documentId}`);
    setLifecycleSaving(true); setAppCatalogError('');
    try {
      const response = await post({ action: 'deleteAppDocument', usuario: userData.usuario, authToken: userData.sessionToken, id: documentId });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible retirar el documento.');
      await fetchApps();
    } catch (documentError) { setAppCatalogError(documentError.message || 'No fue posible retirar el documento.'); }
    finally { setLifecycleSaving(false); setLifecyclePendingAction(''); }
  };

  const addAppVersion = async (e) => {
    e.preventDefault();
    if (!selectedPortfolioAppId) return;
    setLifecyclePendingAction('version-add');
    setLifecycleSaving(true); setAppCatalogError('');
    try {
      const response = await post({ action: 'saveAppVersion', usuario: userData.usuario, authToken: userData.sessionToken, versionData: { ...versionDraft, appId: selectedPortfolioAppId } });
      if (response.status !== 'success') throw new Error(response.message || 'No fue posible publicar la versión.');
      setVersionDraft({ version: '', changes: '', publishedAt: dateKey(), status: 'Publicada' });
      await Promise.all([fetchApps(), fetchNotifications()]);
    } catch (versionError) { setAppCatalogError(versionError.message || 'No fue posible publicar la versión.'); }
    finally { setLifecycleSaving(false); setLifecyclePendingAction(''); }
  };

  const openExecutiveRoom = () => {
    setExecutiveSlide(0);
    setShowExecutiveRoom(true);
    fetchAnalytics();
    fetchEcosystemControl();
    fetchTeams();
  };

  const closeExecutiveRoom = () => {
    setShowExecutiveRoom(false);
    setExecutiveSlide(0);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };

  const toggleExecutiveFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.querySelector('.executive-room')?.requestFullscreen?.().catch(() => {});
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
      setNewApp({ ...EMPTY_APP_DRAFT });
      setShowAppDeployModal(false);
    } catch (appError) { setAppCatalogError(appError.message || 'No fue posible desplegar el aplicativo.'); }
    finally { setIsAddingApp(false); }
  };
  const handleDeleteApp = async (id) => {
    if (!window.confirm('¿Eliminar este aplicativo del catálogo?')) return;
    setCatalogPendingAction(`delete-${id}`);
    setAppCatalogError('');
    try {
      const r = await post({ action: 'deleteApp', usuario: userData.usuario, authToken: userData.sessionToken, id });
      if (r.status !== 'success') throw new Error(r.message || 'No fue posible eliminar el aplicativo.');
      await fetchApps();
    } catch (appError) { setAppCatalogError(appError.message || 'No fue posible eliminar el aplicativo.'); }
    finally { setCatalogPendingAction(''); }
  };
  const handleUpdateApp = async (e, id) => {
    e.preventDefault();
    setAppCatalogError('');
    try {
      const appToUpdate = appsList.find(a => a.id === id);
      if (!appToUpdate?.grupo?.trim()) return;
      setCatalogPendingAction(`update-${id}`);
      const r = await post({ action: 'updateApp', usuario: userData.usuario, authToken: userData.sessionToken, appData: { ...appToUpdate, grupo: canonicalGroupName(appToUpdate.grupo, appGroups) } });
      if (r.status !== 'success') throw new Error(r.message || 'No fue posible actualizar el aplicativo.');
      setEditingAppId(null); await fetchApps();
    } catch (appError) { setAppCatalogError(appError.message || 'No fue posible actualizar el aplicativo.'); }
    finally { setCatalogPendingAction(''); }
  };
  const toggleAppStatus = async (app) => {
    const nextStatus = isAppEnabled(app) ? 'Inactivo' : 'Activo';
    setCatalogPendingAction(`status-${app.id}`);
    setAppCatalogError('');
    try {
      const r = await post({ action: 'setAppStatus', usuario: userData.usuario, authToken: userData.sessionToken, id: app.id, estado: nextStatus });
      if (r.status !== 'success') throw new Error(r.message || 'No fue posible cambiar la disponibilidad.');
      await fetchApps();
    } catch (appError) { setAppCatalogError(appError.message || 'No fue posible cambiar la disponibilidad.'); }
    finally { setCatalogPendingAction(''); }
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
    if (['Interrumpido', 'Mantenimiento'].includes(app.estadoOperativo)) {
      setEcosystemError(app.estadoOperativo === 'Mantenimiento'
        ? `${app.nombre} se encuentra en mantenimiento. Consulta la ventana programada antes de ingresar.`
        : `${app.nombre} presenta una interrupción activa. El Centro de control mostrará el avance de la recuperación.`);
      navigateToView('control');
      return;
    }
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

  const goDesktop = () => navigateToView('dashboard');
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
                  {loading ? <><NexoActionLoader s={17} /> Validando acceso…</> : 'Ingresar a Ágora'}
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
                      {app.estadoOperativo && app.estadoOperativo !== 'Disponible' && <i className={`lp-health-dot ${OPERATIONAL_STATUS_META[app.estadoOperativo]?.tone || 'healthy'}`} title={app.estadoOperativo} />}
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
    const handleLaunchpadTouchStart = event => {
      const touch = event.touches?.[0];
      launchpadTouchRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
    };
    const handleLaunchpadTouchEnd = event => {
      const start = launchpadTouchRef.current;
      const touch = event.changedTouches?.[0];
      launchpadTouchRef.current = null;
      if (!start || !touch) return;
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      setLaunchpadPage(page => deltaX < 0
        ? Math.min(launchpadPages.length - 1, page + 1)
        : Math.max(0, page - 1));
    };
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
          <div className="lp-pages-viewport" onTouchStart={handleLaunchpadTouchStart} onTouchEnd={handleLaunchpadTouchEnd}>
            <div className="lp-pages-track" style={{ transform: `translateX(-${launchpadPage * 100}%)` }}>
              {launchpadPages.map((entries, pageIndex) => (
                <section className="lp-page" key={`launchpad-page-${pageIndex}`} aria-hidden={pageIndex !== launchpadPage}>
                  {entries.length === 0 ? <p className="empty-note">Sin resultados para “{lpQuery}”.</p> : (
                    <div className="lp-page-grid">
                      {entries.map((entry, index) => (
                        <button key={entry.id} className="lp-item" style={{ animationDelay: `${Math.min(index * 28, 360)}ms` }} onClick={() => openEntry(entry)} title={entry.desc || entry.grupo || entry.nombre}>
                          <AppIcon app={entry} size={76} />
                          {entry.estadoOperativo && entry.estadoOperativo !== 'Disponible' && <i className={`lp-health-dot ${OPERATIONAL_STATUS_META[entry.estadoOperativo]?.tone || 'healthy'}`} title={entry.estadoOperativo} />}
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
    const allTeamTasks = teams.flatMap(team => (team.tasks || []).map(task => ({ ...task, teamName: team.name, teamId: team.id })));
    const commandEntries = [
      { id: 'desktop', label: 'Ir al escritorio', detail: 'Vista principal de Ágora OS', keywords: 'inicio escritorio home', icon: IcoDesktopIco, action: () => navigateToView('dashboard') },
      { id: 'teams', label: 'Abrir Equipos', detail: 'Seguimiento, tareas y calendario', keywords: 'equipo tareas personas', icon: IcoUsers, action: () => navigateToView('teams') },
      { id: 'control', label: 'Centro de control', detail: 'Salud, incidentes y mantenimientos', keywords: 'estado salud incidentes mantenimiento', icon: IcoPulse, action: () => navigateToView('control') },
      { id: 'launchpad', label: 'Abrir Launchpad', detail: 'Todos los aplicativos', keywords: 'aplicaciones apps launchpad', icon: IcoGrid, action: openLaunchpad },
      { id: 'appearance', label: 'Personalizar escritorio', detail: 'Apariencia, color y movimiento', keywords: 'tema fondo oscuro apariencia', icon: IcoSliders, action: () => setShowAppearancePanel(true) },
      { id: 'nexo', label: 'Abrir Ágora Nexo', detail: 'La próxima inteligencia de Ágora OS', keywords: 'ia inteligencia asistente nexo', icon: IcoSparkles, action: () => setShowAgoraNexo(true) },
      ...(isAdmin ? [
        { id: 'analytics', label: 'Abrir Dashboard', detail: 'Adopción y comportamiento del ecosistema', keywords: 'analitica métricas uso', icon: IcoChart, action: () => navigateToView('analytics') },
        { id: 'catalog', label: 'Gestionar Catálogo', detail: 'Gobierno y ciclo de vida', keywords: 'catalogo aplicaciones portafolio', icon: IcoRocket, action: () => navigateToView('catalog') },
        { id: 'notification', label: 'Crear notificación', detail: 'Publicar una alerta empresarial', keywords: 'notificar alerta comunicado', icon: IcoBell, action: () => setShowNotificationComposer(true) },
        { id: 'executive', label: 'Iniciar modo sala ejecutiva', detail: 'Presentación para la dirección', keywords: 'junta presentación sala informe', icon: IcoPresentation, action: openExecutiveRoom },
      ] : []),
    ];
    const executeCommand = (entry) => {
      closeSpotlight();
      entry.action();
    };
    const commandRes = (q ? commandEntries.filter(item => `${item.label} ${item.detail} ${item.keywords}`.toLowerCase().includes(q)) : commandEntries.slice(0, 6));
    const appRes = q ? activeAppsList.filter(a => `${a.nombre} ${a.desc || ''} ${a.grupo || ''} ${a.propietario || ''}`.toLowerCase().includes(q)) : recents.map(recent => activeAppsList.find(app => app.id === recent.id)).filter(Boolean).slice(0, 4);
    const sysRes = q ? SYSTEM_APPS.filter(s => s.nombre.toLowerCase().includes(q)) : [];
    const localTaskRes = q ? tasks.filter(task => task.text.toLowerCase().includes(q)) : [];
    const teamTaskRes = q ? allTeamTasks.filter(task => `${task.title} ${task.description || ''} ${task.teamName} ${task.assignedTo}`.toLowerCase().includes(q)).slice(0, 7) : [];
    const userRes = q ? usersList.filter(user => `${user.nombre || ''} ${user.idRed} ${user.correo || ''} ${user.rol || ''}`.toLowerCase().includes(q)).slice(0, 6) : [];
    const boardRes = q ? boardPosts.filter(post => `${post.title || ''} ${post.body || ''} ${post.author || ''}`.toLowerCase().includes(q)).slice(0, 5) : [];
    const nothing = q && !commandRes.length && !appRes.length && !sysRes.length && !localTaskRes.length && !teamTaskRes.length && !userRes.length && !boardRes.length;

    return (
      <div className="spot-overlay" onClick={closeSpotlight}>
        <div className="spot-modal" onClick={e => e.stopPropagation()}>
          <div className="spot-bar">
            <IcoSearch s={22} />
            <input ref={searchInputRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Busca o ejecuta una acción en Ágora" />
            <span className="kbd">esc</span>
          </div>
          <div className="spot-results">
            {!q && <div className="command-welcome"><span><IcoSparkles s={15} /></span><div><strong>Comando universal</strong><small>Aplicaciones, personas, tareas y acciones en un solo lugar.</small></div><kbd>⌘ K</kbd></div>}

            {commandRes.length > 0 && <div className="spot-group">{q ? 'Acciones' : 'Acciones rápidas'}</div>}
            {commandRes.map(entry => {
              const EntryIcon = entry.icon;
              return <button key={entry.id} className="spot-row command-row" onClick={() => executeCommand(entry)}><span className="command-icon"><EntryIcon s={17} /></span><span><span className="spot-row-title">{entry.label}</span><span className="spot-row-sub">{entry.detail}</span></span><span className="command-enter">↵</span></button>;
            })}

            {appRes.length > 0 && <div className="spot-group">{q ? 'Aplicativos' : 'Aplicaciones recientes'}</div>}
            {appRes.map(a => (
              <button key={a.id} className="spot-row" onClick={() => { closeSpotlight(); launchApp(a); }}>
                <AppIcon app={a} size={34} />
                <span>
                  <span className="spot-row-title" style={{ display: 'block' }}>{a.nombre}</span>
                  <span className="spot-row-sub">{a.grupo || 'Sin grupo'}{a.desc ? ` · ${String(a.desc).slice(0, 54)}` : ''}</span>
                </span>
                <span className={`command-health ${OPERATIONAL_STATUS_META[a.estadoOperativo]?.tone || 'healthy'}`}>{a.estadoOperativo || 'Disponible'}</span>
              </button>
            ))}

            {sysRes.length > 0 && <div className="spot-group">Utilidades</div>}
            {sysRes.map(s => (
              <button key={s.sys} className="spot-row" onClick={() => { closeSpotlight(); launchSystemApp(s.sys); }}>
                <AppIcon app={{ nombre: s.nombre, grad: s.grad, sysIcon: s.icon }} size={34} />
                <span><span className="spot-row-title">{s.nombre}</span><span className="spot-row-sub">Utilidad del sistema</span></span>
              </button>
            ))}

            {(localTaskRes.length > 0 || teamTaskRes.length > 0) && <div className="spot-group">Tareas y compromisos</div>}
            {teamTaskRes.map(task => (
              <button key={task.id} className="spot-row" onClick={() => { navigateToView('teams'); setSelectedTeamId(task.teamId); setTeamSection('tasks'); }}>
                <span className={`command-task-status ${task.status}`}><IcoCheck s={11} /></span>
                <span><span className="spot-row-title">{task.title}</span><span className="spot-row-sub">{task.teamName} · {TEAM_STATUS_LABELS[task.status] || task.status}</span></span>
                {task.dueDate && <small className="command-date">{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</small>}
              </button>
            ))}
            {localTaskRes.map(t => (
              <div key={t.id} className="spot-row">
                <span className="task-box" style={{ width: 22, height: 22 }}>{t.done && <IcoCheck s={11} />}</span>
                <span><span className="spot-row-title" style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span><span className="spot-row-sub">Pendiente personal</span></span>
              </div>
            ))}

            {userRes.length > 0 && <div className="spot-group">Personas</div>}
            {userRes.map(user => <button key={user.idRed} className="spot-row" onClick={() => { closeSpotlight(); if (user.correo) window.location.href = `mailto:${user.correo}`; }}><span className="command-person-avatar">{initialsOf(user.nombre || user.idRed)}</span><span><span className="spot-row-title">{user.nombre || user.idRed}</span><span className="spot-row-sub">{user.idRed} · {user.rol || 'Colaborador'} · {user.correo || 'Sin correo'}</span></span></button>)}

            {boardRes.length > 0 && <div className="spot-group">Comunicaciones</div>}
            {boardRes.map(postItem => <button key={postItem.id} className="spot-row" onClick={() => { closeSpotlight(); const link = normalizeExternalUrl(postItem.linkUrl); if (link) window.open(link, '_blank', 'noopener,noreferrer'); else navigateToView('dashboard'); }}><span className="command-icon"><IcoBell s={16} /></span><span><span className="spot-row-title">{postItem.title || 'Banner corporativo'}</span><span className="spot-row-sub">{String(postItem.body || 'Comunicación del Tablero Corporativo').slice(0, 72)}</span></span></button>)}

            {nothing && <p className="empty-note" style={{ padding: '34px 0' }}>Sin resultados para “{searchQuery}”.</p>}
          </div>
          <footer className="command-footer"><span>Resultados integrados de Ágora OS</span><span><kbd>esc</kbd> Cerrar</span></footer>
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
              <button type="submit" className="btn btn-primary" disabled={teamsLoading}>{teamsPendingAction === 'team-save' ? <><NexoActionLoader /> Guardando equipo…</> : 'Guardar equipo'}</button>
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
            <button className="btn btn-secondary" onClick={() => fetchTeams()} disabled={teamsLoading}>{teamsLoading && !teamsPendingAction ? <NexoActionLoader /> : <IcoRefresh s={15} />} {teamsLoading && !teamsPendingAction ? 'Sincronizando…' : 'Actualizar'}</button>
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
                {canManageSelectedTeam && <div className="team-overview-actions"><button className="btn btn-primary team-report-button" onClick={() => handleDownloadTeamReport(selectedTeam)} disabled={teamReportGenerating}>{teamReportGenerating ? <NexoActionLoader /> : <IcoDownload s={15} />} {teamReportGenerating ? 'Preparando PDF…' : 'Informe PDF'}</button><button className="btn btn-secondary" disabled={teamsLoading} onClick={() => openExistingTeamEditor(selectedTeam)}><IcoEdit s={15} /> Gestionar equipo</button>{isAdmin && <button className="icon-btn danger" disabled={teamsLoading} onClick={() => removeTeam(selectedTeam)} title="Eliminar equipo">{teamsPendingAction === `team-remove-${selectedTeam.id}` ? <NexoActionLoader s={15} /> : <IcoTrash s={16} />}</button>}</div>}
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
                  <button className="btn btn-primary" type="submit" disabled={teamsLoading}>{teamsPendingAction === 'task-add' ? <><NexoActionLoader /> Asignando…</> : 'Asignar tarea'}</button>
                </form>}

                <div className="team-task-list-head"><div><span>Control operativo</span><h4>Listado de tareas</h4></div><div className="team-task-filters">{[{ id: 'all', label: 'Todas' }, ...TEAM_TASK_COLUMNS].map(filter => <button key={filter.id} className={teamTaskFilter === filter.id ? 'active' : ''} onClick={() => setTeamTaskFilter(filter.id)}>{filter.label}<span>{filter.id === 'all' ? totalTasks : teamTasks.filter(task => task.status === filter.id).length}</span></button>)}</div></div>
                <div className="team-executive-task-list">
                  {filteredTeamTasks.length === 0 ? <div className="team-task-list-empty"><IcoCheck s={24} /><strong>Sin tareas en esta vista</strong><span>Cambia el filtro o asigna una nueva responsabilidad.</span></div> : filteredTeamTasks.map(task => {
                    const isAssignee = String(task.assignedTo).toUpperCase() === userId;
                    const isOverdue = task.status !== 'completada' && task.dueDate && task.dueDate < todayKey;
                    return <article key={task.id} className={`team-executive-task priority-${task.priority} ${isOverdue ? 'overdue' : ''}`}><span className="team-task-priority-line" /><div className="team-task-main"><div><span className={`team-priority-pill ${task.priority}`}>{task.priority}</span><span className={`team-status-pill ${task.status}`}>{TEAM_STATUS_LABELS[task.status]}</span>{isOverdue && <span className="team-overdue-pill">Vencida</span>}</div><h4>{task.title}</h4><p>{task.description || 'Sin descripción adicional.'}</p></div><div className="team-task-assignee"><span className="team-person-avatar">{initialsOf(memberName(task.assignedTo))}</span><div><small>Responsable</small><strong>{memberName(task.assignedTo)}</strong><span>{task.assignedTo}</span></div></div><div className="team-task-date"><IcoCal s={16} /><div><small>Fecha límite</small><strong>{task.dueDate ? new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sin fecha'}</strong></div></div><div className="team-task-status-control">{isAssignee ? <><small>Actualizar mi estado</small><div>{TEAM_TASK_COLUMNS.map(status => <button key={status.id} className={task.status === status.id ? 'active' : ''} disabled={teamsLoading || task.status === status.id} onClick={() => updateTeamTaskStatus(task, status.id)} title={status.label}>{teamsPendingAction === `task-status-${task.id}-${status.id}` ? <NexoActionLoader s={12} /> : status.id === 'pendiente' ? 'Por hacer' : status.id === 'en_progreso' ? 'En curso' : 'Finalizar'}</button>)}</div></> : <><small>Estado gestionado por</small><strong>{memberName(task.assignedTo)}</strong><span>Solo el responsable puede actualizarlo.</span></>}</div></article>;
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
            <button className="analytics-refresh" onClick={fetchAnalytics} disabled={analyticsLoading}>{analyticsLoading ? <NexoActionLoader /> : <IcoRefresh s={15} />} {analyticsLoading ? 'Actualizando…' : 'Actualizar'}</button>
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
          <thead><tr><th>App</th><th>Grupo</th><th>Endpoint</th><th>Disponibilidad</th><th style={{ width: 272 }}>Acciones</th></tr></thead>
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
                        <button className="btn btn-primary" style={{ padding: '7px 14px' }} disabled={!app.grupo?.trim() || Boolean(catalogPendingAction)} onClick={e => handleUpdateApp(e, app.id)}>{catalogPendingAction === `update-${app.id}` ? <><NexoActionLoader /> Guardando…</> : 'Guardar'}</button>
                        <button className="btn btn-secondary" style={{ padding: '7px 14px' }} disabled={Boolean(catalogPendingAction)} onClick={() => { setEditingAppId(null); fetchApps(); }}>Cancelar</button>
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
                          <div className="catalog-lifecycle-line"><span>v{app.version || '1.0'}</span><span>{app.etapa || 'Producción'}</span><span>{app.criticidad || 'Media'}</span></div>
                        </div>
                      </div>
                    </td>
                    <td><span className="app-group-tag"><IcoGrid s={11} /> {app.grupo || 'Sin grupo'}</span></td>
                    <td className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{String(app.url || '').slice(0, 46)}…</td>
                    <td><span className={`app-status-pill ${isAppEnabled(app) ? 'enabled' : 'disabled'}`}><i /> {isAppEnabled(app) ? 'Habilitada' : 'Deshabilitada'}</span></td>
                    <td>
                      <div className="catalog-row-actions">
                        <button className="app-lifecycle-button" disabled={Boolean(catalogPendingAction)} onClick={() => openPortfolioApp(app)} title="Abrir ficha de gobierno"><span className="app-lifecycle-symbol"><IcoDocument s={14} /></span><span><strong>Ficha</strong><small>Gobierno</small></span><IcoChevron s={11} /></button>
                        <button className={`app-power-button ${isAppEnabled(app) ? 'disable' : 'enable'}`} disabled={Boolean(catalogPendingAction)} onClick={() => toggleAppStatus(app)} title={isAppEnabled(app) ? 'Deshabilitar aplicativo' : 'Habilitar aplicativo'}>{catalogPendingAction === `status-${app.id}` ? <><NexoActionLoader s={14} /> Procesando…</> : isAppEnabled(app) ? 'Deshabilitar' : 'Habilitar'}</button>
                        <button className="icon-btn" disabled={Boolean(catalogPendingAction)} onClick={() => setEditingAppId(app.id)} title="Editar"><IcoEdit /></button>
                        <button className="icon-btn danger" disabled={Boolean(catalogPendingAction)} onClick={() => handleDeleteApp(app.id)} title="Eliminar">{catalogPendingAction === `delete-${app.id}` ? <NexoActionLoader s={15} /> : <IcoTrash />}</button>
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
            <div className="app-deploy-governance-title"><span><IcoShield s={14} /> Gobierno y ciclo de vida</span><small>Información para administrar el aplicativo como un producto empresarial.</small></div>
            <div><label className="form-label">Propietario funcional</label><input className="field" value={newApp.propietario} onChange={e => setNewApp({ ...newApp, propietario: e.target.value })} placeholder="Ej. Gestión Humana" /></div>
            <div><label className="form-label">Responsable técnico</label><input className="field" value={newApp.responsableTecnico} onChange={e => setNewApp({ ...newApp, responsableTecnico: e.target.value })} placeholder="Ej. Tecnología / proveedor" /></div>
            <div><label className="form-label">Empresa</label><input className="field" value={newApp.empresa} onChange={e => setNewApp({ ...newApp, empresa: e.target.value })} placeholder="Multival" /></div>
            <div><label className="form-label">Versión inicial</label><input className="field" value={newApp.version} onChange={e => setNewApp({ ...newApp, version: e.target.value })} placeholder="1.0" /></div>
            <div><label className="form-label">Criticidad</label><select className="field" value={newApp.criticidad} onChange={e => setNewApp({ ...newApp, criticidad: e.target.value })}><option>Baja</option><option>Media</option><option>Alta</option><option>Crítica</option></select></div>
            <div><label className="form-label">Etapa</label><select className="field" value={newApp.etapa} onChange={e => setNewApp({ ...newApp, etapa: e.target.value })}><option>Idea</option><option>Desarrollo</option><option>Piloto</option><option>Producción</option><option>Mantenimiento</option></select></div>
            <div><label className="form-label">SLA objetivo</label><input className="field" type="number" min="0" value={newApp.slaHoras} onChange={e => setNewApp({ ...newApp, slaHoras: e.target.value })} placeholder="Horas" /></div>
            <div><label className="form-label">Fecha de lanzamiento</label><input className="field" type="date" value={newApp.fechaLanzamiento} onChange={e => setNewApp({ ...newApp, fechaLanzamiento: e.target.value })} /></div>
            <div className="app-deploy-description"><label className="form-label">Dependencias</label><input className="field" value={newApp.dependencias} onChange={e => setNewApp({ ...newApp, dependencias: e.target.value })} placeholder="Directorio, autenticación, otros aplicativos…" /></div>
            <label className="app-initial-status">
              <span><strong>Publicar inmediatamente</strong><small>Si la desactivas, quedará guardada en el catálogo sin aparecer a los usuarios.</small></span>
              <input type="checkbox" checked={newApp.estado !== 'Inactivo'} onChange={e => setNewApp({ ...newApp, estado: e.target.checked ? 'Activo' : 'Inactivo' })} />
            </label>
            <div className="app-deploy-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAppDeployModal(false)} disabled={isAddingApp}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={isAddingApp || !newApp.grupo.trim()}>{isAddingApp ? <NexoActionLoader /> : <IcoRocket s={15} />} {isAddingApp ? 'Desplegando…' : 'Guardar y desplegar'}</button>
            </div>
          </form>
        </section>
      </div>
    );
  };

  const renderNotificationCenter = () => {
    if (!showNotificationCenter) return null;
    const unread = notifications.filter(item => !item.read).length;
    return (
      <div className="notification-layer" onMouseDown={() => setShowNotificationCenter(false)}>
        <aside className="notification-center" onMouseDown={e => e.stopPropagation()}>
          <header className="notification-head">
            <div><span>Centro empresarial</span><h2>Notificaciones</h2><p>{unread ? `${unread} pendientes por revisar` : 'Todo está al día'}</p></div>
            <button className="modal-close" onClick={() => setShowNotificationCenter(false)}><IcoX s={13} /></button>
          </header>
          <div className="notification-toolbar">
            {isAdmin && <button className="notification-compose-trigger" onClick={() => { setShowNotificationCenter(false); setShowNotificationComposer(true); }}><IcoPlus s={13} /> Nueva notificación</button>}
            {unread > 0 && <button onClick={() => {
              const pending = notifications.filter(item => !item.read);
              setNotifications(items => items.map(item => ({ ...item, read: true, readAt: Date.now() })));
              Promise.all(pending.map(item => post({ action: 'markNotificationRead', usuario: userData.usuario, authToken: userData.sessionToken, id: item.id }))).catch(() => {});
            }}>Marcar todas como leídas</button>}
          </div>
          <div className="notification-list">
            {notificationsLoading && notifications.length === 0 ? <div className="notification-empty"><span className="spinner" /><strong>Sincronizando novedades…</strong></div> : notifications.length === 0 ? <div className="notification-empty"><span><IcoBell s={25} /></span><strong>No tienes notificaciones</strong><p>Las novedades importantes de Ágora aparecerán aquí.</p></div> : notifications.map(item => {
              const tone = String(item.priority || 'Media').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              return <button key={item.id} className={`notification-item ${item.read ? 'read' : 'unread'} priority-${tone}`} onClick={() => openNotification(item)}>
                <span className="notification-symbol">{item.type === 'tarea' ? <IcoCheck s={16} /> : item.type === 'mantenimiento' ? <IcoClock s={16} /> : item.type === 'actualizacion' ? <IcoRocket s={16} /> : item.type === 'incidente' ? <IcoShield s={16} /> : <IcoBell s={16} />}</span>
                <span className="notification-copy"><span><strong>{item.title}</strong>{!item.read && <i />}</span><p>{item.message}</p><small>{item.author} · {new Date(item.publishedAt).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</small></span>
                <IcoChevron s={13} />
              </button>;
            })}
          </div>
          <footer className="notification-footer"><span><i /> Actualización automática cada minuto</span><button disabled={notificationsLoading} onClick={() => fetchNotifications()}>{notificationsLoading && <NexoActionLoader s={13} />} {notificationsLoading ? 'Actualizando…' : 'Actualizar'}</button></footer>
        </aside>
      </div>
    );
  };

  const renderNotificationComposer = () => {
    if (!showNotificationComposer) return null;
    return <div className="modal-overlay notification-compose-overlay" onMouseDown={() => setShowNotificationComposer(false)}>
      <section className="notification-compose-modal" onMouseDown={e => e.stopPropagation()}>
        <div className="modal-head"><div><span className="login-kicker">Comunicación dirigida</span><h2>Nueva notificación</h2><p>Publica una novedad accionable en el escritorio de tus usuarios.</p></div><button className="modal-close" onClick={() => setShowNotificationComposer(false)}><IcoX s={13} /></button></div>
        <form onSubmit={saveNotificationDraft} className="notification-compose-form">
          <label className="wide"><span>Título</span><input className="field" required maxLength={90} value={notificationDraft.title} onChange={e => setNotificationDraft(current => ({ ...current, title: e.target.value }))} placeholder="Ej. Mantenimiento programado" /></label>
          <label className="wide"><span>Mensaje</span><textarea className="field" required maxLength={280} value={notificationDraft.message} onChange={e => setNotificationDraft(current => ({ ...current, message: e.target.value }))} placeholder="Explica qué debe saber o hacer el usuario." /></label>
          <label><span>Tipo</span><select className="field" value={notificationDraft.type} onChange={e => setNotificationDraft(current => ({ ...current, type: e.target.value }))}><option value="informativa">Informativa</option><option value="tarea">Tarea</option><option value="mantenimiento">Mantenimiento</option><option value="incidente">Incidente</option><option value="actualizacion">Actualización</option></select></label>
          <label><span>Prioridad</span><select className="field" value={notificationDraft.priority} onChange={e => setNotificationDraft(current => ({ ...current, priority: e.target.value }))}><option>Media</option><option>Alta</option><option>Crítica</option><option>Baja</option></select></label>
          <label><span>Audiencia</span><select className="field" value={notificationDraft.audienceType} onChange={e => setNotificationDraft(current => ({ ...current, audienceType: e.target.value, audienceValue: '' }))}><option>Todos</option><option>Rol</option><option>Equipo</option><option>Usuario</option></select></label>
          {notificationDraft.audienceType !== 'Todos' && <label><span>{notificationDraft.audienceType === 'Usuario' ? 'ID de red' : notificationDraft.audienceType === 'Rol' ? 'Nombre del rol' : 'ID del equipo'}</span><input className="field" required value={notificationDraft.audienceValue} onChange={e => setNotificationDraft(current => ({ ...current, audienceValue: e.target.value }))} placeholder="Puedes separar varios con coma" /></label>}
          <label><span>Destino</span><select className="field" value={notificationDraft.linkType} onChange={e => setNotificationDraft(current => ({ ...current, linkType: e.target.value, link: e.target.value === 'external' ? '' : e.target.value }))}><option value="">Sin acción</option><option value="agora://teams">Equipos</option><option value="agora://control">Centro de control</option><option value="agora://catalog">Catálogo</option><option value="external">URL externa</option></select></label>
          {notificationDraft.linkType === 'external' && <label><span>URL externa</span><input className="field" type="url" required value={notificationDraft.link} onChange={e => setNotificationDraft(current => ({ ...current, link: e.target.value }))} placeholder="https://..." /></label>}
          <label><span>Aplicativo relacionado</span><select className="field" value={notificationDraft.appId} onChange={e => setNotificationDraft(current => ({ ...current, appId: e.target.value }))}><option value="">Ninguno</option>{appsList.map(app => <option key={app.id} value={app.id}>{app.nombre}</option>)}</select></label>
          <label><span>Expira <small>Opcional</small></span><input className="field" type="datetime-local" value={notificationDraft.expiresAt} onChange={e => setNotificationDraft(current => ({ ...current, expiresAt: e.target.value }))} /></label>
          <div className="notification-compose-actions"><button type="button" className="btn btn-secondary" disabled={notificationsLoading} onClick={() => setShowNotificationComposer(false)}>Cancelar</button><button className="btn btn-primary" disabled={notificationsLoading}>{notificationsLoading ? <NexoActionLoader /> : <IcoBell s={15} />} {notificationsLoading ? 'Publicando…' : 'Publicar notificación'}</button></div>
        </form>
      </section>
    </div>;
  };

  const renderEcosystemControl = () => {
    const control = ecosystemData || { apps: appsList, incidents: [], maintenances: [], summary: {} };
    const summary = control.summary || {};
    const activeIncidents = (control.incidents || []).filter(item => !['Resuelto', 'Cerrado'].includes(item.status));
    const upcoming = (control.maintenances || []).filter(item => item.endsAt >= Date.now() && item.status !== 'Cancelado').slice(0, 6);
    const health = summary.totalApps ? Math.round((summary.operational || 0) / summary.totalApps * 100) : 100;
    const appName = id => (control.apps || appsList).find(app => String(app.id) === String(id))?.nombre || 'Aplicativo';
    return <div className="control-page enter">
      <section className="control-hero">
        <span className="control-hero-glow" aria-hidden="true" />
        <div className="control-hero-copy">
          <span className="control-live-badge"><i /> {ecosystemLoading ? 'Sincronizando ecosistema' : 'Operación en tiempo real'}</span>
          <h2>Centro de control</h2>
          <p>Disponibilidad, incidentes, mantenimientos y responsables del ecosistema.</p>
          <div className="control-hero-meta"><span><IcoCheck s={13} /> Monitoreo centralizado</span><span><IcoClock s={13} /> Actualizado {currentTime.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })}</span></div>
        </div>
        <div className="control-hero-actions"><button className="btn btn-secondary" onClick={() => fetchEcosystemControl()} disabled={ecosystemLoading}>{ecosystemLoading ? <NexoActionLoader /> : <IcoRefresh s={15} />} {ecosystemLoading ? 'Sincronizando…' : 'Actualizar'}</button>{isAdmin && <><button className="btn btn-secondary" onClick={() => { setIncidentDraft(current => ({ ...current, appId: current.appId || appsList[0]?.id || '' })); setShowIncidentEditor(true); }}><IcoShield s={15} /> Registrar incidente</button><button className="btn btn-primary" onClick={() => { setMaintenanceDraft(current => ({ ...current, appId: current.appId || appsList[0]?.id || '' })); setShowMaintenanceEditor(true); }}><IcoCal s={15} /> Programar mantenimiento</button></>}</div>
      </section>
      {ecosystemError && <div className="teams-alert"><IcoShield s={17} /><span><strong>No fue posible completar la operación.</strong>{ecosystemError}</span><button onClick={() => setEcosystemError('')}><IcoX s={11} /></button></div>}
      <section className="control-summary-grid">
        <article className="control-health-card"><div className="control-health-ring" style={{ '--health-progress': `${health * 3.6}deg` }}><span><strong>{health}%</strong><small>salud</small></span></div><div><span>Disponibilidad general</span><strong>{summary.operational ?? appsList.length} de {summary.totalApps ?? appsList.length}</strong><p>Aplicativos operando normalmente</p></div></article>
        <article><span className="control-kpi-icon healthy"><IcoCheck s={18} /></span><div><small>Disponibles</small><strong>{summary.operational || 0}</strong><p>Servicios estables</p></div></article>
        <article><span className="control-kpi-icon warning"><IcoPulse s={18} /></span><div><small>Degradados</small><strong>{summary.degraded || 0}</strong><p>Con afectación parcial</p></div></article>
        <article className={(summary.unavailable || 0) ? 'danger' : ''}><span className="control-kpi-icon critical"><IcoShield s={18} /></span><div><small>Interrumpidos</small><strong>{summary.unavailable || 0}</strong><p>Requieren atención</p></div></article>
        <article><span className="control-kpi-icon maintenance"><IcoClock s={18} /></span><div><small>Mantenimientos</small><strong>{summary.upcomingMaintenance || 0}</strong><p>Ventanas próximas</p></div></article>
      </section>
      <section className="control-app-section">
        <div className="control-section-head"><div><span>Mapa de servicios</span><h3>Salud de los aplicativos</h3></div><small>{(control.apps || []).length} servicios monitoreados</small></div>
        <div className="control-app-grid">{(control.apps || []).map(app => {
          const meta = OPERATIONAL_STATUS_META[app.estadoOperativo] || OPERATIONAL_STATUS_META.Disponible;
          return <article key={app.id} className={`control-app-card ${meta.tone}`} onClick={() => isAdmin && openPortfolioApp(app)}><AppIcon app={app} size={42} /><div><strong>{app.nombre}</strong><small>{app.grupo || 'Sin grupo'} · Criticidad {app.criticidad || 'Media'}</small><span className="control-status-pill"><i /> {meta.label}</span></div><div className="control-app-owner"><small>Responsable</small><strong>{app.responsableTecnico || app.propietario || 'Por definir'}</strong></div>{isAdmin && <span className="control-app-open"><IcoChevron s={13} /></span>}</article>;
        })}</div>
      </section>
      <div className="control-detail-grid">
        <section className="control-list-card incidents"><div className="control-section-head"><div><span>Gestión de continuidad</span><h3>Incidentes activos</h3></div><b>{activeIncidents.length}</b></div>
          <div className="control-event-list">{activeIncidents.length === 0 ? <div className="control-empty"><span><IcoCheck s={21} /></span><strong>Operación bajo control</strong><p>No hay incidentes activos.</p></div> : activeIncidents.slice(0, 8).map(incident => <article key={incident.id}><i className={`severity-${incident.severity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`} /><div><span><strong>{incident.title}</strong><b>{incident.severity}</b></span><p>{appName(incident.appId)} · {incident.status}</p><small>{new Date(incident.startedAt).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })} · {incident.owner || 'Responsable por definir'}</small></div>{isAdmin && <button onClick={() => resolveIncident(incident)}>Gestionar</button>}</article>)}</div>
        </section>
        <section className="control-list-card maintenance"><div className="control-section-head"><div><span>Agenda técnica</span><h3>Próximos mantenimientos</h3></div><b>{upcoming.length}</b></div>
          <div className="maintenance-timeline">{upcoming.length === 0 ? <div className="control-empty"><span><IcoCal s={21} /></span><strong>Sin ventanas programadas</strong><p>La agenda técnica está despejada.</p></div> : upcoming.map(item => <article key={item.id}><time><strong>{new Date(item.startsAt).getDate()}</strong><span>{new Date(item.startsAt).toLocaleDateString('es-CO', { month: 'short' })}</span></time><div><strong>{appName(item.appId)}</strong><p>{item.description || item.type}</p><small>{new Date(item.startsAt).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })}–{new Date(item.endsAt).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })} · {item.owner || 'Tecnología'}</small></div><span>{item.status}</span></article>)}</div>
        </section>
      </div>
    </div>;
  };

  const renderControlEditors = () => <>
    {showIncidentEditor && <div className="modal-overlay control-editor-overlay" onMouseDown={() => !ecosystemLoading && setShowIncidentEditor(false)}><section className="control-editor-modal" onMouseDown={e => e.stopPropagation()}><div className="modal-head control-editor-head"><div className="control-editor-title"><span className="control-editor-symbol"><IcoShield s={19} /></span><div><span className="login-kicker">Continuidad del servicio</span><h2>{incidentDraft.id ? 'Gestionar incidente' : 'Registrar incidente'}</h2><p>Documenta la afectación, su alcance y el responsable de recuperación.</p></div></div><button className="modal-close" disabled={ecosystemLoading} onClick={() => setShowIncidentEditor(false)}><IcoX s={13} /></button></div><form onSubmit={saveIncidentDraft} className="control-editor-form">
      <label><span>Aplicativo</span><select className="field control-select" required value={incidentDraft.appId} onChange={e => setIncidentDraft(current => ({ ...current, appId: e.target.value }))}><option value="">Selecciona un aplicativo</option>{appsList.map(app => <option key={app.id} value={app.id}>{app.nombre}</option>)}</select></label><label><span>Severidad</span><select className="field control-select" value={incidentDraft.severity} onChange={e => setIncidentDraft(current => ({ ...current, severity: e.target.value }))}><option>Baja</option><option>Media</option><option>Alta</option><option>Crítica</option></select></label>
      <label className="wide"><span>Título</span><input className="field" required value={incidentDraft.title} onChange={e => setIncidentDraft(current => ({ ...current, title: e.target.value }))} placeholder="Describe brevemente la afectación" /></label><label className="wide"><span>Detalle</span><textarea className="field" value={incidentDraft.description} onChange={e => setIncidentDraft(current => ({ ...current, description: e.target.value }))} placeholder="Impacto observado y acciones iniciales." /></label>
      <label><span>Estado</span><select className="field control-select" value={incidentDraft.status} onChange={e => setIncidentDraft(current => ({ ...current, status: e.target.value }))}><option>Identificado</option><option>Investigando</option><option>Monitoreando</option><option>Resuelto</option><option>Cerrado</option></select></label><label><span>Responsable</span><input className="field" value={incidentDraft.owner} onChange={e => setIncidentDraft(current => ({ ...current, owner: e.target.value }))} placeholder="Área o persona" /></label><label><span>Usuarios afectados</span><input className="field" type="number" min="0" value={incidentDraft.affectedUsers} onChange={e => setIncidentDraft(current => ({ ...current, affectedUsers: e.target.value }))} /></label>{['Resuelto', 'Cerrado'].includes(incidentDraft.status) && <label className="wide"><span>Resolución</span><textarea className="field" required value={incidentDraft.resolution} onChange={e => setIncidentDraft(current => ({ ...current, resolution: e.target.value }))} placeholder="Explica la solución aplicada." /></label>}
      <div className="control-editor-actions"><button type="button" className="btn btn-secondary" disabled={ecosystemLoading} onClick={() => setShowIncidentEditor(false)}>Cancelar</button><button className="btn btn-primary" disabled={ecosystemLoading}>{ecosystemLoading ? <><NexoActionLoader /> Guardando incidente…</> : 'Guardar incidente'}</button></div>
    </form></section></div>}
    {showMaintenanceEditor && <div className="modal-overlay control-editor-overlay" onMouseDown={() => !ecosystemLoading && setShowMaintenanceEditor(false)}><section className="control-editor-modal" onMouseDown={e => e.stopPropagation()}><div className="modal-head control-editor-head"><div className="control-editor-title"><span className="control-editor-symbol"><IcoCal s={19} /></span><div><span className="login-kicker">Agenda técnica</span><h2>Programar mantenimiento</h2><p>Define una ventana clara para anticipar impactos y mantener informados a los usuarios.</p></div></div><button className="modal-close" disabled={ecosystemLoading} onClick={() => setShowMaintenanceEditor(false)}><IcoX s={13} /></button></div><form onSubmit={saveMaintenanceDraft} className="control-editor-form">
      <label><span>Aplicativo</span><select className="field control-select" required value={maintenanceDraft.appId} onChange={e => setMaintenanceDraft(current => ({ ...current, appId: e.target.value }))}><option value="">Selecciona un aplicativo</option>{appsList.map(app => <option key={app.id} value={app.id}>{app.nombre}</option>)}</select></label><label><span>Tipo</span><select className="field control-select" value={maintenanceDraft.type} onChange={e => setMaintenanceDraft(current => ({ ...current, type: e.target.value }))}><option>Programado</option><option>Preventivo</option><option>Correctivo</option><option>Actualización</option></select></label><label className="wide"><span>Descripción</span><textarea className="field" required value={maintenanceDraft.description} onChange={e => setMaintenanceDraft(current => ({ ...current, description: e.target.value }))} placeholder="Explica el propósito y posible impacto." /></label><label><span>Inicio</span><input className="field control-date-field" type="datetime-local" required value={maintenanceDraft.startsAt} onChange={e => setMaintenanceDraft(current => ({ ...current, startsAt: e.target.value }))} /></label><label><span>Finalización</span><input className="field control-date-field" type="datetime-local" required value={maintenanceDraft.endsAt} onChange={e => setMaintenanceDraft(current => ({ ...current, endsAt: e.target.value }))} /></label><label><span>Responsable</span><input className="field" value={maintenanceDraft.owner} onChange={e => setMaintenanceDraft(current => ({ ...current, owner: e.target.value }))} placeholder="Tecnología / Proveedor" /></label><div className="control-editor-actions"><button type="button" className="btn btn-secondary" disabled={ecosystemLoading} onClick={() => setShowMaintenanceEditor(false)}>Cancelar</button><button className="btn btn-primary" disabled={ecosystemLoading}>{ecosystemLoading ? <><NexoActionLoader /> Programando…</> : 'Programar y notificar'}</button></div>
    </form></section></div>}
  </>;

  const renderLifecycleModal = () => {
    const app = appsList.find(item => String(item.id) === String(selectedPortfolioAppId));
    if (!app || !portfolioDraft) return null;
    const operational = OPERATIONAL_STATUS_META[app.estadoOperativo] || OPERATIONAL_STATUS_META.Disponible;
    return <div className="modal-overlay lifecycle-overlay" onMouseDown={() => { if (lifecycleSaving) return; setSelectedPortfolioAppId(''); setPortfolioDraft(null); }}>
      <section className="lifecycle-modal" onMouseDown={e => e.stopPropagation()}>
        <header className="lifecycle-hero">
          <div className="lifecycle-app-identity"><AppIcon app={app} size={66} /><div><span>Portafolio empresarial · {app.empresa || 'Multival'}</span><h2>{app.nombre}</h2><p>{app.desc || 'Aplicativo del ecosistema Ágora OS.'}</p></div></div>
          <div className="lifecycle-hero-badges"><span className={`operational-badge ${operational.tone}`}><i /> {operational.label}</span><span>v{app.version || '1.0'}</span><span>{app.etapa || 'Producción'}</span></div>
          <button className="lifecycle-close" disabled={lifecycleSaving} onClick={() => { setSelectedPortfolioAppId(''); setPortfolioDraft(null); }}><IcoX s={14} /></button>
        </header>
        <div className="lifecycle-scroll">
          {appCatalogError && <div className="catalog-alert"><IcoShield s={16} /><span>{appCatalogError}</span><button onClick={() => setAppCatalogError('')}><IcoX s={11} /></button></div>}
          <section className="lifecycle-metrics">
            <article><small>Criticidad</small><strong>{app.criticidad || 'Media'}</strong><span>Impacto empresarial</span></article><article><small>SLA objetivo</small><strong>{app.slaHoras ? `${app.slaHoras} h` : 'Por definir'}</strong><span>Tiempo de atención</span></article><article><small>Documentación</small><strong>{app.documentos?.length || 0}</strong><span>Recursos activos</span></article><article><small>Versiones</small><strong>{app.versiones?.length || 0}</strong><span>Historial registrado</span></article>
          </section>
          <div className="lifecycle-columns">
            <form className="lifecycle-card governance-card" onSubmit={savePortfolioProfile}>
              <div className="lifecycle-card-head"><div><span>Gobierno del producto</span><h3>Ficha del aplicativo</h3></div><IcoShield s={19} /></div>
              <div className="governance-form-grid">
                <label><span>Propietario funcional</span><input className="field" value={portfolioDraft.propietario || ''} onChange={e => setPortfolioDraft(current => ({ ...current, propietario: e.target.value }))} placeholder="Área responsable" /></label>
                <label><span>Responsable técnico</span><input className="field" value={portfolioDraft.responsableTecnico || ''} onChange={e => setPortfolioDraft(current => ({ ...current, responsableTecnico: e.target.value }))} placeholder="Tecnología / proveedor" /></label>
                <label><span>Criticidad</span><select className="field lifecycle-select" value={portfolioDraft.criticidad || 'Media'} onChange={e => setPortfolioDraft(current => ({ ...current, criticidad: e.target.value }))}><option>Baja</option><option>Media</option><option>Alta</option><option>Crítica</option></select></label>
                <label><span>Estado operativo</span><select className="field lifecycle-select" value={portfolioDraft.estadoOperativo || 'Disponible'} onChange={e => setPortfolioDraft(current => ({ ...current, estadoOperativo: e.target.value }))}><option>Disponible</option><option>Degradado</option><option>Mantenimiento</option><option>Interrumpido</option></select></label>
                <label><span>Etapa</span><select className="field lifecycle-select" value={portfolioDraft.etapa || 'Producción'} onChange={e => setPortfolioDraft(current => ({ ...current, etapa: e.target.value }))}><option>Idea</option><option>Desarrollo</option><option>Piloto</option><option>Producción</option><option>Mantenimiento</option><option>Próxima a retirar</option><option>Retirada</option></select></label>
                <label><span>Empresa</span><input className="field" value={portfolioDraft.empresa || ''} onChange={e => setPortfolioDraft(current => ({ ...current, empresa: e.target.value }))} /></label>
                <label><span>SLA en horas</span><input className="field" type="number" min="0" value={portfolioDraft.slaHoras || ''} onChange={e => setPortfolioDraft(current => ({ ...current, slaHoras: e.target.value }))} /></label>
                <label><span>Fecha de lanzamiento</span><input className="field lifecycle-date" type="date" value={portfolioDraft.fechaLanzamiento || ''} onChange={e => setPortfolioDraft(current => ({ ...current, fechaLanzamiento: e.target.value }))} /></label>
                <label className="wide"><span>Dependencias</span><input className="field" value={portfolioDraft.dependencias || ''} onChange={e => setPortfolioDraft(current => ({ ...current, dependencias: e.target.value }))} placeholder="Ej. Directorio, autenticación, Google Sheets" /></label>
              </div>
              <button className="btn btn-primary governance-save" disabled={lifecycleSaving}>{lifecyclePendingAction === 'profile' ? <><NexoActionLoader /> Actualizando ficha…</> : 'Actualizar ficha de gobierno'}</button>
            </form>
            <section className="lifecycle-card document-card">
              <div className="lifecycle-card-head"><div><span>Repositorio del proyecto</span><h3>Documentación</h3></div><IcoDocument s={19} /></div>
              <div className="document-list">{!app.documentos?.length ? <div className="lifecycle-empty"><IcoDocument s={23} /><strong>Sin documentación vinculada</strong><p>Agrega manuales, actas, fichas técnicas o repositorios.</p></div> : app.documentos.map(documentItem => <article key={documentItem.id}><span><IcoDocument s={16} /></span><div><a href={normalizeExternalUrl(documentItem.url)} target="_blank" rel="noreferrer">{documentItem.name}</a><small>{documentItem.type}{documentItem.version ? ` · v${documentItem.version}` : ''} · {documentItem.addedBy}</small><p>{documentItem.description || 'Recurso corporativo del proyecto.'}</p></div><button disabled={lifecycleSaving} onClick={() => removeAppDocument(documentItem.id)} title="Retirar">{lifecyclePendingAction === `document-remove-${documentItem.id}` ? <NexoActionLoader s={14} /> : <IcoTrash s={14} />}</button></article>)}</div>
              <form className="document-add-form" onSubmit={addAppDocument}><div className="document-form-heading"><span><IcoPlus s={15} /></span><div><strong>Vincular nuevo recurso</strong><small>Centraliza los documentos clave del aplicativo.</small></div></div><div><label><span>Nombre del documento</span><input className="field" required value={documentDraft.name} onChange={e => setDocumentDraft(current => ({ ...current, name: e.target.value }))} placeholder="Ej. Manual funcional" /></label><label><span>Tipo</span><select className="field lifecycle-select" value={documentDraft.type} onChange={e => setDocumentDraft(current => ({ ...current, type: e.target.value }))}><option>Manual</option><option>Ficha técnica</option><option>Acta</option><option>Arquitectura</option><option>Repositorio</option><option>Pruebas</option><option>Otro</option></select></label></div><label><span>Enlace al documento</span><input className="field" required type="url" value={documentDraft.url} onChange={e => setDocumentDraft(current => ({ ...current, url: e.target.value }))} placeholder="Google Drive, SharePoint o repositorio corporativo" /></label><div><label><span>Versión</span><input className="field" value={documentDraft.version} onChange={e => setDocumentDraft(current => ({ ...current, version: e.target.value }))} placeholder="1.0" /></label><label><span>Descripción</span><input className="field" value={documentDraft.description} onChange={e => setDocumentDraft(current => ({ ...current, description: e.target.value }))} placeholder="Contenido o propósito" /></label></div><button className="btn btn-secondary" disabled={lifecycleSaving}>{lifecyclePendingAction === 'document-add' ? <><NexoActionLoader /> Vinculando…</> : <><IcoPlus s={14} /> Vincular documento</>}</button></form>
            </section>
          </div>
          <section className="lifecycle-card version-card">
            <div className="lifecycle-card-head"><div><span>Evolución del producto</span><h3>Historial de versiones</h3></div><IcoHistory s={19} /></div>
            <div className="version-layout"><div className="version-timeline">{!app.versiones?.length ? <div className="lifecycle-empty"><IcoHistory s={23} /><strong>Aún no hay versiones registradas</strong><p>Publica la primera versión para construir la trazabilidad.</p></div> : app.versiones.map((versionItem, index) => <article key={versionItem.id}><i /><div><span><strong>v{versionItem.version}</strong>{index === 0 && <b>Actual</b>}</span><p>{versionItem.changes || 'Actualización del aplicativo.'}</p><small>{new Date(versionItem.publishedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })} · {versionItem.publishedBy}</small></div></article>)}</div><form className="version-form" onSubmit={addAppVersion}><div className="version-form-heading"><span><IcoRocket s={15} /></span><div><strong>Publicar nueva versión</strong><small>Registra el avance y conserva la trazabilidad.</small></div></div><label><span>Número de versión</span><input className="field" required value={versionDraft.version} onChange={e => setVersionDraft(current => ({ ...current, version: e.target.value }))} placeholder="Ej. 2.4.0" /></label><label><span>Fecha</span><input className="field lifecycle-date" type="date" required value={versionDraft.publishedAt} onChange={e => setVersionDraft(current => ({ ...current, publishedAt: e.target.value }))} /></label><label><span>Principales cambios</span><textarea className="field" required value={versionDraft.changes} onChange={e => setVersionDraft(current => ({ ...current, changes: e.target.value }))} placeholder="Resume las mejoras y correcciones." /></label><button className="btn btn-primary" disabled={lifecycleSaving}>{lifecyclePendingAction === 'version-add' ? <><NexoActionLoader /> Publicando…</> : <><IcoRocket s={14} /> Publicar versión</>}</button></form></div>
          </section>
        </div>
      </section>
    </div>;
  };

  const renderAgoraNexo = () => {
    if (!showAgoraNexo) return null;
    return <div className="nexo-overlay" onMouseDown={() => setShowAgoraNexo(false)}><section className="nexo-modal" onMouseDown={e => e.stopPropagation()}><button className="nexo-close" onClick={() => setShowAgoraNexo(false)}><IcoX s={13} /></button><div className="nexo-orb" aria-hidden="true"><i /><i /><i /><span><IcoSparkles s={32} /></span></div><span className="nexo-kicker">PRÓXIMAMENTE</span><h2>Ágora <strong>Nexo</strong></h2><p>Algo grande se está preparando en Ágora OS.</p><small>Una nueva forma de conectar conocimiento, personas, procesos y decisiones.</small><div className="nexo-status"><i /><span>Estamos diseñando esta experiencia con el nivel de seguridad y precisión que merece.</span></div></section></div>;
  };

  const renderExecutiveRoom = () => {
    if (!showExecutiveRoom) return null;
    const analytics = analyticsData || { summary: {}, daily: [], topApps: [] };
    const summary = analytics.summary || {};
    const control = ecosystemData || { summary: {}, incidents: [] };
    const controlSummary = control.summary || {};
    const teamTasks = teams.flatMap(team => team.tasks || []);
    const completeTasks = teamTasks.filter(task => task.status === 'completada').length;
    const openTeamTasks = teamTasks.filter(task => task.status !== 'completada');
    const overdueTeamTasks = openTeamTasks.filter(task => task.dueDate && task.dueDate < todayKey);
    const teamCompletion = teamTasks.length ? Math.round(completeTasks / teamTasks.length * 100) : 0;
    const maxDaily = Math.max(1, ...(analytics.daily || []).map(day => day.totalSeconds || day.appOpens || 0));
    const topApp = analytics.topApps?.[0];
    const activeIncidents = (control.incidents || []).filter(item => !['Resuelto', 'Cerrado'].includes(item.status));
    const signals = [
      overdueTeamTasks.length ? `${overdueTeamTasks.length} compromisos de equipo requieren recuperación.` : 'Los equipos no presentan compromisos vencidos.',
      activeIncidents.length ? `${activeIncidents.length} incidentes activos deben revisarse con Tecnología.` : 'El ecosistema no presenta incidentes activos.',
      topApp ? `${topApp.name} lidera la adopción con ${formatUsageTime(topApp.totalSeconds)} de uso.` : 'La adopción comenzará a consolidarse con nuevas sesiones.',
    ];
    const slides = [
      <section className="executive-slide executive-cover" key="cover"><div className="executive-brand"><span>ÁGORA OS</span><small>INTELIGENCIA DEL ECOSISTEMA</small></div><div className="executive-cover-copy"><span>COMITÉ EJECUTIVO · {analyticsRange} DÍAS</span><h1>El ecosistema digital<br />en una sola mirada.</h1><p>Adopción, operación, equipos y señales clave para orientar decisiones.</p></div><div className="executive-cover-stats"><article><strong>{summary.uniqueUsers || 0}</strong><span>usuarios activos</span></article><article><strong>{formatUsageTime(summary.totalSeconds || 0)}</strong><span>uso efectivo</span></article><article><strong>{controlSummary.operational || 0}/{controlSummary.totalApps || appsList.length}</strong><span>apps disponibles</span></article></div><footer><span>Generado el {currentTime.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span><strong>CONFIDENCIAL · MULTIVAL</strong></footer></section>,
      <section className="executive-slide" key="adoption"><header><div><span>01 · ADOPCIÓN</span><h2>Cómo se mueve Ágora</h2></div><strong>{formatUsageTime(summary.totalSeconds || 0)}</strong></header><div className="executive-kpis"><article><span>Usuarios únicos</span><strong>{summary.uniqueUsers || 0}</strong><small>{summary.activeToday || 0} activos hoy</small></article><article><span>Sesiones</span><strong>{summary.sessions || 0}</strong><small>En el periodo seleccionado</small></article><article><span>Aperturas</span><strong>{summary.appOpens || 0}</strong><small>Interacciones con aplicativos</small></article><article><span>Aplicación líder</span><strong className="textual">{topApp?.name || 'Sin datos'}</strong><small>{topApp ? formatUsageTime(topApp.totalSeconds) : 'Esperando actividad'}</small></article></div><div className="executive-adoption-grid"><div className="executive-trend"><h3>Actividad reciente</h3><div>{(analytics.daily || []).slice(-14).map(day => <span key={day.date}><i style={{ height: `${Math.max(6, (day.totalSeconds || day.appOpens || 0) / maxDaily * 100)}%` }} /><small>{new Date(`${day.date}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric' })}</small></span>)}</div></div><div className="executive-ranking"><h3>Aplicativos con mayor uso</h3>{(analytics.topApps || []).slice(0, 5).map((app, index) => <article key={app.id}><b>{String(index + 1).padStart(2, '0')}</b><div><strong>{app.name}</strong><span><i style={{ width: `${Math.max(4, app.totalSeconds / Math.max(1, topApp?.totalSeconds || 1) * 100)}%` }} /></span></div><small>{formatUsageTime(app.totalSeconds)}</small></article>)}</div></div></section>,
      <section className="executive-slide" key="operation"><header><div><span>02 · CONTINUIDAD</span><h2>Salud del ecosistema</h2></div><strong>{controlSummary.totalApps ? Math.round((controlSummary.operational || 0) / controlSummary.totalApps * 100) : 100}%</strong></header><div className="executive-operation-grid"><article className="executive-health"><div className="executive-health-orbit"><span><strong>{controlSummary.operational || 0}</strong><small>disponibles</small></span></div><h3>Operación general</h3><p>{activeIncidents.length ? 'Existen alertas activas que requieren seguimiento.' : 'Todos los servicios reportados se encuentran bajo control.'}</p></article><div className="executive-status-board"><article><i className="healthy" /><span><strong>{controlSummary.operational || 0}</strong>Disponibles</span></article><article><i className="warning" /><span><strong>{controlSummary.degraded || 0}</strong>Degradados</span></article><article><i className="critical" /><span><strong>{controlSummary.unavailable || 0}</strong>Interrumpidos</span></article><article><i className="maintenance" /><span><strong>{controlSummary.upcomingMaintenance || 0}</strong>Mantenimientos</span></article></div><div className="executive-incidents"><h3>Alertas prioritarias</h3>{activeIncidents.length ? activeIncidents.slice(0, 4).map(incident => <article key={incident.id}><span className={`severity-${incident.severity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`} /><div><strong>{incident.title}</strong><small>{appsList.find(app => app.id === incident.appId)?.nombre || 'Aplicativo'} · {incident.status}</small></div><b>{incident.severity}</b></article>) : <div className="executive-clear"><IcoCheck s={24} /><strong>Sin incidentes activos</strong></div>}</div></div></section>,
      <section className="executive-slide" key="teams"><header><div><span>03 · GESTIÓN</span><h2>Desempeño de los equipos</h2></div><strong>{teamCompletion}%</strong></header><div className="executive-team-kpis"><article><span>Equipos activos</span><strong>{teams.length}</strong></article><article><span>Compromisos</span><strong>{teamTasks.length}</strong></article><article><span>En ejecución</span><strong>{openTeamTasks.length}</strong></article><article className={overdueTeamTasks.length ? 'risk' : ''}><span>Vencidos</span><strong>{overdueTeamTasks.length}</strong></article></div><div className="executive-team-list">{teams.slice(0, 6).map(team => { const total = team.tasks?.length || 0; const done = team.tasks?.filter(task => task.status === 'completada').length || 0; const percent = total ? Math.round(done / total * 100) : 0; return <article key={team.id}><span className="team-list-avatar">{initialsOf(team.name)}</span><div><strong>{team.name}</strong><small>{team.leaderName || team.leaderId} · {team.members?.length || 0} personas</small><i><b style={{ width: `${percent}%` }} /></i></div><em>{percent}%</em></article>; })}</div></section>,
      <section className="executive-slide executive-decisions" key="decisions"><header><div><span>04 · DECISIONES</span><h2>Lo que requiere atención</h2></div><IcoSparkles s={28} /></header><div className="executive-signal-list">{signals.map((signal, index) => <article key={signal}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{index === 0 ? 'Gestión del equipo' : index === 1 ? 'Continuidad operativa' : 'Adopción digital'}</strong><p>{signal}</p></div><i /></article>)}</div><div className="executive-closing"><span>PRÓXIMO PASO</span><h3>Convertir información en decisiones claras.</h3><p>Ágora OS consolida la actividad del ecosistema para enfocar conversaciones, responsables y acciones.</p></div></section>,
    ];
    const totalSlides = slides.length;
    return <div className="executive-room"><div className="executive-room-topbar"><div><span>ÁGORA OS</span><small>Modo sala ejecutiva</small></div><div><button onClick={() => window.print()}><IcoDownload s={15} /> Exportar PDF</button><button onClick={toggleExecutiveFullscreen}><IcoExpand s={15} /> Pantalla completa</button><button className="executive-exit" onClick={closeExecutiveRoom}><IcoX s={13} /> Salir</button></div></div><div className="executive-stage">{slides[executiveSlide]}<button className="executive-arrow prev" disabled={executiveSlide === 0} onClick={() => setExecutiveSlide(slide => Math.max(0, slide - 1))}><IcoChevron s={24} /></button><button className="executive-arrow next" disabled={executiveSlide === totalSlides - 1} onClick={() => setExecutiveSlide(slide => Math.min(totalSlides - 1, slide + 1))}><IcoChevron s={24} /></button></div><div className="executive-navigation"><span>{String(executiveSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}</span><div>{slides.map((_, index) => <button key={index} className={index === executiveSlide ? 'active' : ''} onClick={() => setExecutiveSlide(index)} aria-label={`Ir a la vista ${index + 1}`} />)}</div><small>Usa las flechas para presentar</small></div><div className="executive-print-deck" aria-hidden="true">{slides}</div></div>;
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
    { id: 'dashboard', label: 'Escritorio', admin: false, icon: IcoDesktopIco, detail: 'Inicio y widgets personales' },
    { id: 'teams', label: 'Equipos', admin: false, icon: IcoUsers, detail: 'Tareas, personas y seguimiento' },
    { id: 'control', label: 'Control', admin: false, icon: IcoPulse, detail: 'Salud del ecosistema' },
    { id: 'analytics', label: 'Dashboard', admin: true, icon: IcoChart, detail: 'Analítica administrativa' },
    { id: 'catalog', label: 'Catálogo', admin: true, icon: IcoGrid, detail: 'Gobierno de aplicativos' },
    { id: 'users', label: 'Identidades', admin: true, icon: IcoUser, detail: 'Directorio corporativo' },
  ];
  const currentMenuItem = menuItems.find(item => item.id === currentView) || menuItems[0];
  const mobileMenuItems = menuItems.filter(item => !item.admin || isAdmin);
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
      data-layout={isCompactLayout ? 'compact' : 'desktop'}
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
      {renderNotificationCenter()}
      {renderNotificationComposer()}
      {renderControlEditors()}
      {renderLifecycleModal()}
      {renderAgoraNexo()}
      {renderExecutiveRoom()}

      {/* ================= MENU BAR ================= */}
      <header className="menubar">
        <button className="mobile-brand" onClick={goDesktop} aria-label="Ir al escritorio de Ágora OS">
          <span className="mobile-brand-mark">A</span>
          <span><strong>Ágora OS</strong><small>{activeAppId ? openApps.find(app => app.id === activeAppId)?.nombre : currentMenuItem.label}</small></span>
        </button>
        <div className="menubar-left">
          <div className="menu-logo-spacer" aria-hidden="true" />
          {menuItems.filter(m => !m.admin || isAdmin).map(m => (
            <button key={m.id}
              className={`menu-item ${currentView === m.id && activeAppId === null ? 'active' : ''}`}
              onClick={() => navigateToView(m.id)}>
              {m.label}
            </button>
          ))}
        </div>

        <div className="menubar-right">
          <button className="nexo-menu-button hide-on-compact" title="Ágora Nexo" onClick={() => setShowAgoraNexo(true)}><IcoSparkles s={14} /><span>Nexo</span></button>
          <button className="menu-icon-btn" title="Buscar (⌘K)" onClick={openSpotlight}><IcoSearch s={16} /></button>
          <button className={`menu-icon-btn notification-menu-button ${notifications.some(item => !item.read) ? 'has-unread' : ''}`} title="Notificaciones" onClick={() => { setShowUserMenu(false); setShowMobileMenu(false); setShowNotificationCenter(value => !value); }}><IcoBell s={16} />{notifications.some(item => !item.read) && <span>{Math.min(99, notifications.filter(item => !item.read).length)}</span>}</button>
          {isAdmin && <button className="menu-icon-btn executive-menu-button hide-on-compact" title="Modo sala ejecutiva" onClick={openExecutiveRoom}><IcoPresentation s={16} /></button>}
          <button className={`menu-icon-btn hide-on-compact ${workspaceMode === 'desktop' ? 'on' : ''}`}
            title={workspaceMode === 'desktop' ? 'Ventanas libres' : 'Modo enfoque'}
            onClick={() => setWorkspaceMode(m => m === 'focus' ? 'desktop' : 'focus')}>
            {workspaceMode === 'focus' ? <IcoWindows s={16} /> : <IcoFocus s={16} />}
          </button>
          <button className="menu-icon-btn hide-on-compact" title="Personalizar escritorio" onClick={() => { setShowUserMenu(false); setShowAppearancePanel(true); }}>
            <IcoSliders s={16} />
          </button>
          <button className="menu-icon-btn hide-on-compact" title="Añadir widgets" onClick={() => { setShowUserMenu(false); setShowWidgetGallery(true); }}>
            <IcoWidgets s={16} />
          </button>
          <span className="menu-clock hide-on-compact">
            {currentTime.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}{'  '}
            {menuClockLabel}
          </span>
          <button className="menu-user" onClick={() => { setShowMobileMenu(false); setShowUserMenu(v => !v); }}>
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

      {showMobileMenu && (
        <div className="mobile-menu-layer" role="presentation" onPointerDown={() => setShowMobileMenu(false)}>
          <aside className="mobile-menu-sheet" role="dialog" aria-modal="true" aria-label="Navegación de Ágora OS" onPointerDown={event => event.stopPropagation()}>
            <span className="mobile-sheet-handle" aria-hidden="true" />
            <header className="mobile-menu-head">
              <div className="mobile-menu-identity">
                <span>{initialsOf(welcomeName)}</span>
                <div><strong>{welcomeName}</strong><small>{profilePreferences.roleLabel.trim() || userData.rolGlobal}</small></div>
              </div>
              <button onClick={() => setShowMobileMenu(false)} aria-label="Cerrar menú"><IcoX s={14} /></button>
            </header>

            <div className="mobile-module-grid">
              {mobileMenuItems.map(item => {
                const ModuleIcon = item.icon;
                return <button key={item.id} className={currentView === item.id && activeAppId === null ? 'active' : ''} onClick={() => navigateToView(item.id)}>
                  <span><ModuleIcon s={19} /></span>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </button>;
              })}
            </div>

            {openApps.length > 0 && <section className="mobile-open-apps">
              <header><span>Aplicativos abiertos</span><small>{openApps.length}</small></header>
              <div>{openApps.map(app => <article key={app.id} className={activeAppId === app.id ? 'active' : ''}><button className="mobile-open-app-main" onClick={() => { setShowMobileMenu(false); handleDockClick(app.id); }}><AppIcon app={app} size={38} /><span><strong>{app.nombre}</strong><small>{activeAppId === app.id ? 'En uso' : 'Tocar para continuar'}</small></span></button><button className="mobile-app-close" onClick={event => closeApp(event, app.id)} aria-label={`Cerrar ${app.nombre}`}><IcoX s={10} /></button></article>)}</div>
            </section>}

            <div className="mobile-quick-actions">
              <button onClick={() => { setShowMobileMenu(false); setShowAppearancePanel(true); }}><IcoSliders s={17} /><span>Personalizar</span></button>
              <button onClick={() => { setShowMobileMenu(false); setShowWidgetGallery(true); }}><IcoWidgets s={17} /><span>Widgets</span></button>
              <button onClick={() => { setShowMobileMenu(false); setShowAgoraNexo(true); }}><IcoSparkles s={17} /><span>Ágora Nexo</span></button>
              {isAdmin && <button onClick={() => { setShowMobileMenu(false); openExecutiveRoom(); }}><IcoPresentation s={17} /><span>Sala ejecutiva</span></button>}
            </div>
          </aside>
        </div>
      )}

      {/* ================= WORKSPACE ================= */}
      <main className="workspace">
        <div ref={workspaceScrollRef} className={`workspace-scroll ${workspaceMode === 'focus' && activeAppId !== null ? 'scroll-suspended' : 'scroll-ready'}`} onMouseDown={handleWorkspaceBackground} style={{
          opacity: activeAppId === null || workspaceMode === 'desktop' ? 1 : 0,
          pointerEvents: activeAppId === null || workspaceMode === 'desktop' ? 'auto' : 'none',
        }}>
          <div className="workspace-inner">
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'teams' && renderTeams()}
            {currentView === 'control' && renderEcosystemControl()}
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
            <div key={app.id} aria-hidden={activeAppId !== app.id} className={`focus-app-layer ${COMPACT_SYSTEM_TOOLS.has(app.sys) ? 'compact-utility' : ''}`} style={{
              display: activeAppId === app.id ? undefined : 'none',
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
                  <div className="mobile-app-toolbar">
                    <button className="mobile-app-back" onClick={goDesktop} aria-label="Volver al escritorio"><IcoChevron s={17} /></button>
                    <span><AppIcon app={app} size={27} /><strong>{app.nombre}</strong></span>
                    <button className="mobile-app-dismiss" onClick={event => closeApp(event, app.id)} aria-label={`Cerrar ${app.nombre}`}><IcoX s={12} /></button>
                  </div>
                  {loadingApps[app.id] && !app.sys && <div className="loader-veil"><div className="spinner" /></div>}
                  <div className="focus-app-content">{renderWindowBody(app)}</div>
                </>
              )}
            </div>
          )
        ))}
      </main>

      <nav className="mobile-tabbar" aria-label="Navegación principal móvil">
        <button className={currentView === 'dashboard' && activeAppId === null ? 'active' : ''} onClick={() => navigateToView('dashboard')} aria-current={currentView === 'dashboard' && activeAppId === null ? 'page' : undefined}><IcoDesktopIco s={20} /><span>Inicio</span></button>
        <button className={currentView === 'teams' && activeAppId === null ? 'active' : ''} onClick={() => navigateToView('teams')} aria-current={currentView === 'teams' && activeAppId === null ? 'page' : undefined}><IcoUsers s={20} /><span>Equipos</span></button>
        <button className="mobile-launchpad-button" onClick={openLaunchpad} aria-label="Abrir Launchpad"><span><IcoGrid s={22} /></span><small>Apps</small></button>
        <button className={currentView === 'control' && activeAppId === null ? 'active' : ''} onClick={() => navigateToView('control')} aria-current={currentView === 'control' && activeAppId === null ? 'page' : undefined}><IcoPulse s={20} /><span>Control</span></button>
        <button className={showMobileMenu ? 'active' : ''} onClick={() => { setShowUserMenu(false); setShowNotificationCenter(false); setShowMobileMenu(value => !value); }} aria-expanded={showMobileMenu}><IcoMore s={21} /><span>Más</span></button>
      </nav>

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
