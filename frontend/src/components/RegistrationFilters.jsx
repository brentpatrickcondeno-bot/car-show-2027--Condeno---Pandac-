export default function RegistrationFilters({ filters, onChange, onClear }) {
  return (
    <section className="panel filters-panel" aria-labelledby="filters-heading">
      <h2 className="section-label" id="filters-heading">Find registrations</h2>
      <div className="filters-grid">
        <div>
          <label className="field-label" htmlFor="participant-search">Participant name</label>
          <div className="input-shell">
            <i className="bi bi-search" aria-hidden="true" />
            <input
              className="filter-input"
              id="participant-search"
              placeholder="Search participant name..."
              value={filters.participantName}
              onChange={(event) => onChange('participantName', event.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="type-filter">Registration type</label>
          <select className="filter-select" id="type-filter" value={filters.type} onChange={(event) => onChange('type', event.target.value)}>
            <option value="">All types</option>
            <option value="Exhibitor">Exhibitor</option>
            <option value="Competitor">Competitor</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="status-filter">Status</label>
          <select className="filter-select" id="status-filter" value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="CheckedIn">Checked in</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button className="clear-button" onClick={onClear} type="button">
          <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true" />
          Clear filters
        </button>
      </div>
    </section>
  )
}
