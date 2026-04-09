"use client";

import { motion } from "framer-motion";
import { BotIcon } from "./BotIcon";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 max-w-[85%]">
      <div className="w-7 h-7 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center">
        <BotIcon size={18} />
      </div>
      <div className="bg-[#2A2A2A] border border-[rgba(255,255,255,0.06)] rounded-xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-[7px] h-[7px] rounded-full bg-[#808080]"
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
