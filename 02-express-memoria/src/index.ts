import express from "express";
import type { NextFunction, Request, Response } from "express";
import productsRouter from "./routes/products";
import categoriesRouter from "./routes/categories";

const app = express();
const PORT = 3000;

// 1. Registrar cada petición en la terminal
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 2. CORS: permitir peticiones desde nuestra página web
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

// 3. Leer bodies JSON
app.use(express.json());

// 4. Rutas
app.get("/", (_req, res) => {
  res.send("Mi primera API con Express");
});

// Ejercicio 1
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Apartado 3 + ejercicio 2: saludo con ?name= y ?lang=en
app.get("/api/hello", (req, res) => {
  const name = req.query.name ?? "persona";
  const greeting = req.query.lang === "en" ? "Hello" : "Hola";

  res.json({ message: `${greeting}, ${name}` });
});

// Reto 3: llamar a otra API (Open-Meteo) desde el backend
app.get("/api/weather", async (_req, res) => {
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=39.47&longitude=-0.38&current=temperature_2m"
  );

  if (!response.ok) {
    res.status(502).json({ error: "El servicio del tiempo no responde" });
    return;
  }

  const data = await response.json();
  res.json({ city: "Valencia", temperature: data.current.temperature_2m });
});

// Ejercicio 8 (temporal): descomenta para ver el middleware de errores en acción
// app.get("/api/boom", () => {
//   throw new Error("Algo ha explotado");
// });

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter); // Reto 2

// 5. Ninguna ruta ha respondido: 404
app.use((req, res) => {
  res.status(404).json({ error: `No existe la ruta ${req.method} ${req.url}` });
});

// 6. Ha ocurrido un error: respuesta JSON sin detalles internos
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: "El body no es un JSON válido" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
