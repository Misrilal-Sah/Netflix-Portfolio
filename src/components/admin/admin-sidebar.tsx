"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Award,
  Briefcase,
  User,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Home,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Homepage", path: "/admin/homepage", icon: Home },
  { label: "Projects", path: "/admin/projects", icon: FolderKanban },
  { label: "Skills", path: "/admin/skills", icon: Wrench },
  { label: "Certifications", path: "/admin/certifications", icon: Award },
  { label: "Experience", path: "/admin/experience", icon: Briefcase },
  { label: "About", path: "/admin/about", icon: User },
  { label: "Contact", path: "/admin/contact", icon: MessageSquare },
  { label: "Settings", path: "/admin/settings", icon: Settings },
] as const;

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function renderNavContent(isCompact: boolean) {
    return (
      <>
        {/* Logo */}
        <div
          className={cn(
            "flex items-center border-b border-[rgba(255,255,255,0.08)] shrink-0",
            isCompact ? "h-14 justify-center" : "px-5 h-14"
          )}
        >
          <Link
            href="/admin"
            onClick={onMobileClose}
            className="flex items-center gap-2 min-w-0"
          >
            <span className="text-[#E50914] font-bold text-2xl shrink-0">M</span>
            {!isCompact && (
              <span className="text-[#808080] text-sm font-bold tracking-widest uppercase truncate">
                Admin
              </span>
            )}
          </Link>
          {/* Mobile close button */}
          {!isCompact && (
            <button
              className="md:hidden ml-auto text-[#808080] hover:text-white transition-colors p-1 rounded"
              onClick={onMobileClose}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 py-3 space-y-0.5 overflow-y-auto",
            isCompact ? "px-2" : "px-3"
          )}
        >
          {NAV.map(({ label, path, icon: Icon }) => {
            const isActive =
              path === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(path);
            return (
              <Link
                key={path}
                href={path}
                onClick={onMobileClose}
                title={isCompact ? label : undefined}
                className={cn(
                  "flex items-center rounded-sm text-sm font-medium transition-colors",
                  isCompact
                    ? "justify-center p-2.5"
                    : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-[rgba(229,9,20,0.15)] text-[#E50914]"
                    : "text-[#808080] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                )}
              >
                <Icon size={16} className="shrink-0" />
                {!isCompact && label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "py-3 border-t border-[rgba(255,255,255,0.08)] space-y-0.5 shrink-0",
            isCompact ? "px-2" : "px-3"
          )}
        >
          <Link
            href="/recruiter"
            target="_blank"
            onClick={onMobileClose}
            title={isCompact ? "View Site" : undefined}
            className={cn(
              "flex items-center rounded-sm text-sm text-[#808080] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors",
              isCompact ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
            )}
          >
            <ExternalLink size={16} className="shrink-0" />
            {!isCompact && "View Site"}
          </Link>
          <button
            onClick={handleLogout}
            title={isCompact ? "Sign Out" : undefined}
            className={cn(
              "w-full flex items-center rounded-sm text-sm text-[#808080] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors text-left",
              isCompact ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
            )}
          >
            <LogOut size={16} className="shrink-0" />
            {!isCompact && "Sign Out"}
          </button>

          {/* Collapse toggle — desktop only */}
          <button
            onClick={onToggleCollapse}
            title={isCompact ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden md:flex w-full items-center rounded-sm text-xs text-[#808080] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors mt-1",
              isCompact ? "justify-center p-2.5" : "gap-2 px-3 py-2"
            )}
          >
            {isCompact ? (
              <ChevronRight size={15} />
            ) : (
              <>
                <ChevronLeft size={15} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          "hidden md:flex flex-shrink-0 bg-[#0a0a0a] border-r border-[rgba(255,255,255,0.08)] flex-col min-h-screen transition-[width] duration-300 ease-out",
          collapsed ? "w-[60px]" : "w-60"
        )}
      >
        {renderNavContent(collapsed)}
      </aside>

      {/* ── Mobile overlay sidebar ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-[rgba(255,255,255,0.08)] flex flex-col shadow-2xl animate-slide-from-left">
            {renderNavContent(false)}
          </aside>
        </>
      )}
    </>
  );
}

