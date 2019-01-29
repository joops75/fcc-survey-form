const http = require('http');
const path = require('path');
const qs = require('querystring');
const fs = require('fs');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let filePath;
  let body = '';
  let contentType;
  if (req.url === '/' && req.method === 'GET') {
    filePath = path.join(__dirname, 'index.html');
    contentType = 'text/html';
  }
  if (req.url === '/send' && req.method === 'POST') {
    filePath = path.join(__dirname, 'thanks.html');
    contentType = 'text/html';
    req.on('data', function (data) {
      body += data;
      if (body.length > 1e6) req.connection.destroy();
      req.on('end', function () {
        console.log(qs.parse(body));
      })
    })
  }
  if (req.url === '/style.css' && req.method === 'GET') {
    filePath = path.join(__dirname, 'style.css');
    contentType = 'text/css';
  }
  if (filePath) {
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
})

server.listen(port);
