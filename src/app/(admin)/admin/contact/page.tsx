import { createAdminClient } from "@/lib/supabase/admin";
import type { ContactSubmission } from "@/lib/types/database";
import { getContactInfoData } from "@/lib/data";
import { ContactSubmissionsClient } from "./contact-client";

export default async function AdminContactPage() {
  let submissions: ContactSubmission[] = [];
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    submissions = (data as ContactSubmission[]) ?? [];
  } catch { /* no service key */ }

  const contactInfo = await getContactInfoData();

  return <ContactSubmissionsClient initialSubmissions={submissions} initialContactInfo={contactInfo} />;
}

