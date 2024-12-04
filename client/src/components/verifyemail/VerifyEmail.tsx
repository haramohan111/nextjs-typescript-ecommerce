"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { verifyEmail } from '@/redux/slices/verificationSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useSearchParams } from "next/navigation";

const VerifyEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token: string | null = searchParams.get("token");

  const { status, message } = useSelector((state: RootState) => state.verification);

  const [countdown, setCountdown] = useState(5);  // 5-second countdown state

  useEffect(() => {
    if (token) {
      // Dispatch the email verification action with the token
      dispatch(verifyEmail(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (status === 'succeeded' && countdown > 0) {
      // Start the countdown timer
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(timer);  // Clear the timer when countdown reaches 0
            router.push('/account/signin');  // Redirect after 5 seconds
          }
          return prevCountdown - 1;
        });
      }, 1000);  // Update countdown every second
    }

    return () => clearInterval(timer); // Cleanup timer on component unmount or when status changes
  }, [status, countdown, router]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <p>Verifying...</p>;
      case 'succeeded':
        return (
          <div>
            <p>{message}</p>
            <p>Redirecting in {countdown} seconds...</p>
          </div>
        );
      case 'failed':
        return <p>{message}</p>;
      default:
        return <p>Loading...</p>;
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Email Verification</h2>
      {renderContent()}
    </div>
  );
};

export default VerifyEmail;
