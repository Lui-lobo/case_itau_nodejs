// Importando modulos comuns do nest
import { UnauthorizedException } from '@nestjs/common';
// Importando Serviços
import { PrismaService } from '../../../apis/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../../../common/crypto/crypto.service';
import { LoggerService } from '../../../common/logger/logger.service';
// Importando DTOs
import { LoginClienteDto } from '../dto/login-cliente-dto';
// Importando funções de validação
import validateClientOrThrow from './validateClientOrThrow';

export default async function loginCliente(
  prisma: PrismaService,
  jwt: JwtService,
  crypto: CryptoService,
  logger: LoggerService,
  clientId: number,
  data: LoginClienteDto,
) {
  const context = 'UsersService:loginCliente';
  logger.track(context, { email: data.email, action: 'start' }, context);

  await validateClientOrThrow(prisma, clientId);

  const cliente = await prisma.cliente.findUnique({
    where: { email: data.email },
    include: { clients: { include: { client: true } } },
  });

  if (!cliente || !(await crypto.comparePassword(data.password, cliente.password))) {
    logger.warn(`Credenciais inválidas para ${data.email}`, context);
    throw new UnauthorizedException('Credenciais inválidas.');
  }

  let vinculo = await prisma.clienteClient.findFirst({
    where: { clienteId: cliente.id, clientId },
    include: { client: true },
  });

  if (!vinculo) {
    vinculo = await prisma.clienteClient.create({
      data: { clienteId: cliente.id, clientId },
      include: { client: true },
    });
    logger.log(`Novo vínculo criado: Cliente ${cliente.email} → Client ${vinculo.client.name}`, context);
  }

  const payload = { sub: cliente.id, email: cliente.email, clientId };
  const accessToken = jwt.sign(payload);

  logger.track(context, { id: cliente.id, action: 'end' }, context);

  return {
    accessToken,
    user: {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      clientId,
      clientName: vinculo.client.name,
    },
  };
}
