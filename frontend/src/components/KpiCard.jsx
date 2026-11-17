export default function KpiCard({ label, value, icon, tone }) {
  return (
    <article className={`kpi-card ${tone}`}>
      <div className="kpi-icon"><i className={`bi ${icon}`} aria-hidden="true" /></div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
    </article>
  )
}
