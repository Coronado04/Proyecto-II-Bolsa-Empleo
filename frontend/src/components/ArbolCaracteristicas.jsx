export default function ArbolCaracteristicas({ nodos, seleccionados, onToggle }) {
  if (!nodos || nodos.length === 0) return null;
  return (
    <div>
      {nodos.map(nodo => (
        <div key={nodo.id}>
          <label>
            <input type="checkbox" checked={seleccionados.has(nodo.id)} onChange={() => onToggle(nodo.id)} />{' '}
            <span>{nodo.nombre}</span>
          </label>
          {nodo.hijos && nodo.hijos.length > 0 && (
            <div style={{marginLeft:'20px'}}>
              <ArbolCaracteristicas nodos={nodo.hijos} seleccionados={seleccionados} onToggle={onToggle} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
