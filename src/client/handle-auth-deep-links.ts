import { getCurrent, onOpenUrl } from "@tauri-apps/plugin-deep-link"
import type { FetchError } from "../types/fetch-error"
import { handleAuthParam } from "./handle-auth-param"
import { handleAuthUrl } from "./handle-auth-url"

export function handleAuthDeepLinks({
    scheme,
    onError,
    onSuccess
}: {
    scheme: string
    onError: (error: FetchError) => void
    onSuccess: (callbackURL?: string | null) => void
}) {
    const handleUrls = (urls: string[] | null) => {
        if (!urls?.length) return
        const url = urls[0]

        handleAuthUrl({
            scheme,
            url,
            onError,
            onSuccess
        })
    }

    getCurrent().then(handleUrls)
    onOpenUrl(handleUrls)

    handleAuthParam({
        onError,
        onSuccess
    })
}
