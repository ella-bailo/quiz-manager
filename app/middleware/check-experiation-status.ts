import { Payload, ExpirationStatus } from './middleware-types';

export const checkExpirationStatus = (token: Payload): ExpirationStatus => {
  const now = Date.now();

  if (token.expires > now) return 'active';
  return 'expired';
};
