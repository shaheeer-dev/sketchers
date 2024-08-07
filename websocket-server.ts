import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { handleConnection } from './sockets/eventHandlers';

const app = next({ dev:  process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler();

const server = createServer((req: any, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
});

export const io = new Server(server);

app.prepare().then(() => {
  io.on('connection', socket => {
    handleConnection(socket, io)
  });
});

server.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});