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
const IcoPulse = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M3 12h4l2.5-7 4 14 2.5-7H21" /></svg>;
const IcoHistory = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 8v4.5l3.2 1.9" /></svg>;
const IcoChevron = ({ s = 14 }) => <svg width={s} height={s} {...S} strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>;
const IcoShield = ({ s = 16 }) => <svg width={s} height={s} {...S}><path d="M12 2.5 4.5 6v6c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" /><path d="M9.2 12.2l2 2 3.6-3.8" /></svg>;

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

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxYszzacLW5AbwolurkZFX2_lq_m2qk3JDWokDpo_DitmquPojP-KGmllamG0xayGlabA/exec';

const SYSTEM_APPS = [
  { sys: 'notes', nombre: 'Notas', grad: 'linear-gradient(150deg,#E8C766,#C9A23B)', icon: IcoNotes, w: 720, h: 520 },
  { sys: 'calculator', nombre: 'Calculadora', grad: 'linear-gradient(150deg,#7C7C86,#4A4A52)', icon: IcoCalc, w: 340, h: 500 },
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
const NativeCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);

  const compute = (a, b, o) => {
    if (o === '+') return a + b;
    if (o === '−') return a - b;
    if (o === '×') return a * b;
    if (o === '÷') return b === 0 ? NaN : a / b;
    return b;
  };

  const press = (k) => {
    if (k === 'AC') { setDisplay('0'); setPrev(null); setOp(null); return; }
    if (k === '±') { setDisplay(d => (d.startsWith('-') ? d.slice(1) : d === '0' ? d : '-' + d)); return; }
    if (k === '%') { setDisplay(d => String(parseFloat(d) / 100)); return; }
    if (['+', '−', '×', '÷'].includes(k)) { setPrev(display); setOp(k); setDisplay('0'); return; }
    if (k === '=') {
      if (op === null || prev === null) return;
      const res = compute(parseFloat(prev), parseFloat(display), op);
      setDisplay(Number.isFinite(res) ? String(parseFloat(res.toFixed(8))) : 'Error');
      setPrev(null); setOp(null); return;
    }
    if (k === ',') { setDisplay(d => (d.includes('.') ? d : d + '.')); return; }
    setDisplay(d => (d === '0' ? k : (d.length > 11 ? d : d + k)));
  };

  const keys = [
    ['AC', 'fn'], ['±', 'fn'], ['%', 'fn'], ['÷', 'op'],
    ['7', ''], ['8', ''], ['9', ''], ['×', 'op'],
    ['4', ''], ['5', ''], ['6', ''], ['−', 'op'],
    ['1', ''], ['2', ''], ['3', ''], ['+', 'op'],
    ['0', '', { gridColumn: 'span 2' }], [',', ''], ['=', 'op'],
  ];

  return (
    <div className="calc-shell">
      <div className="calc-screen">{display}</div>
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
  const [maximizedApps, setMaximizedApps] = useState({});
  const [minimizeOrigins, setMinimizeOrigins] = useState({});
  const [loadingApps, setLoadingApps] = useState({});

  /* --- Datos --- */
  const [appsList, setAppsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [recents, setRecents] = useState([]);

  /* --- CRUD --- */
  const [newApp, setNewApp] = useState({ nombre: '', url: '', desc: '', icono: '' });
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [editingAppId, setEditingAppId] = useState(null);

  /* ---------------- Efectos ---------------- */
  useEffect(() => { document.body.setAttribute('data-theme', theme); }, [theme]);

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
      if (t) setTasks(JSON.parse(t));
      const r = localStorage.getItem(`agora_recent_${userData.usuario}`);
      if (r) setRecents(JSON.parse(r));
    } catch { /* ignorar almacenamiento corrupto */ }
  }, [isLoggedIn, userData]);

  useEffect(() => {
    if (isLoggedIn && userData) localStorage.setItem(`agora_tasks_${userData.usuario}`, JSON.stringify(tasks));
  }, [tasks, isLoggedIn, userData]);

  useEffect(() => {
    if (isLoggedIn && userData) localStorage.setItem(`agora_recent_${userData.usuario}`, JSON.stringify(recents));
  }, [recents, isLoggedIn, userData]);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaVerified) { setError('Resuelve la verificación de seguridad para continuar.'); return; }
    setLoading(true); setError('');
    try {
      const r = await post({ action: 'login', usuario, password });
      if (r.status === 'success') { setIsLoggedIn(true); setUserData(r); fetchApps(); fetchUsers(); }
      else setError(r.message || 'Credenciales no válidas.');
    } catch { setError('Servidor no disponible en este momento.'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); setUserData(null); setOpenApps([]); setActiveAppId(null);
    setShowUserMenu(false); setCurrentView('dashboard'); setPassword(''); setCaptchaVerified(false);
  };

  /* ---------------- Tareas ---------------- */
  const addTask = (e) => {
    if (e.key === 'Enter' && newTask.trim()) {
      setTasks(t => [...t, { id: Date.now(), text: newTask.trim(), done: false }]);
      setNewTask('');
    }
  };
  const toggleTask = (id) => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const deleteTask = (id) => setTasks(t => t.filter(x => x.id !== id));
  const clearDone = () => setTasks(t => t.filter(x => !x.done));

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

  const launchApp = (app) => {
    closeOverlays();
    pushRecent(app);
    const existing = openApps.find(a => a.id === app.id);
    if (existing) { setMinimizedApps(p => ({ ...p, [app.id]: false })); setActiveAppId(app.id); return; }
    const toOpen = { ...app, isAuthorized: true, sys: false, defaultWidth: 1040, defaultHeight: 660 };
    setOpenApps(prev => [...prev, toOpen]);
    setActiveAppId(toOpen.id);
    setLoadingApps(p => ({ ...p, [toOpen.id]: true }));
  };

  const launchSystemApp = (type) => {
    closeOverlays();
    const existing = openApps.find(a => a.sys === type);
    if (existing) { setMinimizedApps(p => ({ ...p, [existing.id]: false })); setActiveAppId(existing.id); return; }
    const def = SYSTEM_APPS.find(s => s.sys === type);
    const win = {
      id: `sys-${type}-${Date.now()}`, nombre: def.nombre, sys: type, isAuthorized: true,
      icono: '', grad: def.grad, sysIcon: def.icon, defaultWidth: def.w, defaultHeight: def.h,
    };
    setOpenApps(prev => [...prev, win]);
    setActiveAppId(win.id);
  };

  const closeApp = (e, appId) => {
    if (e) e.stopPropagation();
    const rest = openApps.filter(a => a.id !== appId);
    setOpenApps(rest);
    if (activeAppId === appId) setActiveAppId(rest.length ? rest[rest.length - 1].id : null);
  };

  const toggleMinimize = (e, appId) => {
    e.stopPropagation();
    const winEl = document.getElementById(`window-${appId}`);
    const dockEl = document.getElementById(`dock-${appId}`);
    if (winEl && dockEl) {
      const w = winEl.getBoundingClientRect();
      const d = dockEl.getBoundingClientRect();
      setMinimizeOrigins(p => ({
        ...p,
        [appId]: `${d.left + d.width / 2 - w.left}px ${d.top + d.height / 2 - w.top}px`,
      }));
    }
    setMinimizedApps(p => ({ ...p, [appId]: true }));
  };

  const toggleMaximize = (e, appId) => { e.stopPropagation(); setMaximizedApps(p => ({ ...p, [appId]: !p[appId] })); };

  const handleDockClick = (appId) => {
    if (minimizedApps[appId]) { setMinimizedApps(p => ({ ...p, [appId]: false })); setActiveAppId(appId); return; }
    if (activeAppId === appId && workspaceMode === 'desktop') { toggleMinimize({ stopPropagation() {} }, appId); return; }
    setActiveAppId(appId);
  };

  const goDesktop = () => { setActiveAppId(null); setCurrentView('dashboard'); };

  /* ---------------- Derivados ---------------- */
  const isAdmin = userData?.rolGlobal === 'Administrador';
  const pendingTasks = tasks.filter(t => !t.done).length;

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

  /* ======================================================================
     LOGIN
     ====================================================================== */
  if (!isLoggedIn) {
    return (
      <div className="login-root">
        <div className="login-card">
          <div className="login-aside">
            <div className="login-brand">
              <img src="/logo_compañias.png" alt="Multival" className="login-logo" />
            </div>
            <div className="login-copy">
              <h1 className="login-title">Ágora OS</h1>
              <p className="login-text">
                Hub central de innovación. Un único acceso para todo el ecosistema
                de aplicativos corporativos.
              </p>
            </div>
            <div className="login-chips">
              <span className="login-chip">One-Login SSO</span>
              <span className="login-chip">Gobierno de accesos</span>
              <span className="login-chip">Multival · Reval · Multipagas</span>
            </div>
          </div>

          <div className="login-form-side">
            <div className="login-form">
              <span className="login-kicker">Acceso autorizado</span>
              <h2 className="login-heading">Inicia sesión</h2>

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
                  {loading ? 'Validando…' : 'Entrar'}
                </button>
              </form>
              <p className="login-foot">Gestión Administrativa, Transformación y Desarrollo de Personas</p>
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
        <h1 className="hero-greet">{greeting}, <span>{userData.usuario}</span></h1>
        <p className="hero-sub">
          Tienes {appsList.length} aplicativo{appsList.length === 1 ? '' : 's'} disponible{appsList.length === 1 ? '' : 's'}
          {pendingTasks > 0 ? ` y ${pendingTasks} tarea${pendingTasks === 1 ? '' : 's'} pendiente${pendingTasks === 1 ? '' : 's'}` : ' y ninguna tarea pendiente'}.
        </p>
        <button className="search-trigger" onClick={openSpotlight}>
          <IcoSearch s={15} /> Buscar en Ágora <span className="kbd">⌘K</span>
        </button>
      </section>

      {/* ---- Reloj ---- */}
      <section className="card b3">
        <div className="card-label"><IcoClock s={13} /> Hora local</div>
        <div className="clock-time">
          {currentTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })}
          <span className="clock-suffix">{currentTime.toLocaleTimeString('es-CO', { second: '2-digit' }).padStart(2, '0')}</span>
        </div>
        <p className="clock-place">Bogotá, Colombia</p>
        <p className="clock-meta">GMT−5 · Semana {Math.ceil(((currentTime - new Date(currentTime.getFullYear(), 0, 1)) / 86400000 + 1) / 7)}</p>
      </section>

      {/* ---- Calendario monocromático ---- */}
      <section className="card b3">
        <div className="card-label" style={{ marginBottom: 12 }}><IcoCal s={13} /> Calendario</div>
        <span className="cal-month">{currentTime.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
          <span className="cal-day">{currentTime.getDate()}</span>
          <span className="cal-weekday">{currentTime.toLocaleDateString('es-ES', { weekday: 'long' })}</span>
        </div>
        <div className="cal-week">
          {weekDays.map(d => {
            const isToday = d.toDateString() === currentTime.toDateString();
            return (
              <div key={d.toISOString()} className={`cal-cell ${isToday ? 'today' : ''}`}>
                <span className="cal-cell-dow">{d.toLocaleDateString('es-ES', { weekday: 'narrow' })}</span>
                <span className="cal-cell-num">{d.getDate()}</span>
              </div>
            );
          })}
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
      <section className="card b4 r2 flat">
        <div className="card-head">
          <div className="card-label"><IcoCheck s={12} /> Pendientes</div>
          {tasks.some(t => t.done) && <button className="ghost-btn" onClick={clearDone}>Limpiar</button>}
        </div>
        <div className="task-list">
          {tasks.length === 0
            ? <p className="empty-note" style={{ padding: '28px 0' }}>Todo en orden. No hay pendientes.</p>
            : tasks.map(t => (
              <div key={t.id} className={`task-row ${t.done ? 'done' : ''}`}>
                <button className="task-box" onClick={() => toggleTask(t.id)}>{t.done && <IcoCheck s={11} />}</button>
                <span className="task-text">{t.text}</span>
                <button className="task-del" onClick={() => deleteTask(t.id)}><IcoX s={11} /></button>
              </div>
            ))}
        </div>
        <input className="field" placeholder="Nueva tarea…" value={newTask}
          onChange={e => setNewTask(e.target.value)} onKeyDown={addTask} />
      </section>

      {/* ---- Tablón corporativo ---- */}
      <section className="card b6">
        <div className="card-label"><IcoBell s={13} /> Tablón corporativo</div>
        <span className="pill">Nuevo</span>
        <h3 className="note-title">Actualización de políticas de teletrabajo</h3>
        <p className="note-body">
          Los nuevos lineamientos ya están publicados en el portal de Gestión de Personas.
          La lectura y aceptación es requisito antes del cierre de mes.
        </p>
        <p className="note-meta">Publicado por Gestión Administrativa · Multival</p>
      </section>

      {/* ---- Estado del ecosistema ---- */}
      <section className="card b3 flat">
        <div className="card-label"><IcoPulse s={13} /> Ecosistema</div>
        <div className="metric-list">
          <div className="metric-row"><span className="metric-key">Aplicativos</span><span className="metric-val">{appsList.length}</span></div>
          <div className="metric-row"><span className="metric-key">Identidades</span><span className="metric-val">{usersList.length || '—'}</span></div>
          <div className="metric-row"><span className="metric-key">Ventanas activas</span><span className="metric-val">{openApps.length}</span></div>
          <div className="metric-row"><span className="metric-key">Pendientes</span><span className="metric-val">{pendingTasks}</span></div>
        </div>
      </section>

      {/* ---- Recientes ---- */}
      <section className="card b3 flat">
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
            {!q && <p className="empty-note" style={{ padding: '34px 0' }}>Escribe para buscar en todo el ecosistema.</p>}

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

  const renderWindowBody = (app) => {
    if (app.sys === 'notes') return <textarea className="notes-pad" placeholder="Escribe algo…" />;
    if (app.sys === 'calculator') return <NativeCalculator />;
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
        src={`${app.url}?usuario=${userData.usuario}`}
        title={app.nombre}
        onLoad={() => setLoadingApps(p => ({ ...p, [app.id]: false }))}
        style={{ opacity: loadingApps[app.id] ? 0 : 1, transition: 'opacity 0.35s ease' }}
      />
    );
  };

  return (
    <div className="os-root">
      {renderSpotlight()}
      {renderLaunchpad()}

      {/* ================= MENU BAR ================= */}
      <header className="menubar">
        <div className="menubar-left">
          <div className="menu-logo">
            <div className="menu-logo-mark">Á</div>
            <span className="menu-logo-text">Ágora</span>
          </div>
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
          <button className="menu-icon-btn" title="Apariencia" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <IcoMoon s={16} /> : <IcoSun s={16} />}
          </button>
          <span className="menu-clock">
            {currentTime.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}{'  '}
            {currentTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button className="menu-user" onClick={() => setShowUserMenu(v => !v)}>
            <span className="menu-avatar">{initialsOf(userData.usuario)}</span>
            <span className="menu-user-name">{userData.usuario}</span>
          </button>
        </div>
      </header>

      {showUserMenu && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 550 }} onClick={() => setShowUserMenu(false)} />
          <div className="popover">
            <div className="popover-head">
              <div style={{ fontSize: 14, fontWeight: 600 }}>{userData.usuario}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{userData.rolGlobal}</div>
            </div>
            <button className="popover-item" onClick={() => { setTheme(t => t === 'light' ? 'dark' : 'light'); }}>
              {theme === 'light' ? <IcoMoon s={15} /> : <IcoSun s={15} />} Cambiar apariencia
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
        <div className="workspace-scroll" style={{
          opacity: activeAppId === null || workspaceMode === 'desktop' ? 1 : 0,
          pointerEvents: activeAppId === null ? 'auto' : 'none',
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
              minWidth={330} minHeight={280} bounds="parent"
              dragHandleClassName={maximizedApps[app.id] ? 'no-drag' : 'titlebar'}
              enableResizing={!maximizedApps[app.id]}
              style={{ zIndex: activeAppId === app.id ? 60 : 20, display: activeAppId === null ? 'none' : 'block' }}
              onMouseDownCapture={() => { if (!minimizedApps[app.id]) setActiveAppId(app.id); }}
            >
              <div
                className={`win ${minimizedApps[app.id] ? 'minimized' : ''} ${maximizedApps[app.id] ? 'maxed' : ''}`}
                style={{
                  transformOrigin: minimizeOrigins[app.id] || 'center bottom',
                  ...(maximizedApps[app.id] && {
                    position: 'fixed', top: 'var(--menubar-h)', left: 0,
                    width: '100vw', height: 'calc(100vh - var(--menubar-h))', zIndex: 90, transform: 'none',
                  }),
                }}
              >
                <div className={`titlebar ${maximizedApps[app.id] ? 'no-drag' : 'grab'}`}>
                  <div className="traffic">
                    <button className="tl close" onClick={e => closeApp(e, app.id)} title="Cerrar"><IcoX s={8} /></button>
                    <button className="tl min" onClick={e => toggleMinimize(e, app.id)} title="Minimizar"><IcoMinus s={8} /></button>
                    <button className="tl max" onClick={e => toggleMaximize(e, app.id)} title="Pantalla completa"><IcoExpand s={7} /></button>
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
            <div key={app.id} style={{
              position: 'absolute', inset: 0,
              opacity: activeAppId === app.id ? 1 : 0,
              pointerEvents: activeAppId === app.id ? 'auto' : 'none',
              transition: 'opacity 0.3s ease', background: 'var(--wall-a)',
            }}>
              {loadingApps[app.id] && !app.sys && <div className="loader-veil"><div className="spinner" /></div>}
              <div style={{ width: '100%', height: '100%' }}>{renderWindowBody(app)}</div>
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