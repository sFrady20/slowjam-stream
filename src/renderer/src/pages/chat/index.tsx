import { useEffect, useState } from "react";
import Webcam from "react-webcam";

export function ChatPage() {
  const [faceCam, setFaceCam] = useState<MediaDeviceInfo>();

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
    })();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {faceCam && (
        <Webcam
          className="top0 absolute left-0 h-full w-full object-cover"
          videoConstraints={{ deviceId: faceCam.deviceId }}
        />
      )}
    </div>
  );
}
