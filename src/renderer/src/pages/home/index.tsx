import { PageBackground } from "@/components/page-background";
import { useApp } from "@/context";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

export function HomePage() {
  const [faceCam, setFaceCam] = useState<MediaDeviceInfo>();
  const [deckCam, setDeckCam] = useState<MediaDeviceInfo>();

  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setFaceCam(
        devices.find(
          (x) =>
            x.kind === "videoinput" &&
            x.label.includes("c922 Pro Stream Webcam"),
        ),
      );
      setDeckCam(
        devices.find(
          (x) => x.kind === "videoinput" && x.label.includes("USB 2.0 Camera"),
        ),
      );
    })();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <PageBackground />
      {faceCam && (
        <Webcam
          className="absolute top-15 left-10 h-[90vh] w-[70vw] rounded-xl object-cover shadow-[0px_0px_100px_-20px_black]"
          videoConstraints={{ deviceId: faceCam.deviceId }}
        />
      )}
      <div className="absolute top-[2.5vh] right-10 flex h-[95vh] w-[35vw] flex-col">
        <NowPlaying />
        <div className="flex-1" />
        <Activity />
        {deckCam && (
          <div className="relative aspect-video h-[35vh] w-[35vw] overflow-hidden rounded-xl shadow-[0px_0px_100px_-20px_black]">
            <Webcam
              className="absolute top-0 left-0 h-full w-full translate-x-[20%] translate-y-[20%] scale-[1.5] object-cover"
              videoConstraints={{ deviceId: deckCam.deviceId }}
            />
          </div>
        )}
      </div>
      <Visualizer />
    </div>
  );
}

function NowPlaying() {
  const app = useApp();

  const currentTrack = app((x) => x.state.currentTrack);

  return (
    <>
      <AnimatePresence mode="popLayout">
        {currentTrack && (
          <motion.div
            key={currentTrack.id}
            initial={{ translateX: -32, opacity: 0, scale: 0.98 }}
            animate={{ translateX: 0, opacity: 1, scale: 1 }}
            exit={{ translateX: -32, opacity: 0, scale: 0.98 }}
            className="bg-background/70 flex-col rounded-xl p-6 shadow-[0px_0px_100px_-20px_black] backdrop-blur-lg text-shadow-[0px_0px_20px_var(--color-foreground)]"
          >
            <div className="font-[DIN_Bold] text-[32px]">Now playing</div>
            <div className="text-[40px]">{currentTrack.title}</div>
            <div className="text-[32px]">{currentTrack.artist}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Activity() {
  const app = useApp();
  const activity = app((x) => x.state.activity);

  return (
    <div className="my-2 flex flex-col items-end gap-2">
      {activity.slice(-8).map((x) => (
        <div
          key={x.id}
          className="bg-background/70 inline-block rounded-xl px-2"
        >
          <div className="text-foreground text-right font-[DIN_Bold] text-[32px] mix-blend-screen shadow-[0px_0px_100px_-20px_black] backdrop-blur-lg text-shadow-[0px_0px_13px_var(--color-foreground)]">
            {x.message}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Visualizer() {
  const app = useApp();

  const videoUrl = app((x) => x.state.visualizerVideoUrl);

  return (
    <AnimatePresence mode="popLayout">
      {videoUrl && <BpmVideo key={videoUrl} videoUrl={videoUrl} />}
    </AnimatePresence>
  );
}

export function BpmVideo({ videoUrl }: { videoUrl: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  const app = useApp();

  const bpm = app((x) => x.state.currentTrack?.bpm);
  const opacity = app((x) => x.state.visualizerOpacity);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.playbackRate = bpm ? Math.pow(bpm / 128, 1.2) : 1;
    console.log("playbackRate", ref.current.playbackRate);
  }, [bpm]);

  return (
    <>
      <motion.video
        ref={ref}
        src={videoUrl}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: opacity / 100, scale: 1 }}
        exit={{ opacity: 0, scale: 10 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 h-full w-full object-cover mix-blend-screen"
        muted
        autoPlay
        loop
      />
    </>
  );
}
