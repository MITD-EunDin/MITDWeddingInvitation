import type { SVGProps } from 'react';

export function DoubleHappinessIcon({ className = 'w-8 h-8 text-primary', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Cách điệu chữ Song Hỷ 囍 */}
      <rect x="8" y="10" width="36" height="7" rx="3" />
      <rect x="56" y="10" width="36" height="7" rx="3" />
      <rect x="8" y="24" width="36" height="6" rx="2" />
      <rect x="56" y="24" width="36" height="6" rx="2" />
      <rect x="23" y="14" width="6" height="30" rx="2" />
      <rect x="71" y="14" width="6" height="30" rx="2" />
      <path d="M10 40h32v18H10z" fill="none" stroke="currentColor" strokeWidth="6" rx="3" />
      <path d="M58 40h32v18H58z" fill="none" stroke="currentColor" strokeWidth="6" rx="3" />
      <rect x="6" y="62" width="88" height="6" rx="3" />
      <path d="M10 74h32v18H10z" fill="none" stroke="currentColor" strokeWidth="6" rx="3" />
      <path d="M58 74h32v18H58z" fill="none" stroke="currentColor" strokeWidth="6" rx="3" />
      <rect x="23" y="65" width="6" height="28" rx="2" />
      <rect x="71" y="65" width="6" height="28" rx="2" />
    </svg>
  );
}

export function FloralDivider({ className = 'w-48 h-6 text-primary mx-auto my-4', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 240 24"
      fill="none"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2 12h80c10 0 15-7 25-7s13 7 13 7-3-7 7-7 15 7 25 7h80"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="120" cy="12" r="3" fill="currentColor" />
      <circle cx="106" cy="12" r="1.5" fill="currentColor" />
      <circle cx="134" cy="12" r="1.5" fill="currentColor" />
      <path
        d="M112 7c2-3 8-3 8 0M128 7c-2-3-8-3-8 0"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M112 17c2 3 8 3 8 0M128 17c-2 3-8 3-8 0"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FloralCorner({
  className = 'w-10 h-10 text-primary/40',
  position = 'top-left',
  ...props
}: SVGProps<SVGSVGElement> & { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const transform = {
    'top-left': '',
    'top-right': 'scale(-1, 1)',
    'bottom-left': 'scale(1, -1)',
    'bottom-right': 'scale(-1, -1)',
  }[position];

  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      stroke="currentColor"
      className={className}
      style={{ transform }}
      aria-hidden="true"
      {...props}
    >
      <path d="M4 46V14C4 8.477 8.477 4 14 4H46" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 42V18C10 13.582 13.582 10 18 10H42" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" />
      <circle cx="4" cy="4" r="2" fill="currentColor" />
      <path d="M14 14c4 4 10 4 14 0M14 14c4-4 4-10 0-14M14 14c0 6-6 12-12 12" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="20" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function WeddingRingsIcon({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true" {...props}>
      <circle cx="9" cy="14" r="5.5" strokeWidth="1.8" />
      <circle cx="15" cy="14" r="5.5" strokeWidth="1.8" />
      <path d="M15 8.5L16.5 6L18 8.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 4.5V6" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16.5" cy="4.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function CalendarHeartIcon({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="17" rx="3" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 9h18" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M12 16.5l-2.4-2.2a1.8 1.8 0 0 1 2.4-2.7 1.8 1.8 0 0 1 2.4 2.7z"
        fill="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClockIcon({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      <path d="M12 7v5l3.5 2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MapPinIcon({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true" {...props}>
      <path
        d="M12 21s-7-6.5-7-11.5a7 7 0 1 1 14 0C19 14.5 12 21 12 21z"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.5" strokeWidth="1.8" />
    </svg>
  );
}

export function HeartIcon({ filled = false, className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MusicIcon({ isPlaying = true, className = 'w-5 h-5', ...props }: SVGProps<SVGSVGElement> & { isPlaying?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.6" />
      {isPlaying ? (
        <path d="M12 6v6m4-3l-4 1" strokeWidth="1.6" strokeLinecap="round" />
      ) : (
        <path d="M4 4l16 16" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function CopyIcon({ className = 'w-4 h-4', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true" {...props}>
      <rect x="8" y="8" width="13" height="13" rx="2" strokeWidth="1.8" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ className = 'w-4 h-4', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true" {...props}>
      <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparklesIcon({ className = 'w-5 h-5', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M12 2l1.8 5.7L19.5 9.5l-5.7 1.8L12 17l-1.8-5.7L4.5 9.5l5.7-1.8L12 2zM19 16l.9 2.8 2.8.9-2.8.9-.9 2.8-.9-2.8-2.8-.9 2.8-.9.9-2.8z" />
    </svg>
  );
}

export function EnvelopeIcon({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.8" />
      <path d="M3 7l9 6 9-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GiftBoxIcon({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true" {...props}>
      <rect x="3" y="8" width="18" height="13" rx="2" strokeWidth="1.8" />
      <path d="M12 8v13M3 13h18" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 8c-2.5 0-4-2-4-3.5a2 2 0 1 1 4 1.5c0-.5 2-1.5 4-1.5a2 2 0 1 1-4 3.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BookHeartIcon({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="1.8" />
      <path
        d="M12 11.5l-1.5-1.4a1.2 1.2 0 0 1 1.5-1.8 1.2 1.2 0 0 1 1.5 1.8z"
        fill="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
