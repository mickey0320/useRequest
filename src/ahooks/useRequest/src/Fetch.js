class Fetch {
  constructor(serviceRef, render, options) {
    this.state = {
      loading: false,
      data: null,
      error: null,
      params: null,
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
    this.setState({
      loading: true,
      params,
    });
    try {
      if (this.options.onBefore) {
        this.options.onBefore(params);
      }
      const data = await this.serviceRef.current(...params);
      if (this.count !== currentCount) {
        return new Promise(() => {});
      }
      this.setState({
        data,
        loading: false,
        error: undefined,
      });
      if (this.options.onSuccess) {
        this.options.onSuccess(data, params);
      }
      if (this.options.onFinally) {
        this.options.onFinally(params, data, undefined);
      }
    } catch (error) {
      this.setState({
        data: undefined,
        loading: false,
        error,
      });
      if (this.count !== currentCount) {
        return new Promise(() => {});
      }
      if (this.options.onError) {
        this.options.onError(error, params);
      }
      if (this.options.onFinally) {
        this.options.onFinally(params, undefined, error);
      }

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
    if (this.options.onCancel) {
      this.options.onCancel();
    }
  }
}

export default Fetch;
