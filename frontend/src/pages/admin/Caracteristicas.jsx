import { useEffect, useState } from 'react';
import { getCaracteristicas, crearCaracteristica } from '../../services/adminService';

export default function Caracteristicas({ onNavegar }) {
    const [hijos,  setHijos]  = useState([]);
    const [actual, setActual] = useState(null);
    const [ruta,   setRuta]   = useState([]);
    const [nombre, setNombre] = useState('');
    const [error,  setError]  = useState('');
    const [exito,  setExito]  = useState('');

    useEffect(() => { cargar(null); }, []);

    async function cargar(padreId) {
        setError('');
        try {
            const data = await getCaracteristicas(padreId);
            if (padreId == null) {
                setActual(null);
                setHijos(data);
            } else {
                setActual(data.actual);
                setHijos(data.hijos);
            }
        } catch (e) { setError(e.message); }
    }

    function entrar(nodo) {
        setRuta(prev => [...prev, nodo]);
        cargar(nodo.id);
    }

    function irARuta(index) {
        if (index === -1) {
            setRuta([]);
            cargar(null);
        } else {
            const nodo = ruta[index];
            setRuta(prev => prev.slice(0, index + 1));
            cargar(nodo.id);
        }
    }

    async function handleCrear() {
        setError(''); setExito('');
        if (!nombre.trim()) return setError('El nombre es obligatorio');
        try {
            await crearCaracteristica(nombre.trim(), actual?.id ?? null);
            setExito('Característica creada');
            setNombre('');
            cargar(actual?.id ?? null);
        } catch (e) { setError(e.message); }
    }

    return (
        <main>
            <h2>Características</h2>

            <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => irARuta(-1)}>Raíces</span>
                {ruta.map((r, i) => (
                    <span key={r.id}>
            {' / '}
                        <span className="breadcrumb-link" onClick={() => irARuta(i)}>{r.nombre}</span>
          </span>
                ))}
            </div>

            {error && <p className="error">{error}</p>}
            {exito && <p className="success">{exito}</p>}

            <div className="dos-columnas" style={{ marginTop: '16px' }}>
                <div>
                    <p>{actual ? <>Subcategorías de: <strong>{actual.nombre}</strong></> : 'Categorías raíces'}</p>
                    {hijos.length === 0
                        ? <p style={{ color: '#999', marginTop: '8px' }}>Sin subcategorías.</p>
                        : hijos.map(h => (
                            <div key={h.id} className="tree-item-row">
                                <span>{h.nombre}</span>
                                <button className="btn-sm" onClick={() => entrar(h)}>Entrar</button>
                            </div>
                        ))
                    }
                </div>

                <div className="form-box">
                    <h3>Agregar característica</h3>
                    <div className="field-group">
                        <label>Nombre</label>
                        <input type="text" value={nombre}
                               onChange={e => setNombre(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && handleCrear()} />
                    </div>
                    {actual &&
                        <p style={{ fontSize: '13px', color: '#555', marginBottom: '8px' }}>
                            Se creará como hijo de: <strong>{actual.nombre}</strong>
                        </p>
                    }
                    <button className="btn" onClick={handleCrear}>Crear</button>
                </div>
            </div>

            <button className="btn-secondary" style={{ marginTop: '16px' }}
                    onClick={() => onNavegar('admin-dashboard')}>Volver al dashboard</button>
        </main>
    );
}