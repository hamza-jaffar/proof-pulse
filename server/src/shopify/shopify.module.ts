import { Module } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { ShopifyController } from './shopify.controller';
import { OauthModule } from './oauth/oauth.module';

@Module({
  providers: [ShopifyService],
  controllers: [ShopifyController],
  imports: [OauthModule]
})
export class ShopifyModule {}
