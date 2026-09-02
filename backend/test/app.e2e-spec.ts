import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/modules/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { httpRequest } from './utils/http-test';
import { closeE2eInfrastructure } from './e2e-teardown';

interface AuthResponseBody {
  accessToken: string;
  refreshToken?: string;
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
  let refreshToken: string;
  let createdProjectId: string;
  let projectsListEtag: string;
  let seededAdminId: string;
  const e2eAdminEmail = `e2e-admin-${Date.now()}@example.test`;
  const e2eAdminPassword = `E2ePassword-${Date.now()}-safe`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    // Seed Admin User
    const passwordHash = await bcrypt.hash(e2eAdminPassword, 10);
    const seededAdmin = await prisma.user.create({
      data: {
        email: e2eAdminEmail,
        passwordHash,
        role: 'ADMIN', // Assuming UserRole enum or string "ADMIN"
        isActive: true,
      },
    });
    seededAdminId = seededAdmin.id;

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
    try {
      if (createdProjectId) {
        await prisma.project.deleteMany({ where: { id: createdProjectId } });
      }
      if (seededAdminId) {
        await prisma.user.delete({ where: { id: seededAdminId } });
      }
    } finally {
      await closeE2eInfrastructure(app, prisma);
    }
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
          email: e2eAdminEmail,
          password: e2eAdminPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      const body = response.body as AuthResponseBody;
      expect(typeof body.accessToken).toBe('string');
      expect(body.accessToken.length).toBeGreaterThan(0);

      accessToken = body.accessToken;
      refreshToken = body.refreshToken ?? '';
    });

    it('/api/auth/signin (POST) - should fail with invalid credentials', async () => {
      await httpRequest(app)
        .post('/api/auth/signin')
        .send({
          email: e2eAdminEmail,
          password: 'wrongpassword',
        })
        .expect(401); // Or 400 depending on implementation, usually 401 for bad creds
    });
  });

  describe('Critical public and refresh journeys', () => {
    it('/api/i18n/PT_BR returns seeded translations publicly', async () => {
      const response = await httpRequest(app)
        .get('/api/i18n/PT_BR')
        .expect(200);
      const body = response.body as Record<string, string>;
      expect(body.NAV_HOME).toBeDefined();
      expect(body.HOME_TITLE_1).toBeDefined();
      expect(body.BTN_VIEW_PROJECTS).toBeDefined();
    });

    it('/api/contacts accepts a public submission', async () => {
      const response = await httpRequest(app)
        .post('/api/contacts')
        .send({
          name: 'TEST-001 Visitor',
          email: `e2e-contact-${Date.now()}@example.test`,
          subject: 'Test',
          message: 'Test',
        })
        .expect(201);
      expect(response.body).toEqual({ success: true });
    });

    it('/api/auth/refresh rotates the refresh token', async () => {
      const response = await httpRequest(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200);
      const body = response.body as AuthResponseBody;
      expect(body.refreshToken).toEqual(expect.any(String));
      expect(body.refreshToken).not.toBe(refreshToken);
      await httpRequest(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(403);
      refreshToken = body.refreshToken as string;
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
      projectsListEtag = response.headers.etag;
      expect(projectsListEtag).toBeTruthy();
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

      const refreshed = await httpRequest(app)
        .get('/api/projects')
        .set('If-None-Match', projectsListEtag)
        .expect(200);
      expect(
        (refreshed.body as ProjectResponseBody[]).find(
          (item) => item.id === createdProjectId,
        )?.title,
      ).toBe('Updated Project Title');
      expect(refreshed.headers.etag).not.toBe(projectsListEtag);
      projectsListEtag = refreshed.headers.etag;
    });

    it('/api/projects/:id (DELETE) - should delete a project', async () => {
      await httpRequest(app)
        .delete(`/api/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200); // 200 or 204

      const refreshed = await httpRequest(app)
        .get('/api/projects')
        .set('If-None-Match', projectsListEtag)
        .expect(200);
      expect(
        (refreshed.body as ProjectResponseBody[]).some(
          (item) => item.id === createdProjectId,
        ),
      ).toBe(false);
    });

    it('/api/projects/:id (GET) - should return 404 after deletion', async () => {
      await httpRequest(app)
        .get(`/api/projects/${createdProjectId}`)
        .expect(404);
    });

    it('/api/projects/:id (DELETE) - should return 404 when repeated', async () => {
      await httpRequest(app)
        .delete(`/api/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
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
