// Importando libs comuns do nestJs
import { Module } from '@nestjs/common';
// Importando controladores deste modulo
import { ClientesController } from './clientes.controller';
// Importandos serviços a serem utilizados/exportados
import { ClientesService } from './clientes.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';
import { UsersService } from 'src/auth/users/users.service';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
// Importando modulos
import { UsersModule } from 'src/auth/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ClientesController],
  providers: [ClientesService, PrismaService, LoggerService, UsersService, CryptoService, JwtService],
  exports: [ClientesService],
})

export class ClientesModule { }
