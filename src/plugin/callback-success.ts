import { createAuthEndpoint } from "better-auth/plugins"
import { html } from "./html"

export const callbackSuccess = (successText: string) =>
    createAuthEndpoint(
        "/callback/success",
        {
            method: "GET"
        },
        async (ctx) => {
            if (!ctx.request) return

            const redirectTo = new URL(ctx.request.url).searchParams.get(
                "redirectTo"
            )

            const hideUI = new URL(ctx.request.url).searchParams.get("hideUI")

            return new Response(
                `${hideUI ? "" : html(successText)}<script>window.location.href = '${redirectTo}';</script>`,
                {
                    headers: {
                        "Content-Type": "text/html"
                    }
                }
            )
        }
    )
