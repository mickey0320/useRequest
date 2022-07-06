class Fetch {
  constructor(serviceRef, render, options, initState) {
    this.state = {
      loading: false,
      data: undefined,
      error: undefined,
      params: undefined,
      ...initState,
    };
    this.serviceRef = serviceRef;
    this.render = render;
    this.options = options;
    this.count = 0;
  }
  setState(newState) {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.render();
  }
  async run(params) {
    this.runAsync(params).catch((error) => {
      if (this.options.onError) {
        this.options.onError(error);
      }
    });
  }
  async runAsync(params) {
    this.count += 1;
    const currentCount = this.count;
    const state = this.runImplHandler("onBefore", params);
    this.setState({
      loading: true,
      params,
      ...state,
    });
    this.options.onBefore?.(params);
    try {
      const { servicePromise } = this.runImplHandler(
        "onRequest",
        this.serviceRef.current,
        params
      );
      if (!servicePromise) {
        servicePromise = this.serviceRef.current(...params);
      }
      const data = await servicePromise;
      if (this.count !== currentCount) {
        return new Promise(() => {});
      }
      this.setState({
        data,
        loading: false,
        error: undefined,
      });
      this.options.onSuccess?.(data, params);
      this.runImplHandler("onSuccess", params, data);
      this.options.onFinally?.(params, data, undefined);
      this.runImplHandler("onFinally", params, data);
    } catch (error) {
      this.setState({
        data: undefined,
        loading: false,
        error,
      });
      if (this.count !== currentCount) {
        return new Promise(() => {});
      }
      this.options.onError?.(error, params);
      this.runImplHandler("onError", params, error);
      this.options.onFinally?.(params, undefined, error);
      this.runImplHandler("onFinally", params, error);

      return Promise.reject(error);
    }
  }
  refresh() {
    return this.run(this.state.params);
  }
  refreshAsync() {
    return this.runAsync(this.state.params);
  }
  mutate(newData) {
    this.setState({
      data: newData,
    });
  }
  cancel() {
    this.count += 1;
    this.setState({ loading: false });
    this.options.onCancel?.();
    this.runImplHandler("onCancel");
  }
  runImplHandler(event, ...rest) {
    const result = this.pluginImpls
      .map((impl) => impl[event]?.(...rest))
      .filter(Boolean);

    return Object.assign({}, ...result);
  }
}

export default Fetch;
