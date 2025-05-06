import { io } from "socket.io-client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ClientActions, MainActions } from "@main";

const isDev = process.env.NODE_ENV === "development";

export const useSocket = create(
  immer<{ connected }>(() => ({ connected: false })),
);

const url = new URL(window.location.href);
if (isDev) url.port = `8888`;
console.log("websocket url", url.toString());
export const socket = io(url.toString());

socket.on("connect", () => {
  useSocket.setState({ connected: true });
});
socket.on("disconnect", () => {
  useSocket.setState({ connected: false });
});

export async function clientAction<K extends keyof MainActions>(
  event: K,
  ...args: Parameters<MainActions[K]>
): Promise<Awaited<ReturnType<MainActions[K]>>> {
  return await socket.emitWithAck(event as string, args);
}

export function receiveServerAction<K extends keyof ClientActions>(
  event: K,
  handler: (...args: Parameters<ClientActions[K]>) => void,
) {
  //@ts-ignore
  socket.on(event, handler);

  return () => {
    //@ts-ignore
    socket.off(event, handler);
  };
}
