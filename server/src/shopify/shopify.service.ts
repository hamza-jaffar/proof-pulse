import { Injectable } from '@nestjs/common';

@Injectable()
export class ShopifyService {
  welcome(): string {
    return 'You are here is shopify service';
  }
}
