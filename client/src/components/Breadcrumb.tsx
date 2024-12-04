import React from "react";
import Link from 'next/link';
interface BreadcrumbProps {
  segments: string[];
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ segments }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb rounded-0">
        <li className="breadcrumb-item">
          <Link href="/" title="Home">
            Home
          </Link>
        </li>
        {/* <li className="breadcrumb-item">
          <Link href="/" title="Men">
            Men
          </Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          T-Shirts
        </li> */}
    {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join("/")}`;

          return (
            <li
              key={index}
              className={`breadcrumb-item ${
                index === segments.length - 1 ? "active" : ""
              }`}
              aria-current={index === segments.length - 1 ? "page" : undefined}
            >
              {index === segments.length - 1 ? (
                segment
              ) : (
                <Link href={path}>{segment}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
export default Breadcrumb;
