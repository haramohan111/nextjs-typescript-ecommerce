import React, { ReactNode } from "react";
import Link from 'next/link';
import Countdown from "react-countdown";

// Random component for when countdown is complete
const Completionist: React.FC = () => <span>Deals End!</span>;

// Define renderer function with `any` type for the argument
const renderer = ({ hours, minutes, seconds, completed }: any) => {
  if (completed) {
    // If countdown is completed, render the completion message
    return <Completionist />;
  } else {
    // Render countdown time
    return (
      <span className="text-muted small">
        {hours}:{minutes}:{seconds} Left
      </span>
    );
  }
};

// Define props interface for CardDealsOfTheDay component
interface CardDealsOfTheDayProps {
  title: string;
  endDate: Date | number;
  to: string;
  children?: ReactNode;
}

const CardDealsOfTheDay: React.FC<CardDealsOfTheDayProps> = ({ title, endDate, to, children }) => {
  // Convert endDate to timestamp if it's a Date object
  const timestamp = endDate instanceof Date ? endDate.getTime() : endDate;

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title pb-3 border-bottom">
          {title} <i className="bi bi-stopwatch text-primary" />{" "}
          <Countdown date={timestamp} renderer={renderer} />
          <span className="float-end">
            <Link href={to} className="btn btn-sm btn-outline-primary">
              View All
            </Link>
          </span>
        </h5>
        {children}
      </div>
    </div>
  );
};

export default CardDealsOfTheDay;
