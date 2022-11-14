# basic-node-server
Node.js just for fun

```
const fsAsync = require('fs').promises;
const http = require('http');
const requestListener = async function (req, res) {
  console.log(req.url);
  // console.log(req.headers.cookie);
  try {
    const fileSystemPath = 'public/index.html';
    const encoding = 'utf-8';
    const doc = await fsAsync.readFile(fileSystemPath, encoding);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(doc);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('NOT FOUND :( ');
  }
};
const server = http.createServer(requestListener);
server.listen(8080);
```


11:18 Uhr
Problem: dieser server gibt immer public/index.html zurueck. Wennn die url http://localhost:8000/index2.html lautet soll public/index2.html zurückgegeben werden.
11:21 Uhr
email mit betreff webserver schritt 1
