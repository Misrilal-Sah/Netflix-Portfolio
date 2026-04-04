"use client";

import { useState, type FormEvent } from "react";
import type { ProfileType } from "@/lib/constants";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PROFILE_COPY: Record<
  ProfileType,
  { title: string; subtitle: string; namePlaceholder: string; msgPlaceholder: string }
> = {
  recruiter: {
    title: "Get In Touch",
    subtitle:
      "Interested in working together? I respond promptly to professional inquiries.",
    namePlaceholder: "Your Name / Company",
    msgPlaceholder: "Tell me about the role or project...",
  },
  developer: {
    title: "Open An Issue",
    subtitle:
      "Bug reports, feature requests, collab proposals, or just a good tech discussion.",
    namePlaceholder: "Your handle or name",
    msgPlaceholder: "What's on your mind? Code, ideas, anything...",
  },
  stalker: {
    title: "Slide Into My Inbox",
    subtitle: "Go ahead. I'm literally right here.",
    namePlaceholder: "Name (or alias, I'm not judging)",
    msgPlaceholder: "Say whatever you were going to say...",
  },
  adventurer: {
    title: "Send A Raven",
    subtitle: "Got a quest to propose? A dungeon to raid? I'm listening.",
    namePlaceholder: "Adventurer name",
    msgPlaceholder: "Describe the quest...",
  },
};

interface ContactClientProps {
  profile: ProfileType;
}

type Status = "idle" | "sending" | "success" | "error";

export function ContactClient({ profile }: ContactClientProps) {
  const copy = PROFILE_COPY[profile];
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
      profile,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Failed to send message.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-bg pb-3xl">
      {/* Page Header */}
      <div className="pt-12 lg:pt-[68px]">
        <div className="px-[4vw] py-2xl">
          <h1 className="text-[length:var(--font-size-display)] font-bold text-text">
            {copy.title}
          </h1>
          <p className="mt-sm text-[length:var(--font-size-heading)] text-text-muted max-w-2xl">
            {copy.subtitle}
          </p>
        </div>
      </div>

      <div className="px-[4vw] max-w-2xl">
        {status === "success" ? (
          <div className="bg-surface border border-border rounded-md p-2xl flex flex-col items-center gap-lg text-center">
            <CheckCircle size={48} className="text-accent" />
            <div>
              <p className="text-[length:var(--font-size-heading)] font-bold text-text">
                Message sent!
              </p>
              <p className="mt-sm text-[length:var(--font-size-body)] text-text-muted">
                I&apos;ll get back to you soon.
              </p>
            </div>
            <button
              onClick={() => setStatus("idle")}
              className="mt-md px-xl py-md bg-accent hover:bg-accent-hover text-text font-bold rounded-sm transition-colors text-[length:var(--font-size-body)]"
            >
              Send another
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-surface border border-border rounded-md p-xl lg:p-2xl space-y-lg"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
              <div className="flex flex-col gap-sm">
                <label
                  htmlFor="name"
                  className="text-[length:var(--font-size-body)] font-bold text-text-muted uppercase tracking-widest"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder={copy.namePlaceholder}
                  disabled={status === "sending"}
                  className="bg-bg border border-border rounded-sm px-md py-sm text-[length:var(--font-size-body)] text-text placeholder:text-text-dim focus:outline-none focus:border-text-muted transition-colors disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-sm">
                <label
                  htmlFor="email"
                  className="text-[length:var(--font-size-body)] font-bold text-text-muted uppercase tracking-widest"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  disabled={status === "sending"}
                  className="bg-bg border border-border rounded-sm px-md py-sm text-[length:var(--font-size-body)] text-text placeholder:text-text-dim focus:outline-none focus:border-text-muted transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-sm">
              <label
                htmlFor="subject"
                className="text-[length:var(--font-size-body)] font-bold text-text-muted uppercase tracking-widest"
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="What's this about?"
                disabled={status === "sending"}
                className="bg-bg border border-border rounded-sm px-md py-sm text-[length:var(--font-size-body)] text-text placeholder:text-text-dim focus:outline-none focus:border-text-muted transition-colors disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-sm">
              <label
                htmlFor="message"
                className="text-[length:var(--font-size-body)] font-bold text-text-muted uppercase tracking-widest"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder={copy.msgPlaceholder}
                disabled={status === "sending"}
                className="bg-bg border border-border rounded-sm px-md py-sm text-[length:var(--font-size-body)] text-text placeholder:text-text-dim focus:outline-none focus:border-text-muted transition-colors resize-none disabled:opacity-50"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-sm text-[length:var(--font-size-body)] text-accent">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className={cn(
                "flex items-center gap-sm px-xl py-md font-bold rounded-sm transition-colors text-[length:var(--font-size-body)]",
                status === "sending"
                  ? "bg-surface-hover text-text-muted cursor-not-allowed"
                  : "bg-accent hover:bg-accent-hover text-text"
              )}
            >
              <Send size={16} />
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
