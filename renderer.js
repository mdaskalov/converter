// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { dialog } = require('electron').remote

const fs = require('fs')
const path = require('path')
const InputView = require('./src/input')
const OutputVeiw = require('./src/output')

const inputView = new InputView()
const outputView = new OutputVeiw()

const views = [inputView, outputView];

selectInputFile = done => {
  dialog.showOpenDialog({
      filters: [{
        name: 'Base64 Files',
        extensions: ['b64']
      }],
      properties: ['openFile']

    })
    .then(result => {
      var relativePath
      if (!result.canceled && result.filePaths.length >= 1) {
        relativePath = path.relative(process.cwd(), result.filePaths[0]);
      }
      done(relativePath)
    })
}

selectOutputFile = done => {
  dialog.showSaveDialog({
      filters: [{
        name: 'XML Files',
        extensions: ['xml']
      }],
      defaultPath: 'output.xml'

    })
    .then(result => {
      var relativePath
      if (!result.canceled && result.filePath) {
        relativePath = path.relative(process.cwd(), result.filePath);
      }
      done(relativePath)
    })
}

const deactivateDocLinks = () => {
  const active = document.querySelectorAll('.nav-group-item.active')
  Array.prototype.forEach.call(active, item => {
    item.classList.remove('active')
  })
}

const activateDocLink = view => {
  const docLink = document.querySelector(`#${view}-view.nav-group-item`)
  docLink.classList.add('active')
}

const renderDataPane = viewName => {
  const view = views.find(v => v.name == viewName)
  if (view) {
    document.querySelector('#data-pane').innerHTML = view.render();
    // bind input textarea events
    let inputData = document.querySelector('#input-data')
    if (inputData) {
      inputData.addEventListener('change', event => {
        inputView.data = event.target.value.trim()
      })
    }
  }
}

// Events

const docButtons = document.querySelectorAll('.nav-group-item')
Array.prototype.forEach.call(docButtons, button => {
  const viewName = button.id.substring(0, button.id.indexOf("-view"))
  if (viewName != undefined) {
    button.addEventListener('click', () => {
      deactivateDocLinks()
      renderDataPane(viewName)
      activateDocLink(viewName)
    })
  }
})

document.querySelector(`#select-input-file`).addEventListener('click', () => {
  document.querySelector(`#select-input-file`).classList.add('active')
  selectInputFile(fileName => {
    document.querySelector('#select-input-file').classList.remove('active')
    if (fileName) {
      inputView.parseFile(fileName)
      .then(input => {
        deactivateDocLinks()
        activateDocLink('output')
        inputView.data = input
        inputView.decompress(input)
        .then(output => {
          outputView.setData(output)
          renderDataPane('output')
        })
        .catch(err => {
          outputView.setError(err)
          renderDataPane('output')
        })
      })
      .catch(err => {
        inputView.setError(err)
        deactivateDocLinks()
        activateDocLink('input')
        renderDataPane('input')
      })
    }
  })
})

document.querySelector('#decompress-button').addEventListener('click', () => {
  deactivateDocLinks()
  if (inputView.data) {
    activateDocLink('output')
    inputView.decompress(inputView.data)
    .then(result => {
      outputView.setData(result)
      outputView.error = undefined
      renderDataPane('output')
      })
    .catch(err => {
      outputView.error = err
      renderDataPane('output')
    })
  }
  else {
    dialog.showErrorBox('Nothing to convert', 'Load the input data first.')
  }
})

document.querySelector(`#select-output-file`).addEventListener('click', () => {
  document.querySelector(`#select-output-file`).classList.add('active')
  if (outputView.data) {
    selectOutputFile(fileName => {
      document.querySelector('#select-output-file').classList.remove('active')
      if (fileName) {
        output.saveFile(fileName, output.xml, () => {
          deactivateDocLinks()
          activateDocLink('output')
          renderDataPane('output')
        })
      }
    })
  }
  else {
    document.querySelector('#select-output-file').classList.remove('active')
    dialog.showErrorBox('Nothing to convert', 'Load the input data first.')
  }
})

// Global

renderDataPane('input')