// importando função a ser testada
import depositar from '../depositar';
// Importando Mocks
import { makePrismaMock } from '../../__tests__/mocks/prisma.mock';
import { makeLoggerMock } from '../../__tests__/mocks/logger.mock';

describe('depositar', () => {
  it('cria transação de crédito e atualiza saldo', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    // mock de Decimal-like
    const saldo = { add: jest.fn(() => 150) };
    // Mockando retorno da função
    prisma.cliente.findUnique.mockResolvedValue({ id: 1, active: true, saldo });
    prisma.$transaction.mockResolvedValue([
      { id: 1, saldo: 150 },
      { id: 77, tipo: 'credito', valor: 50 },
    ]);
    // Testando função
    const res = await depositar(prisma as any, logger as any, 1, 50);
    // Checando valores retornados pela função
    expect(saldo.add).toHaveBeenCalled();
    expect(prisma.transacao.create).toHaveBeenCalledWith({
      data: { tipo: 'credito', valor: expect.anything(), clienteId: 1 },
    });
    expect(res.novoSaldo).toBe(150);
  });

  it('falha se valor <= 0', async () => {
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    await expect(depositar(prisma as any, logger as any, 1, 0))
      .rejects.toThrow('O valor do depósito deve ser maior que zero.');
  });
});
