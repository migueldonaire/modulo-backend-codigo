import { Field, Int, ObjectType } from '@nestjs/graphql';

// Cómo es un libro en GraphQL: cada campo con su tipo
@ObjectType('Book')
export class BookModel {
  @Field(() => Int) // en GraphQL hay que decir si es entero (Int) o decimal (Float)
  id: number;

  @Field()
  title: string;

  @Field()
  author: string;

  @Field(() => Int)
  pages: number;

  @Field(() => Int)
  stock: number;

  @Field(() => String, { nullable: true }) // puede ser null
  coverUrl: string | null;
}
