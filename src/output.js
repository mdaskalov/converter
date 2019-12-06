const { dialog } = require('electron').remote
const fs = require('fs')
const pd = require('pretty-data').pd
const View = require('./view')

class OutputView extends View {
  constructor() {
    super('output')
    this.format = 'xml'
  }

  setData(data) {
    this.error = undefined
    switch (this.format) {
      case 'xml':
        this.data=pd.xml(data.toString())
        break
      case 'json':
        this.data=pd.json(data.toString())
        break
    }
  }

  async saveFile(name) {
    try {
      await fs.writeFile(name, this.data)
    }
    catch(err) {
      dialog.showErrorBox('Error writting file', err)
    }
  }
}

module.exports = OutputView