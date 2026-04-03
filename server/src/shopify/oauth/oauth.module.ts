import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/configuration';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '../../database/database.module';
import { WebhooksModule } from '../webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        timeout: 120000,
      }),
    }),
    DatabaseModule,
    WebhooksModule,
  ],
  controllers: [OauthController],
  providers: [OauthService],
})
export class OauthModule {}
