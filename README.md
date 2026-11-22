# PA4 — Plataforma de Gestión de Solicitudes Académicas

**Curso:** Programación Web II · **Código:** 30690 · **Institución:** ISIL · **Periodo:** 202620
**Evaluación:** PA4 — Proceso de Aprendizaje 4 (sesiones 11 a 13)

## Integrantes

| Nombre completo | Rol | Participación |
|---|---|---|
| [NOMBRE COMPLETO] | React y JWT | Actividad 1: consumo de APIs y manejo de sesiones en React |
| [NOMBRE COMPLETO] | Next.js | Actividad 2: SSR, SSG y rutas dinámicas |
| Angel Jesús Vargas Manrique | Despliegue | Actividad 3: despliegue del frontend en Vercel |
| [NOMBRE COMPLETO] | Producción | Actividad 4: preparación de la aplicación para producción |

## Descripción

Cuarta etapa de la Plataforma de Gestión de Solicitudes Académicas. El frontend se conecta con el backend Node.js/Express mediante JWT, se implementa una versión en Next.js con SSR, SSG y rutas dinámicas, se despliega el frontend en Vercel y se prepara la solución para producción.

## Objetivo

Demostrar el consumo de APIs y el manejo de sesiones JWT en React, la optimización del renderizado con Next.js, la publicación del frontend en Vercel y la preparación del código para producción, justificando las decisiones técnicas con los contenidos de las sesiones 11 a 13.

## Desarrollo

[COMPLETAR POR EL EQUIPO: breve descripción del procedimiento seguido, actividad por actividad.]

## Solución propuesta

### Actividad 1: Consumo de APIs y manejo de sesiones en React

[COMPLETAR POR EL EQUIPO]

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

**Verificación de rutas en Vercel**

| Ruta | Tipo de renderizado | Resultado esperado en Vercel |
|---|---|---|
| `/` | Estática | Página de inicio completa |
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

**Requisitos:** Node.js 20.9 o superior y MongoDB en ejecución local.

**Backend** (crear `backend/.env` a partir de `backend/.env.example`):

```bash
cd backend
npm install
npm run crear-admin
npm run dev                     # http://localhost:3001
```

**Frontend Next.js** (crear `frontend-next/.env.local` con `API_URL=http://localhost:3001`):

```bash
cd frontend-next
npm install
npm run dev                     # http://localhost:3000
npm run build                   # compila como en Vercel
```

**Frontend React:**

```bash
cd frontend-react
npm install
npm run dev                     # http://localhost:5173
```

**Versión desplegada:** [PEGAR AQUÍ LA URL DE VERCEL]

## Evidencias

Las capturas de cada actividad están guardadas en la carpeta [`evidencias/`](evidencias); haz clic para verlas.

**Actividad 3:**

- [Captura del proyecto importado con Root Directory `frontend-next`]
- [Captura del log de build en Vercel]
- [Captura de las variables de entorno (valor oculto)]
- [Captura de cada ruta de la tabla de verificación]
- [Captura de los Runtime Logs de Vercel]

## Conclusiones

**Actividad 3:** desplegar en Vercel permite revisar la aplicación fuera del entorno local y ver cómo se comporta cada tipo de renderizado: las páginas estáticas y SSG se sirven completas desde el build, mientras que las SSR dependen del backend en cada petición. Manejar la URL del backend como variable de entorno del servidor deja la aplicación lista para conectarse al backend publicado en la Evaluación Integral sin cambiar el código.

[AGREGAR CONCLUSIONES GENERALES DEL EQUIPO Y LA RELACIÓN CON LOS CONTENIDOS DE LAS SESIONES 11 A 13]

## Video de exposición

**Video público de YouTube:** [PEGAR AQUÍ EL ENLACE]
