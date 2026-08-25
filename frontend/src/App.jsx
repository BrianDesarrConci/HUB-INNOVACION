import { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Rnd } from "react-rnd";

// ==========================================
// ÍCONOS DEL SISTEMA
// ==========================================
const IcoUser = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoLock = ({ size = 18 }) => <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoDashboard = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>;
const IcoUsers = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoAdd = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoApp = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
const IcoLogout = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoChevronUp = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>;
const IcoChevronDown = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>;
const IcoX = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoCatalog = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7"/></svg>;
const IcoEdit = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoTrash = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IcoSun = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IcoMoon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IcoDesktop = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
const IcoFocus = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>;
const IcoNotes = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IcoCalculator = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"/></svg>;
const IcoTodo = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>;
const IcoFolder = () => <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;

const getValidImageUrl = (url) => {
  if (!url) return '';
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return driveMatch ? `https://drive.google.com/uc?export=view&id=${driveMatch[1]}` : url;
};

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxYszzacLW5AbwolurkZFX2_lq_m2qk3JDWokDpo_DitmquPojP-KGmllamG0xayGlabA/exec';

// ==========================================
// APLICACIÓN: CALCULADORA NATIVA ESTILO MAC
// ==========================================
const NativeCalculator = () => {
  const [calc, setCalc] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);

  const handleInput = (val) => {
    if (val === 'AC') { setCalc('0'); setPrev(null); setOp(null); return; }
    if (['+','-','x','/'].includes(val)) { setPrev(calc); setOp(val); setCalc('0'); return; }
    if (val === '=') {
      if (!op || !prev) return;
      const num1 = parseFloat(prev); const num2 = parseFloat(calc);
      let res = 0;
      if (op === '+') res = num1 + num2;
      if (op === '-') res = num1 - num2;
      if (op === 'x') res = num1 * num2;
      if (op === '/') res = num1 / num2;
      setCalc(String(res).slice(0, 10)); setPrev(null); setOp(null);
      return;
    }
    setCalc(calc === '0' ? val : calc + val);
  };

  const btnLayout = [
    ['AC', 'action'], ['+/-', 'action'], ['%', 'action'], ['/', 'op'],
    ['7', ''], ['8', ''], ['9', ''], ['x', 'op'],
    ['4', ''], ['5', ''], ['6', ''], ['-', 'op'],
    ['1', ''], ['2', ''], ['3', ''], ['+', 'op'],
    ['0', '', { gridColumn: 'span 2' }], ['.', ''], ['=', 'op']
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-bg)', padding: '24px' }}>
      <div style={{ background: 'var(--surface-card)', padding: '20px', fontSize: '48px', fontWeight: '300', textAlign: 'right', borderRadius: '16px', marginBottom: '24px', flexShrink: 0 }}>
        {calc}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', flex: 1 }}>
        {btnLayout.map((b, i) => (
          <button key={i} className={`agora-calc-btn ${b[1]}`} style={b[2] || {}} onClick={() => handleInput(b[0])}>
            {b[0]}
          </button>
        ))}
      </div>
    </div>
  );
};


