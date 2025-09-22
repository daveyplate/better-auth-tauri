import { isTauri } from "@tauri-apps/api/core"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { getCurrent, onOpenUrl } from "@tauri-apps/plugin-deep-link"
import type { AuthClient } from "../types/auth-client"
import type { FetchError } from "../types/fetch-error"
import { handleAuthDeepLink } from "./handle-auth-deep-link"

export interface SetupBetterAuthTauriOptions {
    authClient: AuthClient
    debugLogs?: boolean
    mainWindowLabel?: string
    scheme: string
    onError?: (error: FetchError) => void
    onRequest?: (href: string) => void
    onSuccess?: (callbackURL?: string | null) => void
}

export function setupBetterAuthTauri({
    authClient,
    debugLogs,
    mainWindowLabel = "main",
    scheme,
    onError,
    onRequest,
    onSuccess
}: SetupBetterAuthTauriOptions) {
    if (!isTauri()) return

    const handleUrls = (urls: string[] | null) => {
        if (!urls?.length) return
        const url = urls[0]

        handleAuthDeepLink({
            authClient,
            scheme,
            url,
            debugLogs,
            onError,
            onRequest,
            onSuccess
        })
    }

    if (!sessionStorage.getItem("getCurrentUrlChecked")) {
        if (getCurrentWebviewWindow().label === mainWindowLabel) {
            getCurrent().then(handleUrls)

            if (debugLogs) {
                console.log("[Better Auth Tauri] check getCurrent() url")
            }

            sessionStorage.setItem("getCurrentUrlChecked", "true")
        }
    }

    const unlisten = onOpenUrl(handleUrls)

    return () => {
        unlisten.then((f) => f())
    }
}
