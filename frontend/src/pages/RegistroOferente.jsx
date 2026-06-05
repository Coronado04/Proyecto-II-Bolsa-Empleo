import { useState } from 'react';
import { registrarOferente } from '../services/registroService';

export default function RegistroOferente({ onNavegar }) {
  const [form, setForm] = useState({
    correo: '', clave: '', identificacion: '', nombre: '',
    primerApellido: '', nacionalidad: '', telefono: '', residencia: ''
  });
  const [error,    setError]    = useState('');
  const [exito,    setExito]    = useState('');
  const [cargando, setCargando] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setError(''); setExito(''); setCargando(true);
    try {
      const data = await registrarOferente(form);
      setExito(data.mensaje);
      setForm({ correo:'', clave:'', identificacion:'', nombre:'',
                primerApellido:'', nacionalidad:'', telefono:'', residencia:'' });
    } catch (e) {
      setError(e.message);
    } finally { setCargando(false); }
  }

  return (
    <main>
      <div className="form-box">
        <h2>Registro de Oferente</h2>

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
          <label>Identificación</label>
          <input type="text" name="identificacion" value={form.identificacion} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Nombre</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Primer Apellido</label>
          <input type="text" name="primerApellido" value={form.primerApellido} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Nacionalidad</label>
          <input type="text" name="nacionalidad" value={form.nacionalidad} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Teléfono</label>
          <input type="text" name="telefono" value={form.telefono} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Lugar de residencia</label>
          <input type="text" name="residencia" value={form.residencia} onChange={handleChange} />
        </div>

        <button className="btn" onClick={handleSubmit} disabled={cargando}>
          {cargando ? 'Registrando…' : 'Registrarse'}
        </button>
      </div>
    </main>
  );
}
