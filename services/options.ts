import { ClientConfig } from 'pg';

export const options: ClientConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  user: process.env.DB_USERNAME || 'main',
  database: process.env.DB_NAME || 'quiz-manager-db',
  password: process.env.DB_PASSWORD || 'password',
};

if (process.env.PROD) {
  options.ssl = {
    rejectUnauthorized: false,
  };
}
