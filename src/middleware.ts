import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('admin_session')?.value;

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Exclude login page from protection to avoid redirect loop
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
