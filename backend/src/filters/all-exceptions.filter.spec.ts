import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson,
  }));
  const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
  }));
  const mockGetRequest = jest.fn().mockImplementation(() => ({
    url: '/test',
    method: 'DELETE',
  }));
  const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: mockGetRequest,
  }));

  const mockArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch HttpException', () => {
    const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: 'Not found',
        error: 'HttpException',
        path: '/test',
        method: 'DELETE',
      }),
    );
  });

  it('should catch generic Error', () => {
    const exception = new Error('Something went wrong');

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Something went wrong',
        error: 'Error',
      }),
    );
  });

  it('should catch unknown exceptions', () => {
    const exception = 'string error';

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Erro interno do servidor',
        error: 'InternalServerError',
      }),
    );
  });

  it('should include stack trace in development environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const exception = new Error('Test error');

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.objectContaining({
          stack: expect.any(String),
        }),
      }),
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should not include stack trace in production environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const exception = new Error('Test error');

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockJson).toHaveBeenCalledWith(
      expect.not.objectContaining({
        details: expect.anything(),
      }),
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle HttpException with complex response', () => {
    const exception = new HttpException(
      {
        message: 'Validation failed',
        errors: ['Field 1', 'Field 2'],
      },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        // A mensagem pode ser um array ou string dependendo da resposta
        message: expect.anything(),
        error: 'HttpException',
      }),
    );
  });
});
