// types/fastify.d.ts
import 'fastify';
import { Server as SocketIOServer } from 'socket.io';

declare module 'fastify' {
  interface FastifyInstance {
    io: SocketIOServer;
  }

  interface FastifyRequest {
    user?: any;
  }
}

