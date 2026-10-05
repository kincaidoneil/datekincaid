A single-page personal site, deployed on Vercel at datekincaid.com.

## Commands

| Command          | Does                                               |
| :--------------- | :------------------------------------------------- |
| `pnpm dev`       | Dev server on https://localhost:5173 (mkcert TLS)  |
| `pnpm build`     | Production build to `dist/`                        |
| `pnpm test`      | Runs the `*.test.ts` files on the node test runner |
| `pnpm typecheck` | `tsc --noEmit`                                     |
| `pnpm format`    | Prettier over the repo                             |

Run `pnpm typecheck` and `pnpm test` before calling a change done. CI runs both on every PR, along with `format:check` and a build.

## Stack

TanStack Router on Vite, React 19, Tailwind v4 (configured in CSS), motion for animation, jotai for shared state, PostHog for analytics.

Prettier owns formatting: no semicolons, sorted imports, sorted Tailwind classes.

## Layout

Routes are file-based in `src/routes`. `src/routeTree.gen.ts` is generated and gitignored, so never edit it. Import from `src` with the `@/` alias.

Long-form copy lives in `src/copy/*.mdx` rather than in components.

Images in `src/assets` are imported through vite-imagetools with `?as=metadata`, which returns dimensions along with the source. `LightboxImage` expects that shape.

## Two things that will surprise you

`src/routes/print.tsx` generates QR cards and is excluded from production builds. `vite.config.ts` drops it via `routeFileIgnorePattern` when `VERCEL` is set, which is why it can read `process.env` and why `qrcode` and `zod` are dev dependencies. Keep it out of the production bundle.

`middleware.ts` is Vercel edge middleware that tries to bounce Instagram's in-app browser out to a real one. The escape scheme is undocumented and Meta has broken it once already, so the rule is to always serve the page underneath the attempt. `middleware.test.ts` covers that.

## Analytics

`Analytics.tsx` strips the query string from every event and rewrites the URL on load. QR cards carry a VIP code and a phone number in the URL, and this is what stops a visitor from sharing those onward. Be careful changing it.

PostHog is proxied through `/p`, rewritten in `vercel.json`, so blocking PostHog's domains doesn't block it. Ad blockers also match some of PostHog's script filenames on any domain, so `Analytics.tsx` bundles those extensions with dynamic imports and sets `disable_external_dependency_loading`. If you turn on a PostHog feature that loads an extension (surveys, web vitals), import it there too, or it won't load.

## Age

The age on the profile comes from `api/age.ts`, not the source, so no commit or exact-date change gives away the birthday. It reads `BIRTHDAY` (`YYYY-MM-DD`) and `AGE_SECRET` (at least 32 random characters) from Vercel env vars, and moves the day the age ticks over to a secret offset of up to 45 days after the birthday. Never hardcode either value or the age. `pnpm dev` doesn't serve `/api`, so the age chip is hidden locally.
