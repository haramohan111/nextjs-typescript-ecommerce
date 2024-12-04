import React, { ReactNode } from "react";
import Link from 'next/link';

interface CardIconProps {
  to: string;
  title: string;
  text: string;
  tips?: string;
  children?: ReactNode;
}

const CardIcon: React.FC<CardIconProps> = ({ to, title, text, tips, children }) => {
  return (
    <Link href={to} className="text-decoration-none">
      <div className="card text-center">
        <div className="card-body">
          {children}
          <h6 className="card-title text-capitalize">{title}</h6>
          <div className="card-text text-success">{text}</div>
          {tips && <small className="text-muted">{tips}</small>}
        </div>
      </div>
    </Link>
  );
};

export default CardIcon;
