const fs = require('fs')
const fsAsync = require('fs').promises
const http = require('http')
const path = require('path')

const SERVER_PORT = 8080

const readAsyncFile = async (fileSystemPath, encoding) => {
  try {
    return await fsAsync.readFile(fileSystemPath, encoding)
  } catch (e) {
    res.writeHead(400, { 'Content-Type': contentType })
    res.end('NOT FOUND: ', e)
  }
}

const requestListener = async (req, res) => {
  let fileSystemPath = './public/'
  console.log(req.url)

  let contentType = 'text/html'
  let encoding = 'utf-8'
  let doc = null

  if(req.url === '/') {
    fileSystemPath += '/index.html'
    doc = await readAsyncFile(fileSystemPath, encoding)
    // res.statusCode = 200
  } else if (req.url === '/index2.html') {
    fileSystemPath += '/index2.html'
    doc = await readAsyncFile(fileSystemPath, encoding)
    // res.statusCode = 200
  } else if (req.url.match(/.jpeg$/)) {
    contentType = "image/jpeg"
    encoding = null

    fileSystemPath = "." + req.url
    let jpgReadStream = null

    try {
      doc = await fsAsync.createReadStream(fileSystemPath)
    } catch (e) {
      res.writeHead(400, { 'Content-Type': contentType })
      res.end('NOT FOUND: ', e)
    }

    // res.statusCode = 200

    doc.pipe(res)
  } else {
    fileSystemPath += '/404.html'
    res.statusCode = 404
  }

  res.writeHead(200, { 'Content-Type': contentType })
  res.end(doc)
}

const server = http.createServer(requestListener)
server.listen(SERVER_PORT, () => {
  console.log(`Server running on PORT ${SERVER_PORT}`)
})