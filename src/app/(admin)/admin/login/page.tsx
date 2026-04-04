import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginClient } from "./login-client";

export default async function LoginPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/admin");

  return <LoginClient />;
}
