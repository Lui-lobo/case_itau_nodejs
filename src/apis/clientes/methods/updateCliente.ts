// Importando serviços
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../../common/logger/logger.service';
import { CryptoService } from 'src/common/crypto/crypto.service';
// Importando DTOs de validação
import { UpdateClienteDto } from '../dto/update-cliente.dto';
// Importando modulos comuns do nestJs
import { NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';

export default async function updateCliente(
  prisma: PrismaService,
  logger: LoggerService,
  crypto: CryptoService,
  id: number,
  data: UpdateClienteDto,
): Promise<Boolean> {
  const context = 'updateCliente';
  const op = `${context}:execute`;

  logger.track(op, { id, action: 'start', data }, context);

  const existing = await prisma.cliente.findUnique({ where: { id } });

  if (!existing) {
    logger.warn(`Cliente ${id} não encontrado`, context);
    throw new NotFoundException(`Cliente ${id} não encontrado.`);
  }

  if (data.email) {
    const emailExists = await prisma.cliente.findFirst({
      where: {
        email: data.email,
        NOT: { id }, // ignora o próprio cliente
      },
    });

    if (emailExists) {
      logger.warn(
        `Tentativa de atualizar cliente ${id} com email já existente: ${data.email}`,
        context,
      );
      throw new BadRequestException(
        'Tentativa de atualização ilegal',
      );
    }
  }

  try {
    // Criptografa a senha, caso esteja presente
    let updateData: any = { ...data };

    if (data.password) {
      updateData.password = await crypto.hashPassword(data.password);
    }

    await prisma.cliente.update({
      where: { id },
      data: updateData,
    });

    logger.track(op, { id, action: 'end' }, context);

    return true;
  } catch (err) {
    logger.error(
      `Erro ao atualizar cliente ${id}: ${JSON.stringify(err.message)}`,
      context,
    );
    throw new InternalServerErrorException('Erro ao atualizar cliente.');
  }
}
