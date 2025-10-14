import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function DocListClientes() {
  return applyDecorators(
    ApiOperation({
      summary: 'Lista todos os clientes',
      description: 'Retorna todos os clientes ativos cadastrados no sistema, ordenados por ID.'
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de clientes ativos.',
      schema: {
        example: [
          {
            id: 1,
            nome: 'Cliente Exemplo',
            email: 'cliente@exemplo.com',
            active: true,
            saldo: 100.00,
            createdAt: '2025-10-13T10:00:00.000Z',
            updatedAt: '2025-10-13T10:00:00.000Z'
          },
          {
            id: 2,
            nome: 'Outro Cliente',
            email: 'outro@cliente.com',
            active: true,
            saldo: 50.00,
            createdAt: '2025-10-13T11:00:00.000Z',
            updatedAt: '2025-10-13T11:00:00.000Z'
          }
        ]
      }
    }),
    ApiResponse({
      status: 500,
      description: 'Erro interno inesperado.',
      schema: {
        example: {
          statusCode: 500,
          message: 'Erro ao listar clientes.',
          error: 'Internal Server Error'
        }
      }
    })
  );
}