import { useState } from 'react';
import { registrarEmpresa } from '../services/registroService';

export default function RegistroEmpresa({ onNavegar }) {
  const [form, setForm] = useState({
    correo: '', clave: '', nombre: '', localizacion: '', telefono: '', descripcion: ''
  });
  const [error,   setError]   = useState('');
  const [exito,   setExito]   = useState('');
  const [cargando, setCargando] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setError(''); setExito(''); setCargando(true);
    try {
      const data = await registrarEmpresa(form);
      setExito(data.mensaje);
      setForm({ correo:'', clave:'', nombre:'', localizacion:'', telefono:'', descripcion:'' });
    } catch (e) {
      setError(e.message);
    } finally { setCargando(false); }
  }

  return (
    <main>
      <div className="form-box">
        <h2>Registro de Empresa</h2>

        {error && <p className="error">{error}</p>}
        {exito && <p className="success">{exito}</p>}

        <div className="field-group">
          <label>Correo electrónico</label>
          <input type="email" name="correo" value={form.correo} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Contraseña</label>
          <input type="password" name="clave" value={form.clave} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Nombre de la empresa</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Localización</label>
          <input type="text" name="localizacion" value={form.localizacion} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Teléfono</label>
          <input type="text" name="telefono" value={form.telefono} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
        </div>

        <button className="btn" onClick={handleSubmit} disabled={cargando}>
          {cargando ? 'Registrando…' : 'Registrarse'}
        </button>
      </div>
    </main>
  );
}
