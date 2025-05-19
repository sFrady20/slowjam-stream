import { useApp } from "@/context";

export function Activity() {
  const app = useApp();
  const activity = app((x) => x.state.activity);

  return (
    <div className="my-2 flex flex-col items-end gap-2">
      {activity.slice(-8).map((x) => (
        <div
          key={x.id}
          className="bg-background/70 inline-block rounded-xl px-2"
        >
          <div className="text-foreground text-right font-[DIN_Bold] text-[32px] mix-blend-screen shadow-[0px_0px_100px_-20px_black] backdrop-blur-lg text-shadow-[0px_0px_13px_var(--color-foreground)]">
            {x.message}
          </div>
        </div>
      ))}
    </div>
  );
}
