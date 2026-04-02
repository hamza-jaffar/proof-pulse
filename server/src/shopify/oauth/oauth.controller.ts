import { Controller, Get, HttpCode, Query, Redirect } from '@nestjs/common';
import { OauthService } from './oauth.service';

@Controller('shopify-oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('init')
  @HttpCode(302)
  @Redirect()
  async init(@Query() query: any) {
    return await this.oauthService.init(query);
  }

  @Get('redirect')
  @HttpCode(302)
  @Redirect()
  async redirect(@Query() query: any) {
    return await this.oauthService.redirect(query);
  }
}
