import { useApp } from "@/context";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

export function StreamStatus() {
  const app = useApp();

  const isActive = app((x) => x.state.stream.isActive);
  const startTime = app((x) => x.state.stream.timeStarted);

  const [time, setTime] = useState("Offline");

  useEffect(() => {
    if (!startTime) {
      setTime("Offline");
      return;
    }

    const interval = setInterval(() => {
      const diff = Date.now() - startTime;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff / 1000) % 60);
      setTime(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return (
    <div className="flex flex-row items-center justify-end gap-6 py-[8px]">
      <div className="text-muted-foreground flex flex-row items-center gap-2">
        <i
          className={cn(
            "icon-[lucide--wifi] text-muted-foreground text-[20px]",
            isActive && "text-foreground",
          )}
        />
        <div
          className={cn(
            "text-muted-foreground text-[20px] transition-all",
            isActive && "text-foreground",
          )}
        >
          {time}
        </div>
      </div>
    </div>
  );
}
