// Importando libs comuns do nestJs
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
// Importando lib de JWT
import { JwtService } from '@nestjs/jwt';
// Importando serviços de criptografia
import { CryptoService } from '../../common/crypto/crypto.service';
// Importando DTOs
import { RegisterClienteDto } from './dto/register-cliente.dto';
import { LoginClienteDto } from './dto/login-cliente-dto';
// Importando serviços
import { LoggerService } from '../../common/logger/logger.service';
import { PrismaService } from '../../apis/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly crypto: CryptoService,
    private readonly logger: LoggerService,
  ) {}

   // 🔹 NOVO MÉTODO: valida se o client enviado é válido e ativo
  private async validateClientOrThrow(clientId: number) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException(`Client com id=${clientId} não encontrado.`);
    }

    if (!client.active) {
      throw new UnauthorizedException(
        `O client "${client.name}" está desativado.`,
      );
    }

    return client;
  }

  async register(data: RegisterClienteDto) {
    const context = 'UsersService:registerCliente';
    this.logger.track(context, { email: data.email, action: 'start' }, context);

    // Validação de client antes de qualquer operação
    const client = await this.validateClientOrThrow(data.clientId);

    const exists = await this.prisma.cliente.findUnique({
      where: { email: data.email },
    });

    if (exists) throw new UnauthorizedException('Email já registrado.');

    const password = await this.crypto.hashPassword(data.password);
    const cliente = await this.prisma.cliente.create({
      data: {
        nome: data.nome,
        email: data.email,
        password,
      },
    });

    // cria o vínculo com o client (app)
    await this.prisma.clienteClient.create({
      data: { clienteId: cliente.id, clientId: client.id },
    });

    this.logger.track(context, { id: cliente.id, action: 'end' }, context);
    return { id: cliente.id, email: cliente.email, clientId: client.id };
  }

  async login(clientId: number, data: LoginClienteDto) {
    const context = 'UsersService:loginCliente';
    this.logger.track(context, { email: data.email, action: 'start' }, context);

    // Validação de client antes de qualquer operação
    await this.validateClientOrThrow(clientId);

    const cliente = await this.prisma.cliente.findUnique({
      where: { email: data.email },
      include: { clients: { include: { client: true } } },
    });

    if (!cliente || !(await this.crypto.comparePassword(data.password, cliente.password))) {
      this.logger.warn(`Credenciais inválidas para ${data.email}`, context);
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // garante vínculo com o client autenticado
    let vinculo = await this.prisma.clienteClient.findFirst({
      where: { clienteId: cliente.id, clientId },
      include: { client: true },
    });

    if (!vinculo) {
      vinculo = await this.prisma.clienteClient.create({
        data: { clienteId: cliente.id, clientId },
        include: { client: true },
      });
      this.logger.log(
        `Novo vínculo criado: Cliente ${cliente.email} → Client ${vinculo.client.name}`,
        context,
      );
    }

    const payload = {
      sub: cliente.id,
      email: cliente.email,
      clientId,
    };

    const accessToken = this.jwt.sign(payload);

    this.logger.track(context, { id: cliente.id, action: 'end' }, context);

    return {
      accessToken,
      user: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        clientId,
        clientName: vinculo.client.name,
      },
    };
  }

  async validateById(id: number) {
    return this.prisma.cliente.findUnique({ where: { id } });
  }
}