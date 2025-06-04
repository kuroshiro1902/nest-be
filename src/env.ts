import * as dotenv from 'dotenv';
import { cleanEnv, num, port, str } from 'envalid';

dotenv.config({ path: '.env' });

export const ENV = cleanEnv(process.env, {
  // Environment Configuration
  NODE_ENV: str({ devDefault: 'development', choices: ['development', 'production'] }),

  // Rate Limiting
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: 100 }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: 1000 }),

  // Server, port
  SERVER_PORT: port({ devDefault: 3000 }),

  // DATABASE - must be exactly like docker-compose `db` service environment.
  DATABASE_URL: str(),

  // Client
  CLIENT_URL: str(),

  // JWT
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),

  // Redis
  REDIS_URL: str(),
});
