const zlib = require('zlib')
const View = require('./view')

class InputView extends View
{
  constructor() {
    super('input')
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

  updateEvents() {
    // bind input textarea events
    let inputData = document.querySelector('#input-data')
    if (inputData) {
      inputData.addEventListener('change', event => {
        this.setData(event.target.value)
      })
    }
  }
}

module.exports = InputView