import { fetch } from "@tauri-apps/plugin-http"

export const handleAuthParam = async ({
    onError,
    onSuccess
}: {
    // biome-ignore lint/suspicious/noExplicitAny:
    onError?: (error: any) => void
    onSuccess?: () => Promise<void> | void
}) => {
    if (window.location.protocol !== "tauri:") return

    const searchParams = new URLSearchParams(window.location.search)
    const authFetch = searchParams.get("authFetch")

    if (!authFetch) return

    console.log("[Better Auth Tauri] handleAuthParam fetch", authFetch)

    const response = await fetch(authFetch)

    if (response.ok) {
        onSuccess?.()
    } else {
        const error = await response.json()
        onError?.(error)
    }
}
