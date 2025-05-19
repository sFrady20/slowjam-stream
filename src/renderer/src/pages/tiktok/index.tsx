import { NowPlaying } from "@/components/now-playing";
import { PageBackground } from "@/components/page-background";
import Visualizer from "@/components/visualizer";
import { useEffect, useState } from "react";
import Webcam from "react-webcam";

export function TiktokPage() {
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
    <div className="relative flex flex-col items-center p-6">
      <PageBackground />
      {faceCam && (
        <Webcam
          className="relative z-2 aspect-video w-full rounded-xl object-cover shadow-[0px_0px_100px_-20px_black]"
          videoConstraints={{ deviceId: faceCam.deviceId }}
        />
      )}
      {deckCam && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-[0px_0px_100px_-20px_black]">
          <Webcam
            className="absolute top-0 left-0 h-full w-full translate-x-[20%] translate-y-[20%] scale-[1.5] object-cover"
            videoConstraints={{ deviceId: deckCam.deviceId }}
          />
        </div>
      )}
      <NowPlaying />
      <Visualizer />
    </div>
  );
}
