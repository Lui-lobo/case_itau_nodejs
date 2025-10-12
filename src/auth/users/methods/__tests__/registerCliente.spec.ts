// Importando função a ser testada
import registerCliente from '../registerCliente';
// Importando Mocks da funções
import { makePrismaMock } from './mocks/prisma.mock';
import { makeLoggerMock } from './mocks/logger.mock';
import { makeCryptoMock } from './mocks/crypto.mock';
// Importando serviço de jwt a ser testado
import { JwtService } from '@nestjs/jwt';

describe('registerCliente', () => {
  it('cria cliente novo com hash de senha e vínculo', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    const crypto = makeCryptoMock();
    // Instânciando novo serviço de JWT
    const jwt = new JwtService();
    // Mockando valor de retorno de função interna
    prisma.client.findUnique.mockResolvedValue({ id: 1, name: 'Default', active: true });
    prisma.cliente.findUnique.mockResolvedValue(null);
    prisma.cliente.create.mockResolvedValue({ id: 10, email: 'a@a.com' });
    prisma.clienteClient.create.mockResolvedValue({});
    // Mockando DTO
    const dto = { nome: 'A', email: 'a@a.com', password: '123', clientId: 1 };
    // Testando função
    const res = await registerCliente(prisma as any, jwt, crypto as any, logger as any, dto);
    // Checando os valores retornados pelas funções
    expect(res).toEqual({ id: 10, email: 'a@a.com', clientId: 1 });
    expect(crypto.hashPassword).toHaveBeenCalled();
  });

  it('lança erro se email já existe', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    // Mockando valor de retorno de função interna
    prisma.client.findUnique.mockResolvedValue({ id: 1, name: 'App', active: true });
    prisma.cliente.findUnique.mockResolvedValue({ id: 1, email: 'a@a.com' });
    // Testando função
    await expect(
      registerCliente(prisma as any, new JwtService(), makeCryptoMock() as any, makeLoggerMock() as any, {
        nome: 'A', email: 'a@a.com', password: '123', clientId: 1,
      }),
    ).rejects.toThrow('Email já registrado.');
  });
});
