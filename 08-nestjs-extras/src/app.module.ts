import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { CoversModule } from './covers/covers.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 20 }],
      errorMessage: 'Demasiadas peticiones. Espera un poco.',
    }),
    // GraphQL en /graphql. El esquema se genera solo a partir de las clases
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // Errores cortos: el mensaje de verdad y sin la traza del servidor
      formatError: (error) => {
        const original = error.extensions?.originalError as
          { message?: string | string[] } | undefined;
        const message = original?.message ?? error.message;
        return {
          message: Array.isArray(message) ? message.join(', ') : message,
          path: error.path,
        };
      },
    }),
    // Las colas guardan sus tareas en Redis
    BullModule.forRoot({ connection: { url: process.env.REDIS_URL } }),
    BooksModule,
    OrdersModule,
    CoversModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
