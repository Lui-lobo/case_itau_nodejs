// Importando modulos de teste do nest
import { Test, TestingModule } from '@nestjs/testing';
// Importando controladores a serem testados
import { ClientesController } from '../clientes.controller';
// Importando serviços a serem utilizados
import { ClientesService } from '../clientes.service';
import { LoggerService } from '../../../common/logger/logger.service';
// Importando mocks
import { makeClientesServiceMock } from './mocks/clientes.service.mock';
import { makeLoggerMock } from './mocks/logger.mock';
import { ClientAuthGuardMock } from './mocks/client-auth.guard.mock';
import { JwtAuthGuardMock } from './mocks/jwt-auth.guard.mock';
// Importando Guards
import { ClientAuthGuard } from '../../../auth/clients.guard';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

describe('ClientesController', () => {
  let controller: ClientesController;
  let service: ReturnType<typeof makeClientesServiceMock>;
  let logger: ReturnType<typeof makeLoggerMock>;

  beforeEach(async () => {
    service = makeClientesServiceMock();
    logger = makeLoggerMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [
        { provide: ClientesService, useValue: service },
        { provide: LoggerService, useValue: logger },
      ],
    })
      .overrideGuard(ClientAuthGuard)
      .useValue(ClientAuthGuardMock)
      .overrideGuard(JwtAuthGuard)
      .useValue(JwtAuthGuardMock)
      .compile();

    controller = module.get<ClientesController>(ClientesController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('list()', () => {
    it('deve chamar getAll() do serviço e retornar clientes', async () => {
      const mockClientes = [{ id: 1, nome: 'A' }];
      service.getAll.mockResolvedValue(mockClientes);

      const result = await controller.list();

      expect(result).toEqual(mockClientes);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('get()', () => {
    it('deve buscar cliente por ID', async () => {
      const cliente = { id: 1, nome: 'A' };
      service.getById.mockResolvedValue(cliente);

      const result = await controller.get(1);
      expect(result).toEqual(cliente);
      expect(service.getById).toHaveBeenCalledWith(1);
    });
  });

  describe('create()', () => {
    it('deve criar cliente e retornar DTO', async () => {
      const dto = { nome: 'Teste', email: 'a@a.com', password: '123' };
      const created = { id: 1, email: dto.email, clientId: 1 };
      service.create.mockResolvedValue(created);

      const result = await controller.create(dto as any);
      expect(result).toEqual(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update()', () => {
    it('deve atualizar cliente', async () => {
      service.update.mockResolvedValue(true);
      const dto = { nome: 'Novo' };
      const result = await controller.update(1, dto as any);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toBe(true);
    });
  });

  describe('remove()', () => {
    it('deve inativar cliente', async () => {
      service.delete.mockResolvedValue({ message: 'inativado' });

      const result = await controller.remove(1);
      expect(result).toEqual({ message: 'inativado' });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('depositar()', () => {
    it('deve realizar depósito', async () => {
      const response = { message: 'Depósito OK', novoSaldo: 150 };
      service.depositar.mockResolvedValue(response);

      const result = await controller.depositar(1, { valor: 50 });
      expect(result).toEqual(response);
      expect(service.depositar).toHaveBeenCalledWith(1, 50);
    });
  });

  describe('sacar()', () => {
    it('deve realizar saque', async () => {
      const response = { message: 'Saque OK', novoSaldo: 50 };
      service.sacar.mockResolvedValue(response);

      // Mockando usuário de teste
      const user = { 
        id: 1,
        nome: 'teste',
        email: 'teste@teste.com.br',
        password: '1234567',
        active: true,
        saldo: 100,
        createdAt: Date(),
        updatedAt: Date()
      }

      // Mock do objeto Request com user dentro
      const mockRequest = { user };

      const result = await controller.sacar(1, { valor: 20 }, mockRequest);
      expect(result).toEqual(response);
      expect(service.sacar).toHaveBeenCalledWith(1, 20, user);
    });
  });

  describe('getTransacoes()', () => {
    it('deve listar transações com paginação', async () => {
      const response = { total: 2, transacoes: [] };
      service.getTransacoes.mockResolvedValue(response);

      const result = await controller.getTransacoes(1, 'credito', 1, 10);
      expect(result).toEqual(response);
      expect(service.getTransacoes).toHaveBeenCalledWith(1, 'credito', 1, 10);
    });
  });
});
