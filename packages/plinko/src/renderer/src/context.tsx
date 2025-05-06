import { createContext, useContext, useEffect, useMemo } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { MainConfig, MainSettings, MainState } from "@main";
import {
  clientAction,
  receiveServerAction,
  useSocket,
} from "./services/socket";

export type AppState = {
  config: MainConfig;
  settings: MainSettings;
  state: MainState;
  timeSyncOffset: number;
};

const makeAppStore = () => create(immer<AppState>(() => ({}) as any));

const AppContext = createContext(makeAppStore());

const Loader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-row items-center gap-[2vw]">
        <i className="icon-[svg-spinners--ring-resize]" />
        <div>{children}</div>
      </div>
    </div>
  );
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const socket = useSocket();

  const appStore = useMemo(() => makeAppStore(), []);
  const state = appStore((x) => x.state);
  const settings = appStore((x) => x.settings);
  const config = appStore((x) => x.config);

  useEffect(() => {
    if (!socket.connected) return;
    console.log("requesting config and state");

    //request initial data
    clientAction("requestConfig").then((config) => {
      appStore.setState((x) => {
        x.config = config;
      });
    });
    clientAction("requestSettings").then((settings) => {
      appStore.setState((x) => {
        x.settings = settings;
      });
    });
    clientAction("requestState").then((state) => {
      appStore.setState((x) => {
        x.state = state;
      });
    });

    //start time sync polling
    const sync = () => {
      clientAction("timeSync", Date.now()).then((offset: number) => {
        appStore.setState((x) => {
          x.timeSyncOffset = offset;
        });
      });
    };
    sync();
    const syncPoll = setInterval(sync, 5 * 1000);

    //add server emit listeners
    const listeners = [
      receiveServerAction("updateSettings", (settings) => {
        appStore.setState((x) => {
          x.settings = settings;
        });
      }),

      receiveServerAction("updateState", (state) => {
        appStore.setState((x) => {
          x.state = state;
        });
      }),
    ];

    //cleanup
    return () => {
      listeners.forEach((l) => l());
      clearInterval(syncPoll);
    };
  }, [socket.connected]);

  if (!socket.connected) return <Loader>Connecting...</Loader>;
  if (!config) return <Loader>Loading Config...</Loader>;
  if (!settings) return <Loader>Loading Settings...</Loader>;
  if (!state) return <Loader>Loading Data...</Loader>;

  return (
    <AppContext.Provider value={appStore}>
      {children}
      <style>
        {":root {"}
        {Object.entries(config.styles || {})
          .map(([key, value]) => `--${key}: ${value}`)
          .join("\n")}
        {"}"}
      </style>
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
