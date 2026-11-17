import { PaymentBadge, StatusBadge } from './StatusBadge'

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
const dateFormatter = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' })

export default function RegistrationTable({ registrations, loading }) {
  if (loading) {
    return (
      <div className="state-panel" role="status">
        <div>
          <div className="state-icon"><i className="bi bi-arrow-repeat" aria-hidden="true" /></div>
          <p className="state-title">Loading registrations...</p>
          <p className="state-description">Fetching the latest registration list for this view.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table className="registration-table">
        <thead>
          <tr>
            <th>Registration</th>
            <th>Participant</th>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Status</th>
            <th className="text-end">Fee / paid</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration) => (
            <tr key={registration.id}>
              <td>
                <span className="registration-number">{registration.registrationNumber}</span>
                <span className="muted-line">{dateFormatter.format(new Date(registration.registrationDate))}</span>
              </td>
              <td>
                <span className="participant-name">{registration.participantName}</span>
                <span className="muted-line">{registration.contactNumber} · {registration.email}</span>
              </td>
              <td>
                <span className="car-name">{registration.carMakeModel}</span>
                <span className="plate-number">{registration.plateNumber}</span>
              </td>
              <td><span className="type-badge">{registration.registrationType}</span></td>
              <td><StatusBadge status={registration.status} /></td>
              <td className="amount-cell">
                {peso.format(registration.registrationFee)}
                <span className="muted-line">Paid {peso.format(registration.amountPaid)}</span>
              </td>
              <td><PaymentBadge status={registration.paymentStatus} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
