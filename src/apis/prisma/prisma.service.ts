// Importando os modulos comuns do nestJs
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// Importando o cliente do prisma
import { Prisma, PrismaClient } from '@prisma/client';
// Importando serviços
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: LoggerService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    // Resolvendo a tipagem do $on manualmente:
    const client = this as unknown as PrismaClient<
      Prisma.PrismaClientOptions,
      'query' | 'error' | 'warn'
    >;

    // --- Query logs ---
    client.$on('query', (event: Prisma.QueryEvent) => {
      const { query, params, duration, target } = event;
      const context = 'Prisma:query';

      this.logger.log(
        this.logger.format(
          `model=${target || 'unknown'} durationMs=${duration}`,
          context,
        ),
      );

      if (process.env.NODE_ENV !== 'production') {
        this.logger.debug(
          this.logger.format(`${query} -- params: ${params}`, context),
        );
      }
    });

    // --- Warnings ---
    client.$on('warn', (event: Prisma.LogEvent) => {
      const context = 'Prisma:warn';
      this.logger.warn(event.message, context);
    });

    // --- Errors ---
    client.$on('error', (event: Prisma.LogEvent) => {
      const context = 'Prisma:error';
      this.logger.error(event.message, undefined, context);
    });

    await this.$connect();
    this.logger.log('📦 Prisma connected', 'PrismaService');

    // Seed automático do cliente padrão
    const defaultClientId = 'default-client';
    const defaultSecret = 'default-secret-key';

    const existing = await this.client.findUnique({
      where: { clientId: defaultClientId },
    });

    if (!existing) {
      await this.client.create({
        data: {
          name: 'Default Client',
          clientId: defaultClientId,
          clientSecret: defaultSecret,
          allowedRoutes: ['*'], // acesso total
        },
      });

      this.logger.log(
        `🔑 Default API Client criado: clientId=${defaultClientId} secret=${defaultSecret}`,
        'PrismaService',
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🧩 Prisma disconnected', 'PrismaService');
  }
}