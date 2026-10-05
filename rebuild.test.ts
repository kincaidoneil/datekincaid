import assert from "node:assert/strict"
import { test } from "node:test"

import { GET } from "./api/rebuild.ts"

const HOOK = "https://api.vercel.com/v1/integrations/deploy/prj_x/hook"

async function call(authorization?: string) {
  const original = globalThis.fetch
  const hookCalls: string[] = []
  globalThis.fetch = async (input) => {
    hookCalls.push(String(input))
    return new Response(null, { status: 201 })
  }
  process.env.CRON_SECRET = "s3cret"
  process.env.DEPLOY_HOOK_URL = HOOK
  try {
    const response = await GET(
      new Request("https://datekincaid.com/api/rebuild", {
        headers: authorization ? { authorization } : {},
      }),
    )
    return { status: response.status, hookCalls }
  } finally {
    globalThis.fetch = original
    delete process.env.CRON_SECRET
    delete process.env.DEPLOY_HOOK_URL
  }
}

test("the cron's request triggers the deploy hook", async () => {
  assert.deepEqual(await call("Bearer s3cret"), {
    status: 204,
    hookCalls: [HOOK],
  })
})

test("anyone else is turned away without a build", async () => {
  assert.deepEqual(await call(), { status: 401, hookCalls: [] })
  assert.deepEqual(await call("Bearer wrong"), { status: 401, hookCalls: [] })
})
