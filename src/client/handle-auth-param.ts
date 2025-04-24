import type { AuthClient } from "../types/auth-client"
import type { FetchError } from "../types/fetch-error"

export const handleAuthParam = async ({
    authClient,
    onError,
    onSuccess
}: {
    authClient: AuthClient
    onError?: (error: FetchError) => void
    onSuccess?: () => Promise<void> | void
}) => {
    if (window.location.protocol !== "tauri:") return

    const searchParams = new URLSearchParams(window.location.search)
    const href = searchParams.get("authFetch")

    if (!href) return

    const { error } = await authClient.$fetch(href)

    if (error) {
        onError?.(error)
    } else {
        onSuccess?.()
    }
}
