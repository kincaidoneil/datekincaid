import assert from "node:assert/strict"
import { test } from "node:test"

import { parseConfig, shownAge, tickOver } from "./age.ts"

const SECRET = "a".repeat(32)

function config(birthday: string) {
  const parsed = parseConfig({ BIRTHDAY: birthday, AGE_SECRET: SECRET })
  assert.ok(parsed)
  return parsed
}

const DAY_MS = 24 * 60 * 60 * 1000

test("the age ticks over on the jittered day, not the birthday", async () => {
  const c = config("1998-10-15")
  const tick = await tickOver(c, 2026)

  assert.equal(await shownAge(c, new Date(tick - 1)), 27)
  assert.equal(await shownAge(c, new Date(tick)), 28)
})

test("the jitter stays within 45 days and varies by year", async () => {
  const c = config("1998-10-15")
  const offsets = new Set<number>()
  for (let year = 2020; year < 2060; year++) {
    const offset = ((await tickOver(c, year)) - Date.UTC(year, 9, 15)) / DAY_MS
    assert.ok(Number.isInteger(offset) && offset >= 0 && offset < 45)
    offsets.add(offset)
  }
  assert.ok(offsets.size > 10, `only saw offsets ${[...offsets]}`)
})

test("the jitter depends on the secret, not just the birthday", async () => {
  const other = parseConfig({
    BIRTHDAY: "1998-10-15",
    AGE_SECRET: "b".repeat(32),
  })
  assert.ok(other)
  const ticks = []
  for (let year = 2020; year < 2030; year++) {
    ticks.push(
      (await tickOver(config("1998-10-15"), year)) ===
        (await tickOver(other, year)),
    )
  }
  assert.ok(ticks.includes(false))
})

test("a late-December birthday can tick over in the new year", async () => {
  const c = config("1998-12-31")
  for (let year = 2020; year < 2060; year++) {
    const tick = await tickOver(c, year)
    if (new Date(tick).getUTCFullYear() === year) continue

    // Between New Year's Day and the tick, the previous birthday hasn't counted yet.
    assert.equal(await shownAge(c, new Date(tick - 1)), year - 1 - 1998)
    assert.equal(await shownAge(c, new Date(tick)), year - 1998)
    return
  }
  assert.fail("no year ticked over after New Year's")
})

test("misconfiguration is rejected rather than guessed at", () => {
  assert.equal(parseConfig({ AGE_SECRET: SECRET }), undefined)
  assert.equal(parseConfig({ BIRTHDAY: "1998-10-15" }), undefined)
  assert.equal(
    parseConfig({ BIRTHDAY: "1998-10-15", AGE_SECRET: "short" }),
    undefined,
  )
  assert.equal(
    parseConfig({ BIRTHDAY: "1998-02-30", AGE_SECRET: SECRET }),
    undefined,
  )
  assert.equal(
    parseConfig({ BIRTHDAY: "10/15/1998", AGE_SECRET: SECRET }),
    undefined,
  )
})
