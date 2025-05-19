import { useApp } from "@/context";
import { clientAction } from "@/services/socket";
import { Button } from "earthling-ui/button";
import { Input } from "earthling-ui/input";
import { TextArea } from "earthling-ui/textarea";
import { Switch } from "earthling-ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "earthling-ui/select";
import { Slider } from "earthling-ui/slider";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { create } from "zustand";

export default function ControllerPage() {
  const app = useApp();

  const streamData = app((x) => x.state.streamData);

  const [page, setPage] = useState<"stream" | "visualizer" | "spinner">(
    "stream",
  );

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
        <Button
          scheme={"secondary"}
          aria-pressed={page === "spinner"}
          onClick={() => setPage("spinner")}
          className="flex-1"
        >
          Spinner
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
      {page === "spinner" && <SpinnerPage />}
    </div>
  );
}

const visualizerState = create<{
  query: string;
  page: number;
  videos: { id: number; thumbnail: string; video: string; tags: string }[];
  isLoading: boolean;
  error: string | null;
}>(() => ({
  query: "dance",
  page: 1,
  videos: [],
  isLoading: false,
  error: null,
}));

const VisualizerPage = () => {
  const app = useApp();

  const { opacity, blendMode, videoUrl, speed, matchBpm } = app(
    (x) => x.state.visualizer,
  );

  const videos = visualizerState((x) => x.videos);
  const query = visualizerState((x) => x.query);
  const page = visualizerState((x) => x.page);
  const isLoading = visualizerState((x) => x.isLoading);
  const error = visualizerState((x) => x.error);

  const fetchVideos = useCallback(
    async (page: number) => {
      if (visualizerState.getState().isLoading) return;
      visualizerState.setState({ isLoading: true, error: null, page });

      try {
        const videos = await clientAction("fetchVideos", query, page);
        visualizerState.setState({ videos, isLoading: false, error: null });
      } catch (error: any) {
        visualizerState.setState({
          isLoading: false,
          error: error.message,
        });
      }
    },
    [query],
  );

  useEffect(() => {
    fetchVideos(1);
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col">
          Opacity
          <div className="flex flex-row gap-2">
            <Slider
              value={[opacity]}
              onValueChange={(v) => {
                clientAction("updateVisualizer", { opacity: v[0] });
              }}
            />
            <Select
              value={blendMode}
              onValueChange={(value) => {
                clientAction("updateVisualizer", { blendMode: value });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="multiply">Multiply</SelectItem>
                <SelectItem value="screen">Screen</SelectItem>
                <SelectItem value="overlay">Overlay</SelectItem>
                <SelectItem value="darken">Darken</SelectItem>
                <SelectItem value="lighten">Lighten</SelectItem>
                <SelectItem value="color-dodge">Color Dodge</SelectItem>
                <SelectItem value="color-burn">Color Burn</SelectItem>
                <SelectItem value="hard-light">Hard Light</SelectItem>
                <SelectItem value="soft-light">Soft Light</SelectItem>
                <SelectItem value="difference">Difference</SelectItem>
                <SelectItem value="exclusion">Exclusion</SelectItem>
                <SelectItem value="hue">Hue</SelectItem>
                <SelectItem value="saturation">Saturation</SelectItem>
                <SelectItem value="color">Color</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col">
          Speed
          <div className="flex flex-row gap-2">
            <Slider
              min={0.1}
              max={2}
              step={0.01}
              value={[speed]}
              onValueChange={(v) => {
                clientAction("updateVisualizer", { speed: v[0] });
              }}
            />
            <Switch
              //@ts-ignore
              checked={matchBpm}
              onCheckedChange={(v) => {
                clientAction("updateVisualizer", { matchBpm: v });
              }}
            ></Switch>
          </div>
        </div>
      </div>
      <div className="bg-background/70 sticky top-0 -mx-6 flex flex-col gap-4 px-6 py-4 backdrop-blur-lg">
        <div className="flex flex-row gap-2">
          <Input
            className="flex-1"
            value={query}
            onChange={(e) =>
              visualizerState.setState({ query: e.target.value })
            }
          />
          <Button
            onClick={() => {
              fetchVideos(1);
            }}
          >
            {isLoading && <i className="icon-[svg-spinners--ring-resize]" />}
            Search
          </Button>
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex flex-row items-center justify-between gap-2">
          <Button
            onClick={() => {
              fetchVideos(page - 1);
            }}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="grid grid-cols-9 gap-1">
            {new Array(9).fill("").map((_, i) => (
              <Button
                scheme={"secondary"}
                aria-pressed={page === i + 1}
                key={i}
                onClick={() => {
                  visualizerState.setState({ page: i + 1 });
                  fetchVideos(i + 1);
                }}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => {
              visualizerState.setState({ page: page + 1 });
              fetchVideos(page + 1);
            }}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2">
        {videos?.map((x) => (
          <img
            key={x.id}
            src={x.thumbnail}
            title={x.tags}
            className={cn(
              "col-span-3 aspect-video cursor-pointer md:col-span-2 xl:col-span-1",
              videoUrl === x.video && "ring-2",
            )}
            onClick={() => {
              clientAction("updateVisualizer", {
                videoUrl: videoUrl === x.video ? null : x.video,
              });
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

const SpinnerPage = () => {
  return (
    <div className="flex flex-col gap-2">
      <div>Drink Chances</div>
      <Slider />
    </div>
  );
};
