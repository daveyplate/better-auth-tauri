import type { BetterAuthPlugin } from "better-auth"
import { createAuthMiddleware } from "better-auth/plugins"

export const tauriPlugin = ({
    schemes
}: {
    schemes: string[]
}) =>
    ({
        id: "tauriPlugin",
        hooks: {
            before: [
                {
                    matcher: () => true,
                    handler: createAuthMiddleware(async (ctx) => {
                        if (!ctx.request) return

                        const url = new URL(ctx.request.url)
                        const searchParams = url.searchParams
                        const callbackURL = searchParams.get("callbackURL")

                        if (!callbackURL) return

                        schemes.map((scheme) => {
                            if (!callbackURL.startsWith(`${scheme}://app`)) return

                            // Remove the Deep Link URL scheme from the callbackURL
                            searchParams.set(
                                "callbackURL",
                                callbackURL.split(`${scheme}://app`).pop()!
                            )

                            const deepLinkURL = `${scheme}://app${url.pathname}?${searchParams.toString()}`
                            throw ctx.redirect(deepLinkURL)
                        })
                    })
                }
            ]
        }
    }) satisfies BetterAuthPlugin
