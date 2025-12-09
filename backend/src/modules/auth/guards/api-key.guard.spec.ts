import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ApiKeyGuard } from './api-key.guard';
import { IS_PUBLIC_KEY } from '../../../decorators';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let reflector: Reflector;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    guard = module.get<ApiKeyGuard>(ApiKeyGuard);
    reflector = module.get<Reflector>(Reflector);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockExecutionContext: Partial<ExecutionContext>;
    let mockRequest: any;

    beforeEach(() => {
      mockRequest = {
        headers: {},
      };

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      };

      mockConfigService.get.mockReturnValue('test-api-key');
    });

    it('should allow access to public routes', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);

      const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler!(),
        mockExecutionContext.getClass!(),
      ]);
    });

    it('should throw UnauthorizedException when API key is missing', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(UnauthorizedException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('API Key não fornecida');
    });

    it('should throw UnauthorizedException when API key is invalid', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers['x-api-key'] = 'invalid-key';

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(UnauthorizedException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('API Key inválida');
    });

    it('should allow access when API key is valid', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers['x-api-key'] = 'test-api-key';

      const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should check both handler and class for public decorator', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers['x-api-key'] = 'test-api-key';

      guard.canActivate(mockExecutionContext as ExecutionContext);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler!(),
        mockExecutionContext.getClass!(),
      ]);
    });

    it('should retrieve API key from correct header', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers = {
        'x-api-key': 'test-api-key',
        authorization: 'Bearer token',
        'other-header': 'value',
      };

      const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should be case-sensitive for API key validation', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      // Criar novo guard com API key case-sensitive
      const caseSensitiveConfigService = {
        get: jest.fn().mockReturnValue('Test-API-Key'),
      };
      const caseSensitiveGuard = new ApiKeyGuard(
        reflector,
        caseSensitiveConfigService as any,
      );
      mockRequest.headers['x-api-key'] = 'test-api-key';

      expect(() => {
        caseSensitiveGuard.canActivate(
          mockExecutionContext as ExecutionContext,
        );
      }).toThrow(UnauthorizedException);
    });

    it('should prioritize public route over API key validation', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      // Não define API key no header

      const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
      // Não deve chamar getRequest se a rota é pública
    });

    it('should handle empty string API key', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers['x-api-key'] = '';

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(UnauthorizedException);
    });

    it('should handle whitespace-only API key', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers['x-api-key'] = '   ';
      mockConfigService.get.mockReturnValue('test-api-key');

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(UnauthorizedException);
    });
  });

  describe('constructor', () => {
    it('should retrieve API key from config on initialization', () => {
      mockConfigService.get.mockReturnValue('my-api-key');

      const newGuard = new ApiKeyGuard(
        reflector,
        configService as ConfigService,
      );

      expect(newGuard).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(configService.get).toHaveBeenCalledWith('apiKey');
    });

    it('should handle missing API key configuration', () => {
      mockConfigService.get.mockReturnValue(undefined);

      const newGuard = new ApiKeyGuard(
        reflector,
        configService as ConfigService,
      );

      expect(newGuard).toBeDefined();
    });

    it('should handle empty string API key configuration', () => {
      mockConfigService.get.mockReturnValue('');

      const newGuard = new ApiKeyGuard(
        reflector,
        configService as ConfigService,
      );

      expect(newGuard).toBeDefined();
    });
  });
});
