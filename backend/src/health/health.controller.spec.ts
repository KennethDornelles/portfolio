import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../database/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
        {
          provide: PrismaHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health check result', async () => {
      const result = {
        status: 'ok',
        info: {
          database: { status: 'up' },
          api: { status: 'up' },
        },
        error: {},
        details: {
          database: { status: 'up' },
          api: { status: 'up' },
        },
      };

      const checkSpy = jest
        .spyOn(healthCheckService, 'check')
        .mockResolvedValue(result as any);

      expect(await controller.check()).toBe(result);
      expect(checkSpy).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('liveness', () => {
    it('should return liveness status', () => {
      const result = controller.liveness();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
    });
  });

  describe('readiness', () => {
    it('should return readiness check result', async () => {
      const result = {
        status: 'ok',
        info: {
          database: { status: 'up' },
        },
        error: {},
        details: {
          database: { status: 'up' },
        },
      };

      const checkSpy = jest
        .spyOn(healthCheckService, 'check')
        .mockResolvedValue(result as any);

      expect(await controller.readiness()).toBe(result);
      expect(checkSpy).toHaveBeenCalledWith(expect.any(Array));
    });
  });
});
