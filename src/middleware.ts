import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require active subscription and approved account
const PROTECTED_RECRUITER_ROUTES = [
    '/recruiter/listings',
    '/recruiter/messages',
    '/recruiter/post-a-job',
];

export async function middleware(request: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    const pathname = request.nextUrl.pathname;

    // Add pathname to headers so layouts can access it
    res.headers.set('x-pathname', pathname);

    // Check if the route is the admin route (but not quick-account or dashboard which have their own password protection)
    if (pathname.startsWith('/admin') && !pathname.includes('quick-account') && !pathname.includes('dashboard')) {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user?.email || !['mohammad.zaid@gmail.com', 'your.friend@email.com'].includes(session.user.email)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Handle recruiter routes
    if (pathname.startsWith('/recruiter')) {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user?.id) {
            return NextResponse.redirect(new URL('/signup', request.url));
        }

        const userId = session.user.id;

        // Check trainer profile
        const { data: profile } = await supabase
            .from('TrainerProfiles')
            .select('is_completed, account_status')
            .eq('user_id', userId)
            .maybeSingle();

        // Redirect to onboarding if not complete (except for onboarding page itself)
        if (!pathname.includes('/onboarding')) {
            if (!profile || !profile.is_completed) {
                return NextResponse.redirect(new URL('/recruiter/onboarding', request.url));
            }
        }

        // Check protected routes that require subscription + approval
        const isProtectedRoute = PROTECTED_RECRUITER_ROUTES.some(route => pathname.startsWith(route));

        if (isProtectedRoute && profile?.is_completed) {
            // Check subscription status
            const { data: subscription } = await supabase
                .from('TrainerSubscriptions')
                .select('status')
                .eq('user_id', userId)
                .maybeSingle();

            const hasActiveSubscription = subscription?.status === 'active';
            const isAccountApproved = profile?.account_status === 'approved';
            const canAccess = hasActiveSubscription && isAccountApproved;

            if (!canAccess) {
                // Redirect to dashboard with a message
                const redirectUrl = new URL('/recruiter/dashboard', request.url);
                if (!hasActiveSubscription) {
                    redirectUrl.searchParams.set('error', 'subscription_required');
                } else if (!isAccountApproved) {
                    redirectUrl.searchParams.set('error', 'approval_pending');
                }
                return NextResponse.redirect(redirectUrl);
            }
        }
    }

    return res;
}

export const config = {
    matcher: ['/admin/:path*', '/recruiter/:path*'],
}; 