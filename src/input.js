const zlib = require('zlib')
const View = require('./view')

class InputView extends View
{
  constructor() {
    super('input')
    this.data = undefined
  }

  convert(source) {
    return new Promise((resolve, reject) => {
      let b64decoded = new Buffer.from(source, 'base64')
      zlib.unzip(b64decoded, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    })
  }
}

module.exports = InputView