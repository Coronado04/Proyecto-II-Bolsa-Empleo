const BASE_URL = 'http://localhost:8080/api/publico/registro';

export async function registrarEmpresa(datos) {
  const res = await fetch(`${BASE_URL}/empresa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al registrar');
  return data;
}

export async function registrarOferente(datos) {
  const res = await fetch(`${BASE_URL}/oferente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al registrar');
  return data;
}
