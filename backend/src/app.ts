
import Fastify from 'fastify';
import { Server } from 'socket.io';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import jwt from '@fastify/jwt'; // ✅ NEW: JWT plugin
import dotenv from 'dotenv';

import protectedRoutes from './routes/protectedUpload';
import authRoutes from './auth';

dotenv.config();
console.log("✅ Starting Fastify backend...");

async function main() {
  const fastify = Fastify({ logger: true });

  // ✅ Register JWT plugin
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'super-secret-key',
  });

  // ✅ Register core plugins
  await fastify.register(multipart);
  await fastify.register(cors, {
    origin: '*',
  });


  // ✅ Attach socket.io to Fastify's native HTTP server
  const io = new Server(fastify.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 WebSocket connected: ${socket.id}`);
    socket.emit('message', 'Socket connection established!');
  });

  // Make io accessible from Fastify instance
  fastify.decorate('io', io);

  // ✅ Register routes
  await fastify.register(authRoutes);      // 🔑 Google OAuth
  await fastify.register(protectedRoutes); // 🔒 Protected upload

  // ✅ Start Fastify server
  const PORT = Number(process.env.PORT) || 5001;
  await fastify.listen({ port: PORT, host: '0.0.0.0' });

  console.log(`🚀 Server running at http://localhost:${PORT}`);
}

// Safely run server
main().catch((err) => {
  console.error("❌ Server startup failed:", err);
  process.exit(1);
});
