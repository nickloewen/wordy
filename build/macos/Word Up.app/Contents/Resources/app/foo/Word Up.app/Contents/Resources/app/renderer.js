const {dialog} = require('electron').remote
const writeFile = require('write-file')

// HTML elements to refer to
var word = document.getElementById('word')
var wordHolder = document.getElementById('wordHolder')
var allWords = document.getElementById('allWords')
var allWordsHolder = document.getElementById('allWordsHolder')
var switchBtn = document.getElementById('switch')
var title = document.getElementById('title')

// initial setup
allWords.value = ''
allWords.focus()
var mode = 'one'

let filePath

// functions that run more than once
allWords.onkeyup = function (event) {
  var sentence = allWords.value.split(/[\s]+/)
  var currentWord = sentence.pop()
  word.innerHTML = currentWord
}

// focus the allWords even if the user clicks out of it
document.getElementsByTagName('body')[0].onclick = function () { allWords.focus() }

// toggle between showing all the words and showing only one
switchBtn.onclick = function () {
  if (mode === 'one') {
    showAll()
    mode = 'all'
  } else {
    showOne()
    mode = 'one'
  }
}

// show all the words
function showAll () {
  allWordsHolder.style.zIndex = '1'
  wordHolder.style.zIndex = '-1'
}

// show only one word
function showOne () {
  allWordsHolder.style.zIndex = '-1'
  wordHolder.style.zIndex = '1'
  document.getElementsByTagName('body')[0].onclick = function () { allWords.focus() }
}

// check if fullscreen
const ipcRenderer = require('electron').ipcRenderer

ipcRenderer.on('screen', (event, message) => {
  if (message === 'enter-full-screen') {
    title.className = 'title fadeOut'
  }
  if (message === 'leave-full-screen') {
    title.className = 'title'
  }
})

ipcRenderer.on('save-file-as', saveAs)

function saveAs () {
  filePath = dialog.showSaveDialog({filters: [{name: 'Text', extensions: ['txt']}]})

  writeFile(filePath, allWords.value, function (err) {
    if (err) return console.log(err)
  })

  updateWindowTitle()
}

ipcRenderer.on('save-file', save)

function save () {
  if (filePath) {
    writeFile(filePath, allWords.value, function (err) {
      if (err) return console.log(err)
    })
  } else {
    saveAs()
  }
}

function updateWindowTitle () {
  title.innerHTML = filePath.slice(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
}
