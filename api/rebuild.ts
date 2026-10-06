/**
 * Called daily by the cron in `vercel.json`. Rebuilding every day keeps the
 * age that `age.ts` bakes into the build current. Because a build happens
 * every day either way, the build times don't reveal which day the age changed.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET` with cron requests. The
 * check stops anyone else from triggering builds.
 */
export async function GET(request: Request) {
  const { CRON_SECRET, DEPLOY_HOOK_URL } = process.env
  if (!CRON_SECRET || !DEPLOY_HOOK_URL) {
    return new Response(null, { status: 503 })
  }
  if (request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return new Response(null, { status: 401 })
  }

  const hook = await fetch(DEPLOY_HOOK_URL, { method: "POST" })
  return new Response(null, { status: hook.ok ? 204 : 502 })
}
