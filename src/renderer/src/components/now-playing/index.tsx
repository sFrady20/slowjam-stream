import { useApp } from "@/context";
import { AnimatePresence, motion } from "motion/react";

export function NowPlaying() {
  const app = useApp();

  const currentTrack = app((x) => x.state.currentTrack);

  return (
    <AnimatePresence mode="popLayout">
      {currentTrack && (
        <motion.div
          key={currentTrack.id}
          initial={{ translateX: -32, opacity: 0, scale: 0.98 }}
          animate={{ translateX: 0, opacity: 1, scale: 1 }}
          exit={{ translateX: -32, opacity: 0, scale: 0.98 }}
          className="bg-background/70 w-full flex-col rounded-xl p-[16px] shadow-[0px_0px_100px_-20px_black] backdrop-blur-lg text-shadow-[0px_0px_20px_var(--color-foreground)]"
        >
          <div className="font-[DIN_Bold] text-[32px]">Now playing</div>
          <div className="text-[32px]">
            {currentTrack.artist} - {currentTrack.title}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
