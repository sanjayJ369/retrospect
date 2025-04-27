"use client";

import { useQuery } from "@tanstack/react-query";

export function usePromiseQuery<T>(
  promiseFn: () => Promise<T>,
  deps: unknown[] = [],
) {
  const key = ["promise-query", ...deps]; // stable key based on deps

  return useQuery({
    queryKey: key,
    queryFn: promiseFn,
  });
}
