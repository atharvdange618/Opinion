export function SuccessArt() {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto size-48 text-primary"
      aria-hidden="true"
    >
      <circle cx="120" cy="100" r="80" className="fill-primary/5" />
      <circle cx="120" cy="100" r="55" className="fill-primary/10" />
      <circle cx="120" cy="100" r="32" className="fill-primary/20" />
      <path
        d="M95 100 L112 118 L148 82"
        className="stroke-primary"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="55" cy="50" r="4" className="fill-primary/30" />
      <circle cx="185" cy="65" r="3" className="fill-primary/30" />
      <circle cx="170" cy="150" r="5" className="fill-primary/20" />
      <circle cx="45" cy="140" r="3" className="fill-primary/20" />
      <circle cx="200" cy="110" r="3" className="fill-primary/30" />
    </svg>
  );
}
