# PA4 — Plataforma de Gestión de Solicitudes Académicas

**Curso:** Programación Web II · **Código:** 30690 · **Institución:** ISIL · **Periodo:** 202620
**Evaluación:** PA4 — Proceso de Aprendizaje 4 (sesiones 11 a 13)

## Integrantes

| Nombre completo | Rol | Participación |
|---|---|---|
| Joseph Mathios Labra Espinal | React y JWT | Actividad 1: consumo de APIs y manejo de sesiones en React |
| Roy Giovanni Quiroz Morales | Next.js | Actividad 2: SSR, SSG y rutas dinámicas |
| Angel Jesús Vargas Manrique | Despliegue | Actividad 3: despliegue del frontend en Vercel |
| Ayrton Mihail Palomino Loli | Producción | Actividad 4: preparación de la aplicación para producción |

## Descripción

Cuarta etapa de la Plataforma de Gestión de Solicitudes Académicas. El frontend se conecta con el backend Node.js/Express mediante JWT, se implementa una versión en Next.js con SSR, SSG y rutas dinámicas, se despliega el frontend en Vercel y se prepara la solución para producción.

## Objetivo

Demostrar el consumo de APIs y el manejo de sesiones JWT en React, la optimización del renderizado con Next.js, la publicación del frontend en Vercel y la preparación del código para producción, justificando las decisiones técnicas con los contenidos de las sesiones 11 a 13.

## Desarrollo

[COMPLETAR POR EL EQUIPO: breve descripción del procedimiento seguido, actividad por actividad.]

- **Actividad 1:** se reutilizó el backend Node/Express con JWT de la PA2 y se desarrolló en React (Vite) el cliente que lo consume con Axios: login, sesión, manejo de errores y validación de respuestas.
- **Actividad 3:** se desplegó `frontend-next` en Vercel conectando el repositorio de GitHub con `frontend-next` como Root Directory y la variable de servidor `API_URL`; se ajustó el login para no registrar el JWT, se agregó manejo de errores de conexión en `/solicitudes` y un enlace a «Iniciar sesión» en el inicio, y se verificaron las rutas en la URL pública.
- **Actividad 4:** sobre el proyecto `frontend-next` se configuró la compilación de producción en `next.config.mjs` (compresión, sin source maps y eliminación de `console.log`), se separó la configuración por entorno con archivos `.env.*`, se creó un logger con niveles y se activó el monitoreo con Vercel Analytics y Speed Insights.


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

**Responsable:** Roy Quiroz

**Cómo lo trabajé**

1. Revisé la estructura del proyecto y adapté el frontend con Next.js dentro de `frontend-next`. También revisé cómo se comunica con el backend de la PA2, desarrollado con Express y conectado a MongoDB.
2. Organicé las vistas utilizando el **App Router** de Next.js. Separé la página informativa, el listado de solicitudes y el detalle de cada solicitud.
3. Implementé **SSG** en la vista de información, porque presenta contenido general que no necesita consultarse nuevamente en la API cada vez que ingresa un usuario.
4. Implementé **SSR** en el listado de solicitudes. La página lee la cookie de sesión en el servidor y consulta la API enviando el JWT, para obtener información actualizada y protegida.
5. Creé la ruta dinámica `/solicitudes/[id]` para consultar el detalle de cada solicitud según su identificador.
6. Integré el inicio de sesión mediante un Route Handler de Next.js. Este recibe las credenciales, las reenvía al backend y guarda el JWT en una cookie `HttpOnly`.
7. Organicé el proyecto para ejecutar y comprobar las vistas desde el navegador, con el backend y MongoDB en funcionamiento.

**Estructura (`frontend-next`)**

