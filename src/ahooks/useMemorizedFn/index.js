import { useCallback, useMemo, useRef } from "react";

function useMemorizedFn(callback) {
  const fnRef = useRef();
  const memorizedFn = useRef();
  fnRef.current = useMemo(() => callback, [callback]);

  if (!memorizedFn.current) {
    memorizedFn.current = function (...args) {
      fnRef.current(...args);
    };
  }

  return fnRef.current;
}

export default useMemorizedFn;
