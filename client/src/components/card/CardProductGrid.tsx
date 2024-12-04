import Link from 'next/link';
import Image from "next/image";


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
  user: string;
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
  star?:string;
  countInStock: number;
  reviews?: any[];
  createdAt: string;
  updatedAt: string;
}



interface CardProductGridProps {
  data: Partial<Product>;
}

const CardProductGrid: React.FC<CardProductGridProps> = ({ data: product }) => {
  return (
    <div className="card">
      <Image src={require(`../../../../backend/uploads/${product?.image}`)} height={200} className="card-img-top" alt="Product image" />
      {product.status && (
        <span className="badge bg-success position-absolute mt-2 ms-2">
          New
        </span>
      )}
      {product.status && (
        <span className="badge bg-danger position-absolute r-0 mt-2 me-2">
          Hot
        </span>
      )}
      {(product.price ) && (
        <span
          className={`rounded position-absolute p-2 bg-warning ms-2 small ${
            product.price ? "mt-5" : "mt-2"
          }`}
        >
          -
          {product.price
            ? `${20}%`
            : `$${product.price}`}
        </span>
      )}
      <div className="card-body">
        <h6 className="card-subtitle mb-2">
          {product?.name?
          <Link href={product?.name} className="text-decoration-none" title={product?.name}>
          {product?.name.length > 10 ? `${product?.name.slice(0, 14)}...` : product?.name}
          </Link>
          :""}
        </h6>
        <div className="my-2">
          <span className="fw-bold h5">${product.price}</span>
          {product.price && (
            <del className="small text-muted ms-2">${product.price +200}</del>
          )}
          {/* <span className="ms-2">
            {Array.from({ length: product?.star }, (_, key) => (
              <i className="bi bi-star-fill text-warning me-1" key={key} />
            ))}
          </span> */}
        </div>
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
  );
};

export default CardProductGrid;
