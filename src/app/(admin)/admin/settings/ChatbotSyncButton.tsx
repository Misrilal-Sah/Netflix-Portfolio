"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { RefreshCw, Trash2, Bot } from "lucide-react";

interface ChatbotSyncButtonProps {
  initialLastSynced: string | null;
}

/** Format a date string client-side only to avoid locale hydration mismatch */
function useClientFormattedDate(isoString: string | null): string {
  const [formatted, setFormatted] = useState<string>("");
  useEffect(() => {
    if (!isoString) { setFormatted(""); return; }
    setFormatted(new Date(isoString).toLocaleString());
  }, [isoString]);
  return formatted;
}

export function ChatbotSyncButton({ initialLastSynced }: ChatbotSyncButtonProps) {
  const [lastSynced, setLastSynced] = useState(initialLastSynced);
  const [isSyncing, startSync] = useTransition();
  const [isRegenerating, startRegen] = useTransition();
  const formattedDate = useClientFormattedDate(lastSynced);

  function handleSync() {
    startSync(async () => {
      try {
        const res = await fetch("/api/chatbot/sync", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Sync failed");
        setLastSynced(data.updated_at);
        toast.success(`Chatbot data synced! (${data.prompt_length} chars)`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Sync failed");
      }
    });
  }

  function handleRegenerate() {
    startRegen(async () => {
      try {
        // The sync endpoint already deletes + rebuilds
        const res = await fetch("/api/chatbot/sync", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Regeneration failed");
        setLastSynced(data.updated_at);
        toast.success("Chatbot cache regenerated from scratch!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Regeneration failed");
      }
    });
  }

  const isPending = isSyncing || isRegenerating;

  return (
    <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5">
      <div className="flex items-center gap-2 mb-1">
        <Bot size={18} className="text-accent" />
        <h3 className="text-white font-bold">Chatbot Data</h3>
      </div>
      <p className="text-[#555] text-xs mb-4">
        The AI chatbot uses cached portfolio data to answer questions.
        Sync after updating your profile, contact details, skills, projects, or experience.
      </p>

      {lastSynced && formattedDate && (
        <p className="text-[#808080] text-xs mb-3">
          Last synced:{" "}
          <span className="text-white">
            {formattedDate}
          </span>
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSync}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-40 text-white font-bold text-sm rounded-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "Syncing…" : "Sync Chatbot Data"}
        </button>

        <button
          onClick={handleRegenerate}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-[#333] hover:bg-[#444] disabled:opacity-40 text-white font-bold text-sm rounded-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <Trash2 size={14} className={isRegenerating ? "animate-pulse" : ""} />
          {isRegenerating ? "Regenerating…" : "Regenerate from Scratch"}
        </button>
      </div>
    </div>
  );
}
