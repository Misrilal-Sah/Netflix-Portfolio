"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { openConfirm } from "@/components/ui/confirm-dialog";
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp, Plus, Minus, Save } from "lucide-react";
import type { ContactSubmission } from "@/lib/types/database";
import type { ContactInfoData, SocialLink } from "@/lib/data/contact-info";
import { markSubmissionRead, deleteSubmission, upsertContactInfoKey } from "@/lib/actions/admin";
import { ImageUploadField } from "@/components/admin/image-upload-field";
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

export function ContactSubmissionsClient({
  initialSubmissions,
  initialContactInfo,
}: {
  initialSubmissions: ContactSubmission[];
  initialContactInfo: ContactInfoData;
}) {
  const [activeTab, setActiveTab] = useState<"messages" | "settings">("messages");
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

  async function handleDelete(id: string) {
    const ok = await openConfirm("This message will be permanently deleted.", { title: "Delete message?", confirmLabel: "Delete" });
    if (!ok) return;
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
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[rgba(255,255,255,0.08)]">
        <button
          onClick={() => setActiveTab("messages")}
          className={cn("px-4 py-2 text-sm font-bold transition-colors border-b-2 -mb-px", activeTab === "messages" ? "border-[#E50914] text-white" : "border-transparent text-[#555] hover:text-white")}
        >
          Messages{unreadCount > 0 && <span className="ml-1.5 bg-[#E50914] text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={cn("px-4 py-2 text-sm font-bold transition-colors border-b-2 -mb-px", activeTab === "settings" ? "border-[#E50914] text-white" : "border-transparent text-[#555] hover:text-white")}
        >
          Page Settings
        </button>
      </div>

      {activeTab === "messages" && (
        <>
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
        </>
      )}

      {activeTab === "settings" && (
        <ContactInfoCMS initialContactInfo={initialContactInfo} />
      )}
    </div>
  );
}

// ─── Contact Info CMS ─────────────────────────────────────────────────────────

const inputCls = "w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-2 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors";

function ContactInfoCMS({ initialContactInfo }: { initialContactInfo: ContactInfoData }) {
  const [info, setInfo] = useState<ContactInfoData>(initialContactInfo);
  const [links, setLinks] = useState<SocialLink[]>(initialContactInfo.social_links);
  const [isPending, startTransition] = useTransition();

  function saveSection(key: keyof ContactInfoData, value: unknown) {
    startTransition(async () => {
      try {
        await upsertContactInfoKey(key, value as Record<string, unknown>);
        toast.success("Saved");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error saving");
      }
    });
  }

  function updateField<K extends keyof ContactInfoData>(
    section: K,
    field: string,
    value: string | boolean
  ) {
    setInfo((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), [field]: value },
    }));
  }

  function addLink() {
    setLinks((prev) => [...prev, { name: "", url: "", bg_color: "#333333" }]);
  }

  function removeLink(i: number) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateLink(i: number, field: keyof SocialLink, value: string) {
    setLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Section title="Profile Card" onSave={() => saveSection("profile_card", info.profile_card)} isPending={isPending}>
        {(["name", "job_title", "bio", "location", "linkedin_url"] as const).map((field) => (
          <Field key={field} label={field.replace(/_/g, " ")} value={String(info.profile_card[field] ?? "")} onChange={(v) => updateField("profile_card", field, v)} />
        ))}
        <ImageUploadField
          label="Photo"
          value={String(info.profile_card.photo_url ?? "")}
          onChange={(v) => updateField("profile_card", "photo_url", v)}
        />
      </Section>

      {/* Contact Details */}
      <Section title="Contact Details" onSave={() => saveSection("contact_details", info.contact_details)} isPending={isPending}>
        {(["email", "phone", "location"] as const).map((field) => (
          <Field key={field} label={field} value={String(info.contact_details[field] ?? "")} onChange={(v) => updateField("contact_details", field, v)} />
        ))}
      </Section>

      {/* Social Links */}
      <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold">Social Links</h3>
          <div className="flex gap-2">
            <button onClick={addLink} className="flex items-center gap-1 px-3 py-1.5 bg-[#333] hover:bg-[#444] text-white text-xs font-bold rounded-sm transition-colors">
              <Plus size={12} /> Add
            </button>
            <button onClick={() => saveSection("social_links", links)} disabled={isPending} className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-40 text-white font-bold text-sm rounded-sm transition-colors">
              <Save size={14} /> {isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
        {links.map((link, i) => (
          <div key={i} className="border border-[rgba(255,255,255,0.06)] rounded-sm p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#808080] text-xs font-bold uppercase tracking-wider">Link {i + 1}</span>
              <button onClick={() => removeLink(i)} className="text-[#555] hover:text-[#E50914] transition-colors"><Minus size={14} /></button>
            </div>
            <Field label="Name (e.g. LinkedIn, GitHub)" value={link.name} onChange={(v) => updateLink(i, "name", v)} />
            <Field label="URL" value={link.url} onChange={(v) => updateLink(i, "url", v)} />
            <div>
              <label className="block text-[#555] text-xs mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={link.bg_color} onChange={(e) => updateLink(i, "bg_color", e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0" />
                <input value={link.bg_color} onChange={(e) => updateLink(i, "bg_color", e.target.value)} placeholder="#333333" className={cn(inputCls, "flex-1 font-mono text-xs")} />
              </div>
            </div>
          </div>
        ))}
        {links.length === 0 && <p className="text-[#555] text-sm text-center py-4">No social links. Click Add to create one.</p>}
      </div>

      {/* Availability */}
      <Section title="Availability" onSave={() => saveSection("availability", info.availability)} isPending={isPending}>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_available"
            checked={info.availability.is_available}
            onChange={(e) => updateField("availability", "is_available", e.target.checked)}
            className="w-4 h-4 accent-[#E50914]"
          />
          <label htmlFor="is_available" className="text-[#808080] text-xs font-bold uppercase tracking-wider">Available for Work</label>
        </div>
        <Field label="Status Text" value={info.availability.status_text} onChange={(v) => updateField("availability", "status_text", v)} />
        <Field label="Response Time" value={info.availability.response_time} onChange={(v) => updateField("availability", "response_time", v)} />
      </Section>

      {/* Notifications */}
      <Section title="Notifications" onSave={() => saveSection("notifications", info.notifications)} isPending={isPending}>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="email_enabled"
              checked={info.notifications.email_enabled}
              onChange={(e) => updateField("notifications", "email_enabled", e.target.checked)}
              className="w-4 h-4 accent-[#E50914]"
            />
            <label htmlFor="email_enabled" className="text-[#808080] text-xs font-bold uppercase tracking-wider">Email Notifications</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="whatsapp_enabled"
              checked={info.notifications.whatsapp_enabled}
              onChange={(e) => updateField("notifications", "whatsapp_enabled", e.target.checked)}
              className="w-4 h-4 accent-[#E50914]"
            />
            <label htmlFor="whatsapp_enabled" className="text-[#808080] text-xs font-bold uppercase tracking-wider">WhatsApp Notifications</label>
          </div>
          <p className="text-[#555] text-xs mt-2">Messages will be sent to: {info.contact_details.phone}</p>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, onSave, isPending, children }: { title: string; onSave: () => void; isPending: boolean; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold">{title}</h3>
        <button onClick={onSave} disabled={isPending} className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-40 text-white font-bold text-sm rounded-sm transition-colors">
          <Save size={14} /> {isPending ? "Saving…" : "Save"}
        </button>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[#555] text-xs mb-1 capitalize">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  );
}
