import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

describe('WebhooksController', () => {
  let controller: WebhooksController;
  let webhooksService: WebhooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [
        {
          provide: WebhooksService,
          useValue: {
            handleUninstall: jest.fn().mockResolvedValue({ success: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<WebhooksController>(WebhooksController);
    webhooksService = module.get<WebhooksService>(WebhooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate uninstall to service', async () => {
    const response = await controller.handleUninstall(
      'example-shop.myshopify.com',
      {} as any,
    );

    expect(webhooksService.handleUninstall).toHaveBeenCalledWith(
      'example-shop.myshopify.com',
    );
    expect(response).toEqual({ success: true });
  });
});
