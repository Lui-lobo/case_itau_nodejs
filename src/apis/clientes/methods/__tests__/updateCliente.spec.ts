// Importando função a ser testada
import updateCliente from '../updateCliente';
// Importando Mocks
import { makePrismaMock } from '../../__tests__/mocks/prisma.mock';
import { makeLoggerMock } from '../../__tests__/mocks/logger.mock';
import { makeCryptoMock } from '../../__tests__/mocks/crypto.mock';

describe('updateCliente', () => {
  it('atualiza nome/email; impede email duplicado; hasheia senha quando enviada', async () => {
    // Mockando funções
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    const crypto = makeCryptoMock();
    // Mockando valores das funções
    prisma.cliente.findUnique.mockResolvedValue({ id: 1, email: 'old@a.com' }); // existe
    prisma.cliente.findFirst.mockResolvedValue(null); // sem duplicidade
    prisma.cliente.update.mockResolvedValue({ id: 1, nome: 'B', email: 'b@b.com' });
    // Mockando Dto
    const dto = { nome: 'B', email: 'b@b.com', password: 'novaSenha' };
    // Testando função
    const result = await updateCliente(prisma as any, logger as any, crypto as any, 1, dto);
    // Validando resultado da função
    expect(crypto.hashPassword).toHaveBeenCalledWith('novaSenha');
    expect(prisma.cliente.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: expect.objectContaining({ nome: 'B', email: 'b@b.com', password: 'hashed_novaSenha' }),
    });
    expect(result).toBe(true);
  });

  it('lança 400 se e-mail já existir em outro cliente', async () => {
    // Mockando funções
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    const crypto = makeCryptoMock();
    // Mockando valores das funções
    prisma.cliente.findUnique.mockResolvedValue({ id: 1, email: 'old@a.com' });
    prisma.cliente.findFirst.mockResolvedValue({ id: 2, email: 'dup@a.com' });
    // Validando resultado da função
    await expect(updateCliente(prisma as any, logger as any, crypto as any, 1, { email: 'dup@a.com' }))
      .rejects.toThrow('Tentativa de atualização ilegal');
  });
});
