import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { ComponentProps } from "react";

export function VideoCard({
  url,
  className,
  children,
  ...div
}: { url: string } & ComponentProps<"div">) {
  return (
    <div
      {...div}
      className={cn(
        "relative overflow-hidden before:absolute before:inset-0 before:top-0 before:left-0 before:z-[2] before:backdrop-blur-md",
        className,
      )}
    >
      <video
        src={url}
        className="absolute top-0 left-0 z-[1] h-full w-full object-cover opacity-20"
        autoPlay
        loop
        muted
      />
      <div className={cn("relative z-[3]")}>{children}</div>
    </div>
  );
}

export const MotionVideoCard = motion(VideoCard);
