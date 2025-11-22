import { NextRequest, NextResponse } from "next/server";
import verifyJwt from "./proxies/jwt";

export async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // ログイン画面は常にアクセス許可
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  // JWT検証
  const invalidJwt = await verifyJwt(request);
  if (invalidJwt) {
    return invalidJwt;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}