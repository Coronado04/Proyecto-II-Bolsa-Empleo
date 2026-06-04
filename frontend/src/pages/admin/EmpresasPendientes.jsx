export default function EmpresasPendientes() {
    return (
        <div className="dashboard-header">
            <h1>Empresas Pendientes</h1>
            <p>Aprueba o rechaza solicitudes de registro de empresas.</p>
            <p style={{ marginTop: '1em', color: '#7f8c8d' }}>
                Funcionalidad en desarrollo...
            </p>
            <a href="/admin/dashboard" className="btn btn-secondary" style={{ marginTop: '1em' }}>
                Volver
            </a>
        </div>
    );
}