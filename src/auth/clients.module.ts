// Importando modulos comuns do nest
import { Module } from '@nestjs/common';
// Importando Serviços
import { PrismaService } from '../apis/prisma/prisma.service';
import { ClientsService } from './clients.service';

@Module({
  providers: [ClientsService, PrismaService],
  exports: [ClientsService],
})
export class ClientsModule {}
