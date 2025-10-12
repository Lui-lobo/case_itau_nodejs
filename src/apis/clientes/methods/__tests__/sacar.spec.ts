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
    // Testando função
    const result = await sacar(prisma as any, logger as any, 1, 50);
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
    // Checando os valores retornados pelas funções
    await expect(sacar(prisma as any, logger as any, 1, 999))
      .rejects.toThrow('Saldo insuficiente para realizar o saque.');
  });
});