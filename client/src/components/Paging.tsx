"use client";
import React, { useState, useEffect } from "react";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from: number, to: number, step: number = 1): number[] => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

interface PagingProps {
  totalRecords: number;
  pageLimit?: number;
  pageNeighbours?: number;
  onPageChanged?: (paginationData: PaginationData) => void;
  sizing?: string;
  alignment?: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  pageLimit: number;
  totalRecords: number;
}

const Paging: React.FC<PagingProps> = ({
  totalRecords,
  pageLimit = 30,
  pageNeighbours = 0,
  onPageChanged,
  sizing = "",
  alignment = "",
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(totalRecords / pageLimit);

  useEffect(() => {
    gotoPage(1);
  }, []);

  const gotoPage = (page: number) => {
    const currentPage = Math.max(0, Math.min(page, totalPages));

    const paginationData: PaginationData = {
      currentPage,
      totalPages,
      pageLimit,
      totalRecords,
    };

    setCurrentPage(currentPage);
    if (onPageChanged) onPageChanged(paginationData);
  };

  const handleClick = (page: number, evt: React.MouseEvent) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = (evt: React.MouseEvent) => {
    evt.preventDefault();
    gotoPage(currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = (evt: React.MouseEvent) => {
    evt.preventDefault();
    gotoPage(currentPage + pageNeighbours * 2 + 1);
  };

  const fetchPageNumbers = (): (number | string)[] => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages: (number | string)[] = [];
      const leftBound = currentPage - pageNeighbours;
      const rightBound = currentPage + pageNeighbours;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [LEFT_PAGE, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, RIGHT_PAGE];
      } else if (leftSpill && rightSpill) {
        pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  if (!totalRecords || totalPages === 1) return null;

  const pages = fetchPageNumbers();

  return (
    <nav aria-label="Page navigation">
      <ul className={`pagination ${sizing} ${alignment}`}>
        {pages.map((page, index) => {
          if (page === LEFT_PAGE) {
            return (
              <li key={index} className="page-item">
                <button
                  className="page-link"
                  aria-label="Previous"
                  onClick={handleMoveLeft}
                >
                  <span aria-hidden="true">&laquo;</span>
                  <span className="sr-only">Previous</span>
                </button>
              </li>
            );
          }

          if (page === RIGHT_PAGE) {
            return (
              <li key={index} className="page-item">
                <a
                  className="page-link"
                  href="#!"
                  aria-label="Next"
                  onClick={handleMoveRight}
                >
                  <span aria-hidden="true">&raquo;</span>
                  <span className="sr-only">Next</span>
                </a>
              </li>
            );
          }

          return (
            <li
              key={index}
              className={`page-item${currentPage === page ? " active" : ""}`}
            >
              <a
                className="page-link"
                href="#!"
                onClick={(e) => handleClick(page as number, e)}
              >
                {page}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Paging;
