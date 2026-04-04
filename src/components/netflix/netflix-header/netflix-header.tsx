"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, PROFILES } from "@/lib/constants";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useProfileContext } from "@/lib/contexts/profile-context";

export function NetflixHeader() {
  const { isScrolled } = useScrollDirection();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();

  let profile: string | null = null;
  try {
    const ctx = useProfileContext();
    profile = ctx.profile;
  } catch {}

  const profileData = profile ? PROFILES[profile as keyof typeof PROFILES] : null;

  return (
    <>
      {/* ── Top Desktop/Tablet Header ── */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[var(--z-nav)]",
          "h-[68px] transition-all duration-500",
          isScrolled
            ? "bg-[rgba(20,20,20,0.97)] shadow-[0_1px_0_rgba(255,255,255,0.05)]"
            : "bg-gradient-to-b from-black/70 to-transparent"
        )}
      >
        <div className="flex items-center h-full px-[4vw] gap-6 lg:gap-8">
          {/* Netflix-style red wordmark */}
          <Link
            href="/"
            aria-label="Home"
            className="shrink-0 flex items-center"
          >
            <span
              className="font-black text-accent tracking-[-0.02em] select-none"
              style={{
                fontSize: "clamp(20px, 2.2vw, 28px)",
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              MISRILAL SAH
            </span>
          </Link>

          {/* ── Desktop nav links (hidden below md) ── */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-4 lg:gap-5 flex-1">
            {profile &&
              NAV_ITEMS.map((item) => {
                const href = item.path ? `/${profile}/${item.path}` : `/${profile}`;
                const isActive =
                  pathname === href ||
                  (item.path && pathname.startsWith(href + "/"));
                return (
                  <Link
                    key={item.label}
                    href={href}
                    className={cn(
                      "text-sm font-medium transition-colors whitespace-nowrap",
                      isActive ? "text-white font-semibold" : "text-white/70 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          {/* ── Right icons ── */}
          <div className="ml-auto flex items-center gap-3 shrink-0">
            {/* Search icon */}
            <button aria-label="Search" className="text-white/80 hover:text-white transition-colors hidden sm:flex">
              <Search size={20} />
            </button>

            {/* Bell */}
            <button aria-label="Notifications" className="relative text-white/80 hover:text-white transition-colors hidden sm:flex">
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
            </button>

            {/* Resume */}
            <a
              href="/files/Misrilal_Sah_Resume.pdf"
              download
              className="hidden lg:inline-flex items-center px-3 py-1 rounded border border-white/30 text-white/80 hover:text-white hover:border-white text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              Resume
            </a>

            {/* Profile avatar + dropdown */}
            {profileData && (
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-1 group"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 rounded-md overflow-hidden relative border-2 border-transparent group-hover:border-white transition-colors">
                  <Image src={profileData.avatarImage} alt={profileData.displayName} fill className="object-cover" sizes="32px" />
                </div>
                <ChevronDown
                  size={14}
                  className={cn("text-white/70 transition-transform duration-200", profileMenuOpen && "rotate-180")}
                />
              </button>
            )}
          </div>
        </div>

        {/* Profile dropdown */}
        {profileMenuOpen && profileData && (
          <div className="absolute right-[4vw] top-[72px] w-48 bg-[rgba(20,20,20,0.97)] border border-white/10 rounded-md shadow-2xl overflow-hidden z-50">
            <Link
              href="/"
              onClick={() => setProfileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-white/80 hover:text-white"
            >
              Switch Profile
            </Link>
            <a
              href="/files/Misrilal_Sah_Resume.pdf"
              download
              onClick={() => setProfileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-white/80 hover:text-white border-t border-white/10"
            >
              Download Resume
            </a>
          </div>
        )}
      </header>

      {/* ── Mobile Bottom Tab Bar (visible below md) ── */}
      {profile && (
        <nav
          aria-label="Mobile navigation"
          className={cn(
            "md:hidden fixed bottom-0 left-0 right-0 z-[var(--z-nav)]",
            "bg-[rgba(10,10,10,0.97)] border-t border-white/10",
            "flex items-stretch h-14 safe-b"
          )}
        >
          {NAV_ITEMS.map((item) => {
            const href = item.path ? `/${profile}/${item.path}` : `/${profile}`;
            const isActive =
              pathname === href ||
              (item.path && pathname.startsWith(href + "/"));
            return (
              <Link
                key={item.label}
                href={href}
                className={cn(
                  "flex-1 flex items-center justify-center",
                  "text-[10px] font-medium transition-colors py-1",
                  isActive ? "text-white border-t-2 border-accent -mt-px" : "text-white/40"
                )}
              >
                <span className="truncate px-0.5">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}

  // Try to get profile from context, fallback to null (e.g., on landing page)
  let profile: string | null = null;
  try {
    const ctx = useProfileContext();
    profile = ctx.profile;
  } catch {
    // Not inside ProfileProvider — on landing page
  }

  const profileData = profile
    ? PROFILES[profile as keyof typeof PROFILES]
    : null;
