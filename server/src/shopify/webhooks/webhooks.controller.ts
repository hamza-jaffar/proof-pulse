import { Controller, Post, Headers, Req } from '@nestjs/common';
import { type Request } from 'express';
import { WebhooksService } from './webhooks.service';

@Controller('shopify-webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('uninstall')
  async handleUninstall(
    @Headers('x-shopify-shop-domain') shop: string,
    @Req() req: Request,
  ) {
    console.log('App uninstalled from:', shop);

    return this.webhooksService.handleUninstall(shop);
  }
}
