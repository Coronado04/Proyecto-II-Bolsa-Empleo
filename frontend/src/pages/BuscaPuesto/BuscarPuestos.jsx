import { useEffect, useState } from 'react';
import { buscarPuestos, getCaracteristicas } from './publicoService.jsx';
import ArbolCaracteristicas from "../../components/ArbolCaracteristicas.jsx";

export default function BuscarPuestos() {
  const [arbol, setArbol] = useState([]);
  const [seleccionados, setSeleccionados] = useState(new Set());
  const [resultados, setResultados] = useState([]);
  const [buscado, setBuscado] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCaracteristicas().then(setArbol).catch(e => setError(e.message));
  }, []);

  function toggleCaracteristica(id) {
    setSeleccionados(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function limpiar() {
    setSeleccionados(new Set());
    setResultados([]);
    setBuscado(false);
  }

  async function handleBuscar() {
    try {
      const data = await buscarPuestos([...seleccionados]);
      setResultados(data);
      setBuscado(true);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main>
      <h2>Buscar puestos por características</h2>

      {error && <p className="error">{error}</p>}

      <div className="dos-columnas">
        <div>
          <div className="tree-check">
            <ArbolCaracteristicas
              nodos={arbol}
              seleccionados={seleccionados}
              onToggle={toggleCaracteristica}
            />
          </div>
          <button className="btn" onClick={handleBuscar}>Buscar</button>
          <button className="btn-secondary" onClick={limpiar}>Limpiar</button>
        </div>

        <div>
          <h3>Resultados</h3>
          {buscado && resultados.length === 0 && <p>No se encontraron puestos.</p>}
          {resultados.map(p => (
            <div key={p.id} className="puesto-card" style={{ width: 'auto', marginBottom: '12px' }}>
              <strong>{p.empresaNombre}</strong>
              <p>{p.descripcion}</p>
              <p>Salario: {p.salario}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
