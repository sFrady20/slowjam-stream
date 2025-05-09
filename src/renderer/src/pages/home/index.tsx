import { PageBackground } from "@/components/page-background";
import { useApp } from "@/context";
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
          (x) =>
            x.kind === "videoinput" &&
            x.label.includes("Orbbec Femto Mega RGB Camera"),
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
      {deckCam && (
        <Webcam
          className="absolute right-10 bottom-3 h-[35vh] w-[35vw] rounded-xl object-cover shadow-[0px_0px_100px_-20px_black]"
          videoConstraints={{ deviceId: deckCam.deviceId }}
        />
      )}
      <NowPlaying />
    </div>
  );
}

function NowPlaying() {
  const app = useApp();

  const currentTrack = app((x) => x.state.currentTrack);

  if (!currentTrack) return null;

  return (
    <div className="bg-background/70 absolute top-10 right-10 flex w-[35vw] flex-col rounded-xl p-6 shadow-[0px_0px_100px_-20px_black] backdrop-blur-lg">
      <div className="font-[DIN_Bold] text-[32px]">Now playing</div>
      <div className="text-[40px]">{currentTrack.title}</div>
      <div className="text-[32px]">{currentTrack.artist}</div>
    </div>
  );
}
