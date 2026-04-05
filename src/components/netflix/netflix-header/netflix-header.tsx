"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, PROFILES, PROFILE_TYPES } from "@/lib/constants";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

export function NetflixHeader() {
  const { isScrolled } = useScrollDirection();
  const pathname = usePathname();
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Clear pending state once real pathname matches
  useEffect(() => {
    if (pendingHref && pathname === pendingHref) {
      setPendingHref(null);
    }
  }, [pathname, pendingHref]);

  const profile =
    (PROFILE_TYPES as readonly string[]).find(
      (p) => pathname === `/${p}` || pathname.startsWith(`/${p}/`)
    ) ?? null;

  const profileData = profile ? PROFILES[profile as keyof typeof PROFILES] : null;

  // Hide the header entirely on the profile-selector (root) page
  if (pathname === "/") return null;

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    if (href === pathname) return;
    setPendingHref(href);
    router.push(href);
  }

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
          {/* Netflix-style red logo */}
          <Link
            href="/"
            aria-label="Home"
            className="shrink-0 flex items-center h-10"
            onClick={() => sessionStorage.removeItem("intro_seen")}
          >
            <Image
              src="/images/logo-2.png"
              alt="Misrilal Sah"
              width={160}
              height={40}
              className="h-full w-auto"
              priority
            />
          </Link>

          {/* ── Desktop nav links (hidden below md) ── */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-4 lg:gap-5 flex-1">
            {profile &&
              NAV_ITEMS.map((item) => {
                const href = item.path ? `/${profile}/${item.path}` : `/${profile}`;
                const isActive =
                  pendingHref === href ||
                  (!pendingHref && (pathname === href || (item.path && pathname.startsWith(href + "/"))));
                const isPending = pendingHref === href;
                return (
                  <a
                    key={item.label}
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={cn(
                      "text-sm font-medium transition-colors whitespace-nowrap relative pb-1",
                      isActive
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        className={cn(
                          "absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full",
                          isPending ? "opacity-60" : "animate-expand-center"
                        )}
                      />
                    )}
                  </a>
                );
              })}
          </nav>

          {/* ── Right icons ── */}
          <div className="ml-auto flex items-center gap-3 shrink-0">
            {/* Profile avatar — click to go home and select profile */}
            {profileData && (
              <Link
                href="/"
                className="flex items-center gap-1 group"
                aria-label="Switch profile"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-transparent group-hover:border-white transition-colors">
                  <Image src={profileData.avatarImage} alt={profileData.displayName} fill className="object-cover" sizes="32px" />
                </div>
              </Link>
            )}
          </div>
        </div>
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
              pendingHref === href ||
              (!pendingHref && (pathname === href || (item.path && pathname.startsWith(href + "/"))));
            return (
              <a
                key={item.label}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={cn(
                  "flex-1 flex items-center justify-center",
                  "text-[10px] font-medium transition-colors py-1",
                  isActive ? "text-white border-t-2 border-accent -mt-px" : "text-white/40"
                )}
              >
                <span className="truncate px-0.5">{item.label}</span>
              </a>
            );
          })}
        </nav>
      )}
    </>
  );
}
