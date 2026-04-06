import { createAdminClient } from "@/lib/supabase/admin";
import { FolderKanban, Wrench, Award, MessageSquare } from "lucide-react";

async function getStats() {
  try {
    const db = createAdminClient();
    const [projects, skills, certs, messages] = await Promise.all([
      db.from("projects").select("id", { count: "exact", head: true }),
      db.from("skills").select("id", { count: "exact", head: true }),
      db.from("certifications").select("id", { count: "exact", head: true }),
      db
        .from("contact_submissions")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
    ]);
    return {
      projects: projects.count ?? 0,
      skills: skills.count ?? 0,
      certs: certs.count ?? 0,
      unread: messages.count ?? 0,
    };
  } catch {
    return { projects: 0, skills: 0, certs: 0, unread: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Skills", value: stats.skills, icon: Wrench, href: "/admin/skills" },
    { label: "Certifications", value: stats.certs, icon: Award, href: "/admin/certifications" },
    { label: "Unread Messages", value: stats.unread, icon: MessageSquare, href: "/admin/contact" },
  ];

  return (
    <div>
      <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest mb-6">Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5 hover:border-[rgba(255,255,255,0.2)] transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <Icon size={18} className="text-[#808080]" />
              <span className="text-[#808080] text-xs font-bold uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-[#E50914] font-bold text-3xl">{value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
