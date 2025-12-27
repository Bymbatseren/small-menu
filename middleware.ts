import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_SECRET!);

const PROTECTED_PATHS = ['/admin'];
const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/api/auth', '/api/socket'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublic) {
    return NextResponse.next();
  }
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error:any) {
      return { success: false, error: error.message };
      
    }
  }
  if (!refreshToken) {
    return redirectToLogin(request);
  }

  try {
    const { payload } = await jwtVerify(refreshToken, REFRESH_SECRET);


    const newAccessToken = await new SignJWT({
      id: payload.id as string,
      email: payload.email as string
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(JWT_SECRET);


    const response = NextResponse.next();
    response.cookies.set('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60,
    });

    return response;

  } catch (error) {
    return redirectToLogin(request, true);
  }
}

function redirectToLogin(request: NextRequest, clearCookies = false) {
  const url = new URL('/sign-in', request.url);
  url.searchParams.set('redirect', request.nextUrl.pathname);
  const response = NextResponse.redirect(url);

  if (clearCookies) {
    response.cookies.delete('token');
    response.cookies.delete('refreshToken');
  }
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],

};