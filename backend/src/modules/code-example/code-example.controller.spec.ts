import { Test, TestingModule } from '@nestjs/testing';
import { CodeExampleController } from './code-example.controller';
import { CodeExampleService } from './code-example.service';
import { CreateCodeExampleDto } from './dto/create-code-example.dto';
import { UpdateCodeExampleDto } from './dto/update-code-example.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto';
import { NotFoundException } from '@nestjs/common';

describe('CodeExampleController', () => {
  let controller: CodeExampleController;
  let service: CodeExampleService;

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

  const mockCodeExampleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findActive: jest.fn(),
    findByLanguage: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeExampleController],
      providers: [
        {
          provide: CodeExampleService,
          useValue: mockCodeExampleService,
        },
      ],
    }).compile();

    controller = module.get<CodeExampleController>(CodeExampleController);
    service = module.get<CodeExampleService>(CodeExampleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      jest.spyOn(service, 'create').mockResolvedValue(mockCodeExample);

      const result = await controller.create(createDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCodeExample);
    });

    it('should call service with correct data', async () => {
      const createDto: CreateCodeExampleDto = {
        title: 'Test Example',
        code: 'console.log("test");',
        language: 'javascript',
        tags: ['test'],
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockCodeExample);

      await controller.create(createDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.create).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all code examples without pagination', async () => {
      const mockExamples = [mockCodeExample];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockExamples);

      const result = await controller.findAll();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockExamples);
    });

    it('should return paginated code examples', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const mockPaginatedResponse = new PaginatedResponseDto(
        [mockCodeExample],
        1,
        1,
        10,
      );

      jest.spyOn(service, 'findAll').mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(undefined, paginationDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should filter by language when provided', async () => {
      const language = 'javascript';
      const mockExamples = [mockCodeExample];

      jest.spyOn(service, 'findByLanguage').mockResolvedValue(mockExamples);

      const result = await controller.findAll(language);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findByLanguage).toHaveBeenCalledWith(language);
      expect(result).toEqual(mockExamples);
    });

    it('should not call findAll when language filter is provided', async () => {
      const language = 'typescript';
      jest.spyOn(service, 'findByLanguage').mockResolvedValue([]);

      await controller.findAll(language);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findByLanguage).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findAll).not.toHaveBeenCalled();
    });
  });

  describe('findActive', () => {
    it('should return all active code examples', async () => {
      const mockActiveExamples = [mockCodeExample];
      jest.spyOn(service, 'findActive').mockResolvedValue(mockActiveExamples);

      const result = await controller.findActive();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findActive).toHaveBeenCalled();
      expect(result).toEqual(mockActiveExamples);
    });

    it('should return empty array when no active examples exist', async () => {
      jest.spyOn(service, 'findActive').mockResolvedValue([]);

      const result = await controller.findActive();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findActive).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single code example by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCodeExample);

      const result = await controller.findOne(id);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockCodeExample);
    });

    it('should throw NotFoundException when code example does not exist', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const error = new NotFoundException(
        `Code example with ID ${id} not found`,
      );

      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findOne).toHaveBeenCalledWith(id);
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

      jest.spyOn(service, 'update').mockResolvedValue(updatedCodeExample);

      const result = await controller.update(id, updateDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(updatedCodeExample);
    });

    it('should throw NotFoundException when updating non-existent code example', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCodeExampleDto = { title: 'Updated' };
      const error = new NotFoundException(
        `Code example with ID ${id} not found`,
      );

      jest.spyOn(service, 'update').mockRejectedValue(error);

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should allow partial updates', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCodeExampleDto = { active: false };

      jest.spyOn(service, 'update').mockResolvedValue({
        ...mockCodeExample,
        active: false,
      });

      const result = await controller.update(id, updateDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result.active).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove a code example', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      jest.spyOn(service, 'remove').mockResolvedValue(mockCodeExample);

      const result = await controller.remove(id);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockCodeExample);
    });

    it('should throw NotFoundException when removing non-existent code example', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const error = new NotFoundException(
        `Code example with ID ${id} not found`,
      );

      jest.spyOn(service, 'remove').mockRejectedValue(error);

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
