import { getToken } from './authService.js';

const BASE_URL = 'http://localhost:8080/api/admin';

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

// Resumen para el dashboard (cantidad de pendientes)
export async function getAdminResumen() {
    const res = await fetch(`${BASE_URL}/resumen`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al cargar resumen');
    return res.json();
}

// Empresas pendientes de aprobación
export async function getEmpresasPendientes() {
    const res = await fetch(`${BASE_URL}/empresas/pendientes`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al cargar empresas pendientes');
    return res.json();
}

// Oferentes pendientes de aprobación
export async function getOferentesPendientes() {
    const res = await fetch(`${BASE_URL}/oferentes/pendientes`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al cargar oferentes pendientes');
    return res.json();
}

// Aprobar un usuario por id (empresa u oferente)
export async function aprobarUsuario(id) {
    const res = await fetch(`${BASE_URL}/usuarios/${id}/aprobar`, {
        method: 'POST',
        headers: authHeaders()
    });
    if (!res.ok) throw new Error('Error al aprobar usuario');
    return res.json();
}

const BASE = 'http://localhost:8080/api/admin';
function auth() {
    return { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token') };
}

export async function getCaracteristicas(padreId = null) {
    const url = padreId ? `${BASE}/caracteristicas?padreId=${padreId}`
        : `${BASE}/caracteristicas`;
    const res = await fetch(url, { headers: auth() });
    if (!res.ok) throw new Error('Error al cargar');
    return res.json();
}

export async function crearCaracteristica(nombre, padreId = null) {
    const res = await fetch(`${BASE}/caracteristicas`, {
        method: 'POST', headers: auth(),
        body: JSON.stringify({ nombre, padreId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error');
    return data;
}
