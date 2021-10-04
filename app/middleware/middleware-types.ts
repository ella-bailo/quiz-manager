export interface User {
  id: number;
  dateCreated: number;
  username: string;
  password: string;
}

export interface Payload {
  uuid: number;
  username: string;
  userType: number;
  issued: number;
  expires: number;
  alg: 'HS256';
  typ: 'JWT';
}

export type PartialPayload = Omit<Payload, 'issued' | 'expires'>;

export interface EncodeResult {
  token: string;
  expires: number;
  issued: number;
}

export type DecodeResult =
  | {
      type: 'valid';
      payload: Payload;
    }
  | {
      type: 'integrity-error';
    }
  | {
      type: 'invalid-token';
    };

export type ExpirationStatus = 'expired' | 'active';

export type Permission =
  | { restricted: true }
  | { view: true }
  | { edit: true }
  | { invalid: true };
