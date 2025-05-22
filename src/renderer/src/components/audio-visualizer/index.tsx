import { ComponentProps } from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";

export function AudioVisualizer({
  ...rest
}: ComponentProps<typeof LiveAudioVisualizer>) {
  return <LiveAudioVisualizer {...rest} />;
}
