import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/modules/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { httpRequest } from './utils/http-test';

interface AuthResponseBody {
  accessToken: string;
}
interface ProjectResponseBody {
  id: string;
  title: string;
}
interface HealthResponseBody {
  status: string;
  info?: { database?: { status: string } };
}
interface ValidationErrorBody {
  message: string | string[];
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let createdProjectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    // Seed Admin User
    await prisma.user.deleteMany({ where: { email: 'admin@portfolio.com' } });
    const passwordHash = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@portfolio.com',
        passwordHash,
        role: 'ADMIN', // Assuming UserRole enum or string "ADMIN"
        isActive: true,
      },
    });

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/api/health (GET) - should return health status', async () => {
      const response = await httpRequest(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('status');
      const body = response.body as HealthResponseBody;
      expect(body.status).toBe('ok');
      // Adjust based on actual health check response structure if needed
      if (body.info?.database) {
        expect(body.info.database.status).toBe('up');
      }
    });
  });

  describe('Authentication', () => {
    it('/api/auth/signin (POST) - should authenticate and return JWT token', async () => {
      const response = await httpRequest(app)
        .post('/api/auth/signin')
        .send({
          email: 'admin@portfolio.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      const body = response.body as AuthResponseBody;
      expect(typeof body.accessToken).toBe('string');
      expect(body.accessToken.length).toBeGreaterThan(0);

      accessToken = body.accessToken;
    });

    it('/api/auth/signin (POST) - should fail with invalid credentials', async () => {
      await httpRequest(app)
        .post('/api/auth/signin')
        .send({
          email: 'admin@portfolio.com',
          password: 'wrongpassword',
        })
        .expect(401); // Or 400 depending on implementation, usually 401 for bad creds
    });
  });

  describe('Projects CRUD', () => {
    it('/api/projects (POST) - should fail without authentication', async () => {
      await httpRequest(app)
        .post('/api/projects')
        .send({
          title: 'Unauthorized Project',
        })
        .expect(401);
    });

    it('/api/projects (POST) - should create a new project with authentication', async () => {
      // Ensure accessToken is available from previous tests
      expect(accessToken).toBeDefined();

      const response = await httpRequest(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'E2E Test Project',
          slug: 'e2e-test-project-1',
          description: 'Created during E2E testing',
          content: 'E2E Short Content',
          startDate: '2023-01-01T00:00:00.000Z',
          isActive: true,
          technologyIds: [],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      const body = response.body as ProjectResponseBody;
      expect(body.title).toBe('E2E Test Project');
      createdProjectId = body.id;
    });

    it('/api/projects (POST) - should validate required fields', async () => {
      const response = await httpRequest(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '', // Invalid empty title
          // description missing
        })
        .expect(400);

      // ValidationPipe usually returns message array
      expect(response.body as ValidationErrorBody).toHaveProperty('message');
    });

    it('/api/projects (GET) - should list all projects', async () => {
      const response = await httpRequest(app).get('/api/projects').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const project = (response.body as ProjectResponseBody[]).find(
        (item) => item.id === createdProjectId,
      );
      expect(project).toBeDefined();
      expect(project?.title).toBe('E2E Test Project');
    });

    it('/api/projects/:id (GET) - should get a specific project', async () => {
      const response = await httpRequest(app)
        .get(`/api/projects/${createdProjectId}`)
        .expect(200);

      expect((response.body as ProjectResponseBody).id).toBe(createdProjectId);
    });

    it('/api/projects/:id (PATCH) - should update a project', async () => {
      const response = await httpRequest(app)
        .patch(`/api/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Project Title',
        })
        .expect(200);

      expect((response.body as ProjectResponseBody).title).toBe(
        'Updated Project Title',
      );
    });

    it('/api/projects/:id (DELETE) - should delete a project', async () => {
      await httpRequest(app)
        .delete(`/api/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200); // 200 or 204
    });

    it('/api/projects/:id (GET) - should return 404 after deletion', async () => {
      await httpRequest(app)
        .get(`/api/projects/${createdProjectId}`)
        .expect(404);
    });
  });

  describe('Edge Cases', () => {
    it('/api/projects/:id (GET) - should return 404 for non-existent project', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'; // Valid UUID but non-existent
      // If IDs are not UUIDs, adjust accordingly. Prisma usually uses UUID or CUID.
      // Assuming UUID for now based on typical NestJS + Prisma
      // If it throws 500 for invalid ID format, make sure ID format is valid mock.

      await httpRequest(app).get(`/api/projects/${fakeId}`).expect(404);
    });
  });
});
