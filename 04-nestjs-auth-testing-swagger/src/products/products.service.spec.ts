import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PG_POOL } from '../database/database.module';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  const poolMock = { query: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [ProductsService, { provide: PG_POOL, useValue: poolMock }],
    }).compile();

    service = moduleRef.get(ProductsService);
  });

  it('findOne devuelve el producto convertido', async () => {
    const fecha = new Date('2026-01-01');
    poolMock.query.mockResolvedValue({
      rows: [{ id: 1, name: 'Teclado', price: '29.99', created_at: fecha }],
    });

    const product = await service.findOne(1);

    expect(product).toEqual({
      id: 1,
      name: 'Teclado',
      price: 29.99,
      createdAt: fecha,
    });
    expect(poolMock.query).toHaveBeenCalledWith(expect.any(String), [1]);
  });

  it('findOne lanza NotFoundException si no hay filas', async () => {
    poolMock.query.mockResolvedValue({ rows: [] });

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
});
