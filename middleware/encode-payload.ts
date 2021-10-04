import { encode, TAlgorithm } from 'jwt-simple';
import { EncodeResult, PartialPayload, Payload } from './middleware-types';

export const encodePayload = (
  secretKey: string,
  partialPayload: PartialPayload
): EncodeResult => {
  const algorithm: TAlgorithm = 'HS256';
  const issued = Date.now();
  const fifteenMinutesInMs = 15 * 60 * 1000;
  const expires = issued + fifteenMinutesInMs;
  const payload: Payload = {
    ...partialPayload,
    issued: issued,
    expires: expires,
  };

  return {
    token: encode(payload, secretKey, algorithm),
    issued: issued,
    expires: expires,
  };
};
