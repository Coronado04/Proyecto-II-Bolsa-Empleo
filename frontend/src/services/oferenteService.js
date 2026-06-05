const BASE = 'http://localhost:8080/api/oferente';

function auth() {
    return { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token') };
}

export async function getDashboard() {
    const res = await fetch(`${BASE}/dashboard`, { headers: auth() });
    if (!res.ok) throw new Error('Error al cargar dashboard');
    return res.json();
}

export async function getHabilidades() {
    const res = await fetch(`${BASE}/habilidades`, { headers: auth() });
    if (!res.ok) throw new Error('Error al cargar habilidades');
    return res.json();
}

export async function agregarHabilidad(caracteristicaId, nivel) {
    const res = await fetch(`${BASE}/habilidades`, {
        method: 'POST', headers: auth(),
        body: JSON.stringify({ caracteristicaId, nivel })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error');
    return data;
}

export async function eliminarHabilidad(caracteristicaId) {
    const res = await fetch(`${BASE}/habilidades/${caracteristicaId}`,
        { method: 'DELETE', headers: auth() });
    if (!res.ok) throw new Error('Error al eliminar');
    return res.json();
}

export async function subirCV(archivo) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    const res = await fetch(`${BASE}/cv`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') },
        body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error');
    return data;
}

export function getCvUrl() {
    return `${BASE}/cv/ver?token=${sessionStorage.getItem('token')}`;
}

export async function getCaracteristicas() {
    const res = await fetch(`${BASE}/caracteristicas`, { headers: auth() });
    if (!res.ok) throw new Error('Error');
    return res.json();
}