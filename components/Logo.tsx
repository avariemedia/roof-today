export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="Roof Today logo">
        <path
          d="M2 18 L16 4 L30 18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 16 L6 28 L26 28 L26 16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="22" r="2.5" fill="#10B85A" />
      </svg>
      <span className="font-extrabold tracking-tight text-[1.05rem]">
        Roof<span className="text-go-500">Today</span>
      </span>
    </div>
  );
}
