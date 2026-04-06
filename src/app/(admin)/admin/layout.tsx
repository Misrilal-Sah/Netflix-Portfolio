import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToaster } from "@/components/admin/admin-toaster";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  // Login page must not be wrapped by the auth guard or admin chrome
  // (it lives inside this layout scope but has no session to check against)
  if (pathname === "/admin/login") {
    return (
      <>
        {children}
        <AdminToaster />
      </>
    );
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <>
      <AdminShell email={user.email}>{children}</AdminShell>
      <AdminToaster />
      <ConfirmDialog />
    </>
  );
}

