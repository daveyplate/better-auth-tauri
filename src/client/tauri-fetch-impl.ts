import { isTauri } from "@tauri-apps/api/core"
import { fetch as tauriFetch } from "@tauri-apps/plugin-http"
import { platform } from "@tauri-apps/plugin-os"

export const tauriFetchImpl: typeof fetch = (...params) =>
    isTauri() &&
    ((platform() === "macos" && window.location.protocol === "tauri:") ||
        platform() === "windows")
        ? tauriFetch(...params)
        : fetch(...params)
