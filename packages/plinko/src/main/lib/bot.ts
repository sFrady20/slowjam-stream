import { env } from "./env";
import { RefreshingAuthProvider } from "@twurple/auth";
import { Bot, createBotCommand } from "@twurple/easy-bot";
import defaultToken from "./tokens.json";
// import { promises as fs } from "fs";
// import { join } from "path";

export const startBot = async () => {
  // const tokenData = JSON.parse(
  //   await fs.readFile(join(__dirname, "./tokens.json"), "utf-8"),
  // );
  const authProvider = new RefreshingAuthProvider({
    clientId: env.TWITCH_CLIENT_ID!,
    clientSecret: env.TWITCH_CLIENT_SECRET!,
  });

  // authProvider.onRefresh(
  //   async (_, newTokenData) =>
  //     await fs.writeFile(
  //       `./tokens.json`,
  //       JSON.stringify(newTokenData, null, 4),
  //       "utf-8",
  //     ),
  // );

  await authProvider.addUserForToken(defaultToken, ["chat"]);

  const bot = new Bot({
    authProvider,
    channels: [env.VITE_PUBLIC_TWITCH_CHANNEL],
    commands: [
      createBotCommand("dice", (_, { reply }) => {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        reply(`You rolled a ${diceRoll}`);
      }),
      createBotCommand("slap", (params, { userName, say }) => {
        say(
          `${userName} slaps ${params.join(" ")} around a bit with a large trout`,
        );
      }),
    ],
  });

  bot.onSub(({ broadcasterName, userName }) => {
    bot.say(
      broadcasterName,
      `Thanks to @${userName} for soobscribing to the channel!`,
    );
  });
  bot.onResub(({ broadcasterName, userName, months }) => {
    bot.say(
      broadcasterName,
      `Thanks to @${userName} for subscribing to the channel for a total of ${months} months!`,
    );
  });
  bot.onSubGift(({ broadcasterName, gifterName, userName }) => {
    bot.say(
      broadcasterName,
      `Thanks to @${gifterName} for gifting a subscription to @${userName}!`,
    );
  });
};
