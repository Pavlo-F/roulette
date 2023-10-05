import { useEffect, useRef } from "react";
import type React from "react";

export const useAbortController = () => {
  const refAbortController = useRef<AbortController | null>(null);

  useEffect(() => {
    const { current: signal } = refAbortController;
    if (signal != null) {
      signal.abort();
    }
  }, [refAbortController]);

  return refAbortController;
};

export const createAbortController = (ref: React.MutableRefObject<AbortController | null>) => {
  if (ref.current != null) {
    ref.current.abort();
  }

  const source = new AbortController();
  // eslint-disable-next-line no-param-reassign
  ref.current = source;

  return source;
};
