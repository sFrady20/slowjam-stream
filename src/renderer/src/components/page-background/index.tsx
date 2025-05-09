export function PageBackground() {
  return (
    <>
      <img
        src={`/backgrounds/background-3.png`}
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <video
        src={`/backgrounds/videos/displacement_surface_vj_loop (1080p).mp4`}
        muted
        autoPlay
        loop
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
    </>
  );
}
