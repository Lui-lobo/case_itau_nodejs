// importando função a ser testada
import deleteCliente from '../deleteCliente';
// Importando Mocks
import { makePrismaMock } from '../../__tests__/mocks/prisma.mock';
import { makeLoggerMock } from '../../__tests__/mocks/logger.mock';

describe('deleteCliente (soft)', () => {
  it('inativa cliente quando ativo', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    // Mockando retorno da função
    prisma.cliente.findUnique.mockResolvedValue({ id: 1, active: true });
    prisma.cliente.update.mockResolvedValue({ id: 1, active: false });
    // Testando função
    const result = await deleteCliente(prisma as any, logger as any, 1);
    // Testando resultado retornado pela função
    expect(prisma.cliente.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { active: false } });
    expect(result.message).toMatch('Cliente 1 foi desativado com sucesso.');
  });

  it('lança 400 se já estiver inativo', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    // Mockando retorno da função
    prisma.cliente.findUnique.mockResolvedValue({ id: 1, active: false });
    // Testando resultado retornado pela função
    await expect(deleteCliente(prisma as any, logger as any, 1))
      .rejects.toThrow('Cliente 1 já está inativo');
  });
});
