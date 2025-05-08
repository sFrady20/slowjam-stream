import { startBot } from "./lib/bot";
import Main from "./main";

export type MainConfig = {
  styles?: Record<string, string>;
};
export type MainSettings = {};
export type MainState = {};

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
    defaultState: {},
    actions: mainActions,
    onReady: () => {
      //subscribe to changes
      main.settings.subscribe((x) => {
        main.io.emit("updateSettings", x);
      });

      main.state.subscribe((x) => {
        main.io.emit("updateState", x);
      });

      //start bot
      startBot();
    },
  },
);

export default main;
