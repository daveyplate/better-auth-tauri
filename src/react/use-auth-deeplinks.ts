import { useEffect } from "react"
import { handleAuthDeepLinks } from "../client/handle-auth-deep-links"
import type { AuthClient } from "../types/auth-client"
import type { FetchError } from "../types/fetch-error"

export function useAuthDeepLinks({
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
    useEffect(() => {
        handleAuthDeepLinks({
            authClient,
            scheme,
            onError,
            navigate
        })
    }, [authClient, scheme, onError, navigate])
}
