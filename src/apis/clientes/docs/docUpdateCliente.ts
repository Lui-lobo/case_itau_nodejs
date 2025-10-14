// Importando decoradores de documentação do NestJs
import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
// Importando metodo comum responsável por aplicar decoradores
import { applyDecorators } from '@nestjs/common';
// importando DTO de update
import { UpdateClienteDto } from '../dto/update-cliente.dto';

export function DocUpdateCliente() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza um cliente existente',
      description: 'Atualiza os dados do cliente pelo ID. Permite alterar nome, email e senha. O email deve ser único.'
    }),
    ApiParam({ name: 'id', type: Number, description: 'ID do cliente a ser atualizado' }),
    ApiBody({ type: UpdateClienteDto }),
    ApiResponse({
      status: 204,
      description: 'Cliente atualizado com sucesso.',
      schema: {
        example: true
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
      description: 'Tentativa de atualização ilegal (email já existente).',
      schema: {
        example: {
          statusCode: 400,
          message: 'Tentativa de atualização ilegal',
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
          message: 'Erro ao atualizar cliente.',
          error: 'Internal Server Error'
        }
      }
    })
  );
}