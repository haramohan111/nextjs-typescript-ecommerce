"use client"
import Link from 'next/link';
import Search from "./Search";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { selectAuthState, userLogout, userVerifyID } from '@/redux/slices/loginSlice';

const Header: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, status, error } = useSelector(selectAuthState);
  const [userId, setUserId] = useState<boolean | null>(false);

  const handleLogout = () => {
    // Redirect to the login or home page
    router.push('/account/signin'); // Redirect to the login page

    // Clear the authentication token (example with cookies)
    deleteCookie('ucid', { path: '/' });  // Clear 'uid' cookie (adjust if you use a different name)
    localStorage.removeItem('url')
    // Optionally, clear additional application state (Redux, context, etc.)
    console.log('User logged out');
    dispatch(userLogout())

  };



  useEffect(() => {

    dispatch(userVerifyID());

  }, []);
  useEffect(() => {
    // Dynamically import Bootstrap's JS to enable dropdown functionality
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <header className="p-3 border-bottom bg-light">
      <div className="container-fluid">
        <div className="row g-3">
          <div className="col-md-3 text-center">
            <Link href="/">
              <Image alt="logo" src={require('../../public/images/logo.webp')} height={0} width={150} />
            </Link>
          </div>
          <div className="col-md-5">
            <Search />
          </div>
          <div className="col-md-4">
            <div className="position-relative d-inline me-3">
              <Link href="/cart" className="btn btn-primary">
                <i className="bi bi-cart3"></i>
                <div className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-circle">
                  2
                </div>
              </Link>
            </div>
            {user?.success ?
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-secondary rounded-circle border me-3"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  aria-label="Profile"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-fill text-light"></i>
                </button>
                <ul className="dropdown-menu ">
                  <li>
                    <Link className="dropdown-item text-dark" href="/account/profile">
                      <i className="bi bi-person-square"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item text-dark" href="/star/zone">
                      <i className="bi bi-star-fill text-warning"></i> Star Zone
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item text-dark" href="/account/orders">
                      <i className="bi bi-list-check text-primary"></i> Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item text-dark" href="/account/wishlist">
                      <i className="bi bi-heart-fill text-danger"></i> Wishlist
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider " />
                  </li>
                  <li>
                    <Link className="dropdown-item text-dark" href="/account/notification">
                      <i className="bi bi-bell-fill text-primary"></i>
                      Notification
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item text-dark" href="/support">
                      <i className="bi bi-info-circle-fill text-success"></i>
                      Support
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item text-dark" onClick={handleLogout} >
                      <i className="bi bi-door-closed-fill text-danger" ></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
              : <Link href="/account/signin">Sign In</Link>
            }
            {/* <Link href="/account/signin">Sign In</Link> |{" "}
              <Link href="/account/signup"> Sign Up</Link> */}
          </div>
        </div>
      </div>
      <style jsx>{`
        header .dropdown-menu {
          background-color: white !important;
          border: 1px solid #ddd;
        }
        header .dropdown-item {
          color: black !important;
          font-size: 16px;
          transition: all 0.3s ease-in-out;
        }
        header .dropdown-item:hover {
          background-color: #007bff !important;
          color: white !important;
          text-decoration: none;
        }
      `}</style>
    </header>
  );
};
export default Header;
