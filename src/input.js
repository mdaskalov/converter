const zlib = require('zlib')
const View = require('./view')

class InputView extends View
{
  constructor() {
    super('input')
    this.format = 'Base64-Decode'
  }

  htmlDecode(input) {
    var e = document.createElement('textarea')
    e.innerHTML = input
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue
  }

  convert(source) {
    return new Promise((resolve, reject) => {
      switch (this.format) {
        case 'Base64-Encode':
          const b64encoded = source.toString('base64')
          resolve(b64encoded);
          break;
        case 'Base64-Decode':
          const b64decoded = new Buffer.from(source, 'base64')
          resolve(b64decoded)
          break
        case 'Base64-ZIP-Decode':
          zlib.unzip(b64decoded, (err, result) => {
            if (err) {
              reject(err)
            }
            else {
              resolve(result)
            }
          })
          break
        case 'HTML-Decode':
          resolve(this.htmlDecode(source))
          break
        case 'Unchanged':
          resolve(source)
          break
      }
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