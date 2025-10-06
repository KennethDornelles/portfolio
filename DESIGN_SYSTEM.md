# 🎨 Design System - Arquitetura SCSS

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Paleta de Cores](#paleta-de-cores)
3. [Tipografia](#tipografia)
4. [Espaçamentos](#espaçamentos)
5. [Breakpoints](#breakpoints)
6. [Estrutura de Arquivos SCSS](#estrutura-de-arquivos-scss)
7. [Componentes Visuais](#componentes-visuais)
8. [Temas (Light/Dark)](#temas-lightdark)
9. [Mixins e Utilitários](#mixins-e-utilitários)
10. [Integração com Angular](#integração-com-angular)

---

## 🎯 Visão Geral

Este Design System é baseado no portfólio React atual e utiliza uma arquitetura SCSS modular e escalável, preparada para migração para Angular 19+. O sistema mantém a identidade visual atual enquanto adiciona estrutura e organização profissional.

### Princípios do Design System:
- ✅ **Consistência**: Componentes e estilos reutilizáveis
- ✅ **Acessibilidade**: Suporte WCAG 2.1 AA
- ✅ **Responsividade**: Mobile-first approach
- ✅ **Temas**: Suporte a Light e Dark mode
- ✅ **Escalabilidade**: Fácil manutenção e extensão
- ✅ **Performance**: CSS otimizado e minimal

---

## 🎨 Paleta de Cores

### Cores Primárias
```scss
// _variables.scss
$color-primary-50: #eff6ff;
$color-primary-100: #dbeafe;
$color-primary-200: #bfdbfe;
$color-primary-300: #93c5fd;
$color-primary-400: #60a5fa;
$color-primary-500: #3b82f6;  // Primary DEFAULT
$color-primary-600: #2563eb;
$color-primary-700: #1d4ed8;
$color-primary-800: #1e40af;
$color-primary-900: #1e3a8a;

// Atalhos
$primary: $color-primary-500;
$primary-light: $color-primary-400;
$primary-dark: $color-primary-700;
```

### Cores Secundárias (Roxo/Purple)
```scss
$color-secondary-50: #faf5ff;
$color-secondary-100: #f3e8ff;
$color-secondary-200: #e9d5ff;
$color-secondary-300: #d8b4fe;
$color-secondary-400: #c084fc;
$color-secondary-500: #a855f7;
$color-secondary-600: #9333ea;
$color-secondary-700: #7e22ce;
$color-secondary-800: #6b21a8;
$color-secondary-900: #581c87;

$secondary: $color-secondary-600;
```

### Cores Neutras (Grays)
```scss
// Light Mode
$color-gray-50: #f9fafb;
$color-gray-100: #f3f4f6;
$color-gray-200: #e5e7eb;
$color-gray-300: #d1d5db;
$color-gray-400: #9ca3af;
$color-gray-500: #6b7280;
$color-gray-600: #4b5563;
$color-gray-700: #374151;
$color-gray-800: #1f2937;
$color-gray-900: #111827;

// Dark Mode
$color-dark-bg: #121212;
$color-dark-card: #1e1e1e;
$color-dark-text: #e5e7eb;
$color-dark-border: #2d2d2d;
```

### Cores Semânticas
```scss
// Success
$color-success-light: #10b981;
$color-success: #059669;
$color-success-dark: #047857;

// Error
$color-error-light: #ef4444;
$color-error: #dc2626;
$color-error-dark: #b91c1c;

// Warning
$color-warning-light: #f59e0b;
$color-warning: #d97706;
$color-warning-dark: #b45309;

// Info
$color-info-light: #3b82f6;
$color-info: #2563eb;
$color-info-dark: #1d4ed8;
```

### Background e Superfícies
```scss
// Light Mode
$bg-body-light: #ffffff;
$bg-surface-light: #f9fafb;
$bg-card-light: #ffffff;
$bg-hover-light: #f3f4f6;

// Dark Mode
$bg-body-dark: #121212;
$bg-surface-dark: #1a1a1a;
$bg-card-dark: #1e1e1e;
$bg-hover-dark: #2a2a2a;
```

---

## ✍️ Tipografia

### Font Families
```scss
// Google Fonts utilizadas no portfólio atual
$font-family-sans: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-family-headline: 'Poppins', sans-serif;
$font-family-handwriting: 'Caveat', cursive;
$font-family-mono: 'Fira Code', 'Courier New', monospace;

// Atalhos
$font-base: $font-family-sans;
$font-heading: $font-family-headline;
```

### Font Sizes (Sistema de escala)
```scss
// Base: 16px (1rem)
$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-2xl: 1.5rem;    // 24px
$font-size-3xl: 1.875rem;  // 30px
$font-size-4xl: 2.25rem;   // 36px
$font-size-5xl: 3rem;      // 48px
$font-size-6xl: 3.75rem;   // 60px
$font-size-7xl: 4.5rem;    // 72px
```

### Font Weights
```scss
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$font-weight-extrabold: 800;
```

### Line Heights
```scss
$line-height-none: 1;
$line-height-tight: 1.25;
$line-height-snug: 1.375;
$line-height-normal: 1.5;
$line-height-relaxed: 1.625;
$line-height-loose: 2;
```

### Letter Spacing
```scss
$letter-spacing-tighter: -0.05em;
$letter-spacing-tight: -0.025em;
$letter-spacing-normal: 0;
$letter-spacing-wide: 0.025em;
$letter-spacing-wider: 0.05em;
$letter-spacing-widest: 0.1em;
```

---

## 📏 Espaçamentos

### Sistema de Espaçamento (baseado em 4px)
```scss
$spacing-0: 0;
$spacing-1: 0.25rem;   // 4px
$spacing-2: 0.5rem;    // 8px
$spacing-3: 0.75rem;   // 12px
$spacing-4: 1rem;      // 16px
$spacing-5: 1.25rem;   // 20px
$spacing-6: 1.5rem;    // 24px
$spacing-8: 2rem;      // 32px
$spacing-10: 2.5rem;   // 40px
$spacing-12: 3rem;     // 48px
$spacing-16: 4rem;     // 64px
$spacing-20: 5rem;     // 80px
$spacing-24: 6rem;     // 96px
$spacing-32: 8rem;     // 128px
```

### Container Widths
```scss
$container-sm: 640px;
$container-md: 768px;
$container-lg: 1024px;
$container-xl: 1280px;
$container-2xl: 1536px;

$container-max-width: $container-xl; // 1280px (usado no portfólio)
```

---

## 📱 Breakpoints

### Mobile-First Breakpoints
```scss
$breakpoint-xs: 0;
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;

// Mapa de breakpoints para mixins
$breakpoints: (
  'xs': $breakpoint-xs,
  'sm': $breakpoint-sm,
  'md': $breakpoint-md,
  'lg': $breakpoint-lg,
  'xl': $breakpoint-xl,
  '2xl': $breakpoint-2xl
);
```

---

## 📁 Estrutura de Arquivos SCSS

```
frontend/src/styles/
├── abstracts/
│   ├── _variables.scss       # Todas as variáveis do design system
│   ├── _mixins.scss          # Mixins reutilizáveis
│   ├── _functions.scss       # Funções SCSS customizadas
│   └── _placeholders.scss    # Placeholders %extends
│
├── base/
│   ├── _reset.scss           # CSS reset/normalize
│   ├── _typography.scss      # Estilos base de tipografia
│   ├── _global.scss          # Estilos globais (html, body)
│   └── _animations.scss      # Keyframes e animações
│
├── themes/
│   ├── _light.scss           # Tema claro
│   ├── _dark.scss            # Tema escuro
│   └── _theme-manager.scss   # Gerenciador de temas
│
├── components/
│   ├── _buttons.scss         # Estilos de botões
│   ├── _cards.scss           # Estilos de cards
│   ├── _forms.scss           # Inputs, selects, etc
│   ├── _navbar.scss          # Navegação
│   ├── _footer.scss          # Rodapé
│   ├── _modals.scss          # Modais
│   └── _badges.scss          # Badges e tags
│
├── layouts/
│   ├── _container.scss       # Container e grid
│   ├── _header.scss          # Header layout
│   ├── _sidebar.scss         # Sidebar (se houver)
│   └── _grid.scss            # Sistema de grid customizado
│
├── pages/
│   ├── _home.scss            # Estilos específicos da home
│   ├── _about.scss           # Estilos da página sobre
│   ├── _projects.scss        # Estilos de projetos
│   └── _contact.scss         # Estilos de contato
│
├── utilities/
│   ├── _accessibility.scss   # Classes de acessibilidade
│   ├── _helpers.scss         # Classes utilitárias
│   └── _print.scss           # Estilos para impressão
│
└── main.scss                 # Arquivo principal que importa tudo
```

### Arquivo Principal (main.scss)
```scss
// main.scss
// 1. Abstracts (sem output CSS)
@import 'abstracts/variables';
@import 'abstracts/functions';
@import 'abstracts/mixins';
@import 'abstracts/placeholders';

// 2. Base (estilos fundamentais)
@import 'base/reset';
@import 'base/typography';
@import 'base/global';
@import 'base/animations';

// 3. Layouts
@import 'layouts/container';
@import 'layouts/header';
@import 'layouts/grid';

// 4. Components
@import 'components/buttons';
@import 'components/cards';
@import 'components/forms';
@import 'components/navbar';
@import 'components/footer';
@import 'components/modals';
@import 'components/badges';

// 5. Pages
@import 'pages/home';
@import 'pages/about';
@import 'pages/projects';
@import 'pages/contact';

// 6. Themes
@import 'themes/light';
@import 'themes/dark';
@import 'themes/theme-manager';

// 7. Utilities (devem vir por último)
@import 'utilities/accessibility';
@import 'utilities/helpers';
@import 'utilities/print';
```

---

## 🧩 Componentes Visuais

### Buttons
```scss
// components/_buttons.scss
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-2;
  padding: $spacing-3 $spacing-6;
  font-family: $font-headline;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  line-height: $line-height-normal;
  text-decoration: none;
  border: none;
  border-radius: 0.375rem; // 6px
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:focus-visible {
    outline: 2px solid $primary;
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// Variantes
.btn-primary {
  @extend .btn;
  background-color: $primary;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: $primary-dark;
  }
  
  &:active {
    background-color: darken($primary-dark, 5%);
  }
}

.btn-secondary {
  @extend .btn;
  background-color: $color-gray-100;
  color: $color-gray-900;
  
  &:hover:not(:disabled) {
    background-color: $color-gray-200;
  }
}

.btn-outline {
  @extend .btn;
  background-color: transparent;
  color: $primary;
  border: 2px solid $primary;
  
  &:hover:not(:disabled) {
    background-color: $primary;
    color: white;
  }
}

// Tamanhos
.btn-sm {
  padding: $spacing-2 $spacing-4;
  font-size: $font-size-xs;
}

.btn-lg {
  padding: $spacing-4 $spacing-8;
  font-size: $font-size-lg;
}
```

### Cards
```scss
// components/_cards.scss
.card {
  background-color: var(--bg-card);
  border-radius: 0.5rem; // 8px
  padding: $spacing-6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  &-header {
    margin-bottom: $spacing-4;
    
    h3 {
      font-family: $font-headline;
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      color: var(--text-primary);
    }
  }
  
  &-body {
    color: var(--text-secondary);
    font-size: $font-size-base;
    line-height: $line-height-relaxed;
  }
  
  &-footer {
    margin-top: $spacing-4;
    padding-top: $spacing-4;
    border-top: 1px solid var(--border-color);
  }
}

// Card de serviço (baseado no portfólio)
.service-card {
  @extend .card;
  background: linear-gradient(135deg, $primary 0%, darken($primary, 10%) 100%);
  color: white;
  
  .icon {
    font-size: $font-size-5xl;
    margin-bottom: $spacing-4;
  }
  
  h3 {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    margin-bottom: $spacing-2;
  }
  
  p {
    font-size: $font-size-sm;
    opacity: 0.9;
  }
}

// Card de projeto
.project-card {
  @extend .card;
  overflow: hidden;
  padding: 0;
  
  &-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  &-content {
    padding: $spacing-6;
  }
  
  &-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-2;
    margin-top: $spacing-3;
    
    .tech-badge {
      padding: $spacing-1 $spacing-3;
      background-color: $primary;
      color: white;
      border-radius: 9999px;
      font-size: $font-size-xs;
    }
  }
}
```

### Forms
```scss
// components/_forms.scss
.form-group {
  margin-bottom: $spacing-6;
}

.form-label {
  display: block;
  margin-bottom: $spacing-2;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: var(--text-primary);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: $spacing-3 $spacing-4;
  font-size: $font-size-base;
  line-height: $line-height-normal;
  color: var(--text-primary);
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:disabled {
    background-color: $color-gray-100;
    cursor: not-allowed;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-error {
  margin-top: $spacing-1;
  font-size: $font-size-sm;
  color: $color-error;
}

.form-help {
  margin-top: $spacing-1;
  font-size: $font-size-sm;
  color: var(--text-muted);
}
```

---

## 🌓 Temas (Light/Dark)

### Theme Manager
```scss
// themes/_theme-manager.scss
:root {
  // Light theme (padrão)
  --bg-body: #{$bg-body-light};
  --bg-surface: #{$bg-surface-light};
  --bg-card: #{$bg-card-light};
  --bg-hover: #{$bg-hover-light};
  --bg-input: #{$bg-card-light};
  
  --text-primary: #{$color-gray-900};
  --text-secondary: #{$color-gray-600};
  --text-muted: #{$color-gray-500};
  
  --border-color: #{$color-gray-200};
  --border-color-hover: #{$color-gray-300};
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

// Dark theme
.dark,
[data-theme='dark'] {
  --bg-body: #{$bg-body-dark};
  --bg-surface: #{$bg-surface-dark};
  --bg-card: #{$bg-card-dark};
  --bg-hover: #{$bg-hover-dark};
  --bg-input: #{$bg-card-dark};
  
  --text-primary: #{$color-dark-text};
  --text-secondary: #{$color-gray-400};
  --text-muted: #{$color-gray-500};
  
  --border-color: #{$color-dark-border};
  --border-color-hover: #{lighten($color-dark-border, 10%)};
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
}
```

### Light Theme Specifics
```scss
// themes/_light.scss
body:not(.dark) {
  background-color: var(--bg-body);
  color: var(--text-primary);
  
  // Gradientes específicos do tema claro
  .gradient-hero {
    background: linear-gradient(135deg, $color-primary-50 0%, $color-primary-100 100%);
  }
  
  .gradient-section {
    background: linear-gradient(to bottom, transparent, $color-gray-50);
  }
}
```

### Dark Theme Specifics
```scss
// themes/_dark.scss
.dark {
  background-color: var(--bg-body);
  color: var(--text-primary);
  
  // Gradientes específicos do tema escuro
  .gradient-hero {
    background: linear-gradient(135deg, darken($color-dark-bg, 2%) 0%, $color-dark-bg 100%);
  }
  
  .gradient-section {
    background: linear-gradient(to bottom, transparent, $bg-surface-dark);
  }
  
  // Ajustes de imagem para dark mode
  img:not(.no-invert) {
    filter: brightness(0.9);
  }
  
  // Code blocks
  pre,
  code {
    background-color: lighten($color-dark-card, 5%);
  }
}
```

---

## 🛠️ Mixins e Utilitários

### Responsive Breakpoints Mixin
```scss
// abstracts/_mixins.scss
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    $value: map-get($breakpoints, $breakpoint);
    @media (min-width: $value) {
      @content;
    }
  } @else {
    @warn "Breakpoint `#{$breakpoint}` não encontrado em $breakpoints.";
  }
}

// Uso:
// .container {
//   padding: 1rem;
//   @include respond-to('md') {
//     padding: 2rem;
//   }
// }
```

### Flexbox Mixins
```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}
```

### Typography Mixins
```scss
@mixin heading($size: 'base') {
  font-family: $font-headline;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
  color: var(--text-primary);
  
  @if $size == 'xl' {
    font-size: $font-size-5xl;
    @include respond-to('md') {
      font-size: $font-size-6xl;
    }
  } @else if $size == 'lg' {
    font-size: $font-size-3xl;
    @include respond-to('md') {
      font-size: $font-size-4xl;
    }
  } @else {
    font-size: $font-size-2xl;
  }
}

@mixin body-text($size: 'base') {
  font-family: $font-base;
  line-height: $line-height-relaxed;
  color: var(--text-secondary);
  
  @if $size == 'lg' {
    font-size: $font-size-lg;
  } @else if $size == 'sm' {
    font-size: $font-size-sm;
  } @else {
    font-size: $font-size-base;
  }
}
```

### Shadow Mixins
```scss
@mixin shadow($level: 'md') {
  @if $level == 'sm' {
    box-shadow: var(--shadow-sm);
  } @else if $level == 'lg' {
    box-shadow: var(--shadow-lg);
  } @else {
    box-shadow: var(--shadow-md);
  }
}
```

### Animation Mixins
```scss
@mixin transition($properties: all, $duration: 0.2s, $timing: ease-in-out) {
  transition: $properties $duration $timing;
}

@mixin fade-in($duration: 0.3s) {
  animation: fadeIn $duration ease-in;
}

@keyframe fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

### Truncate Text
```scss
@mixin truncate($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

### Accessibility Focus
```scss
@mixin focus-ring($color: $primary) {
  &:focus-visible {
    outline: 2px solid $color;
    outline-offset: 2px;
    border-radius: 0.25rem;
  }
}
```

---

## 🔧 Integração com Angular

### Angular Component Styles
```scss
// Usar ViewEncapsulation.None para estilos globais
// Usar ViewEncapsulation.Emulated (padrão) para estilos encapsulados

// Exemplo: navbar.component.scss
@import '../../../styles/abstracts/variables';
@import '../../../styles/abstracts/mixins';

:host {
  display: block;
}

.navbar {
  @include flex-between;
  padding: $spacing-4 0;
  background-color: var(--bg-card);
  box-shadow: var(--shadow-sm);
  
  &__container {
    @include flex-between;
    max-width: $container-max-width;
    margin: 0 auto;
    padding: 0 $spacing-4;
    width: 100%;
  }
  
  &__brand {
    @include heading('base');
    text-decoration: none;
    color: $primary;
  }
  
  &__links {
    @include flex-center;
    gap: $spacing-6;
    list-style: none;
    
    @include respond-to('md') {
      gap: $spacing-8;
    }
  }
}
```

### Global Styles em Angular
```typescript
// angular.json
{
  "styles": [
    "src/styles/main.scss"
  ],
  "stylePreprocessorOptions": {
    "includePaths": [
      "src/styles"
    ]
  }
}
```

### Usando Variáveis SCSS em TypeScript
```typescript
// exportar variáveis para TypeScript (opcional)
// theme.config.ts
export const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    // ...
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }
} as const;
```

---

## 📋 Checklist de Implementação

### Fase 1: Setup Inicial
- [ ] Criar estrutura de pastas SCSS
- [ ] Configurar variáveis de cores
- [ ] Configurar variáveis de tipografia
- [ ] Configurar sistema de espaçamento
- [ ] Configurar breakpoints

### Fase 2: Base e Temas
- [ ] Implementar reset/normalize CSS
- [ ] Configurar estilos base de tipografia
- [ ] Implementar theme manager (light/dark)
- [ ] Testar troca de temas

### Fase 3: Componentes
- [ ] Implementar componentes de botões
- [ ] Implementar componentes de cards
- [ ] Implementar componentes de formulários
- [ ] Implementar navbar
- [ ] Implementar footer

### Fase 4: Layouts
- [ ] Implementar container
- [ ] Implementar sistema de grid
- [ ] Implementar layouts de página

### Fase 5: Utilities
- [ ] Implementar classes de acessibilidade
- [ ] Implementar classes utilitárias
- [ ] Documentar todas as classes

### Fase 6: Testes e Otimização
- [ ] Testar responsividade em todos os breakpoints
- [ ] Testar acessibilidade (WCAG 2.1 AA)
- [ ] Otimizar CSS (remover não utilizados)
- [ ] Validar performance (Lighthouse)

---

## 🎯 Padrões de Nomenclatura

### BEM (Block Element Modifier)
```scss
// Block
.card { }

// Element
.card__header { }
.card__body { }
.card__footer { }

// Modifier
.card--featured { }
.card--large { }
.card__header--dark { }
```

### Convenções
- Classes utilitárias: `.u-` (exemplo: `.u-text-center`)
- Classes de layout: `.l-` (exemplo: `.l-container`)
- Classes de componente: nome direto (exemplo: `.btn`, `.card`)
- Estados: `.is-` ou `.has-` (exemplo: `.is-active`, `.has-error`)

---

## 📚 Recursos e Referências

- [Sass Guidelines](https://sass-guidelin.es/)
- [BEM Methodology](https://getbem.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)
- [Tailwind CSS](https://tailwindcss.com/) (inspiração)

---

**Design System preparado para migração Angular 19+ | Baseado no portfólio React atual** ✨
