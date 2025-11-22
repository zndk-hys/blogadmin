'use server'

import argon2 from "argon2";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function login(formData: FormData) {
  const alg = process.env.JWT_ALG;
  const base64Key = process.env.JWT_KEY;
  const password = process.env.ADMIN_PASS;
  if (!alg || !base64Key || !password) {
    throw new Error();
  }

  const raw = {
    user: String(formData.get('user') ?? ''),
    password: String(formData.get('password') ?? ''),
  }

  // ハッシュ化したパスワードが壊れているとエラーが出るためキャッチする
  try {
    const validPassword = await argon2.verify(password, raw.password);
    if (raw.user !== process.env.ADMIN_USER || !validPassword) {
      return invalidIdOrPassword();
    }
  } catch(e) {
    return invalidIdOrPassword();
  }

  // JWT発行
  const secretKey = Buffer.from(base64Key, 'base64');
  const jwt = await issueJwt(alg, secretKey, raw.user);

  const cookieStore = await cookies();
  cookieStore.set('jwt', jwt, {
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'lax',
  });

  redirect('/');
}

/**
 * IDかパスワードが間違っていた時用のレスポンス
 */
function invalidIdOrPassword() {
  return {
    error: true,
    message: 'ユーザー名またはパスワードが間違っています',
  };
}

/**
 * JWT発行
 */
async function issueJwt(alg: string, secretKey: Uint8Array<ArrayBufferLike>, user: string) {
  const header = {
    alg,
  };

  const payload = {
    user,
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey);
  
  return jwt;
}