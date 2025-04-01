import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str } from 'envalid';

dotenv.config();

export const ENV = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: 'development', choices: ['development', 'production'] }),
  SERVER_HOST: host({ devDefault: 'localhost' }),
  SERVER_PORT: port({ devDefault: 3000 }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: 100 }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: 1000 }),

  CLIENT_URL: str(),

  // Elastic config
  ELASTIC_HOST: str(),
  ELASTIC_PORT: port(),
  ELASTIC_AUTH_USERNAME: str(),
  ELASTIC_AUTH_PASSWORD: str(),
  ELASTIC_RAW_POSTS_INDEX: str(),

  // Postgres config
  POSTGRES_HOST: host(),
  POSTGRES_PORT: port(),
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DATABASE: str(),
  POSTGRES_SCHEMA: str(),

  // Mongo config
  MONGO_URI: str(),
  MONGO_PORT: port(),
  MONGO_PASSWORD: str(),
  MONGO_DATABASE: str(),
  MONGO_CLEAN_POST_COLLECTION: str(),

  // Telegram config
  TELEGRAM_BOT_TOKEN: str(),
  TELEGRAM_GROUP_ID: str(),

  // Gemini config
  GEMINI_FLASH_API_TOKEN1: str(),
  GEMINI_FLASH_API_TOKEN2: str(),

  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
});
