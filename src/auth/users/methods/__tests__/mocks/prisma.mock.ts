export const makePrismaMock = () => ({
  client: { findUnique: jest.fn() },
  cliente: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  clienteClient: {
    create: jest.fn(),
    findFirst: jest.fn(),
  },
});
