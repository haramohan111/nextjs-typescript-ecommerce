'use client';
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import SignInForm from "@/components/account/SignInForm";

import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectAuthState } from "@/redux/slices/loginSlice";
import { toast } from "react-toastify";

interface SigninResponse {
  success: boolean;
}

const SignInViewModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string>("");
  const { user, status, error } = useSelector((state: RootState) => selectAuthState(state));

  const onSubmit = async (values: any) => {
    setIsLoading("Login processing...");

    setTimeout(async () => {
      try {
        const result = await dispatch(loginUser(values));
        const payload = result.payload as unknown;

        if (typeof payload === "object" && (payload as SigninResponse).success) {
          toast("Login Successfully");
          setIsLoading("Login Successfully");

          if (typeof window !== 'undefined') {
            const url = localStorage.getItem('url');
            if (url === 'cart') {
              router.push('/checkout');
            } else {
              router.push('/');
            }
          }
          onClose(); // Close the modal on success
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
      {show && (
        <div className="modal fade show" style={{ display: "block", zIndex: 1050 }} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ zIndex: 1060 }}>
              <div className="modal-header">
                <h5 className="modal-title">Sign In</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                <SignInForm onSubmit={onSubmit} status={status} uerror={error} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={onClose}></div>
        </div>
      )}
    </>
  );
};

export default SignInViewModal;
