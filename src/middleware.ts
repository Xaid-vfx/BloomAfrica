import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Check if the route is the admin route (but not quick-account)
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.includes('quick-account')) {
        // Get the session
        const {
            data: { session },
        } = await supabase.auth.getSession();

        // If no session or email not in allowed list, redirect to home
        if (!session?.user?.email || !['mohammad.zaid@gmail.com', 'your.friend@email.com'].includes(session.user.email)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return res;
}

export const config = {
    matcher: ['/admin/:path*'],
}; 