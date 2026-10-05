/**
 * Serves the age shown on the profile without publishing the birthday.
 *
 * Hardcoding the age leaks the birthday through the commit that bumps it, and
 * computing it on the exact date leaks the birthday to anyone who checks the
 * page daily. So the birthday lives in an env var, and each year the age ticks
 * over on a day somewhere in the JITTER_DAYS after it. The offset comes from
 * an HMAC of the year, so it holds steady within a year but differs between
 * years, and an observer can't line several years up.
 *
 * The HMAC key has to be its own random secret. Keyed on the birthday alone,
 * there are few enough candidate dates to try every one against the day the
 * age changed.
 */

const JITTER_DAYS = 45
const DAY_MS = 24 * 60 * 60 * 1000

export interface AgeConfig {
  birthday: { year: number; month: number; day: number }
  secret: string
}

export function parseConfig(env: {
  BIRTHDAY?: string
  AGE_SECRET?: string
}): AgeConfig | undefined {
  const match = env.BIRTHDAY?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match || !env.AGE_SECRET || env.AGE_SECRET.length < 32) return undefined

  const [year, month, day] = match.slice(1).map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  // Rejects dates that roll over, like 1998-02-30.
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return undefined
  }
  return { birthday: { year, month, day }, secret: env.AGE_SECRET }
}

/** When the age shown for `year`'s birthday takes effect, in ms since the epoch. */
export async function tickOver(config: AgeConfig, year: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(config.secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(String(year)),
  )
  const offsetDays = new DataView(mac).getUint32(0) % JITTER_DAYS
  const { month, day } = config.birthday
  return Date.UTC(year, month - 1, day) + offsetDays * DAY_MS
}

export async function shownAge(config: AgeConfig, now: Date) {
  // A late-December birthday can tick over in the next calendar year, so step
  // back until we find the last one that has.
  let year = now.getUTCFullYear()
  while ((await tickOver(config, year)) > now.getTime()) year--
  return year - config.birthday.year
}

export async function GET() {
  const config = parseConfig(process.env)
  if (!config) return new Response(null, { status: 503 })

  return Response.json(
    { age: await shownAge(config, new Date()) },
    { headers: { "cache-control": "public, max-age=0, s-maxage=3600" } },
  )
}
