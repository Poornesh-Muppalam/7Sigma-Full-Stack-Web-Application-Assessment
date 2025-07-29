import jwt from 'jsonwebtoken';

export function verifyJWT(token: string): any | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}
