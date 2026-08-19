/**
 * Referral codes identify who shared a link, so they show up constantly in
 * PostHog breakdowns. A distinct ID is unusable there: no one can tell
 * `01a01ad4-8eee-743a-835e-42a9f496128e` from the next one at a glance.
 * These codes read as `swift-otter-4821` instead.
 */

export const REF_PARAM = "ref"

const REF_CODE_KEY = "refCode"

// prettier-ignore
const ADJECTIVES = [
  "amber", "bold", "brave", "bright", "brisk", "calm", "candid", "clever",
  "cosmic", "crisp", "curious", "daring", "deft", "eager", "early", "easy",
  "electric", "fair", "fearless", "fleet", "fond", "frank", "gentle", "giddy",
  "glad", "golden", "grand", "happy", "hardy", "honest", "humble", "ideal",
  "jolly", "keen", "kind", "lively", "loyal", "lucid", "lunar", "mellow",
  "merry", "mighty", "nimble", "noble", "plucky", "polar", "proud", "quick",
  "quiet", "rapid", "ready", "regal", "rustic", "sharp", "silent", "smooth",
  "solar", "spry", "stellar", "sunny", "swift", "tidy", "vivid", "witty",
]

// prettier-ignore
const NOUNS = [
  "acorn", "anchor", "arrow", "aspen", "badger", "beacon", "birch", "bison",
  "bluff", "brook", "canyon", "cedar", "cobalt", "comet", "coral", "cove",
  "crane", "delta", "dune", "ember", "falcon", "fern", "fjord", "forest",
  "garnet", "glacier", "harbor", "hawk", "heron", "isle", "ivory", "jasper",
  "kestrel", "lantern", "ledge", "lily", "lynx", "maple", "marsh", "meadow",
  "mesa", "moth", "oak", "ocean", "onyx", "orchid", "otter", "owl", "panther",
  "pebble", "pine", "quartz", "quill", "raven", "reef", "ridge", "river",
  "sable", "sparrow", "summit", "thicket", "tundra", "willow", "wren",
]

/** Inbound codes come from a URL, so treat them as untrusted before sending them to PostHog. */
const INBOUND_PATTERN = /^[A-Za-z0-9_-]{1,64}$/

function randomInt(maxExclusive: number): number {
  // Discard the tail of the 32-bit range that would otherwise bias the modulo.
  const limit = Math.floor(0xffffffff / maxExclusive) * maxExclusive
  const buffer = new Uint32Array(1)
  let value: number
  do {
    crypto.getRandomValues(buffer)
    value = buffer[0]
  } while (value >= limit)
  return value % maxExclusive
}

function createRefCode(): string {
  const adjective = ADJECTIVES[randomInt(ADJECTIVES.length)]
  const noun = NOUNS[randomInt(NOUNS.length)]
  const digits = 1000 + randomInt(9000)
  return `${adjective}-${noun}-${digits}`
}

/** This visitor's own code, minted once and reused for every link they share. */
export function getRefCode(): string {
  const existing = localStorage.getItem(REF_CODE_KEY)
  if (existing && INBOUND_PATTERN.test(existing)) return existing

  const code = createRefCode()
  localStorage.setItem(REF_CODE_KEY, code)
  return code
}

/** Accepts legacy distinct-ID codes too, since links shared before this change are still circulating. */
export function parseInboundRef(value: string | null): string | undefined {
  if (!value || !INBOUND_PATTERN.test(value)) return undefined
  return value
}
