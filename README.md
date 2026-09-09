<div align="center">

# 🎭 SauceDemo QA Automation Hub

### End-to-End UI Testing powered by **Playwright**, **Playwright Agents (MCP)** & **GitHub Copilot**

[![Playwright](https://img.shields.io/badge/Playwright-1.4x-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Agent%20Mode-8957E5?style=for-the-badge&logo=githubcopilot&logoColor=white)](https://github.com/features/copilot)
[![Allure Report](https://img.shields.io/badge/Allure-Report-FF5A5F?style=for-the-badge&logo=qameta&logoColor=white)](https://allurereport.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#-license)

*A production-grade, AI-assisted test automation suite for [saucedemo.com](https://www.saucedemo.com), built with the Page Object Model, secure fixtures, and CI-ready parallel execution.*

</div>

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Why Playwright Agents + GitHub Copilot?](#-why-playwright-agents--github-copilot)
3. [Project Architecture](#-project-architecture)
4. [Tech Stack](#-tech-stack)
5. [Getting Started](#-getting-started)
6. [Authentication Setup (Login Once, Reuse Everywhere)](#-authentication-setup-login-once-reuse-everywhere)
7. [Page Object Model & Fixtures](#-page-object-model--fixtures)
8. [Running Tests](#-running-tests)
9. [Reporting — HTML & Allure](#-reporting--html--allure)
10. [Roadmap — What's Next 🚀](#-roadmap--whats-next-)
11. [Contributing](#-contributing)
12. [License](#-license)

---

## 🧭 Overview

This repository contains a **scalable, maintainable, and AI-augmented** end-to-end test automation framework for the **Sauce Demo** e-commerce application. It validates critical user journeys — **login, inventory browsing, cart management, checkout, and navigation** — using industry best practices such as the **Page Object Model (POM)**, **custom fixtures**, **storage-state based authentication**, and **rich dual reporting (HTML + Allure)**.

What makes this project stand out is that it was **built and continuously maintained using Playwright Agents (via MCP) and GitHub Copilot's Agent Mode**, drastically reducing the time needed to author, debug, and heal UI tests.

| Metric | Details |
|---|---|
| 🧪 Functional Coverage | Login, Inventory & Cart, Checkout, Hamburger Menu |
| 🌐 Browser Support | Chromium, Firefox, WebKit |
| 🏗️ Design Pattern | Page Object Model + Custom Fixtures |
| 📊 Reporting | Playwright HTML + Allure |
| 🔐 Credential Handling | Environment-isolated, git-ignored |
| 🤖 Authoring Approach | Playwright Agents + GitHub Copilot |

---

## 🤖 Why Playwright Agents + GitHub Copilot?

Traditional UI test authoring is slow — you inspect the DOM manually, write locators by hand, and debug flaky selectors one at a time. This project leverages **Playwright's MCP (Model Context Protocol) Agent** integrated with **GitHub Copilot Agent Mode** inside VS Code to change that workflow entirely.

### How it accelerates this project:

- 🕵️ **Live DOM Exploration** — The Playwright Agent drives a real browser, inspects the live page structure, and proposes accurate, resilient locators (role-based, test-id based) instead of brittle CSS/XPath guesses.
- ✍️ **Auto-generated Test Plans** — Every feature (`login`, `inventory-cart`, `cart-checkout`, `hamburger-menu`) has a corresponding Markdown test plan under `/specs`, generated collaboratively with Copilot by exploring the app's real behavior first.
- 🧩 **Page Object Scaffolding** — Copilot Agent Mode scaffolds Page Object classes and fixtures directly from the explored DOM, keeping locators centralized and consistent.
- 🔁 **Self-Healing Iteration** — When a selector breaks, the agent re-inspects the live page and Copilot suggests the corrected locator — turning a manual debugging session into a few review clicks.
- 🧪 **Edge Case Discovery** — Because the agent actually *navigates* the app (invalid logins, empty carts, locked users, price boundaries), it surfaces negative and edge scenarios a developer might miss when writing tests purely from requirements.

> 💡 In short: **Playwright Agents give Copilot "eyes" on the real browser**, so suggestions are grounded in the actual application instead of guesses — resulting in faster authoring, fewer flaky locators, and better test coverage.

---

## 🏗️ Project Architecture

```
playwrightmcp/
├── .github/
│   ├── agents/                          # Agent configuration for automated workflows
│   └── workflows/
│       └── copilot-setup-steps.yml      # Pipeline scaffold (Copilot-assisted setup)
├── .playwright-mcp/                     # Playwright MCP agent session/config
├── .vscode/                             # Editor + Copilot Agent settings
├── allure-report/                       # Generated Allure HTML report
├── allure-results/                      # Raw Allure result artifacts
├── Fixtures/
│   └── sauce-demo-checkout.fixture.js   # Custom fixtures (auth, cart pre-seed, etc.)
├── pages/                               # Page Object Model
│   ├── sauce-demo-checkout.page.js
│   └── sauce-demo-inventory-cart.page.js
├── playwright/.auth/
│   └── user.json                        # Saved storage state (session reuse)
├── playwright-report/
│   └── index.html                       # Native Playwright HTML report
├── specs/                               # Human-readable test plans (Markdown)
│   ├── README.md
│   ├── sauce-demo-cart-checkout-pdf-test-plan.md
│   ├── sauce-demo-hamburger-menu-test-plan.md
│   ├── sauce-demo-inventory-cart-test-plan.md
│   └── sauce-demo-login-test-plan.md
├── tests/                               # Spec files (executable tests)
│   ├── auth.setup.js                    # Global login/auth bootstrap
│   ├── sauce-demo-cart-checkout.spec.js
│   ├── sauce-demo-hamburger-menu.spec.js
│   ├── sauce-demo-inventory-cart.spec.js
│   ├── sauce-demo-login.spec.js
│   └── seed.spec.ts
├── .env                                 # Secure environment variables (git-ignored)
├── .gitignore
├── package.json
├── package-lock.json
└── playwright.config.js                 # Central config (browsers, parallelism, reporters)
```

---

## 🧰 Tech Stack

| Category | Tools |
|---|---|
| Test Framework | [Playwright](https://playwright.dev/) (`@playwright/test`) |
| Language | JavaScript / TypeScript |
| AI Authoring | Playwright Agents (MCP) + GitHub Copilot Agent Mode |
| Reporting | Playwright HTML Reporter, Allure Report |
| Auth Strategy | Storage State (`playwright/.auth/user.json`) |
| Secrets Management | `dotenv` (`.env`) |
| Design Pattern | Page Object Model (POM) + Custom Fixtures |

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+**
- npm or yarn
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/playwrightmcp.git
cd playwrightmcp

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps

# 4. Create your local .env file with SauceDemo credentials
cp .env.example .env
```

---

## 🔑 Authentication Setup (Login Once, Reuse Everywhere)

Logging in before *every single test* is slow and redundant. This project uses Playwright's **global setup + storage state** pattern:

**`tests/auth.setup.js`**
- Runs once before the test suite.
- Logs in using credentials loaded from environment variables (never hardcoded in test files).
- Saves the authenticated browser session (cookies/local storage) to `playwright/.auth/user.json`.

**`playwright.config.js`** then injects that saved session into every subsequent test project via `storageState`, so tests start **already logged in** — faster, more stable, and closer to real-world session reuse.

```js
// simplified concept
setup('authenticate', async ({ page }) => {
  await page.goto(process.env.BASE_URL);
  await page.getByPlaceholder('Username').fill(process.env.STANDARD_USER);
  await page.getByPlaceholder('Password').fill(process.env.PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

---

## 🧩 Page Object Model & Fixtures

| File | Responsibility |
|---|---|
| `pages/sauce-demo-inventory-cart.page.js` | Locators & actions for product listing, sorting, add/remove-to-cart |
| `pages/sauce-demo-checkout.page.js` | Locators & actions for checkout form (info, overview, complete) |
| `Fixtures/sauce-demo-checkout.fixture.js` | Custom Playwright fixture that extends `test`, auto-injecting an authenticated page + pre-seeded cart state so specs stay clean and DRY |

**Why this matters:**
- ✅ Single source of truth for selectors — update once, fixes propagate everywhere.
- ✅ Tests read like plain English (`checkoutPage.fillShippingInfo(...)`).
- ✅ Fixtures eliminate repetitive `beforeEach` boilerplate across spec files.

---

## ▶️ Running Tests

```bash
# Run the entire suite
npx playwright test

# Run a specific spec file
npx playwright test tests/sauce-demo-login.spec.js

# Run in headed (visible browser) mode
npx playwright test --headed

# Run in debug / step-through mode
npx playwright test --debug

# Run a single project/browser
npx playwright test --project=chromium

# Run tests matching a title
npx playwright test -g "checkout"
```

---

## 📊 Reporting — HTML & Allure

This project ships with **two complementary reporting layers**:

### 1️⃣ Playwright's Native HTML Report
```bash
npx playwright test
npx playwright show-report
```
Generates `playwright-report/index.html` — includes step-by-step traces, screenshots, videos on failure, and execution timelines.

### 2️⃣ Allure Report (Rich, Stakeholder-Friendly)
```bash
# Generate raw results during test run (configured in playwright.config.js)
npx playwright test --reporter=line,allure-playwright

# Generate and open the interactive Allure dashboard
npx allure generate ./allure-results --clean -o ./allure-report
npx allure open ./allure-report
```

| Report | Best For |
|---|---|
| 🎭 Playwright HTML | Developers — trace viewer, DOM snapshots, network logs |
| 📈 Allure | QA Leads / Stakeholders — trends, categorized failures, history graphs, severity tagging |

---

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/api-mocking`
3. Use the Playwright Agent (MCP) in Copilot Agent Mode to explore any new UI flow before writing locators
4. Add/update the relevant test plan under `/specs`
5. Implement the spec under `/tests`, following existing POM + fixture conventions
6. Ensure `npx playwright test` passes locally
7. Open a Pull Request 🎉


---

Made with 🎭 Playwright · 🤖 Playwright Agents · 🧑‍💻 GitHub Copilot

</div>
