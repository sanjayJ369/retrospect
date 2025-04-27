import { StubStorageProvider } from "./stubStorageProvider";

export function getStorageProvider(): typeof StubStorageProvider {
  return StubStorageProvider;
}
