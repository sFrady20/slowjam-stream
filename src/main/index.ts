import { HelixStream } from "@twurple/api";
import { startBot } from "./lib/bot";
import { RekordBox, TrackData } from "./lib/now-playing";
import Main from "./main";
import { OBSWebSocket } from "obs-websocket-js";
import { searchVideos } from "pixabay-api";
import { env } from "./lib/env";
import { DateTime } from "luxon";

const obs = new OBSWebSocket();

export type MainConfig = {
  styles?: Record<string, string>;
};
export type MainSettings = {};
export type MainState = {
  isWebcamEnabled: boolean;
  holdText: string;
  currentTrack?: TrackData;
  streamData?: HelixStream;
  activity: { id: string; message: string; time: number }[];
  visualizer: {
    opacity: number;
    blendMode: string;
    videoUrl: string | null;
    speed: number;
    matchBpm: boolean;
  };
  drinkChances: number;
  stream: {
    isActive: boolean;
    timeStarted?: number;
  };
};

const mainActions = {
  async requestConfig() {
    return main.config;
  },
  async requestSettings() {
    return main.settings.getState();
  },
  async requestState() {
    return main.state.getState();
  },

  async timeSync(clientTime: number) {
    return Date.now() - clientTime;
  },

  async reset() {
    main.state.setState(main.defaultState);
  },

  async setScene(sceneName: string) {
    await obs.call("SetCurrentProgramScene", { sceneName });
  },

  async applyHold(holdText: string) {
    main.state.setState((x) => {
      x.holdText = holdText;
    });
    await obs.call("SetCurrentProgramScene", { sceneName: "Hold" });
  },

  async updateVisualizer(
    updates: Partial<typeof main.defaultState.visualizer>,
  ) {
    main.state.setState((x) => {
      x.visualizer = {
        ...x.visualizer,
        ...updates,
      };
    });
  },

  async fetchVideos(query: string, page: number) {
    const videos = (
      await searchVideos(env.PIXABAY_API_KEY, query, {
        page: page,
        per_page: 100,
      })
    ).hits.map((x) => ({
      id: x.id,
      thumbnail: (x.videos.medium as any).thumbnail as string,
      video: x.videos.medium.url as any as string,
      tags: x.tags,
    }));

    return videos;
  },

  async setLive(live: boolean) {
    await obs.call(live ? "StartStream" : "StopStream");
  },

  async setMusicMuted(muted: boolean) {
    await obs.call("SetInputMute", {
      inputName: "Rekordbox Audio",
      inputMuted: muted,
    });
  },
} as const;

//called from client to main
export type MainActions = typeof mainActions;
//called from main to client
export type ClientActions = {
  updateSettings: (settings: MainSettings) => void;
  updateState: (state: MainState) => void;
};

const main = new Main<MainConfig, MainSettings, MainState, MainActions>(
  "com.plinko.app",
  {
    defaultConfig: {},
    defaultSettings: {},
    defaultState: {
      isWebcamEnabled: false,
      holdText: "STARTING SOON",
      activity: [],
      visualizer: {
        opacity: 0,
        blendMode: "screen",
        videoUrl: null,
        speed: 1,
        matchBpm: true,
      },
      drinkChances: 0.25,
      stream: {
        isActive: false,
      },
    },
    actions: mainActions,
    onReady: async () => {
      const rekordbox = new RekordBox({
        onTrackUpdate: (data) => {
          main.state.setState((x) => {
            x.currentTrack = data;
          });
        },
      });
      rekordbox.watch();

      await obs.connect("ws://127.0.0.1:4455");

      console.log("connected to obs");

      //subscribe to changes
      main.settings.subscribe((x) => {
        main.io.emit("updateSettings", x);
      });

      main.state.subscribe((x) => {
        main.io.emit("updateState", x);
      });

      async function fetchStreamInfo() {
        const stream = await obs.call("GetStreamStatus");

        if (stream.outputTimecode) {
          const time = DateTime.from(stream.outputTimecode);
          main.state.setState((x) => {
            x.stream.timeStarted = time.toMillis();
          });
        }
      }

      fetchStreamInfo();
      obs.on("StreamStateChanged", ({ outputActive }) => {
        main.state.setState((x) => {
          x.stream.isActive = outputActive;
        });
        if (outputActive) fetchStreamInfo();
      });

      //start bot
      startBot({
        onStreamData: (streamData) => {
          main.state.setState((x) => {
            x.streamData = streamData;
          });
        },
        onFollow: (userName) => {
          main.state.setState((x) => {
            x.activity.push({
              id: Math.random().toString(32).slice(7),
              message: [`${userName} Followed`].toSorted(
                (a, b) => Math.random() - 0.5,
              )[0],
              time: Date.now(),
            });
          });
        },
      });
    },
  },
);

export default main;
