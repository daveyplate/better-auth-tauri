import type { SetupBetterAuthTauriOptions } from "./setup-better-auth-tauri"

export const handleAuthFetchParam = async ({
    authClient,
    onError,
    onRequest,
    onSuccess
}: Omit<SetupBetterAuthTauriOptions, "scheme">) => {
    if (window.location.protocol !== "tauri:") return

    const basePath = "/api/auth"

    const searchParams = new URLSearchParams(window.location.search)
    const authFetch = searchParams.get("authFetch")

    if (!authFetch) return

    const href = authFetch.replace(basePath, "")

    console.log("[Better Auth Tauri] handleAuthParam fetch", href)

    onRequest?.(href)
    const response = await authClient.$fetch(href)

    console.log("[Better Auth Tauri] handleAuthParam response", response, href)
    if (response.error?.message || response.error?.statusText) {
        console.error("[Better Auth Tauri] handleAuthParam error", response.error, href)
        onError?.(response.error)
    } else {
        console.log("[Better Auth Tauri] handleAuthParam success")
        onSuccess?.()
    }
}
