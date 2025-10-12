// Importando função a ser testada
import getClienteTransacoes from '../getClienteTransacoes';
// Importando Mocks
import { makePrismaMock } from '../../__tests__/mocks/prisma.mock';
import { makeLoggerMock } from '../../__tests__/mocks/logger.mock';

describe('getClienteTransacoes', () => {
  it('retorna transações com paginação e filtro de tipo', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    // Mockando valor de retorno da função
    prisma.cliente.findUnique.mockResolvedValue({ id: 1, active: true, saldo: '900.00' });
    prisma.$transaction.mockResolvedValue([
      2,
      [{ id: 1, tipo: 'credito' }, { id: 2, tipo: 'credito' }],
    ]);

    // Testando função
    const res = await getClienteTransacoes(prisma as any, logger as any, 1, 'credito', 1, 10);
    // Checando os valores retornados pelas funções
    expect(res.total).toBe(2);
    expect(res.transacoes).toHaveLength(2);
    expect(prisma.transacao.findMany).toHaveBeenCalledWith({
      where: { clienteId: 1, tipo: 'credito' },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 10,
    });
  });

  it('bloqueia cliente inativo', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    // Mockando valor de retorno da função
    prisma.cliente.findUnique.mockResolvedValue({ id: 1, active: false });
    // Checando os valores retornados pelas funções
    await expect(getClienteTransacoes(prisma as any, logger as any, 1))
      .rejects.toThrow('Cliente inativo');
  });
});
