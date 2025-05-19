import { useApp } from "@/context";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

export default function Visualizer() {
  const app = useApp();

  const { videoUrl } = app((x) => x.state.visualizer);

  return (
    <AnimatePresence mode="popLayout">
      {videoUrl && <BpmVideo key={videoUrl} videoUrl={videoUrl} />}
    </AnimatePresence>
  );
}

function BpmVideo({ videoUrl }: { videoUrl: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  const app = useApp();

  const bpm = app((x) => x.state.currentTrack?.bpm);
  const { opacity, blendMode, speed, matchBpm } = app(
    (x) => x.state.visualizer,
  );

  useEffect(() => {
    if (!ref.current) return;
    ref.current.playbackRate = matchBpm
      ? (bpm ? Math.pow(bpm / 128, 1.2) : 1) * speed
      : speed;
  }, [bpm, speed, matchBpm]);

  return (
    <motion.video
      ref={ref}
      src={videoUrl}
      initial={{ opacity: 0, scale: 2 }}
      animate={{ opacity: opacity / 100, scale: 1 }}
      exit={{ opacity: 0, scale: 2 }}
      transition={{ duration: 1 }}
      className="absolute top-0 left-0 z-[50] h-full w-full object-cover"
      style={{ mixBlendMode: blendMode as any }}
      muted
      autoPlay
      loop
    />
  );
}
