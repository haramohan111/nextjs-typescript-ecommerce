import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';


const loginRoute = '/admin';
// Define routes that do not require authentication (e.g., home, login)
const allowedRoutes = ['/admin']; // Add any route that should bypass authentication

// Define routes that require authentication
const protectedRoutes = ['/dashboard', '/category/add-category','/category/manage-category',
  '/subcategory/add-subcategory','/subcategory/manage-subcategory']; // Add any route that needs to be protected

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

  const token = request.cookies.get('uaid')?.value;
console.log(token)
  // Check if the route is in the protectedRoutes array
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    try {
    
      // Verify the token by sending a request to your backend (or validate it locally if possible)
      const response = await axios.post(`http://localhost:9000/api/v1/adminverify`, null, {
        withCredentials: true,
        headers: { Cookie: `auth_token=${token}` },
      });
      console.log(response.data)
      if (response.data.success == true) {
        console.log('User is authenticated');
console.log(pathname)
        // Redirect authenticated users away from the login page
        if (pathname === '/') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return NextResponse.next(); // Allow access if token is valid
      } else {
        console.error('Authentication failed');
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch (error) {
      console.error('Token verification failed', error);
      return NextResponse.redirect(new URL('/admin', request.url)); // Redirect to login if token verification fails
    }
  }

  // If the route is neither in allowedRoutes nor protectedRoutes, allow access by default
  return NextResponse.next();
}

export const config = {
  matcher: [

    '/((?!api|_next/static|_next/image|images|public|_next|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
