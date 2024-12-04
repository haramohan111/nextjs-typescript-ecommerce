"use client"
import { useEffect, useState } from "react";
import Link from 'next/link';
import './topmenu.css'
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopMenu, selectTopMenu } from '@/redux/slices/topMenuSlice';
import { AppDispatch } from '@/redux/store';


const TopMenu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { category, status, error } = useSelector(selectTopMenu);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTopMenu());
    }
  }, [dispatch, status]);



  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;



  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          E-Commerce
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">


            <li className="nav-item dropdown">
              <Link className="nav-link fw-bold dropdown-toggle" href="#">
                All Pages
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" href="/account/signin">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/account/signup">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </li>

            {category?.map((cat, index) => (
              <li className="nav-item dropdown" key={index}>
                <Link className="nav-link dropdown-toggle" href="#">
                  {cat.name}
                </Link>

                {/* Only render <ul> if there are subcategories */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <ul className="dropdown-menu">
                    {cat.subcategories.map((subcat, index) => (
                      <li className="dropdown-submenu" key={index}>
                        <Link className="dropdown-item dropdown-toggle" href={`/category/${cat.name.toLowerCase()}/${subcat.name.toLowerCase()}?id=${subcat._id}`}>
                          {subcat?.name}
                        </Link>

                        {/* Only render <ul> if there are lists of subcategories */}
                        {subcat.listsubcategories && subcat.listsubcategories.length > 0 && (
                          <ul className="dropdown-menu">
                            {subcat.listsubcategories.map((listsubcat, index) => (
                              <li key={index}>
                                <Link
                                  className="dropdown-item"
                                  href={`/category/${cat.name.toLowerCase()}/${subcat.name.toLowerCase()}/${listsubcat.name.toLowerCase()}?id=${listsubcat._id}`}
                                >
                                  {listsubcat.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}




          </ul>
        </div>
      </div>
    </nav>

  );
};

export default TopMenu;
