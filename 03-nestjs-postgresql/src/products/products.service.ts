import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductRow, toProduct } from './product';

@Injectable()
export class ProductsService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findAll(): Promise<Product[]> {
    const result = await this.pool.query<ProductRow>(
      `SELECT id, name, price, created_at
       FROM products
       ORDER BY id`,
    );

    return result.rows.map(toProduct);
  }

  async findOne(id: number): Promise<Product> {
    const result = await this.pool.query<ProductRow>(
      `SELECT id, name, price, created_at
       FROM products
       WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Producto no encontrado');
    }

    return toProduct(result.rows[0]);
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const result = await this.pool.query<ProductRow>(
      `INSERT INTO products (name, price)
       VALUES ($1, $2)
       RETURNING id, name, price, created_at`,
      [dto.name, dto.price],
    );

    return toProduct(result.rows[0]);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    if (dto.name === undefined && dto.price === undefined) {
      throw new BadRequestException(
        'Debes enviar al menos un campo para modificar',
      );
    }

    const current = await this.findOne(id);

    const result = await this.pool.query<ProductRow>(
      `UPDATE products
       SET name = $1, price = $2
       WHERE id = $3
       RETURNING id, name, price, created_at`,
      [dto.name ?? current.name, dto.price ?? current.price, id],
    );

    return toProduct(result.rows[0]);
  }

  async remove(id: number): Promise<void> {
    const result = await this.pool.query('DELETE FROM products WHERE id = $1', [
      id,
    ]);

    if (result.rowCount === 0) {
      throw new NotFoundException('Producto no encontrado');
    }
  }
}
