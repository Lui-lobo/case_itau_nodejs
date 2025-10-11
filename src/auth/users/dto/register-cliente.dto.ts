// Importando decorador de propriedades da documentação no swagger
import { ApiProperty } from '@nestjs/swagger';
// Importando decoradores de validação de classes
import { IsEmail, IsInt, IsString, MinLength } from 'class-validator';

export class RegisterClienteDto {
  @ApiProperty() @IsString() nome: string;
  @ApiProperty() @IsEmail()  email: string;

  @ApiProperty() @IsString() @MinLength(6)
  password: string;

  @ApiProperty({ example: 1 }) @IsInt()
  clientId: number; // app (Client) ao qual este Cliente pertence
}