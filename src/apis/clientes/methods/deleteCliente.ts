// Importando serviços
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../../common/logger/logger.service';
// Importando Modulos Comuns do nest
import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

export default async function deleteCliente(
  prisma: PrismaService,
  logger: LoggerService,
  id: number,
) {
  const context = 'deleteCliente';
  const op = `${context}:execute`;

  logger.track(op, { id, action: 'start' }, context);

  const cliente = await prisma.cliente.findUnique({ where: { id } });

  if (!cliente) {
    logger.warn(`Tentativa de deletar cliente inexistente: ${id}`, context);
    throw new NotFoundException(`Cliente ${id} não encontrado.`);
  }

  if (!cliente.active) {
    logger.warn(`Cliente ${id} já está inativo.`, context);
    throw new BadRequestException(`Cliente ${id} já está inativo.`);
  }

  try {
    await prisma.cliente.update({
      where: { id },
      data: { active: false },
    });

    logger.track(op, { id, action: 'end' }, context);
    
    return { message: `Cliente ${id} foi desativado com sucesso.` };
  } catch (err) {
    logger.error(
      `Erro ao desativar cliente ${id}: ${JSON.stringify(err.message)}`,
      context,
    );
    throw new InternalServerErrorException('Erro ao desativar cliente.');
  }
}
