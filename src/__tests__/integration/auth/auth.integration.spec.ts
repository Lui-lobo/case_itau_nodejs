import { TestAppFactory } from '../../setup/test-app.factory';
import request from 'supertest';

describe('AuthCliente (Integration)', () => {
  let factory: TestAppFactory;

  beforeAll(async () => {
    factory = await new TestAppFactory().init();
    await factory.clearDatabase();
  });

  afterAll(async () => {
    await factory.close();
  });

  it('deve registrar um novo client com sucesso', async () => {
    const client = await factory.prisma.client.create({
      data: {
        name: 'App de Teste',
        clientId: 'test-client',
        clientSecret: 'supersecret',
        allowedRoutes: ['*'],
      },
    });

    const response = await request(factory.getHttpServer())
      .post('/api/v1/auth/register')
      .set('x-client-id', client.clientId)
      .set('x-client-secret', client.clientSecret)
      .send({
        nome: 'Usuário Teste',
        email: 'teste@mail.com',
        password: '123456',
        clientId: client.id,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      email: 'teste@mail.com',
      clientId: client.id,
    });
  });

  it('deve permitir login com credenciais válidas', async () => {
    const client = await factory.prisma.client.findFirst();

    const response = await request(factory.getHttpServer())
      .post('/api/v1/auth/login')
      .set('x-client-id', client!.clientId)
      .set('x-client-secret', client!.clientSecret)
      .send({
        email: 'teste@mail.com',
        password: '123456',
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user.email).toBe('teste@mail.com');
  });

    it('deve registrar um client com rotas limitadas', async () => {
    const client = await factory.prisma.client.create({
      data: {
        name: 'Client com rotas limitas',
        clientId: 'limited-client',
        clientSecret: 'limited-client',
        allowedRoutes: ['/api/v1/auth/'],
      },
    });

    const response = await request(factory.getHttpServer())
      .post('/api/v1/auth/register')
      .set('x-client-id', client.clientId)
      .set('x-client-secret', client.clientSecret)
      .send({
        nome: 'Usuário Teste',
        email: 'teste-limited@email.com',
        password: '123456',
        clientId: client.id,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      email: 'teste-limited@email.com',
      clientId: client.id,
    });
  });
});
