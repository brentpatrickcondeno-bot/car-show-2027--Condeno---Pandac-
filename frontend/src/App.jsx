import { useState } from 'react'
import './App.css'
import RegistrationsPage from './pages/RegistrationsPage'

function App() {
  const [view, setView] = useState('registrations')

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <i className="bi bi-speedometer2" />
          </div>
          <div>
            <div className="brand-name">AutoVista</div>
            <div className="brand-subtitle">Event operations</div>
          </div>
        </div>
        <nav className="topnav" aria-label="Primary navigation">
          <button
            className={view === 'registrations' ? 'nav-item active' : 'nav-item'}
            onClick={() => setView('registrations')}
            type="button"
          >
            <i className="bi bi-grid-1x2-fill" aria-hidden="true" />
            Registration dashboard
          </button>
        </nav>
        <div className="event-pill">
          <span className="live-dot" />
          Car Show 2027
        </div>
      </header>
      {view === 'registrations' && <RegistrationsPage />}
      <footer className="app-footer">
        <span>AutoVista Events</span>
        <span>Internal registration operations</span>
      </footer>
    </div>
  )
}

export default App
