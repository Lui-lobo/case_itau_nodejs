// importando serviços
import { PrismaService } from '../../../apis/prisma/prisma.service';
import { LoggerService } from '../../../common/logger/logger.service';
import { UsersService } from '../../..//auth/users/users.service';
// Importando DTOs
import { RegisterClienteDto } from 'src/auth/users/dto/register-cliente.dto';

export default async function createCliente(
  prisma: PrismaService,
  logger: LoggerService,
  usersService: UsersService,
  data: RegisterClienteDto,
) {
  const context = 'createCliente';
  const op = `${context}:execute`;

  logger.track(op, { email: data.email, action: 'start' }, context);

  const result = await usersService.register(data);

  logger.track(op, { email: data.email, action: 'end' }, context);
  
  return result;
}
