"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { adminLogin } from "@/redux/slices/userSlice";
import { AppDispatch } from "@/redux/store";
import { useRouter } from 'next/navigation';

interface LoginResponse {
  success: boolean;
  // Add other properties of the response if needed
}

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [email, setEmail] = useState<string>("admin@gmail.com");
  const [password, setPassword] = useState<string>("123123");
  const [isLoading, setIsLoading] = useState<string>("");

  const onUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("Login precessing...");

    setTimeout(async () => {
      try {
        // Dispatch login action with email and password
        const result = await dispatch(adminLogin({ email, password }));

        // First, cast result.payload to unknown to avoid TypeScript conflicts
        const payload = result.payload as unknown;
      
        // Type guard to confirm payload is of type LoginResponse
        if (typeof payload === "object" && (payload as LoginResponse).success) {
          // Navigate to dashboard if login is successful
          setIsLoading("Login Successfully");
          router.push('/dashboard');
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Link href="/" className="inline-block mb-5">
              <Image
                src={"/images/logo/logo.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
            </Link>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Sign In to TailAdmin
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to your account
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={onUserSubmit}>
            <p style={{ color: "green" }}>{isLoading}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
