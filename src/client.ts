import { HoudiniClient } from '$houdini'
import { PUBLIC_AWS_APPSYNC_ENDPOINT } from '$env/static/public'
import { getAccessToken } from '$lib/util'
import { invalidate } from '$app/navigation'
import { browser } from '$app/environment'

const retryOn401 = () => {
  return {
    end(ctx, { value, next, resolve }) {
      if (value.errors?.[0]?.errorType == 'UnauthorizedException' && !ctx.retried401 && browser) {
        // we got an unauthorized exception, lets fetch a new token and retry
        ctx.retried401 = true // make sure we only do this once
        invalidate('/auth/session').then(() => next(ctx))
        return
      }
      resolve(ctx)
    },
  }
}

export default new HoudiniClient({
  url: PUBLIC_AWS_APPSYNC_ENDPOINT,
  fetchParams() {
    const token = getAccessToken()
    if (token) {
      return { headers: { Authorization: token } }
    }
    return {}
  },
  throwOnError: {
    operations: ['all'],
    error: (errors, ctx) =>
      new Error(`(${ctx.artifact.name}): ` + errors.map((err) => err.message).join('. ') + '.'),
  },
  plugins: [retryOn401],
})
