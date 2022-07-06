import { useEffect } from "react";
import useLatest from "../useLatest";

function useUnmount(fn) {
  const fnLatest = useLatest(fn);
  useEffect(() => {
    return () => {
      fnLatest();
    };
  }, []);
}

export default useUnmount;
