import * as dotenv from 'dotenv';
import { cleanEnv, num, port, str } from 'envalid';

dotenv.config({ path: '.env' });

const env = cleanEnv(process.env, {
  // Environment Configuration
  NODE_ENV: str({ devDefault: 'development', choices: ['development', 'production'] }),

  // Rate Limiting
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: 100 }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: 1000 }),

  // Server, port
  SERVER_PORT: port({ devDefault: 3000 }),

  // DATABASE - must be exactly like docker-compose `db` service environment.
  DATABASE_HOST: str(),
  DATABASE_PORT: num(),
  DATABASE_USERNAME: str(),
  DATABASE_PASSWORD: str(),
  DATABASE_NAME: str(),
  DATABASE_SCHEMA: str(),

  // Client
  CLIENT_URL: str(),

  // JWT
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
  ACCESS_TOKEN_EXPIRES_IN: num(),

  // Redis
  REDIS_URL: str(),
});

export const ENV = {
  NODE_ENV: env.NODE_ENV,
  SERVER_PORT: env.SERVER_PORT,
  CLIENT_URL: env.CLIENT_URL,
  DATABASE: {
    HOST: env.DATABASE_HOST,
    PORT: env.DATABASE_PORT,
    USERNAME: env.DATABASE_USERNAME,
    PASSWORD: env.DATABASE_PASSWORD,
    NAME: env.DATABASE_NAME,
    SCHEMA: env.DATABASE_SCHEMA,
  },
  JWT: {
    ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET,
    /**
     * @unit: seconds
     */
    ACCESS_TOKEN_EXPIRES_IN: env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_SECRET: env.REFRESH_TOKEN_SECRET,
  },
  REDIS: {
    URL: env.REDIS_URL,
  },
  RATE_LIMIT: {
    MAX_REQUESTS: env.COMMON_RATE_LIMIT_MAX_REQUESTS,
    WINDOW_MS: env.COMMON_RATE_LIMIT_WINDOW_MS,
  },
};
