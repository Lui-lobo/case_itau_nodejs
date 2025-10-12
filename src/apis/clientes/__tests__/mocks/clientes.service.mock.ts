export const makeClientesServiceMock = () => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  depositar: jest.fn(),
  sacar: jest.fn(),
  getTransacoes: jest.fn(),
});
