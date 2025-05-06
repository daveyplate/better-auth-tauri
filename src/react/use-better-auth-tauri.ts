import { useEffect } from "react"
import {
    type SetupBetterAuthTauriOptions,
    setupBetterAuthTauri
} from "../client/setup-better-auth-tauri"

export function useBetterAuthTauri({
    authClient,
    debugLogs,
    mainWindowLabel,
    matcher = "*/api/*",
    scheme,
    onError,
    onRequest,
    onSuccess
}: SetupBetterAuthTauriOptions) {
    useEffect(() => {
        return setupBetterAuthTauri({
            authClient,
            debugLogs,
            mainWindowLabel,
            matcher,
            scheme,
            onError,
            onRequest,
            onSuccess
        })
    }, [authClient, debugLogs, mainWindowLabel, matcher, scheme, onError, onRequest, onSuccess])
}
