import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';



const loginRoute = ['/account/signin'];
// Define routes that do not require authentication (e.g., home, login)
const allowedRoutes = ['/account/signin']; // Add any route that should bypass authentication

// Define routes that require authentication
const protectedRoutes = ['/account/profile','/checkout','/account/orders']; // Add any route that needs to be protected

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
console.log(pathname)
  // Check if the route is in the allowedRoutes array (unauthenticated access)
  if (allowedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Skip static files and assets
  if (
    pathname.startsWith('/_next') || // Next.js build files
    pathname.startsWith('/images') || // Images
    pathname.startsWith('/favicon.ico') || // Favicon
    pathname.startsWith('/public') || // Public folder
    pathname.startsWith('/static') // Static folder
  ) {
    return NextResponse.next();
  }



  const token = request.cookies.get('ucid')?.value;
//  console.log("midd token")
//  console.log("pathname",pathname)
//  console.log(protectedRoutes.some(route => pathname.startsWith(route)))
  // Check if the route is in the protectedRoutes array
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    try {
    
      // Verify the token by sending a request to your backend (or validate it locally if possible)
      const response = await axios.post(`http://localhost:9000/api/v1/userverify`, null, {
        withCredentials: true,
        headers: { Cookie: `auth_token=${token}` },
      });
      console.log(response.data)
        // Store user ID in request headers
        request.headers.set('x-user-id', response.data.user._id);
       
   
      if (response.data.success == true) {
        console.log('User is authenticated',pathname,response.data.user._id);


      return NextResponse.next();

      } else {
        console.error('Authentication failed');
        return NextResponse.redirect(new URL('/account/signin', request.url));
      }
    } catch (error) {
      console.error('Token verification failed');
      return NextResponse.redirect(new URL('/account/signin', request.url)); // Redirect to login if token verification fails
    }
  }

  // If the route is neither in allowedRoutes nor protectedRoutes, allow access by default
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

// export const config = {
//   matcher: ['/:path*'] // Apply middleware to all routes
// };
