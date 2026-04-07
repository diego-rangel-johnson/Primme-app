/**
 * Primme Design System — TypeScript Token Constants
 *
 * Mirrors CSS custom properties from globals.css.
 * Use these for JS-driven styling, motion configs, and conditional logic.
 */

// ── Spacing ──────────────────────────────────────────────────
export const spacing = {
  xs:  '0.25rem',   // 4px
  sm:  '0.5rem',    // 8px
  md:  '1rem',      // 16px
  lg:  '1.5rem',    // 24px
  xl:  '2rem',      // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

// ── Border Radius ────────────────────────────────────────────
export const radius = {
  sm:  '0.375rem',  // 6px
  md:  '0.5rem',    // 8px
  lg:  '0.75rem',   // 12px
  xl:  '1rem',      // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
} as const;

// ── Shadows ──────────────────────────────────────────────────
export const shadows = {
  subtle:   '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  card:     '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
  elevated: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
  overlay:  '0 10px 25px -3px rgb(0 0 0 / 0.08), 0 4px 10px -4px rgb(0 0 0 / 0.04)',
} as const;

// ── Typography Scale ─────────────────────────────────────────
export const typography = {
  display:  { size: '3.5rem',    lineHeight: '1.1',  weight: 800, tracking: '-0.025em' },
  h1:       { size: '2.25rem',   lineHeight: '1.2',  weight: 800, tracking: '-0.02em' },
  h2:       { size: '1.75rem',   lineHeight: '1.25', weight: 700, tracking: '-0.015em' },
  h3:       { size: '1.25rem',   lineHeight: '1.3',  weight: 700, tracking: '-0.01em' },
  title:    { size: '1rem',      lineHeight: '1.4',  weight: 600, tracking: '-0.005em' },
  body:     { size: '0.9375rem', lineHeight: '1.6',  weight: 400, tracking: '0' },
  bodySm:   { size: '0.8125rem', lineHeight: '1.5',  weight: 400, tracking: '0' },
  meta:     { size: '0.75rem',   lineHeight: '1.4',  weight: 500, tracking: '0' },
  label:    { size: '0.625rem',  lineHeight: '1.3',  weight: 800, tracking: '0.1em' },
} as const;

// ── Motion / Animation Presets ───────────────────────────────
export const motion = {
  /** Subtle hover lift for cards */
  cardHover: {
    y: -2,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  /** Fade-in on mount */
  fadeIn: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  /** Stagger children */
  stagger: {
    animate: { transition: { staggerChildren: 0.08 } },
  },
  /** Transition presets */
  duration: {
    fast:   0.15,
    normal: 0.25,
    slow:   0.4,
  },
  /** Standard easing */
  ease: {
    default: [0.25, 0.46, 0.45, 0.94] as const,
    out:     [0.0, 0.0, 0.2, 1.0] as const,
    in:      [0.4, 0.0, 1.0, 1.0] as const,
  },
} as const;

// ── Color Semantic Keys ──────────────────────────────────────
// These are CSS variable references — use with hsl() in inline styles
export const colors = {
  background:       'hsl(var(--background))',
  foreground:       'hsl(var(--foreground))',
  surface:          'hsl(var(--surface))',
  surfaceElevated:  'hsl(var(--surface-elevated))',
  card:             'hsl(var(--card))',
  primary:          'hsl(var(--primary))',
  primaryLight:     'hsl(var(--primary-light))',
  muted:            'hsl(var(--muted))',
  mutedForeground:  'hsl(var(--muted-foreground))',
  border:           'hsl(var(--border))',
  accent:           'hsl(var(--accent))',
  success:          'hsl(var(--success))',
  warning:          'hsl(var(--warning))',
  destructive:      'hsl(var(--destructive))',
  info:             'hsl(var(--info))',
  overlay:          'hsl(var(--overlay))',
} as const;
