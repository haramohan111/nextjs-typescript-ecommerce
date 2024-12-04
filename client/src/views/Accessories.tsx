import React, { useEffect } from 'react'
import Link from 'next/link';
import { fetchBeautyAccessories, fetchKidsAccessories, fetchWatchesAccessories, selectAccessories } from '@/redux/slices/accessoriesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import Image from "next/image";

const Accessories: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { kids, status, error } = useSelector(selectAccessories);
  const { beauty } = useSelector(selectAccessories);
  const { watches} = useSelector(selectAccessories);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchKidsAccessories());
      dispatch(fetchBeautyAccessories());
      dispatch(fetchWatchesAccessories());
    }

  }, [status, dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <>
<div className="container-fluid bg-light mb-3">
  <div className="row justify-content-between">
    {/* Container 1 */}
    <div className="col-12 col-md-4 mb-3">
      <div className="product-container">
        <div className="container-header d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-start mb-0">Kids</h5>
          <Link href="/container1" className="arrow-icon-link">
            <span className="arrow-icon" style={{ fontSize: "1.5rem" }}>
              &#8594;
            </span>
          </Link>
        </div>
        {/* Single Row for 4 Products */}
        <div className="row row-cols-2 row-cols-md-8 g-3">
          {kids.map((item, id) => (
            <div className="col" key={id}>
              <div className="product-card text-center">
                <Link href={`/product/detail?id=${item?._id}`}>
                  <Image
                    src={require(`../../../backend/uploads/${item?.image}`)}
                    className="product-img"
                    alt={`Product ${id + 1}`}
                    height={150}
                    width={150}
                  />
                </Link>
                <div className="product-info">
                  <h6 className="product-title">{item?.name}</h6>
                  <p className="product-price">Rs. {item?.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Container 2 */}
    <div className="col-12 col-md-4 mb-3">
      <div className="product-container">
        <div className="container-header d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-start mb-0">Makeup</h5>
          <Link href="/container2" className="arrow-icon-link">
            <span className="arrow-icon" style={{ fontSize: "1.5rem" }}>
              &#8594;
            </span>
          </Link>
        </div>
        {/* Single Row for 4 Products */}
        <div className="row row-cols-2 row-cols-md-8 g-3">
        {beauty.map((item, id) => (
            <div className="col" key={id}>
              <div className="product-card text-center">
                <Link href={`/product/detail?id=${item?._id}`}>
                <Image
                    src={require(`../../../backend/uploads/${item?.image}`)}
                    className="product-img"
                    alt={`Product ${id}`}
                    height={150}
                    width={150}
                  />
                </Link>
                <div className="product-info">
                  <h6 className="product-title">{item?.name}</h6>
                  <p className="product-price">Rs. {item?.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Container 3 */}
    <div className="col-12 col-md-4 mb-3">
      <div className="product-container">
        <div className="container-header d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-start mb-0">Watch</h5>
          <Link href="/container3" className="arrow-icon-link">
            <span className="arrow-icon" style={{ fontSize: "1.5rem" }}>
              &#8594;
            </span>
          </Link>
        </div>
        {/* Single Row for 4 Products */}
        <div className="row row-cols-2 row-cols-md-8 g-3">
        {watches.map((item, id) => (
            <div className="col" key={id}>
              <div className="product-card text-center">
                <Link href={`/product/detail?id=${item?._id}`}>
                <Image
                    src={require(`../../../backend/uploads/${item?.image}`)}
                    className="product-img"
                    alt={`Product ${id}`}
                    height={150}
                    width={150}
                  />
                </Link>
                <div className="product-info">
                  <h6 className="product-title">{item?.name}</h6>
                  <p className="product-price">Rs. {item?.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>

    </>
  )
}

export default Accessories