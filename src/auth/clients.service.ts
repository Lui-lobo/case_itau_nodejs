// Importando modulos 
import { Injectable } from '@nestjs/common';
// Importando serviços
import { PrismaService } from '../apis/prisma/prisma.service';
// Importando DTOs
import { CreateClientDto } from './dto/create-client.dto';
// Importando modelo do client
import { Client } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClientDto): Promise<Client> {
    return this.prisma.client.create({ data });
  }

  async findAll(): Promise<Client[]> {
    return this.prisma.client.findMany();
  }

  async validate(clientId: string, clientSecret: string): Promise<Client | null> {
    return this.prisma.client.findFirst({
      where: { clientId, clientSecret, active: true },
    });
  }
}
