const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5205'

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`The API returned HTTP ${response.status}.`)
  }
  return response.json()
}

export function getRegistrations({ participantName = '', type = '', status = '', page = 1, pageSize = 10 } = {}) {
  const query = new URLSearchParams({
    participantName,
    type,
    status,
    page: String(page),
    pageSize: String(pageSize),
  })
  return request(`/api/registrations?${query.toString()}`)
}

export function getSummary() {
  return request('/api/registrations/summary')
}
