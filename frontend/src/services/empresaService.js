// empresaService.js
// Servicio para todas las llamadas REST del rol Empresa

const BASE = 'http://localhost:8080/api/empresa';

function getToken() {
    return sessionStorage.getItem('token');
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

// Obtener todos los puestos de la empresa autenticada
export async function getMisPuestos() {
    const res = await fetch(`${BASE}/puestos`, {
        headers: authHeaders()
    });
    if (!res.ok) throw new Error('Error al obtener puestos');
    return res.json();
}

// Publicar un nuevo puesto
// body: { descripcion, salario, tipo, caracteristicas: [{caracteristicaId, nivelDeseado}] }
export async function publicarPuesto(body) {
    const res = await fetch(`${BASE}/puestos`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al publicar puesto');
    }
    return res.json();
}

// Desactivar un puesto por ID
export async function desactivarPuesto(id) {
    const res = await fetch(`${BASE}/puestos/${id}/desactivar`, {
        method: 'PUT',
        headers: authHeaders()
    });
    if (!res.ok) throw new Error('Error al desactivar puesto');
    return res.json();
}

// Obtener árbol de características
export async function getCaracteristicas() {
    const res = await fetch(`${BASE}/caracteristicas`, {
        headers: authHeaders()
    });
    if (!res.ok) throw new Error('Error al obtener características');
    return res.json();
}