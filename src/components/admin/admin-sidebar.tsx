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

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-[#0a0a0a] border-r border-[rgba(255,255,255,0.08)] flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[rgba(255,255,255,0.08)]">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-[#E50914] font-bold text-2xl">M</span>
          <span className="text-[#808080] text-sm font-bold tracking-widest uppercase">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ label, path, icon: Icon }) => {
          const isActive = path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);
          return (
            <Link
              key={path}
              href={path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors",
                isActive
                  ? "bg-[rgba(229,9,20,0.15)] text-[#E50914]"
                  : "text-[#808080] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[rgba(255,255,255,0.08)] space-y-0.5">
        <Link
          href="/recruiter"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-[#808080] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
        >
          <ExternalLink size={16} />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-[#808080] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors text-left"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
