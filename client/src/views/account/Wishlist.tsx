import React, { lazy } from "react";
import { data } from "../../data";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const CardProductList2 = lazy(() =>
  import("../../components/card/CardProductList2")
);

// Define the type for a product based on your actual data structure
interface Product {
  id: number;
  sku: string;
  link: string;
  name: string;
  img: string; // Assuming 'img' is the correct field name for the image
  price: number;
  originPrice: number;
  discountPrice: number;
  discountPercentage: number;
  isNew: boolean;
  isHot: boolean;
  star: number;
  isFreeShipping: boolean;
  description: string;
}

const WishlistView: React.FC = () => {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <div className="container mb-3">
      <h4 className="my-3">Wishlists</h4>
      <div className="row g-3">
        {data.products.map((product: Product, idx: number) => {
          return (
            <div key={product.id} className="col-md-6">
              <CardProductList2 data={product} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistView;
