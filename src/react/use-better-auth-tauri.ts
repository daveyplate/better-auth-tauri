import { useEffect } from "react"
import {
    type SetupBetterAuthTauriOptions,
    setupBetterAuthTauri
} from "../client/setup-better-auth-tauri"

export function useBetterAuthTauri({
    authClient,
    debugLogs,
    scheme,
    onError,
    onRequest,
    onSuccess
}: SetupBetterAuthTauriOptions) {
    useEffect(() => {
        return setupBetterAuthTauri({
            authClient,
            debugLogs,
            scheme,
            onError,
            onRequest,
            onSuccess
        })
    }, [authClient, debugLogs, scheme, onError, onRequest, onSuccess])
}
