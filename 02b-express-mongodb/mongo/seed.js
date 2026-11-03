// Datos de prueba para 02b. Se ejecuta con mongosh (ver README).
// Borra lo que hubiera y vuelve a empezar: se puede lanzar las veces que quieras.
/* global db, print */ // variables que pone mongosh (para que ESLint no se queje)

const database = db.getSiblingDB("bootcamp_api");

database.products.deleteMany({});
database.products.insertMany([
  { name: "Teclado", price: 29.99, category: "perifericos" },
  { name: "Ratón", price: 15, category: "perifericos" },
  { name: "Silla", price: 49.5, category: "muebles" }
]);

// Reto 2: categorías con nombre único
database.categories.deleteMany({});
database.categories.createIndex({ name: 1 }, { unique: true });
database.categories.insertMany([{ name: "perifericos" }, { name: "muebles" }]);

print(`products: ${database.products.countDocuments()} · categories: ${database.categories.countDocuments()}`);
