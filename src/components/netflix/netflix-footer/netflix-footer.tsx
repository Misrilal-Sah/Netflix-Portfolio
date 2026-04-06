"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, ExternalLink } from "lucide-react";
import { PROFILE_TYPES } from "@/lib/constants";

function GithubIcon({ size = 15, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 15, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ size = 15, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function MailIcon({ size = 15, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Home",           path: "" },
  { label: "Projects",       path: "projects" },
  { label: "Experience",     path: "experience" },
  { label: "Skills",         path: "skills" },
  { label: "Certifications", path: "certifications" },
  { label: "About",          path: "about" },
  { label: "Contact",        path: "contact" },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Misrilal-Sah",
    icon: GithubIcon,
    hoverColor: "#ffffff",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/misrilal-sah/",
    icon: LinkedInIcon,
    hoverColor: "#0077B5",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/sah._099/",
    icon: InstagramIcon,
    hoverColor: "#E1306C",
  },
  {
    label: "Email",
    href: "mailto:misrilalsah09@gmail.com",
    icon: MailIcon,
    hoverColor: "#E50914",
  },
];

export function NetflixFooter() {
  const pathname = usePathname();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  // Hide footer on the profile-selector / intro page
  if (pathname === "/") return null;

  const profile =
    (PROFILE_TYPES as readonly string[]).find(
      (p) => pathname === `/${p}` || pathname.startsWith(`/${p}/`)
    ) ?? "recruiter";

  return (
    <footer className="bg-[#0d0d0d] border-t border-[rgba(255,255,255,0.06)]">
      {/* Main footer body */}
      <div className="px-[4vw] py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[4fr_3fr_5fr] gap-10 lg:gap-16">

          {/* ── Col 1: Brand ── */}
          <div className="space-y-5">
            {/* Logo */}
            <Link href={`/${profile}`}>
              <Image
                src="/logo.png"
                alt="Misrilal Sah"
                width={160}
                height={40}
                className="h-9 w-auto"
              />
            </Link>

            {/* Tagline */}
            <p className="text-[#666] text-sm leading-relaxed" style={{ paddingTop: "10px" }}>
              Full Stack Developer building production-grade React, Node.js &amp; AI applications.
              Clean code, sharp design, shipped product.
            </p>

            {/* Availability badge */}
            {/* <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse" />
              <span className="text-green-400 text-xs font-semibold">Available for work</span>
            </div> */}

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  onMouseEnter={() => setHoveredIcon(label)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1a1a] hover:border-[rgba(255,255,255,0.2)] flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon
                    size={15}
                    style={{ color: hoveredIcon === label ? hoverColor : "#555" }}
                    className="transition-colors duration-200"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Navigation ── */}
          <div>
            <h3 className="text-[#555] text-[11px] font-bold uppercase tracking-[0.12em] mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ label, path }) => {
                const href = path ? `/${profile}/${path}` : `/${profile}`;
                const isActive = pathname === href;
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group flex items-center gap-2 text-sm transition-colors duration-150"
                      style={{ color: isActive ? "#E50914" : "#666" }}
                    >
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0 transition-colors duration-150"
                        style={{ background: isActive ? "#E50914" : "rgba(255,255,255,0.15)" }}
                      />
                      <span className="group-hover:text-white transition-colors duration-150">
                        {label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── Col 3: Contact ── */}
          <div>
            <h3 className="text-[#555] text-[11px] font-bold uppercase tracking-[0.12em] mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="mailto:misrilalsah09@gmail.com"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-md bg-[#1a1a1a] border border-[rgba(255,255,255,0.07)] flex items-center justify-center flex-shrink-0">
                    <MailIcon size={13} className="text-[#E50914]" />
                  </div>
                  <span className="text-[#666] text-sm group-hover:text-white transition-colors">
                    misrilalsah09@gmail.com
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+918237138622"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-md bg-[#1a1a1a] border border-[rgba(255,255,255,0.07)] flex items-center justify-center flex-shrink-0">
                    <Phone size={13} className="text-[#E50914]" />
                  </div>
                  <span className="text-[#666] text-sm group-hover:text-white transition-colors">
                    +91 8237138622
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#1a1a1a] border border-[rgba(255,255,255,0.07)] flex items-center justify-center flex-shrink-0">
                  <MapPin size={13} className="text-[#E50914]" />
                </div>
                <span className="text-[#666] text-sm">
                  Pune, Maharashtra, India
                </span>
              </li>
              <li className="pt-1">
                <a
                  href="https://www.linkedin.com/in/misrilal-sah/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold border border-[rgba(255,255,255,0.12)] text-[#808080] hover:text-white hover:border-[rgba(255,255,255,0.3)] transition-all duration-200"
                >
                  <ExternalLink size={12} />
                  View LinkedIn Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[rgba(255,255,255,0.05)] px-[4vw] py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#444] text-xs">
            &copy; {new Date().getFullYear()} Misrilal Sah. Built with Next.js &amp; Supabase.
          </p>
          <p className="text-[#333] text-xs">
            Designed &amp; developed by{" "}
            <span className="text-[#E50914] font-semibold">Misrilal Shaha</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

