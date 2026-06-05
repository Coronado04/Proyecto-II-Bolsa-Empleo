export default function EmpresaDashboard() {
    return (
        <div style={{ padding: '2em', textAlign: 'center' }}>
            <h1>🏢 Panel de Empresa</h1>
            <p>Bienvenido al panel de empresa.</p>
            <p style={{ color: '#666', marginTop: '1em' }}>
                Aquí irán las funcionalidades de empresa (puestos, candidatos, etc.)
            </p>
            <div style={{
                marginTop: '2em',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1em'
            }}>
                <div style={{ padding: '1em', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <h3>📋 Mis Puestos</h3>
                    <p>Gestionar puestos disponibles</p>
                </div>
                <div style={{ padding: '1em', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <h3>👤 Candidatos</h3>
                    <p>Ver candidatos</p>
                </div>
                <div style={{ padding: '1em', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <h3>📊 Estadísticas</h3>
                    <p>Ver estadísticas</p>
                </div>
            </div>
        </div>
    );
}