export default function App() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  const [theme, setTheme] = useState('light');
  const [workspaceMode, setWorkspaceMode] = useState('focus'); 
  const [currentView, setCurrentView] = useState('dashboard');
  
  // OS States (Ventanas, Minimizar, Maximizar)
  const [openApps, setOpenApps] = useState([]);
  const [activeAppId, setActiveAppId] = useState(null);
  const [minimizedApps, setMinimizedApps] = useState({});
  const [maximizedApps, setMaximizedApps] = useState({});
  const [isNavVisible, setIsNavVisible] = useState(true); 
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  
  const [appsList, setAppsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loadingApps, setLoadingApps] = useState({});
  
  const [newApp, setNewApp] = useState({ nombre: '', url: '', desc: '', icono: '' });
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [editingAppId, setEditingAppId] = useState(null);

  useEffect(() => { document.body.setAttribute('data-theme', theme); }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleWorkspace = () => setWorkspaceMode(prev => prev === 'focus' ? 'desktop' : 'focus');

  const fetchApps = async () => {
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'getApps' }), headers: { 'Content-Type': 'text/plain' } });
      const result = await response.json();
      if(result.status === 'success') setAppsList(result.data);
    } catch (err) {}
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'getUsers' }), headers: { 'Content-Type': 'text/plain' } });
      const result = await response.json();
      if(result.status === 'success') setUsersList(result.data);
    } catch (err) {}
  };

  useEffect(() => { 
    if(isLoggedIn) { fetchApps(); fetchUsers(); }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaVerified) { setError('Por favor, resuelve el reCAPTCHA de seguridad.'); return; }
    setLoading(true); setError('');
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'login', usuario, password }), headers: { 'Content-Type': 'text/plain' } });
      const result = await response.json();
      if (result.status === 'success') { setIsLoggedIn(true); setUserData(result); } 
      else { setError(result.message); }
    } catch (err) { setError('Servidor no disponible en este momento.'); } 
    finally { setLoading(false); }
  };

  // --- CRUD Funciones ---
  const handleAddApp = async (e) => {
    e.preventDefault(); setIsAddingApp(true);
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'addApp', appData: newApp }), headers: { 'Content-Type': 'text/plain' } });
      const result = await response.json();
      if (result.status === 'success') { await fetchApps(); setNewApp({ nombre: '', url: '', desc: '', icono: '' }); setCurrentView('dashboard'); } 
    } finally { setIsAddingApp(false); }
  };

  const handleDeleteApp = async (id) => {
    if (!window.confirm('¿Eliminar este aplicativo permanentemente?')) return;
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'deleteApp', id }), headers: { 'Content-Type': 'text/plain' } });
      if ((await response.json()).status === 'success') await fetchApps();
    } catch (err) {}
  };

  const handleUpdateApp = async (e, id) => {
    e.preventDefault();
    try {
      const appToUpdate = appsList.find(a => a.id === id);
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'updateApp', appData: appToUpdate }), headers: { 'Content-Type': 'text/plain' } });
      if ((await response.json()).status === 'success') { setEditingAppId(null); await fetchApps(); }
    } catch (err) {}
  };

  const handleEditChange = (id, field, value) => { setAppsList(appsList.map(app => app.id === id ? { ...app, [field]: value } : app)); };

  // --- Manejo de Ventanas ---
  const launchApp = async (app) => {
    if (openApps.find(a => a.id === app.id)) {
      setMinimizedApps(prev => ({...prev, [app.id]: false}));
      setActiveAppId(app.id); setIsNavVisible(false); return; 
    }
    const appToOpen = { ...app, isAuthorized: true, sys: false, defaultWidth: 1000, defaultHeight: 650 };
    setOpenApps([...openApps, appToOpen]);
    setActiveAppId(appToOpen.id);
    setLoadingApps(prev => ({ ...prev, [appToOpen.id]: true }));
    setIsNavVisible(false);
  };

  const launchSystemApp = (type) => {
    setShowToolsMenu(false);
    let nombre = 'Herramienta'; let defaultWidth = 800; let defaultHeight = 550;
    if (type === 'notes') { nombre = 'Bloc de Notas'; }
    if (type === 'calculator') { nombre = 'Calculadora'; defaultWidth = 320; defaultHeight = 480; }
    if (type === 'todo') { nombre = 'Post-its'; defaultWidth = 450; defaultHeight = 650; }

    const newSysApp = { id: `sys-${type}-${Date.now()}`, nombre, sys: type, isAuthorized: true, icono: '', defaultWidth, defaultHeight };
    setOpenApps([...openApps, newSysApp]);
    setActiveAppId(newSysApp.id);
    setIsNavVisible(false);
  };

  const closeApp = (e, appId) => {
    if(e) e.stopPropagation();
    const newApps = openApps.filter(a => a.id !== appId);
    setOpenApps(newApps);
    if (activeAppId === appId) {
      if (newApps.length > 0) setActiveAppId(newApps[newApps.length - 1].id);
      else { setActiveAppId(null); setCurrentView('dashboard'); setIsNavVisible(true); }
    }
  };

  const toggleMinimize = (e, appId) => {
    e.stopPropagation();
    setMinimizedApps(prev => ({...prev, [appId]: true}));
  };

  const toggleMaximize = (e, appId) => {
    e.stopPropagation();
    setMaximizedApps(prev => ({...prev, [appId]: !prev[appId]}));
  };

  const handleDockItemClick = (appId) => {
    if (minimizedApps[appId]) {
      setMinimizedApps(prev => ({...prev, [appId]: false}));
    }
    setActiveAppId(appId);
    setIsNavVisible(workspaceMode === 'desktop');
  };

  const getWindowClass = (id) => {
    let classes = "agora-window ";
    if (minimizedApps[id] || maximizedApps[id]) classes += "window-transition ";
    if (minimizedApps[id]) classes += "window-minimized ";
    if (maximizedApps[id] && workspaceMode === 'desktop') classes += "window-maximized ";
    return classes;
  };

  // --- VISTAS DEL HUB ---
  const renderDashboard = () => (
    <div className="nova-animate-enter nova-stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
      {appsList.length === 0 ? <p className="theme-text">Cargando portafolio...</p> : (
        appsList.map(app => (
          <div key={app.id} className="nova-card theme-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <div className="theme-bg" style={{ width: '56px', height: '56px', color: 'var(--nova-gold)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', overflow: 'hidden', flexShrink: 0 }}>
                {app.icono ? <img src={getValidImageUrl(app.icono)} alt={app.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IcoApp />}
              </div>
              <h3 className="theme-text" style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>{app.nombre}</h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px', flex: 1 }}>{app.desc}</p>
            <button className="nova-btn nova-btn-primary" style={{ width: '100%', padding: '14px' }} onClick={() => launchApp(app)}>Abrir Aplicativo</button>
          </div>
        ))
      )}
    </div>
  );

  const renderCatalog = () => (
    <div className="nova-animate-enter nova-stagger-1 nova-card theme-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="theme-text" style={{ fontSize: '18px' }}>Gestión de Aplicativos</h2>
        <button className="nova-btn nova-btn-primary" onClick={() => setCurrentView('addApp')}><IcoAdd /> Nuevo App</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="nova-table">
          <thead><tr><th>Ícono</th><th>Nombre</th><th>URL Endpoint</th><th>Acciones</th></tr></thead>
          <tbody>
            {appsList.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign:'center', color: 'var(--text-muted)', padding: '32px'}}>No hay aplicativos registrados.</td></tr>
            ) : (
              appsList.map(app => (
                <tr key={app.id}>
                  {editingAppId === app.id ? (
                    <>
                      <td><input type="url" className="nova-input" value={app.icono} onChange={e => handleEditChange(app.id, 'icono', e.target.value)} style={{ padding: '10px', fontSize: '12px', minWidth: '80px' }}/></td>
                      <td><input type="text" className="nova-input" value={app.nombre} onChange={e => handleEditChange(app.id, 'nombre', e.target.value)} style={{ padding: '10px', fontSize: '13px', minWidth: '120px', fontWeight: '600' }}/></td>
                      <td><input type="url" className="nova-input font-mono" value={app.url} onChange={e => handleEditChange(app.id, 'url', e.target.value)} style={{ padding: '10px', fontSize: '12px', minWidth: '150px' }}/></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="nova-btn nova-btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={(e) => handleUpdateApp(e, app.id)}>Guardar</button>
                          <button className="nova-btn nova-btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => { setEditingAppId(null); fetchApps(); }}>Cancelar</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <div className="theme-bg" style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {app.icono ? <img src={getValidImageUrl(app.icono)} alt="icon" style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <IcoApp />}
                        </div>
                      </td>
                      <td className="theme-text" style={{ fontWeight: '700', fontSize: '14px' }}>{app.nombre}</td>
                      <td className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.url.substring(0,40)}...</td>
                      <td>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <button onClick={() => setEditingAppId(app.id)} style={{ background: 'none', border: 'none', color: 'var(--nova-gold)', cursor: 'pointer', padding: '4px' }} title="Editar"><IcoEdit /></button>
                          <button onClick={() => handleDeleteApp(app.id)} style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', padding: '4px' }} title="Eliminar"><IcoTrash /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAddApp = () => (
    <div className="nova-animate-enter nova-stagger-1 nova-card theme-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
      <h2 className="theme-text" style={{ fontSize: '22px', marginBottom: '32px' }}>Desplegar Nuevo Aplicativo</h2>
      <form onSubmit={handleAddApp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>Nombre Oficial</label><input type="text" className="nova-input" required value={newApp.nombre} onChange={e => setNewApp({...newApp, nombre: e.target.value})} /></div>
        <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>URL del Endpoint (GAS)</label><input type="url" className="nova-input font-mono" required value={newApp.url} onChange={e => setNewApp({...newApp, url: e.target.value})} /></div>
        <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>URL del Ícono (Opcional)</label><input type="url" className="nova-input font-mono" value={newApp.icono} onChange={e => setNewApp({...newApp, icono: e.target.value})} /></div>
        <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>Descripción del módulo</label><textarea className="nova-input" rows="4" required value={newApp.desc} onChange={e => setNewApp({...newApp, desc: e.target.value})}></textarea></div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <button type="button" className="nova-btn nova-btn-secondary" style={{ flex: 1, padding: '14px' }} onClick={() => setCurrentView('dashboard')}>Cancelar</button>
          <button type="submit" className="nova-btn nova-btn-primary" style={{ flex: 1, padding: '14px' }} disabled={isAddingApp}>{isAddingApp ? 'Desplegando...' : 'Guardar y Desplegar'}</button>
        </div>
      </form>
    </div>
  );
  
  const renderUsers = () => (
    <div className="nova-animate-enter nova-stagger-1 nova-card theme-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-light)' }}>
        <h2 className="theme-text" style={{ fontSize: '18px' }}>Directorio Central de Identidades</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="nova-table">
          <thead><tr><th>ID de Red</th><th>Correo Corporativo</th><th>Privilegios (Rol)</th><th>Estado</th></tr></thead>
          <tbody>
            {usersList.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign:'center', color: 'var(--text-muted)', padding: '40px'}}>Sincronizando identidades...</td></tr>
            ) : (
              usersList.map(user => (
                <tr key={user.id}>
                  <td className="font-mono theme-text" style={{ fontWeight: '700', fontSize: '14px' }}>{user.idRed}</td>
                  <td className="theme-text" style={{ fontWeight: '500' }}>{user.correo}</td>
                  <td>
                    <span style={{ 
                      padding: '6px 14px', borderRadius: '50px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
                      background: user.rol === 'Administrador' ? 'rgba(246, 207, 70, 0.15)' : 'rgba(61, 138, 68, 0.15)',
                      color: user.rol === 'Administrador' ? '#B48A1B' : 'var(--nova-green)',
                      border: `1px solid ${user.rol === 'Administrador' ? 'rgba(246, 207, 70, 0.4)' : 'rgba(61, 138, 68, 0.4)'}`
                    }}>
                      {user.rol}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-success)', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}></div>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Autorizado</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="agora-login-container">
        <div className="agora-login-card">
          <div className="agora-login-brand">
            <div className="agora-orb orb-green"></div>
            <div className="agora-orb orb-gold"></div>
            <div className="agora-orb orb-navy"></div>
            <div className="agora-glass-overlay">
              <img src="/logo_compañias.png" alt="Logo" className="agora-login-logo" />
              <h1 className="agora-login-title">Ágora OS.</h1>
              <p className="agora-login-subtitle">Sistema Operativo Web y Gobernanza de Identidades. Tu ecosistema corporativo integrado en la nube.</p>
              <div className="agora-login-line"></div>
            </div>
          </div>
          <div className="agora-login-form-container">
            <div className="agora-login-form-wrapper">
              <h2 className="agora-login-heading">Acceso Autorizado</h2>
              <form onSubmit={handleLogin}>
                <div className="agora-input-group">
                  <div className="agora-input-icon"><IcoUser /></div>
                  <input type="text" className="agora-input" placeholder="Usuario de red" value={usuario} onChange={e => setUsuario(e.target.value.toUpperCase())} required />
                </div>
                <div className="agora-input-group">
                  <div className="agora-input-icon"><IcoLock size={18} /></div>
                  <input type="password" className="agora-input" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {error && <div className="agora-error-badge">{error}</div>}
                
                {/* RECAPTCHA ESTANDAR LIMPIO */}
                <div className="agora-recaptcha-wrapper">
                  <div className="agora-recaptcha-inner">
                    <ReCAPTCHA sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={(val) => setCaptchaVerified(!!val)} />
                  </div>
                </div>
                
                <button type="submit" className="agora-submit-btn" disabled={loading}>
                  {loading ? 'Validando...' : 'Ingresar al Ecosistema'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ÁGORA OS: LAYOUT PRINCIPAL ---
  const isAdmin = userData.rolGlobal === 'Administrador';
  const navItems = [
    { id: 'dashboard', label: 'Escritorio', icon: <IcoDashboard />, adminOnly: false },
    { id: 'catalog', label: 'Catálogo', icon: <IcoCatalog />, adminOnly: true },
    { id: 'addApp', label: 'Desplegar', icon: <IcoAdd />, adminOnly: true },
    { id: 'users', label: 'Identidades', icon: <IcoUsers />, adminOnly: true }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--surface-bg)', overflow: 'hidden', position: 'relative' }}>
      
      {/* NAVBAR */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, transform: isNavVisible ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.4s var(--ease-spring)' }}>
        <header className="theme-card" style={{ height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid var(--border-light)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', background: 'var(--nova-green)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: '900', fontSize: '16px' }}>Á</div>
              <span className="theme-text" style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px' }}>ÁGORA OS</span>
            </div>
            <nav style={{ display: 'flex', gap: '6px' }}>
              {navItems.filter(item => !item.adminOnly || isAdmin).map(item => {
                const isActive = currentView === item.id && activeAppId === null;
                return (
                  <button key={item.id} onClick={() => { setActiveAppId(null); setCurrentView(item.id); }} 
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', 
                      fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none', transition: 'all 0.2s', 
                      background: isActive ? 'rgba(61, 138, 68, 0.1)' : 'transparent', color: isActive ? 'var(--nova-green)' : 'var(--text-muted)' 
                    }}>
                    {item.icon} {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', background: 'var(--surface-bg)', borderRadius: '12px', padding: '6px', border: '1px solid var(--border-light)' }}>
              <button onClick={toggleWorkspace} title="Ventanas Libres" style={{ background: 'transparent', border: 'none', color: workspaceMode === 'desktop' ? 'var(--nova-green)' : 'var(--text-muted)', cursor: 'pointer', padding: '8px', display: 'flex', borderRadius: '8px' }}>{workspaceMode === 'focus' ? <IcoDesktop /> : <IcoFocus />}</button>
              <div style={{ width: '1px', background: 'var(--border-light)', margin: '4px' }}></div>
              <button onClick={toggleTheme} title="Modo Oscuro" style={{ background: 'transparent', border: 'none', color: theme === 'dark' ? 'var(--nova-green)' : 'var(--text-muted)', cursor: 'pointer', padding: '8px', display: 'flex', borderRadius: '8px' }}>{theme === 'light' ? <IcoMoon /> : <IcoSun />}</button>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="theme-text" style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>{userData.usuario}</span>
              <span style={{ fontSize: '10px', color: 'var(--nova-green)', textTransform: 'uppercase', fontWeight: '800', marginTop: '6px', letterSpacing: '0.5px' }}>{userData.rolGlobal}</span>
            </div>
            <button style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--surface-bg)', border: '1px solid var(--border-light)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onClick={() => {setIsLoggedIn(false); setOpenApps([]); setActiveAppId(null);}} title="Cerrar Sesión">
              <IcoLogout />
            </button>
          </div>
        </header>
      </div>

      {/* ÁREA DE TRABAJO (WORKSPACE) */}
      <main style={{ position: 'absolute', top: isNavVisible ? '76px' : '0', bottom: 0, left: 0, right: 0, transition: 'top 0.4s var(--ease-spring)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', opacity: activeAppId === null ? 1 : (workspaceMode === 'desktop' ? 1 : 0), pointerEvents: activeAppId === null ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 40px', paddingBottom: '140px' }}>
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'catalog' && renderCatalog()}
            {currentView === 'addApp' && renderAddApp()}
            {currentView === 'users' && renderUsers()}
          </div>
        </div>

        {/* MOTOR DE VENTANAS CON SPINNER Y EFECTO ALADDÍN */}
        {openApps.map(app => (
          workspaceMode === 'desktop' ? (
            <Rnd key={app.id} default={{ x: 60 + (Math.random() * 40), y: 40 + (Math.random() * 40), width: app.defaultWidth, height: app.defaultHeight }} minWidth={350} minHeight={300} bounds="parent"
              className={getWindowClass(app.id)}
              style={{ zIndex: activeAppId === app.id ? 50 : 10, display: activeAppId === null ? 'none' : 'flex', flexDirection: 'column', background: 'var(--surface-card)', borderRadius: '16px', overflow: 'hidden', boxShadow: activeAppId === app.id ? 'var(--shadow-lg)' : 'var(--shadow-md)', border: '1px solid var(--border-light)' }}
              onMouseDownCapture={() => setActiveAppId(app.id)} dragHandleClassName="agora-drag-handle"
            >
              <div className="agora-drag-handle theme-bg" style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid var(--border-light)', cursor: 'grab' }}>
                
                {/* BOTONES SEMÁFORO MAC */}
                <div className="mac-btn-group">
                  <button className="mac-btn close" onClick={(e) => closeApp(e, app.id)} title="Cerrar"></button>
                  <button className="mac-btn minimize" onClick={(e) => toggleMinimize(e, app.id)} title="Minimizar (Efecto Genio)"></button>
                  <button className="mac-btn maximize" onClick={(e) => toggleMaximize(e, app.id)} title="Maximizar"></button>
                </div>

                <span className="theme-text" style={{ fontWeight: 600, fontSize: '14px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>{app.nombre}</span>
                <div style={{width: '40px'}}></div> {/* Spacer para centrar el titulo */}
              </div>
              
              <div style={{ flex: 1, background: 'var(--surface-card)', position: 'relative' }}>
                {loadingApps[app.id] && !app.sys && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-bg)', zIndex: 5 }}><div className="agora-spinner"></div></div>}
                
                {/* RENDERIZADO HERRAMIENTAS NATIVAS */}
                {app.sys === 'notes' && <textarea className="theme-bg theme-text" style={{width: '100%', height: '100%', padding: '32px', border: 'none', resize: 'none', fontSize: '15px', outline: 'none', lineHeight: '1.6'}} placeholder="Escribe tus notas aquí..." />}
                {app.sys === 'calculator' && <NativeCalculator />}
                {app.sys === 'todo' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', height: '100%', overflowY: 'auto', background: 'var(--surface-bg)' }}>
                    <textarea style={{width: '100%', minHeight: '160px', padding: '16px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', resize: 'none', color: '#92400E', fontSize: '14px', fontWeight: '500', outline: 'none'}} placeholder="Urgente..." />
                    <textarea style={{width: '100%', minHeight: '160px', padding: '16px', background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: '8px', resize: 'none', color: '#065F46', fontSize: '14px', fontWeight: '500', outline: 'none'}} placeholder="En progreso..." />
                    <textarea style={{width: '100%', minHeight: '160px', padding: '16px', background: '#DBEAFE', border: '1px solid #BFDBFE', borderRadius: '8px', resize: 'none', color: '#1E40AF', fontSize: '14px', fontWeight: '500', outline: 'none'}} placeholder="Idea..." />
                  </div>
                )}
                
                {/* IFRAMES DE APLICATIVOS */}
                {!app.sys && (app.isAuthorized ? <iframe src={`${app.url}?usuario=${userData.usuario}`} onLoad={() => setLoadingApps(prev => ({...prev, [app.id]: false}))} style={{ width: '100%', height: '100%', border: 'none', opacity: loadingApps[app.id] ? 0 : 1, transition: 'opacity 0.3s' }} title={app.nombre} /> : <div style={{padding: '40px', textAlign:'center'}}><h2 style={{color:'red'}}>Acceso Restringido</h2></div> )}
              </div>
            </Rnd>
          ) : (
            <div key={app.id} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: activeAppId === app.id ? 1 : 0, pointerEvents: activeAppId === app.id ? 'auto' : 'none', transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-bg)' }}>
              {loadingApps[app.id] && !app.sys && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-bg)', zIndex: 5 }}><div className="agora-spinner"></div></div>}
              {app.sys === 'notes' ? (
                <div style={{ width: '100%', height: '100%', padding: '60px' }}><textarea className="nova-card theme-card theme-text" style={{width: '100%', height: '100%', padding: '48px', border: 'none', resize: 'none', fontSize: '16px', outline: 'none', borderRadius: '24px'}} placeholder="Escribe tus notas aquí..." /></div>
              ) : (
                app.isAuthorized ? <iframe src={`${app.url}?usuario=${userData.usuario}`} onLoad={() => setLoadingApps(prev => ({...prev, [app.id]: false}))} style={{ width: '100%', height: '100%', border: 'none', background: 'white', opacity: loadingApps[app.id] ? 0 : 1, transition: 'opacity 0.3s' }} title={app.nombre} /> : <div style={{padding: '40px', textAlign:'center'}}><h2 style={{color:'red'}}>Acceso Restringido</h2></div>
              )}
            </div>
          )
        ))}
      </main>

      {/* DOCK MULTITAREA (ESTILO macOS) */}
      {openApps.length > 0 && (
        <div className="nova-dock-container">
          <button className={`nova-dock-item ${activeAppId === null ? 'active' : ''}`} onClick={() => { setActiveAppId(null); setIsNavVisible(true); setShowToolsMenu(false); }} title="Escritorio"><IcoDashboard /></button>
          
          <div className="nova-dock-divider"></div>
          
          {/* CARPETA DE HERRAMIENTAS NATIVAS */}
          <div style={{ position: 'relative' }}>
            <button className="nova-dock-item" onClick={() => setShowToolsMenu(!showToolsMenu)} title="Aplicaciones del Sistema"><IcoFolder /></button>
            {showToolsMenu && (
              <div className="nova-folder-menu">
                <button className="nova-btn nova-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => launchSystemApp('notes')}><IcoNotes /> Notas</button>
                <button className="nova-btn nova-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => launchSystemApp('calculator')}><IcoCalculator /> Calculadora</button>
                <button className="nova-btn nova-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => launchSystemApp('todo')}><IcoTodo /> Post-its</button>
              </div>
            )}
          </div>

          <div className="nova-dock-divider"></div>

          {openApps.map(app => (
            <button key={app.id} className={`nova-dock-item ${activeAppId === app.id ? 'active' : ''} ${loadingApps[app.id] ? 'dock-bounce' : ''}`} onClick={() => handleDockItemClick(app.id)} title={app.nombre}>
              {app.icono ? <img src={getValidImageUrl(app.icono)} alt={app.nombre} style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '6px' }} /> : (app.sys === 'notes' ? <IcoNotes/> : app.sys === 'calculator' ? <IcoCalculator/> : app.sys === 'todo' ? <IcoTodo/> : <IcoApp />)}
              <div className="nova-dock-close" onClick={(e) => closeApp(e, app.id)} title="Cerrar"><IcoX /></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}