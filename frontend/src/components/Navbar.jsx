import logoImg from '../assets/logo.png';

export default function Navbar({ pagina, onNavegar }) {
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
          <button onClick={() => onNavegar('buscar')}>Buscar puestos</button>
          <button onClick={() => onNavegar('empresa')}>Registro Empresa</button>
          <button onClick={() => onNavegar('oferente')}>Registro Oferente</button>
          <button className="nav-login" onClick={() => onNavegar('login')}>Login</button>
        </nav>
      </div>
    </header>
  );
}
