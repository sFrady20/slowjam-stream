import { useApp } from "@/context";
import { clientAction } from "@/services/socket";
import { Button } from "earthling-ui/button";
import { TextArea } from "earthling-ui/textarea";
import { useState } from "react";

export default function ControllerPage() {
  const app = useApp();

  const streamData = app((x) => x.state.streamData);

  return (
    <div className="bg-background flex flex-1 flex-col gap-4 p-6">
      {streamData && (
        <div className="flex flex-col gap-2">
          <div>Title: {streamData.title}</div>
          <div>Viewers: {streamData.viewers}</div>
        </div>
      )}
      <div className="flex flex-row gap-2">
        <Button scheme={"secondary"} className="flex-1">
          Scene
        </Button>
        <Button scheme={"secondary"} className="flex-1">
          Games
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-6">
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
    </div>
  );
}

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
