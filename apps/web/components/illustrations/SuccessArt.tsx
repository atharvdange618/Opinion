export function SuccessArt() {
  return (
    <svg
      aria-hidden="true"
      className="mx-auto size-48 text-primary"
      fill="none"
      viewBox="0 0 240 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className="fill-primary/5" cx="120" cy="100" r="80" />
      <circle className="fill-primary/10" cx="120" cy="100" r="55" />
      <circle className="fill-primary/20" cx="120" cy="100" r="32" />
      <path
        className="stroke-primary"
        d="M95 100 L112 118 L148 82"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <circle className="fill-primary/30" cx="55" cy="50" r="4" />
      <circle className="fill-primary/30" cx="185" cy="65" r="3" />
      <circle className="fill-primary/20" cx="170" cy="150" r="5" />
      <circle className="fill-primary/20" cx="45" cy="140" r="3" />
      <circle className="fill-primary/30" cx="200" cy="110" r="3" />
    </svg>
  );
}
