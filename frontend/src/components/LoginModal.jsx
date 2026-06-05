import { useState } from 'react';
import { login } from '../services/authService';
export default function LoginModal({ onClose, onLoginSuccess }) {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  async function handleIngresar() {
    setError(''); setCargando(true);
    try { const data = await login(correo, clave); onLoginSuccess(data); }
    catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }
  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-icon">👤</div>
        <h2 className="modal-title">Login</h2>
        {error && <p className="error" style={{marginBottom:'10px'}}>{error}</p>}
        <div className="field-group">
          <label>Usuario</label>
          <input type="text" value={correo} onChange={e=>setCorreo(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleIngresar()} />
        </div>
        <div className="field-group">
          <label>Clave</label>
          <input type="password" value={clave} onChange={e=>setClave(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleIngresar()} />
        </div>
        <div style={{display:'flex',gap:'8px',justifyContent:'center',marginTop:'8px'}}>
          <button className="btn" onClick={handleIngresar} disabled={cargando}>
            {cargando ? 'Ingresando…' : 'Ingresar'}
          </button>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
