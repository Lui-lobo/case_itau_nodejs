// importando função a ser testada
import getAllClientes from '../getAllClientes';
// Importando Mocks
import { makePrismaMock } from '../../__tests__/mocks/prisma.mock';
import { makeLoggerMock } from '../../__tests__/mocks/logger.mock';

describe('getAllClientes', () => {
  it('retorna clientes ativos ordenados por id asc', async () => {
    // Mockado funções
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    // Mockando retorno da função
    prisma.cliente.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    // Testando função
    const result = await getAllClientes(prisma as any, logger as any);
    // Checando valores retornados pela função
    expect(result).toHaveLength(2);
    expect(prisma.cliente.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
      where: { active: true },
    });
  });
});
