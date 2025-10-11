// Importando serviços
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../../common/logger/logger.service';
// Importando Modelos
import { Cliente } from '@prisma/client';

export default async function getAllClientes(
  prisma: PrismaService,
  logger: LoggerService
): Promise<Cliente[]> {
  const operation = 'getAllClientes';
  const start = Date.now();

  logger.track(operation, { action: 'start' });

  const clientes = await prisma.cliente.findMany({ orderBy: { id: 'asc' } });

  logger.track(operation, {
    action: 'end',
    durationMs: Date.now() - start,
    total: clientes.length,
  });

  return clientes;
}
