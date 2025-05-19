import { Activity } from "@/components/activity";
import { NowPlaying } from "@/components/now-playing";
import { PageBackground } from "@/components/page-background";
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
      <div className="absolute bottom-5 left-130 font-[DIN_Black] text-[40px] tracking-[-.05rem] text-(--slowjam-color) mix-blend-screen text-shadow-[0px_0px_20px_var(--slowjam-color)]">
        @SLOWJAMSTEVE
      </div>
    </div>
  );
}
