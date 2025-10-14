// Importando modulos comuns do nest
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
// Importando decoradores de documentação
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// Importando serviços
import { UsersService } from './users.service';
// Importando DTOs
import { RegisterClienteDto } from './dto/register-cliente.dto';
import { LoginClienteDto } from './dto/login-cliente-dto';
// Importando Guards
import { ClientAuthGuard } from '../clients.guard';
// Importando decoradores de documentação
import { DocLoginCliente } from './docs/docLogin';
import { DocRegisterCliente } from './docs/docRegister';

@ApiTags('auth-cliente')
@Controller('api/v1/auth')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // registro de cliente (app precisa estar autenticado)
  @UseGuards(ClientAuthGuard)
  @Post('register')
  @DocRegisterCliente()
  @ApiOperation({ summary: 'Registra um novo cliente (usuário final) para um app client' })
  async register(@Body() data: RegisterClienteDto) {
    return this.users.register(data);
  }

  // login de cliente: precisa do client autenticado (camada 1) + credenciais do cliente
  @UseGuards(ClientAuthGuard)
  @Post('login')
  @DocLoginCliente()
  @ApiOperation({ summary: 'Login do cliente (usuário final) vinculado ao client autenticado' })
  async login(@Req() req: any, @Body() data: LoginClienteDto) {
    const clientId = req.client.id as number; // anexado pelo ClientAuthGuard
    return this.users.login(clientId, data);
  }
}
