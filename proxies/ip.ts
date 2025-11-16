import { NextRequest, NextResponse } from "next/server";

/**
 * IP制限
 * @param request 
 * @returns 
 */
export default function checkIP(request: NextRequest): NextResponse | null {
  const allowed = process.env.ALLOWED_IP;
  if (!allowed) {
    return forbiddenResponse();
  }

  const allowedList = allowed.split(',').map(ip => ip.trim());

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0].trim() ?? '';
  
  if (!allowedList.includes(ip)) {
    return forbiddenResponse();
  }

  return null;
}

function forbiddenResponse() {
  return new NextResponse('Forbidden', {
    status: 403,
  })
}