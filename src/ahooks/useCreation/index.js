import { useRef } from "react";
import { depsAreSame } from "../utils";

function useCreation(factory, deps) {
  const ref = useRef({
    obj: null,
    initialized: false,
    deps: [],
  });
  if (!ref.current.initialized || !depsAreSame(ref.current.deps, deps)) {
    ref.current.initialized = true;
    ref.current.obj = factory();
    ref.current.deps = deps;
  }

  return ref.obj;
}

export default useCreation;
