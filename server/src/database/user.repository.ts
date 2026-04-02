import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from './database.service';
import { users } from './schemas';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.client as any;
  }

  async createUser(email: string, name?: string) {
    const [user] = await this.db
      .insert(users)
      .values({
        email,
        name,
      })
      .returning();

    return user;
  }

  async findByEmail(email: string) {
    return this.db.select().from(users).where(eq(users.email, email)).limit(1);
  }

  async listAll() {
    return this.db.select().from(users).orderBy(users.createdAt);
  }
}
