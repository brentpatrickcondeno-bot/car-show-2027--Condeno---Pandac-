export default function Pagination({ page, totalPages, totalCount, pageSize, loading, onPageChange, onPageSizeChange }) {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalCount)
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="pagination-bar">
      <span className="showing-text">Showing {start}–{end} of {totalCount}</span>
      <div className="pagination" aria-label="Pagination">
        <button className="page-button" disabled={loading || page === 1} onClick={() => onPageChange(page - 1)} type="button">
          <i className="bi bi-chevron-left" aria-hidden="true" />
        </button>
        {pages.map((pageNumber) => (
          <button className={`page-button ${pageNumber === page ? 'active' : ''}`} disabled={loading} key={pageNumber} onClick={() => onPageChange(pageNumber)} type="button">
            {pageNumber}
          </button>
        ))}
        <button className="page-button" disabled={loading || page === totalPages} onClick={() => onPageChange(page + 1)} type="button">
          <i className="bi bi-chevron-right" aria-hidden="true" />
        </button>
        <label className="page-size-control ms-2">
          <span>Rows</span>
          <select disabled={loading} value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>
      </div>
    </div>
  )
}
