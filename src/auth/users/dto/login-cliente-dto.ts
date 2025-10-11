// Importando decorador de propriedades da documentação no swagger
import { ApiProperty } from '@nestjs/swagger';
// Importando decoradores de validação de classes
import { IsEmail, IsString } from 'class-validator';

export class LoginClienteDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() password: string;
}
