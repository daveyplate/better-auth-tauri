import type { BetterAuthPlugin } from "better-auth"
import { createAuthEndpoint, createAuthMiddleware } from "better-auth/plugins"
import type { SocialProvider } from "better-auth/social-providers"

const html = (successText: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication Success</title>
    <style>
        :root {
            --bg-color: #f8f9fa;
            --text-color: #212529;
            --accent-color: #000000;
            --success-color: #28a745;
            --border-color: #e9ecef;
            --card-bg: #ffffff;
            --card-shadow: rgba(0, 0, 0, 0.05);
            --text-secondary: #495057;
            --text-muted: #6c757d;
        }
        
        @media (prefers-color-scheme: dark) {
            :root {
                --bg-color: #121212;
                --text-color: #e1e1e1;
                --accent-color: #90caf9;
                --success-color: #4caf50;
                --border-color: #2d2d2d;
                --card-bg: #1e1e1e;
                --card-shadow: rgba(0, 0, 0, 0.2);
                --text-secondary: #b0b0b0;
                --text-muted: #909090;
            }
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            line-height: 1.5;
        }
        .success-container {
            background-color: var(--card-bg);
            border-radius: 12px;
            box-shadow: 0 4px 6px var(--card-shadow);
            padding: 2.5rem;
            text-align: center;
            max-width: 90%;
            width: 400px;
        }
        h1 {
            color: var(--success-color);
            font-size: 1.75rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        p {
            margin-bottom: 1.5rem;
            color: var(--text-secondary);
        }
        .btn {
            background-color: var(--accent-color);
            color: var(--bg-color);
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            transition: all 0.3s ease;
            display: inline-block;
            font-weight: 500;
            border: 2px solid var(--accent-color);
        }
        .btn:hover {
            opacity: 0.9;
        }
        .success-code {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
        }
        .icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="icon">✅</div>
        <h1>Authentication Successful</h1>
        <p>${successText}</p>
    </div>
</body>
</html>`

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
                        !context.request?.url?.includes("reset-password") &&
                        !context.request?.url?.includes("tauri/redirect"),
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
