// Definindo decorador de propriedade do swagger
import { ApiProperty } from '@nestjs/swagger';
// Importando validator de classe de requisição
import { IsNumber, Min } from 'class-validator';

export class TransactionDto {
  @ApiProperty({ example: 100.50, description: 'Valor da transação' })
  @IsNumber({}, { message: 'O valor deve ser numérico' })
  @Min(0.01, { message: 'O valor deve ser maior que zero' })
  valor: number;
}
