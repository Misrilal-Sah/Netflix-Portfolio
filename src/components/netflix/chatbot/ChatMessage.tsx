"use client";

import { motion } from "framer-motion";
import { BotIcon } from "./BotIcon";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
          <BotIcon size={18} />
        </div>
      )}

      <div
        className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? "bg-accent text-white rounded-xl rounded-tr-sm"
            : "bg-[#2A2A2A] border border-[rgba(255,255,255,0.06)] text-[#e5e5e5] rounded-xl rounded-tl-sm"
        }`}
      >
        {content}
      </div>
    </motion.div>
  );
}
