import { NextRequest, NextResponse } from "next/server";

/**
 * Basic認証
 * @returns 拒否の場合はNextResponse、許可の場合はnull
 */
export default function requireBasicAuth(request: NextRequest): NextResponse | null {
  const authorization = request.headers.get('authorization');

  if (!authorization || !(authorization.startsWith('Basic '))) {
    return unauthorizedResponse();
  }

  const credential = authorization.replace('Basic ', '');
  const decodedCredential = Buffer.from(credential, 'base64').toString();
  const [user, pass] = decodedCredential.toString().split(':');

  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
    return unauthorizedResponse();
  }

  return null;
}

/**
 * 401+Basic認証表示用レスポンス生成
 */
function unauthorizedResponse() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}