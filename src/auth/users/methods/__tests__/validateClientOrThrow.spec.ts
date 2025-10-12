// Importando função a ser testada
import validateClientOrThrow from '../validateClientOrThrow';
// Criando Mocks do prisma
import { makePrismaMock } from './mocks/prisma.mock';

describe('validateClientOrThrow', () => {
  it('retorna o client se existir e ativo', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    // Mockando valor de retorno de função interna
    prisma.client.findUnique.mockResolvedValue({ id: 1, name: 'App', active: true });
    // Testando função
    const result = await validateClientOrThrow(prisma as any, 1);
    // Checando os valores retornados pelas funções
    expect(result.name).toBe('App');
  });

  it('lança erro se client não existe', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    // Mockando valor de retorno de função interna
    prisma.client.findUnique.mockResolvedValue(null);
    // Testando função
    await expect(validateClientOrThrow(prisma as any, 99)).rejects.toThrow('não encontrado');
  });

  it('lança erro se client inativo', async () => {
    // Definindo Mocks
    const prisma = makePrismaMock();
    // Mockando valor de retorno de função interna
    prisma.client.findUnique.mockResolvedValue({ id: 1, name: 'App', active: false });
    // Testando função
    await expect(validateClientOrThrow(prisma as any, 1)).rejects.toThrow('desativado');
  });
});
