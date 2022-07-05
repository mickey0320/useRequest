import { useEffect } from "react"

function useMount(callback) {
  return useEffect(() => {
    callback()
  }, [])
}

export default useMount