import React from "react";
import Link from 'next/link';

interface CardLoginProps {
  className?: string;
}

const CardLogin: React.FC<CardLoginProps> = ({ className }) => {
  return (
    <div className={`card shadow-sm ${className || ""}`}>
      <div className="card-body text-center">
        <h5 className="card-title">Sign in for your best experience</h5>
        <Link href="account/signin" className="btn btn-warning">
          Sign in securely
        </Link>
      </div>
    </div>
  );
};

export default CardLogin;
