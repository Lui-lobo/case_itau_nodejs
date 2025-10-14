// Importando decoradores de documentação do NestJs
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
// Importando metodo comum responsável por aplicar decoradores
import { applyDecorators } from '@nestjs/common';

export function DocDeleteCliente() {
  return applyDecorators(
    ApiOperation({
      summary: 'Desativa um cliente (soft delete)',
      description: 'Inativa o cliente no sistema definindo active=false, preservando o histórico. Não remove dados do banco.'
    }),
    ApiParam({ name: 'id', type: Number, description: 'ID do cliente a ser desativado' }),
    ApiResponse({
      status: 200,
      description: 'Cliente desativado com sucesso.',
      schema: {
        example: {
          message: 'Cliente 1 foi desativado com sucesso.'
        }
      }
    }),
    ApiResponse({
      status: 404,
      description: 'Cliente não encontrado.',
      schema: {
        example: {
          statusCode: 404,
          message: 'Cliente 1 não encontrado.',
          error: 'Not Found'
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Cliente já está inativo.',
      schema: {
        example: {
          statusCode: 400,
          message: 'Cliente 1 já está inativo.',
          error: 'Bad Request'
        }
      }
    }),
    ApiResponse({
      status: 500,
      description: 'Erro interno inesperado.',
      schema: {
        example: {
          statusCode: 500,
          message: 'Erro ao desativar cliente.',
          error: 'Internal Server Error'
        }
      }
    })
  );
}