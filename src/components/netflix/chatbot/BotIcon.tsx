"use client";

/**
 * Sleek AI bot avatar icon — used across all chatbot components.
 * A futuristic robot face with glowing eyes.
 */
export function BotIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Antenna */}
      <line x1="32" y1="4" x2="32" y2="16" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="4" r="3" fill="#E50914" />

      {/* Head */}
      <rect x="10" y="16" width="44" height="32" rx="8" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2.5" />

      {/* Eyes */}
      <circle cx="24" cy="32" r="5" fill="#E50914">
        <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="32" r="5" fill="#E50914">
        <animate attributeName="opacity" values="1;0.4;1" dur="3s" begin="0.2s" repeatCount="indefinite" />
      </circle>

      {/* Eye glint */}
      <circle cx="22" cy="30" r="1.5" fill="white" fillOpacity="0.8" />
      <circle cx="38" cy="30" r="1.5" fill="white" fillOpacity="0.8" />

      {/* Mouth — subtle smile */}
      <path d="M24 40 Q32 46 40 40" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Ears / side nodes */}
      <rect x="3" y="26" width="7" height="12" rx="3.5" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2" />
      <rect x="54" y="26" width="7" height="12" rx="3.5" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2" />

      {/* Body hint */}
      <path d="M22 48 L22 56 Q22 60 26 60 L38 60 Q42 60 42 56 L42 48" stroke="white" strokeWidth="2.5" fill="white" fillOpacity="0.08" />
    </svg>
  );
}
