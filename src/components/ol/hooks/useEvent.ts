import { useCallback, useLayoutEffect, useRef } from "react";

export const useEvent: Function = (handler: Function) => {
  const handlerRef = useRef<Function | null>(null);
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });
  return useCallback(<T>(...args: T[]) => {
    const fn = handlerRef.current;
    return fn?.(...args);
  }, []);
};
