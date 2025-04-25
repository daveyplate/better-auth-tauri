import type { HandleAuthDeepLinksOptions } from "./handle-auth-deep-links"

export async function handleAuthUrl({
    authClient,
    scheme,
    url,
    onError,
    onRequest,
    onSuccess
}: HandleAuthDeepLinksOptions & { url: string }) {
    if (!url.startsWith(`${scheme}:`)) return false

    const href = url.replace(`${scheme}:/`, "")

    console.log("[Better Auth Tauri] handleAuthUrl fetch", href)

    onRequest?.(href)
    const response = await authClient.$fetch(href)

    if (response.error) {
        onError?.(response.error)
    } else {
        const searchParams = new URL(url).searchParams
        const callbackURL = searchParams.get("callbackURL")

        console.log("[Better Auth Tauri] onSuccess callbackURL", callbackURL)
        onSuccess?.(callbackURL)
    }

    return true
}
