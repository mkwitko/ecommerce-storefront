# Engineering case study: SSR React storefront

## What the code demonstrates

A React storefront and store-management interface using TanStack Start, typed API clients, responsive component design and Cloudflare Workers deployment configuration. It is built against the separate [Fastify API](https://github.com/mkwitko/udv-shop-api).

## Data flow

~~~mermaid
flowchart LR
  Browser["Visitor"] --> Route["TanStack Start route loader"]
  Route --> Cache["TanStack Query cache"]
  Cache --> SDK["Kubb-generated hooks / client"]
  SDK --> API["Fastify API with OpenAPI contracts"]
  Cache --> UI["React components"]
~~~

## Decisions worth discussing in an interview

**SSR data hydration.** Public route loaders prefetch data through TanStack Query. The same cache is hydrated for client components to avoid unnecessary duplicate loading. Inspect [architecture documentation](ARCHITECTURE.md) and [homepage route](../src/routes/index.tsx).

**Backend contract ownership.** The frontend generates clients and validation schemas from the API OpenAPI document rather than hand-writing request and response types. The entry point is [Kubb configuration](../kubb.config.ts), with generated modules under [src/lib/api/gen](../src/lib/api/gen). Changing API schemas requires regenerating the client.

**Session boundary.** Authentication separates short-lived access tokens in memory from refresh cookies issued by the API. Public fetches deliberately avoid propagating session credentials. Details in [architecture notes](ARCHITECTURE.md); actual security properties still require operational verification.

**Product experience.** Routes cover storefront discovery, account creation, purchasing/donating flows, and store management. Styling constraints are documented in [DESIGN.md](DESIGN.md) rather than spread as ad-hoc conventions.

## Quality evidence

The repository includes tests for UX navigation, product changes, checkout and donations under [e2e](../e2e) and declares Vitest and Playwright quality scripts. Their presence is verifiable; **passing CI and production behavior must be checked separately**.

## Honest trade-offs

| Choice | Why | Trade-off |
| --- | --- | --- |
| SSR and query prefetching | Faster useful first HTML and shared data cache | Requires careful hydration and session treatment |
| Typed API generation | Fewer duplicated client contracts | Code generation is another build discipline |
| Explicit design system | Consistent visual language | Design tokens and primitives require maintenance |
| Separate web / API repositories | Independent concerns and deployments | Cross-repository contract alignment matters |

## Next portfolio evidence

Add two real redacted screenshots captured from the application: public storefront and authenticated store-management flow. Document actual accessibility checks, performance results and supported browsers after running the relevant tools. Do not use mock screenshots or fabricate Lighthouse scores.
