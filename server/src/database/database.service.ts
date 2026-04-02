import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_CLIENT, DATABASE_POOL } from './database.providers';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  constructor(
    @Inject(DATABASE_CLIENT) private readonly db: unknown,
    @Inject(DATABASE_POOL) private readonly pool: Pool,
  ) {}

  get client() {
    return this.db;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
