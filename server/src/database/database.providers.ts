import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

export const DATABASE_POOL = 'DATABASE_POOL';
export const DATABASE_CLIENT = 'DATABASE_CLIENT';

export const databaseProviders: Provider[] = [
  {
    provide: DATABASE_POOL,
    useFactory: (configService: ConfigService) => {
      const connectionString = configService.get<string>('DATABASE_URL');

      if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is required.');
      }

      return new Pool({
        connectionString,
        max: parseInt(configService.get<string>('DB_POOL_MAX', '20'), 10),
        idleTimeoutMillis: parseInt(configService.get<string>('DB_IDLE_TIMEOUT_MS', '30000'), 10),
      });
    },
    inject: [ConfigService],
  },
  {
    provide: DATABASE_CLIENT,
    useFactory: (pool: Pool) => drizzle(pool),
    inject: [DATABASE_POOL],
  },
];
