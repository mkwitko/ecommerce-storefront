import { defineConfig, devices } from "@playwright/test";

/**
 * E2E dos fluxos de dinheiro e gestão. Pré-requisito: API em :3333 com
 * DEV_FAKE_PAYMENTS=true e banco com seed (`pnpm db:seed` no udv-shop-api) —
 * o Pix falso autoconfirma em ~8s pelo mesmo caminho do webhook real.
 * Rodou algumas vezes e a compra falhou com insufficient_stock? Rode o seed
 * de novo: ele repõe o estoque dos produtos de demonstração.
 * O servidor web sobe sozinho (ou reusa o `pnpm dev` que já estiver no ar).
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: false, // fluxos mexem no mesmo seed; em série ficam determinísticos
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    // sem chave publicável o cartão (e "Todo mês") fica indisponível; o teste de doação mensal
    // só precisa da UI habilitada, nunca carrega o Stripe de verdade.
    env: { ...(process.env as Record<string, string>), VITE_STRIPE_PUBLISHABLE_KEY: "pk_test_e2e_placeholder" },
    timeout: 120_000,
  },
});
