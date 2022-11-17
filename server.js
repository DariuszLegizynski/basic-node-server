const fsAsync = require('fs').promises
const http = require('http')

const SERVER_PORT = 3000

const SERVER_TIME = new Date().toUTCString()

parseCookies = str => {
  let rx = /([^;=\s]*)=([^;]*)/g
  let obj = {}
  for (let m; m = rx.exec(str); )
    obj[m[1]] = decodeURIComponent(m[2])
  return obj
}

stringifyCookies = cookies => {
  return Object.entries(cookies)
    .map(([k,v]) => k + '=' + encodeURIComponent(v))
    .join('; ')
}

const requestListener = async (req, res) => {
  let fileSystemPath = './public'
  console.log("from the listener: ", SERVERTIME)

  let contentType = 'text/html'
  let encoding = 'utf-8'

  if (req.url.match(/.js$/)) {
    contentType = "application/javascript"
    fileSystemPath += req.url
  } else if (req.url.match(/.css$/)) {
    contentType = "text/css"
    fileSystemPath += req.url
  } else if (req.url === '/') {
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
    // res.writeHead(200, { 'Set-Cookie': stringifyCookies(cookies), 'Content-Type': contentType })
    res.writeHead(200, { lastModified: SERVER_TIME, ETag: "7b-17459ce6217", 'Content-Type': contentType })
    res.end(doc)
  } catch (e) {
    res.writeHead(400, { 'Content-Type': contentType })
    res.end('NOT FOUND :( ')
  }
}

const server = http.createServer(requestListener)
server.listen(SERVER_PORT, () => {
  console.log(`Server running on PORT ${SERVER_PORT}`)
  console.log(SERVER_TIME)
})