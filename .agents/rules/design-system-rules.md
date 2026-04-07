---
description: Primme Platform — Design System Rules & Visual Language Contract
---

# Primme Design System — Master Rules

> Estas regras devem ser seguidas por qualquer agente ou desenvolvedor que toque na UI do projeto.
> O objetivo é consistência, premium feel e escalabilidade.

---

## 1. Identidade Visual

A linguagem visual da Primme é:

- **Premium** — alto padrão, sem aparência de template
- **Editorial** — tipografia forte, hierarquia clara, whitespace generoso
- **Minimalista** — poucos elementos, cada um com propósito
- **Silenciosa** — contraste controlado, sem poluição visual
- **Consistente** — mesma linguagem em todas as telas

### O que EVITAR:
- Estética startup colorida/infantil
- Gradientes exagerados
- Excesso de pills, bordas, cores
- Cards inconsistentes entre telas
- Visual de template genérico ou "UI de IA"
- Múltiplas cores de destaque na mesma tela

---

## 2. Token Contract

Todos os valores visuais devem vir dos tokens definidos em:
- `src/app/globals.css` (CSS custom properties)
- `tailwind.config.ts` (Tailwind mappings)
- `src/lib/design-system/tokens.ts` (TypeScript constants)

### Cores
| Token | Uso |
|-------|-----|
| `background` | Fundo geral da página |
| `surface` | Áreas de conteúdo secundárias |
| `surface-elevated` | Cards, modais, painéis elevados |
| `foreground` | Texto principal |
| `muted-foreground` | Texto secundário, metadados |
| `primary` | Cor de destaque única dominante (laranja Primme) |
| `border` | Bordas sutis - usar com opacidade (border/40, border/50) |
| `overlay` | Backdrops de modais |
| `success` / `warning` / `destructive` / `info` | Apenas para estados semânticos |

**REGRA**: Não inventar novas cores. Não usar cores Tailwind arbitrárias (red-500, blue-600, etc.) fora dos tokens.

### Radius
| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-sm` | 6px | Botões pequenos, badges |
| `rounded-md` | 8px | Inputs, elementos compactos |
| `rounded-lg` | 12px | Cards padrão, painéis |
| `rounded-xl` | 16px | Cards elevados, botões grandes |
| `rounded-2xl` | 20px | Hero cards, modais |
| `rounded-3xl` | 24px | Superfícies máximas |

**REGRA**: Não usar valores arbitrários (`rounded-[2rem]`, `rounded-[2.5rem]`). Usar apenas a escala definida.

### Shadows
| Token | Uso |
|-------|-----|
| `shadow-subtle` | Hover states, separação sutil |
| `shadow-card` | Cards em repouso |
| `shadow-elevated` | Cards elevados, dropdowns |
| `shadow-overlay` | Modais, sheets, popups |

**REGRA**: Não usar `shadow-sm`, `shadow-md`, `shadow-lg` do Tailwind default. Usar os tokens semânticos.

### Spacing
| Token | Valor | Uso típico |
|-------|-------|------------|
| `xs` | 4px | Gaps mínimos entre ícone e texto |
| `sm` | 8px | Padding interno compacto |
| `md` | 16px | Padding padrão, gaps entre elementos |
| `lg` | 24px | Padding de cards, seções |
| `xl` | 32px | Separação entre seções |
| `2xl` | 48px | Margin entre blocos grandes |
| `3xl` | 64px | Margin entre seções de página |

### Typography
| Classe | Tamanho | Uso |
|--------|---------|-----|
| `text-display` / `font-display` | 3.5rem | Hero headings, números grandes |
| `text-h1` / `font-display` | 2.25rem | Títulos de página |
| `text-h2` / `font-display` | 1.75rem | Títulos de seção |
| `text-h3` / `font-display` | 1.25rem | Títulos de card |
| `text-title` | 1rem | Títulos inline bold |
| `text-body` | 0.9375rem | Texto corrido padrão |
| `text-body-sm` | 0.8125rem | Texto secundário |
| `text-meta` | 0.75rem | Timestamps, info auxiliar |
| `text-label` | 0.625rem | Labels uppercase (PRIMME SUPPLIER, STATUS, etc) |

**REGRA**: Headings (display, h1, h2, h3) DEVEM usar `font-display` (Outfit). Body text usa `font-sans` (Inter).

---

## 3. Componentes — Regras de Composição

### Hierarquia de arquivos
```
components/
  ui/          → shadcn/ui primitives (não editados diretamente)
  layout/      → AppShell, Sidebar, Topbar, PageHeader
  shared/      → StatusBadge, MetricCard, EmptyState, SurfaceCard
  dashboard/   → componentes específicos de dashboard
  projects/    → ProjectCard, ProjectHero, etc.
  profile/     → ProfileHeader, etc.
