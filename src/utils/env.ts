import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable "${name}". Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const ENV = {
  baseURL: required('BASE_URL', 'https://crm.anhtester.com'),
  adminEmail: required('ADMIN_EMAIL', 'admin@example.com'),
  adminPassword: required('ADMIN_PASSWORD', '123456'),
  headless: (process.env.HEADLESS ?? 'true').toLowerCase() !== 'false',
  isCI: !!process.env.CI,
} as const;
