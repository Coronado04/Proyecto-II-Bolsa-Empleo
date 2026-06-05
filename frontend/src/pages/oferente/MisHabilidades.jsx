import { useEffect, useState } from 'react';
import { getHabilidades, agregarHabilidad, eliminarHabilidad, getCaracteristicas } from "../../services/oferenteService";

function aplanarCaracteristicas(nodos, nivel = 0) {
    const resultado = [];
    for (const n of nodos) {
        resultado.push({ id: n.id, nombre: n.nombre, nivel, tieneHijos: n.hijos?.length > 0 });
        if (n.hijos?.length > 0) resultado.push(...aplanarCaracteristicas(n.hijos, nivel + 1));
    }
    return resultado;
}

export default function MisHabilidades({ onNavegar }) {
    const [habilidades,      setHabilidades]      = useState([]);
    const [caracteristicas,  setCaracteristicas]  = useState([]);
    const [seleccionada,     setSeleccionada]     = useState('');
    const [nivelInput,       setNivelInput]       = useState(1);
    const [error,            setError]            = useState('');
    const [exito,            setExito]            = useState('');

    useEffect(() => {
        getHabilidades().then(setHabilidades).catch(console.error);
        getCaracteristicas().then(arbol =>
            setCaracteristicas(aplanarCaracteristicas(arbol))
        ).catch(console.error);
    }, []);

    async function handleAgregar() {
        setError(''); setExito('');
        if (!seleccionada) return setError('Seleccioná una característica');
        try {
            await agregarHabilidad(parseInt(seleccionada), nivelInput);
            setExito('Habilidad guardada');
            setSeleccionada(''); setNivelInput(1);
            const data = await getHabilidades(); setHabilidades(data);
        } catch(e) { setError(e.message); }
    }

    async function handleEliminar(cid) {
        try {
            await eliminarHabilidad(cid);
            setHabilidades(prev => prev.filter(h => h.caracteristicaId !== cid));
        } catch(e) { setError(e.message); }
    }

    return (
        <main>
            <h2>Mis habilidades</h2>
            {error && <p className="error">{error}</p>}
            {exito && <p className="success">{exito}</p>}

            <div className="dos-columnas">
                <div>
                    <table className="tabla">
                        <thead><tr><th>Característica</th><th>Nivel</th><th></th></tr></thead>
                        <tbody>
                        {habilidades.length === 0
                            ? <tr><td colSpan="3">Aún no tenés habilidades registradas.</td></tr>
                            : habilidades.map(h => (
                                <tr key={h.caracteristicaId}>
                                    <td>{h.caracteristicaNombre}</td>
                                    <td>{h.nivel}</td>
                                    <td>
                                        <button className="btn-sm btn-danger"
                                                onClick={() => handleEliminar(h.caracteristicaId)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>

                <div className="form-box">
                    <h3>Agregar habilidad</h3>
                    <div className="field-group">
                        <label>Característica</label>
                        <select value={seleccionada} onChange={e => setSeleccionada(e.target.value)}>
                            <option value="">-- Seleccionar --</option>
                            {caracteristicas.map(c => (
                                <option key={c.id} value={c.id} disabled={c.tieneHijos}
                                        style={{paddingLeft: `${c.nivel * 12}px`,
                                            color: c.tieneHijos ? '#999' : '#333'}}>
                                    {c.nivel > 0 ? '  '.repeat(c.nivel) : ''}{c.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="field-group">
                        <label>Nivel (1-5)</label>
                        <input type="number" min="1" max="5" value={nivelInput}
                               onChange={e => setNivelInput(parseInt(e.target.value))} />
                    </div>
                    <button className="btn" onClick={handleAgregar}>Agregar</button>
                </div>
            </div>

            <button className="btn-secondary" style={{marginTop:'16px'}}
                    onClick={() => onNavegar('oferente-dashboard')}>Volver</button>
        </main>
    );
}