import { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppContext, AppProvider } from './AppProvider';
import LoginModal from './components/LoginModal';
import './App.css';

// Páginas públicas
import Home from './pages/BuscaPuesto/Home.jsx';
import BuscarPuestos from './pages/BuscaPuesto/BuscarPuestos.jsx';
import RegistroEmpresa from './pages/BuscaPuesto/RegistroEmpresa.jsx';
import RegistroOferente from './pages/BuscaPuesto/RegistroOferente.jsx';

// Páginas protegidas - Admin
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import EmpresasPendientes from './pages/admin/EmpresasPendientes.jsx';
import OferentesPendientes from './pages/admin/OferentesPendientes.jsx';
import Caracteristicas from './pages/admin/Caracteristicas.jsx';
import Reportes from './pages/admin/Reportes.jsx';

// Páginas protegidas - Empresa
import EmpresaDashboard from './pages/empresa/EmpresaDashboard.jsx';

// Páginas protegidas - Oferente
import OferenteDashboard from './pages/oferente/OferenteDashboard.jsx';

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <MainApp />
            </BrowserRouter>
        </AppProvider>
    );
}

function MainApp() {
    const { user, setUser, setToken } = useContext(AppContext);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    // ── FUNCIÓN PARA DECODIFICAR JWT (debe ir primero)
    const decodificarToken = (token) => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('JWT inválido');
            }
            const payloadEncoded = parts[1];
            const payload = JSON.parse(atob(payloadEncoded));
            return {
                id: payload.id,
                correo: payload.correo,
                rol: payload.rol
            };
        } catch (error) {
            console.error('Error decodificando JWT:', error);
            return null;
        }
    };

    // ── INICIALIZAR USUARIO AL CARGAR LA PÁGINA
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken && !user) {
            const userData = decodificarToken(storedToken);
            if (userData) {
                setUser(userData);
                setToken(storedToken);
            } else {
                localStorage.removeItem('token');
            }
        }
    }, [user, setUser, setToken]);

    // ── MANEJAR LOGIN EXITOSO
    const handleLoginSuccess = (token) => {
        const userData = decodificarToken(token);
        if (userData) {
            setUser(userData);
            setToken(token);

            // Redirigir según el rol
            switch (userData.rol) {
                case 'ADM':
                    navigate('/admin/dashboard');
                    break;
                case 'EMP':
                    navigate('/empresa/dashboard');
                    break;
                case 'OFE':
                    navigate('/oferente/dashboard');
                    break;
                default:
                    navigate('/');
            }
        }
    };

    // ── MANEJAR LOGOUT
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setLoginModalOpen(false);
        navigate('/');
    };

    // ── FUNCIÓN PARA IR AL HOME
    const goToHome = () => {
        navigate('/');
    };

    return (
        <div className="app-container">
            <Header
                user={user}
                onLoginClick={() => setLoginModalOpen(true)}
                onLogout={handleLogout}
                onHomeClick={goToHome}
            />

            <main className="main">
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/buscar" element={<BuscarPuestos />} />
                    <Route path="/registro-empresa" element={<RegistroEmpresa />} />
                    <Route path="/registro-oferente" element={<RegistroOferente />} />

                    {/* Rutas protegidas - Admin */}
                    <Route
                        path="/admin/dashboard"
                        element={user?.rol === 'ADM' ? <AdminDashboard /> : <Home />}
                    />
                    <Route
                        path="/admin/empresas/pendientes"
                        element={user?.rol === 'ADM' ? <EmpresasPendientes /> : <Home />}
                    />
                    <Route
                        path="/admin/oferentes/pendientes"
                        element={user?.rol === 'ADM' ? <OferentesPendientes /> : <Home />}
                    />
                    <Route
                        path="/admin/caracteristicas"
                        element={user?.rol === 'ADM' ? <Caracteristicas /> : <Home />}
                    />
                    <Route
                        path="/admin/reportes"
                        element={user?.rol === 'ADM' ? <Reportes /> : <Home />}
                    />

                    {/* Rutas protegidas - Empresa */}
                    <Route
                        path="/empresa/dashboard"
                        element={user?.rol === 'EMP' ? <EmpresaDashboard /> : <Home />}
                    />

                    {/* Rutas protegidas - Oferente */}
                    <Route
                        path="/oferente/dashboard"
                        element={user?.rol === 'OFE' ? <OferenteDashboard /> : <Home />}
                    />

                    {/* Ruta por defecto */}
                    <Route path="*" element={<Home />} />
                </Routes>
            </main>

            <Footer />

            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </div>
    );
}

function Header({ user, onLoginClick, onLogout, onHomeClick }) {
    return (
        <header className="header">
            <div className="header-logo" onClick={onHomeClick} style={{ cursor: 'pointer' }}>
                <span>🎯</span>
                <span>BolsaEmpleo</span>
            </div>

            {!user ? (
                // NAV PÚBLICO
                <nav className="header-nav">
                    <a href="/">Buscar puestos</a>
                    <a href="/registro-empresa">Registro Empresa</a>
                    <a href="/registro-oferente">Registro Oferente</a>
                    <button className="login-btn" onClick={onLoginClick}>
                        Login
                    </button>
                </nav>
            ) : user.rol === 'ADM' ? (
                // NAV ADMIN
                <>
                    <nav className="header-nav">
                        <a href="/admin/dashboard">Dashboard</a>
                        <a href="/admin/empresas/pendientes">Empresas pendientes</a>
                        <a href="/admin/oferentes/pendientes">Oferentes pendientes</a>
                        <a href="/admin/caracteristicas">Características</a>
                        <a href="/admin/reportes">Reportes</a>
                    </nav>
                    <div className="header-user">
                        <span>{user.correo} ({user.rol})</span>
                        <button className="logout-btn" onClick={onLogout}>
                            Salir
                        </button>
                    </div>
                </>
            ) : user.rol === 'EMP' ? (
                // NAV EMPRESA
                <>
                    <nav className="header-nav">
                        <a href="/empresa/dashboard">Dashboard</a>
                        <a href="/empresa/puestos">Mis puestos</a>
                        <a href="/empresa/puestos/nuevo">Publicar puesto</a>
                    </nav>
                    <div className="header-user">
                        <span>{user.correo} ({user.rol})</span>
                        <button className="logout-btn" onClick={onLogout}>
                            Salir
                        </button>
                    </div>
                </>
            ) : user.rol === 'OFE' ? (
                // NAV OFERENTE
                <>
                    <nav className="header-nav">
                        <a href="/oferente/dashboard">Dashboard</a>
                        <a href="/oferente/habilidades">Mis habilidades</a>
                        <a href="/oferente/cv">Mi CV</a>
                    </nav>
                    <div className="header-user">
                        <span>{user.correo} ({user.rol})</span>
                        <button className="logout-btn" onClick={onLogout}>
                            Salir
                        </button>
                    </div>
                </>
            ) : null}
        </header>
    );
}

function Footer() {
    return (
        <footer className="footer">
            <div>
                <strong>Bolsa de Empleo</strong><br />
                <small>Total Soft Inc.</small>
            </div>
            <div>
                <small>Contacto: info@bolsaempleo.local</small><br />
                <small>Créditos: Equipo Desarrollador</small>
            </div>
        </footer>
    );
}

export default App;