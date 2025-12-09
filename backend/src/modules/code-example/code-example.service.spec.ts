import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CodeExampleService } from './code-example.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateCodeExampleDto } from './dto/create-code-example.dto';
import { UpdateCodeExampleDto } from './dto/update-code-example.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto';

describe('CodeExampleService', () => {
  let service: CodeExampleService;
  let prisma: PrismaService;

  const mockCodeExample = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Autenticação JWT em Node.js',
    description: 'Exemplo de implementação de autenticação usando JWT',
    code: 'const jwt = require("jsonwebtoken");',
    language: 'javascript',
    tags: ['JWT', 'Authentication', 'Security'],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    codeExample: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeExampleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CodeExampleService>(CodeExampleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new code example', async () => {
      const createDto: CreateCodeExampleDto = {
        title: 'Autenticação JWT em Node.js',
        description: 'Exemplo de implementação de autenticação usando JWT',
        code: 'const jwt = require("jsonwebtoken");',
        language: 'javascript',
        tags: ['JWT', 'Authentication', 'Security'],
        active: true,
      };

      jest
        .spyOn(prisma.codeExample, 'create')
        .mockResolvedValue(mockCodeExample);

      const result = await service.create(createDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toEqual(mockCodeExample);
    });

    it('should create code example with minimal required fields', async () => {
      const createDto: CreateCodeExampleDto = {
        title: 'Simple Example',
        code: 'console.log("test");',
        language: 'javascript',
        tags: ['test'],
      };

      const minimalExample = {
        ...mockCodeExample,
        title: createDto.title,
        code: createDto.code,
        language: createDto.language,
        tags: createDto.tags,
        description: null,
      };

      jest
        .spyOn(prisma.codeExample, 'create')
        .mockResolvedValue(minimalExample);

      const result = await service.create(createDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toEqual(minimalExample);
    });
  });

  describe('findAll', () => {
    it('should return all code examples without pagination', async () => {
      const mockExamples = [mockCodeExample];
      jest
        .spyOn(prisma.codeExample, 'findMany')
        .mockResolvedValue(mockExamples);

      const result = await service.findAll();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockExamples);
    });

    it('should return paginated code examples', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const mockExamples = [mockCodeExample];
      const totalCount = 1;

      jest
        .spyOn(prisma.codeExample, 'findMany')
        .mockResolvedValue(mockExamples);
      jest.spyOn(prisma.codeExample, 'count').mockResolvedValue(totalCount);

      const result = await service.findAll(paginationDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.count).toHaveBeenCalled();
      expect(result).toBeInstanceOf(PaginatedResponseDto);
      expect(
        (result as PaginatedResponseDto<typeof mockCodeExample>).data,
      ).toEqual(mockExamples);
    });

    it('should calculate correct skip value for pagination', async () => {
      const paginationDto: PaginationDto = { page: 3, limit: 5 };
      jest.spyOn(prisma.codeExample, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.codeExample, 'count').mockResolvedValue(0);

      await service.findAll(paginationDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findMany).toHaveBeenCalledWith({
        skip: 10, // (3-1) * 5
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should use default pagination values when not provided', async () => {
      const paginationDto: PaginationDto = {};
      jest.spyOn(prisma.codeExample, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.codeExample, 'count').mockResolvedValue(0);

      await service.findAll(paginationDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findMany).toHaveBeenCalledWith({
        skip: 0, // (1-1) * 10
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findActive', () => {
    it('should return only active code examples', async () => {
      const mockActiveExamples = [mockCodeExample];
      jest
        .spyOn(prisma.codeExample, 'findMany')
        .mockResolvedValue(mockActiveExamples);

      const result = await service.findActive();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findMany).toHaveBeenCalledWith({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockActiveExamples);
    });

    it('should return empty array when no active examples exist', async () => {
      jest.spyOn(prisma.codeExample, 'findMany').mockResolvedValue([]);

      const result = await service.findActive();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('findByLanguage', () => {
    it('should return code examples filtered by language', async () => {
      const language = 'javascript';
      const mockExamples = [mockCodeExample];
      jest
        .spyOn(prisma.codeExample, 'findMany')
        .mockResolvedValue(mockExamples);

      const result = await service.findByLanguage(language);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findMany).toHaveBeenCalledWith({
        where: { language },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockExamples);
    });

    it('should return empty array when no examples for language exist', async () => {
      const language = 'rust';
      jest.spyOn(prisma.codeExample, 'findMany').mockResolvedValue([]);

      const result = await service.findByLanguage(language);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findMany).toHaveBeenCalledWith({
        where: { language },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([]);
    });

    it('should be case-sensitive for language filter', async () => {
      const language = 'JavaScript'; // Different case
      jest.spyOn(prisma.codeExample, 'findMany').mockResolvedValue([]);

      await service.findByLanguage(language);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findMany).toHaveBeenCalledWith({
        where: { language: 'JavaScript' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single code example by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      jest
        .spyOn(prisma.codeExample, 'findUnique')
        .mockResolvedValue(mockCodeExample);

      const result = await service.findOne(id);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockCodeExample);
    });

    it('should throw NotFoundException when code example does not exist', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      jest.spyOn(prisma.codeExample, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(id)).rejects.toThrow(
        `Code example with ID ${id} not found`,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('update', () => {
    it('should update a code example', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCodeExampleDto = {
        title: 'Updated Title',
        active: false,
      };

      const updatedCodeExample = {
        ...mockCodeExample,
        ...updateDto,
      };

      jest
        .spyOn(prisma.codeExample, 'findUnique')
        .mockResolvedValue(mockCodeExample);
      jest
        .spyOn(prisma.codeExample, 'update')
        .mockResolvedValue(updatedCodeExample);

      const result = await service.update(id, updateDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.update).toHaveBeenCalledWith({
        where: { id },
        data: updateDto,
      });
      expect(result).toEqual(updatedCodeExample);
    });

    it('should throw NotFoundException when updating non-existent code example', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCodeExampleDto = { title: 'Updated' };

      jest.spyOn(prisma.codeExample, 'findUnique').mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(id, updateDto)).rejects.toThrow(
        `Code example with ID ${id} not found`,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.update).not.toHaveBeenCalled();
    });

    it('should allow partial updates', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCodeExampleDto = { active: false };

      jest
        .spyOn(prisma.codeExample, 'findUnique')
        .mockResolvedValue(mockCodeExample);
      jest.spyOn(prisma.codeExample, 'update').mockResolvedValue({
        ...mockCodeExample,
        active: false,
      });

      const result = await service.update(id, updateDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.update).toHaveBeenCalledWith({
        where: { id },
        data: updateDto,
      });
      expect(result.active).toBe(false);
      expect(result.title).toBe(mockCodeExample.title); // Other fields unchanged
    });
  });

  describe('remove', () => {
    it('should remove a code example', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      jest
        .spyOn(prisma.codeExample, 'findUnique')
        .mockResolvedValue(mockCodeExample);
      jest
        .spyOn(prisma.codeExample, 'delete')
        .mockResolvedValue(mockCodeExample);

      const result = await service.remove(id);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockCodeExample);
    });

    it('should throw NotFoundException when removing non-existent code example', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      jest.spyOn(prisma.codeExample, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      await expect(service.remove(id)).rejects.toThrow(
        `Code example with ID ${id} not found`,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.codeExample.delete).not.toHaveBeenCalled();
    });
  });
});
