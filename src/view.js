const mustache = require('mustache');
const fs = require('fs');
const path = require('path');

class View {
  constructor(name) {
    this.name = name;
    this.error = undefined;
    this.data = undefined;
  }

  setData(data) {
    this.error = undefined;
    this.data = (data + '').trim();
  }

  setError(error) {
    this.error = error;
    this.data = undefined;
  }

  renderData() {
    return this.data;
  }

  render() {
    const template = fs.readFileSync(path.join(__dirname, '../templates', this.name + '.mustache'), 'utf-8');
    const view = { error: this.error, data: this.renderData() };
    return mustache.render(template, view);
  }
}

module.exports = View;
