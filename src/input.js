const zlib = require('zlib');
const View = require('./view');

class InputView extends View {
  constructor() {
    super('input');
    this.format = 'Base64-Decode';
  }

  hexStringToString(str) {
    let res = '';
    if (str) {
      const result = [];
      for (let i = 0, len = str.length; i < len; i += 2) {
        const hex = parseInt(str.substr(i, 2), 16);
        result.push(hex);
      }
      res = String.fromCharCode.apply(null, result);
    }

    return res;
  }

  htmlDecode(input) {
    const e = document.createElement('textarea');
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
  }

  convert(source) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line new-cap
      const b64decoded = new Buffer.from(source, 'base64');
      switch (this.format) {
        case 'Base64-Encode':
          resolve(source.toString('base64'));
          break;
        case 'Base64-Decode':
          resolve(b64decoded);
          break;
        case 'Base64-ZIP-Decode':
          zlib.unzip(b64decoded, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
          break;
        case 'HTML-Decode':
          resolve(this.htmlDecode(source));
          break;
        case 'Hex-String Decode':
          resolve(this.hexStringToString(source));
          break;
        case 'Unchanged':
          resolve(source);
          break;
      }
    });
  }

  updateEvents() {
    // bind input textarea events
    const inputData = document.querySelector('#input-data');
    if (inputData) {
      inputData.addEventListener('change', event => {
        this.setData(event.target.value);
      });
    }
  }
}

module.exports = InputView;
