// Importando modulos comuns do nest
import { Module } from '@nestjs/common';
// Importando controladores
import { UsersController } from './users.controller';
// Importando serviços
import { UsersService } from './users.service';
import { PrismaService } from '../../apis/prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';
// Importando Strategia Jwt
import { JwtStrategy } from '../strategies/jwt.strategy';
// Importando modulos
import { CryptoModule } from '../../common/crypto/crypto.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // 👈 necessário
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1h' },
    }),
    CryptoModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, LoggerService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
