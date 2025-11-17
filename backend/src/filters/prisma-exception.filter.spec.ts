import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaExceptionFilter } from './prisma-exception.filter';

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;

  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson,
  }));
  const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
  }));
  const mockGetRequest = jest.fn().mockImplementation(() => ({
    url: '/test',
    method: 'POST',
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
      providers: [PrismaExceptionFilter],
    }).compile();

    filter = module.get<PrismaExceptionFilter>(PrismaExceptionFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('PrismaClientKnownRequestError', () => {
    it('should handle P2002 - Unique constraint violation', () => {
      const exception = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: { target: ['email'] },
        },
      );

      filter.catch(exception, mockArgumentsHost as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 409,
          message: 'Já existe um registro com este(s) valor(es) para: email',
          error: 'UniqueConstraintViolation',
          code: 'P2002',
        }),
      );
    });

    it('should handle P2025 - Record not found', () => {
      const exception = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        {
          code: 'P2025',
          clientVersion: '5.0.0',
        },
      );

      filter.catch(exception, mockArgumentsHost as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: 'Registro não encontrado',
          error: 'NotFound',
          code: 'P2025',
        }),
      );
    });

    it('should handle P2003 - Foreign key constraint violation', () => {
      const exception = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed',
        {
          code: 'P2003',
          clientVersion: '5.0.0',
        },
      );

      filter.catch(exception, mockArgumentsHost as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          error: 'ForeignKeyConstraintViolation',
          code: 'P2003',
        }),
      );
    });

    it('should handle P2014 - Dependent records exist', () => {
      const exception = new Prisma.PrismaClientKnownRequestError(
        'Required relation violation',
        {
          code: 'P2014',
          clientVersion: '5.0.0',
        },
      );

      filter.catch(exception, mockArgumentsHost as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 409,
          message:
            'Não é possível excluir registro pois existem registros dependentes',
          error: 'DependentRecordsExist',
          code: 'P2014',
        }),
      );
    });

    it('should handle P1001 - Database connection error', () => {
      const exception = new Prisma.PrismaClientKnownRequestError(
        "Can't reach database server",
        {
          code: 'P1001',
          clientVersion: '5.0.0',
        },
      );

      filter.catch(exception, mockArgumentsHost as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 503,
          message: 'Não foi possível conectar ao banco de dados',
          error: 'DatabaseConnectionError',
          code: 'P1001',
        }),
      );
    });

    it('should handle unknown Prisma error code', () => {
      const exception = new Prisma.PrismaClientKnownRequestError(
        'Unknown error',
        {
          code: 'P9999',
          clientVersion: '5.0.0',
        },
      );

      filter.catch(exception, mockArgumentsHost as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: 'Erro ao processar operação no banco de dados',
          error: 'DatabaseError',
        }),
      );
    });
  });

  describe('PrismaClientValidationError', () => {
    it('should handle validation error', () => {
      const exception = new Prisma.PrismaClientValidationError(
        'Invalid query',
        { clientVersion: '5.0.0' },
      );

      filter.catch(exception, mockArgumentsHost as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Erro de validação nos dados fornecidos',
          error: 'ValidationError',
        }),
      );
    });
  });

  it('should include details in development environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const exception = new Prisma.PrismaClientKnownRequestError('Test error', {
      code: 'P2002',
      clientVersion: '5.0.0',
      meta: { target: ['email'] },
    });

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.objectContaining({
          originalMessage: expect.any(String),
          meta: { target: ['email'] },
        }),
      }),
    );

    process.env.NODE_ENV = originalEnv;
  });
});
