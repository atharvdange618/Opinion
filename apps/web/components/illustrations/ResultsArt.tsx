export function ResultsArt() {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto size-32 text-primary"
      aria-hidden="true"
    >
      <rect
        x="20"
        y="40"
        width="200"
        height="100"
        rx="8"
        className="fill-primary/5 stroke-border"
        strokeWidth="2"
      />
      <rect x="40" y="95" width="30" height="35" rx="4" className="fill-primary/40" />
      <rect x="80" y="75" width="30" height="55" rx="4" className="fill-primary/60" />
      <rect x="120" y="55" width="30" height="75" rx="4" className="fill-primary/80" />
      <rect x="160" y="85" width="30" height="45" rx="4" className="fill-primary/40" />
      <circle cx="45" cy="30" r="4" className="fill-primary/30" />
      <circle cx="195" cy="50" r="3" className="fill-primary/30" />
      <circle cx="220" cy="100" r="3" className="fill-primary/20" />
    </svg>
  );
}
