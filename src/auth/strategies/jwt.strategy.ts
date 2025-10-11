// Importando modulso comuns do Nest
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// Importando passport de JWT
import { ExtractJwt, Strategy } from 'passport-jwt';
// Importando serviçso de usuário
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.validateById(payload.sub);
    if (!user) return null;
    return user;
  }
}
