import { PageBackground } from "@/components/page-background";
import { useApp } from "@/context";

export function HoldPage() {
  const app = useApp();

  const holdText = app((x) => x.state.holdText);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <PageBackground />
      <div className="font-[DIN_Black] text-[200px] tracking-[-.5rem] text-(--slowjam-color) mix-blend-screen text-shadow-[0px_0px_20px_var(--slowjam-color)]">
        {holdText}
      </div>
    </div>
  );
}
