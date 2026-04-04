interface AdminHeaderProps {
  title: string;
  email?: string;
}

export function AdminHeader({ title, email }: AdminHeaderProps) {
  return (
    <header className="h-14 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-white font-bold text-lg">{title}</h1>
      {email && (
        <span className="text-[#808080] text-sm">{email}</span>
      )}
    </header>
  );
}
