# Academia · sesión 5: proyecto profesional

Código de los apuntes `05_react_proyecto_profesional.md`.

La app de la sesión 4 organizada por funcionalidades (`features/`), con variables de entorno, traducciones (español e inglés), tests con Vitest + Testing Library, oxlint + Prettier y lista para publicar en Netlify (`public/_redirects`).

```bash
npm install
cp .env.example .env
npm run api     # terminal 1: API en http://localhost:3001
npm run dev     # terminal 2: app en http://localhost:5173
npm test        # tests
npm run lint    # oxlint
npm run format  # Prettier
```

Usuarios de prueba (en `db.json`): `admin@academia.es` / `academia123` y `lucia@correo.es` / `lucia123`.
