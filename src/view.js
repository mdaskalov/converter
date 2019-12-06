const mustache = require('mustache')
const fs = require('fs')
const path = require('path')

class View {
  constructor(name) {
    this.name = name
    this.error = undefined
  }

  setError(error) {
    this.error = error
    this.data = undefined
  }

  render() {
    var template = fs.readFileSync(path.join(__dirname, '../templates', this.name + '.mustache'), 'utf-8')
    return mustache.render(template, this);
  }
}

module.exports = View;