```

### Regras de componentização
1. **Não duplicar markup** — se dois cards parecem iguais, extrair para um componente
2. **Não inline styles** — variantes devem usar `cva` (class-variance-authority)
3. **Props typed** — todas as props devem ter interface TypeScript
4. **Composição > herança** — compor com children e slots, não com mega-props
5. **Páginas limpas** — o TSX da página deve ser composicional (montar blocos), não conter markup raw extenso

### Padrão de Card (SurfaceCard)
```tsx
// CORRETO
<SurfaceCard variant="elevated" padding="lg">
  <SectionHeader title="..." />
  <Content />
</SurfaceCard>

// ERRADO
<div className="bg-card rounded-[2rem] p-8 shadow-sm border border-border/40">
  ...
</div>
```

---

## 4. Workflow de Construção de Páginas

Antes de criar ou refatorar qualquer tela, siga esta ordem:

1. **Verificar tokens existentes** — não criar novos sem necessidade
2. **Verificar componentes existentes** — reutilizar antes de criar
3. **Definir hierarquia do layout** — shells, seções, grids
4. **Compor com componentes** — PageHeader, SurfaceCard, MetricCard, etc.
5. **Aplicar spacing** — usando a escala definida
6. **Aplicar tipografia** — usando a escala definida
7. **Aplicar estados visuais** — hover, active, disabled, loading
8. **Adicionar microinterações** — sutis, usando tokens de `motion`
9. **Revisar acessibilidade** — semântica HTML, foco, contraste
10. **Revisar consistência** — comparar com outras telas do app

---

## 5. Microinterações

Diretrizes para animações:
- **Hover em cards**: `hover:-translate-y-0.5` + transição em shadow (subtle → elevated)
- **Hover em botões**: scale(0.98) no active, shadow change no hover
- **Transições**: usar `duration-fast` (150ms), `duration-normal` (250ms) ou `duration-slow` (400ms)
- **Motion (framer)**: usar presets de `tokens.ts` → `motion.fadeIn`, `motion.cardHover`, `motion.stagger`
- **PROIBIDO**: animações espalhafatosas, bounce, shake, rotações exageradas

---

## 6. Acessibilidade

Manter sempre:
- `<button>` para ações, `<a>` para navegação
- `<nav>`, `<header>`, `<main>`, `<section>`, `<aside>` semânticos
- `aria-label` em botões de ícone
- `:focus-visible` com ring visível (já configurado em globals.css)
- Contraste mínimo 4.5:1 para texto
- Um único `<h1>` por página, hierarquia descendente

---

## 7. Proibições Absolutas

❌ Nunca usar cores Tailwind arbitrárias sem estar nos tokens
❌ Nunca usar `rounded-[Xrem]` — usar a escala de radius
❌ Nunca usar `shadow-sm/md/lg/xl` do Tailwind default — usar tokens semânticos
❌ Nunca criar componente novo sem verificar se já existe similar
❌ Nunca fazer arquivo de página com >300 linhas de markup inline
❌ Nunca introduzir nova font family sem aprovação
❌ Nunca usar `style={{}}` inline sem motivo forte
❌ Nunca criar UI genérica de SaaS
❌ Nunca usar gradientes em mais de 1 elemento por seção
❌ Nunca duplicar pattern visual — extrair para componente

---

## 8. Checklist de Review

Antes de considerar uma tela "pronta", verificar:

- [ ] Usa apenas tokens de cor definidos
- [ ] Usa apenas radius da escala
- [ ] Usa apenas shadows semânticas
- [ ] Spacing segue a escala
- [ ] Typography segue a escala
- [ ] Headings usam `font-display` (Outfit)
- [ ] Cards usam componente reutilizável
- [ ] Markup da página é composicional (não inline)
- [ ] Hover states são sutis e consistentes
- [ ] HTML é semântico
- [ ] Foco por teclado funciona
- [ ] Contraste adequado
- [ ] Visual é consistente com as demais telas
