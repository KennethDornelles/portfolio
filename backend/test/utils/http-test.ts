import { INestApplication } from '@nestjs/common';
import { Server } from 'node:http';
import request, { SuperTest, Test } from 'supertest';

export function httpRequest(app: INestApplication): SuperTest<Test> {
  return request(app.getHttpServer() as unknown as Server);
}
