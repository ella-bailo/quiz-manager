import { Client } from 'pg';
import { options } from './options';
import { encodePayload } from '../middleware/encode-payload';
import { EncodeResult, PartialPayload } from '../middleware/middleware-types';
import crypto from 'crypto';

const secret = process.env.SECRET_KEY || 'supersecretstring';

const connect = async (): Promise<Client> => {
  const client = new Client(options);
  await client.connect();
  return client;
};

const getPayloadOptions = (result): PartialPayload => {
  return {
    uuid: result.uuid,
    username: result.username,
    userType: result.user_type,
    alg: 'HS256',
    typ: 'JWT',
  };
};

export const verifyUsername = async (
  username: string
): Promise<true | void> => {
  const client = await connect();
  const response = await client.query(
    'SELECT username FROM user_account WHERE username = $1',
    [username]
  );
  client.end();
  if (response.rows[0]) {
    return true;
  }
};

export const hashPassword = async (
  username: string,
  password: string
): Promise<string> => {
  const client = await connect();
  const response = await client.query(
    'SELECT salt FROM user_account WHERE username = $1',
    [username]
  );
  client.end();
  const salt = response.rows[0]['salt'];
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha256`)
    .toString(`hex`);
  return hashedPassword;
};

export const verifyPassword = async (
  username: string,
  hashedPassword: string
): Promise<true | void> => {
  const client = await connect();
  const response = await client.query(
    'SELECT hashed_password from user_account WHERE username = $1 AND hashed_password = $2',
    [username, hashedPassword]
  );
  client.end();
  if (response.rows[0]) {
    return true;
  }
};

export const getPayload = async (
  username: unknown,
  hashedPassword: unknown
): Promise<EncodeResult> => {
  const client = await connect();
  const response = await client.query(
    'SELECT * FROM user_account WHERE username = $1 AND hashed_password = $2',
    [username, hashedPassword]
  );
  client.end();
  const result = await response.rows[0];
  const session = encodePayload(secret, getPayloadOptions(result));
  return session;
};
