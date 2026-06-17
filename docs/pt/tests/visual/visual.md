# Visual Regression — Baselines mobile

**Arquivo fonte:** [`visual.spec.ts`](../../../../tests/visual/visual.spec.ts)

---

## Objetivo

Esta suite executa **regressão visual** no mobile web do TestFlow. Captura screenshots e compara com baselines armazenadas em `test-results/visual-baselines/`. Cobre três telas:

1. **Login** — tela não autenticada
2. **Dashboard** — após `loginViaApi`
3. **Components** — botões primários na vitrine de componentes

A comparação usa tamanho de arquivo PNG como proxy de diferença visual (threshold configurável de 5%), adequado para smoke visual sem dependência de bibliotecas de diff de imagem pesadas.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | Telas renderizando de forma consistente no emulador |
| **Baselines** | Na primeira execução, screenshots são criadas automaticamente |
| **Diretório** | `test-results/visual-baselines/` (gitignored em geral) |
| **Execução** | `npm run test:visual` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@visual` | `describe('Visual regression @visual @regression')` | Testes de screenshot |
| `@regression` | Mesmo `describe` | Incluído na regressão completa |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| [`assertScreenshotMatches`](../../../../support/helpers/visual.ts) | Salva ou compara baseline vs captura atual |
| [`browser.saveScreenshot`](https://webdriver.io/docs/api/browser/saveScreenshot) | Captura PNG do viewport mobile |
| [`loginViaApi`](../../../../support/auth.ts) | Estado autenticado para dashboard/components |
| [`appPath`](../../../../support/config.ts) | URL absoluta com loopback mobile (`10.0.2.2`) |
| [`waitForTestId`](../../../../support/selectors.ts) | Aguarda renderização antes do screenshot |
| [`tc` / `TC.VISUAL_*`](../../../../support/constants/testCases.ts) | IDs `[TC-9001]` a `[TC-9003]` |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Login baseline

```typescript
import { LoginPage } from '../../pages/LoginPage'
import { assertScreenshotMatches } from '../../support/helpers/visual'

describe('Visual regression @visual @regression', () => {
  it(tc(TC.VISUAL_LOGIN, 'login screen baseline on mobile'), async () => {
    await new LoginPage().visit()
    await assertScreenshotMatches('mobile-login')
  })
```

- **Dado:** tela de login sem sessão.
- **Quando:** `visit()` carrega `/web/login.html` e screenshot é capturado.
- **Então:** arquivo `mobile-login.png` é criado (primeira vez) ou comparado — diferença de tamanho ≤ 5%.

---

### Bloco 2 — Dashboard baseline

```typescript
  it(tc(TC.VISUAL_DASHBOARD, 'dashboard baseline when authenticated'), async () => {
    await loginViaApi()
    await assertScreenshotMatches('mobile-dashboard')
  })
```

- **Dado:** usuário autenticado no dashboard.
- **Quando:** página estável após `loginViaApi`.
- **Então:** baseline `mobile-dashboard.png` validada — detecta regressões de layout nos KPIs e greeting.

---

### Bloco 3 — Components baseline

```typescript
  it(tc(TC.VISUAL_COMPONENTS, 'components page primary buttons baseline'), async () => {
    await loginViaApi()
    await browser.url(appPath('/web/components.html'))
    await waitForTestId('page-components')
    await assertScreenshotMatches('mobile-components')
  })
```

- **Dado:** sessão autenticada e rota Components.
- **Quando:** `appPath` resolve URL com host correto do emulador e `page-components` fica visível.
- **Então:** baseline `mobile-components.png` captura botões primários — útil para detectar mudanças de tema/cores.

**Lógica de comparação:**

```typescript
// support/helpers/visual.ts — resumo
if (!fs.existsSync(baselinePath)) {
  await saveBaseline(name)  // primeira execução cria referência
  return
}
await browser.saveScreenshot(currentPath)
const sizeDiff = Math.abs(baseline.length - current.length) / baseline.length * 100
if (sizeDiff > maxMismatchPercent) throw new Error(...)
```

---

## Como executar

```bash
# Suíte visual completa
npm run test:visual

# Primeira execução — gera baselines
PLATFORM=android npm run test:visual

# Atualizar baselines após mudança intencional de UI
rm test-results/visual-baselines/mobile-*.png
npm run test:visual
```

---

## Referências relacionadas

- Helper visual: [`support/helpers/visual.ts`](../../../../support/helpers/visual.ts)
- Device screenshots: [`tests/device/device.spec.ts`](../../../../tests/device/device.spec.ts)
- Config de URL mobile: [`support/config.ts`](../../../../support/config.ts)
