const events = require('events')

class BaseReporter extends events.EventEmitter {
  constructor(store) {
    super()
    this.store = store
    this.reporters = []

    this.on('spec:start', store.specStart.bind(store))
    this.on('suite:start', store.suiteStart.bind(store))
    this.on('test:end', store.testEnd.bind(store))
    this.on('test:output', store.testOutput.bind(store))
    this.on('suite:end', store.suiteEnd.bind(store))
    this.on('spec:end', store.specEnd.bind(store))
  }

  addReporter(reporter) {
    this.reporters.push(reporter)
  }

  handleEvent(...args) {
    if (this.listeners(args[0]).length) {
      this.emit.apply(this, args)
    }

    if (this.reporters.length === 0) {
      return
    }

    let isFired = false
    for (const reporter of this.reporters) {
      if (typeof reporter.emit !== 'function' || !reporter.listeners(args[0]).length) {
        continue
      }
      isFired = true
      reporter.emit.apply(reporter, args)
    }

    if (!isFired && args[1] && args[1].error) {
      console.log(args[1].error.stack)
    }
  }
}

module.exports = BaseReporter

