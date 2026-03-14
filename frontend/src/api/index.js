import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Event Types ───────────────────────────────────────────────────────────────
export const getEventTypes = () => api.get('/api/event-types/').then(r => r.data)
export const createEventType = (data) => api.post('/api/event-types/', data).then(r => r.data)
export const updateEventType = (id, data) => api.put(`/api/event-types/${id}`, data).then(r => r.data)
export const deleteEventType = (id) => api.delete(`/api/event-types/${id}`)

// ── Availability ──────────────────────────────────────────────────────────────
export const getAvailability = () => api.get('/api/availability/').then(r => r.data)
export const updateAvailabilityBulk = (data) => api.put('/api/availability/bulk', data).then(r => r.data)
export const updateAvailabilityItem = (id, data) => api.put(`/api/availability/${id}`, data).then(r => r.data)

// ── Public Booking ─────────────────────────────────────────────────────────────
export const getPublicEvent = (slug) => api.get(`/api/public/${slug}`).then(r => r.data)
export const getAvailableSlots = (slug, date) =>
  api.get(`/api/public/${slug}/slots`, { params: { date } }).then(r => r.data)
export const createBooking = (slug, data) =>
  api.post(`/api/public/${slug}/book`, data).then(r => r.data)

// ── Meetings ───────────────────────────────────────────────────────────────────
export const getMeetings = (type = 'upcoming') =>
  api.get('/api/meetings/', { params: { type } }).then(r => r.data)
export const cancelMeeting = (id) => api.put(`/api/meetings/${id}/cancel`).then(r => r.data)

export default api
