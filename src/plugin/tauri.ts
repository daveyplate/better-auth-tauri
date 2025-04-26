import type { BetterAuthPlugin } from "better-auth"
import { createAuthMiddleware } from "better-auth/plugins"
import type { SocialProvider } from "better-auth/social-providers"

export const tauri = ({
    scheme,
    debugLogs,
    callbackURL = "/"
}: {
    scheme: string
    debugLogs?: boolean
    callbackURL?: string
}) =>
    ({
        id: "tauriPlugin",
        hooks: {
            before: [
                {
                    matcher: (context) => !context.request?.url?.includes("reset-password"),
                    handler: createAuthMiddleware(async (ctx) => {
                        if (!ctx.request) return

                        if (debugLogs) {
                            console.log("[Better Auth Tauri] Request URL:", ctx.request.url)
                        }

                        // Always use /api/auth as basePath when redirecting to Tauri
                        const basePath = ctx.context.options.basePath ?? "/api/auth"
                        const url = new URL(ctx.request.url.replace(basePath, "/api/auth"))

                        // First Check user agent for Tauri/ then redirect to tauri://localhost?authFetch=
                        const userAgent = ctx.request.headers.get("user-agent")
                        const host = ctx.request.headers.get("host")

                        // The host check for localhost is to prevent redirecting to tauri:// when running in dev mode
                        if (userAgent?.includes("Tauri/") && !host?.startsWith("localhost")) {
                            const authFetch = encodeURIComponent(
                                `${url.pathname}?${url.searchParams.toString()}`
                            )

                            if (debugLogs) {
                                console.log(
                                    "[Better Auth Tauri] Redirecting to:",
                                    `tauri://localhost?authFetch=${authFetch}`
                                )
                            }

                            const redirectTo = `tauri://localhost?authFetch=${authFetch}`
                            throw ctx.redirect(redirectTo)
                        }

                        if (userAgent?.includes("tauri")) {
                            if (ctx.context.options.socialProviders) {
                                Object.keys(ctx.context.options.socialProviders).map((key) => {
                                    ctx.context.options.socialProviders![
                                        key as SocialProvider
                                    ]!.redirectURI =
                                        `${ctx.context.baseURL}/callback/${key}?callbackURL=${scheme}:/${callbackURL}`
                                })
                            }
                        } else if (!userAgent?.includes("Tauri/")) {
                            // If not Tauri user agent then check callbackURL for deep link redirects
                            const searchParams = url.searchParams
                            const callbackURL = searchParams.get("callbackURL")

                            if (debugLogs) {
                                console.log("[Better Auth Tauri] Callback URL:", callbackURL)
                            }

                            if (!callbackURL?.startsWith(`${scheme}://`)) return

                            // Remove the Deep Link URL scheme from the callbackURL
                            searchParams.set("callbackURL", callbackURL.replace(`${scheme}:/`, ""))

                            const deepLinkURL = `${scheme}:/${url.pathname}?${searchParams.toString()}`

                            if (debugLogs) {
                                console.log("[Better Auth Tauri] Redirecting to:", deepLinkURL)
                            }

                            throw ctx.redirect(deepLinkURL)
                        }
                    })
                }
            ]
        }
    }) satisfies BetterAuthPlugin
