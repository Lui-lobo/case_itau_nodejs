// Importando modulos de teste do nest
import { Test, TestingModule } from '@nestjs/testing';
// Importando controladores
import { UsersController } from '../users.controller';
// Importando serviços
import { UsersService } from '../users.service';
// Importando Guards
import { ClientAuthGuard } from '../../clients.guard';
import { ClientAuthGuardMock } from './mocks/client-auth.guard.mock';
// Importando mocks
import { makeUsersServiceMock } from './mocks/users.service.mock';

describe('UsersController', () => {
  let controller: UsersController;
  let service: ReturnType<typeof makeUsersServiceMock>;

  beforeEach(async () => {
    service = makeUsersServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: service }],
    })
      .overrideGuard(ClientAuthGuard)
      .useValue(ClientAuthGuardMock)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('register()', () => {
    it('deve chamar usersService.register com os dados corretos e retornar resultado', async () => {
      const dto = { nome: 'User', email: 'u@u.com', password: '123', clientId: 1 };
      const expected = { id: 1, email: 'u@u.com', clientId: 1 };

      service.register.mockResolvedValue(expected);

      const result = await controller.register(dto as any);

      expect(result).toEqual(expected);
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login()', () => {
    it('deve chamar usersService.login com clientId e dados do corpo', async () => {
      const req = { client: { id: 99 } };
      const dto = { email: 'user@mail.com', password: '123' };
      const expected = { accessToken: 'abc123', user: { id: 1 } };

      service.login.mockResolvedValue(expected);

      const result = await controller.login(req, dto as any);

      expect(result).toEqual(expected);
      expect(service.login).toHaveBeenCalledWith(99, dto);
    });
  });
});
