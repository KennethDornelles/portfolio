import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import { httpRequest } from '../test/utils/http-test';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { ContactsController } from './modules/contacts/contacts.controller';
import { ContactsService } from './modules/contacts/contacts.service';
import { ProjectsController } from './modules/projects/projects.controller';
import { ProjectsService } from './modules/projects/projects.service';
import { TechnologiesController } from './modules/technologies/technologies.controller';
import { TechnologiesService } from './modules/technologies/technologies.service';
import { UsersService } from './modules/users/users.service';

describe('API-001 HTTP contracts', () => {
  let app: INestApplication;

  const usersService = { create: jest.fn() };
  const projectsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySlug: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const technologiesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const contactsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    markAsRead: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [
        AuthController,
        ProjectsController,
        TechnologiesController,
        ContactsController,
      ],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: UsersService, useValue: usersService },
        { provide: ProjectsService, useValue: projectsService },
        { provide: TechnologiesService, useValue: technologiesService },
        { provide: ContactsService, useValue: contactsService },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers through POST /auth/signup with the backend DTO', async () => {
    usersService.create.mockResolvedValue({ id: 'user-id' });

    await httpRequest(app)
      .post('/api/auth/signup')
      .send({ email: 'user@example.com', password: 'password123' })
      .expect(201);

    expect(usersService.create).toHaveBeenCalledWith({
      email: 'user@example.com',
      passwordHash: 'password123',
    });
  });

  it('supports project create, PATCH update and delete, but not PUT', async () => {
    const payload = {
      title: 'Contract project',
      slug: 'contract-project',
      description: 'Contract test',
      technologyIds: [],
      isActive: true,
    };
    projectsService.create.mockResolvedValue({ id: 'project-id', ...payload });
    projectsService.update.mockResolvedValue({ id: 'project-id', ...payload });
    projectsService.remove.mockResolvedValue({ id: 'project-id' });

    await httpRequest(app).post('/api/projects').send(payload).expect(201);
    await httpRequest(app)
      .patch('/api/projects/project-id')
      .send({ title: 'Updated project' })
      .expect(200);
    await httpRequest(app)
      .put('/api/projects/project-id')
      .send(payload)
      .expect(404);
    await httpRequest(app).delete('/api/projects/project-id').expect(200);

    expect(projectsService.update).toHaveBeenCalledWith('project-id', {
      title: 'Updated project',
    });
  });

  it('supports technology create, PATCH update and delete, but not PUT', async () => {
    const payload = {
      name: 'Contract technology',
      category: 'Backend',
      proficiencyLevel: 80,
    };
    technologiesService.create.mockResolvedValue({
      id: 'technology-id',
      ...payload,
    });
    technologiesService.update.mockResolvedValue({
      id: 'technology-id',
      ...payload,
    });
    technologiesService.remove.mockResolvedValue({ id: 'technology-id' });

    await httpRequest(app).post('/api/technologies').send(payload).expect(201);
    await httpRequest(app)
      .patch('/api/technologies/technology-id')
      .send({ proficiencyLevel: 90 })
      .expect(200);
    await httpRequest(app)
      .put('/api/technologies/technology-id')
      .send(payload)
      .expect(404);
    await httpRequest(app)
      .delete('/api/technologies/technology-id')
      .expect(200);

    expect(technologiesService.update).toHaveBeenCalledWith('technology-id', {
      proficiencyLevel: 90,
    });
  });

  it('lists, marks as read and deletes contacts through matching routes', async () => {
    contactsService.findAll.mockResolvedValue([]);
    contactsService.markAsRead.mockResolvedValue({
      id: 'contact-id',
      readAt: new Date('2026-08-31T12:00:00.000Z'),
    });
    contactsService.remove.mockResolvedValue({ id: 'contact-id' });

    await httpRequest(app).get('/api/contacts').expect(200, []);
    await httpRequest(app)
      .patch('/api/contacts/contact-id/read')
      .send({})
      .expect(200);
    await httpRequest(app)
      .patch('/api/contacts/contact-id')
      .send({ read: true })
      .expect(404);
    await httpRequest(app).delete('/api/contacts/contact-id').expect(200);

    expect(contactsService.markAsRead).toHaveBeenCalledWith('contact-id');
    expect(contactsService.remove).toHaveBeenCalledWith('contact-id');
  });
});
