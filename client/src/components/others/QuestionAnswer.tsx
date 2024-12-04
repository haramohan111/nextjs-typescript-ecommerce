import React from "react";

interface QuestionAnswerProps {
  question: string;
  answer: string;
  author: string;
  date: string;
}

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({ question, answer, author, date }) => {
  return (
    <div className="border-bottom mb-3">
      <dt>Q: {question}</dt>
      <dd>
        <p>
          <strong>A:</strong> {answer}
        </p>
        <div className="text-muted mb-2">By {author} on {date}</div>
        <div className="mb-2">
          <i>Was this answer helpful?</i>
          <button className="btn btn-sm btn-outline-success me-2 ms-2">
            <i className="bi bi-hand-thumbs-up-fill"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger me-2">
            <i className="bi bi-hand-thumbs-down-fill"></i>
          </button>
        </div>
      </dd>
    </div>
  );
};

export default QuestionAnswer;
