import { getCurrent, onOpenUrl } from "@tauri-apps/plugin-deep-link"
import type { AuthClient } from "../types/auth-client"
import type { FetchError } from "../types/fetch-error"
import { handleAuthParam } from "./handle-auth-param"
import { handleAuthUrl } from "./handle-auth-url"

export function handleAuthDeepLinks({
    authClient,
    scheme,
    onError,
    navigate
}: {
    authClient: AuthClient
    scheme: string
    onError: (error: FetchError) => void
    navigate: (url: string) => void
}) {
    const handleUrls = (urls: string[] | null) => {
        if (!urls?.length) return
        const url = urls[0]

        handleAuthUrl({
            authClient,
            scheme,
            url,
            onError,
            navigate
        })
    }

    getCurrent().then(handleUrls)
    onOpenUrl(handleUrls)

    handleAuthParam({
        authClient,
        onError
    })
}
