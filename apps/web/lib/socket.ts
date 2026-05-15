'use client';

import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socket: null | Socket = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}
