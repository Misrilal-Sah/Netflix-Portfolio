"use client";

import { useState, useRef, type FormEvent } from "react";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import type { ProfileType } from "@/lib/constants";
import { Send, CheckCircle, AlertCircle, MapPin, Mail, Phone, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactPageCopy } from "@/lib/data/page-copy";
import type { ContactInfoData } from "@/lib/data/contact-info";



// ─── Social icon renderer ─────────────────────────────────────────────────────
function SocialIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  if (n === "linkedin") return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>);
  if (n === "instagram") return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF" aria-hidden="true"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>);
  if (n === "reddit") return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF" aria-hidden="true"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" /></svg>);
  if (n === "discord") return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>);
  if (n === "whatsapp") return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>);
  if (n === "telegram") return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>);
  return <LinkIcon size={18} color="#FFFFFF" aria-hidden="true" />;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ContactClientProps {
  profile: ProfileType;
  copy: ContactPageCopy;
  contactInfo: ContactInfoData;
  /** reCAPTCHA v2 site key. When absent, captcha widget is hidden. */
  recaptchaSiteKey?: string;
}

type Status = "idle" | "sending" | "success" | "error";

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactClient({ profile, copy, contactInfo, recaptchaSiteKey }: ContactClientProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { profile_card, contact_details, social_links, availability } = contactInfo;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const payload: Record<string, string> = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
      profile,
    };

    if (recaptchaSiteKey) {
      const token = recaptchaRef.current?.getValue();
      if (!token) {
        setStatus("error");
        setErrorMsg("Please complete the reCAPTCHA verification.");
        return;
      }
      payload.recaptcha_token = token;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string })?.error ?? "Failed to send message.");
      }

      setStatus("success");
      form.reset();
      recaptchaRef.current?.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      recaptchaRef.current?.reset();
    }
  }

  return (
    <div className="min-h-screen bg-bg pb-3xl">
      <div className="max-w-5xl mx-auto px-[4vw]">

        {/* LinkedIn-style Profile Card */}
        <div className="pt-20 pb-xl">
          <div className="bg-surface border border-border rounded-md p-xl w-full max-w-[480px] mx-auto">
            <div className="flex items-center gap-md">
              <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={profile_card.photo_url || "/others/misril.png"}
                  alt={profile_card.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <p className="text-[length:var(--font-size-heading)] font-bold text-text leading-tight">
                  {profile_card.name}
                </p>
                <p className="text-[length:var(--font-size-body)] text-text-muted mt-xs">
                  {profile_card.job_title}
                </p>
              </div>
            </div>
            <p className="mt-md text-[length:var(--font-size-body)] text-text-muted leading-relaxed">
              {profile_card.bio}
            </p>
            <p className="mt-sm text-[length:var(--font-size-body)] text-text-muted">
              {profile_card.location}
            </p>
            <a
              href={profile_card.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-md inline-flex items-center gap-sm px-md py-xs rounded-sm text-white text-[length:var(--font-size-body)] font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#0077B5" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#FFFFFF" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              View Profile
            </a>
          </div>
          <p className="mt-md text-[length:var(--font-size-body)] text-text-muted text-center">
            <a href={`mailto:${contact_details.email}`} className="hover:text-text transition-colors">
              {contact_details.email}
            </a>
            {" | "}
            <a href={`tel:${contact_details.phone.replace(/\s/g, "")}`} className="hover:text-text transition-colors">
              {contact_details.phone}
            </a>
          </p>
        </div>

        {/* Page Header */}
        <div className="pb-xl text-center">
          <h1 className="text-[length:var(--font-size-display)] font-bold text-text">
            {copy.title}
          </h1>
          <p className="mt-sm text-[length:var(--font-size-heading)] text-text-muted">
            {copy.subtitle}
          </p>
        </div>

        {/* Two-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2xl">
          {/* Left: Message Form */}
          <div>
            <h2 className="text-[length:var(--font-size-heading)] font-bold text-text mb-lg">
              Send a Message
            </h2>

            {status === "success" ? (
              <div className="bg-surface border border-border rounded-md p-2xl flex flex-col items-center gap-lg text-center">
                <CheckCircle size={48} className="text-accent" />
                <div>
                  <p className="text-[length:var(--font-size-heading)] font-bold text-text">Message sent!</p>
                  <p className="mt-sm text-[length:var(--font-size-body)] text-text-muted">I&apos;ll get back to you soon.</p>
                </div>
                <button onClick={() => setStatus("idle")} className="mt-md px-xl py-md bg-accent hover:bg-accent-hover text-text font-bold rounded-sm transition-colors text-[length:var(--font-size-body)]">
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="bg-surface border border-border rounded-md p-xl space-y-lg">
                <div className="flex flex-col gap-sm">
                  <label htmlFor="name" className="text-[length:var(--font-size-body)] font-bold text-text-muted uppercase tracking-widest">Name</label>
                  <input id="name" name="name" type="text" required placeholder={copy.namePlaceholder} disabled={status === "sending"} className="bg-bg border border-border rounded-sm px-md py-sm text-[length:var(--font-size-body)] text-text placeholder:text-text-dim focus:outline-none focus:border-text-muted transition-colors disabled:opacity-50" />
                </div>
                <div className="flex flex-col gap-sm">
                  <label htmlFor="email" className="text-[length:var(--font-size-body)] font-bold text-text-muted uppercase tracking-widest">Email</label>
                  <input id="email" name="email" type="email" required placeholder="Your email address" disabled={status === "sending"} className="bg-bg border border-border rounded-sm px-md py-sm text-[length:var(--font-size-body)] text-text placeholder:text-text-dim focus:outline-none focus:border-text-muted transition-colors disabled:opacity-50" />
                </div>
                <div className="flex flex-col gap-sm">
                  <label htmlFor="subject" className="text-[length:var(--font-size-body)] font-bold text-text-muted uppercase tracking-widest">Subject</label>
                  <input id="subject" name="subject" type="text" placeholder="What is this regarding?" disabled={status === "sending"} className="bg-bg border border-border rounded-sm px-md py-sm text-[length:var(--font-size-body)] text-text placeholder:text-text-dim focus:outline-none focus:border-text-muted transition-colors disabled:opacity-50" />
                </div>
                <div className="flex flex-col gap-sm">
                  <label htmlFor="message" className="text-[length:var(--font-size-body)] font-bold text-text-muted uppercase tracking-widest">Message</label>
                  <textarea id="message" name="message" required rows={5} placeholder={copy.msgPlaceholder} disabled={status === "sending"} className="bg-bg border border-border rounded-sm px-md py-sm text-[length:var(--font-size-body)] text-text placeholder:text-text-dim focus:outline-none focus:border-text-muted transition-colors resize-none disabled:opacity-50" />
                </div>

                {/* reCAPTCHA v2 Checkbox */}
                {recaptchaSiteKey && (
                  <div>
                    <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaSiteKey} theme="dark" />
                  </div>
                )}

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
                    status === "sending" ? "bg-surface-hover text-text-muted cursor-not-allowed" : "bg-accent hover:bg-accent-hover text-text"
                  )}
                >
                  <Send size={16} />
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Right: Contact Information */}
          <div className="space-y-2xl">
            <div>
              <h2 className="text-[length:var(--font-size-heading)] font-bold text-text mb-lg">Contact Information</h2>
              <div className="space-y-md">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-[length:var(--font-size-body)] font-bold text-text">Location</p>
                    <p className="text-[length:var(--font-size-body)] text-text-muted">{contact_details.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-[length:var(--font-size-body)] font-bold text-text">Email</p>
                    <a href={`mailto:${contact_details.email}`} className="text-[length:var(--font-size-body)] text-text-muted hover:text-text transition-colors">{contact_details.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-[length:var(--font-size-body)] font-bold text-text">Phone</p>
                    <a href={`tel:${contact_details.phone.replace(/\s/g, "")}`} className="text-[length:var(--font-size-body)] text-text-muted hover:text-text transition-colors">{contact_details.phone}</a>
                  </div>
                </div>
              </div>
            </div>

            {social_links.length > 0 && (
              <div>
                <h3 className="text-[length:var(--font-size-heading)] font-bold text-text mb-md">Connect With Me</h3>
                <div className="flex flex-wrap gap-sm">
                  {social_links.map((link) => (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name} className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80" style={{ backgroundColor: link.bg_color }}>
                      <SocialIcon name={link.name} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-[length:var(--font-size-heading)] font-bold text-text mb-md">Availability</h3>
              <div className="flex items-center gap-sm">
                <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", availability.is_available ? "bg-green-500" : "bg-red-500")} />
                <p className="text-[length:var(--font-size-body)] font-bold text-text">{availability.status_text}</p>
              </div>
              <p className="mt-sm text-[length:var(--font-size-body)] text-text-muted">{availability.response_time}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

