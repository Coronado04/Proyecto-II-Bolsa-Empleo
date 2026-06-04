import { useState } from 'react';
import Modal from 'react-modal';
import { backend } from '../Utils';

Modal.setAppElement('#root');

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
    const [credentials, setCredentials] = useState({ correo: '', clave: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${backend}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                setError(errorMsg || 'Error al iniciar sesión');
                setLoading(false);
                return;
            }

            const token = await response.text();
            localStorage.setItem('token', token);

            onLoginSuccess(token);
            onClose();
            setCredentials({ correo: '', clave: '' });
        } catch (err) {
            setError('Error de conexión. Intenta de nuevo.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Login"
            shouldCloseOnOverlayClick={false}
            closeTimeoutMS={500}
            className={{
                base: 'login-content',
                afterOpen: 'login-content--after-open',
                beforeClose: 'login-content--before-close'
            }}
            overlayClassName={{
                base: 'login-overlay',
                afterOpen: 'login-overlay--after-open',
                beforeClose: 'login-overlay--before-close'
            }}
        >
            <div className="login-title">🔐 Iniciar Sesión</div>

            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-form-group">
                    <label htmlFor="correo">Correo</label>
                    <input
                        id="correo"
                        type="text"
                        name="correo"
                        value={credentials.correo}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="login-form-group">
                    <label htmlFor="clave">Contraseña</label>
                    <input
                        id="clave"
                        type="password"
                        name="clave"
                        value={credentials.clave}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                {error && <div className="login-error">{error}</div>}

                <div className="login-buttons">
                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
    );
}