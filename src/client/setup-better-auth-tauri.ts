import { setupTauriFetch } from "@daveyplate/tauri-fetch"
import { getCurrent, onOpenUrl } from "@tauri-apps/plugin-deep-link"
import type { AuthClient } from "../types/auth-client"
import type { FetchError } from "../types/fetch-error"
import { handleAuthDeepLink } from "./handle-auth-deep-link"
import { handleAuthFetchParam } from "./handle-auth-fetch-param"

export interface SetupBetterAuthTauriOptions {
    authClient: AuthClient
    scheme: string
    onError?: (error: FetchError) => void
    onRequest?: (href: string) => void
    onSuccess?: (callbackURL?: string | null) => void
}

export function setupBetterAuthTauri({
    authClient,
    scheme,
    onError,
    onRequest,
    onSuccess
}: SetupBetterAuthTauriOptions) {
    if (window.location.protocol === "tauri:") {
        setupTauriFetch()

        handleAuthFetchParam({
            authClient,
            onError,
            onRequest,
            onSuccess
        })
    }

    const handleUrls = (urls: string[] | null) => {
        if (!urls?.length) return
        const url = urls[0]

        handleAuthDeepLink({
            authClient,
            scheme,
            url,
            onError,
            onRequest,
            onSuccess
        })
    }

    if (!sessionStorage.getItem("getCurrentUrlChecked")) {
        getCurrent().then(handleUrls)
        sessionStorage.setItem("getCurrentUrlChecked", "true")
    }

    const unlisten = onOpenUrl(handleUrls)

    return () => {
        unlisten.then((f) => f())
    }
}
