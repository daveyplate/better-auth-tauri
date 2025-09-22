import { isTauri } from "@tauri-apps/api/core"
import { openUrl } from "@tauri-apps/plugin-opener"
import { platform } from "@tauri-apps/plugin-os"

import type { BetterFetchOption } from "better-auth/client"
import type { AuthClient } from "../types/auth-client"
import type { FetchError } from "../types/fetch-error"

const isOpenerEnabled = () =>
    isTauri() &&
    (window.location.protocol === "tauri:" || platform() !== "macos")

export type SocialSignInParams = Parameters<AuthClient["signIn"]["social"]>[0]

type SocialSignInData = { redirect: boolean; url?: string }
type SocialSignInResult = {
    data: SocialSignInData | null
    error: FetchError | null
}

export interface SignInSocialProps extends SocialSignInParams {
    authClient: AuthClient
}

export function signInSocial(
    params: SignInSocialProps
): Promise<SocialSignInResult>

export function signInSocial(
    params: Omit<SignInSocialProps, "fetchOptions"> & {
        fetchOptions: Omit<BetterFetchOption, "throw"> & { throw: true }
    }
): Promise<SocialSignInData>

export async function signInSocial({
    authClient,
    fetchOptions,
    callbackURL,
    ...rest
}: SignInSocialProps): Promise<SocialSignInData | SocialSignInResult> {
    const openerEnabled = isOpenerEnabled()
    const params: SocialSignInParams = {
        ...rest,
        disableRedirect: openerEnabled,
        callbackURL: openerEnabled ? undefined : callbackURL,
        fetchOptions: {
            ...(fetchOptions ?? {}),
            headers: {
                ...(fetchOptions?.headers ?? {}),
                ...(openerEnabled ? { Platform: platform() } : {})
            }
        }
    }

    if (fetchOptions?.throw) {
        const data = await authClient.signIn.social({
            ...params,
            fetchOptions: { ...params.fetchOptions, throw: true }
        })

        handleSocialSignIn(data)

        return data
    }

    const response = await authClient.signIn.social(params)

    handleSocialSignIn(response.data)

    return response
}

function handleSocialSignIn(data: SocialSignInData | null) {
    if (!data?.url || data.redirect || !isOpenerEnabled()) return

    openUrl(data.url)
}
