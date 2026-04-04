import { PROFILES, type ProfileType } from "@/lib/constants";

export default async function ProfileHomePage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;
  const profileData = PROFILES[profile as ProfileType];

  return (
    <div className="pt-[68px] px-[4vw]">
      <section className="py-3xl">
        <h1 className="text-[length:var(--font-size-display)] font-bold text-text">
          {profileData.displayName}
        </h1>
        <p className="mt-md text-[length:var(--font-size-body)] text-text-muted">
          {profileData.description}
        </p>
      </section>

      <section className="py-xl">
        <h2 className="text-[length:var(--font-size-heading)] font-bold text-text mb-lg">
          Continue Watching for {profileData.displayName}
        </h2>
        <div className="flex gap-sm overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[250px] aspect-video rounded-md bg-surface"
            />
          ))}
        </div>
      </section>

      <section className="py-xl">
        <h2 className="text-[length:var(--font-size-heading)] font-bold text-text mb-lg">
          Top Picks for {profileData.displayName}
        </h2>
        <div className="flex gap-sm overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[250px] aspect-video rounded-md bg-surface"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
