import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WebhooksService } from './webhooks.service';
import { ShopifyStoreRepository } from '../../database/shopify-store.repository';

describe('WebhooksService', () => {
  let service: WebhooksService;
  let shopifyStoreRepository: ShopifyStoreRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhooksService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000'),
          },
        },
        {
          provide: ShopifyStoreRepository,
          useValue: {
            deleteFromDomain: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<WebhooksService>(WebhooksService);
    shopifyStoreRepository = module.get<ShopifyStoreRepository>(ShopifyStoreRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call deleteFromDomain on uninstall', async () => {
    await service.handleUninstall('example-shop.myshopify.com');

    expect(shopifyStoreRepository.deleteFromDomain).toHaveBeenCalledWith(
      'example-shop.myshopify.com',
    );
  });
});
