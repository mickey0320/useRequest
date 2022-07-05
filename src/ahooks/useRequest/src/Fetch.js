class Fetch {
  constructor(serviceRef, render, options) {
    this.state = {
      loading: false,
      data: null,
      error: null
    }
    this.serviceRef = serviceRef
    this.render = render
  }
  setState(newState) {
    this.state = {
      ...this.state,
      ...newState
    }
    this.render()
  }
  async run() {
    this.runAsync().catch((error) => {
      console.log(error)
    })
  }
  async runAsync() {
    this.setState({
      loading: true
    })
    try {
      const data = await this.serviceRef.current()
      this.setState({
        data,
        loading: false
      })
    } catch (error) {
      this.setState({
        error,
        loading: false
      })

      return Promise.reject(error)
    }
  }
  refresh() {

  }
  refreshAsync() {

  }
}

export default Fetch