import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg">
      <h1 className="text-[length:var(--font-size-display)] font-bold text-text mb-lg">
        Misril.dev
      </h1>
      <Link
        href="/recruiter"
        className="rounded-md bg-accent px-xl py-md text-[length:var(--font-size-body)] font-bold text-text transition-colors hover:bg-accent-hover"
      >
        Click to Enter
      </Link>
    </div>
  );
}
