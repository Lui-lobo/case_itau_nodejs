import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { LoggerService } from '../../common/logger/logger.service';

describe('PrismaService', () => {
  let service: PrismaService;

  // Mock simples do logger
  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    format: jest.fn((msg: string) => msg),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect and seed default client on init', async () => {
    // Mockando métodos do Prisma
    (service as any).client = {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 1 }),
    };

    await service.onModuleInit();

    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('Default API Client criado'),
      'PrismaService',
    );
  });
});
