import Webcam from "react-webcam";

export function HomePage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <img
        src={`/background-3.png`}
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <Webcam
        className="absolute h-full w-full scale-95 rounded-xl border-b-4 border-(--slowjam-color) object-cover shadow-[0px_0px_100px_-20px_black]"
        videoConstraints={{ deviceId: "0" }}
      />
      <div className="font-[DIN_Black] text-[200px] tracking-[-.5rem] text-(--slowjam-color) mix-blend-screen text-shadow-[0px_0px_20px_var(--slowjam-color)]">
        SLOWJAM
      </div>
    </div>
  );
}
