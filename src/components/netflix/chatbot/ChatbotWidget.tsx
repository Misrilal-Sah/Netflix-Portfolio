"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { BotIcon } from "./BotIcon";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MAX_HISTORY = 8;

const GREETING =
  "Hey there! 👋 I'm Misrilal's AI assistant. Ask me anything about his skills, projects, experience, or education!";

export function ChatbotWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Don't render on admin routes or the profile selection page
  if (pathname.startsWith("/admin") || pathname === "/") return null;

  // Auto-scroll to bottom when messages change
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when opened
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg].slice(-MAX_HISTORY);
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      const botMsg: Message = {
        role: "assistant",
        content: data.reply || "Sorry, I couldn't process that. Please try again.",
      };
      setMessages((prev) => [...prev, botMsg].slice(-MAX_HISTORY));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <>
      {/* ─── Floating Toggle Button ─── */}
      <button
        id="chatbot-toggle"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent hover:bg-accent-hover text-white shadow-lg flex items-center justify-center transition-colors duration-200 group cursor-pointer"
        aria-label={open ? "Close chat" : "Chat with AI assistant"}
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full animate-ping bg-accent opacity-20 pointer-events-none group-hover:opacity-0" />
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <BotIcon size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* ─── Chat Window ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-[#2A2A2A]"
            style={{ background: "#141414" }}
          >
            {/* ─── Header ─── */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A] bg-[#0d0d0d]">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <BotIcon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-bold leading-tight">
                  Ask about Misrilal
                </h3>
                <p className="text-[#808080] text-[11px] leading-tight">
                  AI-powered • Always available
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#808080] hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Close chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ─── Messages ─── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            >
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              {loading && <TypingIndicator />}
            </div>

            {/* ─── Input ─── */}
            <div className="px-3 pb-3 pt-2 border-t border-[#2A2A2A] bg-[#0d0d0d]">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  id="chatbot-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask something about Misrilal…"
                  disabled={loading}
                  className="flex-1 bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-[#555] focus:outline-none focus:border-accent/50 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-30 text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-[#444] text-center mt-1.5">
                Powered by Groq AI • Knows only about Misrilal
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
