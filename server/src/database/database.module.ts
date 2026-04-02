import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.providers';
import { DatabaseService } from './database.service';
import { UserRepository } from './user.repository';
import { ShopifyStoreRepository } from './shopify-store.repository';

@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders, DatabaseService, UserRepository, ShopifyStoreRepository],
  exports: [DatabaseService, UserRepository, ShopifyStoreRepository],
})
export class DatabaseModule {}
