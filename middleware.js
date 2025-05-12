import getUser from '@/lib/getUser/getUser'
import { NextResponse } from 'next/server'


export function middleware(request) {
  const isAuthenticated = getUser()
  console.log('auth', isAuthenticated)

  // If the user is authenticated, continue as normal
  // if (request.url == "/signup/complete_profile") {
  //   if (isAuthenticated) {
  //     NextResponse.redirect(new URL('/all-trainings', request.url))
  //   }
  // }

  // Redirect to login page if not authenticated
  return NextResponse.redirect(new URL('/signup', request.url))
}

export const config = {
  matcher: ['/dashboard/:path*', '/signup/complete_profile'],
}