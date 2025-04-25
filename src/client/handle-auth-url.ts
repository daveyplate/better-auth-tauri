import type { FetchError } from "../types/fetch-error"

export interface HandleAuthUrlOptions {
    scheme: string
    url: string
    onError?: (error: FetchError) => void
    onSuccess?: (callbackURL?: string | null) => void
}

export async function handleAuthUrl({ scheme, url, onError, onSuccess }: HandleAuthUrlOptions) {
    if (!url.startsWith(`${scheme}:`)) return false

    const href = url.replace(`${scheme}:/`, "")

    console.log("[Better Auth Tauri] handleAuthUrl fetch", href)

    const response = await fetch(href)

    if (response.ok) {
        const searchParams = new URL(url).searchParams
        const callbackURL = searchParams.get("callbackURL")

        console.log("[Better Auth Tauri] onSuccess callbackURL", callbackURL)
        onSuccess?.(callbackURL)
    } else {
        const error = await response.json()
        onError?.(error)
    }

    return true
}
