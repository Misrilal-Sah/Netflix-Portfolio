"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, PROFILES } from "@/lib/constants";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useProfileContext } from "@/lib/contexts/profile-context";

export function NetflixHeader() {
  const { isScrolled } = useScrollDirection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[var(--z-nav)] transition-colors duration-normal",
        "h-12 lg:h-[68px]",
        isScrolled ? "bg-[rgba(20,20,20,0.95)]" : "bg-transparent"
      )}
    >
      <nav className="flex items-center justify-between h-full px-[4vw]">
        {/* Logo */}
        <Link
          href="/"
          className="text-accent font-bold text-xl lg:text-2xl tracking-tight"
          aria-label="Misril.dev — Developer Portfolio"
        >
          M
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-lg">
          {profile &&
            NAV_ITEMS.map((item) => {
              const href = item.path
                ? `/${profile}/${item.path}`
                : `/${profile}`;
              const isActive =
                pathname === href ||
                (item.path && pathname.startsWith(href + "/"));

              return (
                <Link
                  key={item.label}
                  href={href}
                  className={cn(
                    "text-[length:var(--font-size-body)] font-bold tracking-[0.05em] transition-colors",
                    isActive
                      ? "text-text border-b-2 border-accent pb-0.5"
                      : "text-[#E0E0E0] hover:text-text"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
        </div>

        {/* Right section: Profile avatar + mobile burger */}
        <div className="flex items-center gap-md">
          {/* Profile Avatar */}
          {profileData && (
            <div
              className="w-8 h-8 rounded-lg"
              style={{ backgroundColor: profileData.avatarColor }}
              aria-label={`${profileData.displayName} profile`}
            />
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-text p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-12 bg-bg z-[var(--z-nav)] flex flex-col">
          <nav className="flex flex-col p-xl gap-lg">
            {profile &&
              NAV_ITEMS.map((item) => {
                const href = item.path
                  ? `/${profile}/${item.path}`
                  : `/${profile}`;
                const isActive =
                  pathname === href ||
                  (item.path && pathname.startsWith(href + "/"));

                return (
                  <Link
                    key={item.label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-[length:var(--font-size-body)] font-normal transition-colors",
                      isActive ? "text-text" : "text-text-muted hover:text-text"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>
        </div>
      )}
    </header>
  );
}
