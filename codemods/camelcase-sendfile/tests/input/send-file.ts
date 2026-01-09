import express from "express";
import path from "path";
import sendfile from "other-place"

const app = express();
const options = {
  root: path.join(__dirname, 'public'),
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
}

const sharedSendFile = (res, next, fileName) => {
  res.sendfile(fileName, options, (err) => {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
}

app.get('/file/:name', (req, res, next) => {
  res.sendfile()
})

app.get('/file/:name', (req, res, next) => {
  res.sendfile("file.txt")
})

app.get('/file/:name', (req, res, next) => {
  const fileName = req.params.name

  res.sendfile(fileName, options, (err) => {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
  sharedSendFile(res, next, fileName);
})

app.get('/filename/:name', function (req, res, next) {
  const fileName = req.params.name
  
  res.sendfile(fileName, options, (err) => {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
  sharedSendFile(res, next, fileName);
})

app.get('/file-handler', (req, res, next) => {
  sendfile('test', options, (err) => {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', 'test')
    }
  })
})