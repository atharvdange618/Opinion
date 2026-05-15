import { Server as SocketIOServer } from 'socket.io';

let io: null | SocketIOServer = null;

export function getIO(): SocketIOServer {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export function setIO(instance: SocketIOServer) {
  io = instance;
}
