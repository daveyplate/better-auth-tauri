import type { MiddlewareContext, MiddlewareOptions } from "better-auth"
import type { SocialProvider } from "better-auth/social-providers"
import type { AuthContext } from "better-auth/types"

export function appendCallbackURL({
    callbackURL,
    ctx,
    debugLogs,
    scheme,
    url
}: {
    callbackURL: string
    ctx: MiddlewareContext<MiddlewareOptions, AuthContext>
    debugLogs?: boolean
    scheme: string
    url: URL
}) {
    if (!ctx.request) return

    const userAgent = ctx.request.headers.get("user-agent")
    if (!userAgent?.includes("tauri")) return

    if (ctx.context.options.socialProviders) {
        Object.keys(ctx.context.options.socialProviders).map((key) => {
            if (debugLogs) {
                console.log(
                    "[Better Auth Tauri] Appending callback URL to social provider",
                    key,
                    `${ctx.context.baseURL}/callback/${key}?callbackURL=${scheme}:/${callbackURL}`
                )
            }

            ctx.context.options.socialProviders![key as SocialProvider]!.redirectURI =
                `${ctx.context.baseURL}/callback/${key}?callbackURL=${scheme}:/${callbackURL}`
        })
    }
}
