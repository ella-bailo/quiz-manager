import { decode, TAlgorithm } from 'jwt-simple';
import { DecodeResult, Payload } from './middleware-types';

export const decodePayload = async (
  tokenString: string,
  secretKey: string
): Promise<DecodeResult> => {
  const algorithm: TAlgorithm = 'HS256';

  let result: Payload;

  try {
    result = await decode(tokenString, secretKey, true, algorithm);
  } catch {
    return {
      type: 'invalid-token',
    };
  }
  return {
    type: 'valid',
    payload: result,
  };
};
