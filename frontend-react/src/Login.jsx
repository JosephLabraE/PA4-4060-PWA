import { useState } from "react";
import axios from "axios";
import { API_URL } from "./config";

function Login({ iniciarSesion, aviso }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const enviar = async (e) => {
        e.preventDefault();
        setError("");
        try {
        const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
        if (!data.token) {
            throw new Error("La respuesta no trae el token");
        }
        iniciarSesion(data.token);
        } catch (err) {
        if (err.response) {
            setError(err.response.data?.mensaje || `Error ${err.response.status}`);
        } else if (err.message === "La respuesta no trae el token") {
            setError(err.message);
        } else {
            setError("No se pudo conectar con la API");
        }
        }
    };

    return (
        <form onSubmit={enviar}>
        <h2>Iniciar sesión</h2>
        {aviso && <p style={{ color: "orange" }}>{aviso}</p>}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
        <button type="submit">Ingresar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
    }

export default Login;