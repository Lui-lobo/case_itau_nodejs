// Importando decoradores de documentação do NestJs
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
// Importando metodo comum responsável por aplicar decoradores
import { applyDecorators } from '@nestjs/common';

export function DocGetClienteById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Busca um cliente pelo ID',
      description: 'Retorna os dados do cliente correspondente ao ID informado.'
    }),
    ApiParam({ name: 'id', type: Number, description: 'ID do cliente a ser buscado' }),
    ApiResponse({
      status: 200,
      description: 'Cliente encontrado.',
    
      schema: {
        example: {
          id: 1,
          nome: 'Cliente Exemplo',
          email: 'cliente@exemplo.com',
          active: true,
          saldo: 100.00,
          createdAt: '2025-10-13T10:00:00.000Z',
          updatedAt: '2025-10-13T10:00:00.000Z'
        }
      }
    }),
    ApiResponse({
      status: 404,
      description: 'Cliente não encontrado.',
      schema: {
        example: {
          statusCode: 404,
          message: 'Cliente com ID 1 não encontrado.',
          error: 'Not Found'
        }
      }
    })
  );
}