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

/* ==========================================================================
   UTILIDADES
   ========================================================================== */
const getValidImageUrl = (url) => {
  if (!url) return '';
  const m = String(url).match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return m ? `https://drive.google.com/uc?export=view&id=${m[1]}` : url;
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
];

const WALLPAPER_OPTIONS = [
  { id: 'aurora', label: 'Aurora', detail: 'Orgánico y suave' },
  { id: 'neural', label: 'Red neuronal', detail: 'IA e innovación' },
  { id: 'minimal', label: 'Minimal', detail: 'Enfoque limpio' },
  { id: 'depth', label: 'Profundidad', detail: 'Color inmersivo' },
];

const DEFAULT_APPEARANCE = {
  wallpaper: 'aurora',
  accent: 'green',
  contrast: 'balanced',
  transparency: 'glass',
  clockStyle: 'minimal',
  clockFormat: '24',
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

const DEFAULT_BOARD_POSTS = [{
  id: 'welcome-board',
  type: 'comunicado',
  title: 'Actualización de políticas de teletrabajo',
  body: 'Los nuevos lineamientos ya están publicados en el portal de Gestión de Personas.',
  imageUrl: '',
  createdAt: Date.now(),
  author: 'Gestión Administrativa',
}];

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxYszzacLW5AbwolurkZFX2_lq_m2qk3JDWokDpo_DitmquPojP-KGmllamG0xayGlabA/exec';

const SYSTEM_APPS = [
  { sys: 'notes', nombre: 'Notas', grad: 'linear-gradient(150deg,#E8C766,#C9A23B)', icon: IcoNotes, w: 720, h: 520 },
  { sys: 'calculator', nombre: 'Calculadora', grad: 'linear-gradient(150deg,#7C7C86,#4A4A52)', icon: IcoCalc, w: 340, h: 560 },
  { sys: 'todo', nombre: 'Post-its', grad: 'linear-gradient(150deg,#6E9BD1,#3E6BA0)', icon: IcoSticky, w: 440, h: 620 },
];

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
  const [lpQuery, setLpQuery] = useState('');
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const lpInputRef = useRef(null);

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
  const [newBoardPost, setNewBoardPost] = useState({ type: 'comunicado', title: '', body: '', imageUrl: '' });
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

  /* --- CRUD --- */
  const [newApp, setNewApp] = useState({ nombre: '', url: '', desc: '', icono: '' });
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [editingAppId, setEditingAppId] = useState(null);

  /* ---------------- Efectos ---------------- */
  useEffect(() => { document.body.setAttribute('data-theme', theme); }, [theme]);

  useEffect(() => {
    localStorage.setItem('agora_workspace_appearance', JSON.stringify(workspaceAppearance));
  }, [workspaceAppearance]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* --- Overlays: abrir / cerrar --- */
  const openSpotlight = () => { setSearchQuery(''); setIsLaunchpadOpen(false); setIsSpotlightOpen(true); };
  const closeSpotlight = () => { setIsSpotlightOpen(false); setSearchQuery(''); };
  const openLaunchpad = () => { setLpQuery(''); setIsSpotlightOpen(false); setIsLaunchpadOpen(true); };
  const closeLaunchpad = () => { setIsLaunchpadOpen(false); setLpQuery(''); };
  const closeOverlays = () => { closeSpotlight(); closeLaunchpad(); };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchQuery(''); setIsLaunchpadOpen(false); setIsSpotlightOpen(v => !v);
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false); setIsLaunchpadOpen(false); setShowUserMenu(false);
        setShowAppearancePanel(false); setShowWidgetGallery(false); setShowProfileEditor(false);
        setPublicationTypeOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => { if (isSpotlightOpen) searchInputRef.current?.focus(); }, [isSpotlightOpen]);
  useEffect(() => { if (isLaunchpadOpen) lpInputRef.current?.focus(); }, [isLaunchpadOpen]);

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
      const savedFocus = Number(localStorage.getItem(`agora_focus_minutes_${key}`) || 25);
      const validFocus = Number.isFinite(savedFocus) ? Math.min(120, Math.max(5, Math.round(savedFocus / 5) * 5)) : 25;
      setEnabledWidgets(Array.isArray(savedWidgets) ? savedWidgets.filter(id => WIDGET_CATALOG.some(widget => widget.id === id)) : []);
      setProfilePreferences(savedProfile ? { displayName: '', roleLabel: '', welcomeMessage: '', ...savedProfile } : { displayName: '', roleLabel: '', welcomeMessage: '' });
      setQuickNote(localStorage.getItem(`agora_quick_note_${key}`) || '');
      setFocusMinutes(validFocus);
      setPomodoroSeconds(validFocus * 60);
    } catch {
      setEnabledWidgets([]);
      setProfilePreferences({ displayName: '', roleLabel: '', welcomeMessage: '' });
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
    localStorage.setItem(`agora_quick_note_${key}`, quickNote);
    localStorage.setItem(`agora_focus_minutes_${key}`, String(focusMinutes));
  }, [enabledWidgets, profilePreferences, quickNote, focusMinutes, userPreferencesReady, userData]);

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
    const res = await fetch(GAS_API_URL, {
      method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'text/plain' },
    });
    return res.json();
  };

  const fetchApps = async () => {
    try { const r = await post({ action: 'getApps' }); if (r.status === 'success') setAppsList(r.data || []); }
    catch { /* offline */ }
  };
  const fetchUsers = async () => {
    try { const r = await post({ action: 'getUsers' }); if (r.status === 'success') setUsersList(r.data || []); }
    catch { /* offline */ }
  };
  const fetchBoardPosts = async () => {
    try {
      const r = await post({ action: 'getBoardPosts' });
      if (r.status === 'success' && Array.isArray(r.data)) setBoardPosts(r.data);
    } catch { /* respaldo local */ }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaVerified) { setError('Resuelve la verificación de seguridad para continuar.'); return; }
    setLoading(true); setError('');
    try {
      const r = await post({ action: 'login', usuario, password });
      if (r.status === 'success') { setIsLoggedIn(true); setUserData(r); fetchApps(); fetchUsers(); fetchBoardPosts(); }
      else setError(r.message || 'Credenciales no válidas.');
    } catch { setError('Servidor no disponible en este momento.'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); setUserData(null); setOpenApps([]); setActiveAppId(null);
    setShowUserMenu(false); setShowAppearancePanel(false); setShowWidgetGallery(false); setShowProfileEditor(false);
    setShowBoardManager(false); setPublicationTypeOpen(false); setBoardCarouselPaused(false);
    setCurrentView('dashboard'); setPassword(''); setCaptchaVerified(false); setPomodoroRunning(false);
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
    setTasks(list => [...list, {
      id: Date.now(), text: calendarTaskText.trim(), done: false,
      color: calendarTaskColor, dueDate: selectedDate,
    }]);
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
      createdAt: Date.now(),
      author: userData?.usuario || 'Administración',
    };
    setBoardPosts(posts => [postItem, ...posts]);
    setNewBoardPost({ type: 'comunicado', title: '', body: '', imageUrl: '' });
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

  /* ---------------- CRUD ---------------- */
  const handleAddApp = async (e) => {
    e.preventDefault(); setIsAddingApp(true);
    try {
      const r = await post({ action: 'addApp', appData: newApp });
      if (r.status === 'success') { await fetchApps(); setNewApp({ nombre: '', url: '', desc: '', icono: '' }); setCurrentView('dashboard'); }
    } catch { /* noop */ } finally { setIsAddingApp(false); }
  };
  const handleDeleteApp = async (id) => {
    if (!window.confirm('¿Eliminar este aplicativo del catálogo?')) return;
    try { const r = await post({ action: 'deleteApp', id }); if (r.status === 'success') await fetchApps(); } catch { /* noop */ }
  };
  const handleUpdateApp = async (e, id) => {
    e.preventDefault();
    try {
      const appToUpdate = appsList.find(a => a.id === id);
      const r = await post({ action: 'updateApp', appData: appToUpdate });
      if (r.status === 'success') { setEditingAppId(null); await fetchApps(); }
    } catch { /* noop */ }
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
    const existing = openApps.find(a => a.id === app.id);
    if (existing) { setMinimizedApps(p => ({ ...p, [app.id]: false })); prioritizeWindow(app.id); return; }
    const toOpen = { ...app, isAuthorized: true, sys: false, defaultWidth: 1040, defaultHeight: 660 };
    setOpenApps(prev => [...prev, toOpen]);
    prioritizeWindow(toOpen.id);
    setLoadingApps(p => ({ ...p, [toOpen.id]: true }));
  };

  const launchSystemApp = (type) => {
    closeOverlays();
    const existing = openApps.find(a => a.sys === type);
    if (existing) { setMinimizedApps(p => ({ ...p, [existing.id]: false })); prioritizeWindow(existing.id); return; }
    const def = SYSTEM_APPS.find(s => s.sys === type);
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
    const dockEl = document.getElementById(`dock-${appId}`);
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
  const dashboardTasks = tasks.filter(task => !task.dueDate || task.dueDate <= todayKey);
  const pendingTasks = dashboardTasks.filter(t => !t.done).length;
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

  const launchpadEntries = useMemo(() => {
    const sys = SYSTEM_APPS.map(s => ({
      id: `lp-${s.sys}`, nombre: s.nombre, grad: s.grad, sysIcon: s.icon, sysType: s.sys, desc: 'Utilidad del sistema',
    }));
    return [...appsList.map(a => ({ ...a })), ...sys];
  }, [appsList]);

  const lpFiltered = useMemo(() => {
    const q = lpQuery.trim().toLowerCase();
    if (!q) return launchpadEntries;
    return launchpadEntries.filter(a => (a.nombre || '').toLowerCase().includes(q));
  }, [launchpadEntries, lpQuery]);

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
        <div><strong>{appsList.length + SYSTEM_APPS.length}</strong><span>Herramientas</span></div>
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
  const renderDashboard = () => (
    <div className="bento enter">

      {/* ---- Hero ---- */}
      <section className="card b6 flat">
        <h1 className="hero-greet">{greeting}, <span>{welcomeName}</span></h1>
        <p className="hero-sub">
          {profilePreferences.welcomeMessage.trim() || `Tienes ${appsList.length} aplicativo${appsList.length === 1 ? '' : 's'} disponible${appsList.length === 1 ? '' : 's'}${pendingTasks > 0 ? ` y ${pendingTasks} tarea${pendingTasks === 1 ? '' : 's'} pendiente${pendingTasks === 1 ? '' : 's'}` : ' y ninguna tarea pendiente'}.`}
        </p>
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

      {/* ---- Tablón corporativo: segunda fila del escritorio ---- */}
      <section className="card b12 corporate-board flat">
        <div className="card-head">
          <div className="board-title-group">
            <div className="card-label"><IcoBell s={13} /> Tablón corporativo</div>
            <p className="board-subtitle">Novedades, banners e incidencias internas en un solo lugar.</p>
          </div>
          {isAdmin && <button className="btn btn-primary board-manage" onClick={() => setShowBoardManager(true)}><IcoPlus s={14} /> Administrar</button>}
        </div>
        <div className="board-carousel" onMouseEnter={() => setBoardCarouselPaused(true)} onMouseLeave={() => setBoardCarouselPaused(false)} onFocusCapture={() => setBoardCarouselPaused(true)} onBlurCapture={() => setBoardCarouselPaused(false)}>
          <div className="board-feed" aria-live="polite">
            {!activeBoardPost
              ? <p className="empty-note">No hay publicaciones activas.</p>
              : activeBoardPost.type === 'banner' ? (
                <article key={activeBoardPost.id} className="board-post banner board-slide-enter" aria-label="Banner corporativo">
                  {activeBoardPost.imageUrl
                    ? <img className="board-banner-image" src={getValidImageUrl(activeBoardPost.imageUrl)} alt="Banner corporativo" />
                    : <div className="board-banner-empty">Banner sin imagen</div>}
                </article>
              ) : (
                <article key={activeBoardPost.id} className={`board-post ${activeBoardPost.type} board-slide-enter`}>
                  {activeBoardPost.imageUrl && <div className="board-post-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(14,17,37,.80), rgba(14,17,37,.18)), url(${getValidImageUrl(activeBoardPost.imageUrl)})` }} />}
                  <div className="board-post-content">
                    <span className="board-type">{activeBoardPost.type}</span>
                    <h3>{activeBoardPost.title}</h3>
                    <p>{activeBoardPost.body}</p>
                    <small>{activeBoardPost.author} · {new Date(activeBoardPost.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}</small>
                  </div>
                </article>
              )}
          </div>
          {boardPosts.length > 1 && (
            <div className="board-carousel-controls">
              <button className="board-arrow previous" onClick={() => changeBoardSlide(-1)} aria-label="Publicación anterior"><IcoChevron s={14} /></button>
              <div className="board-dots" role="tablist" aria-label="Publicaciones del tablón">
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
      <section className="card b8 r2">
        <div className="card-head">
          <div className="card-label"><IcoGrid s={13} /> Aplicaciones</div>
          <button className="ghost-btn" onClick={openLaunchpad}>Abrir Launchpad</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', margin: '0 -8px', padding: '2px 8px 4px' }}>
          <div className="lp-grid">
            {appsList.length === 0 && (
              <p className="empty-note">Sincronizando el portafolio de sistemas…</p>
            )}
            {appsList.map(app => (
              <button key={app.id} className="lp-item" onClick={() => launchApp(app)} title={app.desc || app.nombre}>
                <AppIcon app={app} size={58} />
                <span className="lp-name">{app.nombre}</span>
              </button>
            ))}
            {SYSTEM_APPS.map(s => (
              <button key={s.sys} className="lp-item" onClick={() => launchSystemApp(s.sys)}>
                <AppIcon app={{ nombre: s.nombre, grad: s.grad, sysIcon: s.icon }} size={58} />
                <span className="lp-name">{s.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Tareas ---- */}
      <section className="card b4 flat">
        <div className="card-head">
          <div className="card-label"><IcoCheck s={12} /> Pendientes</div>
          {tasks.some(t => t.done) && <button className="ghost-btn" onClick={clearDone}>Limpiar</button>}
        </div>
        <div className="task-list">
          {dashboardTasks.length === 0
            ? <p className="empty-note" style={{ padding: '28px 0' }}>{scheduledTasks > 0 ? 'No hay pendientes para hoy.' : 'Todo en orden. No hay pendientes.'}</p>
            : dashboardTasks.map(t => (
              <div key={t.id} className={`task-row color-${t.color || 'navy'} ${t.done ? 'done' : ''}`}>
                <button className="task-color" onClick={() => cycleTaskColor(t.id)} title="Cambiar clasificación" aria-label="Cambiar color de la tarea" />
                <button className="task-box" onClick={() => toggleTask(t.id)}>{t.done && <IcoCheck s={11} />}</button>
                <span className="task-text">{t.text}{t.dueDate && <small>{t.dueDate < todayKey ? 'Vencida' : 'Hoy'}</small>}</span>
                <button className="task-del" onClick={() => deleteTask(t.id)}><IcoX s={11} /></button>
              </div>
            ))}
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
      <section className="card b4 flat">
        <div className="card-label"><IcoHistory s={13} /> Recientes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'auto' }}>
          {recents.length === 0
            ? <p className="empty-note" style={{ padding: '18px 0', textAlign: 'left' }}>Aún no has abierto aplicativos.</p>
            : recents.slice(0, 4).map(r => {
              const full = appsList.find(a => a.id === r.id) || r;
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
    return (
      <div className="launchpad" onClick={closeLaunchpad}>
        <div className="lp-search" onClick={e => e.stopPropagation()}>
          <IcoSearch s={16} />
          <input ref={lpInputRef} value={lpQuery} onChange={e => setLpQuery(e.target.value)} placeholder="Buscar" />
        </div>
        <div className="lp-canvas" onClick={e => e.stopPropagation()}>
          {lpFiltered.length === 0 && <p className="empty-note">Sin resultados para “{lpQuery}”.</p>}
          {lpFiltered.map((entry, i) => (
            <button key={entry.id} className="lp-item" style={{ animationDelay: `${Math.min(i * 22, 400)}ms` }}
              onClick={() => openEntry(entry)}>
              <AppIcon app={entry} size={76} />
              <span className="lp-name">{entry.nombre}</span>
            </button>
          ))}
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
    const appRes = q ? appsList.filter(a => (a.nombre || '').toLowerCase().includes(q) || (a.desc || '').toLowerCase().includes(q)) : [];
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
                  {a.desc && <span className="spot-row-sub">{String(a.desc).slice(0, 68)}</span>}
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
                      {dayTasks.length > 0 && <i style={{ '--day-color': TASK_COLORS.find(color => color.id === dayTasks[0].color)?.hex || '#25294F' }} />}
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
              <h2>Tablón corporativo</h2>
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
              <button className="btn btn-primary" type="submit"><IcoPlus s={14} /> Publicar</button>
            </form>
            <div className="board-admin-list">
              <h3>Publicaciones activas</h3>
              {boardPosts.map(post => (
                <article key={post.id}>
                  <span className={`board-type ${post.type}`}>{post.type}</span>
                  <strong>{post.type === 'banner' ? 'Banner gráfico' : post.title}</strong>
                  <p>{post.type === 'banner' ? 'La imagen se presenta completa en el escritorio.' : post.body}</p>
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

  /* ======================================================================
     VISTAS ADMIN
     ====================================================================== */
  const renderCatalog = () => (
    <div className="panel enter">
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Catálogo de aplicativos</h2>
          <p className="panel-sub">{appsList.length} sistemas registrados en el Hub</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCurrentView('addApp')}><IcoPlus s={15} /> Nuevo</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead><tr><th>App</th><th>Endpoint</th><th style={{ width: 120 }}>Acciones</th></tr></thead>
          <tbody>
            {appsList.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--ink-3)', padding: 40 }}>Sin aplicativos registrados.</td></tr>
            ) : appsList.map(app => (
              <tr key={app.id}>
                {editingAppId === app.id ? (
                  <>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input className="field" value={app.nombre} onChange={e => handleEditChange(app.id, 'nombre', e.target.value)} placeholder="Nombre" />
                        <input className="field" value={app.icono || ''} onChange={e => handleEditChange(app.id, 'icono', e.target.value)} placeholder="URL ícono" />
                      </div>
                    </td>
                    <td><input className="field mono" value={app.url} onChange={e => handleEditChange(app.id, 'url', e.target.value)} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-primary" style={{ padding: '7px 14px' }} onClick={e => handleUpdateApp(e, app.id)}>Guardar</button>
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
                    <td className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{String(app.url || '').slice(0, 46)}…</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
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

  const renderAddApp = () => (
    <div className="panel enter" style={{ maxWidth: 620, margin: '0 auto' }}>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Desplegar aplicativo</h2>
          <p className="panel-sub">Se publicará en el Launchpad de todos los usuarios autorizados</p>
        </div>
      </div>
      <form onSubmit={handleAddApp} style={{ padding: 30, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label className="form-label">Nombre oficial</label>
          <input className="field" required value={newApp.nombre} onChange={e => setNewApp({ ...newApp, nombre: e.target.value })} />
        </div>
        <div>
          <label className="form-label">URL del endpoint</label>
          <input className="field mono" type="url" required value={newApp.url} onChange={e => setNewApp({ ...newApp, url: e.target.value })} />
        </div>
        <div>
          <label className="form-label">URL del ícono (opcional)</label>
          <input className="field mono" type="url" value={newApp.icono} onChange={e => setNewApp({ ...newApp, icono: e.target.value })} />
        </div>
        <div>
          <label className="form-label">Descripción</label>
          <textarea className="field" required value={newApp.desc} onChange={e => setNewApp({ ...newApp, desc: e.target.value })} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: 13 }} onClick={() => setCurrentView('dashboard')}>Cancelar</button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: 13 }} disabled={isAddingApp}>
            {isAddingApp ? 'Desplegando…' : 'Guardar y desplegar'}
          </button>
        </div>
      </form>
    </div>
  );

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
    { id: 'catalog', label: 'Catálogo', admin: true },
    { id: 'addApp', label: 'Desplegar', admin: true },
    { id: 'users', label: 'Identidades', admin: true },
  ];
  const activeAccent = ACCENT_COLORS.find(color => color.id === workspaceAppearance.accent) || ACCENT_COLORS[0];

  const renderWindowBody = (app) => {
    if (app.sys === 'notes') return <textarea className="notes-pad" placeholder="Escribe algo…" />;
    if (app.sys === 'calculator') return <NativeCalculator isActive={activeAppId === app.id && !minimizedApps[app.id]} />;
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
      style={{ '--brand-green': activeAccent.hex }}>
      {renderSpotlight()}
      {renderLaunchpad()}
      {renderCalendarModal()}
      {renderBoardManager()}
      {renderAppearancePanel()}
      {renderWidgetGallery()}
      {renderProfileEditor()}

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
            {currentView === 'catalog' && renderCatalog()}
            {currentView === 'addApp' && renderAddApp()}
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
            <div key={app.id} className={`focus-app-layer ${app.sys === 'calculator' ? 'compact-calculator' : ''}`} style={{
              opacity: activeAppId === app.id ? 1 : 0,
              pointerEvents: activeAppId === app.id ? 'auto' : 'none',
            }}>
              {app.sys === 'calculator' ? (
                <div className="focus-compact-window">
                  <div className="titlebar no-drag">
                    <div className="traffic"><button className="tl close" onClick={e => closeApp(e, app.id)} title="Cerrar"><IcoX s={8} /></button></div>
                    <span className="title-text">Calculadora</span>
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

          {SYSTEM_APPS.map(s => {
            const win = openApps.find(a => a.sys === s.sys);
            return (
              <button key={s.sys} id={win ? `dock-${win.id}` : `dock-sys-${s.sys}`}
                className={`dock-item ${win ? 'running' : ''} ${win && activeAppId === win.id ? 'active-win' : ''}`}
                data-label={s.nombre}
                onClick={() => win ? handleDockClick(win.id) : launchSystemApp(s.sys)}>
                <AppIcon app={{ nombre: s.nombre, grad: s.grad, sysIcon: s.icon }} size={46} />
                <span className="dock-dot" />
                {win && <span className="dock-close" onClick={e => closeApp(e, win.id)}><IcoX s={9} /></span>}
              </button>
            );
          })}

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
