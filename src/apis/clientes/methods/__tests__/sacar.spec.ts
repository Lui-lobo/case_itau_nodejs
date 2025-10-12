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
    // Mockando funçoes de saldo
    const saldo = {
      lessThan: jest.fn(() => false),
      sub: jest.fn(() => 50),
    };
    // Mockando valor de retorno da função
    prisma.cliente.findUnique.mockResolvedValue({ id: 1, active: true, saldo });
    prisma.$transaction.mockResolvedValue([
      { id: 1, saldo: 50 },
      { id: 10, tipo: 'debito', valor: 50 },
    ]);
    // Testando função
    const res = await sacar(prisma as any, logger as any, 1, 50);
    // Checando os valores retornados pelas funções
    expect(saldo.lessThan).toHaveBeenCalled();
    expect(prisma.transacao.create).toHaveBeenCalledWith({
      data: { tipo: 'debito', valor: expect.anything(), clienteId: 1 },
    });
    expect(res.novoSaldo).toBe(50);
  });

  it('falha se saldo insuficiente', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
     // Mockando valor de retorno da função
    const saldo = { lessThan: jest.fn(() => true) };
    prisma.cliente.findUnique.mockResolvedValue({ id: 1, active: true, saldo });
    // Validando resultado da função
    await expect(sacar(prisma as any, logger as any, 1, 999))
      .rejects.toThrow('Saldo insuficiente');
  });
});
