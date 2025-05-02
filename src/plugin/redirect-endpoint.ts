import { createAuthEndpoint } from "better-auth/plugins"
import { html } from "./html"

export const redirectEndpoint = (successText: string) =>
    createAuthEndpoint(
        "/tauri/redirect",
        {
            method: "GET"
        },
        async (ctx) => {
            if (!ctx.request) return
            const tauriRedirect = new URL(ctx.request.url).searchParams.get("tauriRedirect")
            const hideUI = new URL(ctx.request.url).searchParams.get("hideUI")
            return new Response(
                `${hideUI ? "" : html(successText)}<script>window.location.href = '${tauriRedirect}';</script>`,
                {
                    headers: {
                        "Content-Type": "text/html"
                    }
                }
            )
        }
    )
