'use client'
import React, { useEffect, useState} from "react";
import Link from 'next/link';
// import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import SignInForm from "../../components/account/SignInForm";


import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectAuthState } from "@/redux/slices/loginSlice";
import { toast } from "react-toastify";

interface SigninResponse {
  success: boolean;
  // Add other properties of the response if needed
}

const SignInView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string>("");
  // const { data: session } = useSession();
 

  // // If the user is already logged in, redirect them to the home page
  // if (session) {
  //   router.push('/');
  // }
  const { user, status, error } = useSelector((state: RootState) => selectAuthState(state));
  const onSubmit = async (values:any) => {
   //alert(JSON.stringify(values));


  setIsLoading("Login precessing...");

  setTimeout(async () => {
    try {
      // Dispatch login action with email and password
      const result = await dispatch(loginUser(values));

      // First, cast result.payload to unknown to avoid TypeScript conflicts
      const payload = result.payload as unknown;
    
      // Type guard to confirm payload is of type LoginResponse
      if (typeof payload === "object" && (payload as SigninResponse).success) {

        toast("Login Successfully");
        setIsLoading("Login Successfully");

if (typeof window !== 'undefined') {
  const url = localStorage.getItem('url');
  if (url === 'cart') {
    console.log('hi');
    router.push('/checkout');
  } else {
    router.push('/');
  }
}
       
   
      } else {
        setIsLoading("Login failed...");
        console.error(payload || 'Login failed');
      }
    } finally {
      setIsLoading("");
    }
  }, 1000);
  };

 
    return (
      <>
   
      <div className="container my-3">
        <div className="row border">
          <div className="col-md-6 bg-light bg-gradient p-3 d-none d-md-block">
            <Link href="/">
              <img
                src="../../images/banner/Dell.webp"
                alt="..."
                className="img-fluid"
              />
            </Link>
            <Link href="/">
              <img
                src="../../images/banner/Laptops.webp"
                alt="..."
                className="img-fluid"
              />
            </Link>
          </div>
          <div className="col-md-6 p-3">
            <h4 className="text-center">Sign In</h4>
            <SignInForm onSubmit={onSubmit} status={status} uerror={error} />
          </div>
        </div>
      </div>
      </>
    );
  
}

export default SignInView;
