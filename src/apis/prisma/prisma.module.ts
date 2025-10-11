// Importando modulos comuns do nest
import { Module } from '@nestjs/common';
// Importando serviço do prisma
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService]
})

export class PrismaModule {}