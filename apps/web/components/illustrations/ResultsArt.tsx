export function ResultsArt() {
  return (
    <svg
      aria-hidden="true"
      className="mx-auto size-32 text-primary"
      fill="none"
      viewBox="0 0 240 180"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className="fill-primary/5 stroke-border"
        height="100"
        rx="8"
        strokeWidth="2"
        width="200"
        x="20"
        y="40"
      />
      <rect className="fill-primary/40" height="35" rx="4" width="30" x="40" y="95" />
      <rect className="fill-primary/60" height="55" rx="4" width="30" x="80" y="75" />
      <rect className="fill-primary/80" height="75" rx="4" width="30" x="120" y="55" />
      <rect className="fill-primary/40" height="45" rx="4" width="30" x="160" y="85" />
      <circle className="fill-primary/30" cx="45" cy="30" r="4" />
      <circle className="fill-primary/30" cx="195" cy="50" r="3" />
      <circle className="fill-primary/20" cx="220" cy="100" r="3" />
    </svg>
  );
}
