import { Module } from '@nestjs/common';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: Pool, // cuando alguien pida un Pool...
      useFactory: () =>
        // ...NestJS ejecuta esta función (una sola vez) y le da el resultado
        new Pool({ connectionString: process.env.DATABASE_URL }),
    },
  ],
  exports: [Pool], // otros módulos pueden pedir el Pool
})
export class DatabaseModule {}
