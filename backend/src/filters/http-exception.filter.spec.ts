import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson,
  }));
  const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
  }));
  const mockGetRequest = jest.fn().mockImplementation(() => ({
    url: '/test',
    method: 'GET',
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
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch HttpException and format response', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(1);
    expect(mockGetResponse).toHaveBeenCalledTimes(1);
    expect(mockGetRequest).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Test error',
        error: 'HttpException',
        path: '/test',
        method: 'GET',
        timestamp: expect.any(String),
      }),
    );
  });

  it('should handle HttpException with object response', () => {
    const exception = new HttpException(
      {
        message: ['error 1', 'error 2'],
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: ['error 1', 'error 2'],
        error: 'Bad Request',
      }),
    );
  });

  it('should include details in development environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const exception = new HttpException(
      { message: 'Test', extra: 'data' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        details: { message: 'Test', extra: 'data' },
      }),
    );

    process.env.NODE_ENV = originalEnv;
  });
});
