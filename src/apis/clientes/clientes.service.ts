// Importando injeção do Nest
import { Injectable } from '@nestjs/common';
// Importando Serviços a serem consumidos
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';
import { UsersService } from '../../auth/users/users.service';
import { CryptoService } from '../../common/crypto/crypto.service';
// Importando DTOs de Validação
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
// Importando Métodos a serem utilizados
import getAllClientes from './methods/getAllClientes';
import getClienteById from './methods/getClienteById';
import createCliente from './methods/createCliente';
import updateCliente from './methods/updateCliente';
import deleteCliente from './methods/deleteCliente';
import depositar from './methods/depositar';
import sacar from './methods/sacar';
import getClienteTransacoes from './methods/getClienteTransacoes';

@Injectable()
export class ClientesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService
  ) { }

  async getAll() {
    return getAllClientes(this.prisma, this.logger);
  }

  async getById(id: number) {
    return getClienteById(this.prisma, this.logger, id);
  }

  async create(data: CreateClienteDto) {
    return createCliente(this.prisma, this.logger, this.usersService, data);
  }

  async update(id: number, data: UpdateClienteDto): Promise<Boolean> {
    return updateCliente(this.prisma, this.logger, this.cryptoService, id, data);
  }

  async delete(id: number) {
    return deleteCliente(this.prisma, this.logger, id);
  }

  async depositar(id: number, valor: number) {
    return depositar(this.prisma, this.logger, id, valor);
  }

  async sacar(id: number, valor: number, user: {
    id: number,
    nome: string,
    email: string,
    password: string,
    active: boolean,
    saldo: number,
    createdAt: Date,
    updatedAt: Date
  }) {
    return sacar(this.prisma, this.logger, id, valor, user);
  }

  async getTransacoes(id: number, tipo?: 'credito' | 'debito', page?: number, limit?: number) {
    return getClienteTransacoes(this.prisma, this.logger, id, tipo, page, limit);
  }
}
