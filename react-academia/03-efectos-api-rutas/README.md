# Academia · sesión 3: efectos, API y rutas

Código de los apuntes `03_react_efectos_api_rutas.md`.

La app ya lee los cursos de una API falsa con json-server (`fetch` + `useEffect` en los hooks `useCursos` y `useCurso`) y tiene varias páginas con React Router.

Necesitas dos terminales:

```bash
npm install
npm run api     # terminal 1: API en http://localhost:3001
npm run dev     # terminal 2: app en http://localhost:5173
```

Para dejar los datos como al principio: `cp db.inicial.json db.json`.
