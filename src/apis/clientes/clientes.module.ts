// Importando libs comuns do nestJs
import { Module } from '@nestjs/common';
// Importando controladores deste modulo
import { ClientesController } from './clientes.controller';
// Importandos serviços a serem utilizados/exportados
import { ClientesService } from './clientes.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, PrismaService, LoggerService],
  exports: [ClientesService],
})

export class ClientesModule {}
