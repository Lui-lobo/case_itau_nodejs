// Importando decorador de propriedade parcial do swagger
import { PartialType } from '@nestjs/swagger';
// Importando DTO de criação do cliente (Uma atualização manipula parcialmente dados existentes do cliente)
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {}