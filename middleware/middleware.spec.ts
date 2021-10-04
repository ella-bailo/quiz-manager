import { encodePayload } from './encode-payload';
import { decodePayload } from './decode-payload';
import { checkExpirationStatus } from './check-experiation-status';
import { PartialPayload, Payload } from './middleware-types';

const mockSecretKey = 'supersecretstring';
const mockPartialPayload: PartialPayload = {
  uuid: 1,
  username: 'user_one',
  userType: 3,
  alg: 'HS256',
  typ: 'JWT',
};

const mockActivePayload: Payload = {
  uuid: 1,
  username: 'user_one',
  userType: 3,
  issued: Date.now(),
  expires: Date.now() + 15 * 60 * 1000,
  alg: 'HS256',
  typ: 'JWT',
};

const mockExpiredPayload: Payload = {
  uuid: 1,
  username: 'user_one',
  userType: 3,
  issued: 1632908667553,
  expires: 1632909567553,
  alg: 'HS256',
  typ: 'JWT',
};

const mockToken = encodePayload(mockSecretKey, mockPartialPayload)['token'];

describe('middleware', () => {
  describe('endcode payload', () => {
    it('it returns an encoded payload', () => {
      const result = encodePayload(mockSecretKey, mockPartialPayload);
      expect(result).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          issued: expect.any(Number),
          expires: expect.any(Number),
        })
      );
    });
  });

  describe('decode payload', () => {
    it('returns decoded payload', async () => {
      const result = await decodePayload(mockToken, mockSecretKey);
      expect(result).toEqual(
        expect.objectContaining({
          type: 'valid',
          payload: expect.objectContaining(mockPartialPayload),
        })
      );
    });
    it('returns type invalid-token if there is an error', async () => {
      const result = await decodePayload('', mockSecretKey);
      expect(result).toEqual(
        expect.objectContaining({ type: 'invalid-token' })
      );
    });
  });

  describe('check expiration status', () => {
    it('returns active for a token that is less than 15mins old', () => {
      const result = checkExpirationStatus(mockActivePayload);
      expect(result).toEqual('active');
    });

    it('returns expired for a token that is more than 15mins old', () => {
      const result = checkExpirationStatus(mockExpiredPayload);
      expect(result).toEqual('expired');
    });
  });
});
