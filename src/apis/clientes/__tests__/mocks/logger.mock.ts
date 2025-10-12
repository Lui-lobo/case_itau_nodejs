export const makeLoggerMock = () => ({
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  track: jest.fn(),
});