import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── Font families ── */
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-jakarta)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      /* ── Colors ── */
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          elevated: 'hsl(var(--surface-elevated))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          light: 'hsl(var(--primary-light))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          border: 'hsl(var(--sidebar-border))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))'
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))'
        },
        ink: {
          DEFAULT: 'hsl(var(--ink))',
          foreground: 'hsl(var(--ink-foreground))',
          muted: 'hsl(var(--ink-muted))',
          border: 'hsl(var(--ink-border))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        overlay: 'hsl(var(--overlay))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },

      /* ── Border Radius — unified scale ── */
      borderRadius: {
        'sm': '0.375rem',    /* 6px  — subtle rounding */
        'md': '0.5rem',      /* 8px  — inputs, small elements */
        'lg': '0.75rem',     /* 12px — cards, panels */
        'xl': '1rem',        /* 16px — elevated cards */
        '2xl': '1.25rem',    /* 20px — hero cards, modals */
        '3xl': '1.5rem',     /* 24px — max rounding for surfaces */
      },

      /* ── Box Shadow — 4-level system ── */
      boxShadow: {
        'subtle':   'var(--shadow-subtle)',
        'card':     'var(--shadow-card)',
        'elevated': 'var(--shadow-elevated)',
        'overlay':  'var(--shadow-overlay)',
      },

      /* ── Spacing — semantic extensions ── */
      spacing: {
        'xs':  '0.25rem',   /* 4px  */
        'sm':  '0.5rem',    /* 8px  */
        'md':  '1rem',      /* 16px */
        'lg':  '1.5rem',    /* 24px */
        'xl':  '2rem',      /* 32px */
        '2xl': '3rem',      /* 48px */
        '3xl': '4rem',      /* 64px */
      },

      /* ── Typography — font-size scale ── */
      fontSize: {
        'display':  ['4.5rem',    { lineHeight: '1.05', fontWeight: '900', letterSpacing: '-0.03em' }],
        'h1':       ['2.75rem',   { lineHeight: '1.15', fontWeight: '800', letterSpacing: '-0.025em' }],
        'h2':       ['2rem',      { lineHeight: '1.2',  fontWeight: '700', letterSpacing: '-0.02em' }],
        'h3':       ['1.375rem',  { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.015em' }],
        'title':    ['1.0625rem', { lineHeight: '1.4',  fontWeight: '600', letterSpacing: '-0.005em' }],
        'body':     ['1rem',      { lineHeight: '1.65', fontWeight: '400' }],
        'body-sm':  ['0.875rem',  { lineHeight: '1.55', fontWeight: '400' }],
        'meta':     ['0.8125rem', { lineHeight: '1.4',  fontWeight: '500' }],
        'label':    ['0.6875rem', { lineHeight: '1.3',  fontWeight: '700', letterSpacing: '0.08em' }],
      },

      /* ── Container ── */
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },

      /* ── Transitions ── */
      transitionDuration: {
        'fast':   '150ms',
        'normal': '250ms',
        'slow':   '400ms',
      },

      /* ── Magic UI Animations ── */
      keyframes: {
        'shimmer-slide': {
          to: { transform: 'translate(calc(100cqw - 100%), 0)' },
        },
        'spin-around': {
          '0%': { transform: 'translateZ(0) rotate(0)' },
          '15%, 35%': { transform: 'translateZ(0) rotate(90deg)' },
          '65%, 85%': { transform: 'translateZ(0) rotate(270deg)' },
          '100%': { transform: 'translateZ(0) rotate(360deg)' },
        },
      },
      animation: {
        'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
