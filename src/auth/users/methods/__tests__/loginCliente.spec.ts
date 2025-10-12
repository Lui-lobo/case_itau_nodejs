// Importando função a ser testada
import loginCliente from '../loginCliente';
// Importando Mocks
import { makePrismaMock } from './mocks/prisma.mock';
import { makeLoggerMock } from './mocks/logger.mock';
import { makeCryptoMock } from './mocks/crypto.mock';
// Importando serviço de JWT
import { JwtService } from '@nestjs/jwt';

describe('loginCliente', () => {
  it('retorna token e dados do usuário válidos', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    const crypto = makeCryptoMock();
    // Instânciando novo serviço de JWT
    const jwt = new JwtService({ secret: 'test' });
    // Mockando valor de retorno de função interna
    prisma.client.findUnique.mockResolvedValue({ id: 1, active: true });
    prisma.cliente.findUnique.mockResolvedValue({
      id: 1,
      email: 'a@a.com',
      nome: 'A',
      password: 'hashed_123',
      clients: [],
    });
    prisma.clienteClient.findFirst.mockResolvedValue({
      client: { id: 1, name: 'Default' },
    });
    // Testando função
    const result = await loginCliente(
      prisma as any,
      jwt,
      crypto as any,
      logger as any,
      1,
      { email: 'a@a.com', password: '123' },
    );
    // Checando os valores retornados pelas funções
    expect(result.accessToken).toBeDefined();
    expect(result.user.clientName).toBe('Default');
  });

  it('lança erro se credenciais inválidas', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    const crypto = makeCryptoMock();
    // Instânciando novo serviço de JWT
    const jwt = new JwtService();
    // Mockando valor de retorno de função interna
    prisma.client.findUnique.mockResolvedValue({ id: 1, active: true });
    prisma.cliente.findUnique.mockResolvedValue(null);
    // Checando os valores retornados pelas funções
    await expect(
      loginCliente(prisma as any, jwt, crypto as any, logger as any, 1, {
        email: 'x@x.com',
        password: '123',
      }),
    ).rejects.toThrow('Credenciais inválidas.');
  });
});
