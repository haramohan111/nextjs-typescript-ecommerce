import React, { lazy } from "react";
import Link from 'next/link';
const Line = lazy(() => import("../others/Line"));

const Tags = (props) => {
  return (
    <div className={`mb-4 px-4 ${props.className ? props.className : ""}`}>
      <h4 className="fst-italic">{props.title}</h4>
      <Line className="mb-2" />
      <Link href="/" className="btn btn-sm btn-outline-info me-2 mb-2">
        Summer
      </Link>
      <Link href="/" className="btn btn-sm btn-outline-secondary me-2 mb-2">
        Clothing
      </Link>
      <Link href="/" className="btn btn-sm btn-outline-success me-2 mb-2">
        Woman
      </Link>
      <Link href="/" className="btn btn-sm btn-outline-danger me-2 mb-2">
        Hot Trend
      </Link>
      <Link href="/" className="btn btn-sm btn-outline-dark me-2 mb-2">
        Jacket
      </Link>
      <Link href="/" className="btn btn-sm btn-outline-primary me-2 mb-2">
        Men
      </Link>
      <Link href="/" className="btn btn-sm btn-outline-warning me-2 mb-2">
        Luxyry
      </Link>
    </div>
  );
};
export default Tags;
