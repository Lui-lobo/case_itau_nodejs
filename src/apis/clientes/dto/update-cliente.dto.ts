// Importando decorador de propriedade opcional do swagger
import { ApiPropertyOptional } from '@nestjs/swagger';
// Importando decoradores de validação de classe
import { IsEmail, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
export class UpdateClienteDto {
  @ApiPropertyOptional({ example: 'Novo Nome' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: 'novoemail@teste.com' })
  @ValidateIf((o) => o.email !== undefined && o.email !== null)
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'novaSenha123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
