// Importando modulos comuns do nest
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
// Importando serviço do prisma
import { PrismaService } from '../../../apis/prisma/prisma.service';

export default async function validateClientOrThrow(prisma: PrismaService, clientId: number) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });

  if (!client) throw new NotFoundException(`Client com id=${clientId} não encontrado.`);
  if (!client.active) throw new UnauthorizedException(`O client "${client.name}" está desativado.`);

  return client;
}
