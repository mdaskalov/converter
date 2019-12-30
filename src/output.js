const pd = require('pretty-data').pd
const View = require('./view')

class OutputView extends View {
  constructor() {
    super('output')
    this.format = 'xml'
  }

  setData(data) {
    this.error = undefined
    let asString = '' + data
    switch (this.format) {
      case 'xml':
        this.data=pd.xml(asString)
        break
      case 'json':
        this.data=pd.json(asString)
        break
    }
}
}

module.exports = OutputView