import { HttpService } from '@nestjs/axios';
import { Injectable, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OauthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  global_access_token = '';

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
    console.log(myres);
    return myres;
  }

  async redirect(@Query() query: any) {
    console.log('i am in redirect ' + query.code);
    const response = await lastValueFrom(
      this.httpService.post(`https://${query.shop}/admin/oauth/access_token`, {
        client_id: this.configService.get('shopify.appProxy.clientId'),
        client_secret: this.configService.get('shopify.appProxy.clientSecret'),
        code: query.code,
      }),
    );
  

    console.log('Token Response - ' + String(response.data));
    console.log('Token Response2 - ' + response.data.access_token);
    this.global_access_token = response.data.access_token;

    return {
      url: `https://${query.shop}/admin/apps?shop=${query.shop}`,
    };
  }
}
