import { BookRow, toBook } from './book';

describe('toBook', () => {
  it('convierte una fila de la base de datos en un libro de la API', () => {
    // Preparar: una fila como las que devuelve PostgreSQL
    const row: BookRow = {
      id: 1,
      title: 'Momo',
      author: 'Michael Ende',
      pages: 256,
      created_at: new Date('2026-01-01'),
    };

    // Ejecutar
    const book = toBook(row);

    // Comprobar
    expect(book).toEqual({
      id: 1,
      title: 'Momo',
      author: 'Michael Ende',
      pages: 256,
      createdAt: new Date('2026-01-01'),
    });
  });

  it('no deja pasar created_at con guion bajo', () => {
    const row: BookRow = {
      id: 1,
      title: 'Momo',
      author: 'Michael Ende',
      pages: 256,
      created_at: new Date(),
    };

    const book = toBook(row);

    expect(book).not.toHaveProperty('created_at');
  });
});
