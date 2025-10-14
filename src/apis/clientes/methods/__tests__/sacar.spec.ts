// Importando função a ser testada
import sacar from '../sacar';
// Importando Mocks
import { makePrismaMock } from '../../__tests__/mocks/prisma.mock';
import { makeLoggerMock } from '../../__tests__/mocks/logger.mock';

describe('sacar', () => {
  it('realiza débito quando saldo suficiente', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    // Mockando valor de retorno da função
    prisma.cliente.findUnique.mockResolvedValue({
      id: 1,
      active: true,
      saldo: 100,
    });

    prisma.$transaction.mockResolvedValue([
      { id: 1, saldo: 50 },
      { id: 10, tipo: 'debito', valor: 50 },
    ]);

    // Mockando usuário de teste
    const user = { 
      id: 1,
      nome: 'teste',
      email: 'teste@teste.com.br',
      password: '1234567',
      active: true,
      saldo: 100,
      createdAt: new Date("2025-10-11T23:00:11.800Z"),
      updatedAt: new Date("2025-10-11T23:00:11.800Z")
    }

    // Testando função
    const result = await sacar(prisma as any, logger as any, 1, 50, user);
    // Checando os valores retornados pelas funções
    expect(prisma.transacao.create).toHaveBeenCalledWith({
      data: { tipo: 'debito', valor: expect.anything(), clienteId: 1 },
    });
    expect(result.message).toBe('Saque realizado com sucesso.');
    expect(result.novoSaldo).toBe(50);
  });

  it('falha se saldo insuficiente', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    // Mockando valor de retorno da função
    prisma.cliente.findUnique.mockResolvedValue({
      id: 1,
      active: true,
      saldo: 10,
    });

    // Mockando usuário de teste
    const user = { 
      id: 1,
      nome: 'teste',
      email: 'teste@teste.com.br',
      password: '1234567',
      active: true,
      saldo: 100,
      createdAt: new Date("2025-10-11T23:00:11.800Z"),
      updatedAt: new Date("2025-10-11T23:00:11.800Z")
    }
    // Checando os valores retornados pelas funções
    await expect(sacar(prisma as any, logger as any, 1, 999, user))
      .rejects.toThrow('Saldo insuficiente para realizar o saque.');
  });
});