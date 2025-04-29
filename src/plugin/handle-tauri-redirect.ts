import type { AuthContext } from "better-auth/types"

import type { MiddlewareContext, MiddlewareOptions } from "better-auth"

// First Check user agent for Tauri/ then redirect to tauri://localhost?authFetch=
export function handleTauriRedirect({
    baseURL,
    ctx,
    debugLogs,
    url
}: {
    baseURL: string
    ctx: MiddlewareContext<MiddlewareOptions, AuthContext>
    debugLogs?: boolean
    url: URL
}) {
    if (!ctx.request) return

    const userAgent = ctx.request.headers.get("user-agent")
    const host = ctx.request.headers.get("host")

    // The host check for localhost is to prevent redirecting to tauri:// when running in dev mode
    if (userAgent?.includes("Tauri/") && !host?.startsWith("localhost")) {
        const authFetch = encodeURIComponent(`${url.pathname}?${url.searchParams.toString()}`)

        const redirectTo = `${baseURL}?authFetch=${authFetch}`

        if (debugLogs) {
            console.log("[Better Auth Tauri] Redirecting to:", redirectTo, url.pathname)
        }

        throw ctx.redirect(redirectTo)
    }
}
