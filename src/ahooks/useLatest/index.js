import { useRef } from "react"

function useLatest(val) {
  const ref = useRef(val)
  ref.current = val

  return ref
}

export default useLatest