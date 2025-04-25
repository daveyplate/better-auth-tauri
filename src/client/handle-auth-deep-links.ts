import { setupTauriFetch } from "@daveyplate/tauri-fetch"
import { getCurrent, onOpenUrl } from "@tauri-apps/plugin-deep-link"
import type { AuthClient } from "../types/auth-client"
import type { FetchError } from "../types/fetch-error"
import { handleAuthParam } from "./handle-auth-param"
import { handleAuthUrl } from "./handle-auth-url"

export interface HandleAuthDeepLinksOptions {
    authClient: AuthClient
    scheme: string
    onError?: (error: FetchError) => void
    onRequest?: (href: string) => void
    onSuccess?: (callbackURL?: string | null) => void
}

export function handleAuthDeepLinks({
    authClient,
    scheme,
    onError,
    onRequest,
    onSuccess
}: HandleAuthDeepLinksOptions) {
    if (window.location.protocol === "tauri:") {
        setupTauriFetch()
    }

    const handleUrls = (urls: string[] | null) => {
        if (!urls?.length) return
        const url = urls[0]

        handleAuthUrl({
            authClient,
            scheme,
            url,
            onError,
            onRequest,
            onSuccess
        })
    }

    getCurrent().then(handleUrls)
    onOpenUrl(handleUrls)

    handleAuthParam({
        authClient,
        onError,
        onRequest,
        onSuccess
    })
}
