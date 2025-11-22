'use server'

import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function login(formData: FormData) {
  const alg = process.env.JWT_ALG;
  const base64Key = process.env.JWT_KEY;
  if (!alg || !base64Key) {
    throw new Error();
  }

  const raw = {
    user: String(formData.get('user') ?? ''),
    password: String(formData.get('password') ?? ''),
  }

  if (raw.user !== process.env.ADMIN_USER || raw.password !== process.env.ADMIN_PASS) {
    return {
      error: true,
      message: 'ユーザー名またはパスワードが間違っています',
    };
  }

  /**
   * JWT発行
   */
  const secretKey = Buffer.from(base64Key, 'base64');

  const header = {
    alg,
  };

  const payload = {
    user: raw.user,
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey);

  const cookieStore = await cookies();
  cookieStore.set('jwt', jwt, {
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'lax',
  });

  redirect('/');
}