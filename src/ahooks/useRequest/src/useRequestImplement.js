import { useEffect } from "react";
import useLatest from "../../useLatest";
import useUpdate from "../../useUpdate";
import useMount from "../../useMount";
import useCreation from "../../useCreation";
import useUnmount from "../../useUnmount";
import useMemorizedFn from "../../useMemorizedFn";
import Fetch from "./Fetch";

function useRequestImplement(service, options, plugins) {
  const serviceRef = useLatest(service);
  const update = useUpdate();
  const fetchInstanceOptions = {
    manual: true,
    ...options,
  };
  const fetchInstance = useCreation(() => {
    const initStates = plugins
      .map((p) => p.onInit?.(fetchInstanceOptions))
      .filter(Boolean);
    return new Fetch(
      serviceRef,
      update,
      fetchInstanceOptions,
      Object.assign({}, ...initStates)
    );
  }, []);
  fetchInstance.pluginImpls = plugins.map((p) =>
    p(fetchInstance, fetchInstanceOptions)
  );

  useMount(() => {
    if (!fetchInstanceOptions.manual) {
      fetchInstance.run(fetchInstanceOptions.defaultParams);
    }
  });

  useUnmount(() => {
    fetchInstance.cancel();
  });

  return {
    data: fetchInstance.state.data,
    loading: fetchInstance.state.loading,
    run: useMemorizedFn(fetchInstance.run.bind(fetchInstance)),
    runAsync: useMemorizedFn(fetchInstance.runAsync.bind(fetchInstance)),
    refresh: useMemorizedFn(fetchInstance.refresh.bind(fetchInstance)),
    refreshAsync: useMemorizedFn(
      fetchInstance.refreshAsync.bind(fetchInstance)
    ),
    cancel: useMemorizedFn(fetchInstance.cancel.bind(fetchInstance)),
  };
}

export default useRequestImplement;
