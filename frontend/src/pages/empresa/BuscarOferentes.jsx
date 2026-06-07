import { useEffect, useState } from 'react';
import ArbolCaracteristicas from '../../components/ArbolCaracteristicas';
import { buscarCandidatos, verCVCandidato } from '../../services/empresaService';
import { getCaracteristicas } from '../../services/oferenteService';

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

export default function BuscarOferentes() {
    const [arbol,         setArbol]         = useState([]);
    const [seleccionados, setSeleccionados] = useState(new Set());
    const [resultados,    setResultados]    = useState([]);
    const [buscado,       setBuscado]       = useState(false);
    const [detalle,       setDetalle]       = useState(null);
    const [error,         setError]         = useState(null);

    useEffect(() => {
        getCaracteristicas().then(setArbol).catch(e => setError(e.message));
    }, []);

    function toggle(id) {
        setSeleccionados(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    }

    function limpiar() {
        setSeleccionados(new Set());
        setResultados([]);
        setBuscado(false);
        setDetalle(null);
    }

    async function handleBuscar() {
        try {
            setDetalle(null);
            const ids = recolectarIds(arbol, seleccionados);
            const data = await buscarCandidatos(ids);
            setResultados(data);
            setBuscado(true);
        } catch (e) { setError(e.message); }
    }

    return (
        <main>
            <h2>Buscar oferentes por habilidades</h2>
            {error && <p className="error">{error}</p>}
            <div className="dos-columnas">
                <div>
                    <div className="tree-check">
                        <ArbolCaracteristicas
                            nodos={arbol}
                            seleccionados={seleccionados}
                            onToggle={toggle}
                        />
                    </div>
                    <button className="btn" onClick={handleBuscar}>Buscar</button>
                    <button className="btn-secondary" onClick={limpiar}>Limpiar</button>
                </div>
                <div>
                    <h3>Resultados</h3>
                    {buscado && resultados.length === 0 && <p>No se encontraron oferentes.</p>}
                    {resultados.map(c => (
                        <div key={c.id} className="puesto-card"
                             style={{ width: 'auto', marginBottom: '12px', cursor: 'pointer' }}
                             onClick={() => setDetalle(detalle?.id === c.id ? null : c)}>
                            <strong>{c.nombre} {c.primerApellido}</strong>
                            <p>{c.residencia}</p>
                        </div>
                    ))}

                    {detalle && (
                        <div className="puesto-card" style={{ width: 'auto', marginTop: '16px' }}>
                            <h4>{detalle.nombre} {detalle.primerApellido}</h4>
                            <p><strong>Nacionalidad:</strong> {detalle.nacionalidad}</p>
                            <p><strong>Teléfono:</strong> {detalle.telefono}</p>
                            <p><strong>Residencia:</strong> {detalle.residencia}</p>
                            <h5 style={{ marginTop: '8px' }}>Habilidades:</h5>
                            {detalle.habilidades?.length > 0
                                ? <ul>{detalle.habilidades.map((h, i) => (
                                    <li key={i}>{h.caracteristica} — nivel {h.nivel}</li>
                                ))}</ul>
                                : <p>Sin habilidades registradas.</p>
                            }
                            {detalle.tieneCurriculum
                                ? <button className="btn" style={{ marginTop: '8px' }}
                                          onClick={() => verCVCandidato(detalle.id)}>
                                    Ver CV
                                </button>
                                : <p style={{ marginTop: '8px', color: '#888' }}>Sin CV disponible.</p>
                            }
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}