import type { BetterAuthPlugin } from "better-auth"
import { createAuthMiddleware } from "better-auth/plugins"

export const tauri = ({
    scheme
}: {
    scheme: string
}) =>
    ({
        id: "tauriPlugin",
        hooks: {
            before: [
                {
                    matcher: (context) => !context.request?.url?.includes("reset-password"),
                    handler: createAuthMiddleware(async (ctx) => {
                        if (!ctx.request) return

                        console.log("[Better Auth Tauri] Request URL:", ctx.request.url)

                        const url = new URL(ctx.request.url)

                        // First Check user agent for Tauri then redirect to tauri://localhost?authFetch=
                        const userAgent = ctx.request.headers.get("user-agent")
                        const host = ctx.request.headers.get("host")

                        console.log("host", host)
                        if (userAgent?.includes("Tauri/") && !host?.startsWith("localhost")) {
                            const authFetch = encodeURIComponent(
                                `${url.pathname}?${url.searchParams.toString()}`
                            )

                            console.log(
                                "[Better Auth Tauri] Redirecting to:",
                                `tauri://localhost?authFetch=${authFetch}`
                            )

                            const redirectTo = `tauri://localhost?authFetch=${authFetch}`
                            throw ctx.redirect(redirectTo)
                        }

                        // If not Tauri user agent then check callbackURL for deep link redirects
                        const searchParams = url.searchParams
                        const callbackURL = searchParams.get("callbackURL")

                        console.log("[Better Auth Tauri] Callback URL:", callbackURL)

                        if (!callbackURL?.startsWith(`${scheme}://`)) return

                        // Remove the Deep Link URL scheme from the callbackURL
                        searchParams.set("callbackURL", callbackURL.replace(`${scheme}:/`, ""))

                        const deepLinkURL = `${scheme}:/${url.pathname}?${searchParams.toString()}`

                        console.log("[Better Auth Tauri] Redirecting to:", deepLinkURL)
                        throw ctx.redirect(deepLinkURL)
                    })
                }
            ]
        }
    }) satisfies BetterAuthPlugin
