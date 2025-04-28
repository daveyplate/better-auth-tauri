import type { BetterAuthPlugin } from "better-auth"
import { createAuthEndpoint, createAuthMiddleware } from "better-auth/plugins"
import type { SocialProvider } from "better-auth/social-providers"
import { html } from "./html"

export const tauri = ({
    baseURL = "tauri://localhost",
    callbackURL = "/",
    debugLogs,
    scheme,
    successText = "Your authentication was successful. You may now close this window and return to the application.",
    successURL = "tauri://localhost"
}: {
    baseURL?: string
    callbackURL?: string
    debugLogs?: boolean
    scheme: string
    successText?: string
    successURL?: string
}) =>
    ({
        id: "tauriPlugin",
        hooks: {
            before: [
                {
                    matcher: (context) =>
                        !context.request?.url?.includes("/reset-password") &&
                        !context.request?.url?.includes("/tauri/redirect"),
                    handler: createAuthMiddleware(async (ctx) => {
                        if (!ctx.request) return

                        if (debugLogs) {
                            console.log("[Better Auth Tauri] Request URL:", ctx.request.url)
                        }

                        // Always use /api/auth as basePath when redirecting to Tauri
                        const basePath = ctx.context.options.basePath ?? "/api/auth"
                        const url = new URL(ctx.request.url)
                        url.pathname = url.pathname.replace(basePath, "/api/auth")

                        // First Check user agent for Tauri/ then redirect to tauri://localhost?authFetch=
                        const userAgent = ctx.request.headers.get("user-agent")
                        const host = ctx.request.headers.get("host")

                        if (debugLogs) {
                            console.log("[Better Auth Tauri] User agent:", userAgent, url.pathname)
                            console.log("[Better Auth Tauri] Host:", host, url.pathname)
                        }

                        // The host check for localhost is to prevent redirecting to tauri:// when running in dev mode
                        if (userAgent?.includes("Tauri/") && !host?.startsWith("localhost")) {
                            const authFetch = encodeURIComponent(
                                `${url.pathname}?${url.searchParams.toString()}`
                            )

                            const redirectTo = `${baseURL}?authFetch=${authFetch}`

                            if (debugLogs) {
                                console.log(
                                    "[Better Auth Tauri] Redirecting to:",
                                    redirectTo,
                                    url.pathname
                                )
                            }

                            throw ctx.redirect(redirectTo)
                        }

                        if (userAgent?.includes("tauri")) {
                            if (debugLogs) {
                                console.log(
                                    "[Better Auth Tauri] User agent is Tauri HTTP plugin",
                                    url.pathname
                                )
                            }

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
                                console.log(
                                    "[Better Auth Tauri] Callback URL:",
                                    callbackURL,
                                    url.pathname
                                )
                            }

                            if (!callbackURL?.startsWith(`${scheme}://`)) return

                            // Remove the Deep Link URL scheme from the callbackURL
                            searchParams.set("callbackURL", callbackURL.replace(`${scheme}:/`, ""))

                            const deepLinkURL = `${scheme}:/${url.pathname}?${searchParams.toString()}`

                            if (debugLogs) {
                                console.log(
                                    "[Better Auth Tauri] Redirecting to:",
                                    deepLinkURL,
                                    url.pathname
                                )
                            }

                            throw ctx.redirect(
                                successURL
                                    ? `${successURL}?tauriRedirect=${encodeURIComponent(deepLinkURL)}`
                                    : `${ctx.context.baseURL}/tauri/redirect?tauriRedirect=${encodeURIComponent(deepLinkURL)}`
                            )
                        } else {
                            if (debugLogs) {
                                console.log(
                                    "[Better Auth Tauri] User agent is Tauri/",
                                    url.pathname
                                )
                            }
                        }
                    })
                }
            ]
        },
        endpoints: {
            getTauriRedirect: createAuthEndpoint(
                "/tauri/redirect",
                {
                    method: "GET"
                },
                async (ctx) => {
                    if (!ctx.request) return
                    const tauriRedirect = new URL(ctx.request.url).searchParams.get("tauriRedirect")
                    return new Response(
                        `${html(successText)}<script>window.location.href = '${tauriRedirect}';</script>`,
                        {
                            headers: {
                                "Content-Type": "text/html"
                            }
                        }
                    )
                }
            )
        }
    }) satisfies BetterAuthPlugin
