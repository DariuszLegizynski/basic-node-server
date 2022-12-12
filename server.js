const fsAsync = require('fs').promises
const http = require('http')

const SERVER_PORT = 3000

const SERVER_TIME = new Date().toUTCString()

// const parseCookies = str => {
//   const rx = /([^;=\s]*)=([^;]*)/g
//   const obj = {}
//   for (let m; m === rx.exec(str);)
//     obj[m[1]] = decodeURIComponent(m[2])
//   return obj
// }

// const stringifyCookies = cookies => {
//   return Object.entries(cookies)
//     .map(([k, v]) => k + '=' + encodeURIComponent(v))
//     .join('; ')
// }

const requestListener = async (req, res) => {
  req.url = 'index.html'
  let fileSystemPath = `./public/${req.url}`

  console.log('req: ', req.headers)
  // console.log("res: ", res)

  let contentType = 'text/html'
  let encoding = 'utf-8'

  if (req.url.match(/.js$/)) {
    contentType = 'application/javascript'
    fileSystemPath += req.url
  } else if (req.url.match(/.css$/)) {
    contentType = 'text/css'
    fileSystemPath += req.url
  } else if (req.url === '/') {
    fileSystemPath += '/index.html'
  } else if (req.url === '/index2') {
    fileSystemPath += '/index2.html'
  } else if (req.url.match(/.jpeg$/)) {
    contentType = 'image/jpeg'
    fileSystemPath = '.' + req.url
    encoding = null
  } else if (req.url.match(/.gif$/)) {
    contentType = 'image/gif'
    fileSystemPath = '.' + req.url
    encoding = null
  } else {
    fileSystemPath += '/404.html'
    res.statusCode = 404
  }

  let doc = null

  try {
    doc = await fsAsync.readFile(fileSystemPath, encoding)
    // res.writeHead(200, { 'Set-Cookie': stringifyCookies(cookies), ETag: "7b-17459ce6217", 'Content-Type': contentType })
  } catch (e) {
    res.writeHead(400, { 'Content-Type': contentType })
    res.end('NOT FOUND :( ')
  }

  if (req.headers['if-modified-since'] === SERVER_TIME) {
    res.writeHead(304)
  } else {
    res.writeHead(200, { 'Last-Modified': SERVER_TIME, 'Content-Type': contentType })
  }

  res.end(doc)
}

const server = http.createServer(requestListener)
server.listen(SERVER_PORT, () => {
  console.log(`Server running on PORT ${SERVER_PORT}`)
  console.log(SERVER_TIME)
})
