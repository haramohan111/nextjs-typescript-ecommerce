import Link from 'next/link';
import Image from "next/image";
// Define product type
interface Product{
  image: string;
  link?: string;
  name: string;
  star?: number;
  price: number;
  originPrice?: number;
}

interface ProductState {
  product:Product

}

// Define props interface for the component
interface CardFeaturedProductProps {
  data: ProductState[];
}

const CardFeaturedProduct: React.FC<CardFeaturedProductProps> = ({ data }) => {

  return (
    <div className="card mb-3">
      <div className="card-header fw-bold text-uppercase">Featured Products</div>
      <div className="card-body">
        {data.map((item, idx) => (
          <div
            className={`row ${idx + 1 === data.length ? "" : "mb-3"}`}
            key={idx}
          >
            <div className="col-md-4">
              <Image src={require(`../../../../backend/uploads/${item.product.image}`)} className="img-fluid" alt={item.product.name} />
            </div>
            <div className="col-md-8">
              <h6 className="text-capitalize mb-1">
                <Link href={"product.link"} className="text-decoration-none">
                  {item.product.name}
                </Link>
              </h6>
              <div className="mb-2">
                {Array.from({ length:5 }, (_, key) => (
                  <i className="bi bi-star-fill text-warning me-1" key={key} />
                ))}
              </div>
              <span className="fw-bold h5">Rs.{item.product.price}</span>
              {/* {item.originPrice > 0 && (
                <del className="small text-muted ms-2">${item.originPrice}</del>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardFeaturedProduct;
