// Definindo decorador de propriedade do swagger
import { ApiProperty } from '@nestjs/swagger';
// Importando validator de classe de requisição
import { IsNotEmpty, IsEmail, MaxLength, IsString, MinLength, IsInt } from 'class-validator';

export class returnCreateClientDto {
  id: number;

  @ApiProperty({ example: 'alexandrade@email.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(200)
  email: string;
  
  @ApiProperty({ example: 1 }) @IsInt()
  clientId: number; // app (Client) ao qual este Cliente pertence
}
