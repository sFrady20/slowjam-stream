import { PageBackground } from "@/components/page-background";
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
          className="absolute top-10 left-10 h-[92vh] w-[70vw] rounded-xl object-cover shadow-[0px_0px_100px_-20px_black]"
          videoConstraints={{ deviceId: faceCam.deviceId }}
        />
      )}
      {deckCam && (
        <Webcam
          className="absolute right-10 bottom-3 h-[35vh] w-[35vw] rounded-xl object-cover shadow-[0px_0px_100px_-20px_black]"
          videoConstraints={{ deviceId: deckCam.deviceId }}
        />
      )}
    </div>
  );
}
