import { isTauri } from "@tauri-apps/api/core"
import { openUrl } from "@tauri-apps/plugin-opener"
import { platform } from "@tauri-apps/plugin-os"

import type { BetterFetchOption } from "better-auth/client"
import type { AuthClient } from "../types/auth-client"
import type { FetchError } from "../types/fetch-error"

const useOpener = () =>
    isTauri() && (window.location.protocol === "tauri:" || platform() !== "macos")

export type SocialSignInParams = Parameters<AuthClient["signIn"]["social"]>[0]
type SocialSignInData = {
    redirect: boolean
    url?: string
}
type SocialSignInResult = {
    data: SocialSignInData | null
    error: FetchError | null
}

export interface SignInSocialProps extends SocialSignInParams {
    authClient: AuthClient
}

export async function signInSocial(
    params: Omit<SignInSocialProps, "fetchOptions"> & {
        fetchOptions: Omit<BetterFetchOption, "throw"> & { throw: true }
    }
): Promise<SocialSignInData>

export async function signInSocial(params: SignInSocialProps): Promise<SocialSignInResult>

export async function signInSocial({
    authClient,
    fetchOptions,
    ...params
}: SignInSocialProps): Promise<SocialSignInData | SocialSignInResult> {
    if (fetchOptions?.throw) {
        const data = await authClient.signIn.social({
            disableRedirect: useOpener(),
            ...params,
            fetchOptions: {
                ...fetchOptions,
                throw: true,
                headers: {
                    ...fetchOptions.headers,
                    ...(useOpener() && { Platform: platform() })
                }
            }
        })

        handleSocialSignIn(data)

        return data
    }

    const response = await authClient.signIn.social({
        disableRedirect: useOpener(),
        ...params,
        fetchOptions: {
            ...fetchOptions,
            headers: {
                ...fetchOptions?.headers,
                ...(useOpener() && { Platform: platform() })
            }
        }
    })

    handleSocialSignIn(response.data)

    return response
}

async function handleSocialSignIn(data: SocialSignInData | null) {
    if (!data?.url || data.redirect || !useOpener()) return

    openUrl(data.url)
}
