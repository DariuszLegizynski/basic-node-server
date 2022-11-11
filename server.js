const fs = require('fs')
const fsAsync = require('fs').promises
const http = require('http')
const path = require('path')

const SERVER_PORT = 8080

const requestListener = async (req, res) => {
  let fileSystemPath = './public/'
  console.log(req.url)

  let contentType = 'text/html'
  let encoding = 'utf-8'

  if(req.url === '/') {
    fileSystemPath += '/index.html'
  } else if (req.url === '/index2') {
    fileSystemPath += '/index2.html'
  } else if (req.url.match(/.jpeg$/)) {
    contentType = "image/jpeg"
    fileSystemPath = "." + req.url
    encoding = null
  } else if (req.url.match(/.gif$/)) {
    contentType = "image/gif"
    fileSystemPath = "." + req.url
    encoding = null
  } else {
    fileSystemPath += '/404.html'
    res.statusCode = 404
  }

  try {
    const doc = await fsAsync.readFile(fileSystemPath, encoding)
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(doc)
  } catch (e) {
    res.writeHead(400, { 'Content-Type': contentType })
    res.end('NOT FOUND :( ')
  }
}

const server = http.createServer(requestListener)
server.listen(SERVER_PORT, () => {
  console.log(`Server running on PORT ${SERVER_PORT}`)
})