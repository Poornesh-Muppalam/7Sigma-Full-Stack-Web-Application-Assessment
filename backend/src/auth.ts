// import { FastifyPluginAsync } from 'fastify';
// import fastifyOauth2 from 'fastify-oauth2';
// import jwt from 'jsonwebtoken';
// import fp from 'fastify-plugin';
// import { fetch } from 'undici';
// import dotenv from 'dotenv';
// dotenv.config();

// interface GoogleUser {
//   id: string;
//   email: string;
//   name: string;
//   picture: string;
// }

// const authRoutes: FastifyPluginAsync = async (fastify) => {
//   fastify.register(fastifyOauth2, {
//     name: 'googleOAuth2',
//     scope: ['profile', 'email'],
//     credentials: {
//       client: {
//         id: process.env.GOOGLE_CLIENT_ID!,
//         secret: process.env.GOOGLE_CLIENT_SECRET!,
//       },
//       auth: fastifyOauth2.GOOGLE_CONFIGURATION,
//     },
//     startRedirectPath: '/auth/google',
//     callbackUri: 'http://localhost:5001/auth/google/callback',
//   });

//   fastify.get('/auth/google/callback', async (request, reply) => {

//     console.log('✅ Google callback hit');
//     console.log('🔑 Code:', request.query);

//     const { code } = request.query as { code: string };


//     try {
//       // 🔁 Step 1: Exchange authorization code for access token
//       const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: new URLSearchParams({
//           code,
//           client_id: process.env.GOOGLE_CLIENT_ID!,
//           client_secret: process.env.GOOGLE_CLIENT_SECRET!,
//           redirect_uri: 'http://localhost:5001/auth/google/callback',
//           grant_type: 'authorization_code',
//         }),
//       });

//       // const tokenData = await tokenRes.json();
//       // console.log('🔍 tokenData:', tokenData);

//       // const accessToken = await tokenRes.json() as { access_token: string };

//       const tokenData = await tokenRes.json() as { access_token: string };
//       console.log('🔍 tokenData:', tokenData);

//       const accessToken = tokenData.access_token;



//       if (!accessToken) {
//         return reply.code(500).send({ error: 'access_token not found in token response' });
//       }

//       // ✅ Step 2: Fetch user info from Google
//       const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       const userInfo = await userInfoRes.json() as GoogleUser;

//       console.log('✅ userInfo:', userInfo);

//       if (!userInfo || !userInfo.email) {
//         throw new Error('❌ Failed to fetch user info from Google');
//       }

//       // ✅ Step 3: Sign a JWT and redirect to frontend
//       const jwtToken = jwt.sign(userInfo, process.env.JWT_SECRET!, { expiresIn: '1h' });

//       reply.redirect(`http://localhost:5173?token=${jwtToken}`);
//     } catch (err) {
//       console.error('❌ OAuth callback error:', err);
//       reply.code(500).send({ error: 'OAuth callback failed', message: (err as Error).message });
//     }
//   });
// };

// export default fp(authRoutes);

import { FastifyPluginAsync } from 'fastify';
import fastifyOauth2 from '@fastify/oauth2';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Register Google OAuth2
  fastify.register(fastifyOauth2, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID!,
        secret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/auth/google',
    callbackUri: 'http://localhost:5001/auth/google/callback',
  });

  // Google OAuth2 Callback Route
  fastify.get('/auth/google/callback', async function (request, reply) {
    try {
      const tokenResponse = await (fastify as any).googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
console.log("🔑 Access Token Response:", tokenResponse);

if (!tokenResponse?.token?.access_token) {
  console.error("❌ Access token missing from tokenResponse");
  return reply.status(401).send({ error: "No access token" });
}

const googleUserInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
  headers: {
    Authorization: `Bearer ${tokenResponse.token.access_token}`,
  },
}).then(res => res.json());

console.log("🧠 Google user info:", googleUserInfo);

      
      const token = (fastify as any).jwt.sign({
        email: googleUserInfo.email,
        name: googleUserInfo.name,
        picture: googleUserInfo.picture,
      });
  
      return reply.redirect(`http://localhost:5173/dashboard?token=${token}`);
    } catch (err) {
      console.error('❌ OAuth2 callback failed with error:', err); // 👈 Add this
      return reply.status(500).send({ message: 'OAuth2 callback failed', error: (err as Error).message });
    }
  });
  
};

export default authRoutes;
