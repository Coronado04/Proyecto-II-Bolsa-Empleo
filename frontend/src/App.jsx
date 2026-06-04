import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/BuscaPuesto/Home.jsx';
import BuscarPuestos from './pages/BuscaPuesto/BuscarPuestos.jsx';
import RegistroEmpresa from './pages/BuscaPuesto/RegistroEmpresa.jsx';
import './App.css';
import RegistroOferente from "./pages/BuscaPuesto/RegistroOferente.jsx";

export default function App() {
    const [pagina, setPagina] = useState('home');

    function renderPagina() {
        switch (pagina) {
            case 'home':             return <Home />;
            case 'buscar':           return <BuscarPuestos />;
            case 'RegistroEmpresa':  return <RegistroEmpresa />;
            case 'RegistroOferente': return <RegistroOferente/>
            default:
                return (
                    <main style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
                        <h2>Sección en construcción</h2>
                        <p>Esta funcionalidad se implementará en próximos avances.</p>
                    </main>
                );
        }
    }

    return (
        <div className="app-shell">
            <Navbar pagina={pagina} onNavegar={setPagina} />
            {renderPagina()}
            <Footer />
        </div>
    );
}
