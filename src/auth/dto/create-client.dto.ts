// Importando decorador de propriedades do swagger
import { ApiProperty } from '@nestjs/swagger';
// Importando decoradores de validação de classe
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiProperty()
  @IsString()
  clientSecret: string;

  @ApiProperty({ example: ['*'] })
  @IsArray()
  allowedRoutes: string[];

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}