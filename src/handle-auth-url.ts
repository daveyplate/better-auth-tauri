import type { createAuthClient } from "better-auth/client"

type AuthClient = Omit<ReturnType<typeof createAuthClient>, "signUp" | "getSession" | "useSession">

type FetchError = {
    message?: string | undefined
    status: number
    statusText: string
}

/**
 * Options for handleAuthUrl function
 */
export interface HandleAuthUrlOptions {
    /** Better Auth client instance */
    authClient: AuthClient
    /** URL received from Tauri's onAppUrlOpen event */
    url: string
    /** Allowed URL schemes */
    schemes: string[]
    /** Base path for authentication endpoints, defaults to "/api/auth" */
    basePath?: string
    /** Callback for handling errors */
    onError?: (error: FetchError) => void
    /** Callback for navigating to the callback URL */
    navigate?: (url: string) => void
}

/**
 * Handles deep links for authentication callbacks
 */
export async function handleAuthUrl({
    authClient,
    url,
    schemes,
    basePath = "/api/auth",
    onError,
    navigate = (url) => {
        window.location.href = url
    }
}: HandleAuthUrlOptions) {
    for (const scheme of schemes) {
        if (!url.startsWith(`${scheme}:/${basePath}`)) continue

        const href = url.replace(`${scheme}:/${basePath}`, "")

        console.log("authClient fetch - basePath:", basePath, "href:", href)

        const { error } = await authClient.$fetch(href)

        if (error) {
            console.error(error)
            onError?.(error)
        } else {
            const searchParams = new URL(url).searchParams
            const callbackURL = searchParams.get("callbackURL")

            if (callbackURL) navigate?.(callbackURL)
        }

        return true
    }

    return false
}
