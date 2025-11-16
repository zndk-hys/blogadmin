import { NextRequest, NextResponse } from "next/server";
import checkIP from "./proxies/ip";
import requireBasicAuth from "./proxies/basicAuth";

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // IPチェック
  const forbiddenIP = checkIP(request);
  if (forbiddenIP) {
    return forbiddenIP;
  }

  // Basic認証
  const unauthorized = requireBasicAuth(request);
  if (unauthorized) {
    return unauthorized;
  }

  return NextResponse.next();
}