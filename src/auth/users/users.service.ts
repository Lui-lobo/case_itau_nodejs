// Importando libs comuns do nestJs
import { Injectable } from '@nestjs/common';
// Importando lib de JWT
import { JwtService } from '@nestjs/jwt';
// Importando serviços de criptografia
import { CryptoService } from '../../common/crypto/crypto.service';
// Importando DTOs
import { RegisterClienteDto } from './dto/register-cliente.dto';
import { LoginClienteDto } from './dto/login-cliente-dto';
// Importando serviços
import { LoggerService } from '../../common/logger/logger.service';
import { PrismaService } from '../../apis/prisma/prisma.service';
// Métodos
import validateClientOrThrow from './methods/validateClientOrThrow';
import registerCliente from './methods/registerCliente';
import loginCliente from './methods/loginCliente';
import validateById from './methods/validateById';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly crypto: CryptoService,
    private readonly logger: LoggerService,
  ) {}

  async register(data: RegisterClienteDto) {
    return registerCliente(this.prisma, this.jwt, this.crypto, this.logger, data);
  }

  async login(clientId: number, data: LoginClienteDto) {
    return loginCliente(this.prisma, this.jwt, this.crypto, this.logger, clientId, data);
  }

  async validateById(id: number) {
    return validateById(this.prisma, id);
  }

  async validateClientOrThrow(clientId: number) {
    return validateClientOrThrow(this.prisma, clientId);
  }
}