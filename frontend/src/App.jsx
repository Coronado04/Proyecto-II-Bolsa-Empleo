import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BuscarPuestos from './pages/BuscarPuestos';
import RegistroEmpresa from './pages/RegistroEmpresa';
import RegistroOferente from './pages/RegistroOferente';
import LoginModal from './components/LoginModal';
import { logout, getRol, getCorreo, isLoggedIn } from './services/authService';
import './App.css';

export default function App() {
  const [pagina,     setPagina]     = useState('home');
  const [modalLogin, setModalLogin] = useState(false);
  const [sesion,     setSesion]     = useState(
    isLoggedIn() ? { rol: getRol(), correo: getCorreo() } : null
  );

  function handleLoginSuccess(data) {
    setSesion({ rol: data.rol, correo: data.correo });
    setModalLogin(false);
    if (data.rol === 'ADM')      setPagina('admin-dashboard');
    else if (data.rol === 'EMP') setPagina('empresa-dashboard');
    else if (data.rol === 'OFE') setPagina('oferente-dashboard');
  }

  function handleLogout() { logout(); setSesion(null); setPagina('home'); }

  function renderPagina() {
    switch (pagina) {
      case 'home':              return <Home />;
      case 'buscar':            return <BuscarPuestos />;
      case 'registro-empresa':  return <RegistroEmpresa onNavegar={setPagina} />;
      case 'registro-oferente': return <RegistroOferente onNavegar={setPagina} />;
      default:
        return (
          <main>
            <h2>Sección en construcción</h2>
            <p style={{color:'#777', marginTop:'8px'}}>
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
