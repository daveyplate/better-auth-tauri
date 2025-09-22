# Better Auth Tauri Plugin

A plugin for [Better Auth](https://better-auth.com) that provides seamless integration with [Tauri](https://tauri.app) applications.

## Installation

```bash
# npm
npm install @daveyplate/better-auth-tauri

# pnpm
pnpm add @daveyplate/better-auth-tauri

# yarn
yarn add @daveyplate/better-auth-tauri

# bun
bun add @daveyplate/better-auth-tauri
```

## Prerequisites

This plugin requires the following Tauri plugins:

- `@tauri-apps/plugin-deep-link`
- `@tauri-apps/plugin-http`
- `@tauri-apps/plugin-os`

Make sure these are installed and properly configured in your Tauri application.

## Server Setup

### 1. Configure the Tauri Plugin in your `auth.ts` file

```typescript
import { betterAuth } from "better-auth";
import { tauri } from "@daveyplate/better-auth-tauri/plugin";

export const auth = betterAuth({
  // Your existing Better Auth configuration
  plugins: [
    // Your existing plugins
    tauri({
      scheme: "your-app", // Your app's deep link scheme
      callbackURL: "/", // Optional: Where to redirect after auth (default: "/")
      successText: "Authentication successful! You can close this window.", // Optional
      successURL: "/auth/success", // Optional: Custom success page URL that will receive a ?tauriRedirect search parameter
      debugLogs: false, // Optional: Enable debug logs
    }),
  ],
});
```

### 2. Register the Deep Link Scheme in Tauri

In your `tauri.conf.json` file, add your deep link scheme:

```json
{
    "plugins": {
        "deep-link": {
            "desktop": {
                "schemes": ["my-app"]
            }
        }
    }
}
```

## Client Setup

### Option 1: Standard JavaScript/TypeScript Setup

```typescript
import { setupBetterAuthTauri } from "@daveyplate/better-auth-tauri";
import { authClient } from "./your-auth-client";

// Initialize in your app's entry point
setupBetterAuthTauri({
  authClient, // Your Better Auth client instance
  scheme: "your-app", // Must match the scheme in your server config
  debugLogs: false, // Optional: Enable debug logs
  mainWindowLabel: "main", // Optional: Your main window label (default: "main")
  onRequest: (href) => {
    console.log("Auth request:", href);
  },
  onSuccess: (callbackURL) => {
    console.log("Auth successful, callback URL:", callbackURL);
    // Handle successful authentication
    window.location.href = callbackURL
  },
  onError: (error) => {
    console.error("Auth error:", error);
    // Handle authentication error
  },
});
```

### Option 2: React Setup

```typescript
import { useBetterAuthTauri } from "@daveyplate/better-auth-tauri/react";
import { authClient } from "./your-auth-client";

function App() {
  useBetterAuthTauri({
    authClient,
    scheme: "your-app",
    debugLogs: false,
    onRequest: (href) => {
      console.log("Auth request:", href);
    },
    onSuccess: (callbackURL) => {
      console.log("Auth successful");
      // Navigate or update UI as needed
    },
    onError: (error) => {
      console.error("Auth error:", error);
      // Show error notification
    },
  });

  return (
    // Your app components
  );
}
```

### Option 3: Svelte Setup

```svelte
<script>
  import { onMount, onDestroy } from "svelte";
  import { setupBetterAuthTauri } from "@daveyplate/better-auth-tauri";
  import { authClient } from "./your-auth-client";
  
  let cleanup;
  
  onMount(() => {
    cleanup = setupBetterAuthTauri({
      authClient,
      scheme: "your-app",
      debugLogs: false,
      onRequest: (href) => {
        console.log("Auth request:", href);
      },
      onSuccess: (callbackURL) => {
        console.log("Auth successful");
        // Update your app state

        goto(callbackURL)
      },
      onError: (error) => {
        console.error("Auth error:", error);
        // Show error notification
      },
    });
  });
  
  onDestroy(() => {
    if (cleanup) cleanup();
  });
</script>

<!-- Your Svelte components -->
```

## Social Sign In

First install the official Tauri Opener plugin:
https://v2.tauri.app/plugin/opener/

To properly use Social Sign in with the Opener plugin we provide a helper function:

```ts
import { signInSocial } from "@daveyplate/better-auth-tauri"
import { authClient } from "@/lib/auth-client"

export function Page() {
  return (
    <button onClick={() => {
      signInSocial({
        authClient,
        provider: "google"
      })
    }}>
      Sign in with Google
    </button>
  )
}
```

## macOS Cookies

You must update your auth-client.ts to use Tauri HTTP plugin for macOS in production in order for cookies to work:

```tsx
import { isTauri } from "@tauri-apps/api/core"
import { fetch as tauriFetch } from "@tauri-apps/plugin-http"
import { platform } from "@tauri-apps/plugin-os"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    fetchOptions: {
        customFetchImpl: (...params) =>
            isTauri() && platform() === "macos" && window.location.protocol === "tauri:"
                ? tauriFetch(...params)
                : fetch(...params)
    }
})
```

## How It Works

This plugin enables seamless authentication in Tauri apps by:

1. **Handling Deep Links**: Properly processes authentication redirects through your app's custom URL scheme.
2. **Managing Authentication State**: Ensures that your app's auth state remains consistent across the authentication flow.
3. **Simplifying Tauri Integration**: Removes the boilerplate needed to make authentication work in desktop applications.

## License

MIT