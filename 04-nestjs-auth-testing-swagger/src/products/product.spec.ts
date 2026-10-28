import { toProduct } from './product';

describe('toProduct', () => {
  it('convierte el precio de texto a número', () => {
    const row = {
      id: 1,
      name: 'Teclado',
      price: '29.99',
      created_at: new Date('2026-01-01'),
    };

    const product = toProduct(row);

    expect(product.price).toBe(29.99);
  });

  it('cambia created_at por createdAt', () => {
    const fecha = new Date('2026-01-01');

    const product = toProduct({
      id: 1,
      name: 'Teclado',
      price: '10.00',
      created_at: fecha,
    });

    expect(product).toEqual({
      id: 1,
      name: 'Teclado',
      price: 10,
      createdAt: fecha,
    });
  });
});
