import { app, shell, BrowserWindow } from "electron";
import { join, resolve } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { screen } from "electron/main";
import { createServer, Server } from "http";
import { readFile } from "fs/promises";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import ElectronStore from "electron-store";
import { Server as SocketServer } from "socket.io";
import express, { type Express } from "express";
import cors from "cors";

const PORT = 8888;

export const PATHS = {
  data: is.dev
    ? resolve(app.getAppPath(), "./data")
    : join(app.getAppPath(), "../../data"),
  assets: is.dev
    ? join(app.getAppPath(), "./src/renderer/public")
    : join(app.getAppPath(), "out/renderer").replace(
        "app.asar",
        "app.asar.unpacked",
      ),
};

export default class Main<
  Config extends object,
  Settings extends object,
  State extends object,
  Actions extends Record<string, (...args: any[]) => Promise<any>> = {},
> {
  private _defaultConfig: Config;
  private _config?: Config;
  public get config() {
    return this._config!;
  }

  private _defaultSettings: Settings;
  private _settings?: Awaited<ReturnType<typeof this._createSettingsStore>>;
  public get settings() {
    return this._settings!;
  }

  private _defaultState: State;
  public get defaultState() {
    return this._defaultState;
  }
  private _state?: Awaited<ReturnType<typeof this._createStateStore>>;
  public get state() {
    return this._state!;
  }

  private _http?: Server;
  public get http() {
    return this._http!;
  }

  private _express?: Express;
  private _corsOptions?: cors.CorsOptions;
  public get express() {
    return this._express!;
  }

  private _io?: SocketServer;
  public get io() {
    return this._io!;
  }

  private _window?: BrowserWindow;
  public get window() {
    return this._window!;
  }

  private _actions: Actions;

  constructor(
    appId: string,
    {
      defaultConfig = {} as Config,
      defaultSettings = {} as Settings,
      defaultState = {} as State,
      cors,
      actions,
      onReady,
    }: {
      defaultConfig?: Config;
      defaultSettings?: Settings;
      defaultState?: State;
      actions: Actions;
      cors?: cors.CorsOptions;
      onReady?: () => void;
    },
  ) {
    this._defaultConfig = defaultConfig;
    this._defaultSettings = defaultSettings;
    this._defaultState = defaultState;
    this._actions = actions;
    this._corsOptions = cors;

    app.whenReady().then(async () => {
      electronApp.setAppUserModelId(appId);

      app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
      });
      app.on("activate", async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this._openWindow();
        }
      });
      app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
          app.quit();
        }
      });

      await this._loadConfig();
      await this._initSettings();
      await this._initState();
      await this._startServer();
      await this._openWindow();

      onReady?.();
    });
  }

  private async _loadConfig() {
    try {
      this._config = JSON.parse(
        await readFile(join(PATHS.data, "./config.json"), "utf-8"),
      );
    } catch (e) {
      console.error(`Failed to load config: ${e}`);
      this._config = this._defaultConfig;
    }
  }

  private async _initSettings() {
    this._settings = await this._createSettingsStore();
  }

  private async _createSettingsStore() {
    const store = new ElectronStore({
      cwd: PATHS.data,
      name: "settings",
    });
    return create(
      persist(
        immer<Settings>(() => this._defaultSettings),
        {
          name: "settings",
          storage: {
            getItem: (key) => store.get(key) as any,
            setItem: (key, value) => store.set(key, value),
            removeItem: (key) => store.delete(key),
          },
        },
      ),
    );
  }

  private async _initState() {
    this._state = await this._createStateStore();
  }

  private async _createStateStore() {
    return create(immer<State>(() => this._defaultState));
  }

  private async _startServer() {
    this._express = express();

    this._express.use(express.static(PATHS.assets, { maxAge: "20m" }));
    this._express.use(express.json());
    this._express.use(cors(this._corsOptions));

    // Create http server
    let http: Server;
    http = createServer(this._express);
    this._http = http;

    // Create socket server
    this._io = new SocketServer(http, { cors: { origin: "*" } });

    //r Register actions
    this._registerActions();

    // Start listening
    console.log(`listening on port ${PORT}`);
    http.listen(PORT);
  }

  private _registerActions() {
    this._io?.on("connection", (socket) => {
      console.log("connected");

      Object.entries(this._actions).forEach(([key, value]) => {
        socket.on(key, async (args, callback) => {
          callback(await value(...args));
        });
      });

      socket.on("disconnect", () => {
        console.log("disconnected");
      });
    });
  }

  private async _openWindow() {
    this._window = await this._createWindow();
  }

  private async _createWindow(): Promise<BrowserWindow> {
    const display =
      "display" in this.config && typeof this.config.display === "number"
        ? screen.getAllDisplays()[
            Math.min(screen.getAllDisplays().length - 1, this.config.display)
          ]
        : screen.getPrimaryDisplay();

    const bounds = display.bounds;

    // Create the browser window.
    const window = new BrowserWindow({
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      show: false,
      autoHideMenuBar: true,
      resizable: is.dev,
      fullscreen: !is.dev,
      maxWidth: 99999,
      maxHeight: 99999,
      ...(process.platform === "linux" ? { icon } : {}),
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        contextIsolation: false,
        preload: join(__dirname, "../preload/index.js"),
        sandbox: false,
      },
    });

    window.on("ready-to-show", () => {
      window.show();
    });

    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: "deny" };
    });

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      await window.loadURL(process.env["ELECTRON_RENDERER_URL"]!);
      window.webContents.openDevTools();
    } else {
      await window.loadURL(`http://localhost:${PORT}/`);
    }

    return window;
  }
}
