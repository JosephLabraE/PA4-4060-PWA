# PA4 — Plataforma de Gestión de Solicitudes Académicas

**Curso:** Programación Web II · **Código:** 30690 · **Institución:** ISIL · **Periodo:** 202620
**Evaluación:** PA4 — Proceso de Aprendizaje 4 (sesiones 11 a 13)

## Integrantes

| Nombre completo | Rol | Participación |
|---|---|---|
| Joseph Mathios Labra Espinal | React y JWT | Actividad 1: consumo de APIs y manejo de sesiones en React |
| [NOMBRE COMPLETO] | Next.js | Actividad 2: SSR, SSG y rutas dinámicas |
| Angel Jesús Vargas Manrique | Despliegue | Actividad 3: despliegue del frontend en Vercel |
| [NOMBRE COMPLETO] | Producción | Actividad 4: preparación de la aplicación para producción |

## Descripción

Cuarta etapa de la Plataforma de Gestión de Solicitudes Académicas. El frontend se conecta con el backend Node.js/Express mediante JWT, se implementa una versión en Next.js con SSR, SSG y rutas dinámicas, se despliega el frontend en Vercel y se prepara la solución para producción.

## Objetivo

Demostrar el consumo de APIs y el manejo de sesiones JWT en React, la optimización del renderizado con Next.js, la publicación del frontend en Vercel y la preparación del código para producción, justificando las decisiones técnicas con los contenidos de las sesiones 11 a 13.

## Desarrollo

[COMPLETAR POR EL EQUIPO: breve descripción del procedimiento seguido, actividad por actividad.]

- **Actividad 1:** se reutilizó el backend Node/Express con JWT de la PA2 y se desarrolló en React (Vite) el cliente que lo consume con Axios: login, sesión, manejo de errores y validación de respuestas.


## Solución propuesta

### Backend compartido (API de la PA2)

