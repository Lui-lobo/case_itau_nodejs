// Importando decoradores de documentação do NestJs
import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
// Importando metodo comum responsável por aplicar decoradores
import { applyDecorators } from '@nestjs/common';
// importando DTO de transação
import { TransactionDto } from '../dto/transaction.dto';

export function DocDepositar() {
  return applyDecorators(
    ApiOperation({
      summary: 'Realiza depósito no saldo do cliente',
      description: 'Credita o valor informado no saldo do cliente autenticado. Requer autenticação.'
    }),
    ApiParam({ name: 'id', type: Number, description: 'ID do cliente' }),
    ApiBody({ type: TransactionDto }),
    ApiResponse({
      status: 200,
      description: 'Depósito realizado com sucesso.',
      schema: {
        example: {
          message: 'Depósito realizado com sucesso.',
          clienteId: 1,
          valorDepositado: 100,
          novoSaldo: 200,
          transacaoId: 124,
          data: '2025-10-13T10:05:00.000Z'
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Valor inválido para depósito.',
      schema: {
        example: {
          statusCode: 400,
          message: 'O valor do depósito deve ser maior que zero.',
          error: 'Bad Request'
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Cliente inativo.',
      schema: {
        example: {
          statusCode: 400,
          message: 'Cliente inativo. Operação não permitida.',
          error: 'Bad Request'
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
      status: 500,
      description: 'Erro interno inesperado.',
      schema: {
        example: {
          statusCode: 500,
          message: 'Erro ao realizar depósito.',
          error: 'Internal Server Error'
        }
      }
    })
  );
}