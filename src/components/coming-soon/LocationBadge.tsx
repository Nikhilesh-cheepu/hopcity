export function LocationBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-hop-gold/20 bg-white/5 px-4 py-2 text-sm text-hop-cream/80 backdrop-blur-sm">
      <svg
        className="h-4 w-4 shrink-0 text-hop-gold"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
      <span>Sarath City Capital Mall · 5th Floor · Hyderabad</span>
    </div>
  );
}
