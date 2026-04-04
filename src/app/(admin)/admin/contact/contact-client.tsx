"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { ContactSubmission } from "@/lib/types/database";
import { markSubmissionRead, deleteSubmission } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SubmissionRow({ sub, onToggleRead, onDelete }: {
  sub: ContactSubmission;
  onToggleRead: (id: string, read: boolean) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(!sub.is_read);
  const [isPending, startTransition] = useTransition();

  return (
    <div className={cn(
      "bg-[#1a1a1a] border rounded-sm transition-colors",
      sub.is_read ? "border-[rgba(255,255,255,0.06)]" : "border-[rgba(229,9,20,0.25)]"
    )}>
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.02)]"
        onClick={() => setExpanded((v) => !v)}
      >
        {sub.is_read
          ? <MailOpen size={14} className="text-[#555] flex-shrink-0" />
          : <Mail size={14} className="text-[#E50914] flex-shrink-0" />
        }
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-medium truncate", sub.is_read ? "text-[#808080]" : "text-white")}>
              {sub.name}
            </span>
            <span className="text-[#555] text-xs truncate">&lt;{sub.email}&gt;</span>
            {!sub.is_read && <span className="text-xs bg-[rgba(229,9,20,0.15)] text-[#E50914] px-1.5 py-0.5 rounded-sm flex-shrink-0">New</span>}
          </div>
          {sub.subject && <p className="text-[#555] text-xs truncate">{sub.subject}</p>}
        </div>
        <span className="text-[#555] text-xs flex-shrink-0 hidden sm:block">{formatDate(sub.created_at)}</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              startTransition(async () => {
                try { await onToggleRead(sub.id, !sub.is_read); }
                catch (err) { toast.error(err instanceof Error ? err.message : "Error"); }
              });
            }}
            disabled={isPending}
            className="p-1.5 text-[#555] hover:text-white transition-colors disabled:opacity-50"
            aria-label={sub.is_read ? "Mark unread" : "Mark read"}
          >
            {sub.is_read ? <Mail size={14} /> : <MailOpen size={14} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(sub.id); }}
            disabled={isPending}
            className="p-1.5 text-[#555] hover:text-[#E50914] transition-colors disabled:opacity-50"
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
          {expanded ? <ChevronUp size={14} className="text-[#555]" /> : <ChevronDown size={14} className="text-[#555]" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-[rgba(255,255,255,0.06)]">
          <div className="mt-3 space-y-2">
            <div className="flex gap-2 text-xs">
              <span className="text-[#555] w-16 flex-shrink-0">From</span>
              <span className="text-[#808080]">{sub.name} &lt;{sub.email}&gt;</span>
            </div>
            {sub.subject && (
              <div className="flex gap-2 text-xs">
                <span className="text-[#555] w-16 flex-shrink-0">Subject</span>
                <span className="text-[#808080]">{sub.subject}</span>
              </div>
            )}
            <div className="flex gap-2 text-xs">
              <span className="text-[#555] w-16 flex-shrink-0">Date</span>
              <span className="text-[#808080]">{formatDate(sub.created_at)}</span>
            </div>
            <div className="mt-3 bg-[#0a0a0a] rounded-sm p-3 text-sm text-[#C0C0C0] whitespace-pre-wrap leading-relaxed">
              {sub.message}
            </div>
            <a
              href={`mailto:${sub.email}?subject=Re: ${sub.subject ?? "Your message"}`}
              className="inline-block mt-2 text-xs text-[#E50914] hover:underline"
            >
              Reply via email →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export function ContactSubmissionsClient({ initialSubmissions }: { initialSubmissions: ContactSubmission[] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [isPending, startTransition] = useTransition();

  const filtered = submissions.filter((s) => {
    if (filter === "unread") return !s.is_read;
    if (filter === "read") return s.is_read;
    return true;
  });

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  async function handleToggleRead(id: string, read: boolean) {
    await markSubmissionRead(id, read);
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, is_read: read } : s));
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    startTransition(async () => {
      try {
        await deleteSubmission(id);
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        toast.success("Deleted");
      } catch (err) { toast.error(err instanceof Error ? err.message : "Error"); }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest">
          {submissions.length} Messages{unreadCount > 0 && ` · ${unreadCount} unread`}
        </h2>
        <div className="flex gap-1">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-sm transition-colors uppercase tracking-wider",
                filter === f ? "bg-[#E50914] text-white" : "text-[#555] hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((sub) => (
          <SubmissionRow
            key={sub.id}
            sub={sub}
            onToggleRead={handleToggleRead}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#555] text-sm">
          {filter === "unread" ? "No unread messages." : filter === "read" ? "No read messages." : "No messages yet."}
        </div>
      )}
    </div>
  );
}
