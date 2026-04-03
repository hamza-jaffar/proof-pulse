import { Module } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { ShopifyController } from './shopify.controller';
import { OauthModule } from './oauth/oauth.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  providers: [ShopifyService],
  controllers: [ShopifyController],
  imports: [OauthModule, WebhooksModule]
})
export class ShopifyModule {}
