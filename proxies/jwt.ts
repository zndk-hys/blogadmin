import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

/**
 * JWT検証
 * @returns 拒否の場合はNextResponse、許可の場合はnull
 */
export default async function verifyJwt(request: NextRequest): Promise<NextResponse | null> {
  // 環境変数からアルゴリズムと鍵を取得
  const alg = process.env.JWT_ALG;
  const base64Key = process.env.JWT_KEY;
  if (!alg || !base64Key) {
    throw new Error();
  }

  // base64をデコードしてバイト列に変換
  const secretKey = Buffer.from(base64Key, 'base64');

  // CookieからJWTを取得
  const cookieStore = request.cookies;
  const jwt = cookieStore.get('jwt')?.value;
  if (!jwt) {
    return redirectResponse(request);
  }

  // jwtVerifyで検証エラーの場合、例外が発生する
  try {
    // jwt検証
    const result = await jwtVerify(jwt, secretKey, {
      algorithms: [alg],
    });

  } catch (e) {
    // 検証エラー
    return redirectResponse(request);
  }

  return null;
}

/**
 * ログイン画面へのリダイレクトレスポンス生成
 */
function redirectResponse(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}