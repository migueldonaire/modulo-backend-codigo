# 05 · NestJS: tests y Swagger

Estado al terminar los apuntes `05_nestjs_testing_swagger.md`: el proyecto de la 04 con tests de Jest y documentación con Swagger.

```bash
npm install
cp .env.example .env
npm run start:dev      # documentación en http://localhost:3000/docs
npm test               # tests unitarios: toBook, BooksService (Pool falso) y EmployeeGuard
npm run test:e2e       # tests de integración (necesita PostgreSQL con schema.sql)
```

La base de datos se prepara igual que en la 03b y la 04.
