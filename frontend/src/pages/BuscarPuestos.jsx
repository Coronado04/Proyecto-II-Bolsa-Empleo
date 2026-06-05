import { useEffect, useState } from 'react';
import ArbolCaracteristicas from '../components/ArbolCaracteristicas';
import { buscarPuestos, getCaracteristicas } from '../services/publicoService';

// Recolecta todos los ids de un nodo y sus descendientes
function recolectarIds(nodos, seleccionados) {
    const ids = new Set();
    function recorrer(lista) {
        for (const n of lista) {
            if (seleccionados.has(n.id)) {
                ids.add(n.id);
                agregarTodosHijos(n);
            } else {
                if (n.hijos?.length > 0) recorrer(n.hijos);
            }
        }
    }
    function agregarTodosHijos(nodo) {
        if (!nodo.hijos) return;
        for (const h of nodo.hijos) {
            ids.add(h.id);
            agregarTodosHijos(h);
        }
    }
    recorrer(nodos);
    return [...ids];
}

export default function BuscarPuestos() {
    const [arbol,         setArbol]         = useState([]);
    const [seleccionados, setSeleccionados] = useState(new Set());
    const [resultados,    setResultados]    = useState([]);
    const [buscado,       setBuscado]       = useState(false);
    const [error,         setError]         = useState(null);

    useEffect(() => { getCaracteristicas().then(setArbol).catch(e => setError(e.message)); }, []);

    function toggle(id) {
        setSeleccionados(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    }

    function limpiar() { setSeleccionados(new Set()); setResultados([]); setBuscado(false); }

    async function handleBuscar() {
        try {
            // Expandir selección: si marcás un padre, busca también por sus hijos
            const ids = recolectarIds(arbol, seleccionados);
            const d = await buscarPuestos(ids);
            setResultados(d);
            setBuscado(true);
        } catch (e) { setError(e.message); }
    }

    return (
        <main>
            <h2>Buscar puestos por características</h2>
            {error && <p className="error">{error}</p>}
            <div className="dos-columnas">
                <div>
                    <div className="tree-check">
                        <ArbolCaracteristicas nodos={arbol} seleccionados={seleccionados} onToggle={toggle} />
                    </div>
                    <button className="btn" onClick={handleBuscar}>Buscar</button>
                    <button className="btn-secondary" onClick={limpiar}>Limpiar</button>
                </div>
                <div>
                    <h3>Resultados</h3>
                    {buscado && resultados.length === 0 && <p>No se encontraron puestos.</p>}
                    {resultados.map(p => (
                        <div key={p.id} className="puesto-card" style={{ width: 'auto', marginBottom: '12px' }}>
                            <strong>{p.empresaNombre}</strong>
                            <p>{p.descripcion}</p>
                            <p>Salario: {p.salario}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
