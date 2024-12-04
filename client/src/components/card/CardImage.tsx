import React from "react";
import Link from 'next/link';

interface CardImageProps {
  to: string;
  src: string;
  className?: string;
}

const CardImage: React.FC<CardImageProps> = ({ to, src, className }) => {
  return (
    <Link href={to}>
      <div className={`card shadow-sm ${className || ""}`}>
        <div className="card-body p-0">
          <img src={src} className="img-fluid rounded" alt="Card image" />
        </div>
      </div>
    </Link>
  );
};

export default CardImage;
