import type { SetupBetterAuthTauriOptions } from "./setup-better-auth-tauri"

export async function handleAuthDeepLink({
    authClient,
    scheme,
    url,
    onError,
    onRequest,
    onSuccess
}: SetupBetterAuthTauriOptions & { url: string }) {
    const basePath = "/api/auth"
    if (!url.startsWith(`${scheme}:/${basePath}`)) return false

    const href = url.replace(`${scheme}:/${basePath}`, "")

    console.log("[Better Auth Tauri] handleAuthDeepLink fetch", href)

    onRequest?.(href)
    const response = await authClient.$fetch(href)
    console.log("[Better Auth Tauri] handleAuthDeepLink response", response, href)

    if (response.error?.message || response.error?.statusText) {
        console.error("[Better Auth Tauri] handleAuthDeepLink error", response.error, href)
        onError?.(response.error)
    } else {
        const searchParams = new URL(url).searchParams
        const callbackURL = searchParams.get("callbackURL")?.replace(`${scheme}:/`, "")

        console.log(
            "[Better Auth Tauri] handleAuthDeepLink onSuccess callbackURL",
            callbackURL,
            href
        )
        onSuccess?.(callbackURL)
    }

    return true
}
