"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ProfileSelector } from "@/components/netflix/profile-selector";

const IntroAnimation = dynamic(
  () =>
    import("@/components/netflix/intro-animation/intro-animation").then(
      (mod) => mod.IntroAnimation
    ),
  { ssr: false }
);

export default function HomePage() {
  const [stage, setStage] = useState<"intro" | "profiles">("intro");

  useEffect(() => {
    // Migrate: clear legacy persistent key from earlier builds
    localStorage.removeItem("intro_seen");
    // Use sessionStorage — intro plays once per tab, resets on new tab/refresh
    if (sessionStorage.getItem("intro_seen")) {
      setStage("profiles");
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {stage === "intro" && (
        <IntroAnimation onComplete={() => setStage("profiles")} />
      )}
      {stage === "profiles" && <ProfileSelector />}
    </div>
  );
}
