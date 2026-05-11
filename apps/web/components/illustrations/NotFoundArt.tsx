export function NotFoundArt() {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto size-48 text-muted-foreground"
      aria-hidden="true"
    >
      <circle cx="120" cy="80" r="60" className="fill-primary/10" />
      <circle cx="120" cy="80" r="40" className="fill-primary/20" />
      <circle cx="120" cy="80" r="20" className="fill-primary/30" />
      <line
        x1="165"
        y1="125"
        x2="195"
        y2="155"
        className="stroke-border"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="110" cy="70" r="4" className="fill-primary" />
      <circle cx="130" cy="70" r="4" className="fill-primary" />
      <path
        d="M110 95 Q120 100 130 95"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
