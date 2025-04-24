import type { createAuthClient } from "better-auth/client"

export type AuthClient = Omit<
    ReturnType<typeof createAuthClient>,
    "signUp" | "getSession" | "useSession"
>
