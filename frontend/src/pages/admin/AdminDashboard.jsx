    import { useEffect, useState } from 'react';
    import { getAdminResumen } from '../../services/AdminService.js';

    export default function AdminDashboard({ onNavegar }) {
        const [resumen, setResumen] = useState({ empresasPendientes: 0, oferentesPendientes: 0 });
        const [error, setError]     = useState(null);

        useEffect(() => {
            getAdminResumen()
                .then(setResumen)
                .catch(e => setError(e.message));
        }, []);

        return (
            <main>
                <h1>Administrador</h1>
                <p>Aprobaciones, catálogo de características y reportes.</p>

                {error && <p className="error">{error}</p>}

                <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn" onClick={() => onNavegar('empresas-pendientes')}>
                        Empresas pendientes ({resumen.empresasPendientes})
                    </button>
                    <button className="btn" onClick={() => onNavegar('oferentes-pendientes')}>
                        Oferentes pendientes ({resumen.oferentesPendientes})
                    </button>
                    <button className="btn" onClick={() => onNavegar('caracteristicas')}>
                        Características
                    </button>
                </div>
            </main>
        );
    }
