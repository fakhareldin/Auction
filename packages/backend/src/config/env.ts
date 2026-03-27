import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  API_URL: z.string().url(),

  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_SECURE: z.string().default('false'),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  EMAIL_FROM: z.string().email(),

  FRONTEND_URL: z.string().url(),

  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = {
  NODE_ENV: parsed.data.NODE_ENV,
  PORT: parseInt(parsed.data.PORT, 10),
  API_URL: parsed.data.API_URL,

  DATABASE_URL: parsed.data.DATABASE_URL,
  REDIS_URL: parsed.data.REDIS_URL,

  JWT: {
    ACCESS_SECRET: parsed.data.JWT_ACCESS_SECRET,
    REFRESH_SECRET: parsed.data.JWT_REFRESH_SECRET,
    ACCESS_EXPIRES_IN: parsed.data.JWT_ACCESS_EXPIRES_IN,
    REFRESH_EXPIRES_IN: parsed.data.JWT_REFRESH_EXPIRES_IN,
  },

  CLOUDINARY: {
    CLOUD_NAME: parsed.data.CLOUDINARY_CLOUD_NAME,
    API_KEY: parsed.data.CLOUDINARY_API_KEY,
    API_SECRET: parsed.data.CLOUDINARY_API_SECRET,
  },

  SMTP: {
    HOST: parsed.data.SMTP_HOST,
    PORT: parseInt(parsed.data.SMTP_PORT, 10),
    SECURE: parsed.data.SMTP_SECURE === 'true',
    USER: parsed.data.SMTP_USER,
    PASSWORD: parsed.data.SMTP_PASSWORD,
  },

  EMAIL_FROM: parsed.data.EMAIL_FROM,
  FRONTEND_URL: parsed.data.FRONTEND_URL,

  RATE_LIMIT: {
    WINDOW_MS: parseInt(parsed.data.RATE_LIMIT_WINDOW_MS, 10),
    MAX_REQUESTS: parseInt(parsed.data.RATE_LIMIT_MAX_REQUESTS, 10),
  },

  isDevelopment: parsed.data.NODE_ENV === 'development',
  isProduction: parsed.data.NODE_ENV === 'production',
  isTest: parsed.data.NODE_ENV === 'test',
};

export default env;
