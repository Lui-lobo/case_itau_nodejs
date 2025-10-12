// Importando modulo comun do Nest
import { UnauthorizedException } from '@nestjs/common';
// Importando serviços
import { PrismaService } from '../../../apis/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../../../common/crypto/crypto.service';
import { LoggerService } from '../../../common/logger/logger.service';
// Importando função auxiliar
import validateClientOrThrow from './validateClientOrThrow';
// Importando DTOs
import { RegisterClienteDto } from '../dto/register-cliente.dto';

export default async function registerCliente(
  prisma: PrismaService,
  jwt: JwtService,
  crypto: CryptoService,
  logger: LoggerService,
  data: RegisterClienteDto,
) {
  const context = 'UsersService:registerCliente';
  logger.track(context, { email: data.email, action: 'start' }, context);

  const client = await validateClientOrThrow(prisma, data.clientId);

  const exists = await prisma.cliente.findUnique({ where: { email: data.email } });
  if (exists) throw new UnauthorizedException('Email já registrado.');

  const password = await crypto.hashPassword(data.password);

  const cliente = await prisma.cliente.create({
    data: { nome: data.nome, email: data.email, password },
  });

  await prisma.clienteClient.create({
    data: { clienteId: cliente.id, clientId: client.id },
  });

  logger.track(context, { id: cliente.id, action: 'end' }, context);
  return { id: cliente.id, email: cliente.email, clientId: client.id };
}
