// Importando modulos comuns do nest
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
// Importando modulo de configuração do Nest
import { ConfigModule } from '@nestjs/config';
// Importando Throttler para limitar quantidade de requisições/s por IP
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// Importando Guard da aplicação
import { APP_GUARD } from '@nestjs/core';
// Importando serviços a serem utilizados na aplicação
import { PrismaService } from './apis/prisma/prisma.service';
// Importando modulos da aplicação
import { ClientesModule } from './apis/clientes/clientes.module';
import { LoggerModule } from './common/logger/logger.module';
// Importando Libs comuns de nossa aplicação
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate limiting: 100 requisições / 60s por IP (ajuste conforme necessidade)
    ThrottlerModule.forRoot([{
      ttl: 60_000,
      limit: 100,
    }]),
    ClientesModule,
    LoggerModule
  ],
  providers: [
    PrismaService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