```text
frontend-next/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── login/
│   │           └── route.js       # Procesa el login y guarda el JWT
│   ├── informacion/
│   │   └── page.js                # Vista estática mediante SSG
│   ├── login/
│   │   └── page.js                # Página de acceso
│   ├── solicitudes/
│   │   ├── [id]/
│   │   │   └── page.js            # Detalle mediante ruta dinámica
│   │   └── page.js                # Listado de solicitudes mediante SSR
│   ├── globals.css                # Estilos generales
│   ├── layout.js                  # Layout principal y metadatos
│   └── page.js                    # Página de inicio
├── components/
│   └── LoginForm.jsx              # Formulario de inicio de sesión
├── package.json
└── next.config.mjs
```

**Implementación de SSR, SSG y rutas dinámicas**

| Vista | Archivo | Ruta | Implementación |
|---|---|---|---|
| Información | `app/informacion/page.js` | `/informacion` | SSG |
| Listado de solicitudes | `app/solicitudes/page.js` | `/solicitudes` | SSR |
| Detalle de solicitud | `app/solicitudes/[id]/page.js` | `/solicitudes/:id` | SSR + ruta dinámica |

- **SSG en `/informacion`:** en `app/informacion/page.js` utilicé `export const dynamic = "force-static"`. Next.js genera esta página de forma estática. Es apropiado porque presenta información general del sistema que no depende de la sesión ni necesita consultar datos variables en cada visita.
- **SSR en `/solicitudes`:** en `app/solicitudes/page.js` utilicé `export const dynamic = "force-dynamic"`. La página lee la cookie `token` con `cookies()` de `next/headers`, consulta `${process.env.API_URL}/solicitudes` y envía el JWT mediante `Authorization: Bearer`. La petición utiliza `cache: "no-store"` para evitar reutilizar una respuesta almacenada.
- **Ruta dinámica `/solicitudes/[id]`:** el segmento `[id]` permite mostrar el detalle de diferentes solicitudes desde un mismo archivo. La página recibe el identificador mediante `params` y consulta `/solicitudes/${id}` en el backend, utilizando el token de sesión. Si la consulta falla o no se encuentra el registro, muestra el mensaje correspondiente.

**Flujo de autenticación**

| Paso | Quién lo hace | Dónde |
|---|---|---|
| El usuario ingresa correo y contraseña | Formulario de Next.js | `components/LoginForm.jsx` |
| El formulario envía las credenciales | Next.js | `POST /api/auth/login` |
| Next.js reenvía las credenciales | Route Handler | `app/api/auth/login/route.js` |
| El backend valida al usuario y genera el JWT | Backend (PA2) | `POST /auth/login` |
| Next.js guarda el JWT en una cookie `HttpOnly` | Next.js | `app/api/auth/login/route.js` |
| Las páginas protegidas leen la cookie | Next.js | Páginas de solicitudes |
| El backend verifica el JWT | Backend (PA2) | Middleware de autenticación |

**Decisiones**

- **SSG para `/informacion`:** elegí generación estática porque es contenido general y estable. No requiere información personalizada ni una consulta a la base de datos en cada visita.
- **SSR para `/solicitudes`:** elegí renderizado en el servidor porque el listado depende de datos actuales y de la identidad del usuario autenticado.
- **SSR para el detalle dinámico:** cada solicitud tiene un identificador y sus datos se obtienen desde la API. Una ruta dinámica evita crear manualmente una página para cada registro.
- **`force-dynamic` y `cache: "no-store"`:** se utilizan en el listado y el detalle para que las páginas y sus consultas no dependan de contenido almacenado.
- **Cookie `HttpOnly`:** el JWT se guarda desde el Route Handler con `httpOnly`, `sameSite: "lax"` y una duración de una hora. Así, el JavaScript del navegador no puede leer directamente el token.
- **Route Handler para el login:** el formulario envía las credenciales a `/api/auth/login`; Next.js realiza la comunicación con Express y establece la cookie de sesión.

**Cómo ejecutar o revisar**

Con MongoDB y el backend de la PA2 en ejecución, crear `frontend-next/.env.local` con:

