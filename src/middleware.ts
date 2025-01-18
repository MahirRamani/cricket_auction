import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request })
    const url = request.nextUrl

    if (token
        &&
        (
            // url.pathname.endsWith('/') ||
            url.pathname.startsWith('/login')
            // url.pathname.startsWith('/rate') ||
            // url.pathname.startsWith('/admin')
        )
    ) {
        console.log("token", token);

        return NextResponse.redirect(new URL('/rate', request.url))
    }

    if (token && token.role != "admin" && url.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    console.log("without token");
    
    if (!token
        &&
        (url.pathname.startsWith('/rate') || url.pathname.startsWith("/admin"))
    ) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/login',
        '/rate',
        '/admin',
        '/dashboard/:path*',
    ],
}