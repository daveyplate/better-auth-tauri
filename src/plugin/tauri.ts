import type { BetterAuthPlugin } from "better-auth"
import { createAuthMiddleware } from "better-auth/plugins"

export const tauri = ({
    schemes
}: {
    schemes: string[]
}) =>
    ({
        id: "tauriPlugin",
        hooks: {
            before: [
                {
                    matcher: (context) => !context.request?.url?.includes("reset-password"),
                    handler: createAuthMiddleware(async (ctx) => {
                        if (!ctx.request) return

                        // TODO - First Check user agent for Tauri then redirect to tauri://localhost?authFetch=

                        // If not Tauri user agent then check callbackURL for deep link redirects
                        const url = new URL(ctx.request.url)
                        const searchParams = url.searchParams
                        const callbackURL = searchParams.get("callbackURL")

                        console.log("Request URL:", ctx.request.url)
                        console.log("Callback URL:", callbackURL)
                        if (!callbackURL) return

                        schemes.map((scheme) => {
                            if (!callbackURL.startsWith(`${scheme}://`)) return

                            // Remove the Deep Link URL scheme from the callbackURL
                            searchParams.set("callbackURL", callbackURL.replace(`${scheme}:/`, ""))

                            const deepLinkURL = `${scheme}:/${url.pathname}?${searchParams.toString()}`

                            console.log("Redirecting to:", deepLinkURL)
                            throw ctx.redirect(deepLinkURL)
                        })
                    })
                }
            ]
        }
    }) satisfies BetterAuthPlugin
