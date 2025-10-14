// Importando decoradores de documentação do NestJs
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
// Importando metodo comum responsável por aplicar decoradores
import { applyDecorators } from '@nestjs/common';
// Importando DTO de login
import { LoginClienteDto } from '../dto/login-cliente-dto';

export function DocLoginCliente() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login do cliente (usuário final) vinculado ao client autenticado',
      description: 'Realiza autenticação do cliente e retorna um accessToken JWT. O client precisa estar autenticado.'
    }),
    ApiBody({ type: LoginClienteDto }),
    ApiResponse({
      status: 200,
      description: 'Login realizado com sucesso.',
      schema: {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            nome: 'Cliente Exemplo',
            email: 'cliente@exemplo.com',
            clientId: 10,
            clientName: 'MeuApp'
          }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Credenciais inválidas.',
      schema: {
        example: {
          statusCode: 401,
          message: 'Credenciais inválidas.',
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
          message: 'Erro ao realizar login.',
          error: 'Internal Server Error'
        }
      }
    })
  );
}