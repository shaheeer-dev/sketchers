const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io')

const app = next({ dev:  process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler();


app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  
  const io = new Server(server);

  io.on('connection', socket => {
    console.log('Client connected');
    console.log('ClientID: ', socket.id);


    socket.join("room-1");

    socket.on("drawing", (data) => {
      console.log("received data: ", data)
      socket.to("room-1").emit("receive-drawing", data);
    })

    socket.on("remove-all", (data) => {
      socket.to("room-1").emit("clear", data);
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});