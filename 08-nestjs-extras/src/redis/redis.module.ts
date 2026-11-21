import { Module } from '@nestjs/common';
import { createClient } from 'redis';

// Un nombre para pedir el cliente de Redis (como hacíamos con Pool)
export const REDIS = 'REDIS';

// Crea el cliente y se conecta una vez, al arrancar la API
async function createRedis() {
  const client = createClient({ url: process.env.REDIS_URL });

  // Si Redis se cae, lo avisamos sin tumbar la API
  client.on('error', (error: Error) => console.error('Redis:', error.message));

  await client.connect();
  return client;
}

// El tipo del cliente de Redis (lo que devuelve createRedis)
export type RedisClient = Awaited<ReturnType<typeof createRedis>>;

@Module({
  providers: [{ provide: REDIS, useFactory: createRedis }],
  exports: [REDIS],
})
export class RedisModule {}
