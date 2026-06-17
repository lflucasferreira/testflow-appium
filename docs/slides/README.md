# Appium — Slides

Apresentação Reveal.js sobre Appium 2 + WebdriverIO (mobile web, gestos, contexts, POM, testflow-appium).

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Apresentação interativa (Reveal.js) |
| `guia-completo.html` | Guia passo a passo em português (instalação + todos os comandos) |
| `complete-guide.html` | Step-by-step guide in English (setup + all commands) |
| `css/theme-appium.css` | Tema visual Appium |
| `assets/appium-logo.png` | Official Appium logo |
| `assets/logos/` | Brand SVGs (macOS, Windows, Linux, Node.js, Docker, Android, etc.) |
| `css/logos.css` | Logo heading / chip styles |

## Visualizar no browser

```bash
npm run slides
# http://localhost:3336/docs/slides/                        ← slides Reveal.js
# http://localhost:3336/docs/slides/guia-completo.html      ← guia PT
# http://localhost:3336/docs/slides/complete-guide.html     ← guide EN
```

Abrir direto:

```bash
npm run slides:open
```

## Regenerar PDF

```bash
npm run slides:pdf
```

Gera `docs/slides/appium-intro-slides.pdf` via [decktape](https://github.com/astefanutti/decktape) (1280×720, todos os fragments visíveis).

## Export manual (Chrome)

1. Abra `http://localhost:3336/docs/slides/?print-pdf`
2. `Cmd+P` → Destino: **Salvar como PDF**
3. Layout: **Paisagem**, Margens: **Nenhuma**, **Gráficos de fundo** ativado
