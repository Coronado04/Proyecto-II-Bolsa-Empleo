import { Link } from "react-router-dom";
import logo from "./assets/logo.png";

function Header() {

    return (

        <header>

            <div className="header-inner">

                <div className="logo-seccion">

                    <Link to="/" className="logo-link">

                        <img
                            src={logo}
                            alt="Logo"
                            className="logo-img"
                        />

                        <span className="titulo">
                            BolsaEmpleo
                        </span>

                    </Link>

                </div>

                <nav>

                    <Link to="/">
                        Buscar puestos
                    </Link>

                    <a href="#">
                        Registro Empresa
                    </a>

                    <a href="#">
                        Registro Oferente
                    </a>

                    <a href="#">
                        Login
                    </a>

                </nav>

            </div>

        </header>
    );
}

function Footer() {

    return (

        <footer className="Footer">

            <div className="footer-inner">

                <div>

                    <div className="MiniTitulo">
                        Bolsa de Empleo
                    </div>

                    <div className="SubMiniTitulo">
                        Total Soft Inc.
                    </div>

                </div>

                <div className="derecha">

                    Contacto: info@bolsaempleo.local
                    <br />

                    Créditos: Equipo de desarrollo

                </div>

            </div>

        </footer>
    );
}

export { Header, Footer };