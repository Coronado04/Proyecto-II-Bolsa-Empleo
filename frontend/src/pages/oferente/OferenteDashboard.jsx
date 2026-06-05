import { useEffect, useState } from 'react';
import { getDashboard } from "../../services/oferenteService";

export default function OferenteDashboard({ onNavegar }) {
    const [datos, setDatos] = useState(null);

    useEffect(() => { getDashboard().then(setDatos).catch(console.error); }, []);

    return (
        <main>
            <h1>Oferente - Dashboard</h1>
            {datos && <p>Bienvenido, <strong>{datos.nombre} {datos.primerApellido}</strong></p>}
            <p>Administrá tus habilidades y tu CV.</p>
            <button className="btn" onClick={() => onNavegar('mis-habilidades')}>Mis habilidades</button>
            <button className="btn" onClick={() => onNavegar('mi-cv')} style={{marginLeft:'8px'}}>Mi CV</button>
        </main>
    );
}