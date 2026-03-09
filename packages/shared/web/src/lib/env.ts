import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .url()
    .min(1, 'NEXT_PUBLIC_API_URL is required')
    .default('http://localhost:4000'),
});

export const env = envSchema.parse(process.env);
