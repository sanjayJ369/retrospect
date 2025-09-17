import { StubStorageProvider } from "./stubStorageProvider";
import { ApiStorageProvider } from "./ApiStorageProvider";
import { OfflineStorageProvider } from "./OfflineStorageProvider";
import type { StorageProvider } from "./types";

export function getStorageProvider(): StorageProvider {
  // Force stub provider for testing auth flow
  // return StubStorageProvider;

  if (typeof window === "undefined") return StubStorageProvider;

  if (!navigator.onLine) {
    console.log("Using offline storage provider");
    return OfflineStorageProvider;
  }

  const access = window.localStorage.getItem("retro.access_token");
  if (access) {
    console.log("Using API storage provider");
    return ApiStorageProvider;
  }
  console.log("Using stub storage provider");
  return StubStorageProvider;
}
