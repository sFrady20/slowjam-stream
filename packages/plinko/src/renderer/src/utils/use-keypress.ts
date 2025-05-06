import { useEffect } from "react";

export function useKeypress(key: string, callback: () => void) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === key) {
        callback();
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [key, callback]);
}
