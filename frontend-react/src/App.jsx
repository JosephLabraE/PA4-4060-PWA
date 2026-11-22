import { useState } from "react";
import Login from "./Login";
import Solicitudes from "./Solicitudes";

function App() {
  // Al recargar la página recuperamos el token guardado
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [aviso, setAviso] = useState("");

  const iniciarSesion = (nuevoToken) => {
    localStorage.setItem("token", nuevoToken);
    setToken(nuevoToken);
    setAviso("");
  };

  const cerrarSesion = (mensaje = "") => {
    localStorage.removeItem("token");
    setToken(null);
    setAviso(mensaje);
  };

  return token ? (
    <Solicitudes token={token} cerrarSesion={cerrarSesion} />
  ) : (
    <Login iniciarSesion={iniciarSesion} aviso={aviso} />
  );
}

export default App;