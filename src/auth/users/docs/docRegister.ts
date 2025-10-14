// Importando decoradores de documentação do NestJs
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
// Importando metodo comum responsável por aplicar decoradores
import { applyDecorators } from '@nestjs/common';
// Importando DTO de registro
import { RegisterClienteDto } from '../dto/register-cliente.dto';

export function DocRegisterCliente() {
  return applyDecorators(
    ApiOperation({
      summary: 'Registra um novo cliente (usuário final) para um app client',
      description: 'Cria um novo cliente vinculado ao client autenticado. O e-mail deve ser único.'
    }),
    ApiBody({ type: RegisterClienteDto }),
    ApiResponse({
      status: 201,
      description: 'Cliente registrado com sucesso.',
      schema: {
        example: {
          id: 1,
          email: 'cliente@exemplo.com',
          clientId: 10
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'E-mail já registrado.',
      schema: {
        example: {
          statusCode: 401,
          message: 'Email já registrado.',
          error: 'Unauthorized'
        }
      }
    }),
    ApiResponse({
      status: 404,
      description: 'Client não encontrado.',
      schema: {
        example: {
          statusCode: 404,
          message: 'Client 10 não encontrado.',
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
          message: 'Erro ao registrar cliente.',
          error: 'Internal Server Error'
        }
      }
    })
  );
}