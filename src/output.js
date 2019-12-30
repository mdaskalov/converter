const pd = require('pretty-data').pd
const View = require('./view')

class OutputView extends View {
  constructor() {
    super('output')
    this.format = 'XML'
  }

  renderData() {
    this.error = undefined
    let data = '' + (this.data === undefined ? '' : this.data)
    try {
      switch (this.format) {
        case 'XML':
          return pd.xml(data)
          break
        case 'JSON':
          return pd.json(data)
          break
        case 'CSS':
          return pd.css(data)
          break
        case 'SQL':
          return pd.sql(data)
          break
        default:
          return data
          break
      }
    }
    catch (err) {
      console.log('pretty error: ', err)
    }
    return data
  }
}

module.exports = OutputView