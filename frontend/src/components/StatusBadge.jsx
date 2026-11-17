const statusClass = {
  Confirmed: 'confirmed',
  CheckedIn: 'checked-in',
  Pending: 'pending',
  Cancelled: 'cancelled',
}

export function StatusBadge({ status }) {
  return <span className={`status-badge ${statusClass[status] || ''}`}><i className="bi bi-circle-fill" aria-hidden="true" />{status === 'CheckedIn' ? 'Checked in' : status}</span>
}

export function PaymentBadge({ status }) {
  return <span className={`payment-badge ${status.toLowerCase()}`}><i className="bi bi-circle-fill" aria-hidden="true" />{status}</span>
}
