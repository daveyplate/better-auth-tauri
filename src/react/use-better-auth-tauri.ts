import { useEffect } from "react"
import {
    type SetupBetterAuthTauriOptions,
    setupBetterAuthTauri
} from "../client/setup-better-auth-tauri"

export function useBetterAuthTauri({
    authClient,
    scheme,
    onError,
    onRequest,
    onSuccess
}: SetupBetterAuthTauriOptions) {
    useEffect(() => {
        return setupBetterAuthTauri({
            authClient,
            scheme,
            onError,
            onRequest,
            onSuccess
        })
    }, [authClient, scheme, onError, onRequest, onSuccess])
}
