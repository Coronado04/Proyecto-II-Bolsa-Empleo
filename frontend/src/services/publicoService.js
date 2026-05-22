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
