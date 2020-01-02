// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { dialog } = require('electron').remote

const fs = require('fs').promises
const path = require('path')
const InputView = require('./src/input')
const OutputVeiw = require('./src/output')

const inputView = new InputView()
const outputView = new OutputVeiw()

const views = [inputView, outputView];

selectInputFile = async () => {
  result = await dialog.showOpenDialog({
    filters: [{
      name: 'Base64 Files',
      extensions: ['b64']
    }],
    properties: ['openFile']
  })
  var relativePath
  if (!result.canceled && result.filePaths.length >= 1) {
    relativePath = path.relative(process.cwd(), result.filePaths[0]);
  }
  return relativePath
}

selectOutputFile = async () => {
  result = await dialog.showSaveDialog({
      filters: [{
        name: 'XML Files',
        extensions: ['xml']
      }],
      defaultPath: 'output.xml'
  })
  var relativePath
  if (!result.canceled && result.filePath) {
    relativePath = path.relative(process.cwd(), result.filePath);
  }
  return relativePath
}

const deactivateDocLinks = () => {
  const active = document.querySelectorAll('.nav-group-item.active')
  Array.prototype.forEach.call(active, item => {
    item.classList.remove('active')
  })
}

const activateDocLink = viewName => {
  const docLink = document.querySelector(`#${viewName}-view.nav-group-item`)
  docLink.classList.add('active')
}

const renderDataPane = viewName => {
  const view = views.find(v => v.name == viewName)
  if (view) {
    document.querySelector('#data-pane').innerHTML = view.render();
    deactivateDocLinks()
    activateDocLink(viewName)
    view.updateEvents()
  }
}

// Events

const docButtons = document.querySelectorAll('.nav-group-item')
Array.prototype.forEach.call(docButtons, button => {
  const viewName = button.id.substring(0, button.id.indexOf("-view"))
  if (viewName != undefined) {
    button.addEventListener('click', () => {
      renderDataPane(viewName)
    })
  }
})

document.querySelector('#select-input-file').addEventListener('click', async () => {
  document.querySelector('#select-input-file').classList.add('active')
  let fileName = await selectInputFile()
  if (fileName) {
    deactivateDocLinks()
    try {
      let data = await fs.readFile(fileName)
      inputView.setData(data)
      let converted = await inputView.convert(data.toString())
      outputView.setData(converted)
    }
    catch(err) {
      outputView.setError(err)
    }
    renderDataPane('output')
  }
  document.querySelector('#select-input-file').classList.remove('active')
})

document.querySelector('#convert-button').addEventListener('click', async () => {
  document.querySelector('#convert-button').classList.add('active')
  if (inputView.data) {
    deactivateDocLinks()
    try {
      let converted = await inputView.convert(inputView.data)
      outputView.setData(converted)
    }
    catch(err) {
      outputView.setError(err)
    }
    renderDataPane('output')
  }
  else {
    dialog.showErrorBox('Nothing to convert', 'Load the input data first.')
  }
  document.querySelector('#convert-button').classList.remove('active')
})

document.querySelector('#select-output-file').addEventListener('click', async () => {
  document.querySelector('#select-output-file').classList.add('active')
  if (outputView.data) {
    let fileName = await selectOutputFile();
    if (fileName) {
      deactivateDocLinks()
      try {
        await fs.writeFile(fileName, outputView.data)
      }
      catch(err) {
        dialog.showErrorBox('Error writting file', err.toString())
      }
      renderDataPane('output')
    }
  }
  else {
    dialog.showErrorBox('Nothing to convert', 'Load the input data first.')
  }
  document.querySelector('#select-output-file').classList.remove('active')
})

// Global

renderDataPane('input')