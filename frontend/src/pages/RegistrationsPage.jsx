import { useCallback, useEffect, useRef, useState } from 'react'
import { getRegistrations, getSummary } from '../api/registrationsApi'
import KpiCards from '../components/KpiCards'
import Pagination from '../components/Pagination'
import RegistrationFilters from '../components/RegistrationFilters'
import RegistrationTable from '../components/RegistrationTable'
import { useDebounce } from '../hooks/useDebounce'

const emptyFilters = { participantName: '', type: '', status: '' }

function ErrorState({ onRetry }) {
  return (
    <div className="state-panel" role="alert">
      <div>
        <div className="state-icon error"><i className="bi bi-cloud-slash" aria-hidden="true" /></div>
        <p className="state-title">Cannot reach the API</p>
        <p className="state-description">The registration service did not respond. Check the API and try the request again.</p>
        <button className="action-button" onClick={onRetry} type="button"><i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />Try again</button>
      </div>
    </div>
  )
}

function EmptyState({ onClear }) {
  return (
    <div className="state-panel">
      <div>
        <div className="state-icon"><i className="bi bi-search" aria-hidden="true" /></div>
        <p className="state-title">No registrations match your filters</p>
        <p className="state-description">Try a different participant name, registration type, or status.</p>
        <button className="action-button" onClick={onClear} type="button">Clear filters</button>
      </div>
    </div>
  )
}

export default function RegistrationsPage() {
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [result, setResult] = useState({ items: [], totalCount: 0, totalPages: 1 })
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const debouncedName = useDebounce(filters.participantName)
  const cancelledRef = useRef(false)

  const loadData = useCallback(async () => {
    cancelledRef.current = false
    setLoading(true)
    setError(null)
    try {
      const [registrationResult, summaryResult] = await Promise.all([
        getRegistrations({ ...filters, participantName: debouncedName, page, pageSize }),
        getSummary(),
      ])
      if (cancelledRef.current) return
      setResult(registrationResult)
      setSummary(summaryResult)
    } catch (requestError) {
      if (cancelledRef.current) return
      setError(requestError)
      setSummary(null)
    } finally {
      if (cancelledRef.current) return
      setLoading(false)
    }
  }, [debouncedName, filters, page, pageSize, retryCount])

  useEffect(() => {
    cancelledRef.current = false
    loadData()
    return () => { cancelledRef.current = true }
  }, [loadData])

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
    setPage(1)
  }

  function clearFilters() {
    setFilters(emptyFilters)
    setPage(1)
  }

  function handlePageSizeChange(value) {
    setPageSize(value)
    setPage(1)
  }

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Car Show 2027 · Sorsogon City Coliseum</p>
          <h1>Registration dashboard</h1>
          <p className="page-description">A clear view of participants, vehicle entries, confirmation status, and payments for event staff.</p>
        </div>
        <div className="data-source"><i className="bi bi-database-check" aria-hidden="true" /> Live API</div>
      </div>
      <KpiCards summary={summary} />
      <RegistrationFilters filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
      <section className="panel table-panel" aria-labelledby="registration-list-heading">
        <div className="table-toolbar">
          <div>
            <h2 className="table-title" id="registration-list-heading">All registrations</h2>
            <p className="table-subtitle">Review entries and payment status before the event.</p>
          </div>
        </div>
        {error ? <ErrorState onRetry={() => setRetryCount(c => c + 1)} /> : result.totalCount === 0 && !loading ? <EmptyState onClear={clearFilters} /> : <RegistrationTable loading={loading} registrations={result.items} />}
        {!error && result.totalCount > 0 && (
          <Pagination
            loading={loading}
            page={result.page || page}
            pageSize={pageSize}
            totalCount={result.totalCount}
            totalPages={result.totalPages}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </section>
    </main>
  )
}
