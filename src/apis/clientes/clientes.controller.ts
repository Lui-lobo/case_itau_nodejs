// Importando modulos comuns do Nest
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode, UseGuards, Query } from '@nestjs/common';
// Importando decoradores de documentação do swagger
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// Importando serviços do cliente 
import { ClientesService } from './clientes.service';
import { LoggerService } from '../../common/logger/logger.service';
// Importando DTOs do cliente
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { TransactionDto } from './dto/transaction.dto';
// Importando modelo do cliente
import { Cliente } from '@prisma/client';
// Importando guards
import { ClientAuthGuard } from '../../auth/clients.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { returnCreateClientDto } from './dto/return-create-cliente.dto';
@UseGuards(ClientAuthGuard, JwtAuthGuard)
@ApiTags('clientes')
@Controller('api/v1/clientes')
export class ClientesController {
  // Contexto da api para loggers
  private readonly context = 'ClientesController';

  constructor(
    private readonly clientesService: ClientesService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os clientes' })
  async list(): Promise<Cliente[]> {
    const op = `${this.context}:list`;
    this.logger.track(op, { action: 'start' });

    const result = await this.clientesService.getAll();

    this.logger.track(op, { action: 'end', result, total: result.length });

    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um cliente pelo ID' })
  async get(@Param('id', ParseIntPipe) id: number): Promise<Cliente> {
    const op = `${this.context}:getById`;
    this.logger.track(op, { action: 'start' });

    const result =  await this.clientesService.getById(id);

    this.logger.track(op, { action: 'end', result });

    return result;
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo cliente' })
  create(@Body() data: CreateClienteDto): Promise<returnCreateClientDto> {
    const context = `${this.context}:create`;
    this.logger.track(context, { email: data.email, action: 'start' }, context);

    const result = this.clientesService.create(data);

    this.logger.track(context, { result, action: 'end' }, context);

    return result;
  }

  @Put(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Atualiza um cliente existente' })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateClienteDto): Promise<Boolean> {
    const context = `${this.context}:update`;
    this.logger.track(context, { id, data, action: 'start' }, context);

    const result = this.clientesService.update(id, data);

    this.logger.track(context, { id, result, action: 'end' }, context);

    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Desativa um cliente (soft delete)',
    description:
      'Inativa o cliente no sistema definindo active=false, preservando o histórico.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    const context = `${this.context}:delete`;
    this.logger.track(context, { id, action: 'start' }, context);

    const result = this.clientesService.delete(id);

    this.logger.track(context, { id, result, action: 'end' }, context);

    return result;
  }

  @Post(':id/depositar')
  @ApiOperation({ summary: 'Realiza depósito no saldo do cliente' })
  depositar(@Param('id', ParseIntPipe) id: number, @Body() { valor }: TransactionDto) {
    const context = `${this.context}:deposit`;
    this.logger.track(context, { id, action: 'start' }, context);

    const result = this.clientesService.depositar(id, valor);

    this.logger.track(context, { id, result, action: 'end' }, context);

    return result;
  }

  @Post(':id/sacar')
  @ApiOperation({ summary: 'Realiza saque no saldo do cliente' })
  sacar(@Param('id', ParseIntPipe) id: number, @Body() { valor }: TransactionDto) {
    const context = `${this.context}:withdraw`;
    this.logger.track(context, { id, action: 'start' }, context);

    const result = this.clientesService.sacar(id, valor);

    this.logger.track(context, { id, result, action: 'end' }, context);

    return result;
  }

  @Get(':id/transacoes')
  @ApiOperation({
    summary: 'Lista todas as transações de um cliente',
    description:
      'Retorna o histórico de transações (créditos e débitos) de um cliente, com suporte a filtros e paginação.',
  })
  async getTransacoes(
    @Param('id', ParseIntPipe) id: number,
    @Query('tipo') tipo?: 'credito' | 'debito',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const context = `${this.context}:transactions`;
    this.logger.track(context, { id, action: 'start' }, context);

    const result = this.clientesService.getTransacoes(id, tipo, Number(page), Number(limit));

    this.logger.track(context, { id, result, action: 'end' }, context);

    return result;
  }
}
