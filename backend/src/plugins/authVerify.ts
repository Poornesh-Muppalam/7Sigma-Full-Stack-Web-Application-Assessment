// src/plugins/authVerify.ts

import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

const authVerify: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify(); // ✅ Verifies and attaches decoded token to request.user
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized: Invalid or missing token' });
    }
  });
};

export default fp(authVerify);
