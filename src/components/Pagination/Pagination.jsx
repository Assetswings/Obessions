import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange, totalitems }) => {
  if (totalPages <= 1) return null;

  const pageSize = totalitems || 0;  // count of current items
  const totalItems = totalPages * pageSize; // approximate total (if consistent)

  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  const pages = [];
  const maxVisible = 5; // number of visible pages in middle

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  // Push page numbers
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Page navigation example">
      <p className="pagination-count">
        {`Showing ${rangeStart} – ${rangeEnd} of ${totalItems}`}
      </p>
      <ul className="pagination custom-pagination">
        {/* Previous */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
            &lsaquo;
          </button>
        </li>

        {/* First page */}
        {start > 1 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(1)}>
                1
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          </>
        )}

        {/* Visible pages */}
        {pages.map((page) => (
          <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        {/* Last page */}
        {end < totalPages && (
          <>
            <li className="page-item disabled">
              <span className="page-link">...</span>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </button>
            </li>
          </>
        )}

        {/* Next */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
            &rsaquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
