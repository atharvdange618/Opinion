import { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';

export function setupSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      credentials: true,
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
  });

  io.on('connection', (socket) => {
    socket.on('join:poll', (pollId: string) => {
      void socket.join(`poll:${pollId}`);
    });

    socket.on('leave:poll', (pollId: string) => {
      void socket.leave(`poll:${pollId}`);
    });
  });

  return io;
}
