import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

// Lo que hay que enviar para crear un libro con GraphQL
@InputType()
export class CreateBookInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  author: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  pages: number;
}
