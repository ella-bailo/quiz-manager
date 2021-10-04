import { ClientConfig } from 'pg';

export const options: ClientConfig = {
  host:
    process.env.DB_HOST || 'ec2-54-170-163-224.eu-west-1.compute.amazonaws.com',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME || 'vcvsmncpdnkfrh',
  database: process.env.DB_NAME || 'd9610o3652jldi',
  password:
    process.env.DB_PASSWORD ||
    '56e9a6d2db015d14963141042381bf695bd58c8eb0cedb8397ade7f6225a21b6',
};
