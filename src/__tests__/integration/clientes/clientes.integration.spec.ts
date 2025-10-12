import { TestAppFactory } from '../../setup/test-app.factory';
import request from 'supertest';

describe('Clientes (Integration)', () => {
  let factory: TestAppFactory;
  let authToken: string;
  let client: any;
  let user: any;

  beforeAll(async () => {
    factory = await new TestAppFactory().init();
    await factory.clearDatabase();

    // cria client de app
    client = await factory.prisma.client.create({
      data: {
        name: 'Client Teste',
        clientId: 'client-teste',
        clientSecret: 'segredo123',
        allowedRoutes: ['*'],
      },
    });

    // registra usuário
    const register = await request(factory.getHttpServer())
      .post('/api/v1/auth/register')
      .set('x-client-id', client.clientId)
      .set('x-client-secret', client.clientSecret)
      .send({
        nome: 'Vinicius',
        email: 'vinicius@teste.com',
        password: '123456',
        clientId: client.id,
      });

    user = register.body;

    // login
    const login = await request(factory.getHttpServer())
      .post('/api/v1/auth/login')
      .set('x-client-id', client.clientId)
      .set('x-client-secret', client.clientSecret)
      .send({
        email: 'vinicius@teste.com',
        password: '123456',
      });

    authToken = login.body.accessToken;
  });

  afterAll(async () => {
    await factory.close();
  });

  it('deve listar clientes autenticado', async () => {
    const res = await request(factory.getHttpServer())
      .get('/api/v1/clientes')
      .set('Authorization', `Bearer ${authToken}`)
      .set('x-client-id', client.clientId)
      .set('x-client-secret', client.clientSecret)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('email');
  });

  it('deve permitir depósito e atualizar saldo', async () => {
    const res = await request(factory.getHttpServer())
      .post(`/api/v1/clientes/${user.id}/depositar`)
      .set('Authorization', `Bearer ${authToken}`)
      .set('x-client-id', client.clientId)
      .set('x-client-secret', client.clientSecret)
      .send({ valor: 100 })
      .expect(201);

    expect(res.body).toHaveProperty('novoSaldo');
  });

  it('deve registrar saque e reduzir saldo', async () => {
    const res = await request(factory.getHttpServer())
      .post(`/api/v1/clientes/${user.id}/sacar`)
      .set('Authorization', `Bearer ${authToken}`)
      .set('x-client-id', client.clientId)
      .set('x-client-secret', client.clientSecret)
      .send({ valor: 50 })
      .expect(201);

    expect(res.body).toHaveProperty('novoSaldo');
  });
});
