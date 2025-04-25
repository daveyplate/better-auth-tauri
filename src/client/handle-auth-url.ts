import type { HandleAuthDeepLinksOptions } from "./handle-auth-deep-links"

export async function handleAuthUrl({
    authClient,
    scheme,
    url,
    onError,
    onRequest,
    onSuccess
}: HandleAuthDeepLinksOptions & { url: string }) {
    const basePath = "/api/auth"
    if (!url.startsWith(`${scheme}:/${basePath}`)) return false

    const href = url.replace(`${scheme}:/${basePath}`, "")

    console.log("[Better Auth Tauri] handleAuthUrl fetch", href)

    onRequest?.(href)
    const response = await authClient.$fetch(href)

    if (response.error?.message || response.error?.statusText) {
        onError?.(response.error)
    } else {
        const searchParams = new URL(url).searchParams
        const callbackURL = searchParams.get("callbackURL")?.replace(`${scheme}:/`, "")

        console.log("[Better Auth Tauri] onSuccess callbackURL", callbackURL)
        onSuccess?.(callbackURL)
    }

    return true
}
