# Design backlog (Fase B — pós-login polish)

Prioridade sugerida para próximas iterações. Itens derivados da auditoria de design.

## Alta prioridade

1. **Tokens vs. hardcode** — Migrar HSL literais restantes em páginas para variáveis CSS (`primary`, `accent`) em um único lugar de tuning.
2. **Contraste WCAG** — Auditar texto sobre gradientes (sidebar ativa, botões) e `muted-foreground` em corpo 14px (AA).
3. **Estados vazios** — Listas (projetos, mensagens): empty state com mensagem + CTA primário.

## Média prioridade

4. **Dark mode** — Se for requisito, revisar `.dark` em `globals.css` contra cards `ink` e dashboards.
5. **Toaster mobile** — Avaliar `top-center` em viewports pequenas para não cobrir ações fixas.
6. **Hero login** — Métricas numéricas: marcar como demo ou substituir por claims sem números se não forem verificáveis.

## Baixa prioridade / refinamento

7. **Tipografia** — Revisar `text-[3.5rem]` no hero em `lg` médio (overflow); sentence case em labels densos (settings).
8. **Sidebar nav** — Reduzir `hover:-translate-y` apenas em `lg+` ou só transição de background.
9. **PageHeader / BlurFade** — Garantir execução once no viewport ou respeitar `prefers-reduced-motion` no componente.
10. **i18n** — Centralizar copy (PT/EN) se o roadmap incluir locale.
11. **SVGs grandes** — Rodar SVGO ou reexport nos logos (~450KB) para melhorar FCP.

## Performance

12. **Imagens** — `next/image` já usado nos heróis de login/signup; considerar asset local otimizado se CDN externo for problema offline.
