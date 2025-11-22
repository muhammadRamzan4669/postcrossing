import bcrypt from "bcryptjs";
import { EncryptJWT, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_TOKEN);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

//Create JWT_SECRET
export async function createToken(payload: {
  userId: string,
  username: string,
  email: string
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromToken(): Promise<any> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get('token');

  if (!token)
    return null;

  return verifyToken(token.value);
}

export async function requireAuth() {
  const user = getUserFromToken();

  if (!user)
    throw new Error('Unauthorized User');

  return user;
}
