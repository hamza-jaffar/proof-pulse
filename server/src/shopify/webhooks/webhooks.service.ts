import { Injectable, Logger } from '@nestjs/common';
import { ShopifyStoreRepository } from '../../database/shopify-store.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly shopifyStoreRepository: ShopifyStoreRepository,
  ) {}

  async registerUninstall(shop: string, access_token: string) {
    try {
      const response = await fetch(
        `https://${shop}/admin/api/2026-04/webhooks.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': access_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            webhook: {
              topic: 'app/uninstalled',
              address: `${this.configService.get('apiUrl')}/shopify-webhooks/uninstall`,
              format: 'json',
            },
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        this.logger.error(
          `Failed to register webhook for ${shop}`,
          JSON.stringify(data),
        );
        return;
      }
    } catch (error) {
      this.logger.error(
        `Error registering webhook for ${shop}:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async handleUninstall(shop: string) {
    await this.shopifyStoreRepository.deleteFromDomain(shop);
    return { success: true };
  }
}
