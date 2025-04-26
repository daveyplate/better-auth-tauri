import type { SetupBetterAuthTauriOptions } from "./setup-better-auth-tauri"

export const handleAuthFetchParam = async ({
    authClient,
    onError,
    onRequest,
    onSuccess
}: Omit<SetupBetterAuthTauriOptions, "scheme">) => {
    const searchParams = new URLSearchParams(window.location.search)
    const authFetch = searchParams.get("authFetch")

    if (!authFetch) return

    const basePath = "/api/auth"
    const href = authFetch.replace(basePath, "")

    console.log("[Better Auth Tauri] handleAuthFetchParam fetch", href)

    onRequest?.(href)
    const response = await authClient.$fetch(href)

    console.log("[Better Auth Tauri] handleAuthFetchParam response", response, href)

    if (response.error?.message || response.error?.statusText) {
        console.error("[Better Auth Tauri] handleAuthFetchParam error", response.error, href)
        onError?.(response.error)
    } else {
        console.log("[Better Auth Tauri] handleAuthFetchParam onSuccess", href)
        onSuccess?.()
    }
}
