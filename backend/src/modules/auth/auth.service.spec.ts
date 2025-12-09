import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyApiKey', () => {
    it('should return success message with timestamp', async () => {
      const result = await service.verifyApiKey();

      expect(result).toHaveProperty('message', 'API Key válida');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
      expect(() => new Date(result.timestamp)).not.toThrow();
    });

    it('should return current timestamp in ISO format', async () => {
      const beforeCall = new Date();
      const result = await service.verifyApiKey();
      const afterCall = new Date();
      const timestamp = new Date(result.timestamp);

      expect(timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
      expect(timestamp.getTime()).toBeLessThanOrEqual(afterCall.getTime());
    });

    it('should return consistent message structure', async () => {
      const result1 = await service.verifyApiKey();
      const result2 = await service.verifyApiKey();

      expect(result1.message).toBe(result2.message);
      expect(typeof result1.timestamp).toBe(typeof result2.timestamp);
    });
  });
});
