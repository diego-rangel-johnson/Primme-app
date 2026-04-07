# Guia de Boas Práticas para Frontends com IA
### Baseado no guia "Designing Delightful Frontends" da OpenAI — adaptado para uso no Cursor

---

## 1. Filosofia Central

O ponto principal do guia é: **modelos de IA geram frontends muito melhores quando recebem restrições claras de design, referências visuais, narrativa estruturada e um design system definido.** Sem isso, o resultado tende a ser genérico, cheio de cards desnecessários e visualmente sem personalidade.

A ideia não é "pedir um site bonito". É dar ao modelo um briefing de design tão claro que ele não tenha espaço para inventar coisas feias.

---

## 2. As 4 Práticas Iniciais

Antes de qualquer prompt, tenha isso definido:

1. **Use raciocínio baixo/médio** — para frontend, overthinking atrapalha. No Cursor, isso significa não pedir que o modelo "pense profundamente" sobre layout. Seja direto.
2. **Defina o design system antes** — tipografia, cores, espaçamento. Não deixe o modelo escolher.
3. **Forneça referências visuais** — screenshots, mood boards, links de sites que você admira.
4. **Tenha o conteúdo real pronto** — copy real, não lorem ipsum. O conteúdo informa a estrutura.

---

## 3. Regras de Ouro para o Prompt

Estas são as regras que devem estar no seu system prompt ou arquivo de regras:

### Composição
- O primeiro viewport deve ser lido como **uma composição única**, não um dashboard.
- Full-bleed hero como padrão para landing pages.
- **Uma ideia dominante por seção** — sem competição visual.

### Cards: O Inimigo Nº 1
- **Padrão: sem cards.** Nunca use cards no hero.
- Cards só quando forem interativos (clicáveis, arrastáveis).
- Se você está usando card para agrupar texto, está fazendo errado.

### Tipografia
- Máximo **2 fontes** (uma display, uma body).
- Tipografia expressiva e com propósito — não use fontes genéricas sem motivo.
- Headlines devem carregar significado real, não ser decoração.

### Cor
- **Uma cor de destaque** (a menos que o design system exija mais).
- Hierarquia clara: background → surface → text (primary/muted).

### Motion (Animação)
Mínimo de **2-3 animações intencionais**:
- Uma sequência de entrada no hero
- Um efeito vinculado ao scroll (sticky, parallax)
- Uma transição de hover/reveal/layout

**Regras de motion:**
- Deve ser perceptível em uma gravação rápida
- Suave no mobile
- Rápida e contida (não exagerada)
- Consistente entre páginas
- Se for puramente decorativa, remova

**Biblioteca recomendada:** Framer Motion para React.

### Copy
- Linguagem de produto, não comentário sobre design.
- Texto de suporte em uma única frase.
- Sem redundância entre seções.
- Cada seção tem **uma responsabilidade**: explicar, provar, aprofundar ou converter.

---

## 4. Estrutura Narrativa para Landing Pages

O modelo performa melhor quando você define a sequência da página:

| Seção | Função |
|-------|--------|
| **Hero** | Identidade e promessa |
| **Imagem de suporte** | Contexto / ambiente |
| **Detalhe do produto** | Explicação |
| **Prova social** | Credibilidade |
| **CTA final** | Conversão |

---

## 5. Visual Thesis — O Que Definir Antes de Construir

Antes de pedir ao modelo para construir, documente:

1. **Visual Thesis** — uma frase descrevendo o mood/material/energia
   - Exemplo: *"Elegância editorial com fotos de produto em alto contraste e tipografia serif moderna"*
2. **Plano de Conteúdo** — hero, suporte, detalhe, CTA final
3. **Thesis de Interação** — 2 a 3 conceitos de motion
   - Exemplo: *"Fade-in suave no hero, parallax nas imagens, hover com scale nos cards de produto"*

---

## 6. Padrões para App UI (estilo Linear)

Para interfaces de aplicação (não landing pages):

- Hierarquia calma de superfícies
- Tipografia forte com espaçamento generoso
- Paleta de cores mínima
- Informação densa mas legível
- Chrome mínimo (pouca decoração na interface)
- Cards apenas quando interativos

---

## 7. Imagens

- Visuais reais e narrativos (não gradientes decorativos)
- Fotografia in-situ preferida sobre elementos abstratos
- Áreas tonais estáveis para overlay de texto
- Sem sinalização ou UI clutter embutidos nas imagens

---

## 8. Checklist de Qualidade (Litmus Test)

Após gerar qualquer frontend, passe por estas perguntas:

- [ ] A marca/produto é inconfundível na primeira tela?
- [ ] Existe uma âncora visual forte?
- [ ] A página pode ser entendida apenas escaneando headlines?
- [ ] Cada seção tem apenas um trabalho?
- [ ] Os cards são realmente necessários?
- [ ] A motion melhora a hierarquia?
- [ ] O design pareceria premium sem sombras decorativas?

---

## 9. Stack Técnica Recomendada

- **React** com **Tailwind CSS**
- **shadcn/ui** para componentes base
- **Framer Motion** para animações
- Patterns React modernos: `useEffectEvent`, `startTransition`, `useDeferredValue`

---

## 10. Como Configurar Isso no Cursor

O Cursor usa arquivos de regras para guiar o comportamento da IA. Existem duas formas principais:

### Opção A: Arquivo `.cursor/rules` (por projeto)

Crie na raiz do seu projeto:

```
seu-projeto/
├── .cursor/
│   └── rules
├── src/
└── ...
```

### Opção B: Rules globais (para todos os projetos)

No Cursor, vá em **Settings → Rules → User Rules** e cole as regras lá. Isso se aplica a todos os projetos.

### O que colocar no arquivo de regras

O arquivo `.cursorrules` ou `.cursor/rules` que acompanha este guia contém todas as regras prontas para uso. Mas a estrutura geral é:

1. **Identidade do projeto** — o que é, para quem
2. **Design system** — cores, fontes, espaçamento (tokens)
3. **Restrições de design** — as regras de ouro (sem cards, full-bleed hero, etc.)
4. **Stack e patterns** — React + Tailwind + Framer Motion
5. **Estrutura de conteúdo** — a narrativa da página
6. **Checklist de qualidade** — o litmus test

### Dica importante

**Quanto mais específico, melhor.** Em vez de dizer "faça um site bonito", diga:

> "Crie uma landing page com hero full-bleed usando a foto X como background, título em serif grande, subtítulo em uma linha, CTA branco com fundo preto. Sem cards. Próxima seção com prova social em texto corrido."

---

## 11. Referência Rápida de Prompt

Aqui está um template de prompt que você pode usar direto no Cursor:

```
Crie [tipo de página] para [produto/marca].

Visual Thesis: [uma frase sobre o mood]
Stack: React + Tailwind + Framer Motion + shadcn/ui

Estrutura:
1. Hero: [descrição — imagem, título, CTA]
2. Seção de suporte: [o que mostrar]
3. Detalhe: [explicação do produto]
4. Prova social: [formato]
5. CTA final: [call to action]

Regras:
- Sem cards no hero
- Máximo 2 fontes
- Uma cor de destaque: [cor]
- Full-bleed hero
- Motion: fade-in no hero, scroll-linked na seção 2, hover nos CTAs
- Mobile-first
- Copy real, não placeholder
```

---

*Guia criado a partir do blog post "Designing Delightful Frontends with GPT-5.4" da OpenAI Developers.*
*Adaptado para uso com Cursor por Claude.*
