import { useState } from 'react';
import { registrarOferente } from './publicoService.jsx';

export default function RegistroOferente() {
    const [form, setForm] = useState({
        correo: '',
        clave: '',
        identificacion: '',
        nombre: '',
        primerApellido: '',
        nacionalidad: '',
        telefono: '',
        residencia: '',
    });
    const [error, setError]       = useState(null);
    const [exito, setExito]       = useState(false);
    const [cargando, setCargando] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setExito(false);
        setCargando(true);
        try {
            await registrarOferente(form);
            setExito(true);
            setTimeout(() => window.location.href = '/?registroOk', 1500);
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <main>
            <div className="form-box">
                <h2>Registro de Oferente</h2>

                {error && <p className="error">{error}</p>}
                {exito && <p className="success">¡Oferente registrado! Redirigiendo...</p>}

                <form onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label>Correo electrónico</label>
                        <input type="email" name="correo"
                               value={form.correo} onChange={handleChange} required />
                    </div>

                    <div className="field-group">
                        <label>Contraseña</label>
                        <input type="password" name="clave"
                               value={form.clave} onChange={handleChange} required />
                    </div>

                    <div className="field-group">
                        <label>Identificación</label>
                        {/* name="identificacion" — igual a la clave del estado */}
                        <input type="text" name="identificacion"
                               value={form.identificacion} onChange={handleChange} required />
                    </div>

                    <div className="field-group">
                        <label>Nombre</label>
                        <input type="text" name="nombre"
                               value={form.nombre} onChange={handleChange} />
                    </div>

                    <div className="field-group">
                        <label>Primer Apellido</label>
                        {/* name="primerApellido" — sin espacios */}
                        <input type="text" name="primerApellido"
                               value={form.primerApellido} onChange={handleChange} />
                    </div>

                    <div className="field-group">
                        <label>Nacionalidad</label>
                        {/* name="nacionalidad" — sin mayúscula */}
                        <input type="text" name="nacionalidad"
                               value={form.nacionalidad} onChange={handleChange} />
                    </div>

                    <div className="field-group">
                        <label>Teléfono</label>
                        <input type="text" name="telefono"
                               value={form.telefono} onChange={handleChange} />
                    </div>

                    <div className="field-group">
                        <label>Lugar de residencia</label>
                        {/* name="residencia" — sin espacios */}
                        <input type="text" name="residencia"
                               value={form.residencia} onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn" disabled={cargando}>
                        {cargando ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
            </div>
        </main>
    );
}
