import { Request, Response, NextFunction } from 'express';
import { ExpirationStatus, DecodeResult } from './middleware-types';
import { decodePayload } from './decode-payload';
import { checkExpirationStatus } from './check-experiation-status';

const secret = process.env.SECRET_KEY || 'supersecretstring';

export const middleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const unauthorized = (message: string) =>
    response.status(401).json({
      ok: false,
      status: 401,
      message: message,
    });
  const header = request.cookies['X-JWT-Token'];

  if (!header) {
    response.redirect(302, '/');
    return;
  }

  const decodedPayload: DecodeResult = await decodePayload(header, secret);

  if (
    decodedPayload.type === 'integrity-error' ||
    decodedPayload.type === 'invalid-token'
  ) {
    unauthorized(
      `Failed to decode or validate authorization token. Reason: ${decodedPayload.type}.`
    );
    return;
  }

  const expiration: ExpirationStatus = checkExpirationStatus(
    decodedPayload.payload
  );

  if (expiration === 'expired') {
    unauthorized(
      `Authorization token has expired. Please create a new authorization token.`
    );
    return;
  }
  next();
};
