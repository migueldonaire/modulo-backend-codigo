import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { EventsGateway } from '../events/events.gateway';
import { REDIS, type RedisClient } from '../redis/redis.module';
import { Book, BookPage, BookRow, toBook } from './book';
import { CreateBookDto } from './dto/create-book.dto';
import { ListBooksQueryDto } from './dto/list-books-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';

// Las columnas que pedimos siempre
const COLUMNS = 'id, title, author, pages, stock, cover_url, created_at';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    private readonly pool: Pool,
    @Inject(REDIS) private readonly redis: RedisClient, // se pide por su nombre
    private readonly events: EventsGateway,
  ) {}

  // v1: todos los libros (como en la 03b)
  async findAll(author?: string): Promise<Book[]> {
    if (!author) {
      const result = await this.pool.query<BookRow>(
        `SELECT ${COLUMNS} FROM books ORDER BY id`,
      );
      return result.rows.map(toBook); // cada fila → un libro de la API
    }

    const result = await this.pool.query<BookRow>(
      `SELECT ${COLUMNS} FROM books
       WHERE author ILIKE '%' || $1 || '%'
       ORDER BY id`,
      [author],
    );
    return result.rows.map(toBook);
  }

  // v2: una página de libros, ordenada
  async findPage(query: ListBooksQueryDto): Promise<BookPage> {
    const { page, limit, sort, order } = query;
    const author = query.author ?? null; // null = sin filtro

    // ORDER BY no admite $1: el nombre de la columna va en el texto del SQL.
    // Es seguro porque el DTO solo deja pasar 'id', 'title' o 'pages'.
    const direction = order === 'desc' ? 'DESC' : 'ASC';
    const offset = (page - 1) * limit; // página 1 → 0, página 2 → limit...

    const result = await this.pool.query<BookRow>(
      `SELECT ${COLUMNS} FROM books
       WHERE ($1::text IS NULL OR author ILIKE '%' || $1 || '%')
       ORDER BY ${sort} ${direction}, id
       LIMIT $2 OFFSET $3`,
      [author, limit, offset],
    );

    // Cuántos hay en total con el mismo filtro (sin LIMIT)
    const count = await this.pool.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM books
       WHERE ($1::text IS NULL OR author ILIKE '%' || $1 || '%')`,
      [author],
    );
    const total = count.rows[0].total;
    const totalPages = Math.ceil(total / limit);

    // HATEOAS: la respuesta dice a dónde puedes ir después
    const link = (p: number) => {
      const params = new URLSearchParams({
        page: String(p),
        limit: String(limit),
        sort,
        order,
      });
      if (query.author) params.set('author', query.author);
      return `/api/v2/books?${params.toString()}`;
    };

    return {
      data: result.rows.map(toBook),
      total,
      page,
      limit,
      totalPages,
      links: {
        self: link(page),
        first: link(1),
        last: link(Math.max(totalPages, 1)),
        prev: page > 1 ? link(page - 1) : null, // null = no hay
        next: page < totalPages ? link(page + 1) : null,
      },
    };
  }

  async findOne(id: number): Promise<Book> {
    const key = `book:${id}`; // el nombre en Redis: book:1, book:2...

    // 1. ¿Está en la caché?
    const cached = await this.redis.get(key);
    if (cached) {
      this.logger.log(`Libro ${id} desde la caché`);
      return JSON.parse(cached) as Book; // Redis guarda texto
    }

    // 2. No está: lo buscamos en PostgreSQL
    this.logger.log(`Libro ${id} desde PostgreSQL`);
    const result = await this.pool.query<BookRow>(
      `SELECT ${COLUMNS} FROM books WHERE id = $1`,
      [id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Libro no encontrado');
    }
    const book = toBook(result.rows[0]);

    // 3. Lo guardamos en la caché durante 60 segundos
    await this.redis.set(key, JSON.stringify(book), { EX: 60 });
    return book;
  }

  // Borra un libro de la caché (cuando cambia, la copia ya no vale)
  private async forget(id: number) {
    await this.redis.del(`book:${id}`);
  }

  async create(dto: CreateBookDto): Promise<Book> {
    const result = await this.pool.query<BookRow>(
      `INSERT INTO books (title, author, pages, stock)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUMNS}`,
      [dto.title, dto.author, dto.pages, dto.stock ?? 0],
    );
    const book = toBook(result.rows[0]);
    this.events.bookCreated(book); // aviso en directo a quien esté conectado
    return book;
  }

  async update(id: number, dto: UpdateBookDto): Promise<Book> {
    if (
      dto.title === undefined &&
      dto.author === undefined &&
      dto.pages === undefined &&
      dto.stock === undefined
    ) {
      throw new BadRequestException('Envía al menos un campo');
    }
    const book = await this.findOne(id); // 404 si no existe

    const result = await this.pool.query<BookRow>(
      `UPDATE books
       SET title = $1, author = $2, pages = $3, stock = $4
       WHERE id = $5
       RETURNING ${COLUMNS}`,
      [
        dto.title ?? book.title,
        dto.author ?? book.author,
        dto.pages ?? book.pages,
        dto.stock ?? book.stock,
        id,
      ],
    );
    await this.forget(id); // la copia de la caché ya no vale
    return toBook(result.rows[0]);
  }

  // Guarda la dirección de la portada
  async setCover(id: number, coverUrl: string): Promise<Book> {
    const result = await this.pool.query<BookRow>(
      `UPDATE books SET cover_url = $1 WHERE id = $2 RETURNING ${COLUMNS}`,
      [coverUrl, id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Libro no encontrado');
    }
    await this.forget(id);
    return toBook(result.rows[0]);
  }

  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id); // 404 si no existe
    await this.pool.query('DELETE FROM books WHERE id = $1', [id]);
    await this.forget(id);
    return book;
  }
}
