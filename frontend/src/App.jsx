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
const IcoLogout = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoChevronUp = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>;
const IcoChevronDown = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>;
const IcoX = () => <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoCatalog = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7"/></svg>;
const IcoEdit = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoTrash = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IcoSun = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IcoMoon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IcoDesktop = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
const IcoFocus = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>;
const IcoNotes = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;

// Utilidad para Google Drive y URLs de imágenes
const getValidImageUrl = (url) => {
  if (!url) return '';
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return driveMatch ? `https://drive.google.com/uc?export=view&id=${driveMatch[1]}` : url;
};

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxYszzacLW5AbwolurkZFX2_lq_m2qk3JDWokDpo_DitmquPojP-KGmllamG0xayGlabA/exec';

export default function App() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // reCAPTCHA Real
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  // OS Settings
  const [theme, setTheme] = useState('light');
  const [workspaceMode, setWorkspaceMode] = useState('focus'); // 'focus' | 'desktop'
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [openApps, setOpenApps] = useState([]);
  const [activeAppId, setActiveAppId] = useState(null);
  const [isNavVisible, setIsNavVisible] = useState(true); 
  
  // ESTADOS DE BASE DE DATOS
  const [appsList, setAppsList] = useState([]);
  const [usersList, setUsersList] = useState([]); // <-- El estado de los usuarios que nos faltaba
  
  // CRUD
  const [newApp, setNewApp] = useState({ nombre: '', url: '', desc: '', icono: '' });
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [editingAppId, setEditingAppId] = useState(null);

  // Efecto del Tema
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleWorkspace = () => setWorkspaceMode(prev => prev === 'focus' ? 'desktop' : 'focus');

  // Funciones de descarga (Fetch)
  const fetchApps = async () => {
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'getApps' }), headers: { 'Content-Type': 'text/plain' } });
      const result = await response.json();
      if(result.status === 'success') setAppsList(result.data);
    } catch (err) { console.error("Error", err); }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'getUsers' }), headers: { 'Content-Type': 'text/plain' } });
      const result = await response.json();
      if(result.status === 'success') setUsersList(result.data);
    } catch (err) { console.error("Error", err); }
  };

  // Al iniciar sesión, descargamos todo
  useEffect(() => { 
    if(isLoggedIn) {
      fetchApps(); 
      fetchUsers();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaVerified) { setError('Por favor, resuelve el reCAPTCHA para continuar.'); return; }
    setLoading(true); setError('');
    
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'login', usuario, password }), headers: { 'Content-Type': 'text/plain' } });
      const result = await response.json();
      if (result.status === 'success') { setIsLoggedIn(true); setUserData(result); } 
      else { setError(result.message); }
    } catch (err) { setError('Servidor no disponible.'); } 
    finally { setLoading(false); }
  };

  // --- CRUD Funciones ---
  const handleAddApp = async (e) => {
    e.preventDefault();
    setIsAddingApp(true);
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'addApp', appData: newApp }), headers: { 'Content-Type': 'text/plain' } });
      const result = await response.json();
      if (result.status === 'success') { await fetchApps(); setNewApp({ nombre: '', url: '', desc: '', icono: '' }); setCurrentView('dashboard'); } 
    } finally { setIsAddingApp(false); }
  };

  const handleDeleteApp = async (id) => {
    if (!window.confirm('¿Eliminar este aplicativo?')) return;
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

  const handleEditChange = (id, field, value) => {
    setAppsList(appsList.map(app => app.id === id ? { ...app, [field]: value } : app));
  };

  // --- Manejo de Aplicativos y Ventanas ---
  const launchApp = async (app) => {
    if (openApps.find(a => a.id === app.id)) { setActiveAppId(app.id); setIsNavVisible(false); return; }
    // Abrimos el app delegando la responsabilidad de acceso
    const appToOpen = { ...app, isAuthorized: true, sys: false };
    setOpenApps([...openApps, appToOpen]);
    setActiveAppId(appToOpen.id);
    setIsNavVisible(false);
  };

  const launchSystemApp = (type) => {
    const newSysApp = {
      id: `sys-${type}-${Date.now()}`,
      nombre: type === 'notes' ? 'Bloc de Notas' : 'Calculadora',
      sys: type,
      isAuthorized: true,
      icono: ''
    };
    setOpenApps([...openApps, newSysApp]);
    setActiveAppId(newSysApp.id);
    setIsNavVisible(false);
  };

  const closeApp = (e, appId) => {
    e.stopPropagation();
    const newApps = openApps.filter(a => a.id !== appId);
    setOpenApps(newApps);
    if (activeAppId === appId) {
      if (newApps.length > 0) setActiveAppId(newApps[newApps.length - 1].id);
      else { setActiveAppId(null); setCurrentView('dashboard'); setIsNavVisible(true); }
    }
  };

  // --- VISTAS INTERNAS ---
  const renderDashboard = () => (
    <div className="nova-animate-enter nova-stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
      {appsList.length === 0 ? <p className="theme-text">Cargando portafolio...</p> : (
        appsList.map(app => (
          <div key={app.id} className="nova-card theme-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, var(--nova-gold) 0%, transparent 70%)', opacity: '0.1', borderRadius: '50%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div className="theme-bg" style={{ width: '40px', height: '40px', color: 'var(--agora-navy)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                {app.icono ? <img src={getValidImageUrl(app.icono)} alt={app.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IcoApp />}
              </div>
            </div>
            <h3 className="theme-text" style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{app.nombre}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>{app.desc}</p>
            <button className="nova-btn nova-btn-primary" style={{ width: '100%' }} onClick={() => launchApp(app)}>Abrir Aplicativo</button>
          </div>
        ))
      )}
    </div>
  );

  const renderCatalog = () => (
    <div className="nova-animate-enter nova-stagger-1 nova-card theme-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="theme-text" style={{ fontSize: '16px' }}>Gestión de Aplicativos</h2>
        <button className="nova-btn nova-btn-primary" onClick={() => setCurrentView('addApp')}><IcoAdd /> Nuevo</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="nova-table">
          <thead><tr><th>Ícono</th><th>Nombre</th><th>URL Endpoint</th><th>Acciones</th></tr></thead>
          <tbody>
            {appsList.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign:'center', color: 'var(--text-muted)', padding: '24px'}}>No hay aplicativos registrados.</td></tr>
            ) : (
              appsList.map(app => (
                <tr key={app.id}>
                  {editingAppId === app.id ? (
                    <>
                      <td><input type="url" className="nova-input theme-bg theme-text" value={app.icono} onChange={e => handleEditChange(app.id, 'icono', e.target.value)} style={{ padding: '6px', fontSize: '12px', minWidth: '80px' }}/></td>
                      <td><input type="text" className="nova-input theme-bg theme-text" value={app.nombre} onChange={e => handleEditChange(app.id, 'nombre', e.target.value)} style={{ padding: '6px', fontSize: '12px', minWidth: '120px' }}/></td>
                      <td><input type="url" className="nova-input font-mono theme-bg theme-text" value={app.url} onChange={e => handleEditChange(app.id, 'url', e.target.value)} style={{ padding: '6px', fontSize: '11px', minWidth: '150px' }}/></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="nova-btn nova-btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={(e) => handleUpdateApp(e, app.id)}>Guardar</button>
                          <button className="nova-btn nova-btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => { setEditingAppId(null); fetchApps(); }}>Cancelar</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <div className="theme-bg" style={{ width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {app.icono ? <img src={getValidImageUrl(app.icono)} alt="icon" style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <IcoApp />}
                        </div>
                      </td>
                      <td className="theme-text" style={{ fontWeight: '600' }}>{app.nombre}</td>
                      <td className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.url.substring(0,30)}...</td>
                      <td>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button onClick={() => setEditingAppId(app.id)} style={{ background: 'none', border: 'none', color: 'var(--agora-navy)', cursor: 'pointer', padding: '4px' }} title="Editar"><IcoEdit /></button>
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
    <div className="nova-animate-enter nova-stagger-1 nova-card theme-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '32px' }}>
      <h2 className="theme-text" style={{ fontSize: '20px', marginBottom: '24px' }}>Registrar Aplicativo</h2>
      <form onSubmit={handleAddApp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div><label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Nombre Oficial</label><input type="text" className="nova-input theme-bg theme-text" required value={newApp.nombre} onChange={e => setNewApp({...newApp, nombre: e.target.value})} /></div>
        <div><label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>URL del Endpoint (GAS)</label><input type="url" className="nova-input font-mono theme-bg theme-text" required value={newApp.url} onChange={e => setNewApp({...newApp, url: e.target.value})} /></div>
        <div><label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>URL del Ícono (PNG/JPG)</label><input type="url" className="nova-input font-mono theme-bg theme-text" value={newApp.icono} onChange={e => setNewApp({...newApp, icono: e.target.value})} /></div>
        <div><label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Descripción</label><textarea className="nova-input theme-bg theme-text" rows="3" required value={newApp.desc} onChange={e => setNewApp({...newApp, desc: e.target.value})}></textarea></div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button type="button" className="nova-btn nova-btn-secondary" style={{ flex: 1 }} onClick={() => setCurrentView('dashboard')}>Cancelar</button>
          <button type="submit" className="nova-btn nova-btn-primary" style={{ flex: 1 }} disabled={isAddingApp}>{isAddingApp ? 'Desplegando...' : 'Guardar y Desplegar'}</button>
        </div>
      </form>
    </div>
  );
  
  const renderUsers = () => (
    <div className="nova-animate-enter nova-stagger-1 nova-card theme-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
        <h2 className="theme-text" style={{ fontSize: '18px' }}>Directorio Central de Identidades</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="nova-table">
          <thead><tr><th>ID de Red</th><th>Correo Corporativo</th><th>Privilegios (Rol)</th><th>Estado en Red</th></tr></thead>
          <tbody>
            {usersList.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign:'center', color: 'var(--text-muted)', padding: '32px'}}>Sincronizando identidades...</td></tr>
            ) : (
              usersList.map(user => (
                <tr key={user.id}>
                  <td className="font-mono theme-text" style={{ fontWeight: '700', fontSize: '14px' }}>{user.idRed}</td>
                  <td className="theme-text" style={{ fontWeight: '500' }}>{user.correo}</td>
                  <td>
                    <span style={{ 
                      padding: '6px 12px', borderRadius: '50px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px',
                      background: user.rol === 'Administrador' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: user.rol === 'Administrador' ? '#D97706' : 'var(--nova-green)',
                      border: `1px solid ${user.rol === 'Administrador' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                    }}>
                      {user.rol}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-success)', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }}></div>
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

  // --- LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="nova-login-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
        <div className="shooting-star star-1"></div><div className="shooting-star star-2"></div>
        <div className="nova-card nova-animate-enter" style={{ display: 'flex', width: '900px', height: '540px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', zIndex: 10, border: 'none' }}>
          <div style={{ flex: 1, position: 'relative', background: 'linear-gradient(135deg, var(--nova-navy-light) 0%, var(--nova-navy-dark) 100%)', color: 'white', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
            <div className="abstract-shape shape-1" style={{ width: '320px', height: '40px', background: 'var(--nova-gold)', top: '62%', left: '-10%' }} />
            <div className="abstract-shape shape-2" style={{ width: '480px', height: '60px', background: 'var(--nova-green)', top: '75%', left: '-5%' }} />
            <div className="abstract-shape shape-3" style={{ width: '220px', height: '30px', background: 'var(--nova-gold)', top: '88%', left: '35%' }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <img src="/logo_compañias.png" alt="Logo" style={{ height: '35px', objectFit: 'contain', objectPosition: 'left', marginBottom: '40px' }} />
              <h1 style={{ fontSize: '42px', fontWeight: '900', lineHeight: '1.1', marginBottom: '16px', fontFamily: 'Outfit', color: '#FFFFFF', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>Ágora OS.</h1>
              <p style={{ fontSize: '15px', color: '#E2E8F0', lineHeight: '1.6', fontWeight: '500' }}>Sistema Operativo Web y Gobernanza de Identidades. Tu ecosistema corporativo en la nube.</p>
            </div>
          </div>
          <div style={{ flex: '0 0 420px', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--nova-navy)', marginBottom: '32px', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>Ingreso Seguro</h2>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
                {error && (<div style={{ padding: '12px', background: '#FFF0F2', color: '#9F1239', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: '600' }}>{error}</div>)}
                <div className="nova-pill-input-wrapper"><div className="nova-pill-icon"><IcoUser /></div><input type="text" className="nova-pill-input" placeholder="Usuario de red" value={usuario} onChange={e => setUsuario(e.target.value.toUpperCase())} required /></div>
                <div className="nova-pill-input-wrapper" style={{ marginBottom: '16px' }}><div className="nova-pill-icon"><IcoLock size={18} /></div><input type="password" className="nova-pill-input" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                
                {/* reCAPTCHA REAL */}
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                  <ReCAPTCHA sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={(val) => setCaptchaVerified(!!val)} />
                </div>
                
                <button type="submit" className="nova-btn-pill" disabled={loading}>{loading ? 'Autorizando...' : 'Ingresar al Ecosistema'}</button>
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
      
      {/* HEADER ÁGORA */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, transform: isNavVisible ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.4s var(--ease-spring)' }}>
        <header className="theme-card" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--surface-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '28px', height: '28px', background: 'var(--agora-navy)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--surface-bg)', fontWeight: '900', fontSize: '14px' }}>Á</div><span className="theme-text" style={{ fontSize: '15px', fontWeight: '900', letterSpacing: '1px' }}>ÁGORA OS</span></div>
            <nav style={{ display: 'flex', gap: '8px' }}>
              {navItems.filter(item => !item.adminOnly || isAdmin).map(item => (
                <button key={item.id} onClick={() => { setActiveAppId(null); setCurrentView(item.id); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: currentView === item.id && activeAppId === null ? 'var(--agora-navy)' : 'transparent', color: currentView === item.id && activeAppId === null ? 'var(--surface-bg)' : 'var(--text-muted)' }}>{item.icon} {item.label}</button>
              ))}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* CONTROLES DEL SISTEMA OPERATIVO */}
            <div style={{ display: 'flex', background: 'var(--surface-bg)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border-light)' }}>
              <button onClick={toggleWorkspace} title={workspaceMode === 'focus' ? "Cambiar a Ventanas Libres" : "Cambiar a Pantalla Completa"} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', display: 'flex' }}>
                {workspaceMode === 'focus' ? <IcoDesktop /> : <IcoFocus />}
              </button>
              <div style={{ width: '1px', background: 'var(--border-light)', margin: '0 4px' }}></div>
              <button onClick={toggleTheme} title="Cambiar Tema" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', display: 'flex' }}>
                {theme === 'light' ? <IcoMoon /> : <IcoSun />}
              </button>
            </div>

            <div style={{ textAlign: 'right', marginLeft: '12px' }}><p className="theme-text" style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>{userData.usuario}</p><p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>{userData.rolGlobal}</p></div>
            <button style={{ padding: '8px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => {setIsLoggedIn(false); setOpenApps([]); setActiveAppId(null);}}><IcoLogout /></button>
          </div>
        </header>
      </div>

      <button onClick={() => setIsNavVisible(!isNavVisible)} style={{ position: 'absolute', top: isNavVisible ? '64px' : '0', left: '50%', transform: 'translateX(-50%)', background: 'var(--surface-card)', border: '1px solid var(--border-light)', borderTop: 'none', padding: '4px 16px', borderRadius: '0 0 12px 12px', cursor: 'pointer', zIndex: 90, color: 'var(--text-muted)' }}>
        {isNavVisible ? <IcoChevronUp /> : <IcoChevronDown />}
      </button>

      {/* ÁREA DE TRABAJO (WORKSPACE) */}
      <main style={{ position: 'absolute', top: isNavVisible ? '64px' : '0', bottom: 0, left: 0, right: 0, transition: 'top 0.4s var(--ease-spring)' }}>
        
        {/* VISTAS ADMINISTRATIVAS */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', opacity: activeAppId === null ? 1 : (workspaceMode === 'desktop' ? 1 : 0), pointerEvents: activeAppId === null ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px', paddingBottom: '120px' }}>
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'catalog' && renderCatalog()}
            {currentView === 'addApp' && renderAddApp()}
            {currentView === 'users' && renderUsers()}
          </div>
        </div>

        {/* MOTOR DE VENTANAS (FOCUS O DESKTOP) */}
        {openApps.map(app => (
          workspaceMode === 'desktop' ? (
            /* MODO ESCRITORIO (Ventanas Flotantes Arrastrables) */
            <Rnd key={app.id} default={{ x: 60, y: 40, width: 900, height: 600 }} minWidth={350} minHeight={200} bounds="parent"
              style={{ zIndex: activeAppId === app.id ? 50 : 10, display: activeAppId === null ? 'none' : 'flex', flexDirection: 'column', background: 'var(--surface-card)', borderRadius: '12px', overflow: 'hidden', boxShadow: activeAppId === app.id ? '0 20px 40px rgba(0,0,0,0.3)' : '0 10px 20px rgba(0,0,0,0.1)', border: '1px solid var(--border-light)' }}
              onMouseDownCapture={() => setActiveAppId(app.id)} dragHandleClassName="agora-drag-handle"
            >
              <div className="agora-drag-handle theme-bg" style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid var(--border-light)', cursor: 'grab' }}>
                <span className="theme-text" style={{ fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {app.sys === 'notes' ? <IcoNotes /> : <IcoApp />} {app.nombre}
                </span>
                <button onClick={(e) => closeApp(e, app.id)} style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', padding: '4px' }}><IcoX /></button>
              </div>
              <div style={{ flex: 1, background: 'var(--surface-card)' }}>
                {app.sys === 'notes' ? ( <textarea className="theme-bg theme-text" style={{width: '100%', height: '100%', padding: '24px', border: 'none', resize: 'none', fontSize: '15px', outline: 'none'}} placeholder="Escribe tus notas aquí..." /> ) : 
                ( app.isAuthorized ? <iframe src={`${app.url}?usuario=${userData.usuario}&rol=${userData.roles?.generico || 'Generico'}`} style={{ width: '100%', height: '100%', border: 'none' }} title={app.nombre} /> : <div style={{padding: '40px', textAlign:'center'}}><h2 style={{color:'red'}}>Acceso Restringido</h2></div> )}
              </div>
            </Rnd>
          ) : (
            /* MODO FOCUS (Pantalla Completa Original) */
            <div key={app.id} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: activeAppId === app.id ? 1 : 0, pointerEvents: activeAppId === app.id ? 'auto' : 'none', transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-bg)' }}>
              {app.sys === 'notes' ? (
                <div style={{ width: '100%', height: '100%', padding: '40px' }}><textarea className="nova-card theme-card theme-text" style={{width: '100%', height: '100%', padding: '40px', border: 'none', resize: 'none', fontSize: '16px', outline: 'none', borderRadius: '16px'}} placeholder="Escribe tus notas aquí..." /></div>
              ) : (
                app.isAuthorized ? <iframe src={`${app.url}?usuario=${userData.usuario}&rol=${userData.roles?.generico || 'Generico'}`} style={{ width: '100%', height: '100%', border: 'none', background: 'white' }} title={app.nombre} /> : <div style={{padding: '40px', textAlign:'center'}}><h2 style={{color:'red'}}>Acceso Restringido</h2></div>
              )}
            </div>
          )
        ))}
      </main>

      {/* DOCK MULTITAREA */}
      {openApps.length > 0 && (
        <div className="nova-dock-container theme-card" style={{ border: '1px solid var(--border-light)' }}>
          <button className={`nova-dock-item ${activeAppId === null ? 'active' : ''}`} onClick={() => { setActiveAppId(null); setIsNavVisible(true); }} title="Escritorio"><IcoDashboard /></button>
          
          <div className="nova-dock-divider"></div>
          
          {/* APPS DEL SISTEMA */}
          <button className="nova-dock-item" onClick={() => launchSystemApp('notes')} title="Bloc de Notas"><IcoNotes /></button>
          
          <div className="nova-dock-divider"></div>

          {openApps.filter(app => !app.sys).map(app => (
            <button key={app.id} className={`nova-dock-item ${activeAppId === app.id ? 'active' : ''}`} onClick={() => { setActiveAppId(app.id); setIsNavVisible(workspaceMode === 'desktop'); }} title={app.nombre}>
              {app.icono ? <img src={getValidImageUrl(app.icono)} alt={app.nombre} style={{ width: '22px', height: '22px', objectFit: 'contain', borderRadius: '4px' }} /> : <IcoApp />}
              <div className="nova-dock-close" onClick={(e) => closeApp(e, app.id)} title="Cerrar"><IcoX /></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}