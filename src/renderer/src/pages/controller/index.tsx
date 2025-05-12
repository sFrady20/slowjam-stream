import { useApp } from "@/context";
import { clientAction } from "@/services/socket";
import { Button } from "earthling-ui/button";
import { TextArea } from "earthling-ui/textarea";
import { Slider } from "earthling-ui/slider";
import { useState } from "react";
import { cn } from "@/utils/cn";

export default function ControllerPage() {
  const app = useApp();

  const streamData = app((x) => x.state.streamData);

  const [page, setPage] = useState<"stream" | "visualizer" | "games">("stream");

  return (
    <div className="bg-background flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-row gap-2">
        <Button
          scheme={"secondary"}
          aria-pressed={page === "stream"}
          onClick={() => setPage("stream")}
          className="flex-1"
        >
          Stream
        </Button>
        <Button
          scheme={"secondary"}
          aria-pressed={page === "visualizer"}
          onClick={() => setPage("visualizer")}
          className="flex-1"
        >
          Visualizer
        </Button>
      </div>
      {page === "stream" && (
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-2">
            <div>Title: {streamData?.title}</div>
            <div>Viewers: {streamData?.viewers}</div>
          </div>
          <div>
            <Button
              className="w-full"
              onClick={async () => {
                await clientAction("setScene", "Main");
              }}
            >
              Return Home
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <ApplyHoldTool />
          </div>
        </div>
      )}
      {page === "visualizer" && <VisualizerPage />}
    </div>
  );
}

const VisualizerPage = () => {
  const app = useApp();

  const images = app((x) => x.state.vjLoops);
  const opacity = app((x) => x.state.visualizerOpacity);
  const selectedVideoUrl = app((x) => x.state.visualizerVideoUrl);
  const currentTrack = app((x) => x.state.currentTrack);

  return (
    <>
      <div className="bg-background/70 sticky top-0 -mx-6 p-6 backdrop-blur-lg">
        <Slider
          value={[opacity]}
          onValueChange={(v) => {
            clientAction("updateVisualizer", selectedVideoUrl, v[0]);
          }}
        />
        <div className="mt-2">
          {currentTrack?.bpm
            ? Math.pow(currentTrack.bpm / 128, 1.2).toLocaleString("en-US", {
                maximumFractionDigits: 1.3,
              })
            : "No track"}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images?.map((x) => (
          <img
            key={x.id}
            src={x.thumbnail}
            className={cn(
              "aspect-video",
              selectedVideoUrl === x.video && "ring-2",
            )}
            onClick={() => {
              clientAction(
                "updateVisualizer",
                selectedVideoUrl === x.video ? undefined : x.video,
                opacity,
              );
            }}
          />
        ))}
      </div>
    </>
  );
};

const ApplyHoldTool = function () {
  const [value, setValue] = useState("");

  return (
    <>
      <TextArea
        className="w-full text-center"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        onClick={async () => {
          await clientAction("applyHold", value);
        }}
      >
        Apply Hold
      </Button>
    </>
  );
};
