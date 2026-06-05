import { useState } from 'react';

export default function ArbolCaracteristicas({ nodos, seleccionados, onToggle }) {
    const [expandidos, setExpandidos] = useState(new Set());

    function toggleExpand(id) {
        setExpandidos(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    if (!nodos || nodos.length === 0) return null;

    return (
        <div>
            {nodos.map(nodo => (
                <div key={nodo.id}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {nodo.hijos && nodo.hijos.length > 0
                            ? <span onClick={e => { e.preventDefault(); toggleExpand(nodo.id); }}
                                    style={{ cursor: 'pointer', userSelect: 'none', width: '14px' }}>
                  {expandidos.has(nodo.id) ? '▼' : '▶'}
                </span>
                            : <span style={{ width: '14px', display: 'inline-block' }} />
                        }
                        <input
                            type="checkbox"
                            checked={seleccionados.has(nodo.id)}
                            onChange={() => onToggle(nodo.id)}
                        />
                        <span>{nodo.nombre}</span>
                    </label>

                    {nodo.hijos && nodo.hijos.length > 0 && expandidos.has(nodo.id) && (
                        <div style={{ marginLeft: '24px' }}>
                            <ArbolCaracteristicas
                                nodos={nodo.hijos}
                                seleccionados={seleccionados}
                                onToggle={onToggle}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}