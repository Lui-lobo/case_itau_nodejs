import validateById from '../validateById';
import { makePrismaMock } from './mocks/prisma.mock';

describe('validateById', () => {
  it('retorna cliente pelo id', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    // Mockando valor de retorno de função interna
    prisma.cliente.findUnique.mockResolvedValue({ id: 1, email: 'a@a.com' });
    // Testando função
    const result = await validateById(prisma as any, 1);
    // Checando os valores retornados pelas funções
    expect(result!.email).toBe('a@a.com');
  });
});
