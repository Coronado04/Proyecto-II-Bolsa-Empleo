const BASE_URL = 'http://localhost:8080/api/auth';
export async function login(correo, clave) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, clave })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
  sessionStorage.setItem('token', data.token);
  sessionStorage.setItem('rol', data.rol);
  sessionStorage.setItem('correo', data.correo);
  return data;
}
export function logout() {
  sessionStorage.removeItem('token'); sessionStorage.removeItem('rol'); sessionStorage.removeItem('correo');
}
export function getToken()   { return sessionStorage.getItem('token'); }
export function getRol()     { return sessionStorage.getItem('rol'); }
export function getCorreo()  { return sessionStorage.getItem('correo'); }
export function isLoggedIn() { return !!getToken(); }
