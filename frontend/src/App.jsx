import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BuscarPuestos from './pages/BuscarPuestos';
import RegistroEmpresa from './pages/RegistroEmpresa';
import RegistroOferente from './pages/RegistroOferente';
import LoginModal from './components/LoginModal';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmpresaDashboard from './pages/empresa/EmpresaDashboard';
import EmpresasPendientes from './pages/admin/EmpresasPendientes';
import OferentesPendientes from './pages/admin/OferentesPendientes';
import { logout, getRol, getCorreo, isLoggedIn } from './services/authService';
import './App.css';
import OferenteDashboard from './pages/oferente/OferenteDashboard.jsx';
import MisHabilidades from './pages/oferente/MisHabilidades';
import MiCV from './pages/oferente/MiCV';

export default function App() {
    const [pagina,     setPagina]     = useState('home');
    const [modalLogin, setModalLogin] = useState(false);
    const [sesion,     setSesion]     = useState(
        isLoggedIn() ? { rol: getRol(), correo: getCorreo() } : null
    );

    function handleLoginSuccess(data) {
        setSesion({ rol: data.rol, correo: data.correo });
        setModalLogin(false);
        if      (data.rol === 'ADM') setPagina('admin-dashboard');
        else if (data.rol === 'EMP') setPagina('empresa-dashboard');
        else if (data.rol === 'OFE') setPagina('oferente-dashboard');
    }

    function handleLogout() { logout(); setSesion(null); setPagina('home'); }

    function renderPagina() {
        switch (pagina) {
            // ── Público ──────────────────────────────────────────
            case 'home':              return <Home />;
            case 'buscar':            return <BuscarPuestos />;
            case 'registro-empresa':  return <RegistroEmpresa onNavegar={setPagina} />;
            case 'registro-oferente': return <RegistroOferente onNavegar={setPagina} />;

            // ── Admin ─────────────────────────────────────────────
            case 'admin-dashboard':        return <AdminDashboard onNavegar={setPagina} />;
            case 'empresas-pendientes':    return <EmpresasPendientes onNavegar={setPagina} />;
            case 'oferentes-pendientes':   return <OferentesPendientes onNavegar={setPagina} />;

            // ── Empresa ───────────────────────────────────────────
            case 'empresa-dashboard': return <EmpresaDashboard vistaInicial="dashboard" />;
            case 'mis-puestos':       return <EmpresaDashboard vistaInicial="mis-puestos" />;
            case 'publicar-puesto':   return <EmpresaDashboard vistaInicial="publicar-puesto" />;

            //Oferente
            case 'oferente-dashboard': return <OferenteDashboard onNavegar={setPagina} />;
            case 'mis-habilidades':    return <MisHabilidades onNavegar={setPagina} />;
            case 'mi-cv':              return <MiCV onNavegar={setPagina} />;



            // ── En construcción ───────────────────────────────────
            default:
                return (
                    <main>
                        <h2>Sección en construcción</h2>
                        <p style={{ color: '#777', marginTop: '8px' }}>
                            Esta funcionalidad se implementará en próximos avances.
                        </p>
                    </main>
                );
        }
    }

    return (
        <div className="app-shell">
            <Navbar pagina={pagina} onNavegar={setPagina} sesion={sesion}
                    onLoginClick={() => setModalLogin(true)} onLogout={handleLogout} />
            {renderPagina()}
            <Footer />
            {modalLogin && (
                <LoginModal onClose={() => setModalLogin(false)} onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );

}

