import { StubStorageProvider } from "./stubStorageProvider";
import { ApiStorageProvider } from "./ApiStorageProvider";
import { OfflineStorageProvider } from "./OfflineStorageProvider";
import type { StorageProvider } from "./types";

export function getStorageProvider(): StorageProvider {
  // Force stub provider for testing auth flow
  return StubStorageProvider;

  if (typeof window === "undefined") return StubStorageProvider;

  if (!navigator.onLine) {
    return OfflineStorageProvider;
  }

  const access = window.localStorage.getItem("retro.access_token");
  if (access) return ApiStorageProvider;
  return StubStorageProvider;
}
