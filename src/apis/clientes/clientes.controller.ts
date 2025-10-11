// Importando modulos comuns do Nest
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Logger, HttpCode } from '@nestjs/common';
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

  /*@Post()
  @ApiOperation({ summary: 'Cria um novo cliente' })
  create(@Body() data: CreateClienteDto): Promise<Cliente> {
    const op = `${this.context}:create`;
    this.logger.track(op, { action: 'start' });

    const result = this.clientesService.create(data);

    this.logger.track(op, { action: 'end', result });

    return result;
  }

  @Put(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Atualiza um cliente existente' })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateClienteDto) {
    logger.log(`Atualizando cliente ID: ${id}`);
    return this.clientesService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deleta um cliente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    logger.log(`Removendo cliente ID: ${id}`);
    return this.clientesService.delete(id);
  }

  @Post(':id/depositar')
  @ApiOperation({ summary: 'Realiza depósito no saldo do cliente' })
  depositar(@Param('id', ParseIntPipe) id: number, @Body() { valor }: TransactionDto) {
    logger.log(`Depositando ${valor} no cliente ID: ${id}`);
    return this.clientesService.depositar(id, valor);
  }

  @Post(':id/sacar')
  @ApiOperation({ summary: 'Realiza saque no saldo do cliente' })
  sacar(@Param('id', ParseIntPipe) id: number, @Body() { valor }: TransactionDto) {
    logger.log(`Sacando ${valor} do cliente ID: ${id}`);
    return this.clientesService.sacar(id, valor);
  }*/
}