```env
API_URL=http://localhost:3001
```

Desde la carpeta `frontend-next`, ejecutar:

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`. Para comprobar la compilación de producción:

```bash
npm run build
npm start
```

**Pruebas de funcionamiento**

1. Iniciar MongoDB y el backend Express.
2. Iniciar Next.js y abrir `http://localhost:3000`.
3. Ingresar a `/informacion` y comprobar que se muestra el contenido informativo.
4. Ingresar a `/login` y probar el inicio de sesión con un usuario registrado en el backend.
5. Después de iniciar sesión, comprobar que se abre `/solicitudes` y se carga el listado.
6. Seleccionar **Ver detalle** en una solicitud y comprobar que la dirección cambia a `/solicitudes/<id>`.
7. Probar el acceso al listado sin una sesión válida y comprobar que aparece el mensaje correspondiente.

**Problemas y aspectos que tuve en cuenta**

- **La vista de solicitudes depende de la sesión:** si no existe la cookie `token`, la página no realiza la consulta protegida y muestra el aviso de inicio de sesión.
- **La API puede responder con error:** el listado y el detalle contemplan respuestas HTTP no exitosas y muestran mensajes cuando no se pueden obtener los datos.
- **El detalle necesita un identificador válido:** la ruta dinámica consulta `/solicitudes/:id`; si el backend no encuentra el registro o el usuario no tiene permiso, se muestra el mensaje recibido desde la API.
- **Configuración de la dirección del backend:** las páginas utilizan `process.env.API_URL`. Por eso, es necesario definir esa variable en `.env.local` para las pruebas locales.

### Actividad 3: Despliegue del frontend en Vercel

**Responsable:** Angel Vargas

