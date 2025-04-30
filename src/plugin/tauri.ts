import type { BetterAuthPlugin } from "better-auth"
import { createAuthMiddleware } from "better-auth/plugins"
import { appendCallbackURL } from "./append-callback-url"
import { checkCallbackURL } from "./check-callback-url"
import { handleTauriRedirect } from "./handle-tauri-redirect"
import { redirectEndpoint } from "./redirect-endpoint"

export const tauri = ({
    baseURL = "tauri://localhost",
    callbackURL = "/",
    debugLogs,
    scheme,
    successText = "Your authentication was successful. You may now close this window and return to the application.",
    successURL
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

                        // Always use /api/auth as basePath when redirecting to Tauri
                        const basePath = ctx.context.options.basePath ?? "/api/auth"
                        const url = new URL(ctx.request.url)
                        url.pathname = url.pathname.replace(basePath, "/api/auth")

                        if (debugLogs) {
                            const userAgent = ctx.request.headers.get("user-agent")
                            const host = ctx.request.headers.get("host")

                            console.log(
                                "[Better Auth Tauri] Request URL:",
                                ctx.request.url,
                                "User Agent:",
                                userAgent,
                                "Host:",
                                host,
                                "Pathname:",
                                url.pathname
                            )
                        }

                        handleTauriRedirect({
                            baseURL,
                            ctx,
                            debugLogs,
                            url
                        })

                        appendCallbackURL({
                            callbackURL,
                            ctx,
                            debugLogs,
                            scheme,
                            url
                        })

                        checkCallbackURL({
                            ctx,
                            debugLogs,
                            scheme,
                            successURL,
                            url
                        })
                    })
                }
            ]
        },
        endpoints: {
            getTauriRedirect: redirectEndpoint(successText)
        }
    }) satisfies BetterAuthPlugin
