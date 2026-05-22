import { useEffect, useState } from 'react';
import PuestoCard from '../../components/PuestoCard.jsx';
import { getPuestosRecientes } from './publicoService.jsx';

export default function Home() {
  const [puestos, setPuestos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPuestosRecientes()
      .then(setPuestos)
      .catch(e => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <main>
      <h1>Bolsa de Empleo</h1>
      <p>Últimos 5 puestos públicos</p>

      {cargando && <p>Cargando puestos…</p>}
      {error && <p className="error">No se pudo conectar con el servidor: {error}</p>}

      <div className="puestos-grid">
        {puestos.map(p => <PuestoCard key={p.id} puesto={p} />)}
      </div>
    </main>
  );
}
