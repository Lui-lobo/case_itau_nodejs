// Importando função a ser testada
import getClienteById from '../getClienteById';
// Importando Mocks
import { makePrismaMock } from '../../__tests__/mocks/prisma.mock';
import { makeLoggerMock } from '../../__tests__/mocks/logger.mock';

describe('getClienteById', () => {
    it('retorna cliente quando existir', async () => {
        // Definindo Mocks
        const prisma = makePrismaMock();
        const logger = makeLoggerMock();
        // Mockando valor de retorno da função
        prisma.cliente.findUnique.mockResolvedValue(
            {
                "id": 1,
                "nome": "Luiz Henrique",
                "email": "teste@teste.com.br",
                "password": "$2b$10$ugACRKXadwsH1H4oO7ONXu.U5OyObAn6x7040OpSNVYN7R7ErNTBK",
                "active": true,
                "saldo": "50",
                "createdAt": "2025-10-11T23:00:11.800Z",
                "updatedAt": "2025-10-12T02:44:39.112Z"
            }
        );
        // Testando função
        const result = await getClienteById(prisma as any, logger as any, 1);
        // Checando os valores retornados pelas funções
        expect(result.id).toBe(1);
        expect(prisma.cliente.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('lança 404 quando não existe', async () => {
        // Definindo Mocks
        const prisma = makePrismaMock();
        const logger = makeLoggerMock();
        // Mockando valor de retorno da função
        prisma.cliente.findFirst.mockResolvedValue(null);
        // Checando os valores retornados pelas funções
        await expect(getClienteById(prisma as any, logger as any, 99))
            .rejects.toThrow('Cliente com ID 99 não encontrado.');
    });
});
