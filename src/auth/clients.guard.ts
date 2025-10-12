// Importando modulos comuns do nest
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
// Importando serviço do prisma
import { PrismaService } from '../apis/prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
// Importando requisição do express
import { Request } from 'express';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const contextLabel = 'ClientAuthGuard';
    const op = `${contextLabel}:validate`;

    const clientId = req.headers['x-client-id'] as string;
    const clientSecret = req.headers['x-client-secret'] as string;

    if (!clientId || !clientSecret) {
      this.logger.warn('Missing client credentials', contextLabel);
      throw new UnauthorizedException('Missing client credentials');
    }

    // Busca o cliente no banco
    const client = await this.prisma.client.findUnique({
      where: { clientId },
    });

    if (!client || client.clientSecret !== clientSecret || !client.active) {
      this.logger.warn(
        `Invalid client credentials for clientId=${clientId}`,
        contextLabel,
      );
      throw new UnauthorizedException('Invalid client credentials');
    }

    // Tratando allowedRoutes (pode ser JSON/string)
    let allowedRoutes: string[] = [];

    if (Array.isArray(client.allowedRoutes)) {
      allowedRoutes = client.allowedRoutes as string[];
    } else if (typeof client.allowedRoutes === 'string') {
      // fallback, caso alguém tenha armazenado como string
      allowedRoutes = (client.allowedRoutes as string)
        .split(',')
        .map((r) => r.trim());
    } else if (client.allowedRoutes === null) {
      allowedRoutes = [];
    }

    // Verificação de permissão de rota
    const route = req.route?.path || req.originalUrl;

    const isAllowed =
      allowedRoutes.includes('*') ||
      allowedRoutes.some((pattern) => route.startsWith(pattern));

    if (!isAllowed) {
      this.logger.warn(
        `Client ${client.clientId} tried to access forbidden route: ${route}`,
        contextLabel,
      );
      throw new ForbiddenException('Client not allowed for this route');
    }

    // Sucesso — anexa o client ao request para uso posterior
    req['client'] = client;
    this.logger.track(
      op,
      { clientId, route, result: 'validated' },
      contextLabel,
    );

    return true;
  }
}
