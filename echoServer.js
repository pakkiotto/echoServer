const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

let serverSockets = new Set();
// Create http server
const server = http.createServer((req, res) => {
  console.log(`Received request with method: ${req.method} at url: ${req.url}`)
    let requestBody = [];
    let parsedData;
    // On event data collect chunks
    req.on('data', (chunks) => {
      requestBody.push(chunks);
    });

    // On event end emit the result
    req.on('end', async () => {
      console.log(requestBody.toString())
      parsedData = Buffer.concat(requestBody).toString();
      // Add timeout to see parallel calls
      setTimeout(function() {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(parsedData);
      }, 2000);
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Intercept event connection on socket
server.on('connection', socket => {
  const id = socket._handle.fd
  console.log(`Creating new socket with id: ${socket._handle.fd} for address: ${socket.remoteAddress} and port ${socket.remotePort}`)
  serverSockets.add(socket);

  socket.on('close', () => {
    console.log("Closing socket: ", id);
    serverSockets.delete(socket);
  })
});