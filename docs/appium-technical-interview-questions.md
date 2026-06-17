# Appium — Perguntas Técnicas para Entrevistas

> Banco de perguntas para entrevistas com recrutadores técnicos, QA leads, SDETs e engenheiros de software.  
> Cobertura baseada no conteúdo dos slides (`docs/slides/index.html`), na suíte **testflow-appium** e em tópicos frequentes em empresas brasileiras e internacionais.  
> **Legenda:** `[SLIDE]` = abordado na apresentação · `[PROJETO]` = presente na suíte TestFlow · `[EXTRA]` = comum em entrevistas, fora dos slides/projeto.

---

## Índice

1. [Conceitos Fundamentais](#1-conceitos-fundamentais)
2. [Arquitetura — WebDriver, UiAutomator2, XCUITest](#2-arquitetura--webdriver-uiautomator2-xcuitest)
3. [Instalação e Pré-requisitos](#3-instalação-e-pré-requisitos)
4. [WebdriverIO — Config e Runner](#4-webdriverio--config-e-runner)
5. [Mapeamento de URL Mobile](#5-mapeamento-de-url-mobile)
6. [Locators e Estratégias de Seletores](#6-locators-e-estratégias-de-seletores)
7. [Gestos e Touch Actions](#7-gestos-e-touch-actions)
8. [Capacidades do Device](#8-capacidades-do-device)
9. [Context Switching](#9-context-switching)
10. [Autenticação e Sessão](#10-autenticação-e-sessão)
11. [API Testing — Mocha + Axios](#11-api-testing--mocha--axios)
12. [Page Object Model (POM)](#12-page-object-model-pom)
13. [Allure e Relatórios](#13-allure-e-relatórios)
14. [CI/CD — appium.yml e Emulador](#14-cicd--appiumyml-e-emulador)
15. [Comparações — Appium vs Playwright/Cypress/Selenium](#15-comparações--appium-vs-playwrightcypressselenium)
16. [Mocha, Tags e Organização de Specs](#16-mocha-tags-e-organização-de-specs)
17. [Flakiness, Debug e Estabilidade Mobile](#17-flakiness-debug-e-estabilidade-mobile)
18. [Cenários Comportamentais e Situação-Problema](#18-cenários-comportamentais-e-situação-problema)
19. [Perguntas de Recrutador / Screening](#19-perguntas-de-recrutador--screening)

---

## 1. Conceitos Fundamentais

| # | Pergunta | Tag |
|---|----------|-----|
| 1.1 | O que é o Appium e qual problema ele resolve? | `[SLIDE]` |
| 1.2 | Qual a diferença entre teste **mobile web**, **app nativa** e **híbrida**? | `[SLIDE]` |
| 1.3 | O **testflow-appium** testa qual tipo de aplicação? Por quê? | `[SLIDE]` `[PROJETO]` |
| 1.4 | O Appium substitui testes unitários? Justifique. | `[EXTRA]` |
| 1.5 | Quais linguagens o Appium suporta oficialmente para escrever testes? | `[SLIDE]` |
| 1.6 | O Appium é open source? Quem mantém o projeto hoje? | `[SLIDE]` `[EXTRA]` |
| 1.7 | Qual a diferença entre Appium 1.x e Appium 2.x? | `[SLIDE]` `[EXTRA]` |
| 1.8 | O que são **drivers** no Appium 2 (ex.: `uiautomator2`, `xcuitest`)? | `[SLIDE]` `[PROJETO]` |
| 1.9 | O Appium funciona apenas em emuladores ou também em devices físicos? | `[SLIDE]` |
| 1.10 | Qual a diferença entre automação mobile web e desktop E2E (Playwright)? | `[SLIDE]` `[EXTRA]` |
| 1.11 | O que significa **mobile-first** no contexto do TestFlow? | `[PROJETO]` |
| 1.12 | Por que testar em browser mobile real (Chrome Android) em vez de só redimensionar viewport? | `[SLIDE]` `[PROJETO]` |
| 1.13 | O Appium consegue testar Progressive Web Apps (PWA)? | `[EXTRA]` |
| 1.14 | Qual protocolo o Appium usa para comunicar com o device? | `[SLIDE]` |
| 1.15 | O que é uma **sessão Appium** e quando ela é criada? | `[SLIDE]` `[PROJETO]` |
| 1.16 | Qual a diferença entre `npm run test` e `npm run test:api` no testflow-appium? | `[SLIDE]` `[PROJETO]` |
| 1.17 | O Appium grava screenshot automaticamente em falha neste projeto? | `[SLIDE]` `[PROJETO]` |
| 1.18 | O que são **capabilities** no contexto Appium? | `[SLIDE]` `[PROJETO]` |
| 1.19 | Por que mobile web ainda precisa de Appium em vez de só abrir Chrome no desktop? | `[EXTRA]` |
| 1.20 | O Appium suporta automação de desktop (Windows/macOS)? | `[EXTRA]` |

---

## 2. Arquitetura — WebDriver, UiAutomator2, XCUITest

| # | Pergunta | Tag |
|---|----------|-----|
| 2.1 | Explique a arquitetura: Cliente (WDIO) → Appium Server → Driver → Device. | `[SLIDE]` |
| 2.2 | O que é o protocolo **WebDriver** (W3C)? | `[SLIDE]` |
| 2.3 | Qual driver o testflow-appium usa no Android e por quê? | `[SLIDE]` `[PROJETO]` |
| 2.4 | O que faz o driver **UiAutomator2**? | `[SLIDE]` |
| 2.5 | O que faz o driver **XCUITest** no iOS? | `[SLIDE]` |
| 2.6 | Por que `browserName: 'Chrome'` nas capabilities Android? | `[SLIDE]` `[PROJETO]` |
| 2.7 | O que significa `appium:automationName: 'UiAutomator2'`? | `[SLIDE]` `[PROJETO]` |
| 2.8 | Qual a função do **Chromedriver** em testes mobile web Android? | `[SLIDE]` `[EXTRA]` |
| 2.9 | O que faz `appium:chromedriverAutodownload: true`? | `[PROJETO]` |
| 2.10 | Por que `wdio:enforceWebDriverClassic: true` no `wdio.conf.ts`? | `[PROJETO]` `[EXTRA]` |
| 2.11 | Como o Appium 2 organiza plugins e drivers separadamente do core? | `[SLIDE]` |
| 2.12 | O que retorna `npm run appium:doctor`? | `[SLIDE]` `[PROJETO]` |
| 2.13 | Qual a diferença entre Appium Server e Appium Inspector? | `[EXTRA]` |
| 2.14 | Como funciona o `@wdio/appium-service` no runner local? | `[SLIDE]` `[PROJETO]` |
| 2.15 | O que acontece se o driver UiAutomator2 não estiver instalado? | `[SLIDE]` `[PROJETO]` |
| 2.16 | Por que Java é necessário para Allure mas não para rodar WDIO? | `[PROJETO]` |
| 2.17 | O Appium injeta JavaScript na página como o Cypress? | `[EXTRA]` |
| 2.18 | Qual a diferença entre WebDriver Classic e BiDi no ecossistema WDIO? | `[EXTRA]` |

---

## 3. Instalação e Pré-requisitos

| # | Pergunta | Tag |
|---|----------|-----|
| 3.1 | Quais pré-requisitos para rodar testflow-appium localmente? | `[SLIDE]` `[PROJETO]` |
| 3.2 | Por que Node.js 20+ é exigido? | `[SLIDE]` |
| 3.3 | Para que serve `npm run appium:drivers`? | `[SLIDE]` `[PROJETO]` |
| 3.4 | O que instala `scripts/ensure-appium-drivers.sh`? | `[PROJETO]` |
| 3.5 | Quais variáveis de ambiente estão em `.env.example`? | `[SLIDE]` `[PROJETO]` |
| 3.6 | Como subir o TestFlow com Docker na porta 5050? | `[SLIDE]` `[PROJETO]` |
| 3.7 | Para que serve `npm run check:testflow`? | `[PROJETO]` |
| 3.8 | Quais componentes do Android SDK são necessários? | `[SLIDE]` `[EXTRA]` |
| 3.9 | Como criar e iniciar um emulador Android para os testes? | `[SLIDE]` |
| 3.10 | Quais requisitos para `npm run test:ios` (macOS, Xcode)? | `[SLIDE]` `[PROJETO]` |
| 3.11 | Como instalar Appium globalmente vs localmente via `npm install`? | `[EXTRA]` |
| 3.12 | O que faz `npx appium driver install uiautomator2`? | `[SLIDE]` |
| 3.13 | Como resolver erro de Chromedriver incompatível com versão do Chrome? | `[EXTRA]` |
| 3.14 | Como configurar `ANDROID_HOME` / `ANDROID_SDK_ROOT`? | `[EXTRA]` |
| 3.15 | Por que KVM é habilitado no CI (`android-emulator-runner`)? | `[SLIDE]` `[PROJETO]` |
| 3.16 | Qual imagem Docker do TestFlow o CI usa? | `[PROJETO]` |
| 3.17 | Como verificar se o emulador enxerga o host na porta 5050? | `[SLIDE]` `[PROJETO]` |
| 3.18 | O Appium pode rodar em Windows para testes Android? | `[EXTRA]` |
| 3.19 | Como atualizar drivers Appium sem quebrar a suíte? | `[EXTRA]` |
| 3.20 | Qual diferença entre `npm install` e instalar Appium Desktop? | `[EXTRA]` |

---

## 4. WebdriverIO — Config e Runner

| # | Pergunta | Tag |
|---|----------|-----|
| 4.1 | Qual a função de `wdio.conf.ts` vs `wdio.shared.conf.ts`? | `[SLIDE]` `[PROJETO]` |
| 4.2 | O que `wdio.ios.conf.ts` altera em relação ao Android? | `[SLIDE]` `[PROJETO]` |
| 4.3 | Por que `exclude: ['./tests/api/**/*.spec.ts']` no shared config? | `[SLIDE]` `[PROJETO]` |
| 4.4 | O que faz `maxInstances: 1` neste projeto? | `[SLIDE]` `[PROJETO]` |
| 4.5 | Qual framework de teste está configurado (`mocha`)? | `[SLIDE]` `[PROJETO]` |
| 4.6 | O que controlam `waitforTimeout` e `connectionRetryTimeout`? | `[SLIDE]` `[PROJETO]` |
| 4.7 | Como o `autoCompileOpts` com `ts-node` compila TypeScript? | `[SLIDE]` `[PROJETO]` |
| 4.8 | Quais reporters estão ativos (`spec`, `allure`)? | `[SLIDE]` `[PROJETO]` |
| 4.9 | O que o hook `afterTest` faz em falha? | `[SLIDE]` `[PROJETO]` |
| 4.10 | Como passar `--spec` para rodar uma suite isolada? | `[SLIDE]` `[PROJETO]` |
| 4.11 | Como filtrar testes por tag com `--mochaOpts.grep`? | `[SLIDE]` `[PROJETO]` |
| 4.12 | O que faz `appium:newCommandTimeout: 240`? | `[PROJETO]` |
| 4.13 | Por que `appium:autoGrantPermissions: true`? | `[PROJETO]` |
| 4.14 | O que são `appium:chromeOptions.args` no Android? | `[PROJETO]` |
| 4.15 | Como sobrescrever `ANDROID_DEVICE` e `ANDROID_VERSION`? | `[PROJETO]` |
| 4.16 | Qual diferença entre `wdio run` e `mocha` direto para API? | `[SLIDE]` `[PROJETO]` |
| 4.17 | Como configurar `bail: 0` vs parar no primeiro erro? | `[EXTRA]` |
| 4.18 | O que `reportedEnvironmentVars` envia ao Allure? | `[PROJETO]` |
| 4.19 | Como aumentar `logLevel` para debug de comandos WebDriver? | `[EXTRA]` |
| 4.20 | Por que `mochaOpts.timeout` é maior no CI? | `[PROJETO]` |

---

## 5. Mapeamento de URL Mobile

| # | Pergunta | Tag |
|---|----------|-----|
| 5.1 | Por que `localhost:5050` não funciona no emulador Android? | `[SLIDE]` `[PROJETO]` |
| 5.2 | O que é `10.0.2.2` e quando usar? | `[SLIDE]` `[PROJETO]` |
| 5.3 | Qual URL padrão o iOS Simulator usa (`127.0.0.1`)? | `[SLIDE]` `[PROJETO]` |
| 5.4 | Como `getBaseUrl()` em `support/config.ts` detecta a plataforma? | `[SLIDE]` `[PROJETO]` |
| 5.5 | Qual diferença entre `BASE_URL`, `ANDROID_BASE_URL` e `IOS_BASE_URL`? | `[SLIDE]` `[PROJETO]` |
| 5.6 | Como `appPath('/web/login.html')` monta a URL final? | `[PROJETO]` |
| 5.7 | Por que o CI Android usa `127.0.0.1` com `adb reverse`? | `[SLIDE]` `[PROJETO]` |
| 5.8 | O que `getApiBaseUrl()` retorna em testes API-only? | `[PROJETO]` |
| 5.9 | Como testar contra staging com variável de ambiente? | `[EXTRA]` |
| 5.10 | O que acontece se `PLATFORM=android` mas capabilities dizem iOS? | `[EXTRA]` |
| 5.11 | Como `detectPlatform()` usa `browser.capabilities`? | `[PROJETO]` |
| 5.12 | Device físico Android: IP da máquina host vs `10.0.2.2`? | `[EXTRA]` |

---

## 6. Locators e Estratégias de Seletores

| # | Pergunta | Tag |
|---|----------|-----|
| 6.1 | Por que `data-testid` é a estratégia primária no TestFlow? | `[SLIDE]` `[PROJETO]` |
| 6.2 | O que retorna `byTestId('login-email')`? | `[SLIDE]` `[PROJETO]` |
| 6.3 | Qual diferença entre `$(id)` e `browser.$(byTestId(id))`? | `[PROJETO]` |
| 6.4 | O que `waitForTestId` espera além de existência? | `[SLIDE]` `[PROJETO]` |
| 6.5 | Por que `clickTestId` é preferível a click direto sem wait? | `[PROJETO]` |
| 6.6 | Como `fillTestId` lida com campos mobile (click + clear + setValue)? | `[PROJETO]` |
| 6.7 | Quando usar XPath no `strategies.spec.ts`? | `[SLIDE]` `[PROJETO]` |
| 6.8 | O que demonstra o teste de encadeamento de seletores filhos? | `[PROJETO]` |
| 6.9 | Qual diferença entre `waitForExist` e `waitForDisplayed`? | `[SLIDE]` `[EXTRA]` |
| 6.10 | Como evitar seletores acoplados a texto com i18n? | `[SLIDE]` `[EXTRA]` |
| 6.11 | O Appium suporta accessibility id para apps nativos? | `[EXTRA]` |
| 6.12 | Quando usar `-android uiautomator` vs CSS? | `[EXTRA]` |
| 6.13 | O que é um seletor brittle? Dê exemplo do TestFlow. | `[PROJETO]` |
| 6.14 | Como selecionar células de tabela por `data-row-id`? | `[PROJETO]` |
| 6.15 | Por que Page Objects centralizam locators? | `[SLIDE]` `[PROJETO]` |
| 6.16 | Como `LoginPage.emailInput()` resolve o elemento? | `[PROJETO]` |
| 6.17 | Qual timeout padrão dos helpers de selector (15s / 45s CI)? | `[PROJETO]` |
| 6.18 | Como lidar com elementos fora da viewport no mobile? | `[SLIDE]` `[PROJETO]` |
| 6.19 | O WDIO tem equivalente ao `getByRole` do Playwright? | `[EXTRA]` |
| 6.20 | Como validar múltiplos elementos com `$$('prefix')`? | `[PROJETO]` |

---

## 7. Gestos e Touch Actions

| # | Pergunta | Tag |
|---|----------|-----|
| 7.1 | O que é W3C **Actions API** (`performActions`)? | `[SLIDE]` |
| 7.2 | Como `swipeUp` calcula coordenadas de início e fim? | `[SLIDE]` `[PROJETO]` |
| 7.3 | Por que chamar `releaseActions()` após `performActions`? | `[SLIDE]` `[PROJETO]` |
| 7.4 | Qual diferença entre `swipeUp` e `swipeDown` no helper? | `[PROJETO]` |
| 7.5 | Como `longPress` posiciona o toque no centro do elemento? | `[SLIDE]` `[PROJETO]` |
| 7.6 | O que `scrollIntoView` executa via `browser.execute`? | `[PROJETO]` |
| 7.7 | Por que gestos são necessários se `element.click()` existe? | `[EXTRA]` |
| 7.8 | Como ajustar `percent` e `speed` no swipe? | `[PROJETO]` |
| 7.9 | Swipe em lista (`activity-list`) — o que o spec valida? | `[PROJETO]` |
| 7.10 | Tap via `nav.click()` vs touch action explícito? | `[PROJETO]` |
| 7.11 | O Appium suporta pinch/zoom? Como implementar? | `[EXTRA]` |
| 7.12 | Por que gestos podem ser flaky em CI? | `[EXTRA]` |
| 7.13 | Qual diferença entre `touchAction` legado e W3C Actions? | `[EXTRA]` |
| 7.14 | Como fazer scroll até elemento sticky no mobile web? | `[EXTRA]` |
| 7.15 | O `gestures.spec.ts` usa tag `@appium` — por quê? | `[PROJETO]` |

---

## 8. Capacidades do Device

| # | Pergunta | Tag |
|---|----------|-----|
| 8.1 | Como `setOrientation` alterna portrait/landscape? | `[SLIDE]` `[PROJETO]` |
| 8.2 | O spec de orientação valida o quê após cada rotação? | `[PROJETO]` |
| 8.3 | O que faz `hideKeyboardIfShown` e quando falha silenciosamente? | `[SLIDE]` `[PROJETO]` |
| 8.4 | Por que o teclado software cobre botões no mobile? | `[SLIDE]` |
| 8.5 | Como capturar screenshot manual com `browser.saveScreenshot`? | `[PROJETO]` |
| 8.6 | O que `browser.takeScreenshot` retorna (base64)? | `[PROJETO]` |
| 8.7 | Como ler `browser.capabilities.platformName` no teste? | `[PROJETO]` |
| 8.8 | O que `isAndroid()` e `isIOS()` consultam? | `[PROJETO]` |
| 8.9 | Como testar em múltiplos tamanhos de device? | `[EXTRA]` |
| 8.10 | O Appium expõe bateria, rede ou GPS como capabilities? | `[EXTRA]` |
| 8.11 | Como simular modo avião em testes? | `[EXTRA]` |
| 8.12 | Portrait vs landscape afeta locators CSS? | `[EXTRA]` |

---

## 9. Context Switching

| # | Pergunta | Tag |
|---|----------|-----|
| 9.1 | O que é um **context** no Appium (NATIVE vs WEBVIEW)? | `[SLIDE]` |
| 9.2 | Por que mobile web ainda expõe contextos WEBVIEW? | `[SLIDE]` `[PROJETO]` |
| 9.3 | O que `listContexts()` retorna no `webview.spec.ts`? | `[PROJETO]` |
| 9.4 | Como `getCurrentContext()` é usado no teste? | `[PROJETO]` |
| 9.5 | O que `switchToWebContext()` procura nos nomes de contexto? | `[PROJETO]` |
| 9.6 | Por que `browser.execute` só funciona em contexto web? | `[SLIDE]` `[PROJETO]` |
| 9.7 | Como o spec valida `data-testid` via DOM `querySelectorAll`? | `[PROJETO]` |
| 9.8 | Em app híbrida React Native, quando trocar contexto? | `[EXTRA]` |
| 9.9 | O que acontece se você buscar elemento nativo no contexto WEBVIEW? | `[EXTRA]` |
| 9.10 | Como debugar contextos com Appium Inspector? | `[EXTRA]` |
| 9.11 | Quantos contextos o login page lista no emulador? | `[PROJETO]` |
| 9.12 | Context switching é necessário em **todo** teste mobile web? | `[EXTRA]` |

---

## 10. Autenticação e Sessão

| # | Pergunta | Tag |
|---|----------|-----|
| 10.1 | Como `fetchAuthToken` obtém o JWT? | `[SLIDE]` `[PROJETO]` |
| 10.2 | O que `injectAuthSession` grava no `sessionStorage`? | `[SLIDE]` `[PROJETO]` |
| 10.3 | Por que `seedSessionOnOrigin` abre `/web/index.html` antes de injetar? | `[PROJETO]` |
| 10.4 | Qual diferença entre `loginViaApi` e `loginViaUi`? | `[SLIDE]` `[PROJETO]` |
| 10.5 | O que `visitAuthenticated(path)` faz em uma linha? | `[PROJETO]` |
| 10.6 | Como `visitWithToken` acelera smoke de múltiplas páginas? | `[PROJETO]` |
| 10.7 | O que `getSessionAuth` lê do browser? | `[PROJETO]` |
| 10.8 | Como `logoutViaUi` encerra a sessão? | `[PROJETO]` |
| 10.9 | Por que API login é mais rápido que UI no mobile? | `[SLIDE]` `[EXTRA]` |
| 10.10 | Como credenciais vêm de `DEMO_EMAIL` / `DEMO_PASSWORD`? | `[PROJETO]` |
| 10.11 | O `sessionStorage` persiste entre reloads no mobile web? | `[EXTRA]` |
| 10.12 | Como espelhar `storageState` do Playwright neste projeto? | `[SLIDE]` `[EXTRA]` |

---

## 11. API Testing — Mocha + Axios

| # | Pergunta | Tag |
|---|----------|-----|
| 11.1 | Por que testes API rodam com Mocha puro, não WDIO? | `[SLIDE]` `[PROJETO]` |
| 11.2 | O que `apiClient()` em `support/api/client.ts` encapsula? | `[PROJETO]` |
| 11.3 | Como o spec valida `GET /health`? | `[PROJETO]` |
| 11.4 | O que `validateSchema` verifica na resposta de login? | `[PROJETO]` |
| 11.5 | Quais status HTTP estão em `support/constants/httpStatus.ts`? | `[PROJETO]` |
| 11.6 | Como rodar só API: `npm run test:api`? | `[SLIDE]` `[PROJETO]` |
| 11.7 | Qual comando `mocha` equivalente está no `package.json`? | `[PROJETO]` |
| 11.8 | Por que API tests não precisam de emulador? | `[SLIDE]` |
| 11.9 | Como `API_BASE_URL` aponta para TestFlow no CI? | `[PROJETO]` |
| 11.10 | Qual diferença entre assert Node e `expect-webdriverio`? | `[EXTRA]` |
| 11.11 | Como testar endpoint autenticado com token Axios? | `[EXTRA]` |
| 11.12 | O job `api` no `appium.yml` roda antes do Android — por quê? | `[PROJETO]` |

---

## 12. Page Object Model (POM)

| # | Pergunta | Tag |
|---|----------|-----|
| 12.1 | O que `BasePage` fornece às páginas concretas? | `[SLIDE]` `[PROJETO]` |
| 12.2 | Qual diferença entre `testId()` e `selector()` no BasePage? | `[PROJETO]` |
| 12.3 | Como `LoginPage.visit()` abre a tela de login? | `[PROJETO]` |
| 12.4 | O que `shouldRedirectToDashboard()` asserta? | `[PROJETO]` |
| 12.5 | Por que métodos retornam `this` (fluent interface)? | `[EXTRA]` |
| 12.6 | Liste os Page Objects do projeto (`pages/`). | `[PROJETO]` |
| 12.7 | Como `DashboardPage.shouldBeLoaded()` espera a página? | `[PROJETO]` |
| 12.8 | Spec deve conter locators ou só chamar POM? | `[SLIDE]` `[PROJETO]` |
| 12.9 | Como organizar POM para wizard multi-step? | `[PROJETO]` |
| 12.10 | Anti-pattern: POM com assertions de negócio demais? | `[EXTRA]` |
| 12.11 | Como `ShellPage` cobre navegação lateral? | `[PROJETO]` |
| 12.12 | Quando criar novo Page Object vs estender existente? | `[EXTRA]` |

---

## 13. Allure e Relatórios

| # | Pergunta | Tag |
|---|----------|-----|
| 13.1 | Como gerar relatório Allure neste projeto? | `[SLIDE]` `[PROJETO]` |
| 13.2 | O que `npm run report` executa em sequência? | `[PROJETO]` |
| 13.3 | Onde ficam `allure-results` e `allure-report`? | `[PROJETO]` |
| 13.4 | O que é anexado ao Allure quando um teste WDIO falha? | `[SLIDE]` `[PROJETO]` |
| 13.5 | Por que anexar URL atual em falha? | `[PROJETO]` |
| 13.6 | O que `addConsoleLogs: true` no reporter Allure faz? | `[PROJETO]` |
| 13.7 | Qual diferença entre reporter `spec` e `allure`? | `[SLIDE]` |
| 13.8 | Por que Java 17+ para `allure generate`? | `[PROJETO]` |
| 13.9 | Como limpar resultados: `npm run allure:clean`? | `[PROJETO]` |
| 13.10 | O CI faz upload de `allure-results` — como usar localmente? | `[PROJETO]` |
| 13.11 | Allure funciona com testes Mocha API? | `[EXTRA]` |
| 13.12 | Como adicionar step manual com `allureReporter.addStep`? | `[EXTRA]` |

---

## 14. CI/CD — appium.yml e Emulador

| # | Pergunta | Tag |
|---|----------|-----|
| 14.1 | Quais jobs existem em `.github/workflows/appium.yml`? | `[SLIDE]` `[PROJETO]` |
| 14.2 | Por que `android-smoke` depende de `api` (`needs: api`)? | `[PROJETO]` |
| 14.3 | O que `reactivecircus/android-emulator-runner` provisiona? | `[SLIDE]` `[PROJETO]` |
| 14.4 | Qual API level e profile do emulador no CI? | `[PROJETO]` |
| 14.5 | O que `scripts/ci-android-smoke.sh` executa? | `[PROJETO]` |
| 14.6 | Como artifacts de screenshot são publicados em falha? | `[PROJETO]` |
| 14.7 | Qual service container fornece TestFlow na porta 5050? | `[PROJETO]` |
| 14.8 | Por que `timeout-minutes: 45` no job Android? | `[EXTRA]` |
| 14.9 | Como `concurrency` evita runs duplicados? | `[PROJETO]` |
| 14.10 | O workflow roda em PR e push para `main`? | `[PROJETO]` |
| 14.11 | Como adicionar job iOS Simulator no GitHub Actions? | `[EXTRA]` |
| 14.12 | Por que cache de `node_modules` por hash do lockfile? | `[EXTRA]` |
| 14.13 | Como passar secrets (`DEMO_PASSWORD`) no CI? | `[PROJETO]` |
| 14.14 | Diferença entre `test:ci:android` e `test:ci:android:smoke`? | `[PROJETO]` |
| 14.15 | Como reproduzir falha de CI localmente com `CI=true`? | `[EXTRA]` |

---

## 15. Comparações — Appium vs Playwright/Cypress/Selenium

| # | Pergunta | Tag |
|---|----------|-----|
| 15.1 | Quando escolher Appium em vez de Playwright? | `[SLIDE]` `[EXTRA]` |
| 15.2 | Playwright suporta mobile nativo? Appium suporta desktop? | `[EXTRA]` |
| 15.3 | Cypress roda em WebView mobile — limitações vs Appium? | `[EXTRA]` |
| 15.4 | Selenium 4 vs Appium 2 — mesma base WebDriver? | `[SLIDE]` |
| 15.5 | Por que testflow-appium espelha testflow-playwright? | `[SLIDE]` `[PROJETO]` |
| 15.6 | Qual stack de runner: WDIO+Mocha vs Playwright Test? | `[PROJETO]` |
| 15.7 | Auto-wait do Playwright vs `waitForTestId` manual? | `[EXTRA]` |
| 15.8 | Trace Viewer Playwright — equivalente no Appium? | `[EXTRA]` |
| 15.9 | Migração Cypress → Appium mobile web — desafios? | `[EXTRA]` |
| 15.10 | Appium é mais lento que Playwright — por quê? | `[EXTRA]` |
| 15.11 | Mesmos `data-testid` funcionam em todas as suítes TestFlow? | `[PROJETO]` |
| 15.12 | API tests: Playwright `request` vs Axios+Mocha aqui? | `[PROJETO]` |
| 15.13 | Qual suíte usar para regressão visual desktop vs mobile? | `[PROJETO]` |
| 15.14 | Detox / Maestro vs Appium — quando cada um? | `[EXTRA]` |
| 15.15 | Appium Inspector vs Playwright Inspector? | `[EXTRA]` |

---

## 16. Mocha, Tags e Organização de Specs

| # | Pergunta | Tag |
|---|----------|-----|
| 16.1 | Como tags `@smoke`, `@regression`, `@appium` aparecem nos specs? | `[SLIDE]` `[PROJETO]` |
| 16.2 | O que `npm run test:grep:smoke` filtra? | `[PROJETO]` |
| 16.3 | O que significa prefixo `[TC-xxxx]` nos títulos? | `[PROJETO]` |
| 16.4 | Onde estão definidos os IDs em `support/constants/testCases.ts`? | `[PROJETO]` |
| 16.5 | Por que smoke usa loop `for (const page of PAGES)`? | `[PROJETO]` |
| 16.6 | Diferença entre `before` e `beforeEach` no navigation spec? | `[PROJETO]` |
| 16.7 | Como organizar specs por feature (`tests/team/`, `tests/wizard/`)? | `[PROJETO]` |
| 16.8 | Um spec deve testar uma página ou várias? | `[EXTRA]` |
| 16.9 | Como espelhar tags Gherkin sem Cucumber? | `[EXTRA]` |
| 16.10 | Por que `describe` aninhados são evitados em alguns specs? | `[EXTRA]` |
| 16.11 | Como pular teste condicionalmente (`it.skip`)? | `[EXTRA]` |
| 16.12 | Visual specs usam tag `@visual` — como rodar isolado? | `[PROJETO]` |

---

## 17. Flakiness, Debug e Estabilidade Mobile

| # | Pergunta | Tag |
|---|----------|-----|
| 17.1 | Causas comuns de flake em Appium mobile web? | `[SLIDE]` `[EXTRA]` |
| 17.2 | Como `waitUntil` em `openAppPath` reduz race no load? | `[PROJETO]` |
| 17.3 | Por que timeouts maiores no CI? | `[PROJETO]` |
| 17.4 | Como investigar `element not displayed` no login? | `[EXTRA]` |
| 17.5 | Chromedriver crash — sintomas e correção? | `[EXTRA]` |
| 17.6 | Emulador lento — estratégias de mitigação? | `[EXTRA]` |
| 17.7 | Como usar logs Appium (`logLevel: debug`)? | `[EXTRA]` |
| 17.8 | Screenshot + URL em falha — como ajuda debug? | `[PROJETO]` |
| 17.9 | `connectionRetryCount: 3` — quando ajuda? | `[PROJETO]` |
| 17.10 | Teclado cobrindo submit — padrão do projeto? | `[PROJETO]` |
| 17.11 | Swipe não scrolla o suficiente — o que ajustar? | `[EXTRA]` |
| 17.12 | Como evitar estado compartilhado entre specs? | `[EXTRA]` |
| 17.13 | Session invalid session id — causas? | `[EXTRA]` |
| 17.14 | Por que `maxInstances: 1` reduz flakiness local? | `[PROJETO]` |
| 17.15 | Como debugar com pause/`browser.debug()` no WDIO? | `[EXTRA]` |

---

## 18. Cenários Comportamentais e Situação-Problema

> Perguntas abertas frequentes em entrevistas sênior/lead — sem resposta única.

| # | Cenário |
|---|---------|
| 18.1 | Smoke passa no desktop Playwright mas falha no Appium com timeout em `page-dashboard`. Como investiga? |
| 18.2 | Emulador Android não alcança `10.0.2.2:5050`. Quais passos de diagnóstico? |
| 18.3 | O time quer rodar 80 specs mobile em paralelo. Qual estratégia com Appium? |
| 18.4 | Dev removeu `data-testid` do botão de login. Como reage? |
| 18.5 | Gestos de swipe são flaky no CI — como estabilizar? |
| 18.6 | Como introduzir testes iOS no pipeline sem macOS runner local? |
| 18.7 | API job passa mas UI falha com 401 — onde está o bug de sessão? |
| 18.8 | Chromedriver incompatível após update do Chrome no emulador. Plano de ação? |
| 18.9 | Como migrar 50 specs Selenium Grid para Appium 2 + WDIO? |
| 18.10 | PO pede 100% E2E mobile. Como negociar escopo? |
| 18.11 | Wizard com 12 steps é difícil de manter no mobile. Como simplificar? |
| 18.12 | Context switch falha em app híbrida — abordagem de debug? |
| 18.13 | Dois QAs criaram helpers de selector duplicados. Como padronizar? |
| 18.14 | Teste de orientação landscape passa no device físico e falha no emulador. Próximos passos? |
| 18.15 | Como testar deep link `myapp://` com Appium? |
| 18.16 | Allure no CI sem Java — alternativas? |
| 18.17 | Como validar push notification sem flakiness? |
| 18.18 | App white-label com 5 clientes — estrutura de capabilities? |
| 18.19 | Mesmo spec em 3 idiomas — abordagem com `data-testid`? |
| 18.20 | `loginViaApi` rápido vs cobertura de UI login — como balancear? |
| 18.21 | Emulador API 34 vs device API 28 — matriz de compatibilidade? |
| 18.22 | Proxy corporativo bloqueia download de Chromedriver. O que fazer? |
| 18.23 | Como documentar convenções Appium para onboarding de QAs? |
| 18.24 | Falha intermitente em `waitForTestId` após `swipeUp` — hipóteses? |
| 18.25 | Como espelhar nova suite Playwright (`widgets`) no Appium? |

---

## 19. Perguntas de Recrutador / Screening

> Perguntas iniciais de triagem — recrutadores e tech recruiters.

| # | Pergunta |
|---|----------|
| 19.1 | Você já trabalhou com Appium? Qual versão e contexto (nativo, híbrido, mobile web)? |
| 19.2 | Quantos anos de experiência com automação mobile? |
| 19.3 | Qual foi o maior projeto Appium que participou (specs, devices, CI)? |
| 19.4 | Já integrou Appium em CI/CD? Qual emulador/cloud (BS, Sauce, GH Actions)? |
| 19.5 | Conhece Page Object Model? Já implementou com WebdriverIO? |
| 19.6 | Qual diferença entre QA manual mobile e SDET mobile? |
| 19.7 | Você programa em TypeScript? Nível (1–5)? |
| 19.8 | Já usou `performActions` / gestos touch em testes? |
| 19.9 | Já escreveu testes de API com Mocha, Jest ou Postman? |
| 19.10 | Conhece Allure Report ou relatórios WDIO? |
| 19.11 | Como lida com testes instáveis em emulador? |
| 19.12 | Já trabalhou com BDD (Cucumber) em mobile? |
| 19.13 | Experiência com Android SDK / Xcode Simulator? |
| 19.14 | Já configurou `10.0.2.2` ou rede host-emulador? |
| 19.15 | Qual ferramenta domina além de Appium (Espresso, XCUITest direto, Detox)? |
| 19.16 | Já migrou suite Selenium para Appium 2? |
| 19.17 | Já mentorou QAs em automação mobile? |
| 19.18 | Acompanha changelog Appium / WebdriverIO? |
| 19.19 | Certificações (CTFL, ISTQB, Appium cursinhos)? |
| 19.20 | Por que Appium nesta vaga especificamente? |
| 19.21 | Conhece `async/await` e Promises em JavaScript? |
| 19.22 | Já usou GitHub Actions com emulador Android? |
| 19.23 | Confortável em code review de testes WDIO? |
| 19.24 | Já convencionou `data-testid` com time frontend? |
| 19.25 | Disponibilidade para pair com devs em bugs de automação? |

---

## Mapa rápido — testflow-appium

| Script npm | Spec | Tópicos para entrevista |
|------------|------|-------------------------|
| `test:smoke` | `smoke/navigation.spec.ts` | Data-driven pages, token smoke, sidebar nav, logout |
| `test:auth` | `auth/login.spec.ts` | UI login, validação, sessionStorage, Enter key |
| `test:dashboard` | `dashboard/dashboard.spec.ts` | KPIs, activity feed, new run modal |
| `test:team` | `team/team.spec.ts` | Tabela, search, filter, pagination, invite |
| `test:settings` | `settings/settings.spec.ts` | Form, toggles, save feedback |
| `test:components` | `components/components.spec.ts` | Toast, tabs, accordion, modal |
| `test:wizard` | `wizard/wizard.spec.ts` | Multi-step, validação, review |
| `test:activity` | `activity/activity.spec.ts` | Feed, filtros, países fixture |
| `test:advanced` | `advanced/advanced.spec.ts` | Shadow DOM, iframe, links externos |
| `test:states` | `states/states.spec.ts` | Skeleton, empty, error, loading |
| `test:layout` | `layout/shell.spec.ts` | Sidebar, notifications, skip link |
| `test:visual` | `visual/visual.spec.ts` | Screenshot baselines mobile |
| `test:api` | `api/auth.api.spec.ts` | REST health, login, users, errors |
| `test:gestures` | `gestures/gestures.spec.ts` | swipeUp/Down, longPress, scrollIntoView |
| `test:device` | `device/device.spec.ts` | Keyboard, orientation, capabilities |
| `test:contexts` | `contexts/webview.spec.ts` | listContexts, switchToWebContext, execute |
| `test:locators` | `locators/strategies.spec.ts` | CSS, XPath, waits, chaining |

---

## Estatísticas

| Métrica | Valor |
|---------|-------|
| Total de perguntas tabulares | **210+** |
| Cenários situacionais | **25** |
| Perguntas de screening | **25** |
| **Total geral** | **260+** |
| Cobertas nos slides `[SLIDE]` | ~95 |
| Presentes no projeto `[PROJETO]` | ~115 |
| Complementares `[EXTRA]` | ~75 |

---

## Como usar este material

1. **Preparação para entrevista:** escolha 3–5 categorias alinhadas à vaga (ex.: gestos + URL mapping + CI + POM).
2. **Mock interview:** sorteie 10 perguntas de categorias diferentes + 1 cenário situacional.
3. **Gap analysis:** marque `[ ]` nas perguntas que não sabe responder e estude nos slides ou na doc oficial.
4. **Evolução dos slides:** perguntas `[EXTRA]` e `[PROJETO]` sem slide são candidatas a novos tópicos na apresentação.
5. **Pair com a suíte:** rode `npm run test:<suite>` e relacione cada pergunta `[PROJETO]` ao spec correspondente.

---

## Referências sugeridas para estudo

- [Documentação oficial Appium](https://appium.io/docs/en/latest/)
- [WebdriverIO Docs](https://webdriver.io/docs/gettingstarted)
- [Appium 2 Drivers](https://appium.io/docs/en/latest/ecosystem/drivers/)
- [W3C WebDriver Actions](https://www.w3.org/TR/webdriver/#actions)
- Slides do projeto: [`docs/slides/index.html`](slides/index.html)
- Espelho Playwright: `testflow-playwright` + `docs/playwright-technical-interview-questions.md` (repo irmão)
- Suíte local: [`README.md`](../README.md), [`wdio.conf.ts`](../wdio.conf.ts), [`pages/`](../pages/), [`tests/`](../tests/)
- Walkthroughs: [`docs/en/README.md`](en/README.md) · [`docs/pt/README.md`](pt/README.md)
- Seletores: [`docs/selector-strategy.md`](selector-strategy.md)

---

*Gerado para o projeto TestFlow Appium — Junho 2026*
