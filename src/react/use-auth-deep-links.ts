import { useEffect } from "react"
import { handleAuthDeepLinks } from "../client/handle-auth-deep-links"
import type { AuthClient } from "../types/auth-client"
import type { FetchError } from "../types/fetch-error"

export function useAuthDeepLinks({
    authClient,
    scheme,
    onError,
    onSuccess
}: {
    authClient: AuthClient
    scheme: string
    onError: (error: FetchError) => void
    onSuccess: (callbackURL?: string | null) => void
}) {
    useEffect(() => {
        handleAuthDeepLinks({
            authClient,
            scheme,
            onError,
            onSuccess
        })
    }, [authClient, scheme, onError, onSuccess])
}
