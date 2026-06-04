import { useState, useEffect } from 'react';
import { backend } from '../../Utils';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        empresasPendientes: 0,
        oferentesPendientes: 0
    });

    useEffect(() => {
        // Aquí irían las llamadas a la API para obtener los números reales
        // De momento dejamos en 0, pero más adelante se conectarán
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            // TODO: Implementar endpoints para obtener conteos
            // const resp1 = await fetch(`${backend}/admin/empresas/pendientes/count`);
            // const resp2 = await fetch(`${backend}/admin/oferentes/pendientes/count`);
            setStats({
                empresasPendientes: 0,
                oferentesPendientes: 0
            });
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    };

    return (
        <div className="dashboard-header">
            <h1>Administrador</h1>
            <p>Aprobaciones, catálogo de características y reportes.</p>

            <div className="dashboard-buttons">
                <a href="/admin/empresas/pendientes" className="btn">
                    Empresas pendientes ({stats.empresasPendientes})
                </a>
                <a href="/admin/oferentes/pendientes" className="btn">
                    Oferentes pendientes ({stats.oferentesPendientes})
                </a>
                <a href="/admin/caracteristicas" className="btn">
                    Características
                </a>
            </div>
        </div>
    );
}