El repositorio incluye en `backend/` la API REST de la PA2 (Node.js, Express, MongoDB/Mongoose, JWT, bcrypt, roles, CORS y helmet). En la PA4 **no se modificó**: es la fuente de datos y autenticación que consumen `frontend-react` y `frontend-next`, y ambos dependen de su formato de respuesta. Los endpoints, la estructura y las pruebas están en el [README de la PA2](https://github.com/roy-quiroz/pa2-4060). Aquí se usan `POST /auth/login`, `GET /solicitudes`, `GET /solicitudes/:id` y `POST /solicitudes`.

**Alcance en la PA4:** el backend se ejecuta en local. Su despliegue (Render y MongoDB Atlas) corresponde a la Evaluación Integral.

### Actividad 1: Consumo de APIs y manejo de sesiones en React

**Responsable:** Joseph Labra

**Cómo lo trabajé**

1. Levanté el backend de la PA2 en local (los pasos están en «Cómo ejecutar o revisar») y lo probé en Postman antes de escribir el front: login, y `GET /solicitudes` sin token (401) y con token (200). Así supe el formato exacto de las respuestas.
2. Creé el proyecto con `npm create vite@latest frontend-react -- --template react` e instalé Axios.
3. Desarrollé el cliente en cuatro archivos (detalle abajo).
4. Probé el flujo completo y los casos de error, y subí todo desde la rama `feature/react-jwt` con un Pull Request.

**Estructura (`frontend-react/src`)**

```text
├── config.js        # Dirección de la API en un solo lugar
├── App.jsx          # Estado de sesión: guarda, recupera y borra el token
├── Login.jsx        # Formulario de login; valida que la respuesta traiga el token
├── Solicitudes.jsx  # Lista y crea solicitudes enviando el token
├── index.css        # Estilos
└── main.jsx
```

**Flujo de autenticación**

| Paso | Quién lo hace | Dónde |
|---|---|---|
| El usuario envía sus credenciales | React | `Login.jsx` |
| El servidor las valida y genera el token | Backend (PA2) | `POST /auth/login` |
| React guarda el token | React | `App.jsx` (`localStorage`) |
| El token viaja en cada petición protegida | React | `Solicitudes.jsx` (`Authorization: Bearer`) |
| El backend verifica el token | Backend (PA2) | `authMiddleware.js` |

**Decisiones**

- **Axios en lugar de Fetch:** la sintaxis es más corta y los errores del servidor se leen directo con `error.response`.
- **Token en `localStorage`:** mantiene la sesión al recargar la página. Su riesgo es que cualquier script inyectado (XSS) podría leerlo; para reducirlo, el token expira en 1 hora y se borra al cerrar sesión o cuando la API responde 401. Una cookie HttpOnly, como la que usa `frontend-next`, es más segura, pero solo la puede crear el backend.
- **Sesión al recargar:** `App.jsx` lee el token guardado al iniciar, porque React pierde su estado al recargar la página.
- **Errores:** un 401 borra el token y vuelve al login con un aviso; otros errores muestran el mensaje de la API; si no hay conexión, aparece «No se pudo conectar con la API».
- **Validación de respuestas:** se comprueba que el login traiga `token` y que `solicitudes` sea un arreglo antes de mostrarlo.

**Problemas que encontré y cómo los resolví**

- **Pantalla en blanco al arrancar:** los `import` de `App.jsx` (`./Login`, `./Solicitudes`) no coincidían con los nombres de los archivos. Los renombré con la misma mayúscula inicial.
- **Proyecto incompleto:** instalé Axios sin haber creado antes el proyecto con Vite y faltaba React. Rehice el proyecto con `npm create vite@latest ... --template react` y luego instalé Axios.
- **Avisos de ESLint** sobre el `useEffect` de `Solicitudes.jsx`: vienen de las reglas de la plantilla de Vite y no afectan el funcionamiento.

### Actividad 2: Optimización con Next.js: SSR, SSG y rutas dinámicas

[COMPLETAR POR EL EQUIPO]

### Actividad 3: Despliegue del frontend en Vercel

**Responsable:** Angel Vargas

**URL pública:** [PEGAR AQUÍ LA URL DE VERCEL]

**Cómo lo trabajé**

1. **Elegí qué desplegar.** El repositorio tiene tres proyectos (`backend`, `frontend-react` y `frontend-next`). Desplegué `frontend-next`, que es el frontend de la Actividad 2, porque Vercel es la plataforma de Next.js y la actividad pide publicar una aplicación Next.js.
2. **Preparé el proyecto.** Verifiqué que `npm run build` compilara sin errores antes de subirlo, para que el build de Vercel no fallara. Hice dos ajustes en el código (detallados abajo) en la rama `feature/deploy-vercel`.
3. **Conecté Vercel con GitHub.** En Vercel elegí *Add New → Project*, importé el repositorio `PA4-4060-PWA` y en **Root Directory** seleccioné `frontend-next`. Vercel detectó el framework Next.js y usó los comandos por defecto (`npm install` y `next build`).
4. **Configuré las variables de entorno.** En *Settings → Environment Variables* agregué `API_URL` para los entornos Production y Preview.
5. **Desplegué y verifiqué.** Con el primer despliegue obtuve la URL pública y revisé cada ruta (tabla de verificación abajo). Desde ese momento, cada push a la rama principal genera un despliegue nuevo y cada Pull Request genera un despliegue de vista previa (*Preview*).

**Estructura**

```
PA4-4060-PWA/
├── backend/            (no se despliega en esta PA)
├── frontend-react/     (Actividad 1, se ejecuta en local)
└── frontend-next/      ← Root Directory en Vercel
    ├── app/
    │   ├── api/auth/login/route.js
    │   ├── informacion/page.js
    │   ├── login/page.js
    │   └── solicitudes/
    │       ├── page.js
    │       └── [id]/page.js
    └── next.config.mjs
```

**Qué hice y por qué**

- **Solo desplegué el frontend.** La PA4 corta en la sesión 13 y deja el despliegue del backend en Render y MongoDB Atlas para la Evaluación Integral. Por eso el backend sigue en local y las vistas protegidas, en Vercel, muestran el manejo de sesión ausente en lugar de datos.
- **Usé `API_URL` y no `NEXT_PUBLIC_API_URL`.** La variable solo la leen el servidor de Next (el Route Handler del login y las páginas SSR), así la URL del backend no aparece en el JavaScript que descarga el navegador. Cuando el backend esté publicado, basta con cambiar su valor en Vercel y volver a desplegar, sin tocar código.
- **No tuve que cambiar CORS en el backend.** El navegador nunca llama a Express directamente: las llamadas salen del servidor de Next, y CORS solo aplica a peticiones hechas desde el navegador.
- **La cookie del JWT funciona igual en Vercel.** Está configurada como `httpOnly` y `secure` en producción, y Vercel sirve todo por HTTPS.
- **Quité del log la respuesta de Express** en `app/api/auth/login/route.js`, porque imprimía el JWT completo y quedaba visible en los logs de Vercel. También quité el detalle técnico del error que se devolvía al cliente.
- **Agregué `try/catch` en `app/solicitudes/page.js`,** igual que ya tenía la página de detalle, para que si el backend no responde se muestre un mensaje controlado y no la página de error 500.
- **Agregué un enlace "Iniciar sesión" en la barra del inicio** (`app/page.js`). Al verificar las rutas noté que `/login` solo era accesible escribiendo la URL, lo que dificultaba revisar la aplicación desplegada.

**Verificación de rutas en Vercel**

| Ruta | Tipo de renderizado | Resultado esperado en Vercel |
|---|---|---|
| `/` | Estática | Página de inicio completa, con enlace a "Iniciar sesión" |
| `/informacion` | SSG | Contenido completo, generado en el build |
| `/login` | Estática | Formulario de inicio de sesión |
| `/login` (enviar formulario) | Route Handler | Mensaje "Error durante el inicio de sesión" (no hay backend publicado) |
| `/solicitudes` | SSR | Mensaje "No has iniciado sesión" |
| `/solicitudes/[id]` | SSR, ruta dinámica | Mensaje "Debes iniciar sesión." |
| `/ruta-inexistente` | — | Página 404 de Next.js |

El flujo completo con login, listado y detalle se demuestra en local con el backend en ejecución (ver *Cómo ejecutar o revisar*).

**Problemas que encontré y cómo los resolví**

- **El repositorio tiene varios proyectos en la raíz.** Si se importa sin configurar, Vercel no encuentra un proyecto Next.js. Lo resolví indicando `frontend-next` como Root Directory.
- **`localhost` no existe en Vercel.** El valor de `API_URL` que usamos en local apunta a mi computadora, no al servidor de Vercel. Como el backend no se despliega en esta etapa, dejé las vistas protegidas con mensajes controlados y documenté el cambio que hará falta en la Evaluación Integral.
- **Git marcaba todos los archivos como modificados** en Windows, solo por los saltos de línea (CRLF). Lo resolví con `git config core.autocrlf true` para no subir cambios que no eran reales.

### Actividad 4: Preparación para producción

[COMPLETAR POR EL EQUIPO]

## Cómo ejecutar o revisar

**Requisitos:** Node.js 20.9 o superior y MongoDB en ejecución local (`mongodb://127.0.0.1:27017`). El código del backend ya está en `backend/`, así que no hay que descargar nada aparte.

**1. Backend** (iniciarlo primero, porque los dos frontends lo consumen). Crear `backend/.env` a partir de `backend/.env.example`:

| Variable | Valor |
|---|---|
| `PORT` | `3001` |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/solicitudes_academicas` |
| `JWT_SECRET` | Cadena aleatoria: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_IN` | `1h` |
| `CORS_ORIGIN` | `http://localhost:5173` (origen de `frontend-react`) |
| `ADMIN_NOMBRE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Datos del administrador inicial (a elección) |

```bash
cd backend
npm install
npm run crear-admin             # crea el administrador con los datos del .env
npm run dev                     # http://localhost:3001
```

**Usuarios para iniciar sesión:** el administrador creado arriba (ve todas las solicitudes) o un estudiante, que se registra con `POST http://localhost:3001/auth/register` en Postman: `{ "nombre": "Ana", "email": "ana@isil.pe", "password": "secreto123" }` (el estudiante solo ve las suyas). La base de datos es local, así que los usuarios hay que crearlos en cada equipo.

**2. Frontend Next.js** (crear `frontend-next/.env.local` con `API_URL=http://localhost:3001`):

```bash
cd frontend-next
npm install
npm run dev                     # http://localhost:3000
npm run build                   # compila como en Vercel
```

**3. Frontend React:**

```bash
cd frontend-react
npm install
npm run dev                     # http://localhost:5173
```


**Versión desplegada:** [PEGAR AQUÍ LA URL DE VERCEL]

## Evidencias

Las capturas de cada actividad están guardadas en la carpeta [`evidencias/`](evidencias); haz clic para verlas.

**Actividad 1:**

| Prueba | Resultado esperado | Evidencia |
|---|---|---|
| Backend en ejecución | Conecta a MongoDB y escucha en el puerto 3001 | [01-backend-corriendo.png](evidencias/actividad1/01-backend-corriendo.png) |
| `POST /auth/login` en Postman | 200 con token JWT | [02-postman-login-200.png](evidencias/actividad1/02-postman-login-200.png) |
| `GET /solicitudes` sin token | 401, token no proporcionado | [03-postman-solicitudes-401.png](evidencias/actividad1/03-postman-solicitudes-401.png) |
| `GET /solicitudes` con Bearer Token | 200 con la lista | [04-postman-solicitudes-200.png](evidencias/actividad1/04-postman-solicitudes-200.png) |
| Login con contraseña incorrecta | Mensaje de error en rojo | [05-react-login-error.png](evidencias/actividad1/05-react-login-error.png) |
| Login correcto | Lista de solicitudes cargada desde la API | [06-react-lista.png](evidencias/actividad1/06-react-lista.png) |
| Crear una solicitud desde el formulario | Aparece en la lista (POST con token) | [07-react-crear-solicitud.png](evidencias/actividad1/07-react-crear-solicitud.png) |
| Local Storage tras iniciar sesión | La clave `token` está guardada | [08-react-localstorage.png](evidencias/actividad1/08-react-localstorage.png) |
| Petición protegida en Network | Header `Authorization: Bearer` | [09-react-header-bearer.png](evidencias/actividad1/09-react-header-bearer.png) |
| Token alterado y recarga (F5) | Vuelve al login con aviso | [10-react-token-invalido.png](evidencias/actividad1/10-react-token-invalido.png) |
| Backend apagado y Actualizar | «No se pudo conectar con la API» | [11-react-api-caida.png](evidencias/actividad1/11-react-api-caida.png) |
| Cerrar sesión | El token se elimina de Local Storage | [12-react-logout.png](evidencias/actividad1/12-react-logout.png) |

**Actividad 3:**

- [Captura del proyecto importado con Root Directory `frontend-next`]
- [Captura del log de build en Vercel]
- [Captura de las variables de entorno (valor oculto)]
- [Captura de cada ruta de la tabla de verificación]
- [Captura de los Runtime Logs de Vercel]

## Conclusiones

**Actividad 1:** consumir la API con Axios y validar cada respuesta (estado, formato y errores de red) permitió que la aplicación fallara de forma controlada y mostrara mensajes claros. Guardar el token en el cliente y enviarlo con `Authorization: Bearer` mantiene la sesión sin que el servidor guarde estado, aunque `localStorage` es vulnerable a XSS; una cookie HttpOnly, como la de `frontend-next`, es más segura.

**Actividad 2:**

**Actividad 3:** desplegar en Vercel permite revisar la aplicación fuera del entorno local y ver cómo se comporta cada tipo de renderizado: las páginas estáticas y SSG se sirven completas desde el build, mientras que las SSR dependen del backend en cada petición. Manejar la URL del backend como variable de entorno del servidor deja la aplicación lista para conectarse al backend publicado en la Evaluación Integral sin cambiar el código.

**Actividad 4:**

[AGREGAR CONCLUSIONES GENERALES DEL EQUIPO Y LA RELACIÓN CON LOS CONTENIDOS DE LAS SESIONES 11 A 13]

## Video de exposición

**Video público de YouTube:** [PEGAR AQUÍ EL ENLACE]
