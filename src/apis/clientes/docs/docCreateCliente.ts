// Importando decoradores de documentação do NestJs
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
// Importando metodo comum responsável por aplicar decoradores
import { applyDecorators } from '@nestjs/common';
// Importando DTOs de criação de cliente e retorno pós criação
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { returnCreateClientDto } from '../dto/return-create-cliente.dto';

export function DocCreateCliente() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cria um novo cliente',
      description: 'Registra um novo cliente no sistema. O e-mail deve ser único.'
    }),
    ApiBody({ type: CreateClienteDto }),
    ApiResponse({
      status: 201,
      description: 'Cliente criado com sucesso.',
      type: returnCreateClientDto,
      schema: {
        example: {
          id: 1,
          nome: 'Novo Cliente',
          email: 'novo@cliente.com',
          active: true,
          createdAt: '2025-10-13T10:00:00.000Z',
          updatedAt: '2025-10-13T10:00:00.000Z'
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou e-mail já cadastrado.',
      schema: {
        example: {
          statusCode: 400,
          message: 'E-mail já cadastrado.',
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
          message: 'Erro ao criar cliente.',
          error: 'Internal Server Error'
        }
      }
    })
  );
}