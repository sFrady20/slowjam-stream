import { Activity } from "@/components/activity";
import { NowPlaying } from "@/components/now-playing";
import { StreamStatus } from "@/components/stream-status";
import Visualizer from "@/components/visualizer";
import { useEffect, useState } from "react";
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
    <div className="bg-background fixed inset-0 flex items-center justify-center text-shadow-[0px_0px_20px_white]">
      {/* <PageBackground /> */}
      {faceCam && (
        <Webcam
          className="absolute top-[32px] left-[32px] aspect-video h-[calc(100%-64px)] w-[calc(100%-64px-650px-32px)] rounded-xl object-cover shadow-[0px_0px_100px_-20px_black]"
          videoConstraints={{ deviceId: faceCam.deviceId }}
        />
      )}
      <div className="absolute top-[32px] right-[32px] flex h-[calc(100%-64px)] w-[650px] flex-col justify-end">
        <StreamStatus />
        <Activity />
        <NowPlaying />
        {deckCam && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-[0px_0px_100px_-20px_black]">
            <Webcam
              className="absolute top-0 left-0 h-full w-full translate-x-[20%] translate-y-[20%] scale-[1.5] object-cover"
              videoConstraints={{ deviceId: deckCam.deviceId }}
            />
          </div>
        )}
      </div>
      <Visualizer />
      <div className="bg-background absolute bottom-0 left-100 overflow-hidden rounded-t-xl px-8 font-[DIN_Black] text-[40px] tracking-[-.05rem] text-white text-shadow-[0px_0px_20px_white]">
        @SLOWJAMSTEVE
      </div>
    </div>
  );
}
