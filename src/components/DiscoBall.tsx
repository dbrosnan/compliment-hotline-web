export default function DiscoBall() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full animate-spin12">
      <defs>
        <radialGradient id="dbGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FCE8C8" />
          <stop offset="40%" stopColor="#E94BD6" />
          <stop offset="100%" stopColor="#2D1B5E" />
        </radialGradient>
        <pattern id="facets" patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill="url(#dbGrad)" />
          <path d="M0 0 L10 10 M10 0 L0 10" stroke="#0B0820" strokeWidth="0.6" opacity="0.5" />
        </pattern>
      </defs>
      <circle cx="50" cy="50" r="42" fill="url(#facets)" stroke="#FCE8C8" strokeWidth="1" opacity="0.95" />
      <circle cx="38" cy="36" r="8" fill="#FCE8C8" opacity="0.35" />
      {/* hanger */}
      <line x1="50" y1="8" x2="50" y2="0" stroke="#FCE8C8" strokeWidth="1.5" />
    </svg>
  );
}
