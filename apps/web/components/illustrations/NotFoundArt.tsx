export function NotFoundArt() {
  return (
    <svg
      aria-hidden="true"
      className="mx-auto size-48 text-muted-foreground"
      fill="none"
      viewBox="0 0 240 180"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className="fill-primary/10" cx="120" cy="80" r="60" />
      <circle className="fill-primary/20" cx="120" cy="80" r="40" />
      <circle className="fill-primary/30" cx="120" cy="80" r="20" />
      <line
        className="stroke-border"
        strokeLinecap="round"
        strokeWidth="3"
        x1="165"
        x2="195"
        y1="125"
        y2="155"
      />
      <circle className="fill-primary" cx="110" cy="70" r="4" />
      <circle className="fill-primary" cx="130" cy="70" r="4" />
      <path
        className="stroke-primary"
        d="M110 95 Q120 100 130 95"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}
