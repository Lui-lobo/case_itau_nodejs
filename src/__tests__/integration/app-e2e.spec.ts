// Importando factory responsável por criar nossos testes de integração
import { TestAppFactory } from '../setup/test-app.factory';
// importando super teste
import request from 'supertest';

describe('App (Integration)', () => {
  let factory: TestAppFactory;

  beforeAll(async () => {
    factory = await new TestAppFactory().init();
  });

  afterAll(async () => {
    await factory.close();
  });

  it('/ (GET) health check', async () => {
    const response = await request(factory.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'ok',
    });
  });
});
