import { env } from "@/lib/env";
import { ApiClient } from "@twurple/api";
import { AppTokenAuthProvider } from "@twurple/auth";
import { Bot, createBotCommand } from "@twurple/easy-bot";

const authProvider = new AppTokenAuthProvider(
  env.TWITCH_CLIENT_ID!,
  env.TWITCH_CLIENT_SECRET!,
);

const apiClient = new ApiClient({ authProvider });

const bot = new Bot({
  authProvider,
  channels: [env.NEXT_PUBLIC_TWITCH_CHANNEL],
  commands: [
    createBotCommand(
      "hi",
      (params, { reply, userName, broadcasterName }) => {
        reply(`Welcome to ${broadcasterName}'s channel, ${userName}!`);
      },
      { ignoreCase: true },
    ),
  ],
});

export const twitch = apiClient;