**URL pública:** [https://pa4-4060-pwa-frontend-next.vercel.app/](https://pa4-4060-pwa-frontend-next.vercel.app/)

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

**Responsable:** Ayrton Mihail Palomino Loli. La documentación completa y las capturas están en [`evidencias/actividad4/readme.md`](evidencias/actividad4/readme.md).

1. **Minificación y optimización.** `next build` minifica el código; en `next.config.mjs` se activó `compress`, se desactivaron `poweredByHeader` y los source maps de producción, y `compiler.removeConsole` elimina los `console.log` en producción conservando `info`, `warn` y `error`.
2. **Webpack y Babel.** Next.js 16 usa Turbopack (sucesor de Webpack) y SWC (reemplazo de Babel). No se creó un `.babelrc`, porque desactivaría SWC, ni un bloque `webpack`, porque con Turbopack daría error de build. La configuración de bundler del proyecto es `turbopack.rules` para Tailwind.
3. **Variables de entorno.** Se agregaron `.env.example`, `.env.development` y `.env.production` con valores no sensibles; `.env.local` y `API_URL` quedan fuera de Git. `API_URL` no lleva el prefijo `NEXT_PUBLIC_`, por lo que solo la lee el servidor. En producción se configura en Vercel.
4. **Logs.** `lib/logger.js` ofrece los niveles `info`, `warn` y `error` con fecha y hora, y se aplicó en el login sin registrar datos sensibles.
5. **Monitoreo.** Se agregaron `@vercel/analytics` y `@vercel/speed-insights` en `app/layout.js`. Las capturas provienen de un despliegue propio del mismo código, porque el plan gratuito de Vercel no permite invitar colaboradores al proyecto del equipo.

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


**Versión desplegada:** [https://pa4-4060-pwa-frontend-next.vercel.app/](https://pa4-4060-pwa-frontend-next.vercel.app/)

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

| Prueba | Resultado esperado | Evidencia |
|---|---|---|
| Página de inicio | Enlace «Iniciar sesión» en la barra de navegación | [01-local-inicio-boton-login.png](evidencias/actividad3/01-local-inicio-boton-login.png) |
| Detalle de solicitud con el backend apagado | «No se pudo conectar con el servidor.» sin página de error | [02-local-detalle-backend-apagado.png](evidencias/actividad3/02-local-detalle-backend-apagado.png) |

**Actividad 4:**

| Prueba | Resultado esperado | Evidencia |
|---|---|---|
| Build sin cambios | Compila y lista las rutas estáticas y dinámicas | [01-build-antes.png](evidencias/actividad4/01-build-antes.png) |
| Build con la configuración de producción | Compila sin errores | [02-build-despues.png](evidencias/actividad4/02-build-despues.png) |
| `npm run dev` | Carga `.env.local` y `.env.development`; el pie de página dice «Entorno: desarrollo» | [03-env-desarrollo.png](evidencias/actividad4/03-env-desarrollo.png) |
| Build de producción local | Carga `.env.production` | [05-build-produccion.png](evidencias/actividad4/05-build-produccion.png) |
| Intento de login en local | Líneas `[INFO]` y `[ERROR]` en la terminal | [04-logs-local.png](evidencias/actividad4/04-logs-local.png) |
| Variables en Vercel | `API_URL` configurada, valor oculto | [10-env-vars-vercel.png](evidencias/actividad4/10-env-vars-vercel.png) |
| Build en Vercel | Carga `.env.production` | [12-build-logs-vercel.png](evidencias/actividad4/12-build-logs-vercel.png) |
| Runtime Logs en Vercel | Líneas del logger en producción | [09-runtime-logs-vercel.png](evidencias/actividad4/09-runtime-logs-vercel.png) |
| Speed Insights | Real Experience Score de 100 | [07-speed-insights.png](evidencias/actividad4/07-speed-insights.png) |
| Analytics | Visitantes y páginas vistas | [08-analytics.png](evidencias/actividad4/08-analytics.png) |
| Despliegues | Despliegues en estado Ready | [11-deployments.png](evidencias/actividad4/11-deployments.png) |
| Pull Request | Checks en verde | [06-pull-request.png](evidencias/actividad4/06-pull-request.png) |

## Conclusiones

**Actividad 1:** consumir la API con Axios y validar cada respuesta (estado, formato y errores de red) permitió que la aplicación fallara de forma controlada y mostrara mensajes claros. Guardar el token en el cliente y enviarlo con `Authorization: Bearer` mantiene la sesión sin que el servidor guarde estado, aunque `localStorage` es vulnerable a XSS; una cookie HttpOnly, como la de `frontend-next`, es más segura.

**Actividad 2:**

**Actividad 3:** desplegar en Vercel permite revisar la aplicación fuera del entorno local y ver cómo se comporta cada tipo de renderizado: las páginas estáticas y SSG se sirven completas desde el build, mientras que las SSR dependen del backend en cada petición. Manejar la URL del backend como variable de entorno del servidor deja la aplicación lista para conectarse al backend publicado en la Evaluación Integral sin cambiar el código.

**Actividad 4:** preparar la aplicación para producción no consiste en escribir lógica nueva, sino en controlar cómo se compila, qué configuración recibe y qué se puede observar de ella. De la sesión 13 se aplicó la minificación y la compresión, y se comprobó que en Next.js 16 las funciones de Webpack y Babel las cubren Turbopack y SWC integrados. También se separó la configuración por entorno con archivos `.env`, igual que se vio con las variables `NEXT_PUBLIC_`, y se mantuvo la URL del backend como variable de servidor para no exponerla en el navegador. Los logs con niveles y el monitoreo con Vercel Analytics y Speed Insights permiten detectar fallos, como el error de conexión al backend que se ve en los Runtime Logs, sin revisar el código. Esto se articula con las sesiones 11 y 12: la misma variable `API_URL` que usa el login con JWT es la que se configura en Vercel al desplegar la aplicación con SSR y SSG.

## Video de exposición

**Video público de YouTube:** https://www.youtube.com/watch?v=NJLOFV9qrV4