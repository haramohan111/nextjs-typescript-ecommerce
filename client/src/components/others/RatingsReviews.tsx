import React from "react";

interface RatingsReviewsProps {
  rating: number;
  reviewDate: string;
  reviewText: string;
  helpfulCount: number;
  notHelpfulCount: number;
}

const RatingsReviews: React.FC<RatingsReviewsProps> = ({
  rating,
  reviewDate,
  reviewText,
  helpfulCount,
  notHelpfulCount,
}) => {
  // Generate star icons based on the rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <i
      key={index}
      className={`bi bi-star-fill ${
        index < rating ? "text-warning" : "text-secondary"
      } me-1`}
    />
  ));

  return (
    <div className="border-bottom mb-3">
      <div className="mb-2">
        <span>{stars}</span>
        <span className="text-muted">
          <i className="bi bi-patch-check-fill text-success me-1" />
          Certified Buyer | Reviewed on <i className="fw-bold">{reviewDate}</i>
        </span>
      </div>
      <p>{reviewText}</p>
      <div className="mb-2">
        <button className="btn btn-sm btn-outline-success me-2">
          <i className="bi bi-hand-thumbs-up-fill"></i> {helpfulCount}
        </button>
        <button className="btn btn-sm btn-outline-danger me-2">
          <i className="bi bi-hand-thumbs-down-fill"></i> {notHelpfulCount}
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary">
          Report abuse
        </button>
      </div>
    </div>
  );
};

export default RatingsReviews;
