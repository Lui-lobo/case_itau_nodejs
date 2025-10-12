// Importando serviços
import { PrismaService } from '../../../apis/prisma/prisma.service';

export default async function validateById(prisma: PrismaService, id: number) {
  return prisma.cliente.findUnique({ where: { id } });
}
