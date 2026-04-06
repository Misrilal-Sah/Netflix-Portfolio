"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/homepage": "Homepage",
  "/admin/projects": "Projects",
  "/admin/skills": "Skills",
  "/admin/certifications": "Certifications",
  "/admin/experience": "Experience",
  "/admin/about": "About",
  "/admin/contact": "Contact",
  "/admin/settings": "Settings",
};

interface AdminHeaderProps {
  email?: string;
  onMenuToggle?: () => void;
}

export function AdminHeader({ email, onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <header className="h-14 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded text-[#808080] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="text-white font-bold text-lg">{title}</h1>
      </div>
      {email && (
        <span className="text-[#808080] text-sm truncate max-w-[180px] md:max-w-none">{email}</span>
      )}
    </header>
  );
}

