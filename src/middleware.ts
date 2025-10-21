import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/vi',
    '/en',
    '/vi/',
    '/en/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api(.*)',
    '/vi/about(.*)',
    '/en/about(.*)',
    '/vi/exercise(.*)',
    '/en/exercise(.*)',
]);

const isAdminRoute = createRouteMatcher(['/vi/admin(.*)', '/en/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
    if (isAdminRoute(req)) {
        const user = await auth.protect();
        if (user.sessionClaims.role !== 'admin') {
            return new NextResponse(null, { status: 404 });
        }
    }

    // 2. Kiểm tra các route cần login
    if (!isPublicRoute(req)) {
        try {
            await auth.protect(); // bảo vệ route
        } catch {
            // Redirect người dùng chưa đăng nhập về sign-in
            const signInUrl = new URL('/sign-in', req.url);
            // Clerk sẽ tự handle redirect after login theo env NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
            return NextResponse.redirect(signInUrl);
        }
    }
});

// export default clerkMiddleware();

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
        // '/trpc/(.*)',
    ],
};
