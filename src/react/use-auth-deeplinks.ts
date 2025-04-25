import { useEffect } from "react"
import { handleAuthDeepLinks } from "../client/handle-auth-deep-links"
import type { FetchError } from "../types/fetch-error"

export function useAuthDeepLinks({
    scheme,
    onError,
    onSuccess
}: {
    scheme: string
    onError: (error: FetchError) => void
    onSuccess: (callbackURL?: string | null) => void
}) {
    useEffect(() => {
        handleAuthDeepLinks({
            scheme,
            onError,
            onSuccess
        })
    }, [scheme, onError, onSuccess])
}
