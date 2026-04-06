import { createAdminClient } from "@/lib/supabase/admin";
import type { Certification } from "@/lib/types/database";
import { CertificationsClient } from "./certifications-client";

export default async function AdminCertificationsPage() {
  let certs: Certification[] = [];
  try {
    const db = createAdminClient();
    const { data } = await db.from("certifications").select("*").order("display_order");
    certs = (data as Certification[]) ?? [];
  } catch { /* no service key */ }
  return <CertificationsClient initialCerts={certs} />;
}
