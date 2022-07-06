import useRequestImplement from "./useRequestImplement";

function useRequest(service, options, plugins = []) {
  return useRequestImplement(service, options, plugins);
}

export default useRequest;
