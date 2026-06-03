import { createAuthEndpoint } from "better-auth/api"
import { html } from "./html"

function isSafeRedirect(url: string | null, scheme: string): url is string {
    if (!url) return false
    if (url.startsWith("/") && !url.startsWith("//")) return true
    if (url.startsWith(`${scheme}://`) || url.startsWith(`${scheme}:/`))
        return true
    return false
}

const escapeHtml = (s: string) =>
    s.replace(
        /[&<>"']/g,
        (c) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[c]!
    )

export const callbackSuccess = (successText: string, scheme: string) =>
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

            const safeRedirectTo = isSafeRedirect(redirectTo, scheme)
                ? redirectTo
                : "/"

            return new Response(
                `${hideUI ? "" : html(successText)}<meta http-equiv="refresh" content="0;url=${escapeHtml(safeRedirectTo)}">`,
                {
                    headers: {
                        "Content-Type": "text/html"
                    }
                }
            )
        }
    )
