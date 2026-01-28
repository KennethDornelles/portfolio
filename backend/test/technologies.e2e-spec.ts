import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/modules/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('TechnologiesController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdTechId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Seed Data
    const prisma = app.get<PrismaService>(PrismaService);
    await prisma.user.deleteMany({ where: { email: 'tech_admin@portfolio.com' } });
    const passwordHash = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        email: 'tech_admin@portfolio.com',
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
    });

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    
    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/signin')
      .send({ email: 'tech_admin@portfolio.com', password: 'password123' })
      .expect(200);

    accessToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Public Access', () => {
    it('/api/technologies (GET) - should list all technologies publicly', async () => {
      const response = await request(app.getHttpServer())
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
      await request(app.getHttpServer())
        .post('/api/technologies')
        .send(newTech)
        .expect(401);
    });

    it('/api/technologies (POST) - should create new technology with admin token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/technologies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newTech)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newTech.name);
      createdTechId = response.body.id;
    });

    it('/api/technologies/:id (PATCH) - should update technology', async () => {
      const updateData = { name: newTech.name + ' Updated' };
      const response = await request(app.getHttpServer())
        .patch(`/api/technologies/${createdTechId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
    });

    it('/api/technologies/:id (DELETE) - should delete technology', async () => {
      await request(app.getHttpServer())
        .delete(`/api/technologies/${createdTechId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/api/technologies`)
        .expect(200)
        .then((res) => {
            const found = res.body.find((t: any) => t.id === createdTechId);
            expect(found).toBeUndefined();
        });
    });
  });
});
