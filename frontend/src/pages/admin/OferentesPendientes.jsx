import { useEffect, useState } from 'react';
import { getOferentesPendientes, aprobarUsuario } from '../../services/AdminService.js';

export default function OferentesPendientes({ onNavegar }) {
    const [pendientes, setPendientes] = useState([]);
    const [error, setError]           = useState(null);
    const [cargando, setCargando]     = useState(true);

    useEffect(() => {
        getOferentesPendientes()
            .then(setPendientes)
            .catch(e => setError(e.message))
            .finally(() => setCargando(false));
    }, []);

    async function handleAprobar(id) {
        try {
            await aprobarUsuario(id);
            setPendientes(prev => prev.filter(u => u.id !== id));
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <main>
            <h2>Oferentes pendientes</h2>

            {error    && <p className="error">{error}</p>}
            {cargando && <p>Cargando...</p>}

            {!cargando && (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
                    <thead>
                    <tr style={{ background: '#1f2a33', color: 'white' }}>
                        <th style={thStyle}>Usuario (correo)</th>
                        <th style={thStyle}>Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pendientes.length === 0 ? (
                        <tr>
                            <td colSpan={2} style={{ padding: '12px', textAlign: 'center', color: '#888' }}>
                                No hay oferentes pendientes.
                            </td>
                        </tr>
                    ) : (
                        pendientes.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={tdStyle}>{u.correo}</td>
                                <td style={tdStyle}>
                                    <button className="btn-sm" onClick={() => handleAprobar(u.id)}>
                                        Aprobar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}

            <button className="btn-secondary" style={{ marginTop: '16px' }} onClick={() => onNavegar('admin-dashboard')}>
                Volver
            </button>
        </main>
    );
}

const thStyle = { padding: '10px 14px', textAlign: 'left' };
const tdStyle = { padding: '10px 14px' };
