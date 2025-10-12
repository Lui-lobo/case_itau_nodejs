// Importando serviços
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../../common/logger/logger.service';
// Importando Modulos comuns do Nest
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

export default async function getClienteTransacoes(
  prisma: PrismaService,
  logger: LoggerService,
  id: number,
  tipo?: 'credito' | 'debito', // filtro opcional
  page = 1,
  limit = 10,
) {
  const context = 'getClienteTransacoes';
  const op = `${context}:execute`;

  logger.track(op, { id, tipo, page, limit, action: 'start' }, context);

  // Verifica se cliente existe e está ativo
  const cliente = await prisma.cliente.findUnique({ where: { id } });

  if (!cliente) {
    logger.warn(`Cliente ${id} não encontrado`, context);
    throw new NotFoundException(`Cliente ${id} não encontrado.`);
  }

  if (!cliente.active) {
    logger.warn(`Cliente ${id} está inativo`, context);
    throw new BadRequestException('Cliente inativo. Operação não permitida.');
  }

  // Monta o filtro dinâmico
  const where = { clienteId: id, ...(tipo ? { tipo } : {}) };

  // Busca total de transações e aplica paginação
  const [total, transacoes] = await prisma.$transaction([
    prisma.transacao.count({ where }),
    prisma.transacao.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  logger.track(op, { id, action: 'end', total }, context);

  return {
    clienteId: id,
    total,
    pagina: page,
    porPagina: limit,
    saldoAtual: cliente.saldo,
    transacoes,
  };
}
