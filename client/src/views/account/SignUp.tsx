"use client"
import React, { lazy, useState } from "react";
import Link from 'next/link';
import { selectSignupState, signupUser } from "@/redux/slices/signupSlice";
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";

const SingUpForm = lazy(() => import("../../components/account/SignUpForm"));
interface SignupResponse {
  success: boolean;
  message:string;
  // Add other properties of the response if needed
}
const SignUpView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string>("");
  const { user, status, error } = useSelector((state: RootState) => selectSignupState(state));
  console.log(user,status,error);
  const onSubmit = async (values: any) => {
    console.log(values);

    setIsLoading("Signup precessing...");

    setTimeout(async () => {
      try {
        // Dispatch login action with email and password
        const result = await dispatch(signupUser(values));

        // First, cast result.payload to unknown to avoid TypeScript conflicts
        const payload = result.payload as unknown;
      
        // Type guard to confirm payload is of type LoginResponse
        if (typeof payload === "object" && (payload as SignupResponse).success) {
          const signupPayload = payload as SignupResponse;
          console.log(signupPayload);
          toast(signupPayload.message);
          setIsLoading(signupPayload.message);
          router.push('/account/signin');
     
        } else {
          setIsLoading("Signup failed...");
          console.error(payload || 'Signup failed');
        }
      } finally {
        setIsLoading("");
      }
    }, 1000);
  };

  return (
    <div className="container my-3">
      <div className="row border">
        <div className="col-md-6 bg-light bg-gradient p-3 d-none d-md-block">
          <Link href="/">
            <img
              src="../../images/banner/Dell.webp"
              alt="Dell"
              className="img-fluid"
            />
          </Link>
          <Link href="/">
            <img
              src="../../images/banner/Laptops.webp"
              alt="Laptops"
              className="img-fluid"
            />
          </Link>
        </div>
        <div className="col-md-6 p-3">
          <h4 className="text-center">Sign Up</h4>
          <SingUpForm onSubmit={onSubmit} status={status} uerror={error}/>
        </div>
      </div>
    </div>
  );
};

export default SignUpView;
