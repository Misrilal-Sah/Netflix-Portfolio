"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProfileType } from "@/lib/constants";
import { PROFILES } from "@/lib/constants";

interface ProfileAvatarProps {
  profile: ProfileType;
  onClick: (profile: ProfileType) => void;
}

export function ProfileAvatar({ profile, onClick }: ProfileAvatarProps) {
  const data = PROFILES[profile];

  return (
    <motion.button
      onClick={() => onClick(profile)}
      className="flex flex-col items-center gap-sm group"
      aria-label={`Select ${data.displayName} profile`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <div
        className={cn(
          "w-[84px] h-[84px] lg:w-[120px] lg:h-[120px]",
          "rounded-lg overflow-hidden relative",
          "border-2 border-transparent group-hover:border-white",
          "transition-colors duration-200"
        )}
      >
        <Image
          src={data.avatarImage}
          alt={data.displayName}
          fill
          className="object-cover"
          sizes="120px"
        />
      </div>
      <span className="text-[length:var(--font-size-body)] text-text-muted group-hover:text-text transition-colors font-medium">
        {data.displayName}
      </span>
    </motion.button>
  );
}
