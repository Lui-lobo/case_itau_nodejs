// Importando decoradores de documentação do NestJs
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
// Importando metodo comum responsável por aplicar decoradores
import { applyDecorators } from '@nestjs/common';

export function DocListTransaction() {
    return applyDecorators(
        ApiOperation({ summary: 'Lista de forma paginada as transações de um cliente' }),
        ApiParam({ name: 'id', type: Number, description: 'ID do cliente' }),
        ApiQuery({ name: 'tipo', type: String, description: 'Tipo de movimento a ser buscado. Os valores validos são: debito ou credito, por padrão busca todos os tipos de transação' }),
        ApiQuery({ name: 'page', type: Number, description: 'Pagina que iremos iniciar nossa busca, por padrão iniciamos na primeira' }),
        ApiQuery({ name: 'limit', type: Number, description: 'Quantidade de registros por pagina, por padrão buscamos 10 registros' }),
        ApiResponse({
            status: 200,
            description: 'Saque realizado com sucesso.',
            schema: {
                example: {
                    "clienteId": 1,
                    "total": 2,
                    "pagina": 1,
                    "porPagina": 10,
                    "saldoAtual": "50",
                    "transacoes": [
                        {
                            "id": 2,
                            "clienteId": 1,
                            "valor": "50",
                            "tipo": "debito",
                            "createdAt": "2025-10-14T00:16:46.271Z"
                        },
                        {
                            "id": 1,
                            "clienteId": 1,
                            "valor": "100",
                            "tipo": "credito",
                            "createdAt": "2025-10-14T00:16:46.256Z"
                        }
                    ]
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
            status: 400.1,
            description: 'Cliente inativo.',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'Cliente inativo. Operação não permitida.',
                    error: 'Bad Request'
                }
            }
        }),
    );
}