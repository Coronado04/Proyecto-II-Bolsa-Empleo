import { useState } from 'react';
import { subirCV, getCvUrl } from "../../services/oferenteService";

export default function MiCV({ onNavegar }) {
    const [archivo,  setArchivo]  = useState(null);
    const [error,    setError]    = useState('');
    const [exito,    setExito]    = useState('');
    const [cargando, setCargando] = useState(false);
    const [tieneCv,  setTieneCv]  = useState(
        !!sessionStorage.getItem('tieneCv')
    );

    async function handleSubir() {
        if (!archivo) return setError('Seleccioná un archivo PDF');
        setError(''); setExito(''); setCargando(true);
        try {
            await subirCV(archivo);
            setExito('CV subido correctamente');
            setTieneCv(true);
            sessionStorage.setItem('tieneCv', '1');
        } catch(e) { setError(e.message); }
        finally { setCargando(false); }
    }

    return (
        <main>
            <h2>Mi CV</h2>
            {error && <p className="error">{error}</p>}
            {exito && <p className="success">{exito}</p>}

            <div style={{marginBottom:'1.5rem'}}>
                {tieneCv
                    ? <p>CV actual: <a href={getCvUrl()} target="_blank"
                                       className="btn-sm" rel="noreferrer">Ver CV en PDF</a></p>
                    : <p>Aún no has subido tu CV.</p>
                }
            </div>

            <div className="form-box">
                <h3>{tieneCv ? 'Actualizar CV' : 'Subir CV'}</h3>
                <div className="field-group">
                    <label>Archivo PDF</label>
                    <input type="file" accept=".pdf"
                           onChange={e => setArchivo(e.target.files[0])} />
                </div>
                <button className="btn" onClick={handleSubir} disabled={cargando}>
                    {cargando ? 'Subiendo…' : 'Subir CV'}
                </button>
            </div>

            <button className="btn-secondary" style={{marginTop:'16px'}}
                    onClick={() => onNavegar('oferente-dashboard')}>Volver</button>
        </main>
    );
}