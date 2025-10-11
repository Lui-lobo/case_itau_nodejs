// Importando serviços
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../../common/logger/logger.service';
// Importando dependências
import { NotFoundException } from '@nestjs/common';
// Importando modelos
import { Cliente } from '@prisma/client';

export default async function getClienteById(
  prisma: PrismaService,
  logger: LoggerService,
  id: number,
): Promise<Cliente> {
  const context = 'getClienteById';
  const op = `${context}:findUnique`;
  const start = Date.now();

  logger.track(op, { id, action: 'start' }, context);

  const cliente = await prisma.cliente.findUnique({
    where: { id },
  });

  if (!cliente) {
    logger.warn(`Cliente id=${id} não encontrado`, context);
    throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
  }

  logger.track(
    op,
    { id, action: 'end', durationMs: Date.now() - start },
    context,
  );

  return cliente;
}
