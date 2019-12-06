const zlib = require('zlib')
const fs = require('fs')
const View = require('./view')

class InputView extends View
{
  constructor() {
    super('input')
    this.data = undefined
  }

  decompress(source) {
    return new Promise((resolve,reject) => {
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

  parseFile(filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, (err, data) => {
          if (err)
            reject(err)
          else {
            resolve(data.toString())
          }
      })
    })
  }
}

module.exports = InputView