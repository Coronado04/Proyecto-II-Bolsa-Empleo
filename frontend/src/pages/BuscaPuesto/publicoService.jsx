const BASE_URL = 'http://localhost:8080/api/publico';

export async function getPuestosRecientes() {
  const res = await fetch(`${BASE_URL}/puestos/recientes`);
  if (!res.ok) throw new Error('Error al cargar puestos recientes');
  return res.json();
}

export async function buscarPuestos(ids = []) {
  const params = ids.length > 0
    ? '?' + ids.map(id => `ids=${id}`).join('&')
    : '';
  const res = await fetch(`${BASE_URL}/puestos/buscar${params}`);
  if (!res.ok) throw new Error('Error al buscar puestos');
  return res.json();
}

export async function getCaracteristicas() {
  const res = await fetch(`${BASE_URL}/caracteristicas`);
  if (!res.ok) throw new Error('Error al cargar características');
  return res.json();
}
export async function registrarEmpresa(form) {
    const res = await fetch('http://localhost:8080/api/empresa/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Error al registrar la empresa');
    }
    return res;
}
export async function registrarOferente(form) {
    const res = await fetch('http://localhost:8080/api/oferente/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Error al registrar el oferente');
    }
    return res;
}
