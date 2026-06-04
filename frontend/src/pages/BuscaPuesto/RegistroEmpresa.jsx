import { useState } from 'react';
import { registrarEmpresa } from './publicoService.jsx';

export default function RegistroEmpresa() {
    const [form, setForm] = useState({
        correo: '',
        clave: '',
        nombre: '',
        localizacion: '',
        telefono: '',
        descripcion: '',
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
            await registrarEmpresa(form);
            setExito(true);
            // Equivalente al redirect:/login?registroOk del controller original
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
                <h2>Registro de Empresa</h2>

                {/* Equivalente al th:if="${error}" de Thymeleaf */}
                {error && <p className="error">{error}</p>}
                {exito && <p className="success">¡Empresa registrada! Redirigiendo...</p>}

                <form onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            name="correo"
                            value={form.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="clave"
                            value={form.clave}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label>Nombre de la empresa</label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label>Localización</label>
                        <input
                            type="text"
                            name="localizacion"
                            value={form.localizacion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field-group">
                        <label>Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field-group">
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn" disabled={cargando}>
                        {cargando ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
            </div>
        </main>
    );
}
