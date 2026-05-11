import { Server as HttpServer } from "http";
import { Server } from "socket.io";

export function setupSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join:poll", (pollId: string) => {
      socket.join(`poll:${pollId}`);
    });

    socket.on("leave:poll", (pollId: string) => {
      socket.leave(`poll:${pollId}`);
    });
  });

  return io;
}
