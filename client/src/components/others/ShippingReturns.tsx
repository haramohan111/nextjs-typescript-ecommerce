import React from "react";

const ShippingReturns: React.FC = () => {
  return (
    <React.Fragment>
      <p>Your order of $100 or more gets free standard delivery.</p>
      <ul>
        <li>Standard delivery: 4-5 Business Days</li>
        <li>Express delivery: 2-4 Business Days</li>
      </ul>
      <p>
        Orders are processed and delivered Monday-Friday (excluding public
        holidays).
      </p>
      <p>
        No Returns/Replacements Allowed - Returns or replacements are not
        accepted by the seller for this product. Cancellation is allowed.
      </p>
    </React.Fragment>
  );
};

export default ShippingReturns;
