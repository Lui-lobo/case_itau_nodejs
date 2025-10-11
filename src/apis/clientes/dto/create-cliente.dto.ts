// Definindo decorador de propriedade do swagger
import { ApiProperty } from '@nestjs/swagger';
// Importando validator de classe de requisição
import { IsNotEmpty, IsEmail, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'Alex andrade' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MaxLength(120)
  nome: string;

  @ApiProperty({ example: 'alexandrade@email.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(200)
  email: string;
}
