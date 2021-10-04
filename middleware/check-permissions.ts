import { decodePayload } from './decode-payload';
import { Request } from 'express';
import { Permission } from 'middleware/middleware-types';

const secret = process.env.SECRET_KEY || 'supersecretstring';

export const checkPermissions = async (
  request: Request
): Promise<Permission> => {
  const header = request.cookies['X-JWT-Token'];
  const payload = await decodePayload(header, secret);
  const userType = payload['payload']['userType'];
  const type = payload['type'];

  if (type === 'valid') {
    if (userType === 1) {
      return { restricted: true };
    }
    if (userType === 2) {
      return { view: true };
    }
    if (userType === 3) {
      return { edit: true };
    }
  }
  return { invalid: true };
};
