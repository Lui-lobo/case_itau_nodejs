// Importando cliente do prisma
import { Prisma } from '@prisma/client';
// Importando serviços
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../../common/logger/logger.service';
// Importando modulos comuns do nest
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export default async function sacar(
  prisma: PrismaService,
  logger: LoggerService,
  id: number,
  valor: number,
) {
  const context = 'sacar';
  const op = `${context}:execute`;

  logger.track(op, { id, valor, action: 'start' }, context);

  // 🔹 Validação inicial
  if (valor <= 0) {
    logger.warn(`Valor inválido para saque: ${valor}`, context);
    throw new BadRequestException('O valor do saque deve ser maior que zero.');
  }

  // 🔹 Busca o cliente
  const cliente = await prisma.cliente.findUnique({ where: { id } });

  if (!cliente) {
    logger.warn(`Cliente ${id} não encontrado`, context);
    throw new NotFoundException(`Cliente ${id} não encontrado.`);
  }

  if (!cliente.active) {
    logger.warn(`Cliente ${id} está inativo`, context);
    throw new BadRequestException('Cliente inativo. Operação não permitida.');
  }

  // 🔹 Verifica saldo suficiente
  const saldoAtual = new Prisma.Decimal(cliente.saldo);
  const valorDecimal = new Prisma.Decimal(valor);

  if (saldoAtual.lessThan(valorDecimal)) {
    logger.warn(
      `Saldo insuficiente para saque: saldo=${saldoAtual} valor=${valorDecimal}`,
      context,
    );
    throw new BadRequestException('Saldo insuficiente para realizar o saque.');
  }

  // 🔹 Executa a transação atômica
  try {
    const [updatedCliente, transacao] = await prisma.$transaction([
      prisma.cliente.update({
        where: { id },
        data: { saldo: saldoAtual.sub(valorDecimal) },
      }),
      prisma.transacao.create({
        data: {
          tipo: 'debito',
          valor: valorDecimal,
          clienteId: cliente.id,
        },
      }),
    ]);

    logger.track(op, { id, action: 'end', novoSaldo: updatedCliente.saldo }, context);

    return {
      message: 'Saque realizado com sucesso.',
      clienteId: cliente.id,
      valorSacado: valor,
      novoSaldo: updatedCliente.saldo,
      transacaoId: transacao.id,
      data: transacao.createdAt,
    };
  } catch (err) {
    logger.error(
      `Erro ao realizar saque para cliente ${id}: ${JSON.stringify(err.message)}`,
      context,
    );
    throw new InternalServerErrorException('Erro ao realizar saque.');
  }
}
