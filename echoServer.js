const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

let serverSockets = new Set();

const server = http.createServer((req, res) => {
  console.log(`Received request with method: ${req.method} at url: ${req.url}`)
    let requestBody = [];
    let parsedData;

    req.on('data', (chunks) => {
      requestBody.push(chunks);
    });

    req.on('end', async () => {
      console.log(requestBody.toString())
      parsedData = Buffer.concat(requestBody).toString();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(parsedData);
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

server.on('connection', socket => {
  const id = socket._handle.fd
  console.log(`Creating new socket with id: ${socket._handle.fd} for address: ${socket.remoteAddress} and port ${socket.remotePort}`)
  serverSockets.add(socket);

  socket.on('close', () => {
    console.log("Closing socket: ", id);
    serverSockets.delete(socket);
  })
});