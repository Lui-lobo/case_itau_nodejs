export const makeCryptoMock = () => ({
  hashPassword: jest.fn(async (val: string) => `hashed_${val}`),
  comparePassword: jest.fn(async () => true),
});