-- Borra las tablas si ya existen (empezamos de cero)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100) NOT NULL,
  pages INTEGER NOT NULL CHECK (pages > 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0), -- ejemplares en la tienda
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Un pedido
CREATE TABLE orders (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Las líneas del pedido: qué libro y cuántos
CREATE TABLE order_items (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  book_id INTEGER NOT NULL REFERENCES books (id),
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

INSERT INTO books (title, author, pages, stock)
VALUES
  ('Cien años de soledad', 'Gabriel García Márquez', 471, 5),
  ('El principito', 'Antoine de Saint-Exupéry', 96, 10),
  ('Crónica de una muerte anunciada', 'Gabriel García Márquez', 122, 2),
  ('La sombra del viento', 'Carlos Ruiz Zafón', 576, 4),
  ('El amor en los tiempos del cólera', 'Gabriel García Márquez', 464, 0),
  ('Rayuela', 'Julio Cortázar', 600, 3),
  ('Ficciones', 'Jorge Luis Borges', 224, 6),
  ('La casa de los espíritus', 'Isabel Allende', 512, 1),
  ('Nada', 'Carmen Laforet', 288, 7),
  ('Don Quijote de la Mancha', 'Miguel de Cervantes', 1376, 2),
  ('Pedro Páramo', 'Juan Rulfo', 124, 8),
  ('El túnel', 'Ernesto Sabato', 160, 5);
