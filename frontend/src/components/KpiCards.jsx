import KpiCard from './KpiCard'

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })

export default function KpiCards({ summary }) {
  const cards = [
    { label: 'Total registrations', value: summary ? summary.totalRegistrations : '—', icon: 'bi-people', tone: 'teal' },
    { label: 'Total payments collected', value: summary ? peso.format(summary.totalPayments) : '—', icon: 'bi-wallet2', tone: 'blue' },
    { label: 'Uncollected payments', value: summary ? peso.format(summary.uncollectedPayments) : '—', icon: 'bi-arrow-down-right-circle', tone: 'amber' },
    { label: 'Confirmed', value: summary ? summary.confirmed : '—', icon: 'bi-check2-circle', tone: 'purple' },
    { label: 'Checked in', value: summary ? summary.checkedIn : '—', icon: 'bi-door-open', tone: 'coral' },
  ]
  return (
    <section aria-labelledby="overview-heading">
      <h2 className="section-label" id="overview-heading">Event overview</h2>
      <div className="kpi-grid">
        {cards.map((card) => <KpiCard key={card.label} {...card} />)}
      </div>
    </section>
  )
}
