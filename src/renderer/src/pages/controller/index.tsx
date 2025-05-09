import { useApp } from "@/context";
import { clientAction } from "@/services/socket";
import { Button } from "earthling-ui/button";
import { TextArea } from "earthling-ui/textarea";
import { useEffect, useState } from "react";

export default function ControllerPage() {
  const app = useApp();

  return (
    <div className="bg-background flex flex-1 flex-col">
      <div className="flex flex-row">
        <Button>Scene</Button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div>
          <Button
            onClick={async () => {
              await clientAction("setScene", "Main");
            }}
          >
            Return Home
          </Button>
        </div>
        <div className="flex flex-col gap-3">
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
        className="min-w-[300px] text-center"
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
