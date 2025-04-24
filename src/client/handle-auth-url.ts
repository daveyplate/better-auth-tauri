import type { AuthClient } from "../types/auth-client"
import type { FetchError } from "../types/fetch-error"

export interface HandleAuthUrlOptions {
    authClient: AuthClient
    url: string
    scheme: string
    basePath?: string
    onError?: (error: FetchError) => void
    navigate?: (url: string) => void
}

export async function handleAuthUrl({
    authClient,
    url,
    scheme,
    basePath = "/api/auth",
    onError,
    navigate = (url) => {
        window.location.href = url
    }
}: HandleAuthUrlOptions) {
    if (!url.startsWith(`${scheme}:/${basePath}`)) return false

    const href = url.replace(`${scheme}:/${basePath}`, "")

    const { error } = await authClient.$fetch(href)

    if (error) {
        onError?.(error)
    } else {
        const searchParams = new URL(url).searchParams
        const callbackURL = searchParams.get("callbackURL")

        if (callbackURL) navigate?.(callbackURL)
    }

    return true
}
