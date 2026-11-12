import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SkipThrottle } from '@nestjs/throttler';
import { BookModel } from './book.model';
import { BooksService } from './books.service';
import { CreateBookInput } from './create-book.input';

// Un "resolver" es el controlador de GraphQL. Usa el MISMO servicio.
@SkipThrottle() // el límite de peticiones de la 07 es solo para HTTP
@Resolver(() => BookModel)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  // query { books { title } }
  @Query(() => [BookModel])
  books(@Args('author', { nullable: true }) author?: string) {
    return this.booksService.findAll(author);
  }

  // query { book(id: 1) { title author } }
  @Query(() => BookModel)
  book(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.findOne(id);
  }

  // mutation { createBook(input: { title: "...", author: "...", pages: 100 }) { id } }
  @Mutation(() => BookModel)
  createBook(@Args('input') input: CreateBookInput) {
    return this.booksService.create(input);
  }
}
