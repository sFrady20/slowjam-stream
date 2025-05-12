import { HelixStream } from "@twurple/api";
import { startBot } from "./lib/bot";
import { RekordBox, TrackData } from "./lib/now-playing";
import Main from "./main";
import { OBSWebSocket } from "obs-websocket-js";

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
    },
    actions: mainActions,
    onReady: () => {
      const rekordbox = new RekordBox({
        onTrackUpdate: (data) => {
          main.state.setState((x) => {
            x.currentTrack = data;
          });
        },
      });
      rekordbox.watch();

      obs.connect("ws://127.0.0.1:4455").then(() => {
        console.log("connected to obs");

        //subscribe to changes
        main.settings.subscribe((x) => {
          main.io.emit("updateSettings", x);
        });

        main.state.subscribe((x) => {
          main.io.emit("updateState", x);
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
                message: [
                  `${userName} followed`,
                  `${userName} just followed`,
                  `${userName} is following`,
                  `${userName} is now following`,
                  `${userName} just joined`,
                  `${userName} joined`,
                ].toSorted((a, b) => Math.random() - 0.5)[0],
                time: Date.now(),
              });
            });
          },
        });
      });
    },
  },
);

export default main;
