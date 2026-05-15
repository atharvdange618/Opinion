import { cn } from '@/lib/utils';

type BrandLogoProps = {
  className?: string;
  title?: string;
};

export function BrandLogo({ className, title = 'Opinion' }: BrandLogoProps) {
  return (
    <svg
      aria-label={title}
      className={cn('h-8 w-auto shrink-0 text-foreground', className)}
      fill="none"
      role="img"
      viewBox="0 0 400 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0 4)">
        <rect
          height="46"
          rx="14"
          stroke="currentColor"
          strokeWidth="3.5"
          width="64"
          x="12"
          y="14"
        />
        <path
          d="M24 48 L36 38 L46 46 L58 24 L68 38"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.5"
        />
        <circle cx="76" cy="14" fill="currentColor" r="5" />
        <text
          fill="currentColor"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="46"
          fontWeight="700"
          letterSpacing="-1.6"
          x="104"
          y="53"
        >
          Opinion
        </text>
      </g>
    </svg>
  );
}
