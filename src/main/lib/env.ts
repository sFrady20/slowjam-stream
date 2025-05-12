import { z } from "zod";
import { config } from "dotenv";

config();

const envSchema = z.object({
  TWITCH_CLIENT_ID: z.string(),
  TWITCH_CLIENT_SECRET: z.string(),
  VITE_PUBLIC_TWITCH_CHANNEL: z.string(),
  VITE_PUBLIC_TWITCH_CHANNEL_ID: z.string(),
});

export const env = envSchema.parse(process.env);
