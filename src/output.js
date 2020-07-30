const pd = require('pretty-data').pd
const hex = require('hexer')
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
        case 'HEXDUMP':
          return hex(Buffer.from(data), { group: 1, offsetWidth: 5 })
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