// Importando serviços
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../../common/logger/logger.service';
// Importando modulos comuns do nestJs
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
// Importando o client do prisma
import { Prisma } from '@prisma/client';

export default async function depositar(
  prisma: PrismaService,
  logger: LoggerService,
  id: number,
  valor: number,
) {
  const context = 'depositar';
  const op = `${context}:execute`;

  logger.track(op, { id, valor, action: 'start' }, context);

  if (valor <= 0) {
    logger.warn(`Valor inválido para depósito: ${valor}`, context);
    throw new BadRequestException('O valor do depósito deve ser maior que zero.');
  }

  // Verifica se o cliente existe e está ativo
  const cliente = await prisma.cliente.findUnique({ where: { id } });

  if (!cliente) {
    logger.warn(`Cliente ${id} não encontrado`, context);
    throw new NotFoundException(`Cliente ${id} não encontrado.`);
  }

  if (!cliente.active) {
    logger.warn(`Cliente ${id} está inativo`, context);
    throw new BadRequestException('Cliente inativo. Operação não permitida.');
  }

  // Executa a operação em transação atômica
  try {
    const newValue = new Prisma.Decimal(valor); // manter precisão no registro

    // converte o saldo (Decimal) para number antes de somar
    const [updatedCliente, transacao] = await prisma.$transaction([
      prisma.cliente.update({
        where: { id },
        data: { saldo: newValue },
      }),
      prisma.transacao.create({
        data: {
          tipo: 'credito',
          valor: newValue, // manter precisão no registro,
          clienteId: cliente.id,
        },
      }),
    ]);

    logger.track(op, { id, action: 'end', novoSaldo: updatedCliente.saldo }, context);

    return {
      message: 'Depósito realizado com sucesso.',
      clienteId: cliente.id,
      valorDepositado: newValue,
      novoSaldo: updatedCliente.saldo,
      transacaoId: transacao.id,
      data: transacao.createdAt,
    };
  } catch (err) {
    logger.error(
      `Erro ao realizar depósito para cliente ${id}: ${JSON.stringify(err.message)}`,
      context,
    );
    throw new InternalServerErrorException('Erro ao realizar depósito.');
  }
}
