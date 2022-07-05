import { useEffect } from 'react'
import useLatest from '../../useLatest'
import useUpdate from '../../useUpdate'
import useMount from '../../useMount'

function useRequestImplement(service, options) {
  const serviceRef = useLatest(service)
  const update = useUpdate()
  const fetchInstanceOptions = {
    manual: true,
    ...options
  }
  const fetchInstance = new fetch(serviceRef, fetchInstanceOptions)

  useMount(() => {
    if (fetchInstanceOptions.manual) {
      fetchInstance.run()

    }
  })
}

export default useRequestImplement