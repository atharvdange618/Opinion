import { cn } from '@/lib/utils';

type BrandLogoProps = {
  className?: string;
  title?: string;
};

export function BrandLogo({ className, title = 'Opinion' }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 400 80"
      role="img"
      aria-label={title}
      className={cn('h-8 w-auto shrink-0 text-foreground', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <g transform="translate(0 4)">
        <rect
          x="12"
          y="14"
          width="64"
          height="46"
          rx="14"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          d="M24 48 L36 38 L46 46 L58 24 L68 38"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="76" cy="14" r="5" fill="currentColor" />
        <text
          x="104"
          y="53"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="46"
          fontWeight="700"
          letterSpacing="-1.6"
          fill="currentColor"
        >
          Opinion
        </text>
      </g>
    </svg>
  );
}
