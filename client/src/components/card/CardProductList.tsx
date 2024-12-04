import React from "react";
import Link from 'next/link';
import Image from "next/image";
// interface Product {
//   img: string;
//   isNew?: boolean;
//   isHot?: boolean;
//   star: number;
//   link: string;
//   name: string;
//   description?: string;
//   price: number;
//   originPrice?: number;
//   discountPercentage?: number;
//   discountPrice?: number;
//   isFreeShipping?: boolean;
// }

interface Category {
  _id: string;
  name: string;
  status: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface SubCategory extends Category {}

interface ListSubCategory extends Category {}

interface Product {
  _id: string;
  user?: string;
  name: string;
  image: string;
  brand?: string;
  size?: string;
  color?: string;
  seller?: string;
  category_id?: Category;
  subcategory_id?: SubCategory;
  listsubcategory_id?: ListSubCategory;
  description?: string;
  tags?: string;
  status: number;
  price: number;
  countInStock?: number;
  reviews?: any[];
  createdAt?: string;
  updatedAt?: string;
}


interface CardProductListProps {
  data: Partial<Product>;
}

const CardProductList: React.FC<CardProductListProps> = ({ data: product }) => {
  return (
    <div className="card">
      <div className="row g-0">
        <div className="col-md-3 text-center">
          <Image src={require(`../../../../backend/uploads/${product?.image}`)} className="img-fluid" alt="Product image" />
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <h6 className="card-subtitle me-2 d-inline">
              <Link href={`/product/detail?id=${product?._id}`} className="text-decoration-none">
                {product.name}
              </Link>
            </h6>
            {product.status && <span className="badge bg-success me-2">New</span>}
            {product.status && <span className="badge bg-danger me-2">Hot</span>}

            {/* <div>
              {Array.from({ length: 5 }, (_, key) =>
                key < product?.star ? (
                  <i
                    className="bi bi-star-fill text-warning me-1"
                    key={key}
                  />
                ) : (
                  <i
                    className="bi bi-star-fill text-secondary me-1"
                    key={key}
                  />
                )
              )}
            </div> */}

            {product.description && !product.description.includes("|") && (
              <p className="small mt-2">{product.description}</p>
            )}
            {product.description && product.description.includes("|") && (
              <ul className="mt-2">
                {product.description.split("|").map((desc, idx) => (
                  <li key={idx}>{desc}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-body">
            <div className="mb-2">
              <span className="fw-bold h5">${product.price}</span>
              {product.price && (
                <del className="small text-muted ms-2">${product.price}</del>
              )}
              {(product.price) && (
                <span className="rounded p-1 bg-warning ms-2 small">
                  -
                  {product.price
                    ? `${20}%`
                    : `$${product.price}`}
                </span>
              )}
            </div>

            {product.price && (
              <p className="text-success small mb-2">
                <i className="bi bi-truck" /> Free shipping
              </p>
            )}

            <div className="btn-group d-flex" role="group">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                title="Add to cart"
              >
                <i className="bi bi-cart-plus" />
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                title="Add to wishlist"
              >
                <i className="bi bi-heart-fill" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProductList;
