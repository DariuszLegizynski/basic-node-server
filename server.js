const fsAsync = require('fs').promises
const http = require('http')
const requestListener = async (req, res) => {
  console.log(req.url)
  // console.log(req.headers.cookie)
  let fileSystemPath = './public/'
  switch(req.url){
    case '/':
      fileSystemPath += 'index.html'
      break
    case '/index2':
      fileSystemPath += 'index2.html'
      break
    default:
      fileSystemPath += '404.html'
      break
  }

  try {
    const encoding = 'utf-8'
    const doc = await fsAsync.readFile(fileSystemPath, encoding)
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(doc)
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' })
    res.end('NOT FOUND :( ')
  }
}
const server = http.createServer(requestListener)
server.listen(8080)