import { env } from "./env";
import { RefreshingAuthProvider } from "@twurple/auth";
import defaultToken from "./tokens.json";
import { ApiClient, HelixStream } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
// import { promises as fs } from "fs";
// import { join } from "path";

export const startBot = async (options?: {
  onFollow?: (userName: string) => void;
  onStreamData?: (stream: HelixStream) => void;
}) => {
  console.log("starting bot");
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

  const apiClient = new ApiClient({
    authProvider,
  });

  const listener = new EventSubWsListener({
    apiClient,
  });

  listener.onChannelFollow(
    env.VITE_PUBLIC_TWITCH_CHANNEL_ID,
    env.VITE_PUBLIC_TWITCH_CHANNEL_ID,
    async (e) => {
      options?.onFollow?.(e.userDisplayName);
    },
  );

  listener.onChannelChatMessage(
    env.VITE_PUBLIC_TWITCH_CHANNEL_ID,
    env.VITE_PUBLIC_TWITCH_CHANNEL_ID,
    (e) => {
      const message = e.messageText.trim();
      if (message.startsWith("!")) {
        const [command, ...args] = message.slice(1).split(/\s+/);

        switch (command) {
          case "dice":
            apiClient.chat.sendChatMessageAsApp(
              env.VITE_PUBLIC_TWITCH_CHANNEL_ID,
              env.VITE_PUBLIC_TWITCH_CHANNEL_ID,
              `You rolled a ${Math.floor(Math.random() * 6) + 1}`,
            );
            break;

          case "test":
            switch (args[0]) {
              case "follow":
                options?.onFollow?.("testyMcTestface");
                break;
            }
        }
      }
    },
  );

  listener.start();

  // track stream details
  async function trackStream() {
    const streams = await apiClient.streams.getStreams({
      userId: env.VITE_PUBLIC_TWITCH_CHANNEL_ID,
      type: "live",
    });
    options?.onStreamData?.(streams.data[0]);
  }
  trackStream();
  setInterval(() => {
    trackStream();
  }, 60 * 1000);
};
