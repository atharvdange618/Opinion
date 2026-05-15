export function EmptyPolls() {
  return (
    <svg
      aria-hidden="true"
      className="mx-auto size-32 text-muted-foreground"
      fill="none"
      viewBox="0 0 200 160"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className="fill-primary/10 stroke-border"
        height="110"
        rx="10"
        strokeWidth="2"
        width="140"
        x="30"
        y="20"
      />
      <rect className="fill-primary/30" height="6" rx="3" width="100" x="50" y="45" />
      <rect className="fill-muted-foreground/20" height="6" rx="3" width="80" x="50" y="65" />
      <rect className="fill-muted-foreground/20" height="6" rx="3" width="70" x="50" y="85" />
      <path
        className="text-border"
        d="M160 120 L180 140 M180 120 L160 140"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}
