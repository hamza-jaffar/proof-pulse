import { HttpService } from '@nestjs/axios';
import { Injectable, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { ShopifyStoreRepository } from '../../database/shopify-store.repository';

@Injectable()
export class OauthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly shopifyStoreRepository: ShopifyStoreRepository,
  ) {}

  async init(@Query() query: any) {
    const myres = {
      url: `https://${
        query.shop
      }/admin/oauth/authorize?client_id=${this.configService.get(
        'shopify.appProxy.clientId',
      )}&scope=${this.configService
        .get('shopify.appProxy.scopes')
        .join(',')}&redirect_uri=${this.configService.get(
        'apiUrl',
      )}/shopify-oauth/redirect&state={nonce}&grant_options[]={access_mode}`,
    };
    return myres;
  }

  async redirect(@Query() query: any) {
    const response = await lastValueFrom(
      this.httpService.post(`https://${query.shop}/admin/oauth/access_token`, {
        client_id: this.configService.get('shopify.appProxy.clientId'),
        client_secret: this.configService.get('shopify.appProxy.clientSecret'),
        code: query.code,
      }),
    );

    await this.shopifyStoreRepository.createStore(
      query.shop,
      response.data.access_token,
    );

    return {
      url: `https://${query.shop}/admin/apps?shop=${query.shop}`,
    };
  }
}
