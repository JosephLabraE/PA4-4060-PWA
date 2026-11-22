import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./config";

function Solicitudes({ token, cerrarSesion }) {
    const [lista, setLista] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [curso, setCurso] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const headers = { Authorization: `Bearer ${token}` };

    const manejarError = (err) => {
        if (err.response?.status === 401) {
        cerrarSesion("Tu sesión expiró o el token no es válido. Inicia sesión de nuevo.");
        } else if (err.response) {
        setError(err.response.data?.mensaje || `Error del servidor (${err.response.status})`);
        } else if (err.message === "Formato inesperado") {
        setError("La respuesta de la API no tiene el formato esperado");
        } else {
        setError("No se pudo conectar con la API");
        }
    };

    const cargar = async () => {
        setCargando(true);
        setError("");
        try {
        const { data } = await axios.get(`${API_URL}/solicitudes`, { headers });
        if (!Array.isArray(data.solicitudes)) {
            throw new Error("Formato inesperado");
        }
        setLista(data.solicitudes);
        } catch (err) {
        manejarError(err);
        } finally {
        setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const crear = async (e) => {
        e.preventDefault();
        setError("");
        try {
        await axios.post(`${API_URL}/solicitudes`, { curso, descripcion }, { headers });
        setCurso("");
        setDescripcion("");
        cargar();
        } catch (err) {
        manejarError(err);
        }
    };

    return (
        <div>
        <h2>Mis solicitudes</h2>
        <button onClick={() => cerrarSesion()}>Cerrar sesión</button>
        <button onClick={cargar}>Actualizar</button>

        <form onSubmit={crear}>
            <h3>Nueva solicitud</h3>
            <input value={curso} onChange={(e) => setCurso(e.target.value)} placeholder="Curso" />
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" />
            <button type="submit">Enviar</button>
        </form>

        {cargando && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
            {lista.map((s) => (
            <li key={s._id}>
                {s.curso} — {s.descripcion} ({s.estado})
            </li>
            ))}
        </ul>
        </div>
    );
    }

export default Solicitudes;