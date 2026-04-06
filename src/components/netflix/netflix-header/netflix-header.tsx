"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, PROFILES, PROFILE_TYPES } from "@/lib/constants";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

export function NetflixHeader() {
  const { isScrolled } = useScrollDirection();
  const pathname = usePathname();
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Clear pending state once real pathname matches
  useEffect(() => {
    if (pendingHref && pathname === pendingHref) {
      setPendingHref(null);
    }
  }, [pathname, pendingHref]);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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
      {/* ── Top Header ── */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[var(--z-nav)]",
          "h-[68px] transition-all duration-500",
          isScrolled
            ? "bg-[rgba(20,20,20,0.97)] shadow-[0_1px_0_rgba(255,255,255,0.05)]"
            : "bg-gradient-to-b from-black/70 to-transparent"
        )}
      >
        <div className="flex items-center h-full px-3 sm:px-[4vw] gap-3 lg:gap-8">
          {/* Netflix-style red logo */}
          <Link
            href="/"
            aria-label="Home"
            className="shrink-0 flex items-center h-7 sm:h-9 md:h-10"
            onClick={() => sessionStorage.removeItem("intro_seen")}
          >
            <Image
              src="/logo.png"
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
          <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Profile avatar — click to go home and select profile */}
            {profileData && (
              <Link
                href="/"
                className="flex items-center gap-1 group"
                aria-label="Switch profile"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden relative border-2 border-transparent group-hover:border-white transition-colors">
                  <Image src={profileData.avatarImage} alt={profileData.displayName} fill className="object-cover" sizes="36px" />
                </div>
              </Link>
            )}

            {/* ── Mobile hamburger (hidden above md) ── */}
            {profile && (
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
              >
                <Menu size={22} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Slide-in Drawer (below md) ── */}
      {menuOpen && profile && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-[45] bg-black/70 backdrop-blur-sm animate-fade-in-fast"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className="md:hidden fixed inset-y-0 left-0 z-[46] w-[280px] bg-[#0d0d0d] flex flex-col shadow-2xl animate-slide-from-left"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-[68px] border-b border-white/10 shrink-0">
              <Link
                href="/"
                className="shrink-0 flex items-center h-9"
                onClick={() => { setMenuOpen(false); sessionStorage.removeItem("intro_seen"); }}
                aria-label="Home"
              >
                <Image
                  src="/logo.png"
                  alt="Misrilal Sah"
                  width={130}
                  height={33}
                  className="h-full w-auto"
                />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => {
                const href = item.path ? `/${profile}/${item.path}` : `/${profile}`;
                const isActive =
                  pendingHref === href ||
                  (!pendingHref && (pathname === href || (item.path && pathname.startsWith(href + "/"))));
                return (
                  <a
                    key={item.label}
                    href={href}
                    onClick={(e) => { handleNavClick(e, href); setMenuOpen(false); }}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-md text-[15px] font-medium transition-colors",
                      isActive
                        ? "text-white bg-white/10 border-l-2 border-accent pl-[14px]"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Profile footer */}
            {profileData && (
              <div className="px-4 py-5 border-t border-white/10 shrink-0">
                <Link
                  href="/"
                  className="flex items-center gap-3 group rounded-lg px-2 py-2 hover:bg-white/5 transition-colors"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Switch profile"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-accent/50 shrink-0">
                    <Image src={profileData.avatarImage} alt={profileData.displayName} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium truncate">{profileData.displayName}</div>
                    <div className="text-white/40 text-xs">Switch Profile</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

