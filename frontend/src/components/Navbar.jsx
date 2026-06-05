import logoImg from '../assets/logo.png';
export default function Navbar({ onNavegar, sesion, onLoginClick, onLogout }) {
  return (
    <header>
      <div className="header-inner">
        <div className="logo-seccion">
          <a className="logo-link" onClick={() => onNavegar('home')} style={{cursor:'pointer'}}>
            <img src={logoImg} alt="Logo" className="logo-img" />
            <span className="titulo">BolsaEmpleo</span>
          </a>
        </div>
        <nav>
          {!sesion && <>
            <button onClick={() => onNavegar('buscar')}>Buscar puestos</button>
            <button onClick={() => onNavegar('registro-empresa')}>Registro Empresa</button>
            <button onClick={() => onNavegar('registro-oferente')}>Registro Oferente</button>
            <button className="nav-login" onClick={onLoginClick}>Login</button>
          </>}
          {sesion?.rol === 'ADM' && <>
            <button onClick={() => onNavegar('admin-dashboard')}>Dashboard</button>
            <button onClick={() => onNavegar('empresas-pendientes')}>Empresas pendientes</button>
            <button onClick={() => onNavegar('oferentes-pendientes')}>Oferentes pendientes</button>
            <button onClick={() => onNavegar('caracteristicas')}>Características</button>
            <span style={{color:'white',fontSize:'14px'}}>{sesion.correo}</span>
            <button className="nav-login" onClick={onLogout}>Salir</button>
          </>}
          {sesion?.rol === 'EMP' && <>
            <button onClick={() => onNavegar('empresa-dashboard')}>Dashboard</button>
            <button onClick={() => onNavegar('mis-puestos')}>Mis puestos</button>
            <button onClick={() => onNavegar('publicar-puesto')}>Publicar puesto</button>
            <span style={{color:'white',fontSize:'14px'}}>{sesion.correo}</span>
            <button className="nav-login" onClick={onLogout}>Salir</button>
          </>}
          {sesion?.rol === 'OFE' && <>
            <button onClick={() => onNavegar('oferente-dashboard')}>Dashboard</button>
            <button onClick={() => onNavegar('mis-habilidades')}>Mis habilidades</button>
            <button onClick={() => onNavegar('mi-cv')}>Mi CV</button>
            <span style={{color:'white',fontSize:'14px'}}>{sesion.correo}</span>
            <button className="nav-login" onClick={onLogout}>Salir</button>
          </>}
        </nav>
      </div>
    </header>
  );
}
