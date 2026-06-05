import { useState, useEffect, useRef } from 'react';
import { getMisPuestos, publicarPuesto, desactivarPuesto, getCaracteristicas } from '../../services/empresaService';

// Fuera del componente para evitar problemas de hoisting/ESLint
function aplanar(raices, nivel = 0) {
    const result = [];
    for (const c of raices) {
        result.push({ id: c.id, nombre: '\u00a0\u00a0'.repeat(nivel) + c.nombre });
        if (c.hijos && c.hijos.length > 0) {
            result.push(...aplanar(c.hijos, nivel + 1));
        }
    }
    return result;
}

// ── Vista: Dashboard principal ────────────────────────────────
function DashboardHome({ onNavigate }) {
    return (
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🏢 Panel de Empresa</h2>
            <p style={styles.subtitle}>Desde aquí podés administrar tus puestos y buscar candidatos.</p>
            <div style={styles.btnRow}>
                <button style={styles.btnPrimary} onClick={() => onNavigate('mis-puestos')}>
                    Ver mis puestos
                </button>
                <button style={styles.btnPrimary} onClick={() => onNavigate('publicar-puesto')}>
                    Publicar nuevo puesto
                </button>
            </div>
        </div>
    );
}

// ── Vista: Mis Puestos ────────────────────────────────────────
function MisPuestos({ onNavigate }) {
    const [puestos, setPuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');
    const [msg, setMsg]         = useState('');

    const cargarRef = useRef(null);
    cargarRef.current = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getMisPuestos();
            setPuestos(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarRef.current();
    }, []);

    const handleDesactivar = async (id) => {
        if (!window.confirm('¿Desactivar este puesto?')) return;
        try {
            await desactivarPuesto(id);
            setMsg('Puesto desactivado correctamente.');
            cargarRef.current();
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div style={styles.section}>
            <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Mis puestos</h2>
                <button style={styles.btnPrimary} onClick={() => onNavigate('publicar-puesto')}>
                    Publicar puesto
                </button>
            </div>

            {msg   && <p style={styles.msgOk}>{msg}</p>}
            {error && <p style={styles.msgErr}>{error}</p>}

            {loading ? (
                <p style={styles.loading}>Cargando...</p>
            ) : puestos.length === 0 ? (
                <p style={styles.empty}>No tenés puestos publicados aún.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                    <tr>
                        {['ID','Descripción','Salario','Tipo','Activo','Acciones'].map(h => (
                            <th key={h} style={styles.th}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {puestos.map((p, i) => (
                        <tr key={p.id} style={i % 2 === 0 ? styles.trEven : {}}>
                            <td style={styles.td}>{p.id}</td>
                            <td style={styles.td}>{p.descripcion}</td>
                            <td style={styles.td}>{p.salario ?? '—'}</td>
                            <td style={styles.td}>{p.tipo}</td>
                            <td style={styles.td}>{p.activo ? 'Sí' : 'No'}</td>
                            <td style={styles.td}>
                                {p.activo && (
                                    <button
                                        style={styles.btnDanger}
                                        onClick={() => handleDesactivar(p.id)}
                                    >
                                        Desactivar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// ── Vista: Publicar Puesto ────────────────────────────────────
function PublicarPuesto({ onNavigate }) {
    const [descripcion, setDescripcion] = useState('');
    const [salario, setSalario]         = useState('');
    const [tipo, setTipo]               = useState('PUBLICO');
    const [filas, setFilas]             = useState([{ caracteristicaId: '', nivelDeseado: 1 }]);
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [error, setError]   = useState('');
    const [exito, setExito]   = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCaracteristicas()
            .then(data => setCaracteristicas(aplanar(data)))
            .catch(() => setError('No se pudieron cargar las características.'));
    }, []);

    const agregarFila = () => {
        setFilas([...filas, { caracteristicaId: '', nivelDeseado: 1 }]);
    };

    const quitarFila = (i) => {
        setFilas(filas.filter((_, idx) => idx !== i));
    };

    const actualizarFila = (i, campo, valor) => {
        const copia = [...filas];
        copia[i] = { ...copia[i], [campo]: valor };
        setFilas(copia);
    };

    const handlePublicar = async () => {
        setError('');
        setExito('');
        if (!descripcion.trim()) {
            setError('La descripción es obligatoria.');
            return;
        }

        const caract = filas
            .filter(f => f.caracteristicaId !== '')
            .map(f => ({
                caracteristicaId: parseInt(f.caracteristicaId),
                nivelDeseado: parseInt(f.nivelDeseado)
            }));

        setLoading(true);
        try {
            await publicarPuesto({
                descripcion,
                salario: salario !== '' ? parseFloat(salario) : null,
                tipo,
                caracteristicas: caract
            });
            setExito('¡Puesto publicado correctamente!');
            // Resetear formulario
            setDescripcion('');
            setSalario('');
            setTipo('PUBLICO');
            setFilas([{ caracteristicaId: '', nivelDeseado: 1 }]);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.formCard}>
            <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>Publicar nuevo puesto</h2>

            {error && <p style={styles.msgErr}>{error}</p>}
            {exito && <p style={styles.msgOk}>{exito}</p>}

            <label style={styles.label}>Descripción del puesto</label>
            <textarea
                style={styles.textarea}
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                rows={4}
            />

            <label style={styles.label}>Salario ofrecido</label>
            <input
                style={styles.input}
                type="number"
                value={salario}
                onChange={e => setSalario(e.target.value)}
                placeholder="Ej: 1500"
            />

            <label style={styles.label}>Tipo de publicación</label>
            <select style={styles.input} value={tipo} onChange={e => setTipo(e.target.value)}>
                <option value="PUBLICO">Público</option>
                <option value="PRIVADO">Privado</option>
            </select>

            <h3 style={{ marginTop: '1.5em', marginBottom: '0.5em', fontSize: '1em' }}>
                Características requeridas
            </h3>
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.th}>Característica</th>
                    <th style={styles.th}>Nivel (1-5)</th>
                    <th style={styles.th}></th>
                </tr>
                </thead>
                <tbody>
                {filas.map((fila, i) => (
                    <tr key={i}>
                        <td style={styles.td}>
                            <select
                                style={{ ...styles.input, margin: 0 }}
                                value={fila.caracteristicaId}
                                onChange={e => actualizarFila(i, 'caracteristicaId', e.target.value)}
                            >
                                <option value="">-- Seleccionar --</option>
                                {caracteristicas.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </td>
                        <td style={styles.td}>
                            <input
                                style={{ ...styles.input, margin: 0, width: '60px' }}
                                type="number"
                                min={1} max={5}
                                value={fila.nivelDeseado}
                                onChange={e => actualizarFila(i, 'nivelDeseado', e.target.value)}
                            />
                        </td>
                        <td style={styles.td}>
                            {filas.length > 1 && (
                                <button style={styles.btnSmallDanger} onClick={() => quitarFila(i)}>
                                    ✕
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button style={{ ...styles.btnSecondary, marginTop: '0.8em' }} onClick={agregarFila}>
                + Agregar característica
            </button>

            <div style={styles.btnRow}>
                <button style={styles.btnPrimary} onClick={handlePublicar} disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar'}
                </button>
                <button style={styles.btnSecondary} onClick={() => onNavigate('mis-puestos')}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}

// ── Componente principal ──────────────────────────────────────
export default function EmpresaDashboard({ vistaInicial }) {
    const [vista, setVista] = useState(() => vistaInicial || 'dashboard');

    // Sincronizar si el prop cambia (ej: clic en navbar)
    const prevVistaInicial = useRef(vistaInicial);
    if (vistaInicial && vistaInicial !== prevVistaInicial.current) {
        prevVistaInicial.current = vistaInicial;
        setVista(vistaInicial);
    }

    return (
        <div style={styles.wrapper}>
            {vista === 'dashboard'      && <DashboardHome    onNavigate={setVista} />}
            {vista === 'mis-puestos'    && <MisPuestos       onNavigate={setVista} />}
            {vista === 'publicar-puesto'&& <PublicarPuesto   onNavigate={setVista} />}
        </div>
    );
}

// ── Estilos inline (consistentes con el resto del proyecto) ───
const styles = {
    wrapper: {
        padding: '2em',
        maxWidth: '900px',
        margin: '0 auto',
    },
    section: {
        background: '#fff',
        borderRadius: '6px',
        padding: '1.5em',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1em',
    },
    sectionTitle: {
        fontSize: '1.4em',
        fontWeight: 700,
        margin: '0 0 0.3em 0',
    },
    subtitle: {
        color: '#555',
        marginBottom: '1.2em',
    },
    btnRow: {
        display: 'flex',
        gap: '1em',
        marginTop: '1em',
        flexWrap: 'wrap',
    },
    btnPrimary: {
        background: '#1a73e8',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '0.5em 1.2em',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.95em',
    },
    btnSecondary: {
        background: '#e0e0e0',
        color: '#333',
        border: 'none',
        borderRadius: '4px',
        padding: '0.5em 1.2em',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.95em',
    },
    btnDanger: {
        background: '#d32f2f',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '0.3em 0.8em',
        cursor: 'pointer',
        fontSize: '0.85em',
    },
    btnSmallDanger: {
        background: '#d32f2f',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '0.2em 0.6em',
        cursor: 'pointer',
        fontSize: '0.8em',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '0.5em',
        fontSize: '0.93em',
    },
    th: {
        textAlign: 'left',
        padding: '0.6em 0.8em',
        borderBottom: '2px solid #e0e0e0',
        fontWeight: 600,
        color: '#444',
        background: '#f5f5f5',
    },
    td: {
        padding: '0.6em 0.8em',
        borderBottom: '1px solid #eee',
        verticalAlign: 'middle',
    },
    trEven: {
        background: '#fafafa',
    },
    formCard: {
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '2em',
        maxWidth: '600px',
        margin: '0 auto',
    },
    label: {
        display: 'block',
        marginBottom: '0.3em',
        marginTop: '1em',
        color: '#555',
        fontSize: '0.9em',
    },
    input: {
        width: '100%',
        padding: '0.5em',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '0.95em',
        boxSizing: 'border-box',
        marginBottom: '0.2em',
    },
    textarea: {
        width: '100%',
        padding: '0.5em',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '0.95em',
        boxSizing: 'border-box',
        resize: 'vertical',
    },
    msgOk: {
        color: '#2e7d32',
        background: '#e8f5e9',
        padding: '0.5em 1em',
        borderRadius: '4px',
        marginBottom: '0.5em',
    },
    msgErr: {
        color: '#c62828',
        background: '#ffebee',
        padding: '0.5em 1em',
        borderRadius: '4px',
        marginBottom: '0.5em',
    },
    loading: { color: '#888', fontStyle: 'italic' },
    empty:   { color: '#999', marginTop: '1em' },
};