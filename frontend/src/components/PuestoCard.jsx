export default function PuestoCard({ puesto }) {
    const salarioFmt = puesto.salario
        ? puesto.salario.toLocaleString('es-CR', { minimumFractionDigits: 2 })
        : '0,00';

    return (
        <div className="puesto-card">
            <strong>{puesto.empresaNombre}</strong>
            <p>{puesto.descripcion}</p>
            <p>€ {salarioFmt}</p>

            <div className="tooltip-wrap">
                <button className="btn-sm">Ver detalle</button>
                <div className="tooltip-content">
                    <strong>Características requeridas:</strong>
                    <ul>
                        {puesto.caracteristicas && puesto.caracteristicas.map(c => (
                            <li key={c.id}>{c.nombre} (nivel {c.nivelDeseado})</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}