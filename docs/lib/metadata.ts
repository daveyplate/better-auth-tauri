import type { Metadata } from "next/types"

export function createMetadata(override: Metadata): Metadata {
    return {
        // ...override,
        // openGraph: {
        //     title: override.title ?? undefined,
        //     description: override.description ?? undefined,
        //     url: "https://better-auth-ui.com",
        //     images: "https://better-auth-ui.com/better-auth-ui-promo-dark.png",
        //     siteName: "Better Auth UI",
        //     ...override.openGraph
        // },
        // twitter: {
        //     card: "summary_large_image",
        //     creator: "@daveycodez",
        //     title: override.title ?? undefined,
        //     description: override.description ?? undefined,
        //     images: "https://better-auth-ui.com/better-auth-ui-promo-dark.png",
        //     ...override.twitter
        // }
    }
}

export const baseUrl =
    process.env.NODE_ENV === "development"
        ? new URL("http://localhost:3000")
        : new URL(`https://${process.env.VERCEL_URL!}`)
