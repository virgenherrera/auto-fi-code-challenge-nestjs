import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { getProviderFilePath } from '../../utils';

const endpoint = '/cars/csv-upload';

describe(`E2E: POST ${endpoint}`, () => {
  const enum should {
    initApp = 'Should init app properly.',
    postProviderA = `Should create Records for PROVIDER_A`,
    postProviderB = `Should create Records for PROVIDER_B`,
    postProviderC = `Should create Records for PROVIDER_C`,
    postNonProvider = `Should not create any Records for Non registered provider`,
  }
  let app: INestApplication = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(should.initApp, () => {
    expect(app).not.toBeNull();
  });

  it(should.postProviderA, async () => {
    const providerFilepath = getProviderFilePath('provider_a');
    const { status, body } = await request(app.getHttpServer())
      .post(endpoint)
      .set('Content-Type', 'multipart/form-data')
      .attach('provider', providerFilepath);

    expect(status).toBeDefined();
    expect(body).toBeDefined();
    expect(status).toEqual(201);
    expect(body.createdRows).toEqual(20);
    expect(body.errorsFile).toMatch(/^\/public\/\d+-/);
  });

  it(should.postProviderB, async () => {
    const providerFilepath = getProviderFilePath('provider_b');
    const { status, body } = await request(app.getHttpServer())
      .post(endpoint)
      .set('Content-Type', 'multipart/form-data')
      .attach('provider', providerFilepath);

    expect(status).toBeDefined();
    expect(body).toBeDefined();
    expect(status).toEqual(201);
    expect(body.createdRows).toEqual(30);
    expect(body.errorsFile).toMatch(/^\/public\/\d+-/);
  });

  it(should.postProviderC, async () => {
    const providerFilepath = getProviderFilePath('provider_c');
    const { status, body } = await request(app.getHttpServer())
      .post(endpoint)
      .set('Content-Type', 'multipart/form-data')
      .attach('provider', providerFilepath);

    expect(status).toBeDefined();
    expect(body).toBeDefined();
    expect(status).toEqual(201);
    expect(body.createdRows).toEqual(50);
    expect(body.errorsFile).toMatch(/^\/public\/\d+-/);
  });

  it(should.postNonProvider, async () => {
    const providerFilepath = getProviderFilePath('non-registered-provider');
    const { status, body } = await request(app.getHttpServer())
      .post(endpoint)
      .set('Content-Type', 'multipart/form-data')
      .attach('provider', providerFilepath);

    expect(status).toBeDefined();
    expect(body).toBeDefined();
    expect(status).toEqual(400);
    expect(body).toHaveProperty('statusCode');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('error');
  });
});
