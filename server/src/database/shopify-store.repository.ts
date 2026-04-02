import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { DatabaseService } from './database.service';
import { shopifyStore } from './schemas';

@Injectable()
export class ShopifyStoreRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.client as any;
  }

  async createStore(shopifyDomain: string, accessToken: string, scopes: string, refreshToken?: string) {
    const [store] = await this.db
      .insert(shopifyStore)
      .values({
        shopifyDomain,
        accessToken,
        refreshToken,
        scopes,
      })
      .returning();

    return store;
  }

  async findByDomain(domain: string) {
    return this.db.select().from(shopifyStore).where(eq(shopifyStore.shopifyDomain, domain)).limit(1);
  }

  async setActive(id: number, active = true) {
    return this.db
      .update(shopifyStore)
      .set({ isActive: active, updatedAt: new Date() })
      .where(eq(shopifyStore.id, id));
  }
}
