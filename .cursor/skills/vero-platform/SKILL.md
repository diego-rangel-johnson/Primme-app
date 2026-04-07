---
name: primme-platform
description: >-
  Enforces Primme platform coding standards, design system tokens, component patterns,
  and architecture conventions. Use when creating or editing any file in the project,
  reviewing code, building new pages or components, or when the user mentions
  Primme, design system, tokens, or platform conventions.
---

# Primme Platform Development Standards

## Architecture Overview

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **UI**: shadcn/ui (New York style, zinc base), Radix UI primitives
- **Styling**: Tailwind CSS 3 with semantic design tokens
- **Icons**: Lucide React
- **State**: React Context (`SessionProvider`) for auth; local `useState` per page
- **Toasts**: Sonner
- **Animation**: Motion (motion package), tailwindcss-animate

## File Structure

```
src/
  app/                   # App Router pages and layouts
    client/              # Homeowner portal
    provider/            # Service provider portal
    affiliate/           # Partner portal
  components/
    ui/                  # shadcn/ui primitives (do not edit directly)
    sidebar.tsx          # Shared sidebar navigation
    page-header.tsx      # Shared page header
    metric-card.tsx      # Shared metric display
    empty-state.tsx      # Empty state component
    status-badge.tsx     # Status badge component
    provider/            # Provider-specific components
    project/             # Project-specific components
  context/
    session-context.tsx  # Auth context provider
  lib/
    session.ts           # Session management utilities
    constants.ts         # Shared constants (ROLE_MAP, AccountType, getGreeting)
    utils.ts             # cn() helper
    design-system/       # Design system TypeScript tokens
```

## Token Rules (MANDATORY)

All visual values MUST come from the design system tokens. See `.agents/rules/design-system-rules.md` for the full contract.

### Colors - ONLY use semantic tokens

| Token | Usage |
|-------|-------|
| `background`, `foreground` | Page background, primary text |
| `card`, `card-foreground` | Card surfaces |
| `muted`, `muted-foreground` | Secondary surfaces, secondary text |
| `primary`, `primary-foreground`, `primary-light` | Brand accent (Primme orange) |
| `success`, `success-foreground` | Positive states, completed |
| `warning`, `warning-foreground` | Caution states, pending |
| `destructive`, `destructive-foreground` | Error states, danger |
| `info`, `info-foreground` | Informational states |
| `border`, `input`, `ring` | Borders, form inputs, focus rings |

**PROHIBITED**: `green-500`, `blue-600`, `amber-*`, `red-*`, `slate-*`, `neutral-*` (except `bg-black` for truly black sections), `rgba(232,80,28,...)`, `bg-[#hex]`.

### Border Radius - ONLY use the scale

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 6px | Small buttons, badges |
| `rounded-md` | 8px | Inputs, compact elements |
| `rounded-lg` | 12px | Standard cards |
| `rounded-xl` | 16px | Elevated cards, large buttons |
| `rounded-2xl` | 20px | Hero cards, modals |
| `rounded-3xl` | 24px | Maximum surfaces |

**PROHIBITED**: `rounded-[2rem]`, `rounded-[2.5rem]`, or any arbitrary bracket value.

### Shadows - ONLY use semantic tokens

| Class | Usage |
|-------|-------|
| `shadow-subtle` | Hover states, subtle separation |
| `shadow-card` | Cards at rest |
| `shadow-elevated` | Elevated cards, dropdowns |
| `shadow-overlay` | Modals, sheets, popups |

**PROHIBITED**: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` (Tailwind defaults).

### Typography

| Class | Size | Usage |
|-------|------|-------|
| `text-display font-display` | 3.5rem | Hero headings |
| `text-h1 font-display` | 2.25rem | Page titles |
| `text-h2 font-display` | 1.75rem | Section headers |
| `text-h3 font-display` | 1.25rem | Card titles |
| `text-title` | 1rem | Bold inline titles |
| `text-body` | 0.9375rem | Body text |
| `text-body-sm` | 0.8125rem | Secondary text |
| `text-meta` | 0.75rem | Timestamps |
| `text-label` | 0.625rem | Uppercase labels |

**RULE**: All headings MUST use `font-display` (Plus Jakarta Sans). Body text uses `font-sans` (Inter). The `text-h*` utilities include weight, so do NOT add `font-bold`/`font-extrabold` alongside them.

## Component Patterns

### Creating a Card

```tsx
// CORRECT - use SurfaceCard
<SurfaceCard variant="elevated" className="p-8">
  <h3 className="text-h3 font-display tracking-tight text-foreground">Title</h3>
  <p className="text-body-sm text-muted-foreground mt-2">Description</p>
</SurfaceCard>

// WRONG - raw markup with arbitrary values
<div className="bg-card rounded-[2rem] p-8 shadow-sm border border-border/40">...</div>
```

### Loading State

```tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner";

if (isLoading || !user) {
  return <LoadingSpinner />;
}
```

### Session & Auth

```tsx
import { useSession } from "@/context/session-context";

const { user, isLoading, login, logout } = useSession();
```

### Shared Constants

```tsx
import { type AccountType, ROLE_MAP, ACCOUNT_TYPES, getGreeting } from "@/lib/constants";
import { getRoleDashboard } from "@/lib/session";
```

### Images

Use `next/image` for critical above-the-fold images:

```tsx
import Image from "next/image";
<Image src={url} alt="Description" fill className="object-cover" sizes="100vw" priority />
```

### Type Imports

Always use named imports for React types:

```tsx
import { type ReactNode } from "react";
// NOT: React.ReactNode
```

## Page Construction Workflow

Before creating or editing any page:

1. Check existing tokens - do not create new ones
2. Check existing components - reuse before creating
3. Define layout hierarchy using existing shells
4. Compose with components: `PageHeader`, `SurfaceCard`, `MetricCard`, `StatCard`
5. Apply spacing from the scale (xs through 3xl)
6. Apply typography from the scale (text-h1 through text-label)
7. Add visual states (hover, active, disabled, loading)
8. Add subtle microinteractions using motion tokens
9. Verify accessibility (semantic HTML, focus, contrast, ARIA)
10. Compare with other screens for consistency

## Anti-Patterns (NEVER DO)

- Arbitrary Tailwind colors outside tokens
- Arbitrary border-radius bracket values
- Default Tailwind shadow classes
- `<img>` for above-the-fold images (use `next/image`)
- `React.ReactNode` (use named import `ReactNode`)
- Duplicate code - extract to shared constants/components
- `console.log`/`console.error` without environment gate
- Page files exceeding 300 lines of inline markup
- Missing `aria-label` on icon-only buttons
- Missing `alt` on images

## Pre-Commit Checklist

- [ ] Only semantic color tokens used
- [ ] Only scale-based radius values
- [ ] Only semantic shadow tokens
- [ ] Typography follows the scale with `font-display` on headings
- [ ] Cards use `SurfaceCard` component
- [ ] No duplicate patterns - extracted to shared code
- [ ] Loading states use `LoadingSpinner`
- [ ] Accessibility: semantic HTML, ARIA labels, keyboard support
- [ ] No `console.*` without dev-mode gate
- [ ] `next/image` for critical images
