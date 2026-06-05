export default function OferenteDashboard() {
    return (
        <div style={{ padding: '2em', textAlign: 'center' }}>
            <h1>👔 Panel de Oferente</h1>
            <p>Bienvenido al panel de oferente.</p>
            <p style={{ color: '#666', marginTop: '1em' }}>
                Aquí irán las funcionalidades de oferente (perfil, aplicaciones, etc.)
            </p>
            <div style={{
                marginTop: '2em',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1em'
            }}>
                <div style={{ padding: '1em', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <h3>👤 Mi Perfil</h3>
                    <p>Editar mi perfil</p>
                </div>
                <div style={{ padding: '1em', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <h3>🎓 Habilidades</h3>
                    <p>Gestionar mis habilidades</p>
                </div>
                <div style={{ padding: '1em', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <h3>📄 Aplicaciones</h3>
                    <p>Ver mis aplicaciones</p>
                </div>
            </div>
        </div>
    );
}