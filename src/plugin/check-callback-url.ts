import type { AuthContext } from "better-auth/types"

import type { MiddlewareContext, MiddlewareOptions } from "better-auth"

export function checkCallbackURL({
    ctx,
    debugLogs,
    scheme,
    successURL,
    url
}: {
    ctx: MiddlewareContext<MiddlewareOptions, AuthContext>
    debugLogs?: boolean
    scheme: string
    successURL?: string
    url: URL
}) {
    if (!ctx.request) return

    const userAgent = ctx.request.headers.get("user-agent")
    if (userAgent?.includes("Tauri/") || userAgent?.includes("tauri")) return

    // If not Tauri user agent then check callbackURL for deep link redirects
    const searchParams = url.searchParams
    const callbackURL = searchParams.get("callbackURL")

    if (debugLogs) {
        console.log("[Better Auth Tauri] Callback URL:", callbackURL, url.pathname)
    }

    if (!callbackURL?.startsWith(`${scheme}://`)) return

    // Remove the Deep Link URL scheme from the callbackURL
    searchParams.set("callbackURL", callbackURL.replace(`${scheme}:/`, ""))

    const deepLinkURL = `${scheme}:/${url.pathname}?${searchParams.toString()}`

    if (debugLogs) {
        console.log("[Better Auth Tauri] Redirecting to:", deepLinkURL, url.pathname)
    }

    throw ctx.redirect(
        successURL
            ? `${successURL}?tauriRedirect=${encodeURIComponent(deepLinkURL)}`
            : `${ctx.context.baseURL}/tauri/redirect?tauriRedirect=${encodeURIComponent(deepLinkURL)}`
    )
}
