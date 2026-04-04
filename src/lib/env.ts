import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().min(1),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
});

const processEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY:
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "",
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://misril.dev",
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "ddrlxvnsh",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  BREVO_API_KEY: process.env.BREVO_API_KEY ?? "",
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY ?? "",
};

const publicEnv = publicSchema.parse(processEnv);
const serverEnv =
  typeof window === "undefined" ? serverSchema.parse(processEnv) : {};

export const env = { ...publicEnv, ...serverEnv } as z.infer<
  typeof publicSchema
> &
  z.infer<typeof serverSchema>;
