import { useApp } from "@/context";
import { AnimatePresence } from "motion/react";
import { MotionVideoCard } from "../video-card";

export function NowPlaying() {
  const app = useApp();

  const currentTrack = app((x) => x.state.currentTrack);

  return (
    <AnimatePresence mode="popLayout">
      {currentTrack && (
        <MotionVideoCard
          key={currentTrack.id}
          initial={{ translateX: -32, opacity: 0, scale: 0.98 }}
          animate={{ translateX: 0, opacity: 1, scale: 1 }}
          exit={{ translateX: -32, opacity: 0, scale: 0.98 }}
          className="bg-background/70 w-full flex-col rounded-xl p-[24px] shadow-[0px_0px_100px_-20px_black] backdrop-blur-lg text-shadow-[0px_0px_20px_var(--color-foreground)]"
          url={
            "https://cdn.pixabay.com/video/2022/10/16/135068-761273397_large.mp4"
          }
        >
          <div className="flex flex-1/2 items-center gap-2 text-[20px]">
            <i className="icon-[lucide--disc-3]" />
            <div className="font-[DIN_Bold]">Now playing</div>
          </div>
          <div className="text-[28px]">
            {currentTrack.artist} - {currentTrack.title}
          </div>
        </MotionVideoCard>
      )}
    </AnimatePresence>
  );
}
