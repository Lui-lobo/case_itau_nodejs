// importando função a ser testada
import createCliente from '../createCliente';
// Importando Mocks
import { makePrismaMock } from '../../__tests__/mocks/prisma.mock';
import { makeLoggerMock } from '../../__tests__/mocks/logger.mock';

describe('createCliente', () => {
  it('chama UsersService.register e repassa o resultado', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    const logger = makeLoggerMock();
    // Mockando retorno da função
    const usersService = { register: jest.fn().mockResolvedValue({ id: 10, email: 'teste@teste.com', clientId: 1 }) };
    // Mockando Dto
    const dto = { nome: 'teste', email: 'teste@teste.com', password: '123456', clientId: 1 };
    // Testando função
    const result = await createCliente(prisma as any, logger as any, usersService as any, dto);
    // Testando resultado retornado pela função
    expect(usersService.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 10, email: 'teste@teste.com', clientId: 1 });
  });
});
