import * as dotenv from 'dotenv';
import { cleanEnv, num, port, str } from 'envalid';

dotenv.config({ path: '.env' });

const env = cleanEnv(process.env, {
  // Environment Configuration
  NODE_ENV: str({ devDefault: 'development', choices: ['development', 'production'] }),

  // Rate Limiting
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: 100 }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: 60000 }),

  // Server, port
  SERVER_PORT: port({ devDefault: 3000 }),

  // DATABASE - must be exactly like docker-compose `db` service environment.
  POSTGRES_HOST: str(),
  POSTGRES_PORT: num(),
  POSTGRES_USERNAME: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DB: str(),
  POSTGRES_SCHEMA: str(),

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
    HOST: env.POSTGRES_HOST,
    PORT: env.POSTGRES_PORT,
    USERNAME: env.POSTGRES_USERNAME,
    PASSWORD: env.POSTGRES_PASSWORD,
    DB: env.POSTGRES_DB,
    SCHEMA: env.POSTGRES_SCHEMA,
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
