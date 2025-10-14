// Importando decoradores de documentação do NestJs
import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
// Importando metodo comum responsável por aplicar decoradores
import { applyDecorators } from '@nestjs/common';
// importando DTO de transação
import { TransactionDto } from '../dto/transaction.dto';

export function DocSacar() {
    return applyDecorators(
        ApiOperation({ summary: 'Realiza saque no saldo do cliente' }),
        ApiParam({ name: 'id', type: Number, description: 'ID do cliente' }),
        ApiBody({ type: TransactionDto }),
        ApiResponse({
            status: 200,
            description: 'Saque realizado com sucesso.',
            schema: {
                example: {
                    message: 'Saque realizado com sucesso.',
                    clienteId: 1,
                    valorSacado: 50,
                    novoSaldo: 100,
                    transacaoId: 123,
                    data: '2025-10-13T10:00:00.000Z'
                }
            }
        }),
        ApiResponse({
            status: 400,
            description: 'Saldo insuficiente.',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'Saldo insuficiente para saque.',
                    error: 'Bad Request'
                }
            }
        }),
        ApiResponse({
            status: 400.3,
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
            status: 401,
            description: 'Usuário não identificado tentando sacar dinheiro ou tentando sacar dinheiro da conta de outro usuário',
            schema: {
                example: {
                    statusCode: 401,
                    message: 'Usuário invalido!',
                    error: 'Unauthorized'
                }
            }
        }),
        ApiResponse({
            status: 400.1,
            description: 'O valor do saque deve ser maior que zero',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'O valor do saque deve ser maior que zero.',
                    error: 'Bad Request'
                }
            }
        }),
        ApiResponse({
            status: 400.2,
            description: 'Saldo do cliente é insuficiente para o saque',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'Saldo insuficiente para realizar o saque.',
                    error: 'Bad Request'
                }
            }
        }),
    );
}