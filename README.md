# Date Kincaid

A dating profile as a website. Live at [datekincaid.com](https://datekincaid.com).

## Commands

| Command          | Action                                         |
| :--------------- | :--------------------------------------------- |
| `pnpm install`   | Install dependencies                           |
| `pnpm dev`       | Start the dev server at https://localhost:5173 |
| `pnpm build`     | Build to `./dist/`                             |
| `pnpm preview`   | Preview the build locally                      |
| `pnpm test`      | Run the edge middleware tests                  |
| `pnpm typecheck` | Type check without emitting                    |
| `pnpm format`    | Format with Prettier                           |

Copy `.env.example` to `.env` to build the printable QR cards at `/print`. That route is left out of production builds.
