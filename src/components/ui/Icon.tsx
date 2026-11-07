import React from 'react';

/**
 * Inline icon set — dependency-free, inherits `currentColor`.
 *
 * WHY SVG AND NOT EMOJI: the previous UI used emoji (📖, 📚, 🔒) as functional
 * icons; emoji render differently per OS, are announced verbosely by screen
 * readers and cannot inherit the palette. These 20×20 stroked glyphs are
 * decorative (`aria-hidden`) because every icon here sits next to a word that
 * already names the thing.
 */
export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'check'
  | 'close'
  | 'book'
  | 'note'
  | 'rule'
  | 'example'
  | 'vocab'
  | 'activity'
  | 'exam'
  | 'review'
  | 'lock'
  | 'clock'
  | 'steps'
  | 'target'
  | 'home'
  | 'chevron';

const PATHS: Record<IconName, React.ReactNode> = {
  // RTL-aware arrows are handled by the CSS (`[dir=rtl] .icon-flip`).
  'arrow-left': <path d="M13 4 7 10l6 6" />,
  'arrow-right': <path d="M7 4l6 6-6 6" />,
  check: <path d="M4 10.5l4 4 8-9" />,
  close: <path d="M5 5l10 10M15 5L5 15" />,
  book: (
    <>
      <path d="M3 4.5h5.2a2 2 0 0 1 1.8 1.1 2 2 0 0 1 1.8-1.1H17v11h-5.2a2 2 0 0 0-1.8 1.1 2 2 0 0 0-1.8-1.1H3z" />
      <path d="M10 5.6v11" />
    </>
  ),
  note: (
    <>
      <path d="M4 4h9l3 3v9H4z" />
      <path d="M7 9h6M7 12.5h4" />
    </>
  ),
  rule: (
    <>
      <path d="M4 5h12M4 10h12M4 15h7" />
    </>
  ),
  example: (
    <>
      <path d="M6 5c-1.6.8-2.5 2-2.5 3.4 0 1 .7 1.8 1.7 1.8S7 9.5 7 8.6 6.4 7.2 5.6 7" />
      <path d="M14 5c-1.6.8-2.5 2-2.5 3.4 0 1 .7 1.8 1.7 1.8S15 9.5 15 8.6 14.4 7.2 13.6 7" />
      <path d="M4 13.5h12" />
    </>
  ),
  vocab: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H16v14H6.5A2.5 2.5 0 0 0 4 19.5z" />
      <path d="M8 7h5M8 10.5h5" />
    </>
  ),
  activity: (
    <>
      <path d="M4 10.5l2.6 2.6L12 7.8" />
      <path d="M10.5 4h5.5M10.5 9h5.5M10.5 14h5.5" />
    </>
  ),
  exam: (
    <>
      <path d="M5 3.5h7l3 3V17H5z" />
      <path d="M8 9h4M8 12.5h4" />
    </>
  ),
  review: (
    <>
      <path d="M15.5 6.5A6 6 0 1 0 16 11" />
      <path d="M16 3v4h-4" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="8.5" width="11" height="8" rx="2" />
      <path d="M7 8.5V6.8a3 3 0 0 1 6 0v1.7" />
    </>
  ),
  clock: (
    <>
      <circle cx="10" cy="10" r="6.5" />
      <path d="M10 6.5V10l2.5 1.6" />
    </>
  ),
  steps: (
    <>
      <path d="M4 15.5h3.5V12h3.5V8.5h3.5V5H18" />
    </>
  ),
  target: (
    <>
      <circle cx="10" cy="10" r="6.5" />
      <circle cx="10" cy="10" r="2.6" />
    </>
  ),
  home: (
    <>
      <path d="M4 9.5l6-5.5 6 5.5" />
      <path d="M6 9v7h8V9" />
    </>
  ),
  chevron: <path d="M7 8.5l3 3 3-3" />,
};

export interface IconProps {
  name: IconName;
  className?: string;
  /** Directional icons are mirrored automatically in RTL by CSS. */
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 20 }) => (
  <svg
    className={`icon ${className}`.trim()}
    viewBox="0 0 20 20"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {PATHS[name]}
  </svg>
);

export default Icon;
