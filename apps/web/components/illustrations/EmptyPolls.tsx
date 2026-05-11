export function EmptyPolls() {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto size-32 text-muted-foreground"
      aria-hidden="true"
    >
      <rect
        x="30"
        y="20"
        width="140"
        height="110"
        rx="10"
        className="fill-primary/10 stroke-border"
        strokeWidth="2"
      />
      <rect
        x="50"
        y="45"
        width="100"
        height="6"
        rx="3"
        className="fill-primary/30"
      />
      <rect
        x="50"
        y="65"
        width="80"
        height="6"
        rx="3"
        className="fill-muted-foreground/20"
      />
      <rect
        x="50"
        y="85"
        width="70"
        height="6"
        rx="3"
        className="fill-muted-foreground/20"
      />
      <path
        d="M160 120 L180 140 M180 120 L160 140"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-border"
      />
    </svg>
  );
}
