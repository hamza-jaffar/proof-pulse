import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.providers';
import { DatabaseService } from './database.service';
import { ShopifyStoreRepository } from './shopify-store.repository';

@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders, DatabaseService, ShopifyStoreRepository],
  exports: [DatabaseService, ShopifyStoreRepository],
})
export class DatabaseModule {}
