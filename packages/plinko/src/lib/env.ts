import { z } from "zod";

const serverEnvSchema = z
  .object({
    TWITCH_CLIENT_ID: z.string(),
    TWITCH_CLIENT_SECRET: z.string(),
  })
  .partial();

const clientEnvSchema = z.object({
  NEXT_PUBLIC_TWITCH_CHANNEL: z.string(),
});

export const env = serverEnvSchema.and(clientEnvSchema).parse(process.env);
