import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/modules/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { httpRequest } from './utils/http-test';
import { closeE2eInfrastructure } from './e2e-teardown';

interface AuthResponseBody {
  accessToken: string;
}
interface TechnologyResponseBody {
  id: string;
  name: string;
}

describe('TechnologiesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let createdTechId: string;
  let seededAdminId: string;
  const e2eAdminEmail = `e2e-tech-admin-${Date.now()}@example.test`;
  const e2eAdminPassword = `E2eTechPassword-${Date.now()}-safe`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Seed Data
    prisma = app.get<PrismaService>(PrismaService);
    const passwordHash = await bcrypt.hash(e2eAdminPassword, 10);
    const seededAdmin = await prisma.user.create({
      data: {
        email: e2eAdminEmail,
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
    });
    seededAdminId = seededAdmin.id;

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    // Login
    const loginRes = await httpRequest(app)
      .post('/api/auth/signin')
      .send({ email: e2eAdminEmail, password: e2eAdminPassword })
      .expect(200);

    accessToken = (loginRes.body as AuthResponseBody).accessToken;
  });

  afterAll(async () => {
    try {
      if (createdTechId) {
        await prisma.technology.deleteMany({ where: { id: createdTechId } });
      }
      if (seededAdminId) {
        await prisma.user.delete({ where: { id: seededAdminId } });
      }
    } finally {
      await closeE2eInfrastructure(app, prisma);
    }
  });

  describe('Public Access', () => {
    it('/api/technologies (GET) - should list all technologies publicly', async () => {
      const response = await httpRequest(app)
        .get('/api/technologies')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Admin Access - CRUD', () => {
    const newTech = {
      name: 'NestJS E2E ' + Date.now(),
      icon: 'https://nestjs.com/logo.svg',
    };

    it('/api/technologies (POST) - should fail without authentication', async () => {
      await httpRequest(app)
        .post('/api/technologies')
        .send(newTech)
        .expect(401);
    });

    it('/api/technologies (POST) - should create new technology with admin token', async () => {
      const response = await httpRequest(app)
        .post('/api/technologies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newTech)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      const body = response.body as TechnologyResponseBody;
      expect(body.name).toBe(newTech.name);
      createdTechId = body.id;
    });

    it('/api/technologies/:id (PATCH) - should update technology', async () => {
      const updateData = { name: newTech.name + ' Updated' };
      const response = await httpRequest(app)
        .patch(`/api/technologies/${createdTechId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect((response.body as TechnologyResponseBody).name).toBe(
        updateData.name,
      );
    });

    it('/api/technologies/:id (DELETE) - should delete technology', async () => {
      await httpRequest(app)
        .delete(`/api/technologies/${createdTechId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify deletion
      await httpRequest(app)
        .get(`/api/technologies`)
        .expect(200)
        .then((res) => {
          const found = (res.body as TechnologyResponseBody[]).find(
            (technology) => technology.id === createdTechId,
          );
          expect(found).toBeUndefined();
        });
    });
  });
});
