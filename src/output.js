const pd = require('pretty-data').pd;
const hex = require('hexer');
const View = require('./view');

class OutputView extends View {
  constructor() {
    super('output');
    this.format = 'XML';
  }

  renderData() {
    this.error = undefined;
    const data = '' + (this.data === undefined ? '' : this.data);
    try {
      switch (this.format) {
        case 'XML': return pd.xml(data);
        case 'JSON':
          return pd.json(data);
        case 'CSS':
          return pd.css(data);
        case 'SQL':
          return pd.sql(data);
        case 'XML-Min':
          return pd.xmlmin(data);
        case 'JSON-Min':
          return pd.jsonmin(data);
        case 'CSS-Min':
          return pd.cssmin(data);
        case 'SQL-Min':
          return pd.sqlmin(data);
        case 'HEXDUMP':
          return hex(Buffer.from(data), { group: 1, offsetWidth: 5 });
        default:
          return data;
      }
    } catch (err) {
      console.log('pretty error: ', err);
    }
    return data;
  }
}

module.exports = OutputView;
