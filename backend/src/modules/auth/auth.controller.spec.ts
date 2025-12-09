import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            verifyApiKey: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('verify', () => {
    it('should call authService.verifyApiKey', async () => {
      const mockResult = {
        message: 'API Key válida',
        timestamp: new Date().toISOString(),
      };

      jest.spyOn(service, 'verifyApiKey').mockResolvedValue(mockResult);

      const result = await controller.verify();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.verifyApiKey).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });

    it('should return correct structure from service', async () => {
      const mockResult = {
        message: 'API Key válida',
        timestamp: '2025-12-08T10:30:00.000Z',
      };

      jest.spyOn(service, 'verifyApiKey').mockResolvedValue(mockResult);

      const result = await controller.verify();

      expect(result).toHaveProperty('message', 'API Key válida');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'verifyApiKey').mockRejectedValue(error);

      await expect(controller.verify()).rejects.toThrow('Service error');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.verifyApiKey).toHaveBeenCalled();
    });

    it('should call verifyApiKey without parameters', async () => {
      const mockResult = {
        message: 'API Key válida',
        timestamp: new Date().toISOString(),
      };

      const verifySpy = jest
        .spyOn(service, 'verifyApiKey')
        .mockResolvedValue(mockResult);

      await controller.verify();

      expect(verifySpy).toHaveBeenCalledWith();
      expect(verifySpy).toHaveBeenCalledTimes(1);
    });
  });
});
