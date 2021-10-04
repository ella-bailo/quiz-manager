const options: ClientConfig = {
  host: 'localhost',
  port: 5433,
  user: 'main',
  database: 'quiz-manager-db',
  password: 'password',
};

jest.doMock('./options', () => ({ options }));
import { ClientConfig } from 'pg';
import {
  verifyUsername,
  verifyPassword,
  getPayload,
  hashPassword,
} from './login-service';

const validUsername = 'user_one';
const validPassword = 'password';
const invalidUsername = 'invalid_username';
const invalidPassword = 'invalid_password';
const hashedPassword =
  'e4a7b08a28821a0cc52bde6447f31482b5a3f23ef9199c44cd5e2e43c4f9e2f9c5c8872ef21d2595f7e2631087bf2e8c502cb929e066664ceae131eddc8a122b';

beforeEach(() => {
  options.host = 'localhost';
  options.port = 5433;
  options.user = 'main';
  options.database = 'quiz-manager-db';
  options.password = 'password';
});

describe('login-service', () => {
  describe('verifyUsername', () => {
    it('returns true if username is in the database', async () => {
      const result = await verifyUsername(validUsername);
      expect(result).toEqual(true);
    });
    it('returns undefined if username is not the database', async () => {
      const result = await verifyUsername(invalidUsername);
      expect(result).toEqual(undefined);
    });
  });
  describe('hashPassword', () => {
    it('returns a string that diffres to the password', async () => {
      const result = await hashPassword(validUsername, validPassword);
      expect(result).not.toEqual(validPassword);
    });
  });
  describe('verifyPassword', () => {
    it('returns true when given a valid username and password', async () => {
      const result = await verifyPassword(validUsername, hashedPassword);
      expect(result).toEqual(true);
    });
    it('returns undefined if username and password', async () => {
      const result = await verifyPassword(validUsername, invalidPassword);
      expect(result).toEqual(undefined);
    });
  });
  describe('getPayload', () => {
    it('returns a session when given a valid username and hashed password', async () => {
      const result = await getPayload(validUsername, hashedPassword);
      expect(result).toEqual(
        expect.objectContaining({
          expires: expect.any(Number),
          issued: expect.any(Number),
          token: expect.any(String),
        })
      );
    });
  });
});
