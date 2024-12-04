"use client"

//import HomeView from '@/views/Home';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { userVerifyID } from '@/redux/slices/loginSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

const HomeView = dynamic(() => import('@/views/Home'));
// Type for HomePage props
type HomePageProps = {
  children?: React.ReactNode; // This should be optional if not used
};

const HomePage: React.FC<HomePageProps> = ({ children }) => {



// useEffect(() => {
//   // Fetch user ID from middleware's custom header
//   const userIdFromHeader = document.cookie
//     .split('; ')
//     .find((row) => row.startsWith('x-user-id='))
//     ?.split('=')[1];
//     console.log("login")
//     console.log(document.cookie)
//   if (userIdFromHeader) {
//     setUserId(userIdFromHeader);
//   }
// }, []);

  return (
    <>
      <HomeView />
    </>
  );
}

export default HomePage;
