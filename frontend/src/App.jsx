import { useState, useEffect } from 'react';

// --- Íconos Vectoriales ---
const IcoUser = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoLock = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoDashboard = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>;
const IcoUsers = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoAdd = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoApp = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
const IcoLogout = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoChevronUp = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>;
const IcoChevronDown = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>;
const IcoCheck = () => <svg width="14" height="14" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoLeft = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>;
const IcoRight = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>;
const IcoX = () => <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoRecaptcha = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 7v3.5l4-3.5-4-3.5V7c-3.31 0-6 2.69-6 6h2c0-2.21 1.79-4 4-4z" fill="#4285F4"/><path d="M12 17v-3.5l-4 3.5 4 3.5V17c3.31 0 6-2.69 6-6h-2c0 2.21-1.79 4-4 4z" fill="#9AA0A6"/></svg>;

// ==========================================
// API REST: CONEXIÓN AL BACKEND DE GOOGLE SHEETS
// ==========================================
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxYszzacLW5AbwolurkZFX2_lq_m2qk3JDWokDpo_DitmquPojP-KGmllamG0xayGlabA/exec';

export default function App() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [openApps, setOpenApps] = useState([]);
  const [activeAppId, setActiveAppId] = useState(null);
  const [isNavVisible, setIsNavVisible] = useState(true); 

  // --- ESTADOS DINÁMICOS DESDE LA BASE DE DATOS ---
  const [appsList, setAppsList] = useState([]);
  const [usersList, setUsersList] = useState([]); 
  
  const [newApp, setNewApp] = useState({ nombre: '', url: '', rolReq: 'generico', desc: '' });
  const [isAddingApp, setIsAddingApp] = useState(false);

  // --- MOTOR DE API REST ---
  const fetchApps = async () => {
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'getApps' }), headers: { 'Content-Type': 'text/plain' } });
      const result = await response.json();
      if(result.status === 'success') setAppsList(result.data);
    } catch (err) { console.error("Error cargando aplicativos", err); }
  };

  useEffect(() => {
    if(isLoggedIn) fetchApps(); 
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaVerified) { setError('Verificación de seguridad requerida.'); return; }
    setLoading(true); setError('');
    
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'login', usuario, password }), headers: { 'Content-Type': 'text/plain' } });
      const result = await response.json();
      if (result.status === 'success') { 
        setIsLoggedIn(true); 
        setUserData(result); 
      } else { 
        setError(result.message); 
      }
    } catch (err) {
      setError('Servidor no disponible. Verifica la API.');
    } finally { setLoading(false); }
  };

  const handleAddApp = async (e) => {
    e.preventDefault();
    setIsAddingApp(true);
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'addApp', appData: newApp }), headers: { 'Content-Type': 'text/plain' } });
      const result = await response.json();
      if (result.status === 'success') {
        await fetchApps(); 
        setNewApp({ nombre: '', url: '', rolReq: 'generico', desc: '' }); 
        setCurrentView('dashboard'); 
      } else {
        alert("Error al guardar: " + result.message);
      }
    } catch (err) {
      alert("Error de red guardando el aplicativo.");
    } finally { setIsAddingApp(false); }
  };

  // --- LÓGICA DE MULTITAREA Y ESCRITORIOS ---
  const simulateCaptcha = () => {
    if(captchaVerified) return;
    setCaptchaLoading(true);
    setTimeout(() => { setCaptchaVerified(true); setCaptchaLoading(false); }, 800);
  };

  const launchApp = (app) => {
    const isAlreadyOpen = openApps.find(a => a.id === app.id);
    if (!isAlreadyOpen) setOpenApps([...openApps, app]);
    setActiveAppId(app.id);
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

  const cycleApp = (direction) => {
    if (openApps.length === 0) return;
    const allViews = ['dashboard', ...openApps.map(a => a.id)];
    const currentIndex = allViews.indexOf(activeAppId || 'dashboard');
    let nextIndex;
    if (direction === 'next') nextIndex = (currentIndex + 1) % allViews.length;
    else nextIndex = (currentIndex - 1 + allViews.length) % allViews.length;
    
    const nextView = allViews[nextIndex];
    if (nextView === 'dashboard') { setActiveAppId(null); setIsNavVisible(true); } 
    else { setActiveAppId(nextView); setIsNavVisible(false); }
  };

  const changeInternalView = (viewId) => {
    setActiveAppId(null);
    setCurrentView(viewId);
  };

  // --- RENDERIZADO DE VISTAS ---
  const renderDashboard = () => (
    <div className="nova-animate-enter nova-stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
      {appsList.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>Cargando aplicativos desde la base de datos...</p>
      ) : (
        appsList.map(app => (
          <div key={app.id} className="nova-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, var(--nova-gold) 0%, transparent 70%)', opacity: '0.1', borderRadius: '50%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--surface-bg)', color: 'var(--nova-navy)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}><IcoApp /></div>
              <span className="font-mono" style={{ fontSize: '9px', fontWeight: '700', padding: '4px 8px', background: '#F1F5F9', color: 'var(--text-muted)', borderRadius: '4px' }}>VERIFICADO</span>
            </div>
            <h3 style={{ fontSize: '16px', color: 'var(--nova-navy)', marginBottom: '8px' }}>{app.nombre}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>{app.desc}</p>
            <button className="nova-btn nova-btn-primary" style={{ width: '100%' }} onClick={() => launchApp(app)}>Ingresar al Sistema</button>
          </div>
        ))
      )}
    </div>
  );

  const renderAddApp = () => (
    <div className="nova-animate-enter nova-stagger-1 nova-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '32px' }}>
      <h2 style={{ fontSize: '20px', color: 'var(--nova-navy)', marginBottom: '24px' }}>Registrar Aplicativo en BD</h2>
      <form onSubmit={handleAddApp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Nombre Oficial</label>
          <input type="text" className="nova-input" required value={newApp.nombre} onChange={e => setNewApp({...newApp, nombre: e.target.value})} placeholder="Ej. Portal Corporativo" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>URL del Endpoint (Deploy de GAS)</label>
          <input type="url" className="nova-input font-mono" required value={newApp.url} onChange={e => setNewApp({...newApp, url: e.target.value})} placeholder="https://script.google.com/..." />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Descripción del Módulo</label>
          <textarea className="nova-input" rows="3" required value={newApp.desc} onChange={e => setNewApp({...newApp, desc: e.target.value})} placeholder="¿Qué función cumple este aplicativo?"></textarea>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button type="button" className="nova-btn nova-btn-secondary" style={{ flex: 1 }} onClick={() => setCurrentView('dashboard')}>Cancelar</button>
          <button type="submit" className="nova-btn nova-btn-primary" style={{ flex: 1 }} disabled={isAddingApp}>
            {isAddingApp ? 'Desplegando...' : 'Guardar y Desplegar'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderUsers = () => (
    <div className="nova-animate-enter nova-stagger-1 nova-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '16px', color: 'var(--nova-navy)' }}>Directorio de Identidades (Mock Temporal)</h2>
        <button className="nova-btn nova-btn-primary"><IcoAdd /> Invitar Usuario</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="nova-table">
          <thead><tr><th>ID de Red</th><th>Correo Corporativo</th><th>Rol Global</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td colSpan="4" style={{textAlign:'center', color: '#64748b'}}>Modulo en construcción de conexión a BD</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- PANTALLA DE LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="nova-login-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
        <div className="shooting-star star-1"></div><div className="shooting-star star-2"></div>
        <div className="nova-card nova-animate-enter" style={{ display: 'flex', width: '900px', height: '520px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', zIndex: 10, border: 'none' }}>
          
          <div style={{ flex: 1, position: 'relative', background: 'linear-gradient(135deg, var(--nova-navy-light) 0%, var(--nova-navy-dark) 100%)', color: 'white', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
            <div className="abstract-shape shape-1" style={{ width: '320px', height: '40px', background: 'var(--nova-gold)', top: '62%', left: '-10%' }} />
            <div className="abstract-shape shape-2" style={{ width: '480px', height: '60px', background: 'var(--nova-green)', top: '75%', left: '-5%' }} />
            <div className="abstract-shape shape-3" style={{ width: '220px', height: '30px', background: 'var(--nova-gold)', top: '88%', left: '35%' }} />
            <div className="abstract-shape shape-1" style={{ width: '180px', height: '15px', background: 'white', top: '55%', left: '55%', opacity: 0.15 }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <img src="/logo-mercadeo.png" alt="Reval Multipagas" style={{ height: '50px', objectFit: 'contain', objectPosition: 'left', marginBottom: '40px' }} />
              <h1 style={{ fontSize: '42px', fontWeight: '900', lineHeight: '1.1', marginBottom: '16px', fontFamily: 'Outfit', color: '#FFFFFF', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>Ecosistema<br/>Evolutivo.</h1>
              <p style={{ fontSize: '15px', color: '#E2E8F0', lineHeight: '1.6', fontWeight: '500', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Infraestructura tecnológica centralizada. Control de acceso, gobernanza de identidades y despliegue continuo.</p>
            </div>
          </div>

          <div style={{ flex: '0 0 420px', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
            <div style={{ width: '100%', maxWidth: '280px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--nova-navy)', marginBottom: '32px', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>Ingreso de Usuario</h2>
              
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
                {error && <div className="nova-animate-enter" style={{ padding: '10px', background: '#FEF2F2', color: 'var(--status-danger)', borderRadius: '8px', fontSize: '11px', fontWeight: '600', textAlign: 'center', marginBottom: '16px' }}>{error}</div>}
                
                <div className="nova-pill-input-wrapper">
                  <div className="nova-pill-icon"><IcoUser /></div>
                  <input type="text" className="nova-pill-input" placeholder="Usuario de red (Ej. BTAUTIVA)" value={usuario} onChange={e => setUsuario(e.target.value.toUpperCase())} required />
                </div>
                
                <div className="nova-pill-input-wrapper">
                  <div className="nova-pill-icon"><IcoLock /></div>
                  <input type="password" className="nova-pill-input" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>

                <div onClick={simulateCaptcha} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0 24px 0', cursor: 'pointer' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: captchaVerified ? 'none' : '2px solid #CBD5E1', background: captchaVerified ? 'var(--nova-navy)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {captchaLoading && <div style={{ width: '10px', height: '10px', border: '2px solid #CBD5E1', borderTopColor: 'var(--nova-navy)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                    {captchaVerified && <IcoCheck />}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Confirmar identidad humana</span>
                </div>

                <button type="submit" className="nova-btn-pill" disabled={loading || !captchaVerified}>{loading ? 'Autorizando...' : 'Login'}</button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="nova-recaptcha-badge">
          <div className="recaptcha-icon"><IcoRecaptcha /></div><span className="recaptcha-text">Protegido por <strong>reCAPTCHA</strong></span>
        </div>
      </div>
    );
  }

  // --- LAYOUT DEL SISTEMA LOGUEADO ---
  const isAdmin = userData.rolGlobal === 'Administrador';
  const navItems = [
    { id: 'dashboard', label: 'Ecosistema', icon: <IcoDashboard />, adminOnly: false },
    { id: 'addApp', label: 'Desplegar App', icon: <IcoAdd />, adminOnly: true },
    { id: 'users', label: 'Identidades', icon: <IcoUsers />, adminOnly: true }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--surface-bg)', overflow: 'hidden', position: 'relative' }}>
      
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, transform: isNavVisible ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.4s var(--ease-spring)' }}>
        <header className="nova-glass" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '28px', height: '28px', background: 'var(--nova-navy)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '14px' }}>N</div><span style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '1px', color: 'var(--nova-navy)' }}>NOVA</span></div>
            <nav style={{ display: 'flex', gap: '8px' }}>
              {navItems.filter(item => !item.adminOnly || isAdmin).map(item => (
                <button key={item.id} onClick={() => changeInternalView(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: currentView === item.id && activeAppId === null ? 'var(--nova-navy)' : 'transparent', color: currentView === item.id && activeAppId === null ? 'white' : 'var(--text-muted)' }}>
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}><p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--nova-navy)' }}>{userData.usuario}</p><p style={{ margin: 0, fontSize: '10px', color: 'var(--nova-green)', textTransform: 'uppercase', fontWeight: '700' }}>{userData.rolGlobal}</p></div>
            <button className="nova-btn" style={{ padding: '8px', color: 'var(--text-muted)' }} onClick={() => {setIsLoggedIn(false); setOpenApps([]); setActiveAppId(null);}}><IcoLogout /></button>
          </div>
        </header>
      </div>

      <button onClick={() => setIsNavVisible(!isNavVisible)} style={{ position: 'absolute', top: isNavVisible ? '64px' : '0', left: '50%', transform: 'translateX(-50%)', background: 'var(--surface-card)', border: '1px solid var(--border-light)', borderTop: 'none', padding: '4px 16px', borderRadius: '0 0 12px 12px', cursor: 'pointer', zIndex: 90, color: 'var(--text-muted)', boxShadow: 'var(--shadow-md)', transition: 'top 0.4s var(--ease-spring)' }}>
        {isNavVisible ? <IcoChevronUp /> : <IcoChevronDown />}
      </button>

      <main style={{ position: 'absolute', top: isNavVisible ? '64px' : '0', bottom: 0, left: 0, right: 0, transition: 'top 0.4s var(--ease-spring)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', opacity: activeAppId === null ? 1 : 0, pointerEvents: activeAppId === null ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px', paddingBottom: '120px' }}>
            <h1 className="nova-animate-enter" style={{ fontSize: '24px', color: 'var(--nova-navy)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {currentView === 'dashboard' && <><IcoDashboard /> Portafolio de Aplicativos</>}
              {currentView === 'addApp' && <><IcoAdd /> Despliegue de Sistemas</>}
              {currentView === 'users' && <><IcoUsers /> Gobernanza de Identidades</>}
            </h1>
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'addApp' && renderAddApp()}
            {currentView === 'users' && renderUsers()}
          </div>
        </div>

        {openApps.map(app => (
          <div key={app.id} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: activeAppId === app.id ? 1 : 0, pointerEvents: activeAppId === app.id ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
            <iframe src={`${app.url}?usuario=${userData.usuario}&rol=${userData.roles?.generico || 'Generico'}`} style={{ width: '100%', height: '100%', border: 'none', background: 'white' }} title={app.nombre} />
          </div>
        ))}

        {openApps.length > 0 && (
          <>
            <div className="nova-nav-arrow left" onClick={() => cycleApp('prev')} title="Vista Anterior"><IcoLeft /></div>
            <div className="nova-nav-arrow right" onClick={() => cycleApp('next')} title="Siguiente Vista"><IcoRight /></div>
          </>
        )}
      </main>

      {openApps.length > 0 && (
        <div className="nova-dock-container">
          <button className={`nova-dock-item ${activeAppId === null ? 'active' : ''}`} onClick={() => { setActiveAppId(null); setIsNavVisible(true); }} title="Panel de Control"><IcoDashboard /></button>
          <div className="nova-dock-divider"></div>
          {openApps.map(app => (
            <button key={app.id} className={`nova-dock-item ${activeAppId === app.id ? 'active' : ''}`} onClick={() => { setActiveAppId(app.id); setIsNavVisible(false); }} title={app.nombre}>
              <IcoApp />
              <div className="nova-dock-close" onClick={(e) => closeApp(e, app.id)} title="Cerrar Aplicativo"><IcoX /></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}