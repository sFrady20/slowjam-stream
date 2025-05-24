import { useApp } from "@/context";
import { motion } from "motion/react";

export function Activity() {
  const app = useApp();
  const activity = app((x) => x.state.activity);

  return (
    <div className="from-background to-foreground/5 my-2 flex flex-1 flex-col items-end justify-end gap-2 rounded-xl bg-gradient-to-b p-[8px] shadow-[0px_0px_100px_-20px_black]">
      {activity.slice(-8).map((x) => (
        <motion.div
          layout
          key={x.id}
          initial={{ translateY: 32, opacity: 0, scale: 0.98 }}
          animate={{ translateY: 0, opacity: 1, scale: 1 }}
          exit={{ translateY: -32, opacity: 0, scale: 0.98 }}
          className="bg-background rounded-xl px-[20px] py-[8px]"
        >
          <div className="text-foreground text-right font-[DIN_Bold] text-[20px] mix-blend-screen backdrop-blur-lg text-shadow-[0px_0px_13px_var(--color-foreground)]">
            {x.message}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
