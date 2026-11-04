import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { BooksService } from './books.service';

describe('BooksService', () => {
  // Un Pool FALSO: tiene un método query, pero no habla con PostgreSQL
  const fakePool = { query: jest.fn() };

  // El servicio de verdad, con el Pool falso
  const service = new BooksService(fakePool as unknown as Pool);

  beforeEach(() => {
    fakePool.query.mockReset(); // antes de cada test, el falso empieza de cero
  });

  it('findOne lanza un 404 si no hay ninguna fila', async () => {
    // Preparar: la "base de datos" no devuelve filas
    fakePool.query.mockResolvedValue({ rows: [] });

    // Ejecutar y comprobar: tiene que lanzar NotFoundException
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('findOne devuelve el libro convertido con toBook', async () => {
    fakePool.query.mockResolvedValue({
      rows: [
        {
          id: 1,
          title: 'Momo',
          author: 'Michael Ende',
          pages: 256,
          created_at: new Date('2026-01-01'),
        },
      ],
    });

    const book = await service.findOne(1);

    expect(book.title).toBe('Momo');
    expect(book.createdAt).toEqual(new Date('2026-01-01'));
  });

  it('update sin campos lanza un 400 y NO toca la base de datos', async () => {
    await expect(service.update(1, {})).rejects.toThrow(BadRequestException);

    expect(fakePool.query).not.toHaveBeenCalled(); // ni una consulta
  });
});
